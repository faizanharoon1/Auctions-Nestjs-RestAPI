import { Auction } from "src/auctions/entities/auction.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity({name:"bids"})
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxAutoBidAmount: number; // The maximum amount the bidder is willing to pay

  @Column()
  bidderName: string;

  // Maintain referential integrity without fetching bids from AuctionItem
  @ManyToOne(() => Auction)
  @JoinColumn({ name: 'auctionId' }) // Ensures the foreign key in the database
  auctionItem: Auction;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP', // Automatically set on insert
  })
  created: Date;
}
