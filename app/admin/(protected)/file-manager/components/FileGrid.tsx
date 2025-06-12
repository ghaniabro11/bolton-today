// components/FileGrid.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Folder, MoreVertical, Trash2 } from "lucide-react";
import { FileItem } from "../fileManager";
import { formatSize, getFileIcon } from "../fileUtils";

interface FileGridProps {
  items: FileItem[];
  onNavigateToFolder: (path: string) => void;
  onRenameItem: (item: FileItem) => void;
  onEditItem: (item: FileItem) => void;
  onDeleteItem: (item: FileItem) => void;
  onItemClick: (item: FileItem) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({
  items,
  onNavigateToFolder,
  onRenameItem,
  onEditItem,
  onDeleteItem,
  onItemClick,
}) => {
  if (items.length === 0) {
    return (
      <Card className="bg-sidebar">
        <CardContent className="p-8 text-center">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No files or folders found</p>
        </CardContent>
      </Card>
    );
  }
  console.log(items, "itemsss");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {items.map((item, index) => (
        <Card
          key={index}
          onClick={() => onItemClick(item)}
          className="hover:shadow-lg py-0 transition-shadow cursor-pointer group bg-sidebar relative overflow-hidden"
        >
          {/* Dropdown menu positioned absolutely on top right */}
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRenameItem(item)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditItem(item)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteItem(item)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardContent className="p-0">
            <div className="flex flex-col items-center">
              {/* Display image or folder icon full width */}
              <div className="w-full h-40 flex items-center justify-center bg-gray-50 dark:bg-background">
                {item?.isDirectory ? (
                  <div onClick={() => onNavigateToFolder(item?.path)}>
                    <Folder className="h-20 w-20 text-primary" />
                  </div>
                ) : item?.type === "image" ? (
                  <img
                    src={`${item?.filePath}`}
                    alt={item?.title}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  getFileIcon(item)
                )}
              </div>

              {/* Item name and metadata */}
              <div className="text-center w-full px-2 py-2 bg-sidebar">
                <p className="font-medium text-sm truncate" title={item?.name}>
                  {item?.name}
                </p>
                <div className="flex items-center justify-center space-x-2 mt-1">
                  {item?.isDirectory ? (
                    <Badge variant="secondary" className="text-xs">
                      {item?.itemCount} items
                    </Badge>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {formatSize(item?.size)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
