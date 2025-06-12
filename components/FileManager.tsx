"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Archive,
  ChevronLeft,
  Edit,
  File,
  Folder,
  Grid,
  Image,
  List,
  MoreVertical,
  Music,
  Plus,
  Search,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modified: Date;
}

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [showFolderInput, setShowFolderInput] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");
  const [showRenameInput, setShowRenameInput] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // Dialog states
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  // Form states
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSlug, setUploadSlug] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchItems(currentPath);
  }, [currentPath]);

  const fetchItems = async (path: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/v1/files?path=${encodeURIComponent(path)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch items");
      }
      console.log(data.items, "sjjsj");
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
  };

  const navigateUp = () => {
    if (currentPath) {
      const pathParts = currentPath.split("/").filter(Boolean);
      pathParts.pop();
      setCurrentPath(pathParts.length > 0 ? "/" + pathParts.join("/") : "");
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/v1/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newFolderName,
          path: currentPath,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create folder");
      }

      setNewFolderName("");
      setShowFolderInput(false);
      fetchItems(currentPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create folder");
    }
  };

  const renameItem = async () => {
    if (!selectedItem || !renameValue.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/v1/files", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPath: selectedItem.path,
          newName: renameValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to rename item");
      }

      setShowRenameInput(false);
      setSelectedItem(null);
      fetchItems(currentPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename item");
    }
  };

  const deleteItem = async (item: FileItem) => {
    if (!confirm(`Are you sure you want to delete ${item?.name}?`)) {
      return;
    }

    try {
      const response = await fetch("/api/v1/files", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: item?.path,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete item");
      }

      fetchItems(currentPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  // Update the handleFileUpload function
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    if (!uploadTitle.trim() || !uploadSlug.trim()) {
      setError("Title and slug are required");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("path", currentPath);
    formData.append("title", uploadTitle);
    formData.append("slug", uploadSlug);
    formData.append("caption", uploadCaption);

    try {
      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file");
      }
     
      console.log("File upload successful, refreshing list...");
      await fetchItems(currentPath); // Add await here
      console.log("List refresh complete");

      // Reset all states after successful upload
      setSelectedFile(null);
      setUploadTitle("");
      setUploadSlug("");
      setUploadCaption("");
      setShowUploadDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    }
  };
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  

  useEffect(() => {
    fetchItems(currentPath);
  }, [currentPath]);

  const getFileIcon = (item: any) => {
    if (item?.isDirectory) {
      return <Folder className="h-5 w-5 text-blue-500" />;
    }

    switch (item?.fileType) {
      case "image":
        return <Image className="h-5 w-5 text-green-500" />;
      case "video":
        return <Video className="h-5 w-5 text-red-500" />;
      case "audio":
        return <Music className="h-5 w-5 text-purple-500" />;
      case "archive":
        return <Archive className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredItems = items.filter((item) =>
    item?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-backbg-background dark:text-white">
            File Manager
          </h1>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation Bar */}
        <Card className="mb-6 bg-sidebar">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2 flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateUp}
                  disabled={!currentPath}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                  <span>Root</span>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <span>/</span>
                      <span className="font-medium">{crumb}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <Card className="mb-6 bg-sidebar">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {/* Create Folder Dialog */}
              <Dialog
                open={showCreateFolderDialog}
                onOpenChange={setShowCreateFolderDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="folderName">Folder Name</Label>
                      <Input
                        id="folderName"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Enter folder name"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateFolderDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={createFolder}>Create Folder</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Upload File Dialog */}
              <Dialog
                open={showUploadDialog}
                onOpenChange={setShowUploadDialog}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="Enter title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={uploadSlug}
                        onChange={(e) =>
                          setUploadSlug(e.target.value.replace(/\s+/g, "-"))
                        }
                        placeholder="Enter slug"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="caption">Caption</Label>
                      <Input
                        id="caption"
                        value={uploadCaption}
                        onChange={(e) => setUploadCaption(e.target.value)}
                        placeholder="Enter caption (optional)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="file">File</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowUploadDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleFileUpload}>Upload</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Rename Dialog */}
        <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newName">New Name</Label>
                <Input
                  id="newName"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="Enter new name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRenameDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={renameItem}>Rename</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Content */}
        {loading ? (
          <Card className="bg-sidebar">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === "grid" ? (
              /* Grid View */
              <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredItems.map((item: any, index: any) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow cursor-pointer group bg-sidebar"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                          {item?.isDirectory ? (
                            <div
                              className="p-4 rounded-lg bg-blue-50 dark:bg-background"
                              onClick={() => navigateToFolder(item?.path)}
                            >
                              <Folder className="h-12 w-12 text-blue-500" />
                            </div>
                          ) : (
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-background">
                              {getFileIcon(item)}
                            </div>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item);
                                  setRenameValue(item?.name);
                                  setShowRenameDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteItem(item)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="text-center w-full">
                          <p
                            className="font-medium text-sm truncate"
                            title={item?.name}
                          >
                            {item?.name}
                          </p>
                          <div className="flex items-center justify-center space-x-2 mt-1">
                            {item?.isDirectory && (
                              <Badge variant="secondary" className="text-xs">
                                {item?.itemCount} items
                              </Badge>
                            )}
                            {!item?.isDirectory && (
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
                {filteredItems.length === 0 && (
                  <div className="col-span-full">
                    <Card className="bg-sidebar">
                      <CardContent className="p-8 text-center">
                        <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No files or folders found
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              /* Table View */
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
                    {filteredItems.map((item: any, index: any) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getFileIcon(item)}
                            <div>
                              {item?.isDirectory ? (
                                <Button
                                  variant="link"
                                  onClick={() => navigateToFolder(item?.path)}
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
                          <Badge
                            variant={item?.isDirectory ? "default" : "secondary"}
                          >
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item);
                                  setRenameValue(item?.name);
                                  setShowRenameDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteItem(item)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredItems.length === 0 && (
                      <TableRow className="bg-sidebar">
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <Folder className="h-8 w-8 text-gray-400" />
                            <p className="text-gray-500">
                              No files or folders found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
