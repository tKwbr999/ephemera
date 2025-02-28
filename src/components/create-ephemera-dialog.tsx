import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";

interface CreateEphemeraDialogProps {
  onCreateEphemera: (content: string) => void;
}

const CreateEphemeraDialog = ({
  onCreateEphemera,
}: CreateEphemeraDialogProps) => {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onCreateEphemera(content);
      setContent("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 left-1/2 transform -translate-x-1/2 h-14 w-14 rounded-full shadow-lg bg-abbey-900 hover:bg-abbey-800 text-white">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-abbey-200 dark:border-abbey-700">
        <DialogHeader>
          <DialogTitle>Create a new ephemera</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="What's your ephemera?"
            className="min-h-[100px] resize-none border-abbey-200 dark:border-abbey-700 focus-visible:ring-abbey-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="bg-abbey-900 hover:bg-abbey-800 text-white w-full"
          >
            Create Ephemera
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEphemeraDialog;
