import { FindConfig, buildQuery } from "@medusajs/medusa";
import { Auction } from "../models/auction";
import { EntityManager, In } from "typeorm";
import getStatus from "../util/get-status";
import { AuctionStatus } from "../models/auction";
import { Bid } from "../models/bid";

type InjectedDependencies = {
  manager: EntityManager;
};

export default class AuctionService {
  private manager: EntityManager;

  constructor(container: InjectedDependencies) {
    this.manager = container.manager;
  }

  async list(
    filters?: FilterableAuctionFields,
    config: FindConfig<Auction> = {}
  ): Promise<Auction[]> {
    const auctionRepo = this.manager.getRepository(Auction);
    const { product_id, ...rest } = filters;
    const query = buildQuery(rest, config);

    if (product_id) {
      query.where = {
        ...query.where,
        product_id: In([product_id]),
      };
    }

    return await auctionRepo.find(query);
  }

  async create(data: Partial<Auction>): Promise<Auction> {
    const auctionRepo = this.manager.getRepository(Auction);

    const auction = auctionRepo.create(data);
    return await auctionRepo.save(auction);
  }

  async update(id: string, data: Partial<Auction>): Promise<Auction> {
    const auctionRepo = this.manager.getRepository(Auction);

    const auction = await auctionRepo.findOne({ where: { id } });

    if (data.starts_at || data.ends_at) {
      const startDate = data.starts_at || auction.starts_at;
      const endDate = data.ends_at || auction.ends_at;

      data.status = getStatus(startDate, endDate);
    }

    await auctionRepo.update({ id }, data);
    return await auctionRepo.findOne({ where: { id } });
  }

  async retrieve(
    id: string,
    config: FindConfig<Auction> = {}
  ): Promise<Auction> {
    const auctionRepo = this.manager.getRepository(Auction);
    return await auctionRepo.findOne({ where: { id }, ...config });
  }

  async delete(id: string) {
    const auctionRepo = this.manager.getRepository(Auction);

    // Hack because of the cascade delete not working - probably a faulty relation somewhere
    const auction = await auctionRepo.findOne({
      where: { id },
      relations: ["bids"],
    });
    const bidIds = auction.bids.map((b) => b.id);
    await auctionRepo.manager.getRepository(Bid).delete(bidIds);

    await auctionRepo.delete(id);
  }

  async createBid(
    auctionId: string,
    data: { amount: number; user_id: string }
  ) {
    const auctionRepo = this.manager.getRepository(Auction);
    const auction = await auctionRepo.findOne({
      where: { id: auctionId },
      relations: ["bids"],
    });

    if (auction.status !== "active") {
      throw new Error("Auction is not active");
    }

    const bid = auctionRepo.manager.getRepository("Bid").create(data);
    bid.auction = auction;
    return await auctionRepo.manager.getRepository("Bid").save(bid);
  }
}

export type FilterableAuctionFields = {
  id?: string;
  starts_at?: Date;
  ends_at?: Date;
  status?: AuctionStatus;
  product_id?: string;
};
