import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

import AuctionService from "../../../services/auction";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const auctionService = req.scope.resolve("auctionService") as AuctionService;

  const auctions = await auctionService.list(
    {
      product_id: req.query.product_id as string,
    },
    {
      order: { ends_at: "ASC" },
      relations: ["bids"],
    }
  );

  res.status(200).json({ auctions });
  return;
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const auctionService = req.scope.resolve("auctionService") as AuctionService;

  const auction = await auctionService.create(req.body);

  res.status(200).json({ auction });
  return;
}
