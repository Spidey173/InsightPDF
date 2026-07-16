"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  X,
  AlertCircle,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { uploadDocuments, getInsights } from "@/lib/api";
import type { UploadedFile } from "@/lib/store";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DropZone() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    isUploading,
    uploadProgress,
    uploadStage,
    setSession,
    setUploading,
    setUploadProgress,
    setInsights,
    setLoadingInsights,
  } = useAppStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const valid = acceptedFiles.filter((f) => {
        const ext = f.name.split(".").pop()?.toLowerCase();
        return ["pdf", "docx", "txt"].includes(ext || "");
      });
      if (valid.length === 0) {
        setError("Please upload PDF, DOCX, or TXT files.");
        return;
      }
      setSelectedFiles((prev) => [...prev, ...valid]);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0, "Initializing file upload...");
    setError(null);

    try {
      setUploadProgress(10, "Reading document contents...");

      const result = await uploadDocuments(selectedFiles, (progress) => {
        setUploadProgress(Math.min(progress * 0.4, 40), "Uploading to server...");
      });

      setUploadProgress(50, "Processing semantic context...");

      const files: UploadedFile[] = selectedFiles.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      }));

      setUploadProgress(80, "Indexing vector embeddings...");
      setSession(result.session_id, files);

      setUploadProgress(90, "Generating summary & insights...");

      // Fetch insights
      setLoadingInsights(true);
      try {
        const insights = await getInsights(result.session_id);
        setInsights(insights);
      } catch {
        // Insights are optional
      }

      setUploadProgress(100, "Analysis complete!");
      setSelectedFiles([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Document processing failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* Modern Upload Container */}
      <div className="w-full relative group">
        <div
          {...getRootProps()}
          className={`
            cursor-pointer p-10 text-center rounded-2xl border-2 border-dashed
            transition-all duration-300 select-none relative z-10
            ${
              isDragActive
                ? "bg-accent-primary/5 border-accent-primary shadow-inner"
                : "bg-surface-secondary/30 border-white/10 hover:border-accent-primary/50 hover:bg-surface-secondary/50"
            }
          `}
        >
          <input {...getInputProps()} id="file-upload-input" />

          <div className="flex flex-col items-center gap-4">
            {/* Upload Icon */}
            <motion.div
              animate={isDragActive ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`
                w-16 h-16 rounded-full border border-white/10
                flex items-center justify-center transition-colors duration-300
                ${isDragActive ? "bg-accent-primary/10 border-accent-primary/30" : "bg-white/[0.02] group-hover:bg-white/[0.04] group-hover:border-accent-primary/20"}
              `}
            >
              <UploadCloud
                className={`w-8 h-8 transition-colors ${
                  isDragActive ? "text-accent-primary animate-pulse" : "text-text-muted group-hover:text-accent-primary"
                }`}
              />
            </motion.div>

            <div>
              <p className="text-base font-bold text-text-primary mb-1 font-sans">
                {isDragActive ? "Drop documents to upload..." : "Drag & drop documents here, or click to browse"}
              </p>
              <p className="text-xs text-text-muted font-medium">
                Supports PDF, DOCX, TXT • Up to 50MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Files */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-2.5 z-10 relative"
          >
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-white/5 bg-surface-secondary/80 relative overflow-hidden"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center shrink-0 border border-accent-primary/20">
                  <FileText className="w-4 h-4 text-accent-primary" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-xs font-semibold text-text-primary truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleUpload}
              disabled={isUploading}
              className={`
                w-full mt-4 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider
                flex items-center justify-center gap-2 cursor-pointer
                transition-all duration-300 shadow-md border
                ${
                  isUploading
                    ? "bg-accent-primary/20 border-accent-primary/15 text-accent-primary/70 cursor-not-allowed"
                    : "bg-accent-primary hover:bg-accent-secondary text-midnight-950 border-accent-primary shadow-accent-primary/10 hover:shadow-accent-primary/20"
                }
              `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-accent-primary" />
                  <span>{uploadStage || "Processing..."}</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>
                    Upload & Analyze{" "}
                    {selectedFiles.length === 1
                      ? "Document"
                      : `${selectedFiles.length} Documents`}
                  </span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar (Chakra themed) */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-4 rounded-xl border border-accent-primary/10 bg-accent-primary/5"
          >
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-accent-primary mb-2">
              <span>{uploadStage}</span>
              <span className="text-accent-secondary">{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full shadow-[0_0_8px_rgba(255,107,0,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-danger/10 border border-danger/20"
          >
            <AlertCircle className="w-4 h-4 text-danger shrink-0" />
            <p className="text-xs font-semibold text-danger">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

