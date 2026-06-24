import { useState } from 'react';
import ChapterCard from './components/ChapterCard';
import MediaContent from './components/MediaContent';
import { ProgressLink } from './components/ProgressLink';
import type { Chapter, MediaType } from './data/chapters';
import { CHAPTERS } from './data/chapters';

const COURSE_TITLE = 'Health Technology Assessment';
const OVERVIEW_IMAGE = '/HTA.png';

type View =
  | { screen: 'home' }
  | { screen: 'media'; chapter: Chapter; mediaType: MediaType };

export default function App() {
  const [view, setView] = useState<View>({ screen: 'home' });

  const goHome = () => setView({ screen: 'home' });

  if (view.screen === 'media') {
    return (
      <MediaContent
        chapter={view.chapter}
        mediaType={view.mediaType}
        onHome={goHome}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button
          type="button"
          className="home-overview-btn"
          onClick={goHome}
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

      <main className="home-main">
        <div className="hero">
          <p className="hero__eyebrow">Applied Economics in Medicine</p>
          <p className="hero__lead">
            Choose a chapter and a content format: video, podcast, infographic, or
            questionnaire.
          </p>
          <p className="overview-progress muted">
            Already enrolled? <ProgressLink className="progress-link--inline" />
          </p>
        </div>

        <div className="chapters">
          {CHAPTERS.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={index}
              onSelectMedia={(ch, media) =>
                setView({ screen: 'media', chapter: ch, mediaType: media })
              }
            />
          ))}
        </div>
      </main>

      <footer className="footer">
        <ProgressLink className="progress-link--footer" />
        <p className="footer__tagline">
          HTA · European Regulations · Cost Consequences · HTA Structure
        </p>
      </footer>
    </div>
  );
}
