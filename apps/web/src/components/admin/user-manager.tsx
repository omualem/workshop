"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card } from "@rental/ui";
import { api } from "../../lib/api";

type UserStatus =
  | "ACTIVE"
  | "PENDING_VERIFICATION"
  | "SUSPENDED"
  | "DELETED";

type UserRole = "ADMIN" | "RENTER" | "LENDER" | "GUEST";

type UserType = "LENDER" | "RENTER" | "BOTH" | "NONE";

type UserFormState = {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  lenderDisplayName: string;
  lenderBio: string;
  averageRating: string;
  completedTransactionsCount: string;
  reliabilityScoreCached: string;
  cancellationRate: string;
  lateReturnRate: string;
  complaintRate: string;
  responseTimeScore: string;
  verificationLevel: "BASIC" | "VERIFIED" | "TRUSTED";
  renterDefaultAddressText: string;
  renterVerificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
};

const roleLabels: Record<UserRole, string> = {
  ADMIN: "אדמין",
  RENTER: "שוכר",
  LENDER: "מלווה",
  GUEST: "אורח",
};

const statusLabels: Record<UserStatus, string> = {
  ACTIVE: "פעיל",
  PENDING_VERIFICATION: "ממתין לאימות",
  SUSPENDED: "מושבת",
  DELETED: "נמחק",
};

const typeLabels: Record<UserType, string> = {
  LENDER: "מלווה",
  RENTER: "שוכר",
  BOTH: "מלווה + שוכר",
  NONE: "ללא פרופיל",
};

const emptyForm: UserFormState = {
  fullName: "",
  email: "",
  phone: "",
  role: "RENTER",
  status: "ACTIVE",
  lenderDisplayName: "",
  lenderBio: "",
  averageRating: "",
  completedTransactionsCount: "",
  reliabilityScoreCached: "",
  cancellationRate: "",
  lateReturnRate: "",
  complaintRate: "",
  responseTimeScore: "",
  verificationLevel: "BASIC",
  renterDefaultAddressText: "",
  renterVerificationStatus: "PENDING",
};

export function UserManager() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: api.adminUsers,
  });
  const [filters, setFilters] = useState({ search: "", role: "", type: "" });
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => api.updateAdminUser(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setFeedback({ type: "success", message: "המשתמש עודכן בהצלחה." });
      setIsModalOpen(false);
      setForm(emptyForm);
    },
    onError: (mutationError) => {
      setFeedback({
        type: "error",
        message:
          mutationError instanceof Error
            ? mutationError.message
            : "עדכון המשתמש נכשל.",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: api.createAdminUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setFeedback({
        type: "success",
        message: 'המשתמש נוצר בהצלחה. סיסמת הדמו הראשונית היא demo123456.',
      });
      setIsModalOpen(false);
      setForm(emptyForm);
    },
    onError: (mutationError) => {
      setFeedback({
        type: "error",
        message:
          mutationError instanceof Error
            ? mutationError.message
            : "יצירת המשתמש נכשלה.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteAdminUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setFeedback({ type: "success", message: "משתמש נמחק בהצלחה" });
    },
    onError: (mutationError) => {
      setFeedback({
        type: "error",
        message:
          mutationError instanceof Error
            ? mutationError.message
            : "מחיקת המשתמש נכשלה",
      });
    },
  });

  const visibleUsers = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return users.filter((user: any) => {
      if (filters.role && user.role !== filters.role) {
        return false;
      }
      if (filters.type && user.type !== filters.type) {
        return false;
      }
      if (!search) {
        return true;
      }
      const haystack = [
        user.fullName,
        user.email,
        user.phone,
        user.lenderDisplayName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }, [filters, users]);

  const startEdit = (user: any) => {
    setFeedback(null);
    setForm({
      id: user.id,
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      role: (user.role ?? "RENTER") as UserRole,
      status: (user.status ?? "ACTIVE") as UserStatus,
      lenderDisplayName: user.lenderProfile?.displayName ?? "",
      lenderBio: user.lenderProfile?.bio ?? "",
      averageRating:
        user.lenderProfile?.averageRating !== undefined &&
        user.lenderProfile?.averageRating !== null
          ? String(Number(user.lenderProfile.averageRating))
          : "",
      completedTransactionsCount:
        user.lenderProfile?.completedTransactionsCount !== undefined &&
        user.lenderProfile?.completedTransactionsCount !== null
          ? String(user.lenderProfile.completedTransactionsCount)
          : "",
      reliabilityScoreCached:
        user.lenderProfile?.reliabilityScoreCached !== undefined &&
        user.lenderProfile?.reliabilityScoreCached !== null
          ? String(Number(user.lenderProfile.reliabilityScoreCached))
          : "",
      cancellationRate:
        user.lenderProfile?.cancellationRate !== undefined &&
        user.lenderProfile?.cancellationRate !== null
          ? String(Number(user.lenderProfile.cancellationRate))
          : "",
      lateReturnRate:
        user.lenderProfile?.lateReturnRate !== undefined &&
        user.lenderProfile?.lateReturnRate !== null
          ? String(Number(user.lenderProfile.lateReturnRate))
          : "",
      complaintRate:
        user.lenderProfile?.complaintRate !== undefined &&
        user.lenderProfile?.complaintRate !== null
          ? String(Number(user.lenderProfile.complaintRate))
          : "",
      responseTimeScore:
        user.lenderProfile?.responseTimeScore !== undefined &&
        user.lenderProfile?.responseTimeScore !== null
          ? String(Number(user.lenderProfile.responseTimeScore))
          : "",
      verificationLevel: (user.lenderProfile?.verificationLevel ??
        "BASIC") as UserFormState["verificationLevel"],
      renterDefaultAddressText: user.renterProfile?.defaultAddressText ?? "",
      renterVerificationStatus:
        user.renterProfile?.verificationStatus ?? "PENDING",
    });
    setIsModalOpen(true);
  };

  const startCreate = () => {
    setFeedback(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const handleDelete = (user: any) => {
    const confirmed = window.confirm(
      'האם למחוק את המשתמש? פעולה זו עשויה להשפיע על פריטים וחבילות.',
    );
    if (!confirmed) {
      return;
    }
    deleteMutation.mutate(user.id);
  };

  const handleToggleStatus = (user: any) => {
    updateMutation.mutate({
      id: user.id,
      payload: {
        status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);

    if (!form.fullName.trim()) {
      setFeedback({ type: "error", message: "יש להזין שם מלא" });
      return;
    }
    if (!form.email.trim()) {
      setFeedback({ type: "error", message: "יש להזין אימייל" });
      return;
    }

    const averageRating = form.averageRating.trim()
      ? Number(form.averageRating)
      : undefined;
    const completedTransactionsCount = form.completedTransactionsCount.trim()
      ? Number(form.completedTransactionsCount)
      : undefined;
    const reliabilityScoreCached = form.reliabilityScoreCached.trim()
      ? Number(form.reliabilityScoreCached)
      : undefined;
    const cancellationRate = form.cancellationRate.trim()
      ? Number(form.cancellationRate)
      : undefined;
    const lateReturnRate = form.lateReturnRate.trim()
      ? Number(form.lateReturnRate)
      : undefined;
    const complaintRate = form.complaintRate.trim()
      ? Number(form.complaintRate)
      : undefined;
    const responseTimeScore = form.responseTimeScore.trim()
      ? Number(form.responseTimeScore)
      : undefined;

    if (averageRating !== undefined && (!Number.isFinite(averageRating) || averageRating < 0 || averageRating > 5)) {
      setFeedback({ type: "error", message: "דירוג ממוצע חייב להיות בין 0 ל-5" });
      return;
    }
    if (
      completedTransactionsCount !== undefined &&
      (!Number.isInteger(completedTransactionsCount) ||
        completedTransactionsCount < 0)
    ) {
      setFeedback({
        type: "error",
        message: "מספר השכרות שהושלמו חייב להיות 0 או יותר",
      });
      return;
    }
    if (
      reliabilityScoreCached !== undefined &&
      (!Number.isFinite(reliabilityScoreCached) ||
        reliabilityScoreCached < 0 ||
        reliabilityScoreCached > 10)
    ) {
      setFeedback({
        type: "error",
        message: "ציון אמינות חייב להיות בין 0 ל-10",
      });
      return;
    }
    for (const [value, label] of [
      [cancellationRate, "אחוז הביטולים"],
      [lateReturnRate, "אחוז ההחזרות באיחור"],
      [complaintRate, "אחוז התלונות"],
    ] as const) {
      if (
        value !== undefined &&
        (!Number.isFinite(value) || value < 0 || value > 100)
      ) {
        setFeedback({
          type: "error",
          message: `${label} חייב להיות בין 0 ל-100`,
        });
        return;
      }
    }
    if (
      responseTimeScore !== undefined &&
      (!Number.isFinite(responseTimeScore) ||
        responseTimeScore < 0 ||
        responseTimeScore > 10)
    ) {
      setFeedback({
        type: "error",
        message: "ציון זמן תגובה חייב להיות בין 0 ל-10",
      });
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      status: form.status,
      lenderProfile: {
        displayName: form.lenderDisplayName.trim() || undefined,
        bio: form.lenderBio.trim() || undefined,
        averageRating,
        completedTransactionsCount,
        reliabilityScoreCached,
        cancellationRate,
        lateReturnRate,
        complaintRate,
        responseTimeScore,
        verificationLevel: form.verificationLevel,
      },
      renterProfile: {
        defaultAddressText: form.renterDefaultAddressText.trim() || undefined,
        verificationStatus: form.renterVerificationStatus,
      },
    };

    if (!form.id) {
      createMutation.mutate(payload);
      return;
    }

    updateMutation.mutate({
      id: form.id,
      payload,
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">משתמשים</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">
            {users.length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">מלווים</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">
            {users.filter((user: any) => user.type === "LENDER" || user.type === "BOTH").length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">שוכרים</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">
            {users.filter((user: any) => user.type === "RENTER" || user.type === "BOTH").length}
          </div>
        </Card>
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

      <Card className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={startCreate}>
            משתמש חדש
          </Button>
          <input
            className="min-w-56 flex-1 rounded-2xl border px-4 py-3 text-right"
            dir="rtl"
            placeholder="חיפוש לפי שם, אימייל או טלפון"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
          />
          <select
            className="rounded-2xl border px-4 py-3 text-right"
            dir="rtl"
            value={filters.role}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                role: event.target.value,
              }))
            }
          >
            <option value="">כל התפקידים</option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="rounded-2xl border px-4 py-3 text-right"
            dir="rtl"
            value={filters.type}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                type: event.target.value,
              }))
            }
          >
            <option value="">כל הסוגים</option>
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-right">שם</th>
                <th className="px-4 py-3 text-right">אימייל</th>
                <th className="px-4 py-3 text-right">תפקיד</th>
                <th className="px-4 py-3 text-right">סטטוס</th>
                <th className="px-4 py-3 text-right">סוג</th>
                <th className="px-4 py-3 text-right">נוצר</th>
                <th className="px-4 py-3 text-right">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="border-t px-4 py-12 text-center text-slate-500">
                    טוען משתמשים...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="border-t px-4 py-12 text-center text-rose-700">
                    לא ניתן לטעון את המשתמשים
                  </td>
                </tr>
              ) : visibleUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border-t px-4 py-12 text-center text-slate-500">
                    אין משתמשים להצגה
                  </td>
                </tr>
              ) : (
                visibleUsers.map((user: any) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{user.fullName}</div>
                      <div className="text-xs text-slate-500">{user.phone || "ללא טלפון"}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {roleLabels[(user.role ?? "RENTER") as UserRole] ?? user.role}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {statusLabels[(user.status ?? "ACTIVE") as UserStatus] ?? user.status}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {typeLabels[(user.type ?? "NONE") as UserType] ?? user.type}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString("he-IL")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="secondary" onClick={() => startEdit(user)}>
                          עריכה
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => handleToggleStatus(user)}>
                          {user.status === "ACTIVE" ? "השבתה" : "הפעלה"}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          className="border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50"
                          onClick={() => handleDelete(user)}
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
      </Card>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl" dir="rtl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  {form.id ? "עריכת משתמש" : "יצירת משתמש"}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  מצב דמו: אפשר לערוך חופשי את נתוני המשתמש, המלווה והשוכר.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
                onClick={() => {
                  setIsModalOpen(false);
                  setForm(emptyForm);
                }}
              >
                סגירה
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <section className="grid gap-4 rounded-3xl border border-slate-200 p-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">שם מלא</span>
                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.fullName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, fullName: event.target.value }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">אימייל</span>
                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-left"
                    dir="ltr"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">טלפון</span>
                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-left"
                    dir="ltr"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, phone: event.target.value }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">תפקיד</span>
                  <select
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.role}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        role: event.target.value as UserRole,
                      }))
                    }
                  >
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">סטטוס</span>
                  <select
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value as UserStatus,
                      }))
                    }
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </section>

              <section className="grid gap-4 rounded-3xl border border-slate-200 p-4 md:grid-cols-2">
                <div className="md:col-span-2 text-base font-semibold text-slate-950">
                  פרופיל מלווה
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">שם תצוגה</span>
                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.lenderDisplayName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        lenderDisplayName: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">דירוג ממוצע</span>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.averageRating}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        averageRating: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">השכרות שהושלמו</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.completedTransactionsCount}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        completedTransactionsCount: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">ציון אמינות ידני</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.reliabilityScoreCached}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        reliabilityScoreCached: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">אחוז ביטולים (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.cancellationRate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        cancellationRate: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">אחוז החזרות באיחור (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.lateReturnRate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        lateReturnRate: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">אחוז תלונות (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.complaintRate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        complaintRate: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">ציון זמן תגובה (0-10)</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.responseTimeScore}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        responseTimeScore: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">רמת אימות מלווה</span>
                  <select
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.verificationLevel}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        verificationLevel: event.target
                          .value as UserFormState["verificationLevel"],
                      }))
                    }
                  >
                    <option value="BASIC">בסיסי</option>
                    <option value="VERIFIED">מאומת</option>
                    <option value="TRUSTED">מהימן</option>
                  </select>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">אודות</span>
                  <textarea
                    className="min-h-24 w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.lenderBio}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        lenderBio: event.target.value,
                      }))
                    }
                  />
                </label>
              </section>

              <section className="grid gap-4 rounded-3xl border border-slate-200 p-4 md:grid-cols-2">
                <div className="md:col-span-2 text-base font-semibold text-slate-950">
                  פרופיל שוכר
                </div>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">כתובת ברירת מחדל</span>
                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.renterDefaultAddressText}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        renterDefaultAddressText: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">אימות שוכר</span>
                  <select
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.renterVerificationStatus}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        renterVerificationStatus: event.target
                          .value as UserFormState["renterVerificationStatus"],
                      }))
                    }
                  >
                    <option value="UNVERIFIED">לא מאומת</option>
                    <option value="PENDING">ממתין</option>
                    <option value="VERIFIED">מאומת</option>
                    <option value="REJECTED">נדחה</option>
                  </select>
                </label>
              </section>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || createMutation.isPending}
                >
                  {updateMutation.isPending || createMutation.isPending
                    ? "שומר..."
                    : form.id
                      ? "שמירת שינויים"
                      : "יצירת משתמש"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    setForm(emptyForm);
                  }}
                >
                  ביטול
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
