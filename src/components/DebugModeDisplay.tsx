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
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        Auth is active in debug mode
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
        For quick testing without auth:
      </p>
      <Button
        onClick={handleDebugLogin}
        className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white"
      >
        User Debug Login
      </Button>
    </div>
  );
};

export default DebugModeDisplay;
