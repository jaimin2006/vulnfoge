export type Platform = 'Bugcrowd' | 'HackerOne' | 'YesWeHack' | 'Intigriti' | 'Responsible Disclosure (VDP)';

export type SeverityRating = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

export type SafeHarborStatus = 'Gold' | 'Standard' | 'Partial' | 'None';

export type ReportStatus = 
  | 'Draft' 
  | 'Ready for Submission' 
  | 'Submitted' 
  | 'Triaged' 
  | 'Acknowledged & Validated' 
  | 'Resolved & Closed';

export interface BugBountyProgram {
  id: string;
  name: string;
  platform: Platform;
  tier: 'Lesser-Known / High Opportunity' | 'Established Public' | 'Private / Niche';
  category: string;
  policySummary: string;
  safeHarbor: SafeHarborStatus;
  minSeverityAccepted: SeverityRating;
  bountyRange: string;
  averageTriageHours: number;
  acknowledgementRatePercent: number;
  inScopeAssets: string[];
  outOfScopeAssets: string[];
  prohibitedTestingRules: string[];
  selectionRationale: string;
  verifiedProgramUrl: string;
}

export interface CvssMetrics {
  attackVector: 'NETWORK' | 'ADJACENT' | 'LOCAL' | 'PHYSICAL';
  attackComplexity: 'LOW' | 'HIGH';
  privilegesRequired: 'NONE' | 'LOW' | 'HIGH';
  userInteraction: 'NONE' | 'REQUIRED';
  scope: 'UNCHANGED' | 'CHANGED';
  confidentiality: 'NONE' | 'LOW' | 'HIGH';
  integrity: 'NONE' | 'LOW' | 'HIGH';
  availability: 'NONE' | 'LOW' | 'HIGH';
}

export interface CompanyAcknowledgement {
  verifiedBy: string;
  triageRole: string;
  acknowledgedDate: string;
  confirmedSeverity: SeverityRating;
  bountyAwarded?: string;
  officialNote: string;
  referenceTicketId: string;
}

export interface VulnerabilityReport {
  id: string;
  programId: string;
  programName: string;
  platform: Platform;
  title: string;
  cweId: string;
  cweName: string;
  owaspCategory: string;
  targetAsset: string;
  vulnerableEndpoint: string;
  severityRating: SeverityRating;
  cvssScore: number;
  cvssVector: string;
  cvssMetrics: CvssMetrics;
  attackSurfaceSummary: string;
  reproductionSteps: string[];
  proofOfConceptRaw: string;
  impactAnalysis: string;
  recommendedMitigation: string;
  defensiveCodeSnippet: string;
  status: ReportStatus;
  acknowledgement?: CompanyAcknowledgement;
  postMortemId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostMortem {
  id: string;
  reportId: string;
  reportTitle: string;
  programName: string;
  severity: SeverityRating;
  targetSelectionRationale: string;
  reconnaissanceProcess: string[];
  testingTechniquesUsed: string[];
  challengesAndBottlenecks: string[];
  duplicatePreventionStrategy: string;
  whyAcknowledgedByCompany: string;
  lessonsLearned: string[];
  futureHuntImprovements: string[];
  completedDate: string;
}

export interface WstgChecklistItem {
  id: string;
  category: 'Target Selection & Recon' | 'Authentication & Session' | 'Authorization & IDOR' | 'Input & API Security' | 'Server-Side & Cloud Logic';
  wstgId: string;
  title: string;
  description: string;
  testingGuide: string;
  completed: boolean;
  notes?: string;
}

export interface VulnerabilityKnowledgeItem {
  cweId: string;
  title: string;
  category: string;
  defaultVrtPriority: SeverityRating;
  summary: string;
  exploitMechanics: string;
  safeTestingTip: string;
  defensiveMitigation: string;
}
