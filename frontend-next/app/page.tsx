"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  MessageSquare,
  Brain,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Search,
  Layers,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import DropZone from "@/components/upload/DropZone";
import PDFViewer from "@/components/pdf-viewer/PDFViewer";
import ChatPanel from "@/components/chat/ChatPanel";
import InsightsPanel from "@/components/insights/InsightsPanel";

export default function Home() {
  const { sessionId, files, activePanelTab, setActivePanelTab } = useAppStore();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!sessionId ? (
            <LandingScreen key="landing" />
          ) : (
            <WorkspaceScreen key="workspace" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ──────────────────────────────────────
// Header
// ──────────────────────────────────────

function Header() {
  const { sessionId, files, clearSession } = useAppStore();

  return (
    <header className="h-13 px-5 flex items-center justify-between border-b border-white/6 bg-surface-primary/60 backdrop-blur-xl z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-primary to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-base font-bold tracking-tight">
            <span className="text-gradient">DocuMind</span>
            <span className="text-text-muted font-medium ml-1">AI</span>
          </h1>
        </div>

        {sessionId && files.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-white/8">
            <FileText className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-secondary truncate max-w-[200px]">
              {files.length === 1 ? files[0].name : `${files.length} documents`}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {sessionId && (
          <button
            onClick={clearSession}
            className="px-3 py-1.5 rounded-lg text-xs text-text-muted
              hover:text-text-secondary hover:bg-white/5 transition-all"
          >
            New Session
          </button>
        )}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-primary/30 to-purple-500/30 border border-white/10" />
      </div>
    </header>
  );
}

// ──────────────────────────────────────
// Landing Screen (Upload)
// ──────────────────────────────────────

function LandingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center px-6"
    >
      <div className="w-full max-w-3xl mx-auto text-center">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-primary/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span className="text-gradient">Document Intelligence</span>
            <br />
            <span className="text-text-primary">Powered by AI</span>
          </h2>
          <p className="text-base text-text-muted max-w-md mx-auto mb-10">
            Upload documents and get instant answers, executive summaries, and deep analysis — all with verified source citations.
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <DropZone />
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-10"
        >
          {[
            { icon: <Search className="w-3.5 h-3.5" />, text: "Hybrid Search" },
            { icon: <Layers className="w-3.5 h-3.5" />, text: "Re-Ranking" },
            { icon: <Shield className="w-3.5 h-3.5" />, text: "Citation Verification" },
            { icon: <Zap className="w-3.5 h-3.5" />, text: "Streaming Responses" },
          ].map((feature, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-xs text-text-muted border border-white/6 bg-white/[0.02]"
            >
              {feature.icon}
              {feature.text}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────
// Workspace Screen (Split Pane)
// ──────────────────────────────────────

function WorkspaceScreen() {
  const { activePanelTab, setActivePanelTab } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex"
    >
      {/* Left Panel — PDF Viewer */}
      <div className="hidden lg:flex w-1/2 border-r border-white/6 flex-col bg-midnight-950">
        <PDFViewer />
      </div>

      {/* Right Panel — Chat + Insights */}
      <div className="flex-1 flex flex-col bg-surface-primary/30 min-w-0">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-white/6 bg-surface-primary/60 backdrop-blur-sm">
          <TabButton
            active={activePanelTab === "chat"}
            onClick={() => setActivePanelTab("chat")}
            icon={<MessageSquare className="w-3.5 h-3.5" />}
            label="Chat"
          />
          <TabButton
            active={activePanelTab === "insights"}
            onClick={() => setActivePanelTab("insights")}
            icon={<Brain className="w-3.5 h-3.5" />}
            label="Insights"
          />
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activePanelTab === "chat" ? <ChatPanel /> : <InsightsPanel />}
        </div>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────
// Tab Button
// ──────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
        transition-all duration-200
        ${
          active
            ? "bg-accent-primary/15 text-accent-secondary border border-accent-primary/20"
            : "text-text-muted hover:text-text-secondary hover:bg-white/5"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
