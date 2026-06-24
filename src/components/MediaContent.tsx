import { useEffect, useState } from 'react';
import type { Chapter, MediaType } from '../data/chapters';
import { mediaPath, MEDIA_OPTIONS } from '../data/chapters';
import { parseQuizCsv, type QuizItem } from '../utils/parseCsv';
import { ProgressLink } from './ProgressLink';

const COURSE_TITLE = 'Health Technology Assessment';
const OVERVIEW_IMAGE = '/HTA.png';

type Props = {
  chapter: Chapter;
  mediaType: MediaType;
  onHome: () => void;
};

export default function MediaContent({ chapter, mediaType, onHome }: Props) {
  const option = MEDIA_OPTIONS.find((m) => m.type === mediaType)!;
  const src = mediaPath(chapter.prefix, option.suffix, option.ext);

  return (
    <div className="app-shell media-shell">
      <header className="app-header">
        <button
          type="button"
          className="home-overview-btn"
          onClick={onHome}
          aria-label="Back to course overview"
        >
          <span className="home-overview-btn__media">
            <img
              src={OVERVIEW_IMAGE}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="home-overview-btn__fallback" aria-hidden>
              ⊕
            </span>
          </span>
          <span className="home-overview-btn__label">Course overview</span>
        </button>
        <h1>{COURSE_TITLE}</h1>
        <ProgressLink className="progress-link--header" compact />
      </header>

      <section className="media-panel">
        <div className="media-panel__meta">
          <span className="media-panel__chapter">{chapter.title}</span>
          <span className="media-panel__format">{option.label}</span>
        </div>

        <div className="media-panel__body">
          {mediaType === 'video' && (
            <video className="media-video" src={src} controls playsInline />
          )}
          {mediaType === 'podcast' && (
            <div className="media-audio-wrap">
              <p className="media-audio-label">Podcast</p>
              <audio className="media-audio" src={src} controls />
            </div>
          )}
          {mediaType === 'infographic' && (
            <img className="media-infographic" src={src} alt={`${chapter.title} infographic`} />
          )}
          {mediaType === 'questionnaire' && <Questionnaire src={src} />}
        </div>
      </section>
    </div>
  );
}

function Questionnaire({ src }: { src: string }) {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setIndex(0);
    setRevealed(false);

    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error('Could not load the questionnaire.');
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const parsed = parseQuizCsv(text);
        if (parsed.length === 0) throw new Error('The questionnaire is empty.');
        setItems(parsed);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (loading) return <p className="quiz-status">Loading questionnaire…</p>;
  if (error) return <p className="quiz-status quiz-status--error">{error}</p>;

  const item = items[index];
  const atStart = index === 0;
  const atEnd = index >= items.length - 1;

  const goPrevious = () => {
    if (atStart) return;
    setIndex((i) => i - 1);
    setRevealed(false);
  };

  const goNext = () => {
    if (atEnd) return;
    setIndex((i) => i + 1);
    setRevealed(false);
  };

  return (
    <div className="questionnaire">
      <p className="questionnaire__progress">
        Question {index + 1} of {items.length}
      </p>

      <div className="questionnaire__nav-row">
        <button
          type="button"
          className="questionnaire__arrow"
          onClick={goPrevious}
          disabled={atStart}
          aria-label="Previous question"
        >
          ←
        </button>

        <div className="questionnaire__card">
          <p className="questionnaire__question">{item.question}</p>
          {revealed ? (
            <div className="questionnaire__answer">
              <span className="questionnaire__answer-label">Answer</span>
              <p>{item.answer}</p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="questionnaire__arrow"
          onClick={goNext}
          disabled={atEnd}
          aria-label="Next question"
        >
          →
        </button>
      </div>

      {!revealed ? (
        <button type="button" className="questionnaire__reveal" onClick={() => setRevealed(true)}>
          Show answer
        </button>
      ) : null}
    </div>
  );
}
