"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import ContentEditor from "@/components/admin/ContentEditor";
import StatusBadge from "@/components/admin/StatusBadge";
import { displayState } from "@/lib/repositories/mock-admin";
import { formatDate } from "@/lib/client/date-utils";

const contentCache = {};
const CACHE_TTL = 120000; // 2 minutes cache TTL

export default function ContentManager({ type, title = `${type}s`, description }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [state, setState] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [urlReady, setUrlReady] = useState(false);
  const [editor, setEditor] = useState(null);
  const [target, setTarget] = useState(null);
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && contentCache[type] && (now - contentCache[type].timestamp < CACHE_TTL)) {
      setItems(contentCache[type].items);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content?type=${encodeURIComponent(type)}`);
      const data = await res.json();
      const loadedItems = data.items || [];
      
      contentCache[type] = {
        items: loadedItems,
        timestamp: now,
      };
      setItems(loadedItems);
    } catch {
      setNotice("Failed to load content from server.");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const frame = window.requestAnimationFrame(() => {
      loadData(false);
      setQuery(params.get("q") || "");
      setState(params.get("state") || "");
      if (params.get("new") === "true" || params.get("section")) setEditor({});
      setUrlReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [loadData]);

  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams(window.location.search);
    query ? params.set("q", query) : params.delete("q");
    state ? params.set("state", state) : params.delete("state");
    window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`);
  }, [query, state, urlReady]);

  const sortedAndFiltered = useMemo(() => {
    const list = items.filter(
      (item) =>
        (!state || displayState(item) === state) &&
        (item.title || "").toLowerCase().includes(query.toLowerCase())
    );

    return [...list].sort((a, b) => {
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "publishedAt") {
        const dateA = new Date(a.publishedAt || a.publishedDate || 0).getTime();
        const dateB = new Date(b.publishedAt || b.publishedDate || 0).getTime();
        return dateB - dateA;
      }
      // Default: updatedAt
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [items, query, state, sortBy]);

  if (editor) {
    return (
      <ContentEditor
        type={type}
        item={editor.id ? editor : undefined}
        onClose={() => {
          setEditor(null);
          delete contentCache[type];
          loadData(true);
          window.history.replaceState(null, "", window.location.pathname);
        }}
      />
    );
  }

  async function deleteItem(item) {
    if (!item?.id) return;
    try {
      const res = await fetch(`/api/admin/content?id=${encodeURIComponent(item.id)}&type=${encodeURIComponent(type)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotice("Record deleted!");
        delete contentCache[type];
        loadData(true);
      } else {
        const data = await res.json();
        setNotice(data.error || "Failed to delete item.");
      }
    } catch {
      setNotice("Network error occurred while deleting item.");
    }
    setTarget(null);
  }

  return (
    <>
      <header className="page-heading">
        <div>
          <p className="eyebrow">Content Studio</p>
          <h1>{title}</h1>
          <p>{description || `Manage ${title.toLowerCase()} .`}</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button variant="secondary" onClick={() => { delete contentCache[type]; loadData(true); }}>Refresh</Button>
          <Button onClick={() => setEditor({})}>New {type.toLowerCase()}</Button>
        </div>
      </header>

      {notice && <p className="form-message form-message--success" role="status">{notice}</p>}

      <section className="panel">
        <div className="list-controls">
          <label>
            Search loaded {title.toLowerCase()}
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title..." />
          </label>
          <label>
            State
            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">All states</option>
              <option value="draft">Draft</option>
              <option value="live">Live</option>
              <option value="failed">Publication failed</option>
            </select>
          </label>
          <label>
            Sort By
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="updatedAt">Updated Date (Newest)</option>
              <option value="publishedAt">Published Date (Newest)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="admin-loading">Loading items from Firestore…</div>
        ) : sortedAndFiltered.length ? (
          <div className="content-table-wrap">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>State</th>
                  <th>Published</th>
                  <th>Updated</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFiltered.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Title"><strong>{item.title}</strong><small>{type}</small></td>
                    <td data-label="Category">{item.category}</td>
                    <td data-label="State"><StatusBadge status={displayState(item)} /></td>
                    <td data-label="Published">{formatDate(item.publishedAt)}</td>
                    <td data-label="Updated">{formatDate(item.updatedAt)}</td>
                    <td data-label="Actions">
                      <button className="row-action" onClick={() => setTarget(item)}>Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h2>No {title.toLowerCase()} found</h2>
            <p>Click &quot;New {type.toLowerCase()}&quot; to create the first record in Firestore.</p>
            <button className="text-button" onClick={() => { setQuery(""); setState(""); }}>Reset filters</button>
          </div>
        )}

        <nav className="cursor-pagination" aria-label={`${title} pagination`}>
          <span>Showing {sortedAndFiltered.length} items</span>
        </nav>
      </section>

      <Dialog open={Boolean(target)} onClose={() => setTarget(null)} title={`Manage ${type}`}>
        <p style={{ fontSize: "1.1rem", marginBottom: "1.25rem" }}><strong>{target?.title}</strong></p>
        <div className="dialog-actions" style={{ display: "flex", gap: ".75rem" }}>
          <Button variant="primary" onClick={() => { setEditor(target); setTarget(null); }}>Edit Record</Button>
          <Button variant="danger" onClick={() => deleteItem(target)}>Delete Record</Button>
        </div>
      </Dialog>
    </>
  );
}
