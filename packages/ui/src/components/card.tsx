import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../lib/utils";

export const Card = ({
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div
    className={cn(
      "card p-5",
      className,
    )}
    {...props}
  />
);
