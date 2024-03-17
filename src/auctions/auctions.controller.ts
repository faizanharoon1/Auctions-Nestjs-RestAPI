import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionDto, CreateAuctionDto } from './dto/create-auction-dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  findAll(): Promise<AuctionDto[]> {
    return this.auctionsService.getAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AuctionDto> {
    return this.auctionsService.getAuctionById(id);
  }

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto): Promise<AuctionDto> {
    return this.auctionsService.createAuction(createAuctionDto);
  }

  // Placeholder for POST /bids
  // This would likely involve injecting a BidsService and creating a method to handle bid submissions.
  @Post('/bids')
  createBid() {
    // Placeholder: Implement bid creation logic
    return { message: "This action will create a new bid for an auction." };
  }
}
