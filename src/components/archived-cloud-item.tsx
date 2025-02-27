import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { CloudItem } from '@/components/cloud-item';
import { config } from '@/lib/config';

interface ArchivedCloudItemProps {
  cloud: CloudItem;
}

const ArchivedCloudItem = ({ cloud }: ArchivedCloudItemProps) => {
  // Calculate minutes since archived
  const minutesSinceArchived = Math.floor(
    (new Date().getTime() - cloud.lastInteraction.getTime()) / (1000 * 60)
  );
  
  // Calculate how deep the cloud is buried based on minutes since archived
  // Use the configured lifetime as the basis for maximum burial
  const buriedDepth = Math.min(minutesSinceArchived / config.cloudLifetimeMinutes, 1);
  
  // Create a gradient from black to white based on burial depth
  // Use separate properties instead of shorthand to avoid React warnings
  const textStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, ${1 - buriedDepth}), rgba(255, 255, 255, ${buriedDepth}))`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent' // Use color: transparent instead of textFillColor
  };
  
  return (
    <Card className="relative overflow-hidden border-abbey-300 dark:border-abbey-700 opacity-70 h-full">
      <div 
        className="absolute inset-0 bg-gradient-to-t from-abbey-300 to-transparent dark:from-abbey-800"
        style={{ height: `${buriedDepth * 100}%`, bottom: 0 }}
      ></div>
      <CardContent className="relative p-6 flex flex-col items-center text-center h-full">
        <div className="mb-4 flex flex-col items-center justify-between w-full">
          <div className="text-xs text-abbey-500 dark:text-abbey-400 mb-1">
            Created {formatDistanceToNow(cloud.createdAt)} ago
          </div>
          <div className="text-xs text-abbey-500 dark:text-abbey-400">
            Archived {formatDistanceToNow(cloud.lastInteraction)} ago
          </div>
        </div>
        <p 
          className="mb-4 text-lg font-medium text-abbey-900 dark:text-abbey-50 flex-grow"
          style={textStyle}
        >
          {cloud.content}
        </p>
        <div className="mt-4 text-xs text-abbey-500 dark:text-abbey-400">
          This idea has returned to the earth.
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchivedCloudItem;