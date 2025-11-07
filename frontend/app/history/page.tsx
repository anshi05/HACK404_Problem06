"use client";
import React, { useEffect, useMemo, useState } from "react";

/**
 * ActivityTable
 * - Fetches GET /activity/recent
 * - Groups items by actor (address)
 * - Displays 1 row per account (actor) with summary info
 * - Expand a row to show all actions for that actor
 *
 * Requirements:
 * - Tailwindcss available for styling
 *
 * Edit API_BASE if your backend is at a different origin.
 */

const API_BASE = "http://127.0.0.1:8001"; // change if needed

// --- Type definitions matching your backend output shape ---
type ActivityItem = {
  type: string;
  timestamp?: number | null;
  block_number?: number | null;
  tx_hash?: string | null;
  actor?: string | null;
  subject?: string | null;
  details?: Record<string, any> | null;
};

type ActivityResponse = {
  count: number;
  items: ActivityItem[];
};

// --- Helper utils ---
function formatTs(ts?: number | null) {
  if (!ts) return "-";
  try {
    const d = new Date(ts * 1000);
    return d.toLocaleString();
  } catch {
    return String(ts);
  }
}

function formatRelativeTime(ts?: number | null) {
  if (!ts) return "-";
  try {
    const now = Date.now();
    const diff = now - ts * 1000;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  } catch {
    return String(ts);
  }
}

function truncateAddress(address: string, startLength = 6, endLength = 4) {
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

function getActivityTypeColor(type: string) {
  const typeColors: Record<string, string> = {
    certificate: "bg-green-600/20 text-green-400 border-green-500/30",
    inspection: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    transfer: "bg-purple-600/20 text-purple-400 border-purple-500/30",
    mint: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
    burn: "bg-red-600/20 text-red-400 border-red-500/30",
    swap: "bg-indigo-600/20 text-indigo-400 border-indigo-500/30",
    approval: "bg-amber-600/20 text-amber-400 border-amber-500/30",
    stake: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30",
    default: "bg-gray-600/20 text-gray-400 border-gray-500/30"
  };
  
  const key = type.toLowerCase().split('_')[0]; // Take first part for types like "certificate_onchain"
  return typeColors[key] || typeColors.default;
}

// --- Group activities by actor address (fallback "unknown") ---
function groupByActor(items: ActivityItem[]) {
  const map = new Map<string, ActivityItem[]>();
  for (const it of items) {
    const actor = it.actor ?? "unknown";
    if (!map.has(actor)) map.set(actor, []);
    map.get(actor)!.push(it);
  }
  return map;
}

// --- Component ---
export default function ActivityTable() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [limit, setLimit] = useState<number>(50);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // fetch function
  async function fetchRecent(limitParam = 50) {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/activity/recent?limit=${encodeURIComponent(limitParam)}&include_onchain=true`;
      const resp = await fetch(url);
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${txt}`);
      }
      const body: ActivityResponse = await resp.json();
      setItems(body.items ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecent(limit);
  }, [limit]);

  // grouped data memoized
  const grouped = useMemo(() => groupByActor(items), [items]);

  // produce a summary list (one entry per actor) with latest timestamp
  const rows = useMemo(() => {
    const out: {
      actor: string;
      actions: ActivityItem[];
      latestTs: number | null;
      latestType: string | null;
      latestTx?: string | null;
      totalVolume?: number;
    }[] = [];

    for (const [actor, acts] of grouped.entries()) {
      // Filter by search term if present
      const filteredActs = acts.filter(act => 
        searchTerm === "" ||
        actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (act.subject && act.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      if (filteredActs.length === 0) continue;

      // sort actor's activities by ts desc (fallback to 0)
      const sorted = filteredActs.slice().sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      const latest = sorted[0] ?? null;
      
      // Calculate total volume from details (if available)
      const totalVolume = sorted.reduce((sum, act) => {
        const amount = act.details?.amount || act.details?.value || 0;
        return sum + (typeof amount === 'number' ? amount : parseFloat(amount) || 0);
      }, 0);

      out.push({
        actor,
        actions: sorted,
        latestTs: latest?.timestamp ?? null,
        latestType: latest?.type ?? null,
        latestTx: latest?.tx_hash ?? null,
        totalVolume,
      });
    }

    // sort rows by number of actions desc then latestTs desc
    out.sort((a, b) => {
      const diff = b.actions.length - a.actions.length;
      if (diff !== 0) return diff;
      return (b.latestTs || 0) - (a.latestTs || 0);
    });

    return out;
  }, [grouped, searchTerm]);

  // toggle expand
  function toggleExpand(actor: string) {
    setExpanded((s) => ({ ...s, [actor]: !s[actor] }));
  }

  // expand/collapse all
  function toggleAll() {
    if (Object.keys(expanded).length === rows.length) {
      setExpanded({});
    } else {
      const allExpanded: Record<string, boolean> = {};
      rows.forEach(row => { allExpanded[row.actor] = true; });
      setExpanded(allExpanded);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Recent Activity — grouped by account</h1>
              <p className="text-muted-foreground mt-1">
                Monitor account activities and transactions across the network
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 border border-border">
                <label className="text-sm text-muted-foreground font-medium">Limit:</label>
                <select
                  className="bg-transparent border-none text-foreground focus:ring-0 focus:outline-none py-1"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                >
                  {[25, 50, 100, 200].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
                onClick={() => fetchRecent(limit)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-card rounded-lg p-4 mb-6 border border-border">
            <div className="relative max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by address, type, or subject..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-destructive/30 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-destructive-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-destructive-foreground">Error fetching activities</h3>
                <p className="text-destructive/80 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account (actor)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">No. Actions</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Latest Action</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Latest Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Tx / Subject</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {rows.map((r, idx) => (
                  <React.Fragment key={r.actor}>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <code className="font-mono text-sm text-accent bg-accent/20 px-2 py-1 rounded">
                          {truncateAddress(r.actor)}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-muted text-muted-foreground rounded-full text-sm font-medium border border-border">
                          {r.actions.length}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getActivityTypeColor(r.latestType || 'default')}`}>
                          {r.latestType || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">{formatRelativeTime(r.latestTs)}</div>
                        <div className="text-xs text-muted-foreground">{formatTs(r.latestTs)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[200px]">
                          {r.latestTx ? (
                            <code className="font-mono text-xs text-accent bg-accent/20 px-2 py-1 rounded truncate block">
                              {truncateAddress(r.latestTx, 8, 8)}
                            </code>
                          ) : (
                            <code className="font-mono text-xs text-muted-foreground">
                              {r.actions[0]?.subject ? truncateAddress(String(r.actions[0].subject)) : "-"}
                            </code>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm border border-border"
                          onClick={() => toggleExpand(r.actor)}
                        >
                          {expanded[r.actor] ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              Collapse
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              Expand
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expand row with nested table */}
                    {expanded[r.actor] && (
                      <tr>
                        <td colSpan={7} className="bg-muted/50 p-6 border-t border-border">
                          <div className="mb-4">
                            <h4 className="text-lg font-semibold text-foreground mb-2">
                              All actions for: <code className="font-mono text-accent">{truncateAddress(r.actor)}</code>
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              Showing {r.actions.length} action{r.actions.length !== 1 ? 's' : ''} for this account
                            </p>
                          </div>
                          <div className="bg-card rounded-lg border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="bg-muted border-b border-border">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Timestamp</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tx Hash</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Subject</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Details (JSON)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  {r.actions.map((a, i) => (
                                    <tr key={i} className="hover:bg-muted/50">
                                      <td className="px-4 py-3 text-foreground font-medium">{i + 1}</td>
                                      <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActivityTypeColor(a.type)}`}>
                                          {a.type}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="text-foreground">{formatRelativeTime(a.timestamp)}</div>
                                        <div className="text-xs text-muted-foreground">{formatTs(a.timestamp)}</div>
                                      </td>
                                      <td className="px-4 py-3">
                                        {a.tx_hash ? (
                                          <code className="font-mono text-xs text-accent bg-accent/20 px-2 py-1 rounded">
                                            {truncateAddress(a.tx_hash, 8, 8)}
                                          </code>
                                        ) : (
                                          "-"
                                        )}
                                      </td>
                                      <td className="px-4 py-3">
                                        <code className="font-mono text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                                          {a.subject ? truncateAddress(String(a.subject)) : "-"}
                                        </code>
                                      </td>
                                      <td className="px-4 py-3">
                                        <details className="group">
                                          <summary className="text-primary hover:text-primary/90 cursor-pointer list-none font-medium">
                                            View Details
                                          </summary>
                                          <pre className="mt-2 text-muted-foreground bg-muted/20 p-3 rounded-lg overflow-x-auto border border-border">
                                            {JSON.stringify(a.details ?? {}, null, 2)}
                                          </pre>
                                        </details>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-muted-foreground">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-lg font-medium mb-2">No activity found</div>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>
            Showing <strong>{rows.length}</strong> accounts (rows). Total activities fetched: <strong>{items.length}</strong>.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Back to top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}