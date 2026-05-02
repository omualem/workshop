import { Card } from "./card";
import { ReputationBadge } from "./reputation-badge";

export const ListingCard = ({
  title,
  category,
  price,
  lenderName,
  rating,
  completedTransactions,
  description,
  imageUrl,
}: {
  title: string;
  category: string;
  price: number;
  lenderName: string;
  rating: number;
  completedTransactions: number;
  description: string;
  imageUrl?: string;
}) => (
  <Card className="space-y-4">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={title}
        className="aspect-[4/3] w-full rounded-[18px] object-cover"
      />
    ) : (
      <div className="rm-art aspect-[4/3] rounded-[18px]" />
    )}
    <div className="space-y-2">
      <div className="surface-eyebrow">{category}</div>
      <h3 className="text-lg font-semibold leading-snug text-slate-900">{title}</h3>
      <p className="line-clamp-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">החל מיום</div>
        <div className="rm-display text-2xl font-bold text-slate-900">₪{price.toFixed(0)}</div>
      </div>
      <div className="text-sm font-medium text-slate-700">{lenderName}</div>
    </div>
    <ReputationBadge rating={rating} completedTransactions={completedTransactions} />
  </Card>
);
