"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card } from "@rental/ui";
import { api } from "../../lib/api";

type CategoryFormState = {
  id?: string;
  parentId: string;
  slug: string;
  nameHe: string;
  nameEn: string;
  status: "ACTIVE" | "ARCHIVED";
  attributesSchema: string;
};

const emptyForm: CategoryFormState = {
  parentId: "",
  slug: "",
  nameHe: "",
  nameEn: "",
  status: "ACTIVE",
  attributesSchema: '{"fields":[]}',
};

export function CategoryManager() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["admin-categories"],
    queryFn: api.adminCategories,
  });
  const categories = query.data ?? [];
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const createMutation = useMutation({
    mutationFn: api.createAdminCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setForm(emptyForm);
      setFeedback({ type: "success", message: "הקטגוריה נוצרה בהצלחה." });
    },
    onError: (error) =>
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "יצירת הקטגוריה נכשלה.",
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => api.updateAdminCategory(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setForm(emptyForm);
      setFeedback({ type: "success", message: "הקטגוריה עודכנה בהצלחה." });
    },
    onError: (error) =>
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "עדכון הקטגוריה נכשל.",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteAdminCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setFeedback({ type: "success", message: "הקטגוריה נמחקה בהצלחה" });
    },
    onError: (error) =>
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "מחיקת הקטגוריה נכשלה",
      }),
  });

  const parentOptions = useMemo(
    () =>
      categories
        .filter((item) => !item.parentId)
        .map((item) => ({ id: item.id, nameHe: item.nameHe })),
    [categories],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      parentId: form.parentId || undefined,
      slug: form.slug,
      nameHe: form.nameHe,
      nameEn: form.nameEn,
      status: form.status,
      attributesSchema: JSON.parse(form.attributesSchema || '{"fields":[]}'),
    };

    if (form.id) {
      updateMutation.mutate({ id: form.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const startEdit = (item: any) => {
    setFeedback(null);
    setForm({
      id: item.id,
      parentId: item.parentId ?? "",
      slug: item.slug,
      nameHe: item.nameHe,
      nameEn: item.nameEn,
      status: item.status,
      attributesSchema: JSON.stringify(
        item.attributesSchema ?? { fields: [] },
        null,
        2,
      ),
    });
  };

  const handleDelete = (item: any) => {
    const confirmed = window.confirm(
      "האם למחוק את הקטגוריה? הקטגוריה תועבר לארכיון.",
    );
    if (!confirmed) {
      return;
    }
    deleteMutation.mutate(item.id);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]" dir="rtl">
      <Card className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            {form.id ? "עריכת קטגוריה" : "הוספת קטגוריה"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            ניהול שמות בעברית ובאנגלית, היררכיית אב-בן וסכמת מאפיינים.
          </p>
        </div>
        {feedback ? (
          <div
            className={[
              "rounded-2xl border px-4 py-3 text-sm",
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800",
            ].join(" ")}
          >
            {feedback.message}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full rounded-2xl border px-4 py-3"
            value={form.parentId}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                parentId: event.target.value,
              }))
            }
          >
            <option value="">קטגוריית על</option>
            {parentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nameHe}
              </option>
            ))}
          </select>
          <input
            className="w-full rounded-2xl border px-4 py-3"
            placeholder="Slug"
            value={form.slug}
            onChange={(event) =>
              setForm((current) => ({ ...current, slug: event.target.value }))
            }
          />
          <input
            className="w-full rounded-2xl border px-4 py-3"
            placeholder="שם בעברית"
            value={form.nameHe}
            onChange={(event) =>
              setForm((current) => ({ ...current, nameHe: event.target.value }))
            }
          />
          <input
            className="w-full rounded-2xl border px-4 py-3"
            placeholder="English name"
            value={form.nameEn}
            onChange={(event) =>
              setForm((current) => ({ ...current, nameEn: event.target.value }))
            }
          />
          <select
            className="w-full rounded-2xl border px-4 py-3"
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value as "ACTIVE" | "ARCHIVED",
              }))
            }
          >
            <option value="ACTIVE">פעילה</option>
            <option value="ARCHIVED">בארכיון</option>
          </select>
          <textarea
            className="min-h-32 w-full rounded-2xl border px-4 py-3 font-mono text-sm"
            placeholder='{"fields":[]}'
            value={form.attributesSchema}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                attributesSchema: event.target.value,
              }))
            }
          />
          <div className="flex gap-3">
            <Button type="submit">
              {form.id ? "שמור שינויים" : "הוסף קטגוריה"}
            </Button>
            {form.id ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setForm(emptyForm)}
              >
                ביטול
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              עץ קטגוריות
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              הנתונים נטענים ישירות מטבלת הקטגוריות.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {categories.length} קטגוריות
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-right">שם</th>
                <th className="px-4 py-3 text-right">Slug</th>
                <th className="px-4 py-3 text-right">אב</th>
                <th className="px-4 py-3 text-right">פריטים</th>
                <th className="px-4 py-3 text-right">סטטוס</th>
                <th className="px-4 py-3 text-right">פעולה</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="border-t px-4 py-10 text-center text-slate-500"
                  >
                    אין קטגוריות להצגה
                  </td>
                </tr>
              ) : (
                categories.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {item.nameHe}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.slug}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {categories.find((parent) => parent.id === item.parentId)
                        ?.nameHe ?? "קטגוריית על"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item._count?.listings ?? 0}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.status === "ACTIVE" ? "פעילה" : "בארכיון"}
                    </td>
                    <td className="px-4 py-3">
  <div className="flex flex-wrap gap-2">
    <Button
      variant="secondary"
      onClick={() => startEdit(item)}
    >
      עריכה
    </Button>
    <Button
      variant="secondary"
      className="border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50"
      onClick={() => handleDelete(item)}
    >
      מחיקה
    </Button>
  </div>
</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {query.isLoading ? (
          <div className="text-sm text-slate-500">טוען קטגוריות...</div>
        ) : null}
        {query.error ? (
          <div className="text-sm text-rose-700">לא ניתן לטעון את הקטגוריות.</div>
        ) : null}
      </Card>
    </div>
  );
}
