import { generateEntityId, BaseEntity } from "@medusajs/medusa";
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Auction } from "./auction";

@Entity()
export class Bid extends BaseEntity {
  @Column()
  amount: number;

  @Column()
  customer_id: string;

  @ManyToOne(() => Auction, (auction) => auction.bids)
  auction: Auction;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "bid");
  }
}
