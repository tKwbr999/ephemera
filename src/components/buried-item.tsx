import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { EphemeraItem } from "@/types/ephemera";
import { calculateBurialDepth, createTextGradientStyle } from "@/lib/utils/ephemera-calculator";

interface BuriedEphemeraItemProps {
  ephemera: EphemeraItem;
}

const BuriedEphemeraItem = ({ ephemera }: BuriedEphemeraItemProps) => {
  // Calculate how deep the ephemera is buried
  const buriedDepth = calculateBurialDepth(ephemera.lastInteraction);

  // Create a gradient style for the text based on burial depth
  const textStyle = createTextGradientStyle(buriedDepth);

  return (
    <Card className="relative overflow-hidden border-abbey-300 dark:border-abbey-700 opacity-70 h-full">
      <div
        className="absolute inset-0 bg-gradient-to-t from-abbey-300 to-transparent dark:from-abbey-800"
        style={{ height: `${buriedDepth * 100}%`, bottom: 0 }}
      ></div>
      <CardContent className="relative p-6 flex flex-col items-center text-center h-full">
        <div className="mb-4 flex flex-col items-center justify-between w-full">
          <div className="text-xs text-abbey-500 dark:text-abbey-400 mb-1">
            Created {formatDistanceToNow(ephemera.createdAt)} ago
          </div>
          <div className="text-xs text-abbey-500 dark:text-abbey-400">
            Buried {formatDistanceToNow(ephemera.lastInteraction)} ago
          </div>
        </div>
        <p
          className="mb-4 text-lg font-medium text-abbey-900 dark:text-abbey-50 flex-grow"
          style={textStyle}
        >
          {ephemera.content}
        </p>
        <div className="mt-4 text-xs text-abbey-500 dark:text-abbey-400">
          This ephemera has returned to the void.
        </div>
      </CardContent>
    </Card>
  );
};

export default BuriedEphemeraItem;
