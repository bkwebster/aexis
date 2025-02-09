"use client";

import { cn } from "@/lib/utils";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
}

const sizes = {
  xs: 10,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
};

export default function AexisIcon({
  className,
  size = "md",
  ...props
}: IconProps) {
  const dimension = typeof size === "number" ? size : sizes[size];
  const height = (dimension / 16) * 8; // maintain aspect ratio

  const handleClick = () => {
    // The SVG code to copy - using template literal to preserve formatting
    const svgCode = `<svg width="${dimension}" height="${height}" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.0947 0.332563L15.6674 0.896074C15.7968 1.01617 16 1.20092 16 1.54273V7.3903H14.7621V4.32333L1.83834 4.31409L1.23788 4.92379V7.3903H0V4.61894C0 4.27714 0.203233 4.09238 0.332564 3.97229L0.905312 3.40878C1.03464 3.27945 1.20092 3.07621 1.54273 3.07621L14.7621 3.08545V1.84757L14.1524 1.22864H0V0H14.4573C14.7991 0 14.9654 0.203233 15.0947 0.332563Z" fill="currentColor" />
</svg>`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(svgCode)
      .then(() => {
        toast("SVG Copied", {
          icon: <CopyIcon size={16} />,
          description: "The SVG code has been copied to your clipboard.",
          duration: 1000,
          action: {
            label: "Undo",
            onClick: () => {
              // Clear clipboard (by copying empty string)
              navigator.clipboard.writeText("");
              toast.success("Clipboard cleared", { duration: 1000 });
            },
          },
        });
      })
      .catch(() => {
        toast.error("Failed to copy", {
          description: "Please try again or copy manually.",
          duration: 1000,
        });
      });
  };

  return (
    <svg
      width={dimension}
      height={height}
      viewBox="0 0 16 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "text-foreground cursor-pointer hover:opacity-80",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <title>Copy Logo as SVG</title>
      <path
        d="M15.0947 0.332563L15.6674 0.896074C15.7968 1.01617 16 1.20092 16 1.54273V7.3903H14.7621V4.32333L1.83834 4.31409L1.23788 4.92379V7.3903H0V4.61894C0 4.27714 0.203233 4.09238 0.332564 3.97229L0.905312 3.40878C1.03464 3.27945 1.20092 3.07621 1.54273 3.07621L14.7621 3.08545V1.84757L14.1524 1.22864H0V0H14.4573C14.7991 0 14.9654 0.203233 15.0947 0.332563Z"
        fill="currentColor"
      />
    </svg>
  );
}
