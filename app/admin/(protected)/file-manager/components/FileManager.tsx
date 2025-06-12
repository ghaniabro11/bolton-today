// components/FileManager.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFileManager } from "../useFileManager";
import { FileManagerHeader } from "./FileManagerHeader";
import { NavigationBar } from "./NavigationBar";
import { ActionBar } from "./ActionBar";
import { FileGrid } from "./FileGrid";
import { FileTable } from "./FileTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { UploadFileDialog } from "./UploadFileDialog";
import { RenameDialog } from "./RenameDialog";
import { FileItem } from "../fileManager";
import { EditDialogue } from "./EditDialogue";
// Add to the component props
interface FileManagerProps {
  onSelect?: (item: FileItem) => void;
}

export default function FileManager({ onSelect }: FileManagerProps) {
  // File manager state and actions
  const {
    currentPath,
    items,
    loading,
    error,
    searchTerm,
    viewMode,
    setSearchTerm,
    setViewMode,
    navigateToFolder,
    navigateUp,
    createFolder,
    renameItem,
    deleteItem,
    uploadFile,
    setError,
    editItem,
  } = useFileManager();

  // Dialog states
  const [dialogStates, setDialogStates] = useState({
    createFolder: false,
    uploadFile: false,
    rename: false,
    edit: false,
  });

  // Selected item for rename
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);

  // Memoized filtered items for performance
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // Dialog handlers
  const openDialog = (dialogName: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [dialogName]: true }));
  };

  const closeDialog = (dialogName: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [dialogName]: false }));
    if (dialogName === "rename") {
      setSelectedItem(null);
    }
  };

  const handleRenameClick = (item: FileItem) => {
    setSelectedItem(item);
    openDialog("rename");
  };
  const handleEditClick = (item: FileItem) => {
    setSelectedItem(item);
    openDialog("edit");
  };

  // Clear error handler
  const clearError = () => setError(null);

  const handleItemClick = (item: FileItem) => {
    if (item?.isDirectory) {
      navigateToFolder(item?.path);
    } else if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <FileManagerHeader viewMode={viewMode} onViewModeChange={setViewMode} />

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={clearError}
                  className="ml-4 text-sm underline hover:no-underline"
                >
                  Dismiss
                </button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Bar */}
        <NavigationBar
          currentPath={currentPath}
          searchTerm={searchTerm}
          onNavigateUp={navigateUp}
          onSearchChange={setSearchTerm}
        />

        {/* Action Bar */}
        <ActionBar
          onCreateFolder={() => openDialog("createFolder")}
          onUploadFile={() => openDialog("uploadFile")}
        />

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : viewMode === "grid" ? (
          <FileGrid
            items={filteredItems}
            onNavigateToFolder={navigateToFolder}
            onRenameItem={handleRenameClick}
            onEditItem={handleEditClick}
            onDeleteItem={deleteItem}
            onItemClick={handleItemClick}
          />
        ) : (
          <FileTable
            items={filteredItems}
            onNavigateToFolder={navigateToFolder}
            onRenameItem={handleRenameClick}
            onDeleteItem={deleteItem}
            onItemClick={handleItemClick}
          />
        )}

        {/* Dialogs */}
        <CreateFolderDialog
          open={dialogStates.createFolder}
          onOpenChange={(open) => closeDialog("createFolder")}
          onCreateFolder={createFolder}
        />

        <UploadFileDialog
          open={dialogStates.uploadFile}
          onOpenChange={(open) => closeDialog("uploadFile")}
          onUploadFile={uploadFile}
        />

        <RenameDialog
          open={dialogStates.rename}
          onOpenChange={(open) => closeDialog("rename")}
          item={selectedItem}
          onRenameItem={renameItem}
        />
        <EditDialogue
          open={dialogStates.edit}
          onOpenChange={(open) => closeDialog("edit")}
          item={selectedItem}
          onEditItem={editItem}
        />
      </div>
    </div>
  );
}
