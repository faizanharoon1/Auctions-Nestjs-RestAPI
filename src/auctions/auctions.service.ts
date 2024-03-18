import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from 'src/auctions/entities/auction.entity';
import { DatabaseService } from 'src/database/database.service';
import { AuctionDto, AuctionItemDTO, CreateAuctionDto } from './dto/create-auction-dto';
import { AuctionitemsService } from 'src/auctionitems/auctionitems.service';

@Injectable()
export class AuctionsService extends DatabaseService<Auction> {
  constructor(
    @InjectRepository(Auction) private readonly auctionRepository: Repository<Auction>,
    private readonly auctionitemsService:AuctionitemsService
  ) {
    // Pass the repository to the superclass constructor
    super(auctionRepository);
  }
   async createAuction(createDto: CreateAuctionDto): Promise<AuctionDto> {
    const auction:Auction = await super.create({
        auctionName:createDto.auctionName,
        reservePrice:createDto.reservePrice,
        createdBy:1 // TODO pass userId
    });
    // insert into items
    const itemsPromises = createDto.items.map(element =>
      this.auctionitemsService.createItem({
        auction: auction,
        itemDescription: element.itemDescription,
      })
    );
  
    const items = await Promise.all(itemsPromises);
  
     // Map the created items to your DTO format
  const mappedItems:AuctionItemDTO[] = items.map(item => ({
    itemDescription: item.itemDescription,
    itemId:item.id
    // Include other necessary fields from the AuctionItem entity
  }));

    // return
    return {
        auctionItemId:auction.id,
        bidderName:"",
        currentBid:auction.currentBid,
        reservePrice:auction.reservePrice,
        auctionName:auction.auctionName,
        items:mappedItems
       // reservePrice:auction.reservePrice
    };
  }
  async getAuctionById(id: number): Promise<AuctionDto> {
    const auction= await this.auctionRepository.findOne({ where:{id}, relations:["items"] });
    return {
        auctionItemId:auction.id,
        bidderName:"",
        currentBid:auction.currentBid,
        reservePrice:auction.reservePrice,
        auctionName:auction.auctionName,
        items:auction.items?.map(item => ({
          itemDescription: item.itemDescription,
          itemId:item.id
          // Include other necessary fields from the AuctionItem entity
        }))
    };
  }

   async getAll(): Promise<AuctionDto[]> { // Adjust the return type as needed
    const auctions = await super.findAll(["items"]);
    return auctions.map((auction) => ({
        auctionItemId: auction.id, // Assuming id is a number and needs to be a string
        bidderName:"",
        currentBid:auction.currentBid,
        reservePrice:auction.reservePrice,
        auctionName:auction.auctionName,
        items:auction.items?.map(item => ({
          itemDescription: item.itemDescription,
          itemId:item.id
          // Include other necessary fields from the AuctionItem entity
        }))
      }));
  }
}
