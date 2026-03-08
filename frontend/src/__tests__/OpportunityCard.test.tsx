import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OpportunityCard } from "@/components/OpportunityCard";
import type { Opportunity } from "@/types/Opportunity";

const baseOpportunity: Opportunity = {
  id: "opp-1",
  labURL: "https://example.com/lab",
  labName: "Vision & Learning Lab",
  labDescription: "Research on computer vision and deep learning.",
  headFaculty: "Dr. Jane Smith",
  researchFocus: "Computer Vision",
  researchPositionTitle: "Research Assistant",
  postedAt: 1700000000000,
  color: "#a855f7",
};

describe("OpportunityCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all fields when data is complete", () => {
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    expect(screen.getByText("Research Assistant")).toBeInTheDocument();
    expect(screen.getByText(/Computer Vision/)).toBeInTheDocument();
    expect(
      screen.getByText("Research on computer vision and deep learning.")
    ).toBeInTheDocument();
  });

  // ── researchFocus (optional) ──────────────────────────────────────────────

  it('shows "Not Specified" in subtitle when researchFocus is missing', () => {
    const opportunity = { ...baseOpportunity, researchFocus: undefined };
    render(
      <OpportunityCard
        opportunity={opportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    const subtitle = screen.getByText(/Dr\. Jane Smith/);
    expect(subtitle).toHaveTextContent("Not Specified");
    expect(screen.queryByText(/Computer Vision/)).not.toBeInTheDocument();
  });

  // ── researchPositionTitle (optional) ─────────────────────────────────────

  it('shows "Not Specified" as heading when researchPositionTitle is missing', () => {
    const opportunity = { ...baseOpportunity, researchPositionTitle: undefined };
    render(
      <OpportunityCard
        opportunity={opportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    expect(screen.getByText("Not Specified")).toBeInTheDocument();
    expect(screen.queryByText("Research Assistant")).not.toBeInTheDocument();
  });

  // ── Why It's a Match stub ─────────────────────────────────────────────────

  it("shows the stub match text for every opportunity", () => {
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "Your profile matches the research focus and requirements of this lab."
      )
    ).toBeInTheDocument();
  });

  // ── bookmark ──────────────────────────────────────────────────────────────

  it("calls onToggleSave with the opportunity id when bookmark is clicked", () => {
    const onToggleSave = vi.fn();
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={false}
        onToggleSave={onToggleSave}
        onViewLab={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /save opportunity/i }));
    expect(onToggleSave).toHaveBeenCalledWith("opp-1");
  });

  it("bookmark shows remove label when already saved", () => {
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={true}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: /remove from saved/i })
    ).toBeInTheDocument();
  });

  // ── View Lab ──────────────────────────────────────────────────────────────

  it("calls onViewLab when View Lab button is clicked", () => {
    const onViewLab = vi.fn();
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={onViewLab}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /view lab/i }));
    expect(onViewLab).toHaveBeenCalledWith(baseOpportunity);
  });

  // ── labDescription ────────────────────────────────────────────────────────

  it("displays labDescription in the Lab Description info block", () => {
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    expect(screen.getByText("Lab Description")).toBeInTheDocument();
    expect(
      screen.getByText("Research on computer vision and deep learning.")
    ).toBeInTheDocument();
  });

  // ── headFaculty ───────────────────────────────────────────────────────────

  it("displays headFaculty in the subtitle", () => {
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    expect(screen.getByText(/Dr\. Jane Smith/)).toBeInTheDocument();
  });

  it("renders silently when headFaculty is an empty string", () => {
    const opportunity = { ...baseOpportunity, headFaculty: "" };
    render(
      <OpportunityCard
        opportunity={opportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    // headFaculty has no fallback — empty string renders silently, focus still shows
    const subtitle = screen.getByText(/Computer Vision/);
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).not.toHaveTextContent("Not Specified");
  });

  // ── color ─────────────────────────────────────────────────────────────────

  it("applies the color to the accent bar", () => {
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    expect(screen.getByTestId("accent-bar")).toHaveStyle("background: #a855f7");
  });

  // ── labURL + labName ──────────────────────────────────────────────────────

  it("passes labURL and labName to onViewLab when View Lab is clicked", () => {
    const onViewLab = vi.fn();
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={onViewLab}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /view lab/i }));
    expect(onViewLab).toHaveBeenCalledWith(
      expect.objectContaining({
        labURL: "https://example.com/lab",
        labName: "Vision & Learning Lab",
      })
    );
  });

  // ── animationDelay prop ───────────────────────────────────────────────────

  it("applies the animationDelay as an inline style", () => {
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={false}
        animationDelay={0.3}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    expect(screen.getByTestId("opportunity-card")).toHaveStyle("animation-delay: 0.3s");
  });

  it("defaults animationDelay to 0s when not provided", () => {
    render(
      <OpportunityCard
        opportunity={baseOpportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    expect(screen.getByTestId("opportunity-card")).toHaveStyle("animation-delay: 0s");
  });

  // ── all optional fields missing ───────────────────────────────────────────

  it("shows 'Not Specified' for each missing optional field and still renders required fields", () => {
    const minimalOpportunity: Opportunity = {
      id: "opp-min",
      labURL: "https://example.com",
      labName: "Minimal Lab",
      labDescription: "Some description.",
      headFaculty: "",
      postedAt: 1700000000000,
      color: "#6366f1",
    };
    render(
      <OpportunityCard
        opportunity={minimalOpportunity}
        saved={false}
        onToggleSave={vi.fn()}
        onViewLab={vi.fn()}
      />
    );

    // researchFocus renders as "Not Specified" embedded in the subtitle — not an exact match.
    // Only researchPositionTitle (h3) renders as an exact "Not Specified".
    expect(screen.getAllByText("Not Specified")).toHaveLength(1);
    expect(screen.queryByText(/Computer Vision/)).not.toBeInTheDocument();
    // labDescription (required) still renders
    expect(screen.getByText("Some description.")).toBeInTheDocument();
    // stub match text still renders
    expect(
      screen.getByText(
        "Your profile matches the research focus and requirements of this lab."
      )
    ).toBeInTheDocument();
  });
});
