import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionItem } from 'src/auctions/entities/auction.item.entity';
import { AuctionitemsService } from './auctionitems.service';

@Module({
    imports: [TypeOrmModule.forFeature([AuctionItem])],
    controllers:[],
    providers:[AuctionitemsService]
})
export class AuctionitemsModule {}
