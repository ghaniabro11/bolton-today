// hooks/useFileManager.ts
import { useState, useEffect, useCallback } from "react";
import { FileItem, FileManagerState } from "./fileManager";

export const useFileManager = () => {
  const [state, setState] = useState<FileManagerState>({
    currentPath: "",
    items: [],
    loading: true,
    error: null,
    searchTerm: "",
    viewMode: "grid",
  });

  const setCurrentPath = useCallback((path: string) => {
    setState((prev) => ({ ...prev, currentPath: path }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const setSearchTerm = useCallback((searchTerm: string) => {
    setState((prev) => ({ ...prev, searchTerm }));
  }, []);

  const setViewMode = useCallback((viewMode: "grid" | "table") => {
    setState((prev) => ({ ...prev, viewMode }));
  }, []);

  const fetchItems = useCallback(async (path: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        `/api/v1/files?path=${encodeURIComponent(path)}`,
        { cache: "no-store" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch items");
      }

      setState((prev) => ({ ...prev, items: data.items, loading: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Unknown error occurred",
        loading: false,
      }));
    }
  }, []);

  const navigateToFolder = useCallback(
    (path: string) => {
      setCurrentPath(path);
    },
    [setCurrentPath]
  );

  const navigateUp = useCallback(() => {
    if (state.currentPath) {
      const pathParts = state.currentPath.split("/").filter(Boolean);
      pathParts.pop();
      setCurrentPath(pathParts.length > 0 ? "/" + pathParts.join("/") : "");
    }
  }, [state.currentPath, setCurrentPath]);

  const createFolder = useCallback(
    async (folderName: string) => {
      if (!folderName.trim()) {
        setError("Folder name cannot be empty");
        return false;
      }

      try {
        const response = await fetch("/api/v1/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: folderName,
            path: state.currentPath,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create folder");
        }

        await fetchItems(state.currentPath);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create folder"
        );
        return false;
      }
    },
    [state.currentPath, fetchItems, setError]
  );

  const renameItem = useCallback(
    async (item: FileItem, newName: string) => {
      if (!newName.trim()) return false;

      try {
        const response = await fetch("/api/v1/files", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPath: item?.path,
            newName,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to rename item");
        }

        await fetchItems(state.currentPath);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to rename item");
        return false;
      }
    },
    [state.currentPath, fetchItems, setError]
  );
  const editItem = useCallback(
    async (
      item: FileItem,
      title?: string,
      caption?: string | null,
    ) => {
      try {
        const response = await fetch("/api/v1/files/edit", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: item?.id,
            title: title || item?.title, // Optional: Update title if provided
            caption: caption || item?.caption, // Optional: Update caption if provided
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update item");
        }

        await fetchItems(state.currentPath);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update item");
        return false;
      }
    },
    [state.currentPath, fetchItems, setError]
  );

  const deleteItem = useCallback(
    async (item: FileItem) => {
      if (!confirm(`Are you sure you want to delete ${item?.name}?`)) {
        return false;
      }

      try {
        const response = await fetch("/api/v1/files", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: item?.path, id: item?.id }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to delete item");
        }

        await fetchItems(state.currentPath);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete item");
        return false;
      }
    },
    [state.currentPath, fetchItems, setError]
  );

  const uploadFile = useCallback(
    async (
      file: File,
      title: string,
      slug: string,
      caption: string,
      type: "image" | "document"
    ) => {
      if (!title.trim() || !slug.trim()) {
        setError("Title and slug are required");
        return false;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", state.currentPath);
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("caption", caption);
      formData.append("type", type);

      try {
        const response = await fetch("/api/v1/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload file");
        }

        await fetchItems(state.currentPath);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload file");
        return false;
      }
    },
    [state.currentPath, fetchItems, setError]
  );

  useEffect(() => {
    fetchItems(state.currentPath);
  }, [state.currentPath, fetchItems]);

  return {
    ...state,
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
  };
};
