import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function UISkeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}
