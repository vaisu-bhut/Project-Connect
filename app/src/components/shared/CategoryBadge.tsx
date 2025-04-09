
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  name: string;
  color?: string;
  className?: string;
}

export const CategoryBadge = ({ 
  name, 
  color,
  className 
}: CategoryBadgeProps) => {
  // Choose class based on category name if no color provided
  const getCategoryClass = (categoryName: string) => {
    if (!categoryName) return "nexus-category-other";
    
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes("work") || lowerName.includes("colleague")) return "nexus-category-work";
    if (lowerName.includes("personal") || lowerName.includes("friend") || lowerName.includes("family")) return "nexus-category-personal";
    if (lowerName.includes("community") || lowerName.includes("volunteer")) return "nexus-category-community";
    if (lowerName.includes("mentor")) return "nexus-category-mentors";
    if (lowerName.includes("network")) return "nexus-category-network";
    return "nexus-category-other";
  };

  return (
    <span 
      className={cn(
        "nexus-category-tag",
        !color && getCategoryClass(name),
        className
      )}
      style={color ? { backgroundColor: color, color: '#000' } : undefined}
    >
      {name}
    </span>
  );
};
