"use client";

import { useAppStore } from "@/lib/store";
import {
  FileText,
  Upload,
  Layers,
  Archive,
  History,
  FolderPlus,
  Settings,
  Plus,
  CheckSquare,
  Square,
  ChevronRight,
} from "lucide-react";
import { uploadDocuments, getInsights } from "@/lib/api";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UploadedFile } from "@/lib/store";

export default function FileManager() {
  const {
    sessionId,
    files,
    selectedFileNames,
    activeDocumentName,
    isUploading,
    toggleFileSelection,
    setActiveDocument,
    selectAllFiles,
    deselectAllFiles,
    setSession,
    setUploading,
    setUploadProgress,
    setInsights,
    setLoadingInsights,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHoveredUpload, setIsHoveredUpload] = useState(false);

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const acceptedFiles = Array.from(e.target.files);

    setUploading(true);
    setUploadProgress(0, "Staging additional files...");

    try {
      setUploadProgress(20, "Uploading to server...");
      const result = await uploadDocuments(acceptedFiles, (progress) => {
        setUploadProgress(Math.min(progress * 0.4, 40), "Uploading...");
      });

      setUploadProgress(60, "Processing documents...");
      
      const newFiles: UploadedFile[] = acceptedFiles.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      }));

      // Combine existing files and new files
      const updatedFiles = [...files, ...newFiles];
      setSession(result.session_id, updatedFiles);
      setUploadProgress(80, "Updating index...");

      setLoadingInsights(true);
      try {
        const insights = await getInsights(result.session_id);
        setInsights(insights);
      } catch {
        // Optional
      }

      setUploadProgress(100, "Done!");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col bg-midnight-900 border-r border-white/5 select-none">
      {/* File Upload Trigger */}
      <div className="p-4 border-b border-white/5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Workspace
          </span>
          <button
            onClick={triggerUpload}
            disabled={isUploading}
            className="p-1 rounded-md hover:bg-white/5 text-accent-primary hover:text-accent-secondary transition-all"
            title="Upload Document"
          >
            <FolderPlus className="w-4.5 h-4.5" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleAddFile}
          className="hidden"
        />

        <button
          onClick={triggerUpload}
          disabled={isUploading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-white/10 hover:border-accent-primary/50 bg-white/[0.01] hover:bg-accent-primary/[0.02] text-xs font-semibold text-text-secondary hover:text-accent-primary transition-all duration-150"
        >
          <Upload className="w-3.5 h-3.5" />
          {isUploading ? "Uploading..." : "Add document"}
        </button>
      </div>

      {/* Files List Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Documents ({files.length})
            </span>
            <div className="flex gap-2">
              <button
                onClick={selectAllFiles}
                className="text-[9px] font-semibold text-accent-primary hover:underline"
              >
                Select all
              </button>
              <button
                onClick={deselectAllFiles}
                className="text-[9px] font-semibold text-text-muted hover:text-text-secondary"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {files.map((file) => {
              const isSelected = selectedFileNames.includes(file.name);
              const isActive = activeDocumentName === file.name;

              return (
                <div
                  key={file.name}
                  onClick={() => setActiveDocument(file.name)}
                  className={`
                    group flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all duration-150
                    ${isActive ? "bg-white/[0.04] border border-white/5" : "hover:bg-white/[0.02] border border-transparent"}
                  `}
                >
                  {/* Active document line marker */}
                  <div
                    className={`w-0.5 h-6 rounded-full transition-all ${
                      isActive ? "bg-accent-primary" : "bg-transparent group-hover:bg-white/10"
                    }`}
                  />

                  {/* Checkbox context toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFileSelection(file.name);
                    }}
                    className="text-text-muted hover:text-accent-primary transition-colors"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-accent-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-white/20" />
                    )}
                  </button>

                  <FileText className={`w-4 h-4 shrink-0 ${isSelected ? "text-accent-primary" : "text-text-muted"}`} />

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs truncate ${isActive ? "text-text-primary font-semibold" : "text-text-secondary group-hover:text-text-primary"}`}>
                      {file.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collections */}
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-2 mb-2 block">
            Collections
          </span>
          <div className="space-y-1 px-1">
            {["Financial Statements", "Legal & Contracts", "Technical Notes"].map((col) => (
              <div
                key={col}
                className="flex items-center justify-between p-2 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.02] cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <Archive className="w-3.5 h-3.5 text-text-muted" />
                  <span className="truncate">{col}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-text-muted" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent sessions */}
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-2 mb-2 block">
            Recent Sessions
          </span>
          <div className="space-y-1 px-1">
            {["Compliance Audit", "Product Roadmap Review"].map((sess) => (
              <div
                key={sess}
                className="flex items-center gap-2 p-2 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.02] cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-text-muted" />
                <span className="truncate">{sess}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
