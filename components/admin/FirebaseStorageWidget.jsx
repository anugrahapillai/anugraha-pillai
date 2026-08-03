"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/client/firebase-client";

// Helper to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const TOTAL_LIMIT = 1 * 1024 * 1024 * 1024; // 1 GB
const CACHE_KEY = "anughara_db_size_bytes";
const CACHE_TIMESTAMP_KEY = "anughara_db_size_time";
const CACHE_TTL = 45 * 1000; // 45 seconds cache

export default function FirebaseStorageWidget() {
  const [usedBytes, setUsedBytes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchStorageSize() {
      // Check cache first for instant loading
      if (typeof window !== "undefined") {
        const cachedValue = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();

        if (cachedValue && cachedTime && now - parseInt(cachedTime, 10) < CACHE_TTL) {
          if (active) {
            setUsedBytes(parseInt(cachedValue, 10));
            setLoading(false);
          }
          return;
        }
      }

      let total = 0;
      try {
        const collections = ["posts", "posters", "research", "services", "pages", "settings"];
        const promises = collections.map(async (colName) => {
          try {
            const snap = await getDocs(collection(db, colName));
            let colBytes = 0;
            snap.forEach((doc) => {
              const data = doc.data();
              const str = JSON.stringify(data);
              colBytes += new Blob([str]).size;
            });
            return colBytes;
          } catch {
            return 0;
          }
        });

        const sizes = await Promise.all(promises);
        total = sizes.reduce((acc, s) => acc + s, 0) || 51200; // fallback to minimum 50KB if empty
      } catch (err) {
        console.warn("Storage fetch error:", err);
      }

      if (active) {
        setUsedBytes(total);
        setLoading(false);

        if (typeof window !== "undefined") {
          localStorage.setItem(CACHE_KEY, total.toString());
          localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        }
      }
    }

    fetchStorageSize();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
        <span className="skeleton-box" style={{ width: "120px", height: "0.85rem" }}></span>
        <span className="skeleton-box" style={{ width: "80px", height: "0.5rem", borderRadius: "10px" }}></span>
      </div>
    );
  }

  const percentage = Math.min((usedBytes / TOTAL_LIMIT) * 100, 100);
  const remainingBytes = Math.max(TOTAL_LIMIT - usedBytes, 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        minWidth: "180px",
        padding: "0.35rem 0.75rem",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid var(--night-border)",
        borderRadius: "var(--radius-sm)",
      }}
      title="Live Firebase Storage usage"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "2rem",
          fontSize: "0.88rem",
          fontFamily: "var(--font-mono)",
          color: "var(--text-secondary)",
          fontWeight: 650,
        }}
      >
        <span>
          Used: <strong style={{ color: "var(--lilac)" }}>{formatBytes(usedBytes)}</strong>
        </span>
        <span>
          Free: <strong style={{ color: "var(--cyan-glow)" }}>{formatBytes(remainingBytes)}</strong>
        </span>
      </div>

      {/* Progress Bar Container */}
      <div
        style={{
          width: "100%",
          height: "6px",
          background: "var(--night-bg)",
          borderRadius: "3px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div
          style={{
            width: `${Math.max(percentage, 1.5)}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--violet) 0%, var(--cyan-glow) 100%)",
            borderRadius: "3px",
            transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}
