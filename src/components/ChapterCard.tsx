import type { Chapter } from '../data/chapters';
import { MEDIA_OPTIONS } from '../data/chapters';
import type { MediaType } from '../data/chapters';

type Props = {
  chapter: Chapter;
  index: number;
  onSelectMedia: (chapter: Chapter, media: MediaType) => void;
};

const ACCENT = ['er', 'cca', 'htas'] as const;

export default function ChapterCard({ chapter, index, onSelectMedia }: Props) {
  const accent = ACCENT[index] ?? 'er';

  return (
    <article className={`chapter-card chapter-card--${accent}`}>
      <header className="chapter-card__header">
        <span className="chapter-card__number">{String(index + 1).padStart(2, '0')}</span>
        <h2 className="chapter-card__title">{chapter.title}</h2>
        <p className="chapter-card__subtitle">{chapter.subtitle}</p>
      </header>

      <div className="chapter-card__media">
        {MEDIA_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            type="button"
            className="media-btn"
            onClick={() => onSelectMedia(chapter, opt.type)}
          >
            <span className="media-btn__icon" aria-hidden>
              {MEDIA_ICONS[opt.type]}
            </span>
            <span className="media-btn__label">{opt.label}</span>
          </button>
        ))}
      </div>
    </article>
  );
}

const MEDIA_ICONS: Record<MediaType, string> = {
  video: '▶',
  podcast: '♫',
  infographic: '◫',
  questionnaire: '?',
};
