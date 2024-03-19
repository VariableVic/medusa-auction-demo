import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

import AuctionService from "../../../../services/auction";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const id = req.params.id;

  const auctionService = req.scope.resolve("auctionService") as AuctionService;

  const auctions = await auctionService.retrieve(id, {
    relations: ["bids"],
  });

  res.status(200).json({ auctions });
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const id = req.params.id;

  const auctionService = req.scope.resolve("auctionService") as AuctionService;

  const auction = await auctionService.update(id, req.body);

  res.status(200).json({ auction });
  return;
}
