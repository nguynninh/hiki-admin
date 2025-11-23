import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinComponentProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  wrapperClassName?: string;
  color?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const SpinComponent = ({
  size = "md",
  className,
  wrapperClassName,
  color,
  fullScreen = false,
}: SpinComponentProps) => {
  if (fullScreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 flex items-center justify-center bg-background/50 z-50",
          wrapperClassName
        )}
      >
        <Loader2
          className={cn("animate-spin", sizeClasses[size], className)}
          color={color}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center items-center", wrapperClassName)}>
      <Loader2
        className={cn("animate-spin", sizeClasses[size], className)}
        color={color}
      />
    </div>
  );
};

export default SpinComponent;
