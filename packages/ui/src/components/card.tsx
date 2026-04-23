import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../lib/utils";

export const Card = ({
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div
    className={cn(
      "rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]",
      className,
    )}
    {...props}
  />
);
