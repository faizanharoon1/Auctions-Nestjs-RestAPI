import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuctionsModule } from './auctions/auctions.module';
import { ConfigModule } from '@nestjs/config';
import { BidsModule } from './bids/bids.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './auctions/entities/auction.entity';
import { AuctionItem } from './auctions/auctionitems/entities/auction.item.entity';
import { AuctionitemsModule } from './auctions/auctionitems/auctionitems.module';
import { Bid } from './bids/entities/bid.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Auction, AuctionItem, Bid],
      synchronize: true,
    }),
    AuctionsModule,
    AuctionitemsModule,
    BidsModule
  ],
  controllers: [AppController], // Only AppController remains if it's application-wide
  providers: [AppService], // Only application-wide services here
})
export class AppModule {}
