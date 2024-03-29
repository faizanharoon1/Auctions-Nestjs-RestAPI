import { Column, Entity, IsNull, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AuctionItem } from "../auctionitems/entities/auction.item.entity";
import { IsOptional } from "class-validator";

@Entity({name:"auctions"})
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('nvarchar', { length:90 })
  auctionName: string;

  @Column('decimal', { precision: 10, scale: 2, default:0.0 })
  currentBid: number;

  @Column('decimal', { precision: 10, scale: 2 })
  reservePrice: number;

@Column({ nullable: true }) 
  @IsOptional()
  bidderName: string;

 @Column('nvarchar', { length:50 })
  createdBy: string;
  
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP', // Automatically set on insert
  })
  created: Date;

  @OneToMany(() => AuctionItem, auctionItem => auctionItem.auction) //Auction can have one or many items
  items: AuctionItem[];

}