import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionDto, CreateAuctionDto } from './dto/create-auction-dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 5,
  ): Promise<AuctionDto[]> {
    return this.auctionsService.getAll(page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AuctionDto> {
    return this.auctionsService.getAuctionById(id);
  }

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto): Promise<AuctionDto> {
    return this.auctionsService.createAuction(createAuctionDto);
  }

  @Post('/bids')
  createBid() {
    // Placeholder: Implement bid creation logic
    return { message: "This action will create a new bid for an auction." };
  }
}
