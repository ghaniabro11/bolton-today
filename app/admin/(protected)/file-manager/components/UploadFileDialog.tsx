// components/dialogs/UploadFileDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UploadFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadFile: (
    file: File,
    title: string,
    slug: string,
    caption: string,
    type: "image" | "document"
  ) => Promise<boolean>;
}

export const UploadFileDialog: React.FC<UploadFileDialogProps> = ({
  open,
  onOpenChange,
  onUploadFile,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    caption: "",
    file: null as File | null,
    type: "image" as "image" | "document",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState<string>("");

  const validateFile = (file: File, type: "image" | "document") => {
    if (type === "image") {
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validImageTypes.includes(file.type)) {
        setFileError(
          "Please upload a valid image file (JPEG, PNG, GIF, or WebP)"
        );
        return false;
      }
    } else if (type === "document") {
      if (file.type !== "application/pdf") {
        setFileError("Please upload a PDF file");
        return false;
      }
    }
    setFileError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    if (!validateFile(formData.file, formData.type)) {
      return;
    }

    setIsLoading(true);

    const success = await onUploadFile(
      formData.file,
      formData.title,
      formData.slug,
      formData.caption,
      formData.type as "image" | "document"
    );

    if (success) {
      setFormData({
        title: "",
        slug: "",
        caption: "",
        file: null,
        type: "image",
      });
      onOpenChange(false);
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "slug" ? value.replace(/\s+/g, "-") : value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && !validateFile(file, formData.type)) {
      e.target.value = ""; // Reset the input
      return;
    }
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleTypeChange = (value: "image" | "document") => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      file: null, // Reset file when type changes
    }));
    setFileError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <form>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Alt Text</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter alt text"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="Enter slug"
                required
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => handleInputChange("caption", e.target.value)}
                placeholder="Enter caption (optional)"
              />
            </div>
            {/* <div>
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    file: e.target.files?.[0] || null,
                  }))
                }
                required
              />
            </div> */}
            <div>
              <Label htmlFor="type">File Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="document">Document (PDF)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept={
                  formData.type === "image" ? "image/*" : "application/pdf"
                }
                required
              />
              {fileError && (
                <p className="text-sm text-red-500 mt-1">{fileError}</p>
              )}
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
            <Button disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
