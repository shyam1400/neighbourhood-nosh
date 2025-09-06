import { useState } from "react";
import { Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type DeliveryMode = "fastest" | "trusted";

interface DeliveryModeToggleProps {
  mode: DeliveryMode;
  onModeChange: (mode: DeliveryMode) => void;
}

export function DeliveryModeToggle({ mode, onModeChange }: DeliveryModeToggleProps) {
  return (
    <Card className="p-1 bg-muted/50">
      <div className="flex gap-1">
        <Button
          variant={mode === "fastest" ? "default" : "ghost"}
          onClick={() => onModeChange("fastest")}
          className={`flex-1 flex items-center gap-2 ${
            mode === "fastest" 
              ? "bg-gradient-primary text-primary-foreground shadow-medium" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-4 h-4" />
          Fastest Delivery
        </Button>
        <Button
          variant={mode === "trusted" ? "default" : "ghost"}
          onClick={() => onModeChange("trusted")}
          className={`flex-1 flex items-center gap-2 ${
            mode === "trusted"
              ? "bg-gradient-trusted text-trusted-foreground shadow-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className="w-4 h-4" />
          Trusted Shop
        </Button>
      </div>
    </Card>
  );
}