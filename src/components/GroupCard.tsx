import { Users, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GroupCardProps {
  name: string;
  members: number;
  balance: number;
  lastActivity: string;
  onClick: () => void;
}

export const GroupCard = ({ name, members, balance, lastActivity, onClick }: GroupCardProps) => {
  const isPositive = balance >= 0;

  return (
    <Card
      className="card-glass hover-lift cursor-pointer animate-scale-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading text-xl font-semibold mb-1">{name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{members} members</span>
          </div>
        </div>
        {isPositive ? (
          <TrendingUp className="w-5 h-5 text-success" />
        ) : (
          <TrendingDown className="w-5 h-5 text-destructive" />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Your balance</p>
          <p
            className={cn(
              "text-2xl font-heading font-bold",
              isPositive ? "text-success" : "text-destructive"
            )}
          >
            {isPositive ? "+" : ""}₹{Math.abs(balance).toFixed(2)}
          </p>
        </div>

        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">{lastActivity}</p>
        </div>
      </div>
    </Card>
  );
};
