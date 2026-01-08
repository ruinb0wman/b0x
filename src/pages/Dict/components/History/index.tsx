import React, { useState, CSSProperties, useEffect } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined, ExportOutlined, DeleteOutlined, ReloadOutlined, DeleteFilled } from '@ant-design/icons';
import './historyStyles.css'; // Import the custom scrollbar styles

// Load Material Symbols font
const loadMaterialSymbols = () => {
  if (!document.querySelector('link[href*="Material+Symbols"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
    document.head.appendChild(link);
  }
};

// Define the history item type
interface HistoryItem {
  id: string;
  word: string;
  type: string;
  definition: string;
  time: string;
  icon: string;
  color: string;
}

// Define the grouped history type
interface GroupedHistory {
  [key: string]: HistoryItem[];
}

const History: React.FC = () => {
  useEffect(() => {
    loadMaterialSymbols();
  }, []);

  // Mock data for history items
  const [historyData] = useState<GroupedHistory>({
    'Today': [
      {
        id: '1',
        word: 'Serendipity',
        type: 'noun',
        definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
        time: '10 mins ago',
        icon: 'lightbulb',
        color: 'indigo'
      },
      {
        id: '2',
        word: 'Cognitive Dissonance',
        type: 'psychology',
        definition: 'Mental discomfort experienced by a person who holds two or more contradictory beliefs.',
        time: '2 hours ago',
        icon: 'psychology',
        color: 'teal'
      },
      {
        id: '3',
        word: 'Schadenfreude',
        type: 'noun • german',
        definition: 'Pleasure derived by someone from another person\'s misfortune.',
        time: '4:32 PM',
        icon: 'translate',
        color: 'rose'
      }
    ],
    'Yesterday': [
      {
        id: '4',
        word: 'Ephemeral',
        type: 'adjective',
        definition: 'Lasting for a very short time.',
        time: '9:15 AM',
        icon: 'wb_sunny',
        color: 'amber'
      },
      {
        id: '5',
        word: 'Ubiquitous',
        type: 'adjective',
        definition: 'Present, appearing, or found everywhere.',
        time: '8:05 AM',
        icon: 'auto_fix',
        color: 'purple'
      }
    ]
  });

  const [filter, setFilter] = useState('');

  // Function to handle clearing history
  const handleClearHistory = () => {
    console.log('Clearing history');
    // In a real implementation, you would clear the history from storage
  };

  // Function to handle exporting history
  const handleExport = () => {
    console.log('Exporting history');
    // In a real implementation, you would export the history
  };

  // Function to handle deleting a specific item
  const handleDeleteItem = (id: string) => {
    console.log(`Deleting item with id: ${id}`);
    // In a real implementation, you would remove the item from history
  };

  // Function to handle re-querying a word
  const handleRequery = (word: string) => {
    console.log(`Re-querying word: ${word}`);
    // In a real implementation, you would trigger a new search for this word
  };

  // Function to get color classes based on the color name
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'indigo':
        return { backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' };
      case 'teal':
        return { backgroundColor: 'rgba(20, 184, 166, 0.1)', color: '#2dd4bf' };
      case 'rose':
        return { backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#f472b6' };
      case 'amber':
        return { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' };
      case 'purple':
        return { backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa' };
      default:
        return { backgroundColor: 'rgba(107, 114, 128, 0.1)', color: '#9ca3af' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Top Header */}
        <header style={styles.header}>
          <div style={styles.headerText}>
            <h2 style={styles.headerTitle}>Search History</h2>
            <p style={styles.headerSubtitle}>Review your learning path and rediscover words.</p>
          </div>
          <div style={styles.headerActions}>
            <Button
              style={styles.exportButton}
              onClick={handleExport}
              icon={<ExportOutlined />}
            >
              Export
            </Button>
            <Button
              style={styles.clearButton}
              onClick={handleClearHistory}
              icon={<DeleteOutlined />}
              danger
            >
              Clear History
            </Button>
          </div>
        </header>

        {/* Search Filter Area */}
        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <Input
              placeholder="Filter history..."
              prefix={<SearchOutlined style={styles.searchIcon} />}
              style={styles.searchInput}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable List Container */}
        <div style={styles.historyContainer} className="history-container">
          {Object.entries(historyData).map(([date, items]) => (
            <section key={date} style={styles.section}>
              {/* Date Group Header */}
              <div style={styles.dateHeader}>
                <h3 style={styles.dateTitle}>{date}</h3>
                <div style={styles.divider}></div>
              </div>

              {/* History Items */}
              <div style={styles.itemsContainer}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={styles.historyItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(19, 91, 236, 0.5)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';

                      const actionButtons = e.currentTarget.querySelector('.action-buttons');
                      if (actionButtons) {
                        actionButtons.setAttribute('style',
                          'opacity: 1; transition: opacity 0.2s, transform 0.2s; transform: translateX(0);'
                        );
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#2d333b';
                      e.currentTarget.style.boxShadow = 'none';

                      const actionButtons = e.currentTarget.querySelector('.action-buttons');
                      if (actionButtons) {
                        actionButtons.setAttribute('style',
                          'opacity: 0; transition: opacity 0.2s, transform 0.2s; transform: translateX(8px);'
                        );
                      }
                    }}
                  >
                    <div style={styles.itemContent}>
                      <div style={styles.itemIconContainer}>
                        <div style={{...styles.itemIcon, ...getColorClasses(item.color)}}>
                          <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                      </div>
                      <div style={styles.itemDetails}>
                        <div style={styles.wordContainer}>
                          <h4 style={styles.wordTitle}>{item.word}</h4>
                          <span style={styles.wordType}>{item.type}</span>
                        </div>
                        <p style={styles.definition}>{item.definition}</p>
                      </div>
                    </div>

                    <div style={styles.itemActions}>
                      <span style={styles.time}>{item.time}</span>
                      <div
                        className="action-buttons"
                        style={styles.actionButtons}
                      >
                        <Button
                          type="text"
                          shape="circle"
                          size="small"
                          style={styles.actionButton}
                          onClick={() => handleRequery(item.word)}
                          icon={<ReloadOutlined />}
                        />
                        <Button
                          type="text"
                          shape="circle"
                          size="small"
                          style={styles.deleteButton}
                          onClick={() => handleDeleteItem(item.id)}
                          icon={<DeleteFilled />}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div style={styles.loadMoreContainer}>
            <Button style={styles.loadMoreButton}>
              Load More <span className="material-symbols-outlined" style={styles.loadMoreIcon}>expand_more</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Define styles for the component
const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: '#1a1d23', // dark background
    color: '#ffffff', // white text
    fontFamily: '\'Inter\', sans-serif',
    overflow: 'hidden'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '\'Inter\', sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 32px',
    borderBottom: '1px solid #2d333b',
    backgroundColor: '#1a1d23',
    zIndex: 10,
    flexShrink: 0,
    fontFamily: '\'Inter\', sans-serif'
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  exportButton: {
    color: '#94a3b8',
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    transition: 'all 0.2s'
  },
  clearButton: {
    color: '#ef4444',
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    transition: 'all 0.2s'
  },
  searchContainer: {
    padding: '16px 32px 8px',
    flexShrink: 0
  },
  searchWrapper: {
    position: 'relative',
    maxWidth: '640px'
  },
  searchInput: {
    width: '100%',
    paddingLeft: '40px',
    backgroundColor: '#23272f',
    borderColor: '#2d333b',
    color: '#ffffff',
    borderRadius: '8px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8'
  },
  historyContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 32px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column'
  },
  dateHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(26, 29, 35, 0.95)',
    backdropFilter: 'blur(4px)',
    padding: '12px 0',
    zIndex: 10,
    flexShrink: 0
  },
  dateTitle: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#94a3b8',
    margin: 0
  },
  divider: {
    flex: 1,
    height: '1px',
    backgroundColor: '#2d333b'
  },
  itemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  historyItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#23272f',
    border: '1px solid #2d333b',
    borderRadius: '12px',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  itemContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  itemIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginTop: '4px'
  },
  itemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '50%'
  },
  itemDetails: {
    flex: 1
  },
  wordContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '4px'
  },
  wordTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0
  },
  wordType: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '2px 8px',
    borderRadius: '12px',
    backgroundColor: '#2d333b',
    color: '#94a3b8'
  },
  definition: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
    lineHeight: 1.4
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    paddingLeft: 0
  },
  time: {
    fontSize: '12px',
    color: '#94a3b8',
    whiteSpace: 'nowrap'
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    opacity: 0,
    transition: 'opacity 0.2s, transform 0.2s',
    transform: 'translateX(8px)'
  },
  actionButton: {
    color: '#94a3b8',
    transition: 'all 0.2s'
  },
  deleteButton: {
    color: '#94a3b8',
    transition: 'all 0.2s'
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '24px'
  },
  loadMoreButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#2d333b',
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '9999px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    border: '1px solid transparent',
    transition: 'all 0.2s'
  },
  loadMoreIcon: {
    fontSize: '18px'
  }
};

export default History;