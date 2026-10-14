import { CvssMetrics, SeverityRating } from '../types';

export function calculateCvss31(metrics: CvssMetrics): { score: number; vector: string; severity: SeverityRating } {
  // Exploitability metrics
  const avWeights = { NETWORK: 0.85, ADJACENT: 0.62, LOCAL: 0.55, PHYSICAL: 0.2 };
  const acWeights = { LOW: 0.77, HIGH: 0.44 };
  const prWeightsUnchanged = { NONE: 0.85, LOW: 0.62, HIGH: 0.27 };
  const prWeightsChanged = { NONE: 0.85, LOW: 0.68, HIGH: 0.5 };
  const uiWeights = { NONE: 0.85, REQUIRED: 0.62 };

  // Impact metrics
  const impactWeights = { NONE: 0, LOW: 0.22, HIGH: 0.56 };

  const av = avWeights[metrics.attackVector];
  const ac = acWeights[metrics.attackComplexity];
  const pr = metrics.scope === 'CHANGED' 
    ? prWeightsChanged[metrics.privilegesRequired] 
    : prWeightsUnchanged[metrics.privilegesRequired];
  const ui = uiWeights[metrics.userInteraction];

  const exploitability = 8.22 * av * ac * pr * ui;

  const c = impactWeights[metrics.confidentiality];
  const i = impactWeights[metrics.integrity];
  const a = impactWeights[metrics.availability];

  const iss = 1 - ((1 - c) * (1 - i) * (1 - a));

  let impact = 0;
  if (metrics.scope === 'UNCHANGED') {
    impact = 6.42 * iss;
  } else {
    impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
  }

  let baseScore = 0;
  if (impact <= 0) {
    baseScore = 0;
  } else if (metrics.scope === 'UNCHANGED') {
    baseScore = Math.min(Math.ceil((impact + exploitability) * 10) / 10, 10);
  } else {
    baseScore = Math.min(Math.ceil((1.08 * (impact + exploitability)) * 10) / 10, 10);
  }

  // Vector string
  const vector = `CVSS:3.1/AV:${metrics.attackVector[0]}/AC:${metrics.attackComplexity[0]}/PR:${metrics.privilegesRequired[0]}/UI:${metrics.userInteraction[0]}/S:${metrics.scope[0]}/C:${metrics.confidentiality[0]}/I:${metrics.integrity[0]}/A:${metrics.availability[0]}`;

  // Priority mapping (Bugcrowd VRT / Standard VDP)
  let severity: SeverityRating = 'P5';
  if (baseScore >= 9.0) {
    severity = 'P1'; // Critical
  } else if (baseScore >= 7.0) {
    severity = 'P2'; // High
  } else if (baseScore >= 4.0) {
    severity = 'P3'; // Medium
  } else if (baseScore >= 0.1) {
    severity = 'P4'; // Low
  } else {
    severity = 'P5'; // Informational
  }

  return { score: baseScore, vector, severity };
}

export function getSeverityBadge(severity: SeverityRating): { text: string; bg: string; border: string; desc: string } {
  switch (severity) {
    case 'P1':
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        desc: 'Critical (CVSS 9.0–10.0) · Immediate exploitability, total compromise'
      };
    case 'P2':
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        desc: 'High (CVSS 7.0–8.9) · Serious business logic flaw or data exposure'
      };
    case 'P3':
      return {
        text: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
        desc: 'Medium (CVSS 4.0–6.9) · Authenticated IDOR, specific cross-origin bypass'
      };
    case 'P4':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        desc: 'Low (CVSS 0.1–3.9) · Minimum accepted tier, rate limit bypass, leakage'
      };
    case 'P5':
    default:
      return {
        text: 'text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        desc: 'Informational (CVSS 0.0) · Disqualified under P4 minimum requirement'
      };
  }
}
