import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StatusBadge from "@/components/admin/StatusBadge";
import PublishBar from "@/components/admin/PublishBar";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

describe("Admin UI Components", () => {
  it("renders StatusBadge with correct labels and CSS classes", () => {
    const { rerender } = render(<StatusBadge status="live" />);
    expect(screen.getByText("Live")).toBeInTheDocument();

    rerender(<StatusBadge status="draft" />);
    expect(screen.getByText("Draft")).toBeInTheDocument();

    rerender(<StatusBadge status="failed" />);
    expect(screen.getByText("Publication failed")).toBeInTheDocument();
  });

  it("renders PublishBar and handles action clicks", () => {
    const onSave = vi.fn();
    const onPublish = vi.fn();

    render(
      <PublishBar
        status="draft"
        onSave={onSave}
        onPublish={onPublish}
      />
    );

    expect(screen.getByText("Save draft")).toBeInTheDocument();
    expect(screen.getByText("Publish")).toBeInTheDocument();
  });

  it("renders Dialog when open is true", () => {
    const onClose = vi.fn();
    render(
      <Dialog open={true} onClose={onClose} title="Test Modal">
        <p>Modal body content</p>
      </Dialog>
    );

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal body content")).toBeInTheDocument();
  });

  it("renders Button component with variant styling", () => {
    render(<Button variant="danger">Delete Item</Button>);
    const btn = screen.getByRole("button", { name: "Delete Item" });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("button--danger");
  });
});
