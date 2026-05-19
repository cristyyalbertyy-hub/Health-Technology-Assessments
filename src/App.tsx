import { useState } from 'react';
import ChapterCard from './components/ChapterCard';
import MediaContent from './components/MediaContent';
import type { Chapter, MediaType } from './data/chapters';
import { CHAPTERS } from './data/chapters';

type View =
  | { screen: 'home' }
  | { screen: 'media'; chapter: Chapter; mediaType: MediaType };

export default function App() {
  const [view, setView] = useState<View>({ screen: 'home' });

  if (view.screen === 'media') {
    return (
      <MediaContent
        chapter={view.chapter}
        mediaType={view.mediaType}
        onHome={() => setView({ screen: 'home' })}
      />
    );
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="hero__eyebrow">Applied Economics in Medicine</p>
        <h1 className="hero__title">Health Technology Assessment</h1>
        <p className="hero__lead">
          Choose a chapter and a content format: video, podcast, infographic, or
          questionnaire.
        </p>
      </header>

      <main className="chapters">
        {CHAPTERS.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            index={index}
            onSelectMedia={(ch, media) => setView({ screen: 'media', chapter: ch, mediaType: media })}
          />
        ))}
      </main>

      <footer className="footer">
        <p>HTA · European Regulations · Cost Consequences · HTA Structure</p>
      </footer>
    </div>
  );
}
