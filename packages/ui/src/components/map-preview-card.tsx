import { Card } from "./card";

export const MapPreviewCard = ({
  title,
  pickupPoints,
  totalDistanceKm,
}: {
  title: string;
  pickupPoints: number;
  totalDistanceKm: number;
}) => (
  <Card className="space-y-4">
    <div className="aspect-[16/10] rounded-2xl bg-[linear-gradient(135deg,_rgba(226,232,240,0.7),_rgba(203,213,225,0.9)),radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%)]" />
    <div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">
        {pickupPoints} נקודות איסוף, מרחק משוער {totalDistanceKm.toFixed(1)} ק"מ
      </p>
    </div>
  </Card>
);
