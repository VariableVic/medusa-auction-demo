import { AuctionStatus } from "../models/auction";

export default function getStatus(
  startDate: Date,
  endDate: Date
): AuctionStatus {
  const now = new Date();
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  if (startDate > endDate) {
    throw new Error("Start date cannot be after end date");
  }

  if (now < startDate) {
    return AuctionStatus.PENDING;
  } else if (now < endDate) {
    return AuctionStatus.ACTIVE;
  } else {
    return AuctionStatus.EXPIRED;
  }
}
