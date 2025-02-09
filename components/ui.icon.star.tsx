import { cn } from "@/lib/utils";

interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
}

const sizes = {
  xs: 9,
  sm: 12,
  md: 16,
  lg: 18,
  xl: 24,
};

export default function StarIcon({
  className,
  size = "md",
  ...props
}: StarIconProps) {
  const dimension = typeof size === "number" ? size : sizes[size];
  const height = (dimension / 100) * 100; // maintain aspect ratio

  return (
    <svg
      width={dimension}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      {...props}
    >
      <path
        d="M50 0L59.8995 40.1005L100 50L59.8995 59.8995L50 100L40.1005 59.8995L0 50L40.1005 40.1005L50 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
