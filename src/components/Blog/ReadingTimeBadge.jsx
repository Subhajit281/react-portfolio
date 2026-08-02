import { Clock } from "lucide-react";

export default function ReadingTimeBadge({ minutes, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      <Clock className="w-3.5 h-3.5" />
      {minutes} min read
    </span>
  );
}
