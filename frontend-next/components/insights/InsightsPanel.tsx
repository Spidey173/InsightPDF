"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import type { InsightsResponse } from "@/lib/api";

const ENTITY_ICONS: Record<string, React.ReactNode> = {
  PERSON: <Users className="w-3.5 h-3.5 text-blue-800" />,
  ORGANIZATION: <Building2 className="w-3.5 h-3.5 text-red-800" />,
  LOCATION: <MapPin className="w-3.5 h-3.5 text-emerald-800" />,
  DATE: <Calendar className="w-3.5 h-3.5 text-amber-800" />,
  MONEY: <DollarSign className="w-3.5 h-3.5 text-amber-950" />,
  PERCENTAGE: <TrendingUp className="w-3.5 h-3.5 text-cyan-850" />,
};

const ENTITY_COLORS: Record<string, string> = {
  PERSON: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  ORGANIZATION: "text-red-400 bg-red-400/10 border-red-400/20",
  LOCATION: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  DATE: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  MONEY: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  PERCENTAGE: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

const ENTITY_LABELS: Record<string, string> = {
  PERSON: "Key People & Figures",
  ORGANIZATION: "Organizations & Groups",
  LOCATION: "Locations & Facilities",
  DATE: "Dates & Chronology",
  MONEY: "Financial Figures & Values",
  PERCENTAGE: "Percentages & Ratios",
};

export default function InsightsPanel() {
  const { insights, isLoadingInsights } = useAppStore();

  if (isLoadingInsights) {
    return (
      <div className="p-5 space-y-4 bg-[#0a0c10] h-full">
        <div className="h-6 w-48 rounded bg-white/5 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse" />
        </div>
        <div className="h-20 w-full rounded-xl mt-4 bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[#0a0c10]">
        <Brain className="w-10 h-10 text-text-muted mb-3 opacity-40 animate-pulse" />
        <p className="text-sm text-text-muted">
          Upload documents to extract analytical insights.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6 overflow-y-auto h-full bg-[#0a0c10]">
      {/* Executive Summary */}
      {insights.executive_summary && (
        <SummarySection summary={insights.executive_summary} />
      )}

      {/* Key Entities */}
      {insights.key_entities && insights.key_entities.length > 0 && (
        <EntitiesSection entities={insights.key_entities} />
      )}

      {/* Document Stats */}
      <StatsSection insights={insights} />
    </div>
  );
}

// ──────────────────────────────────────
// Executive Summary (Scroll Secrets)
// ──────────────────────────────────────

function SummarySection({
  summary,
}: {
  summary: NonNullable<InsightsResponse["executive_summary"]>;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-elevated rounded-xl overflow-hidden shadow-lg border border-white/5"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 rounded bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
            <Award className="w-4 h-4 text-accent-primary" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-sans">
            Executive Summary
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-4 pb-4 space-y-4 border-t border-white/5 pt-3"
        >
          {/* Purpose */}
          <p className="text-sm text-text-primary leading-relaxed font-medium">
            {summary.purpose}
          </p>

          {/* Key Findings */}
          {summary.key_findings && summary.key_findings.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-4 h-4 text-[#ffaa00]" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Key Findings
                </span>
              </div>
              <ul className="space-y-2">
                {summary.key_findings.map((finding, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {summary.risks && summary.risks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#c62828]" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Risks & Limitations
                </span>
              </div>
              <ul className="space-y-2">
                {summary.risks.map((risk, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed font-medium"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#c62828] shrink-0 mt-0.5" />
                    <span className="text-red-400">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conclusions */}
          {summary.conclusions && summary.conclusions.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Conclusions
                </span>
              </div>
              <ul className="space-y-2">
                {summary.conclusions.map((conclusion, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-1.5 shrink-0" />
                    <span>{conclusion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ──────────────────────────────────────
// Key Entities (Shinobi Registry)
// ──────────────────────────────────────

function EntitiesSection({
  entities,
}: {
  entities: InsightsResponse["key_entities"];
}) {
  const [showAll, setShowAll] = useState(false);
  const displayEntities = showAll ? entities : entities.slice(0, 12);

  const grouped = displayEntities.reduce(
    (acc, entity) => {
      if (!acc[entity.entity_type]) acc[entity.entity_type] = [];
      acc[entity.entity_type].push(entity);
      return acc;
    },
    {} as Record<string, typeof entities>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-elevated rounded-xl p-4 shadow-lg border border-white/5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded bg-surface-secondary/25 border border-white/5 flex items-center justify-center">
          <Users className="w-4 h-4 text-accent-primary" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-sans">
          Document Entities
        </h3>
        <span className="text-xs text-text-muted font-bold ml-auto font-mono">
          {entities.length} items
        </span>
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-2">
              {ENTITY_LABELS[type] || type.replace("_", " ")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((entity, i) => (
                <span
                  key={i}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold
                    border transition-colors cursor-default shadow-sm
                    ${ENTITY_COLORS[type] || "text-text-primary bg-white/5 border-white/10"}
                  `}
                >
                  {ENTITY_ICONS[type]}
                  {entity.value}
                  {entity.count > 1 && (
                    <span className="opacity-60 text-[10px] ml-0.5">×{entity.count}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {entities.length > 12 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-xs font-bold text-accent-primary hover:text-accent-secondary transition-colors cursor-pointer block text-center w-full"
        >
          {showAll ? "▲ Show less" : `▼ Show all ${entities.length} records`}
        </button>
      )}
    </motion.div>
  );
}

// ──────────────────────────────────────
// Document Stats (Archive Metrics)
// ──────────────────────────────────────

function StatsSection({ insights }: { insights: InsightsResponse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-elevated rounded-xl p-4 shadow-lg border border-white/5"
    >
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary mb-4 font-sans">
        Document Metrics
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: "Document Length",
            value: insights.total_pages ? `${insights.total_pages} page${insights.total_pages > 1 ? "s" : ""}` : "—",
          },
          {
            label: "Vector Chunks",
            value: `${insights.total_chunks} chunks`,
          },
          {
            label: "Extracted Entities",
            value: insights.key_entities?.length || 0,
          },
          {
            label: "Processing Time",
            value: insights.processing_time_ms
              ? `${(insights.processing_time_ms / 1000).toFixed(1)}s`
              : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-3 rounded-lg bg-surface-secondary/40 border border-white/5 hover:bg-surface-secondary/60 transition-colors shadow-inner"
          >
            <p className="text-lg font-black text-accent-primary font-mono leading-none mb-1">{stat.value}</p>
            <p className="text-[8px] font-bold text-text-muted uppercase tracking-wider leading-none">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
