import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export interface EphemeraItem {
  id: string;
  content: string;
  createdAt: Date;
  lastInteraction: Date;
  interestLevel: number;
}

interface EphemeraItemProps {
  ephemera: EphemeraItem;
  onInteract: (id: string) => void;
}

const EphemeraItem = ({ ephemera, onInteract }: EphemeraItemProps) => {
  const [opacity, setOpacity] = useState(1);
  const [gradientStyle, setGradientStyle] = useState({});

  useEffect(() => {
    // Calculate opacity based on interest level
    setOpacity(0.3 + (ephemera.interestLevel / 100) * 0.7);

    // Calculate gradient based on interest level
    // As interest level decreases, the ephemera becomes more white (fades away)
    const blackOpacity = ephemera.interestLevel / 100;

    // Use separate properties instead of shorthand to avoid React warnings
    setGradientStyle({
      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, ${blackOpacity}), rgba(255, 255, 255, ${
        1 - blackOpacity
      }))`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      color: "transparent", // Use color: transparent instead of textFillColor
    });
  }, [ephemera.interestLevel]);

  const handleInteract = () => {
    onInteract(ephemera.id);
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer",
        "border-abbey-300 dark:border-abbey-700 h-full"
      )}
      style={{ opacity }}
      onClick={handleInteract}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-abbey-50 to-white dark:from-abbey-800 dark:to-abbey-900 opacity-50"></div>
      <CardContent className="relative p-6 flex flex-col items-center text-center h-full">
        <div className="mb-4 flex flex-col items-center justify-between w-full">
          <div className="text-xs text-abbey-500 dark:text-abbey-400 mb-1">
            Created {formatDistanceToNow(ephemera.createdAt)} ago
          </div>
          <div className="text-xs text-abbey-500 dark:text-abbey-400">
            Last interaction {formatDistanceToNow(ephemera.lastInteraction)} ago
          </div>
        </div>
        <p
          className="mb-4 text-lg font-medium text-abbey-900 dark:text-abbey-50 flex-grow"
          style={gradientStyle}
        >
          {ephemera.content}
        </p>
        <div className="mt-4 w-full">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-abbey-500 dark:text-abbey-400">
              Interest Level
            </span>
            <span className="text-xs font-medium text-abbey-700 dark:text-abbey-300">
              {ephemera.interestLevel}%
            </span>
          </div>
          <Progress value={ephemera.interestLevel} className="h-1" />
        </div>
      </CardContent>
    </Card>
  );
};

export default EphemeraItem;

export { EphemeraItem };
