"use client";
import { useState } from "react";
import {
  Download,
  Upload,
  Database,
  Image,
  FileJson,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { notFound, usePathname } from "next/navigation";

export default function DatabaseManager() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [includeImages, setIncludeImages] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const pathname = usePathname();
  // if (pathname === "/admin/db") return notFound();
  const handleExport = async () => {
    setIsExporting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `/api/v1/db/export?includeImages=${includeImages}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.details || "Export failed"
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Determine filename based on content type
      const contentType = response.headers.get("content-type");
      const isZip = contentType?.includes("zip") || includeImages;
      const filename = isZip
        ? `db-backup-${Date.now()}.zip`
        : `db-backup-${Date.now()}.json`;

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({
        type: "success",
        text: `Database exported successfully! ${
          includeImages
            ? "(ZIP format with images)"
            : "(JSON format, database only)"
        }`,
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: `Export failed: ${error.message || "Unknown error occurred"}`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".json") && !fileName.endsWith(".zip")) {
      setMessage({
        type: "error",
        text: "Invalid file type. Please upload a .json or .zip file.",
      });
      e.target.value = "";
      return;
    }

    // Validate file size (500MB limit)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      setMessage({
        type: "error",
        text: `File size exceeds maximum allowed size of ${
          maxSize / 1024 / 1024
        }MB.`,
      });
      e.target.value = "";
      return;
    }

    setIsImporting(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/v1/db/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || "Import failed");
      }

      const stats = result.stats || {};
      const statsText = result.totalRecords
        ? `\n\nImported: ${stats.users || 0} users, ${
            stats.media || 0
          } media, ${stats.categories || 0} categories, ${
            stats.authors || 0
          } authors, ${stats.news || 0} news, ${stats.magzines || 0} magazines${
            result.imagesRestored
              ? `\nRestored: ${result.imagesRestored} images`
              : ""
          }\nTotal records: ${result.totalRecords || 0}`
        : "";

      setMessage({
        type: "success",
        text: `Database imported successfully!${statsText}`,
      });

      // Reset file input
      e.target.value = "";
    } catch (error: any) {
      setMessage({
        type: "error",
        text: `Import failed: ${error.message || "Unknown error occurred"}`,
      });
      // Reset file input on error
      e.target.value = "";
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Database className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-800">
              Database Manager
            </h1>
          </div>

          {/* Alert Message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <p
                className={`text-sm whitespace-pre-line ${
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          {/* Export Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                Export Database
              </h2>
            </div>

            <p className="text-slate-600 mb-4">
              Download a complete backup of your database. Choose whether to
              include media files.
            </p>

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Include images and media files
                  {includeImages && (
                    <span className="text-xs text-slate-500">(ZIP format)</span>
                  )}
                  {!includeImages && (
                    <span className="text-xs text-slate-500">
                      (JSON format)
                    </span>
                  )}
                </span>
              </label>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isExporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export Database
                </>
              )}
            </button>
          </div>

          {/* Import Section */}
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                Import Database
              </h2>
            </div>

            <div className="mb-4 p-4 bg-amber-100 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Warning: This will completely replace your current database
                  and files. Make sure to export a backup first!
                </span>
              </p>
            </div>

            <p className="text-slate-600 mb-4">
              Upload a backup file to restore your database. Supports both ZIP
              (with images) and JSON (database only) formats.
            </p>

            <label className="inline-block">
              <input
                type="file"
                accept=".json,.zip"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
                id="import-file"
              />
              <div className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-amber-300 cursor-pointer transition-colors font-medium">
                {isImporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Choose File to Import
                  </>
                )}
              </div>
            </label>

            <div className="mt-3 text-sm text-slate-500 flex items-center gap-2">
              <FileJson className="w-4 h-4" />
              Accepted formats: .json, .zip
            </div>
          </div>

          {/* Info Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              Always keep regular backups of your database and media files in a
              secure location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
