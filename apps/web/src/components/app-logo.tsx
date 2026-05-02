import Image from "next/image";

export function AppLogo({
  size,
  priority = false,
  className,
}: {
  size: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/logos/2.png"
      alt="RentMatch"
      width={size}
      height={size}
      priority={priority}
      className={className}
      unoptimized
    />
  );
}
