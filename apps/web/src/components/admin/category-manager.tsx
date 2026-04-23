"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  attributesSchema: "{}",
};

export function CategoryManager() {
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: api.adminCategories,
  });
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);

  const mergedItems = items.length > 0 ? items : categories;

  const createMutation = useMutation({
    mutationFn: api.createAdminCategory,
    onSuccess: (created) => {
      setItems((current) => [
        { ...created, _count: created._count ?? { listings: 0 } },
        ...(current.length ? current : categories),
      ]);
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api.updateAdminCategory(id, payload),
    onSuccess: (updated) => {
      setItems((current) =>
        (current.length ? current : categories).map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      );
      setForm(emptyForm);
    },
  });

  const parentOptions = useMemo(
    () => mergedItems.filter((item) => !item.parentId).map((item) => ({ id: item.id, nameHe: item.nameHe })),
    [mergedItems],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      parentId: form.parentId || undefined,
      slug: form.slug,
      nameHe: form.nameHe,
      nameEn: form.nameEn,
      status: form.status,
      attributesSchema: JSON.parse(form.attributesSchema || "{}"),
    };

    if (form.id) {
      updateMutation.mutate({ id: form.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const startEdit = (item: any) => {
    setForm({
      id: item.id,
      parentId: item.parentId ?? "",
      slug: item.slug,
      nameHe: item.nameHe,
      nameEn: item.nameEn,
      status: item.status,
      attributesSchema: JSON.stringify(item.attributesSchema ?? {}, null, 2),
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">{form.id ? "עריכת קטגוריה" : "הוספת קטגוריה"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            ניהול taxonomy, תרגומים, parent-child hierarchy ו-schema של מאפיינים.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full rounded-2xl border px-4 py-3"
            value={form.parentId}
            onChange={(event) => setForm((current) => ({ ...current, parentId: event.target.value }))}
          >
            <option value="">קטגוריית על</option>
            {parentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nameHe}
              </option>
            ))}
          </select>
          <input className="w-full rounded-2xl border px-4 py-3" placeholder="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          <input className="w-full rounded-2xl border px-4 py-3" placeholder="שם בעברית" value={form.nameHe} onChange={(event) => setForm((current) => ({ ...current, nameHe: event.target.value }))} />
          <input className="w-full rounded-2xl border px-4 py-3" placeholder="English name" value={form.nameEn} onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))} />
          <select
            className="w-full rounded-2xl border px-4 py-3"
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as "ACTIVE" | "ARCHIVED" }))}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
          <textarea
            className="min-h-32 w-full rounded-2xl border px-4 py-3 font-mono text-sm"
            placeholder='{"attributes":["sensor","power"]}'
            value={form.attributesSchema}
            onChange={(event) => setForm((current) => ({ ...current, attributesSchema: event.target.value }))}
          />
          <div className="flex gap-3">
            <Button type="submit">{form.id ? "שמור שינויים" : "הוסף קטגוריה"}</Button>
            {form.id ? (
              <Button type="button" variant="secondary" onClick={() => setForm(emptyForm)}>
                ביטול
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">עץ קטגוריות</h2>
            <p className="mt-2 text-sm text-slate-600">עריכה מהירה של מבנה הקטלוג והקצאת פריטים.</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {mergedItems.length} קטגוריות
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
              {mergedItems.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.nameHe}</td>
                  <td className="px-4 py-3 text-slate-600">{item.slug}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {mergedItems.find((parent) => parent.id === item.parentId)?.nameHe ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item._count?.listings ?? 0}</td>
                  <td className="px-4 py-3 text-slate-600">{item.status}</td>
                  <td className="px-4 py-3">
                    <Button variant="secondary" onClick={() => startEdit(item)}>
                      ערוך
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
