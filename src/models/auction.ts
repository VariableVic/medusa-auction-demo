import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
import { Bid } from "./bid";
import getStatus from "../util/get-status";

export enum AuctionStatus {
  PENDING = "pending",
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
  SOLD = "sold",
}

@Entity()
export class Auction extends BaseEntity {
  @Column()
  starts_at: Date;

  @Column()
  ends_at: Date;

  @Column({ type: "enum", enum: AuctionStatus, default: AuctionStatus.PENDING })
  status: AuctionStatus;

  @Column()
  starting_price: number;

  @Column()
  product_id: string;

  @Column()
  region_id: string;

  @OneToMany(() => Bid, (b) => b.auction, {
    onDelete: "CASCADE",
  })
  bids: Bid[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "auction");
    this.status = getStatus(this.starts_at, this.ends_at);
  }
}
