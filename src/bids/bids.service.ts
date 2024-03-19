import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { Auction } from 'src/auctions/entities/auction.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { EventEmitter2 } from '@nestjs/event-emitter'; // for broadcasting events

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private readonly bidRepo: Repository<Bid>,
    @InjectRepository(Auction) private readonly auctionRepo: Repository<Auction>,
    private eventEmitter: EventEmitter2, // Event emitter for SSE
  ) {}

    async submit_bid(createBidDto: CreateBidDto): Promise<string> {
    const auction = await this.auctionRepo.findOneBy({ id: createBidDto.auctionId });
    if (!auction) {
        throw new BadRequestException('Auction item not found.');
    }

        // Check if the reserve price is met and return an appropriate message
    if (createBidDto.maxAutoBidAmount < auction.reservePrice) {
        return `The reserve price has not been met for ${auction.auctionName}`;
    } 

    // Find the highest current bid for the auction
    const currentHighestBid = await this.bidRepo.findOne({
        where: { auctionItem: { id: createBidDto.auctionId } },
        order: { maxAutoBidAmount: 'DESC' }
    });

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
    const newBid = await this.bidRepo.create({
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
        // Optionally, emit an event for bids exceeding the reserve price, informing previous highest bidders they've been outbid.
        this.sendMessage(`${currentHighestBid?.bidderName}: You have been outbid for auction:${auction.auctionName}!`);
    }

return "Bid request processed!";
  }
   sendMessage(message: string) {
    // Emit the 'message.sent' event with the message as payload
    this.eventEmitter.emit('message.sent', message);
    console.log(message)
  }
}

