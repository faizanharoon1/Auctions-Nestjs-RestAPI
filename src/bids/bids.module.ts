import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Auction } from 'src/auctions/entities/auction.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Bid, Auction])],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
