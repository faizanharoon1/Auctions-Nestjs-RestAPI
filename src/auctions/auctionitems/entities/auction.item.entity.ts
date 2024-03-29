import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auction } from "../../entities/auction.entity";

@Entity({name:"auction_items"})
export class AuctionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  itemDescription: string;

  @ManyToOne(() => Auction, auction => auction.items)
  @JoinColumn({ name: 'auctionId' }) // This specifies the FK column name
  auction: Auction; // This is the reference to the Auction entity

}