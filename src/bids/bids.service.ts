import { BadRequestException, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { Auction } from 'src/auctions/entities/auction.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { EventEmitter2 } from '@nestjs/event-emitter'; // for broadcasting events
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class BidsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Bid) private readonly bidRepo: Repository<Bid>,
    @InjectRepository(Auction) private readonly auctionRepo: Repository<Auction>,
    private eventEmitter: EventEmitter2, // Event emitter for SSE
  ) {}

    async submit_bid(createBidDto: CreateBidDto): Promise<string> {
    let auction = await this.GetAuction(createBidDto);

        // Check if the reserve price is met and return an appropriate message
    if (createBidDto.maxAutoBidAmount < auction.reservePrice) {
       throw new BadRequestException(`The reserve price has not been met for ${auction.auctionName}`);
    } 

    // Find the highest current bid for the auction
    const currentHighestBid = await this.GetHighestBidFromRedis(createBidDto.auctionId);
console.log(currentHighestBid.auctionItem)
    let bidAmount = 0;
    let sameBidder=false;

if (!currentHighestBid) {
  // This is the first bid for the auction
  bidAmount = createBidDto.maxAutoBidAmount;
} else {
  // Check if the new bid comes from the same bidder as the highest current bid
  sameBidder = currentHighestBid.bidderName === createBidDto.bidderName;

  if (Number(currentHighestBid.maxAutoBidAmount) + 1 < createBidDto.maxAutoBidAmount) {
    // If the new bid is higher, update bidAmount +1
    bidAmount = sameBidder ? createBidDto.maxAutoBidAmount : Number(currentHighestBid.maxAutoBidAmount) + 1;
  }
}


    // Create and save the new bid
    const newBid =  await this.bidRepo.create({
        auctionItem: auction,
        bidderName: createBidDto.bidderName,
        maxAutoBidAmount: createBidDto.maxAutoBidAmount
    });
    await this.bidRepo.save(newBid)

    if(!sameBidder && bidAmount > 0)
    {
    auction.bidderName=createBidDto.bidderName;
    auction.currentBid=bidAmount;

      await this.auctionRepo.save(auction)
      this.cacheManager.del(`highestbid_${auction.id}`)
      this.cacheManager.del(`auction_${auction.id}`)

        // **We should use Redis PubSub for broadcasting for multi instance apps
        // Emit an event for bids exceeding the reserve price,
        // informing previous highest bidders they've been outbid.
        console.log(currentHighestBid?.bidderName)
        this.publishToRedisChannel(currentHighestBid?.bidderName, `${currentHighestBid?.bidderName}: You have been outbid for auction:${auction.auctionName}!`);
    }

return "Bid request processed!";
  }

  private async GetAuction(createBidDto: CreateBidDto) {
    const cacheKey = `auction_${createBidDto.auctionId}`;
    let auction = await this.cacheManager.get<Auction>(cacheKey);
    if (!auction) {
      // If not in cache, fetch from the database
      auction = await this.auctionRepo.findOneBy({ id: createBidDto.auctionId });
      if (!auction) {
        throw new BadRequestException('Auction item not found.');
      }
      // Store the fetched auction in cache for next time
      await this.cacheManager.set(cacheKey, auction);
    }
    return auction;
  }

   private async GetHighestBidFromRedis(auctionId:number) {

    // we should use dedicated REDIS cache here, I am just using cache manager for simplicity/cost
    // ----------------------------------------------------------------------------------------------
    const cacheKey = `highestbid_${auctionId}`;
  
    let bid = await this.cacheManager.get<Bid>(cacheKey);
    if (!bid) {
  
      // If not in cache, fetch from the database
    bid = await this.bidRepo.findOne({
        where: { auctionItem: { id: auctionId } },
        order: { maxAutoBidAmount: 'DESC' }
    });
      if (!bid) {
      return null;
      }
      // Store the fetched bid in cache for next time
  
      await this.cacheManager.set(cacheKey, bid);
    }
    return bid;
  }
// imagine this is redis
   publishToRedisChannel(user_Id: string, message: string) {
    // Emit the 'message.sent' event with the message as payload
    if(!user_Id || !message)
    return;
   console.log("userid:"+user_Id)
     console.log("message:"+message)
    this.eventEmitter.emit('message.outbid', {user_Id, message});
   
  }

  
}

