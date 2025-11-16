import { Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExpenseCardProps {
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  category: string;
  splitWith: number;
  yourShare: number;
}

const categoryColors: Record<string, string> = {
  food: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  transport: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  accommodation: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  entertainment: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  other: "bg-muted text-muted-foreground border-border",
};

export const ExpenseCard = ({
  description,
  amount,
  paidBy,
  date,
  category,
  splitWith,
  yourShare,
}: ExpenseCardProps) => {
  return (
    <Card className="card-glass animate-slide-up hover-lift">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-heading font-semibold text-lg">{description}</h4>
            <Badge
              variant="outline"
              className={cn("text-xs", categoryColors[category.toLowerCase()] || categoryColors.other)}
            >
              {category}
            </Badge>
          </div>

          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span>Paid by {paidBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{date}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-heading font-bold text-foreground">
            ₹{amount.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            split {splitWith} ways
          </p>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Your share</span>
          <span className="font-semibold text-primary flex items-center gap-1">
            ₹{yourShare.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
};
