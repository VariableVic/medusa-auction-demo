import { PlusMini, PencilSquare } from "@medusajs/icons";
import { Product } from "@medusajs/medusa";
import {
  Button,
  DatePicker,
  Drawer,
  IconButton,
  Input,
  Label,
  Select,
  DropdownMenu,
} from "@medusajs/ui";
import { useAdminCustomPost, useAdminRegions } from "medusa-react";
import { useState } from "react";
import { Auction } from "../../../models/auction";

enum AuctionStatus {
  PENDING = "pending",
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
  SOLD = "sold",
}

export function AuctionDrawer({
  auction,
  product,
  open,
  setOpen,
}: {
  auction?: Auction;
  product: Product;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [regionId, setRegionId] = useState<string | null>(
    auction?.region_id || null
  );

  const [formData, setFormData] = useState({
    starts_at: auction?.starts_at || new Date(),
    ends_at: auction?.ends_at || new Date(),
    status: auction?.status || AuctionStatus.PENDING,
  });

  const [startingPrice, setStartingPrice] = useState<number>();

  const { mutateAsync, isLoading } = useAdminCustomPost(
    auction?.id ? `/admin/auctions/${auction?.id}` : "/admin/auctions",
    ["auctions"]
  );
  const { regions } = useAdminRegions();

  const region = regions?.find((r) => r.id === regionId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: Record<string, any> = {
      ...formData,
      region_id: regionId,
      product_id: product.id,
    };

    if (startingPrice) data.starting_price = startingPrice * 100;

    try {
      await mutateAsync({
        ...data,
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        {!auction && (
          <IconButton variant="transparent">
            <PlusMini />
          </IconButton>
        )}
      </Drawer.Trigger>
      <Drawer.Content className="max-w-2xl right-2">
        <Drawer.Header>
          <Drawer.Title>{auction ? "Edit" : "Create"} Auction</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">
          <form id="upsert-auction" onSubmit={handleSubmit}>
            {regions && (
              <div className="flex flex-col gap-2 mb-4">
                <Label>Region</Label>
                <Select
                  onValueChange={(value) => {
                    setRegionId(value as string);
                  }}
                  defaultValue={auction?.region_id}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select region" />
                  </Select.Trigger>
                  <Select.Content>
                    {regions.map((region) => (
                      <Select.Item key={region.id} value={region.id}>
                        {region.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
            )}
            <div className="flex flex-col gap-2 mb-4">
              <Label>Starts at</Label>
              <DatePicker
                placeholder="Pick a date"
                id="starts_at"
                onChange={(date) => {
                  setFormData({
                    ...formData,
                    starts_at: date.toISOString(),
                  });
                }}
                value={
                  formData?.starts_at
                    ? new Date(formData?.starts_at)
                    : new Date()
                }
              />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Label>Ends at</Label>
              <DatePicker
                placeholder="Pick a date"
                id="ends_at"
                onChange={(date) => {
                  setFormData({
                    ...formData,
                    ends_at: date,
                  });
                }}
                value={
                  formData?.ends_at ? new Date(formData?.ends_at) : new Date()
                }
              />
            </div>
            {auction?.status && (
              <div className="flex flex-col gap-2 mb-4">
                <Label>Status</Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      status: value as AuctionStatus,
                    });
                  }}
                  value={formData?.status}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select status" />
                  </Select.Trigger>
                  <Select.Content>
                    {Object.values(AuctionStatus).map((value) => (
                      <Select.Item key={value} value={value}>
                        {value}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-2 mb-4">
              <Label>Starting Price</Label>
              <div className="flex gap-2 items-center">
                <span className="text-gray-500">
                  {region?.currency_code.toUpperCase()}
                </span>
                <Input
                  onChange={(e) => {
                    setStartingPrice(parseFloat(e.target.value));
                  }}
                  type="number"
                  name="starting_price"
                  placeholder="Starting Price"
                  defaultValue={startingPrice || auction?.starting_price / 100}
                  value={startingPrice}
                />
              </div>
            </div>
          </form>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button isLoading={isLoading} type="submit" form="upsert-auction">
            Save
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}
