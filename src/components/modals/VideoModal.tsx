import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { useState } from "react";

interface VideoModalProps {
  trigger?: React.ReactNode;
  videoId?: string;
  title?: string;
}

const VideoModal = ({ 
  trigger, 
  videoId = "dQw4w9WgXcQ", // Default YouTube video ID
  title = "ArtBridge Demo" 
}: VideoModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <Button variant="outline" size="lg" className="text-lg px-8 py-4">
      <Play className="mr-2 h-5 w-5" />
      Watch Demo
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 bg-background border-border">
        <div className="relative aspect-video w-full">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;