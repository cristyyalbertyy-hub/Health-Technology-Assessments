export type MediaType = 'video' | 'podcast' | 'infographic' | 'questionnaire';

export type Chapter = {
  id: string;
  prefix: string;
  title: string;
  subtitle: string;
};

export const MEDIA_OPTIONS: { type: MediaType; label: string; suffix: string; ext: string }[] = [
  { type: 'video', label: 'Video', suffix: 'V', ext: 'mp4' },
  { type: 'podcast', label: 'Podcast', suffix: 'P', ext: 'm4a' },
  { type: 'infographic', label: 'Infographic', suffix: 'I', ext: 'png' },
  { type: 'questionnaire', label: 'Questionnaire', suffix: 'Q', ext: 'csv' },
];

export const CHAPTERS: Chapter[] = [
  {
    id: 'ER',
    prefix: 'HTA_ER',
    title: 'European Regulations in Health Technology Assessment',
    subtitle: 'Applied Economics in Medicine',
  },
  {
    id: 'CCA',
    prefix: 'HTA_CCA',
    title: 'Cost Consequences Approach',
    subtitle: 'Health Technology Assessment',
  },
  {
    id: 'HTAS',
    prefix: 'HTA_HTAS',
    title: 'HTA Structure',
    subtitle: 'Applied Economics in Medicine',
  },
];

export function mediaPath(prefix: string, suffix: string, ext: string): string {
  return `/${prefix}_${suffix}.${ext}`;
}
