"use client";

import { useEffect } from "react";

export default function AntiTheft() {
  useEffect(() => {
    const handleContextMenu = (e) => {
      // Prevent context menu inside article details or dialogs
      if (e.target.closest(".article-detail, .dialog, .markdown-body, .poster-card-flip")) {
        e.preventDefault();
      }
    };

    const handleCopyCut = (e) => {
      if (e.target.closest(".article-detail, .dialog, .markdown-body")) {
        e.preventDefault();
        // Clear clipboard or alert if needed, but silent prevention is cleaner
        if (e.clipboardData) {
          e.clipboardData.setData("text/plain", "Content is protected.");
        }
      }
    };

    const handleKeyDown = (e) => {
      // Check for Ctrl/Cmd + C (Copy), Ctrl/Cmd + A (Select All), Ctrl/Cmd + S (Save)
      const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c";
      const isSelectAll = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a";
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";

      if (isCopy || isSelectAll || isSave) {
        if (e.target.closest(".article-detail, .dialog, .markdown-body")) {
          e.preventDefault();
        }
      }
    };

    const handleDragStart = (e) => {
      // Avoid dragging images or texts to desktop/tabs
      if (e.target.closest(".article-detail, .dialog, .markdown-body, .poster-card-flip")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyCut);
    document.addEventListener("cut", handleCopyCut);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyCut);
      document.removeEventListener("cut", handleCopyCut);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return null;
}
