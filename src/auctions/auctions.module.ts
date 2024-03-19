import { Module } from '@nestjs/common';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { AuctionItem } from './auctionitems/entities/auction.item.entity';
import { AuctionitemsService } from 'src/auctions/auctionitems/auctionitems.service';

@Module({
    imports: [TypeOrmModule.forFeature([Auction]),TypeOrmModule.forFeature([AuctionItem])],
    controllers:[AuctionsController],
    providers:[AuctionsService, AuctionitemsService]
})
export class AuctionsModule {

}
