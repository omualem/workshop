import { SiteShell } from "../../../components/site-shell";
import {
  IncludedItemsCard,
  LenderSummaryCard,
  ProductAttributesTable,
  ProductAvailabilityChecker,
  ProductDescriptionSection,
  ProductHeader,
  ProductImageGallery,
  ProductLocationCard,
  ProductPriceCard,
  RentalTermsCard,
  ReviewsSection,
  type ProductDetail,
} from "../../../components/listings/product-detail";
import { api } from "../../../lib/api";

export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = (await api.listing(id)) as ProductDetail;

  return (
    <SiteShell activeHref="/search">
      <main
        className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8"
        dir="rtl"
      >
        <ProductHeader product={listing} />
        <ProductImageGallery media={listing.media} title={listing.titleHe} />
        <ProductPriceCard product={listing} />
        <ProductDescriptionSection product={listing} />
        <ProductAttributesTable attributes={listing.attributes} />
        <ProductAvailabilityChecker listingId={listing.id} />
        <ProductLocationCard product={listing} />
        <LenderSummaryCard product={listing} />
        <RentalTermsCard product={listing} />
        <IncludedItemsCard items={listing.includedItems} />
        <ReviewsSection product={listing} />
      </main>
    </SiteShell>
  );
}
