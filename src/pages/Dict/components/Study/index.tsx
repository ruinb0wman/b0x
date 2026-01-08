import React, { useState } from 'react';
import type { CSSProperties } from 'react';

// Define the type for a dictionary card
interface DictionaryCard {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  mnemonic: string;
  rating: number | null;
}

const Study: React.FC = () => {
  // Sample data for the study card
  const [currentCard, setCurrentCard] = useState<DictionaryCard>({
    id: '1',
    word: 'Serendipity',
    pronunciation: '/ˌserənˈdipədē/',
    partOfSpeech: 'Noun',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    example: 'It was pure <strong>serendipity</strong> that we met at the coffee shop right before the interview.',
    mnemonic: 'Think of the "Three Princes of Serendip," a Persian fairy tale where the heroes were always making discoveries, by accidents and sagacity, of things they were not in quest of.',
    rating: null,
  });

  // Progress data
  const totalWords = 50;
  const reviewedWords = 15;
  const progressPercentage = (reviewedWords / totalWords) * 100;

  // Handle rating selection
  const handleRating = (rating: number) => {
    setCurrentCard(prev => ({
      ...prev,
      rating
    }));
  };

  // Handle showing answer (spacebar functionality)
  const [showAnswer, setShowAnswer] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Spacebar to show/hide answer
      if (event.code === 'Space') {
        event.preventDefault();
        setShowAnswer(!showAnswer);
      }

      // Number keys 1-5 for rating
      if (event.code >= 'Digit1' && event.code <= 'Digit5') {
        const rating = parseInt(event.code.replace('Digit', '')) - 1;
        handleRating(rating);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAnswer]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLogo}>
            <div style={styles.logoIcon}>
              <span style={styles.materialIcon}>school</span>
            </div>
            <h2 style={styles.headerTitle}>Lexicon AI</h2>
          </div>
          <nav style={styles.nav}>
            <a style={styles.navLink} href="#">Dashboard</a>
            <a style={{...styles.navLink, ...styles.navLinkActive}} href="#">Study</a>
            <a style={styles.navLink} href="#">Decks</a>
            <a style={styles.navLink} href="#">Stats</a>
          </nav>
          <div style={styles.headerActions}>
            <button style={styles.iconButton}>
              <span style={styles.materialIcon}>settings</span>
            </button>
            <div style={styles.avatar}>
              <img
                alt="User Profile Avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCdm7YttbcF8wIQAED_luComXrBd7T0eFrGvTAcQFbHqT8DhoGmE8hQTaz-1uiSjoi2i-xI3cyDLjFx6cF2ku-3dU5qhPbfszzI72xZSTj1R-ofxPn91YG7rx5a96JoAM5aBej8Vp95xTZHqgJei7R4lOBQhrwYfhvG5xPV-t92w0ljopnYj4Ff8frd9l1oxEKDPIvOMcxEV0u3s7_b3UR6r_gRefVBZt3hkGJgy4dmlk1w5OG-CsmybGZXRTv54qR55Ii1F2SPOQ"
                style={styles.avatarImage}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Progress Section */}
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <div>
              <h1 style={styles.progressTitle}>Daily Review</h1>
              <p style={styles.progressSubtitle}>Keep up the momentum!</p>
            </div>
            <div style={styles.progressText}>
              <span style={styles.progressCount}>{reviewedWords}</span>
              <span style={styles.progressTotal}>/ {totalWords} words</span>
            </div>
          </div>
          <div style={styles.progressBarBackground}>
            <div style={{...styles.progressBar, width: `${progressPercentage}%`}}></div>
          </div>
        </div>

        {/* Study Card */}
        <div style={styles.cardContainer}>
          <div style={styles.cardSideBar}></div>
          <div style={styles.cardContent}>
            <div style={styles.cardActions}>
              <button style={styles.cardActionButton} title="Edit Card">
                <span style={styles.materialIcon}>edit</span>
              </button>
              <button style={styles.cardActionButton} title="Flag Item">
                <span style={styles.materialIcon}>flag</span>
              </button>
            </div>

            <div style={styles.wordInfo}>
              <div style={styles.partOfSpeech}>
                <span style={styles.partOfSpeechText}>{currentCard.partOfSpeech}</span>
              </div>
              <div style={styles.wordHeader}>
                <h2 style={styles.word}>{currentCard.word}</h2>
                <button style={styles.audioButton}>
                  <span style={styles.materialIcon}>volume_up</span>
                </button>
              </div>
              <p style={styles.pronunciation}>{currentCard.pronunciation}</p>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.contentSection}>
              <div>
                <h3 style={styles.sectionTitle}>Definition</h3>
                <p style={styles.definition}>{currentCard.definition}</p>
              </div>

              <div style={styles.exampleBox}>
                <h3 style={styles.sectionTitle}>Example Usage</h3>
                <p style={styles.example} dangerouslySetInnerHTML={{__html: currentCard.example}}></p>
              </div>

              <div style={styles.mnemonicBox}>
                <span style={styles.mnemonicIcon}>auto_awesome</span>
                <div>
                  <p style={styles.mnemonicTitle}>AI Mnemonic</p>
                  <p style={styles.mnemonicText}>{currentCard.mnemonic}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div style={styles.ratingSection}>
          <div style={styles.ratingContainer}>
            <p style={styles.ratingPrompt}>How well did you know this word?</p>
            <div style={styles.ratingGrid}>
              {[
                { label: 'Blackout', value: 0, color: '#414868' },
                { label: 'Incorrect', value: 1, color: '#f7768e' },
                { label: 'Hard', value: 2, color: '#ff9e64' },
                { label: 'Good', value: 3, color: '#7aa2f7' },
                { label: 'Perfect', value: 4, color: '#9ece6a' }
              ].map((rating, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.ratingButton,
                    ...(currentCard.rating === rating.value ? { borderColor: rating.color, backgroundColor: `${rating.color}10` } : {}),
                    ...(hoveredRating === index ? { opacity: 1 } : {})
                  }}
                  onClick={() => handleRating(rating.value)}
                  onMouseEnter={() => setHoveredRating(index)}
                  onMouseLeave={() => setHoveredRating(null)}
                >
                  <div style={{...styles.ratingLabel, color: currentCard.rating === rating.value ? rating.color : '#565f89'}}>
                    {rating.label}
                  </div>
                  <div style={styles.ratingValue}>{rating.value}</div>
                  <div style={{
                    ...styles.ratingHint,
                    opacity: hoveredRating === index ? 1 : 0
                  }}>
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div style={styles.shortcuts}>
          <span style={styles.shortcutItem}>
            <kbd style={styles.kbd}>Space</kbd> Show Answer
          </span>
          <span style={styles.shortcutItem}>
            <kbd style={styles.kbd}>1</kbd> - <kbd style={styles.kbd}>5</kbd> Rate Quality
          </span>
        </div>
      </main>
    </div>
  );
};

// Define styles for the component
const styles: { [key: string]: CSSProperties } = {
  container: {
    backgroundColor: '#1a1b26',
    color: '#c0caf5',
    fontFamily: 'Inter, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    transition: 'background-color 0.2s, color 0.2s',
  },
  header: {
    backgroundColor: '#16161e',
    borderBottom: '1px solid #1f2335',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 40px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#c0caf5',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialIcon: {
    fontSize: '24px',
    lineHeight: 1,
    fontWeight: 'normal',
    fontStyle: 'normal',
    display: 'inline-block',
    textAlign: 'center',
    textTransform: 'none',
    letterSpacing: 'normal',
    wordWrap: 'normal',
    whiteSpace: 'nowrap',
    direction: 'ltr',
    color: '#7aa2f7',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.005em',
  },
  nav: {
    display: 'none',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    color: '#a9b1d6',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  navLinkActive: {
    color: '#7aa2f7',
    fontWeight: 'bold',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#292e42',
    border: 'none',
    color: '#c0caf5',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid #414868',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 16px',
    maxWidth: '960px',
    margin: '0 auto',
    width: '100%',
  },
  progressSection: {
    width: '100%',
    marginBottom: '32px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '8px',
  },
  progressTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#c0caf5',
    margin: 0,
  },
  progressSubtitle: {
    fontSize: '14px',
    color: '#a9b1d6',
    margin: 0,
  },
  progressText: {
    textAlign: 'right',
  },
  progressCount: {
    color: '#7aa2f7',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  progressTotal: {
    color: '#a9b1d6',
    fontSize: '14px',
    fontWeight: '500',
  },
  progressBarBackground: {
    height: '8px',
    backgroundColor: '#292e42',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#7aa2f7',
    borderRadius: '4px',
    transition: 'width 0.5s ease-out',
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#1f2335',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
    border: '1px solid #292e42',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  cardSideBar: {
    width: '8px',
    backgroundColor: '#7aa2f7',
    display: 'none', // Hidden on mobile
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '32px',
    position: 'relative',
  },
  cardActions: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    display: 'flex',
    gap: '8px',
  },
  cardActionButton: {
    color: '#565f89',
    padding: '8px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  wordInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '32px',
  },
  partOfSpeech: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '8px',
    backgroundColor: '#7aa2f710',
    alignSelf: 'flex-start',
  },
  partOfSpeechText: {
    color: '#7aa2f7',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  wordHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '8px',
  },
  word: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#c0caf5',
    margin: 0,
  },
  audioButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#7aa2f7',
    color: '#1a1b26',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, background-color 0.2s',
  },
  pronunciation: {
    fontSize: '24px',
    color: '#565f89',
    fontWeight: 'normal',
    margin: '4px 0 0',
  },
  divider: {
    height: '1px',
    width: '100%',
    backgroundColor: '#292e42',
    marginBottom: '32px',
  },
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    flex: 1,
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#565f89',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
  definition: {
    fontSize: '24px',
    color: '#c0caf5',
    fontWeight: '500',
    lineHeight: '1.5',
  },
  exampleBox: {
    backgroundColor: '#24283b',
    borderRadius: '8px',
    padding: '20px',
    borderLeft: '4px solid #7aa2f7',
  },
  example: {
    fontSize: '20px',
    color: '#a9b1d6',
    lineHeight: '1.5',
    fontStyle: 'italic',
  },
  mnemonicBox: {
    backgroundColor: '#292e4280',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    border: '1px solid #414868',
  },
  mnemonicIcon: {
    fontSize: '24px',
    color: '#bb9af7',
    marginTop: '4px',
  },
  mnemonicTitle: {
    color: '#bb9af7',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  mnemonicText: {
    color: '#a9b1d6',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  ratingSection: {
    width: '100%',
    marginTop: '32px',
  },
  ratingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  ratingPrompt: {
    fontSize: '14px',
    color: '#565f89',
    fontWeight: '500',
  },
  ratingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '12px',
    width: '100%',
    maxWidth: '700px',
  },
  ratingButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px',
    borderRadius: '12px',
    backgroundColor: '#1f2335',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    opacity: 1,
  },
  ratingLabel: {
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  ratingValue: {
    fontSize: '12px',
    color: '#414868',
    fontWeight: '500',
  },
  ratingHint: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    opacity: 0,
    transition: 'opacity 0.2s',
    fontSize: '10px',
    color: '#565f89',
    fontFamily: 'monospace',
    border: '1px solid #414868',
    borderRadius: '4px',
    padding: '2px 4px',
  },
  shortcuts: {
    marginTop: '48px',
    display: 'flex',
    gap: '32px',
    fontSize: '12px',
    color: '#565f89',
  },
  shortcutItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  kbd: {
    fontFamily: 'monospace',
    backgroundColor: '#292e42',
    padding: '4px 6px',
    borderRadius: '6px',
    color: '#c0caf5',
    border: '1px solid #414868',
  },
};

export default Study;