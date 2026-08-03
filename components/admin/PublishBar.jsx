import Button from "@/components/ui/Button";

export default function PublishBar({ dirty, saving, onSave, onPublish }) {
  return (
    <div className="publish-bar">
      <span aria-live="polite">{saving ? "Saving…" : dirty ? "Unsaved changes" : "All changes saved"}</span>
      <div>
        <Button type="button" variant="secondary" onClick={onSave} disabled={!dirty || saving}>
          Save draft
        </Button>
        <Button type="button" onClick={onPublish} disabled={saving}>
          Publish
        </Button>
      </div>
    </div>
  );
}
