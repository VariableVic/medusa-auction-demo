import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

import AuctionService from "../../../../../services/auction";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const auctionId = req.params.id;

  const data = JSON.parse(req.body);

  const auctionService = req.scope.resolve("auctionService") as AuctionService;

  const auction = await auctionService.retrieve(auctionId, {
    relations: ["bids"],
  });

  const currentBids = auction.bids.map((b) => b.amount);

  const maxBid = Math.max(...currentBids);

  if (data.amount <= maxBid) {
    res.status(400).json({
      message: `Please place a bid higher than the current highest bid of`,
      highestBid: maxBid,
    });
    return;
  }

  const bid = await auctionService.createBid(auctionId, data);

  res.status(200).json({ bid });
  return;
}
