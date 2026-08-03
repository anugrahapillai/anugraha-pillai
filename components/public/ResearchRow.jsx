"use client";

import { useState } from "react";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

import { formatDate } from "@/lib/client/date-utils";
import { markdownToHtml } from "@/lib/client/markdown";

export default function ResearchRow({ title, category, excerpt, publishedAt, body }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="research-row">
        <div className="research-row__meta">
          <span className="research-row__category">{category || "Policy Research"}</span>
          <time>{formatDate(publishedAt) || "Published study"}</time>
        </div>
        <div className="research-row__content">
          <h3>{title}</h3>
          {excerpt && <p>{excerpt}</p>}
        </div>
        <div className="research-row__action">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            View Report
          </Button>
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={title}>
        <div className="article-modal-content">
          <span className="eyebrow">{category || "Policy Research"}</span>
          <p className="dialog-note">Published {formatDate(publishedAt)}</p>
          {excerpt && <p className="article-detail__lead">{excerpt}</p>}
          <div
            className="article-detail__body markdown-body"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(
                body || "Longitudinal policy research tracking urban growth indicators and institutional frameworks."
              ),
            }}
          />
        </div>
      </Dialog>
    </>
  );
}
