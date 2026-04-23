import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../lib/utils";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
  }
>;

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
      variantClasses[variant],
      className,
    )}
    {...props}
  />
);
