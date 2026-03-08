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
// Note: `id` (not `_id`) is correct here — these mocks represent data already
// returned by the get_opportunities handler, which remaps _id → id.
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
    researchFocus: undefined,
    researchPositionTitle: undefined,
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

  // The heading is outside all conditional blocks, so it renders in every non-loading state.
  it("shows the page heading when data is loaded", () => {
    mockUseQuery.mockReturnValue(mockOpportunities);
    render(<ResultsPage />);

    expect(screen.getByText("Opportunities for You")).toBeInTheDocument();
  });

  it("does not crash when useQuery returns an error", () => {
    mockUseQuery.mockReturnValue(new Error("fetch failed"));
    expect(() => render(<ResultsPage />)).not.toThrow();
  });


});
