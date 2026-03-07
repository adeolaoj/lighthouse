export type Opportunity = {
  id: string;
  labURL: string;
  labName: string;
  labDescription: string;
  headFaculty: string;
  opportunityType?: string;
  researcherInformation?: string;
  researchFocus?: string;
  researchPositionTitle?: string;
  postedAt: number;
  color: string;
};