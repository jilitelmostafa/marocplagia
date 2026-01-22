export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface PlagiarismAnalysis {
  score: number; // Overall max risk score
  aiScore: number; // Likelihood of being AI-generated (0-100)
  plagiarismScore: number; // Likelihood of being copied from web (0-100)
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  flaggedSegments: {
    segment: string;
    reason: string;
  }[];
}

export interface AnalysisResult {
  analysis: PlagiarismAnalysis;
  sources: GroundingChunk[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}