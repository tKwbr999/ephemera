import { Button } from "@/components/ui/button";

interface DebugModeDisplayProps {
  handleDebugLogin: () => void;
}

const DebugModeDisplay: React.FC<DebugModeDisplayProps> = ({
  handleDebugLogin,
}) => {
  return (
    <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Debug Mode
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Login required</p>
      <Button
        onClick={handleDebugLogin}
        className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white"
      >
        Use Debug Login
      </Button>
    </div>
  );
};

export default DebugModeDisplay;
