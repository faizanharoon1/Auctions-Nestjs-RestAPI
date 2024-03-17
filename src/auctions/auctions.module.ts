import { Module } from '@nestjs/common';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { AuctionItem } from './entities/auction.item.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Auction, AuctionItem])],
    controllers:[AuctionsController],
    providers:[AuctionsService]
})
export class AuctionsModule {

}
