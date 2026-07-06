import { useEffect, useState } from 'react';
import type { Chapter, MediaType } from '../data/chapters';
import { mediaPath, MEDIA_OPTIONS } from '../data/chapters';
import { parseQuizCsv, type QuizItem } from '../utils/parseCsv';

const TABS = MEDIA_OPTIONS.map((opt) => ({
  id: opt.type,
  label: opt.label,
  icon: opt.type === 'video' ? '▶' : opt.type === 'podcast' ? '♪' : opt.type === 'infographic' ? '◫' : '?',
}));

type Props = {
  chapter: Chapter;
};

export default function ChapterContent({ chapter }: Props) {
  const [tab, setTab] = useState<MediaType>('video');

  useEffect(() => {
    setTab('video');
  }, [chapter.id]);

  const option = MEDIA_OPTIONS.find((m) => m.type === tab)!;
  const src = mediaPath(chapter.prefix, option.suffix, option.ext);

  return (
    <div className="subchapter-content">
      <header className="subchapter-head">
        <p className="eyebrow">{chapter.subtitle}</p>
        <h2>{chapter.title}</h2>
      </header>

      <div className="media-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`media-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span aria-hidden>{t.icon} </span>
            {t.label}
          </button>
        ))}
      </div>

      <div
        className="media-stage"
        role="tabpanel"
        onContextMenu={(event) => event.preventDefault()}
      >
        {tab === 'video' && (
          <video className="video" src={src} controls controlsList="nodownload" playsInline />
        )}
        {tab === 'podcast' && (
          <div className="media-block">
            <audio className="audio" src={src} controls controlsList="nodownload" />
          </div>
        )}
        {tab === 'infographic' && (
          <img className="infographic" src={src} alt={`${chapter.title} infographic`} />
        )}
        {tab === 'questionnaire' && <Questionnaire src={src} />}
      </div>
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

  return (
    <div className="questionnaire">
      <p className="questionnaire__progress">
        Question {index + 1} of {items.length}
      </p>

      <div className="questionnaire__nav-row">
        <button
          type="button"
          className="questionnaire__arrow"
          onClick={() => {
            if (atStart) return;
            setIndex((i) => i - 1);
            setRevealed(false);
          }}
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
          onClick={() => {
            if (atEnd) return;
            setIndex((i) => i + 1);
            setRevealed(false);
          }}
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
