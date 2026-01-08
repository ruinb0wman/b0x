import type { CSSProperties } from "react";

export default function Test() {
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo} />
          <div style={styles.logoText}>
            <h1 style={styles.logoTitle}>Lexicon AI</h1>
            <p style={styles.logoSubtitle}>Personal Edition</p>
          </div>
        </div>
        
        <nav style={styles.nav}>
          <a style={styles.navItemActive} href="#">
            <span style={styles.icon}>📚</span>
            <span style={styles.navText}>Dictionary</span>
          </a>
          <a style={styles.navItem} href="#">
            <span style={styles.icon}>🧠</span>
            <span style={styles.navText}>Study Queue</span>
            <span style={styles.badge}>12</span>
          </a>
          <a style={styles.navItem} href="#">
            <span style={styles.icon}>⭐</span>
            <span style={styles.navText}>Favorites</span>
          </a>
          <a style={styles.navItem} href="#">
            <span style={styles.icon}>📜</span>
            <span style={styles.navText}>History</span>
          </a>
          <div style={styles.navSection}>
            <p style={styles.navSectionTitle}>SYSTEM</p>
          </div>
          <a style={styles.navItem} href="#">
            <span style={styles.icon}>⚙️</span>
            <span style={styles.navText}>Settings</span>
          </a>
        </nav>
        
        <div style={styles.sidebarFooter}>
          <div style={styles.progressCard}>
            <div style={styles.progressHeader}>
              <p style={styles.progressTitle}>Daily Goal</p>
              <span style={styles.progressPercent}>80%</span>
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill}></div>
            </div>
            <p style={styles.progressText}>4 of 5 words mastered today.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <div style={styles.searchIcon}>🔍</div>
            <input 
              style={styles.searchInput}
              placeholder="Type a word to begin search..." 
              type="text" 
              defaultValue="Serendipity"
            />
            <div style={styles.shortcut}>⌘K</div>
          </div>
          <div style={styles.filterButtons}>
            <button style={styles.filterButtonActive}>Recent</button>
            <button style={styles.filterButton}>Nouns</button>
            <button style={styles.filterButton}>Verbs</button>
            <button style={styles.filterButton}>Idioms</button>
          </div>
        </div>
        
        <div style={styles.content}>
          <div style={styles.contentInner}>
            {/* Word Header */}
            <div style={styles.card}>
              <div style={styles.wordHeader}>
                <div style={styles.wordInfo}>
                  <h1 style={styles.wordTitle}>Serendipity</h1>
                  <div style={styles.pronunciation}>
                    <p style={styles.phonetic}>/ˌserənˈdipədē/</p>
                    <button style={styles.playButton}>🔊</button>
                  </div>
                </div>
                <div style={styles.wordActions}>
                  <button style={styles.addButton}>
                    <span>➕</span>
                    <span>Add to Deck</span>
                  </button>
                  <button style={styles.starButton}>⭐</button>
                </div>
              </div>
              <div style={styles.tags}>
                <span style={styles.tag}>Noun</span>
                <span style={styles.tagPositive}>Positive</span>
                <span style={styles.tagLevel}>Level C2</span>
              </div>
            </div>

            {/* Definition */}
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>📖</span>
                Definition
              </h3>
              <div style={styles.definition}>
                <span style={styles.definitionNumber}>1</span>
                <p style={styles.definitionText}>The occurrence and development of events by chance in a happy or beneficial way.</p>
              </div>
            </div>

            {/* AI Context */}
            <div style={styles.aiCard}>
              <div style={styles.aiHeader}>
                <span style={styles.aiIcon}>✨</span>
                <span style={styles.aiTitle}>AI CONTEXT & INSIGHT</span>
              </div>
              <p style={styles.aiText}>
                Think of this as a <span style={styles.highlight}>"happy accident."</span> The term was coined by Horace Walpole in 1754, inspired by the Persian fairy tale <span style={styles.italic}>The Three Princes of Serendip</span>, whose heroes were always making discoveries, by accidents and sagacity, of things they were not in quest of.
              </p>
              <div style={styles.aiMnemonic}>
                <p style={styles.mnemonicText}>
                  <span style={styles.mnemonicLabel}>Mnemonic:</span> Use the movie title "Serendipity" where two strangers find love through a series of fortunate, accidental meetings.
                </p>
              </div>
            </div>

            {/* Examples */}
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>💬</span>
                Examples
              </h3>
              <ul style={styles.examples}>
                <li style={styles.example}>
                  <p style={styles.exampleText}>
                    It was pure <strong style={styles.exampleHighlight}>serendipity</strong> that we met at the coffee shop right before the rain started.
                  </p>
                </li>
                <li style={styles.example}>
                  <p style={styles.exampleText}>
                    Many scientific discoveries are a result of <strong style={styles.exampleHighlight}>serendipity</strong> rather than strict planning.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Floating Action Button */}
        <div style={styles.fab}>
          <button style={styles.fabButton}>
            <span>🎴</span>
            <span>Review Flashcards</span>
          </button>
        </div>
      </main>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#f6f6f8',
    color: '#0f172a',
  },
  sidebar: {
    width: '288px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    zIndex: 20,
  },
  sidebarHeader: {
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxO1veDgmmcCchPpeeWkmv8610BZLgLxlhMpiklG2RXgIQLmA1RBMIkxizSUo8BSRyHCspqUFpJKLg8frjB2F8i7B5qyzjjtXcSUVwzFkASEH0RNuB5exjurgF57NH-uMYA0akT5D7wdKp6D7JvNNVT9OgDXoIHFbWJ7fyLfP7YsFyTIROnjK7WouoN02Nndfdhh-Erlbvsu-yq8xBmly8OmCr4uXZXtO_LgVWa5HAqn_MDc34XFlKlfAmSfXly9gZ4EEORhvskG4")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    flexShrink: 0,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    lineHeight: '1.2',
    margin: 0,
    color: '#0f172a',
  },
  logoSubtitle: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#64748b',
    margin: 0,
  },
  nav: {
    flex: 1,
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#475569',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    backgroundColor: 'rgba(19, 91, 236, 0.1)',
    color: '#135bec',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  icon: {
    fontSize: '20px',
  },
  navText: {
    fontSize: '14px',
  },
  badge: {
    marginLeft: 'auto',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '9999px',
  },
  navSection: {
    paddingTop: '16px',
    paddingBottom: '8px',
  },
  navSectionTitle: {
    padding: '0 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
  },
  sidebarFooter: {
    padding: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  progressCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #f1f5f9',
  },
  progressHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  progressTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
  },
  progressPercent: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#135bec',
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#cbd5e1',
    borderRadius: '9999px',
    height: '8px',
    marginBottom: '8px',
  },
  progressFill: {
    backgroundColor: '#135bec',
    height: '8px',
    borderRadius: '9999px',
    width: '80%',
  },
  progressText: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  },
  searchSection: {
    padding: '24px 32px 8px',
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    zIndex: 10,
    flexShrink: 0,
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '20px',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  searchInput: {
    display: 'block',
    width: '100%',
    paddingLeft: '48px',
    paddingRight: '16px',
    paddingTop: '16px',
    paddingBottom: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '18px',
    color: '#0f172a',
    outline: 'none',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
  },
  shortcut: {
    position: 'absolute',
    right: '16px',
    fontSize: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    padding: '4px 8px',
    color: '#94a3b8',
    fontWeight: '500',
    pointerEvents: 'none',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    overflowX: 'auto',
    paddingBottom: '4px',
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
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  filterButtonActive: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(19, 91, 236, 0.1)',
    color: '#135bec',
    border: '1px solid rgba(19, 91, 236, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 32px 40px',
  },
  contentInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingTop: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f5f9',
  },
  wordHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  wordInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  wordTitle: {
    fontSize: '48px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.025em',
    margin: 0,
  },
  pronunciation: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  phonetic: {
    fontSize: '20px',
    color: '#64748b',
    fontFamily: 'monospace',
    margin: 0,
  },
  playButton: {
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
    fontSize: '16px',
    transition: 'all 0.2s',
  },
  wordActions: {
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
    boxShadow: '0 1px 3px rgba(19, 91, 236, 0.2)',
    transition: 'all 0.2s',
  },
  starButton: {
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
    fontSize: '16px',
    transition: 'all 0.2s',
  },
  tags: {
    display: 'flex',
    gap: '8px',
    marginTop: '24px',
    flexWrap: 'wrap',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#f1f5f9',
    color: '#374151',
  },
  tagPositive: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#f0fdf4',
    color: '#15803d',
    border: '1px solid #bbf7d0',
  },
  tagLevel: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#faf5ff',
    color: '#7c3aed',
    border: '1px solid #e9d5ff',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 0 16px 0',
  },
  sectionIcon: {
    color: '#135bec',
    fontSize: '20px',
  },
  definition: {
    display: 'flex',
    gap: '16px',
  },
  definitionNumber: {
    color: '#cbd5e1',
    fontWeight: 'bold',
    fontSize: '20px',
    userSelect: 'none',
  },
  definitionText: {
    color: '#1e293b',
    fontSize: '18px',
    lineHeight: '1.6',
    margin: 0,
  },
  aiCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #bfdbfe',
    background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  aiIcon: {
    color: '#135bec',
    fontSize: '20px',
  },
  aiTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#135bec',
  },
  aiText: {
    color: '#374151',
    lineHeight: '1.6',
    fontSize: '16px',
    margin: 0,
  },
  highlight: {
    fontWeight: '600',
    color: '#135bec',
  },
  italic: {
    fontStyle: 'italic',
  },
  aiMnemonic: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(191, 219, 254, 0.5)',
  },
  mnemonicText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    margin: 0,
  },
  mnemonicLabel: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  examples: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  example: {
    paddingLeft: '16px',
    borderLeft: '2px solid #e2e8f0',
  },
  exampleText: {
    color: '#475569',
    fontSize: '18px',
    margin: 0,
  },
  exampleHighlight: {
    color: '#135bec',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: '32px',
    right: '32px',
  },
  fabButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '56px',
    padding: '0 24px',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    borderRadius: '28px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'transform 0.2s',
  },
};
