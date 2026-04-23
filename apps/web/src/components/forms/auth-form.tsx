"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@rental/types";
import { Button, Card } from "@rental/ui";
import { api } from "../../lib/api";

const redirectByRole = (role: string) => {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }

  if (role === "LENDER") {
    return "/lender/dashboard";
  }

  return "/renter/dashboard";
};

function AuthPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mx-auto max-w-xl space-y-6 p-6 md:p-8">
      <div>
        <div className="surface-eyebrow">Access</div>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">{subtitle}</p>
      </div>
      {children}
    </Card>
  );
}

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@rentmatch.local",
      password: "Password123!",
    },
  });

  const mutation = useMutation({
    mutationFn: api.login,
    onSuccess: (result: any) => {
      setError(null);
      router.push(redirectByRole(result.user.role));
      router.refresh();
    },
    onError: () => {
      setError("ההתחברות נכשלה. בדקו את האימייל והסיסמה ונסו שוב.");
    },
  });

  return (
    <AuthPanel
      title="כניסה לחשבון"
      subtitle="גישה לחיפושי bundle, תוצאות מדורגות, הזמנות ולוחות בקרה לפי תפקיד."
    >
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <div>
          <label className="form-label">אימייל</label>
          <input className="form-input" {...form.register("email")} />
        </div>
        <div>
          <label className="form-label">סיסמה</label>
          <input className="form-input" type="password" {...form.register("password")} />
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" className="w-full py-3">
          {mutation.isPending ? "מתחבר..." : "כניסה"}
        </Button>
      </form>
    </AuthPanel>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "RENTER",
    },
  });

  const mutation = useMutation({
    mutationFn: api.register,
    onSuccess: (result: any) => {
      setError(null);
      router.push(redirectByRole(result.user.role));
      router.refresh();
    },
    onError: () => {
      setError("הרישום נכשל. נסו שוב עם פרטים תקינים.");
    },
  });

  return (
    <AuthPanel
      title="פתיחת חשבון"
      subtitle="רישום כמזמין או כמלווה, עם המשך ישיר ללוח הבקרה הרלוונטי."
    >
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <div>
          <label className="form-label">שם מלא</label>
          <input className="form-input" {...form.register("fullName")} />
        </div>
        <div>
          <label className="form-label">אימייל</label>
          <input className="form-input" {...form.register("email")} />
        </div>
        <div>
          <label className="form-label">טלפון</label>
          <input className="form-input" {...form.register("phone")} />
        </div>
        <div>
          <label className="form-label">סיסמה</label>
          <input className="form-input" type="password" {...form.register("password")} />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">תפקיד</label>
          <select className="form-select" {...form.register("role")}>
            <option value="RENTER">מזמין</option>
            <option value="LENDER">מלווה</option>
          </select>
        </div>
        {error ? <p className="text-sm text-rose-600 md:col-span-2">{error}</p> : null}
        <div className="md:col-span-2">
          <Button type="submit" className="w-full py-3">
            {mutation.isPending ? "יוצר חשבון..." : "יצירת חשבון"}
          </Button>
        </div>
      </form>
    </AuthPanel>
  );
}
