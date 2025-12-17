import type { CSSProperties } from "react";
import { AudioOutlined, SearchOutlined, PlusCircleOutlined, FileTextOutlined, BulbOutlined, StarTwoTone, BookOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <main style={styles.main}>
      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <div style={styles.searchIconWrapper}>
            <SearchOutlined style={styles.searchIcon} />
          </div>
          <input
            style={styles.searchInput}
            placeholder="Type a word to begin search..."
            value="Serendipity"
          />
          <div style={styles.shortcutWrapper}>
            <span style={styles.shortcut}>⌘K</span>
          </div>
        </div>
        <div style={styles.filterButtonsContainer}>
          <button style={{ ...styles.filterButton, ...styles.activeFilterButton }}>Recent</button>
          <button style={styles.filterButton}>Nouns</button>
          <button style={styles.filterButton}>Verbs</button>
          <button style={styles.filterButton}>Idioms</button>
        </div>
      </div>
      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.wordHeader}>
            <div style={styles.wordInfo}>
              <h1 style={styles.wordTitle}>Serendipity</h1>
              <div style={styles.pronunciationContainer}>
                <p style={styles.pronunciation}>/ˌserənˈdipədē/</p>
                <button style={styles.soundButton}>
                  <AudioOutlined style={styles.soundIcon} />
                </button>
              </div>
            </div>
            <div style={styles.actionButtons}>
              <button style={styles.addButton}>
                <PlusCircleOutlined style={styles.addIcon} />
                <span>Add to Deck</span>
              </button>
              <button style={styles.favoriteButton}>
                <StarTwoTone style={styles.favoriteIcon} />
              </button>
            </div>
          </div>
          <div style={styles.tagContainer}>
            <span style={styles.tag}>Noun</span>
            <span style={styles.positiveTag}>Positive</span>
            <span style={styles.levelTag}>Level C2</span>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.definitionTitle}>
            <BookOutlined style={styles.menuBookIcon} />
            Definition
          </h3>
          <div style={styles.definitionContent}>
            <div style={styles.definitionItem}>
              <span style={styles.definitionNumber}>1</span>
              <div style={styles.definitionTextContainer}>
                <p style={styles.definitionText}>The occurrence and development of events by chance in a happy or beneficial way.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.aiCard}>
          <div style={styles.aiCardContent}>
            <div style={styles.aiHeader}>
              <BulbOutlined style={styles.autoAwesomeIcon} />
              <span style={styles.aiTitle}>AI Context & Insight</span>
            </div>
            <p style={styles.aiText}>
              Think of this as a <span style={styles.highlightedWord}>"happy accident."</span> The term was coined by Horace Walpole in 1754, inspired by the Persian fairy tale <span style={styles.italicText}>The Three Princes of Serendip</span>, whose heroes were always making discoveries, by accidents and sagacity, of things they were not in quest of.
            </p>
            <div style={styles.mnemonicContainer}>
              <p style={styles.mnemonicText}>
                <span style={styles.boldText}>Mnemonic:</span> Use the movie title "Serendipity" where two strangers find love through a series of fortunate, accidental meetings.
              </p>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.examplesTitle}>
            <FileTextOutlined style={styles.quoteIcon} />
            Examples
          </h3>
          <ul style={styles.examplesList}>
            <li style={styles.exampleItem}>
              <p style={styles.exampleText}>
                It was pure <strong style={styles.exampleHighlighted}>serendipity</strong> that we met at the coffee shop right before the rain started.
              </p>
            </li>
            <li style={styles.exampleItem}>
              <p style={styles.exampleText}>
                Many scientific discoveries are a result of <strong style={styles.exampleHighlighted}>serendipity</strong> rather than strict planning.
              </p>
            </li>
          </ul>
        </div>

        <div style={styles.spacer} />
      </div>

      <div style={styles.floatingButtonContainer}>
        <button style={styles.floatingButton}>
          <span style={styles.floatingButtonText}>Review Flashcards</span>
        </button>
      </div>
    </main>
  )

}

const styles: { [key: string]: CSSProperties } = {
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  searchSection: {
    padding: '32px',
    paddingBottom: '8px',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 10,
    flexShrink: 0,
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIconWrapper: {
    position: 'absolute',
    left: '16px',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  searchIcon: {
    color: '#94a3b8',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '48px',
    paddingRight: '64px',
    paddingTop: '16px',
    paddingBottom: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#0f172a',
    fontSize: '18px',
    outline: 'none',
  },
  shortcutWrapper: {
    position: 'absolute',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  shortcut: {
    fontSize: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    padding: '4px 8px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  filterButtonsContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    overflowX: 'auto',
  },
  filterButton: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '9999px',
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
  },
  activeFilterButton: {
    backgroundColor: 'rgba(19, 91, 236, 0.1)',
    color: '#135bec',
    borderColor: 'rgba(19, 91, 236, 0.2)',
    cursor: 'default',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 32px',
    paddingBottom: '64px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9',
    marginBottom: '24px',
  },
  wordHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  wordInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  wordTitle: {
    fontSize: '40px',
    fontWeight: '900',
    color: '#0f172a',
    margin: 0,
    lineHeight: '1.1',
  },
  pronunciationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  pronunciation: {
    fontSize: '20px',
    color: '#64748b',
    fontFamily: 'monospace',
    fontWeight: 'normal',
    margin: 0,
  },
  soundButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    cursor: 'pointer',
  },
  soundIcon: {
    fontSize: '20px',
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#135bec',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
  },
  addIcon: {
    fontSize: '20px',
  },
  favoriteButton: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    color: '#94a3b8',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  favoriteIcon: {
    fontSize: '20px',
  },
  tagContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '24px',
    flexWrap: 'wrap',
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '8px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '14px',
    fontWeight: '500',
  },
  positiveTag: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '8px',
    backgroundColor: '#f0fdf4',
    color: '#22c55e',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #dcfce7',
  },
  levelTag: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '8px',
    backgroundColor: '#faf5ff',
    color: '#a855f7',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #f3e8ff',
  },
  definitionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  menuBookIcon: {
    fontSize: '20px',
  },
  definitionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  definitionItem: {
    display: 'flex',
    gap: '16px',
  },
  definitionNumber: {
    color: '#cbd5e1',
    fontSize: '24px',
    fontWeight: 'bold',
    userSelect: 'none',
  },
  definitionTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  definitionText: {
    color: '#334155',
    fontSize: '18px',
    lineHeight: '1.5',
    margin: 0,
  },
  aiCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #bfdbfe',
    backgroundColor: '#eff6ff',
    backgroundImage: 'linear-gradient(to bottom right, #eff6ff, #e0f2fe)',
    marginBottom: '24px',
  },
  aiCardContent: {
    position: 'relative',
    zIndex: 10,
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  autoAwesomeIcon: {
    fontSize: '20px',
  },
  aiTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#135bec',
  },
  aiText: {
    color: '#334155',
    lineHeight: '1.6',
    fontSize: '16px',
    marginBottom: '16px',
  },
  highlightedWord: {
    fontWeight: '600',
    color: '#135bec',
  },
  italicText: {
    fontStyle: 'italic',
  },
  mnemonicContainer: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #bfdbfe',
  },
  mnemonicText: {
    fontSize: '14px',
    color: '#475569',
    margin: 0,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  examplesTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  quoteIcon: {
    fontSize: '20px',
  },
  examplesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    margin: 0,
    padding: 0,
  },
  exampleItem: {
    paddingLeft: '16px',
    borderLeft: '2px solid #e2e8f0',
  },
  exampleText: {
    color: '#475569',
    fontSize: '18px',
    lineHeight: '1.5',
    margin: 0,
  },
  exampleHighlighted: {
    fontWeight: '600',
    color: '#135bec',
  },
  spacer: {
    height: '40px',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: '32px',
    right: '32px',
  },
  floatingButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '56px',
    padding: '0 24px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderRadius: '9999px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  floatingButtonText: {
    color: '#ffffff',
    fontSize: '16px',
  },
};
