import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Auction } from 'src/auctions/entities/auction.entity';

@Module({
  imports:[CacheModule.register({
      ttl: 1000 * 120, // cache for 2 minutes
      max: 15, // maximum number of items in cache
    }),TypeOrmModule.forFeature([Bid, Auction])],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
