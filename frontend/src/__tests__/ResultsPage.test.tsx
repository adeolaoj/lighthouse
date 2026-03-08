import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock convex/react before importing the page
vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

// Mock the generated Convex API
vi.mock("../../convex/_generated/api", () => ({
  api: {
    opportunities: {
      get_opportunities: "opportunities:get_opportunities",
    },
  },
}));

// Mock PageLayout to render children without sidebar/header complexity
vi.mock("@/components/PageLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-layout">{children}</div>
  ),
}));

import { useQuery } from "convex/react";
import ResultsPage from "@/app/results/page";

const mockUseQuery = vi.mocked(useQuery);

// Note: `color` is intentionally absent — the page assigns it from CARD_COLORS
// during the .map(), so the raw API objects don't include it.
const mockOpportunities = [
  {
    id: "opp-1",
    labURL: "https://example.com/lab1",
    labName: "AI Lab",
    labDescription: "Artificial intelligence research.",
    headFaculty: "Dr. Alice",
    researchFocus: "Machine Learning",
    researchPositionTitle: "ML Research Assistant",
    postedAt: 1700000000000,
  },
  {
    id: "opp-2",
    labURL: "https://example.com/lab2",
    labName: "Robotics Lab",
    labDescription: "Robotics and automation research.",
    headFaculty: "Dr. Bob",
    researchFocus: null,
    researchPositionTitle: null,
    postedAt: 1700000001000,
  },
];

describe("ResultsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state when data is undefined", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<ResultsPage />);

    expect(screen.getByText(/loading opportunities/i)).toBeInTheDocument();
  });

  it("shows empty state when database has no records", () => {
    mockUseQuery.mockReturnValue([]);
    render(<ResultsPage />);

    expect(screen.getByText(/no opportunities yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/our lighthouse is still scanning the horizon/i)
    ).toBeInTheDocument();
  });

  it("renders one card per opportunity with the correct content", () => {
    mockUseQuery.mockReturnValue(mockOpportunities);
    render(<ResultsPage />);

    expect(screen.getByText("ML Research Assistant")).toBeInTheDocument();
    expect(
      screen.getByText("Artificial intelligence research.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Robotics and automation research.")
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /view lab/i })).toHaveLength(2);
  });

  it("shows the page heading in all states", () => {
    // Verify the heading is present when data is loaded, not just in the empty state
    mockUseQuery.mockReturnValue(mockOpportunities);
    render(<ResultsPage />);

    expect(screen.getByText("Opportunities for You")).toBeInTheDocument();
  });

  it('shows "Not Specified" for each missing optional field on opp-2', () => {
    mockUseQuery.mockReturnValue(mockOpportunities);
    render(<ResultsPage />);

    // opp-2 has researchPositionTitle: null → h3 shows "Not Specified" exactly
    // opp-2 has researchFocus: null → embedded as "Dr. Bob • Not Specified" (not exact match)
    // opp-1 has all fields present, contributing 0 exact "Not Specified" matches
    expect(screen.getAllByText("Not Specified")).toHaveLength(1);

    // The lab name should not appear as a card title (old fallback behavior is gone)
    expect(
      screen.queryByRole("heading", { name: "Robotics Lab" })
    ).not.toBeInTheDocument();
  });

});
