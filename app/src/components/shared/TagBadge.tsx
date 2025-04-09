
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TagBadgeProps {
  name: string;
  color?: string;
  className?: string;
  onRemove?: () => void;
  clickable?: boolean;
  onClick?: () => void;
}

export const TagBadge = ({ 
  name, 
  color = "#9b87f5",
  className,
  onRemove,
  clickable = false,
  onClick
}: TagBadgeProps) => {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white",
        clickable && "cursor-pointer hover:opacity-90",
        className
      )}
      style={{ backgroundColor: color }}
      onClick={clickable ? onClick : undefined}
    >
      {name}
      {onRemove && (
        <button 
          className="ml-1 rounded-full p-0.5 hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};
