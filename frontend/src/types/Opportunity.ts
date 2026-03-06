

export type MatchStatus = "Strong Match" | "Good Match" | "Potential Match";

export interface Opportunity {
  id: number;
  lab: string;
  professor: string;
  department: string;
  focus: string;
  whyMatch: string;
  status: MatchStatus;
  openings: number;
  paid: boolean;
  color: string;
}