import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AuctionItem } from "./auction.item.entity";

@Entity({name:"auctions"})
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('nvarchar', { length:90 })
  auctionName: string;

  @OneToMany(() => AuctionItem, auctionItem => auctionItem.auction)
  items: AuctionItem[];

}