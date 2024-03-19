import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

import AuctionService, {
  FilterableAuctionFields,
} from "../../../services/auction";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  console.log("GET /store/auctions");

  const filters = req.query as {
    product_id: string;
    status: string;
  } as FilterableAuctionFields;

  const auctionService = req.scope.resolve("auctionService") as AuctionService;

  const auctions = await auctionService.list(filters, {
    order: {
      ends_at: "ASC",
      "bids.created_at": "DESC",
    },
    relations: ["bids"],
  });

  res.status(200).json({ auctions });
  return;
}
