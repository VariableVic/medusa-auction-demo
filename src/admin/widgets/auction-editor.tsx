import { WidgetConfig, WidgetProps } from "@medusajs/admin";
import { Product } from "@medusajs/medusa";
import {
  useAdminCustomQuery,
  useAdminRegions,
  formatAmount,
} from "medusa-react";
import { Container } from "../components/auction/container";
import { Table, Heading, Badge } from "@medusajs/ui";
import { Auction } from "../../models/auction";
import { AuctionActions } from "../components/auction/auction-actions";

type InjectedProps = WidgetProps & {
  product: Product;
};

const AuctionEditor = (props: InjectedProps) => {
  const { product } = props;

  const { data, isLoading, error } = useAdminCustomQuery(
    "/admin/auctions",
    ["auctions"],
    {
      product_id: product.id,
    }
  );

  const { regions } = useAdminRegions();

  const auctions = (data?.auctions || []) as Auction[];

  return (
    <Container
      title="Auctions"
      description={`Manage auctions for ${product.title}.`}
      product={product}
    >
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading auctions</p>}

      <Heading level="h2" className="inter-large-semibold my-base">
        All auctions ({auctions.length})
      </Heading>

      {auctions && (
        <Table className="mt-6">
          <Table.Header>
            <Table.Row>
              <Table.Cell>Status</Table.Cell>
              <Table.Cell>Highest Bid</Table.Cell>
              <Table.Cell>Starting Price</Table.Cell>
              <Table.Cell>Starts At</Table.Cell>
              <Table.Cell>Ends At</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {auctions.map((a) => {
              const region = regions?.find((r) => r.id === a.region_id);

              if (!region) {
                return "Loading Regions";
              }

              const maxBid = a.bids?.reduce((a, b) => {
                return Math.max(a, b.amount);
              }, 0);

              const maxBidAmount = formatAmount({
                amount: maxBid,
                region,
              });

              const startingPrice = formatAmount({
                amount: a.starting_price,
                region,
              });

              return (
                <Table.Row key={a.id}>
                  <Table.Cell>
                    <Badge color={a.status === "active" ? "green" : "orange"}>
                      {a.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {maxBid ? `${maxBidAmount}` : "No bids yet"}
                  </Table.Cell>
                  <Table.Cell>{startingPrice}</Table.Cell>
                  <Table.Cell>
                    {new Date(a.starts_at).toDateString()}
                  </Table.Cell>
                  <Table.Cell>{new Date(a.ends_at).toDateString()}</Table.Cell>
                  <Table.Cell className="flex items-center justify-end">
                    <AuctionActions auction={a} product={product} />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
    </Container>
  );
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default AuctionEditor;
