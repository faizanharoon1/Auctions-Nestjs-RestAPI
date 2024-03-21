import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from 'src/auctions/entities/auction.entity';
import { DatabaseService } from 'src/database/database.service';
import { AuctionDto,  CreateAuctionDto } from './dto/create-auction-dto';
import { AuctionitemsService } from 'src/auctions/auctionitems/auctionitems.service';
import { AuctionItemDTO } from './auctionitems/dto/auction-items-dto';

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
    if(createDto.items.length==0)
           throw new BadRequestException(`Error:No item added.`);
    const auction:Auction = await super.create({
        auctionName:createDto.auctionName,
        reservePrice:createDto.reservePrice,
        createdBy:createDto.userId // TODO pass Id from users DIMENSION table NOT IMPLEMENTED
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
        id:auction.id,
        currentBid:auction.currentBid,
        auctionName:auction.auctionName,
        items:mappedItems
    };
  }
  async getAuctionById(id: number): Promise<AuctionDto> {
    const auction= await this.auctionRepository.findOne({ where:{id}, relations:["items"] });
    return {
       ...auction,
        items:auction.items?.map(item => ({
          itemDescription: item.itemDescription,
          itemId:item.id
          // Include other necessary fields from the AuctionItem entity
        }))
    };
  }

    async getAll(page: number, pageSize: number): Promise<AuctionDto[]> {
    // Calculate offset
    const skip = (page - 1) * pageSize;

    // Perform the query with pagination and relations
    const [results, total] = await this.auctionRepository.findAndCount({
      relations: ['items'], // Adjust relation based on your entity definition
      take: pageSize,
      skip: skip,
    });

    // Map results to DTOs 
    const auctionsDto = results.map(auction => ({
      ...auction,
      totalRows: total,
        items: auction.items.map(item => ({
        itemDescription: item.itemDescription,
        itemId: item.id,
      
      })),
    }));

    return auctionsDto;
  }
}
