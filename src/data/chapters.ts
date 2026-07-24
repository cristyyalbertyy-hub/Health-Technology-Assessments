export type MediaType = 'video' | 'podcast' | 'infographic' | 'questionnaire';

export type Chapter = {
  id: string;
  prefix: string;
  title: string;
  subtitle: string;
  color: string;
};

export const courseTitle = 'Health Technology Assessment';

const assetBase = import.meta.env.VITE_MEDIA_ORIGIN || import.meta.env.BASE_URL;

export const overviewImage = `${assetBase}HTAA.png`;

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
    color: '#14213d',
  },
  {
    id: 'CCA',
    prefix: 'HTA_CCA',
    title: 'Cost Consequences Approach',
    subtitle: 'Health Technology Assessment',
    color: '#2d4636',
  },
  {
    id: 'HTAS',
    prefix: 'HTA_HTAS',
    title: 'HTA Structure',
    subtitle: 'Applied Economics in Medicine',
    color: '#d36b31',
  },
];

export function mediaPath(prefix: string, suffix: string, ext: string): string {
  const base = import.meta.env.VITE_MEDIA_ORIGIN || import.meta.env.BASE_URL;
  return `${base}${prefix}_${suffix}.${ext}`;
}
