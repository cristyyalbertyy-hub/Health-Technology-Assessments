import { useEffect, useMemo, useRef, useState } from 'react';
import ChapterContent from './components/ChapterContent';
import { CHAPTERS, courseTitle } from './data/chapters';

const overviewImage = '/HTA.png';

type Selection = { chapterId: string };

function collapsedRecord(ids: string[]): Record<string, boolean> {
  const init: Record<string, boolean> = {};
  for (const id of ids) init[id] = false;
  return init;
}

export default function App() {
  const [openChapters, setOpenChapters] = useState(() =>
    collapsedRecord(CHAPTERS.map((c) => c.id)),
  );
  const [selection, setSelection] = useState<Selection | null>(null);
  const [atHome, setAtHome] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  const selected = useMemo(() => {
    if (!selection) return null;
    return CHAPTERS.find((c) => c.id === selection.chapterId) ?? null;
  }, [selection]);

  const isBrowsing = !selected && !atHome;

  const activeChapterId = useMemo(() => {
    if (selected) return selected.id;
    if (selection && !atHome) return selection.chapterId;
    return CHAPTERS.find((c) => openChapters[c.id])?.id ?? null;
  }, [selected, selection, atHome, openChapters]);

  const browsingContext = useMemo(() => {
    if (!selection || selected) return null;
    return CHAPTERS.find((c) => c.id === selection.chapterId) ?? null;
  }, [selection, selected]);

  const mobileLessonContext = useMemo(() => {
    if (selected) {
      return {
        chapter: selected.title,
        subchapter: selected.subtitle,
        color: selected.color,
      };
    }
    if (browsingContext) {
      return {
        chapter: browsingContext.title,
        subchapter: 'Choose a chapter',
        color: browsingContext.color,
      };
    }
    return null;
  }, [selected, browsingContext]);

  const showMobileLessonBar = !mobileMenuOpen && !atHome && mobileLessonContext !== null;
  const shellMode = mobileMenuOpen ? 'is-mobile-menu' : 'is-mobile-content';

  const overviewPanel = (
    <div className="overview-panel">
      <div className="overview-intro">
        <p className="overview-lead">
          European regulations, cost consequences, and HTA structure — video, podcast, infographic,
          and questionnaire for each chapter.
        </p>
        <ul className="overview-systems" aria-label="Course chapters">
          {CHAPTERS.map((chapter) => (
            <li
              key={chapter.id}
              className="overview-systems__item"
              style={{ borderLeftColor: chapter.color }}
            >
              <strong>{chapter.title}</strong>
              <span>4 resources</span>
            </li>
          ))}
        </ul>
      </div>
      <img
        src={overviewImage}
        alt="Health Technology Assessment — course overview"
        className="overview-infographic"
      />
      <p className="overview-hint muted">
        Open a coloured chapter below, then choose a topic to start.
      </p>
      <button type="button" className="mobile-browse-btn" onClick={() => setMobileMenuOpen(true)}>
        Browse chapters →
      </button>
    </div>
  );

  const toggleChapter = (id: string) => {
    setOpenChapters((o) => ({ ...o, [id]: !o[id] }));
  };

  const selectChapter = (chapterId: string) => {
    setAtHome(false);
    setSelection({ chapterId });
    setMobileMenuOpen(false);

    const next = collapsedRecord(CHAPTERS.map((c) => c.id));
    next[chapterId] = true;
    setOpenChapters(next);
  };

  const lessonScrollKey = selected?.id ?? null;

  useEffect(() => {
    if (!lessonScrollKey) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [lessonScrollKey]);

  const goToEntry = () => {
    setAtHome(true);
    setSelection(null);
    setMobileMenuOpen(false);
    setOpenChapters(collapsedRecord(CHAPTERS.map((c) => c.id)));
  };

  return (
    <div className={`app-shell ${shellMode}`}>
      <header className={`app-header${showMobileLessonBar ? ' app-header--compact-mobile' : ''}`}>
        <button
          type="button"
          className="home-overview-btn"
          onClick={goToEntry}
          aria-label="Back to course overview"
        >
          <span className="home-overview-btn__media">
            <img
              src={overviewImage}
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
        <h1>{courseTitle}</h1>
      </header>

      {showMobileLessonBar && mobileLessonContext ? (
        <div
          className="mobile-lesson-bar"
          style={{ borderLeftColor: mobileLessonContext.color }}
        >
          <button type="button" className="mobile-menu-back" onClick={() => setMobileMenuOpen(true)}>
            ← Menu
          </button>
          <div className="mobile-lesson-bar__text">
            <span className="mobile-lesson-bar__chapter">{mobileLessonContext.chapter}</span>
            <span className="mobile-lesson-bar__sub">{mobileLessonContext.subchapter}</span>
          </div>
        </div>
      ) : null}

      <div className="layout">
        <div className="sidebar-column">
          <nav className="sidebar" aria-label={courseTitle}>
            {CHAPTERS.map((chapter) => {
              const open = openChapters[chapter.id];
              const active = selection?.chapterId === chapter.id;
              return (
                <div
                  key={chapter.id}
                  className={`accordion accordion--group${open ? ' is-open' : ''}`}
                  data-group={chapter.id}
                >
                  <button
                    type="button"
                    className="accordion-trigger accordion-trigger--group"
                    style={{ backgroundColor: chapter.color }}
                    aria-expanded={open}
                    onClick={() => toggleChapter(chapter.id)}
                  >
                    <span className="chevron" aria-hidden>
                      {open ? '▼' : '▶'}
                    </span>
                    <span className="group-name">{chapter.title}</span>
                  </button>
                  {open ? (
                    <div className="sub-tree" style={{ borderTopColor: chapter.color }}>
                      <ul className="sub-list">
                        <li>
                          <button
                            type="button"
                            className={`sub-link${active ? ' active' : ''}`}
                            onClick={() => selectChapter(chapter.id)}
                          >
                            <span className="sub-link-title">{chapter.subtitle}</span>
                            <span className="sub-link-arrow" aria-hidden>
                              ›
                            </span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>

        <main
          ref={mainRef}
          className={`main${atHome ? ' main--overview' : ''}${isBrowsing ? ' main--browsing' : ''}`}
          data-system-tint={activeChapterId ?? undefined}
        >
          {atHome ? (
            overviewPanel
          ) : selected ? (
            <ChapterContent chapter={selected} />
          ) : (
            <div className="browse-view">
              <div className="media-stage media-stage--placeholder">
                {browsingContext ? (
                  <>
                    <p className="eyebrow">{browsingContext.subtitle}</p>
                    <h2 className="browse-title">{browsingContext.title}</h2>
                    <p className="browse-hint">
                      Select the chapter in the menu to open video, podcast, infographic and questions.
                    </p>
                  </>
                ) : (
                  <p>Choose a coloured chapter in the menu on the left to start.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
