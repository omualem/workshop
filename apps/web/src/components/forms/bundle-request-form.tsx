"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { bundleSearchInputSchema, type BundleSearchFormInput } from "@rental/types";
import { Button, BundleBuilderRow, Card } from "@rental/ui";
import { api } from "../../lib/api";

const defaultValues: BundleSearchFormInput = {
  requestedItems: [
    {
      slotKey: "camera",
      categoryId: "00000000-0000-4000-8000-000000000003",
      quantity: 1,
      optional: false,
      constraints: {},
    },
    {
      slotKey: "tripod",
      categoryId: "00000000-0000-4000-8000-000000000008",
      quantity: 1,
      optional: false,
      constraints: {},
    },
    {
      slotKey: "lighting",
      categoryId: "00000000-0000-4000-8000-000000000007",
      quantity: 1,
      optional: false,
      constraints: {},
    },
  ],
  dateRange: {
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  renterLocation: {
    lat: 32.0853,
    lng: 34.7818,
    addressText: "תל אביב, ישראל",
  },
  preferenceProfile: "balanced",
  sameLenderPreferred: true,
  deliveryPreferred: false,
  exactDatesOnly: true,
  maxPickupPoints: 2,
  debug: false,
};

export function BundleRequestForm() {
  const router = useRouter();
  const form = useForm<BundleSearchFormInput>({
    resolver: zodResolver(bundleSearchInputSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (payload: BundleSearchFormInput) =>
      api.createBundleSearch(bundleSearchInputSchema.parse(payload)),
    onSuccess: (result) => {
      router.push(`/renter/bundle-results?searchId=${result.searchId}`);
    },
  });

  const values = form.watch();

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"
    >
      <Card className="space-y-6 p-6 md:p-7">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">מה תרצו לשכור יחד?</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            המנוע ירכיב כמה חבילות חוקיות, ינקד אותן ויציג את האיזונים בין מחיר,
            אמינות, לוגיסטיקה, זמינות ואיכות.
          </p>
        </div>

        <div className="space-y-3">
          <BundleBuilderRow title="מצלמה" subtitle="קטגוריה: צילום" quantity={1} />
          <BundleBuilderRow title="חצובה" subtitle="קטגוריה: צילום" quantity={1} />
          <BundleBuilderRow title="ערכת תאורה" subtitle="קטגוריה: צילום" quantity={1} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="form-label">כתובת איסוף מועדפת</label>
            <input className="form-input" {...form.register("renterLocation.addressText")} />
          </div>
          <div>
            <label className="form-label">פרופיל דירוג</label>
            <select className="form-select" {...form.register("preferenceProfile")}>
              <option value="balanced">מאוזן</option>
              <option value="cheapest">הכי זול</option>
              <option value="mostReliable">הכי אמין</option>
              <option value="easiestPickup">האיסוף הכי קל</option>
              <option value="bestDateFit">התאמת תאריכים מיטבית</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="form-label">תקציב מקסימלי</label>
            <input
              type="number"
              className="form-input"
              {...form.register("maxBudget", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className="form-label">מקסימום נקודות איסוף</label>
            <input
              type="number"
              className="form-input"
              {...form.register("maxPickupPoints", { valueAsNumber: true })}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full py-3">
              {mutation.isPending ? "מחשב אפשרויות..." : "מצא חבילות חכמות"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 bg-slate-950 p-6 text-white md:p-7">
        <div>
          <div className="surface-eyebrow text-cyan-300">Engine Preview</div>
          <h3 className="mt-3 text-2xl font-semibold">איך ההחלטה מתקבלת</h3>
        </div>
        <div className="space-y-3 text-sm leading-7 text-slate-200">
          <p>
            מחיר, אמינות, לוגיסטיקה, זמינות ואיכות נשקלים יחד עם penalty לחבילות לא
            מאוזנות.
          </p>
          <p>
            בכל חיפוש נשמר debug snapshot כדי שאדמין יוכל לבדוק למה חבילה אחת דורגה
            מעל אחרת.
          </p>
          <p>
            העדפה נוכחית: <span className="font-semibold">{values.preferenceProfile}</span>
          </p>
        </div>
      </Card>
    </form>
  );
}
