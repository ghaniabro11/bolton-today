// components/dialogs/EditDialogue.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { FileItem } from "../fileManager";

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FileItem | null;
  onEditItem: (
    item: FileItem,
    title?: string,
    caption?: string | null
  ) => Promise<boolean>;
}

export const EditDialogue: React.FC<RenameDialogProps> = ({
  open,
  onOpenChange,
  item,
  onEditItem,
}) => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(item, "item for edit");
  useEffect(() => {
    if (item) {
      setTitle(item?.title || "");
      setCaption(item?.caption || null);
    }
  }, [item]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setIsLoading(true);

    const success = await onEditItem(item, title, caption);
    if (success) {
      onOpenChange(false);
      // console.log("Updated data:", { newName, slug, title, caption });
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                required
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={caption || ""}
                onChange={(e) => setCaption(e.target.value || null)}
                placeholder="Enter caption (optional)"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
