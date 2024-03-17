import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"auctions"})
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0  })
  reservePrice: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentBid: number;
}