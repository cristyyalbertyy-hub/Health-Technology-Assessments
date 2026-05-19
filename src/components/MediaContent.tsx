import { useEffect, useState } from 'react';
import type { Chapter, MediaType } from '../data/chapters';
import { mediaPath, MEDIA_OPTIONS } from '../data/chapters';
import { parseQuizCsv, type QuizItem } from '../utils/parseCsv';
import HomeIcon from './HomeIcon';

type Props = {
  chapter: Chapter;
  mediaType: MediaType;
  onHome: () => void;
};

export default function MediaContent({ chapter, mediaType, onHome }: Props) {
  const option = MEDIA_OPTIONS.find((m) => m.type === mediaType)!;
  const src = mediaPath(chapter.prefix, option.suffix, option.ext);

  return (
    <section className="media-panel">
      <header className="media-panel__header">
        <button
          type="button"
          className="btn btn--icon"
          onClick={onHome}
          aria-label="Home"
          title="Home"
        >
          <HomeIcon />
        </button>
        <div className="media-panel__meta">
          <span className="media-panel__chapter">{chapter.title}</span>
          <span className="media-panel__format">{option.label}</span>
        </div>
      </header>

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
  const progress = `${index + 1} / ${items.length}`;

  return (
    <div className="quiz">
      <div className="quiz__progress">{progress}</div>
      <p className="quiz__question">{item.question}</p>
      {revealed ? (
        <p className="quiz__answer">
          <strong>Answer:</strong> {item.answer}
        </p>
      ) : (
        <button type="button" className="btn btn--primary" onClick={() => setRevealed(true)}>
          Show answer
        </button>
      )}
      <div className="quiz__nav">
        <button
          type="button"
          className="btn btn--secondary"
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => i - 1);
            setRevealed(false);
          }}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          disabled={index >= items.length - 1}
          onClick={() => {
            setIndex((i) => i + 1);
            setRevealed(false);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
