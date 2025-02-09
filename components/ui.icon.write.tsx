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

export default function WriteIcon({
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
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      {...props}
    >
      <path
        d="M9.749 18.25H18.749M14.125 1.87198C14.5231 1.47389 15.063 1.25024 15.626 1.25024C16.189 1.25024 16.7289 1.47389 17.127 1.87198C17.5251 2.27007 17.7487 2.80999 17.7487 3.37298C17.7487 3.93596 17.5251 4.47589 17.127 4.87398L5.117 16.885C4.8791 17.1229 4.58502 17.2969 4.262 17.391L1.39 18.229C1.30395 18.2541 1.21274 18.2556 1.12591 18.2333C1.03908 18.2111 0.959827 18.1659 0.896447 18.1025C0.833066 18.0392 0.787889 17.9599 0.765643 17.8731C0.743398 17.7862 0.744903 17.695 0.77 17.609L1.608 14.737C1.70222 14.4143 1.87625 14.1206 2.114 13.883L14.125 1.87198Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
