
import { cn } from "@/lib/utils";

interface HealthScoreProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export const HealthScore = ({ 
  score, 
  showLabel = true, 
  size = "md" 
}: HealthScoreProps) => {
  const getScoreClass = (score: number) => {
    if (score >= 80) return "health-score-excellent";
    if (score >= 60) return "health-score-good";
    if (score >= 40) return "health-score-neutral";
    if (score >= 20) return "health-score-attention";
    return "health-score-critical";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Neutral";
    if (score >= 20) return "Needs Attention";
    return "Critical";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-md font-medium",
        getScoreClass(score),
        sizeClasses[size]
      )}
    >
      {score}
      {showLabel && <span className="ml-1">- {getScoreLabel(score)}</span>}
    </div>
  );
};
