import {
  EllipsisHorizontal,
  Trash,
  PencilSquare,
  Spinner,
} from "@medusajs/icons";
import { DropdownMenu, IconButton } from "@medusajs/ui";
import { Auction } from "src/models/auction";
import { AuctionDrawer } from "./auction-drawer";
import { Product } from "@medusajs/medusa";
import { useState } from "react";
import { useAdminCustomDelete } from "medusa-react";

export function AuctionActions({
  auction,
  product,
}: {
  auction: Auction;
  product: Product;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { mutateAsync, isLoading } = useAdminCustomDelete(
    "/admin/auctions/" + auction.id,
    ["auctions"]
  );

  const handleDelete = async () => {
    await mutateAsync();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton variant="transparent">
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            className="gap-x-2"
            onClick={() => setDrawerOpen(true)}
          >
            <PencilSquare className="text-ui-fg-subtle" />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item className="gap-x-2" onClick={handleDelete}>
            {isLoading ? (
              <Spinner className="text-ui-fg-subtle animate-spin" />
            ) : (
              <Trash className="text-ui-fg-subtle" />
            )}
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <AuctionDrawer
        auction={auction}
        product={product}
        open={drawerOpen}
        setOpen={setDrawerOpen}
      />
    </>
  );
}
