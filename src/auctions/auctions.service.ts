import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from 'src/auctions/entities/auction.entity';
import { DatabaseService } from 'src/database/database.service';
import { AuctionDto, CreateAuctionDto } from './dto/create-auction-dto';

@Injectable()
export class AuctionsService extends DatabaseService<Auction> {
  constructor(
    @InjectRepository(Auction) private readonly auctionRepository: Repository<Auction>,
  ) {
    // Pass the repository to the superclass constructor
    super(auctionRepository);
  }
   async createAuction(createDto: CreateAuctionDto): Promise<AuctionDto> {
    const auction:Auction = await super.create({
        auctionName:createDto.auctionName
    });
    return {
        auctionItemId:auction.id,
        bidderName:"",
        currentBid:0,
        auctionName:"",
        items:null
       // reservePrice:auction.reservePrice
    };
  }
  async getAuctionById(id: number): Promise<AuctionDto> {
    const auction= await this.auctionRepository.findOneBy({ id });
    return null;
    // return {
    //     auctionItemId:auction.id,
    //     reservePrice:auction.reservePrice
    // };
  }

   async getAll(): Promise<AuctionDto[]> { // Adjust the return type as needed
    const auctions = await super.findAll();
    return null
    // return auctions.map((auction) => ({
    //     auctionItemId: auction.id, // Assuming id is a number and needs to be a string
    //     reservePrice: auction.reservePrice,
    //    // itemDescription: auction., // Assuming there's a 'description' field in the entity
    //   }));
  }
}
