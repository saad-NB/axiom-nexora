/**
 * Selected work. Three public repositories, ordered by portfolio strength.
 * Descriptions are drawn from each repository README.
 * See DESIGN.md section 6.5.
 */

export interface WorkItem {
  index: string;
  name: string;
  description: string;
  tags: string[];
  href: string;
}

export const workSection = {
  index: '02',
  eyebrow: 'SELECTED WORK',
  heading: 'Built, shipped, published.',
  lead:
    'Public repositories and peer-reviewed papers. Every claim below is verifiable at the linked source.',
  publicationsLabel: 'PEER-REVIEWED / 2026',
};

export const work: WorkItem[] = [
  {
    index: '01',
    name: 'HealthGuardian',
    description:
      'Offline-first, two-tier clinical triage for elderly and rural users. Deterministic scoring engines (NEWS2, GCS, sepsis, burns) with optional on-device MedGemma AI, camera and microphone vitals sensing, and a drug-interaction checker. No server, no accounts. Android 7+ and Windows.',
    tags: ['Flutter', 'SQLite', 'On-device AI'],
    href: 'https://github.com/saad-NB/HealthGuardian',
  },
  {
    index: '02',
    name: 'birdclef2026v2',
    description:
      'Multi-branch audio classification pipeline for Kaggle BirdCLEF 2026: PerchHead, topological-data-analysis MLP, and acoustic MLP branches with pseudo-labeling and an offline-safe ONNX submission package. Best fold macro AUC 0.932.',
    tags: ['PyTorch', 'Perch', 'ONNX'],
    href: 'https://github.com/saad-NB/birdclef2026v2',
  },
  {
    index: '03',
    name: 'AlphaNova',
    description:
      'Tabular classification of crossover network security signatures for the AlphaNova competition: engineered features from network flow data, model comparison with XGBoost and random forest, and documented error analysis including limitations and policy implications.',
    tags: ['XGBoost', 'scikit-learn'],
    href: 'https://github.com/saad-NB/AlphaNova',
  },
];
