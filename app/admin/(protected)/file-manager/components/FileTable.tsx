import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Folder, MoreVertical, Trash2 } from "lucide-react";
import { FileItem } from "../fileManager";
import { formatDate, formatSize, getFileIcon } from "../fileUtils";

interface FileTableProps {
  items: FileItem[];
  onNavigateToFolder: (path: string) => void;
  onRenameItem: (item: FileItem) => void;
  onDeleteItem: (item: FileItem) => void;
  onItemClick: (item: FileItem) => void;
}

export const FileTable: React.FC<FileTableProps> = ({
  items,
  onNavigateToFolder,
  onRenameItem,
  onDeleteItem,
  onItemClick,
}) => {
  return (
    <Card className="bg-sidebar">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow className="bg-sidebar">
              <TableCell colSpan={5} className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <Folder className="h-8 w-8 text-gray-400" />
                  <p className="text-gray-500">No files or folders found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={index} onClick={() => onItemClick(item)}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {getFileIcon(item)}
                    <div>
                      {item?.isDirectory ? (
                        <Button
                          variant="link"
                          onClick={() => onNavigateToFolder(item?.path)}
                          className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                        >
                          {item?.name}
                        </Button>
                      ) : (
                        <span className="font-medium">{item?.name}</span>
                      )}
                      {item?.isDirectory && (
                        <div className="text-xs text-gray-500">
                          {item?.itemCount} items
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item?.isDirectory ? "default" : "secondary"}>
                    {item?.isDirectory ? "Folder" : "File"}
                  </Badge>
                </TableCell>
                <TableCell>{formatSize(item?.size)}</TableCell>
                <TableCell>{formatDate(item?.modified)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onRenameItem(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Rename
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
