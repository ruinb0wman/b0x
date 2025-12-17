import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const theme = {
  primary: "#7aa2f7",
  primaryDark: "#3d59a1",
  backgroundLight: "#f6f6f8",
  backgroundDark: "#1a1b26",
  surfaceLight: "#ffffff",
  surfaceDark: "#24283b",
  textMain: "#111318",
  textSecondary: "#616f89",
  borderLight: "#dbdfe6",
  borderDark: "#414868",
  themeFG: "#c0caf5",
  themeMuted: "#a9b1d6",
  themeDim: "#565f89",
  accentPurple: "#bb9af7",
  accentGreen: "#9ece6a",
  accentOrange: "#ff9e64",
  accentRed: "#f7768e",
  accentYellow: "#e0af68",
  accentCyan: "#7dcfff",
};

export default function Favorite() {
  const styles: { [key: string]: CSSProperties } = {
    container: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
      backgroundColor: theme.backgroundDark,
      color: theme.themeFG,
      transition: 'color 200ms, background-color 200ms',
      fontFamily: "'Inter', sans-serif",
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: 'relative' as const,
    },
    flex1: {
      flex: 1,
      overflowY: 'auto' as const,
    },
    layoutContainer: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
    },
    header: {
      paddingTop: '32px',
      paddingLeft: '32px',
      paddingRight: '32px',
      paddingBottom: '16px',
    },
    headerContent: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: '16px',
    },
    headerLeft: {
      minWidth: '290px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    title: {
      color: theme.themeFG,
      fontSize: '24px',
      fontWeight: '900',
      lineHeight: '1.2',
    },
    wordCountContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: theme.themeMuted,
      fontWeight: 'normal',
    },
    wordCount: {
      color: theme.themeMuted,
      fontSize: '14px',
    },
    reviewCount: {
      color: theme.accentOrange,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '14px',
    },
    dotSeparator: {
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      backgroundColor: theme.borderDark,
    },
    studyButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '40px',
      padding: '0 20px',
      backgroundColor: theme.primary,
      color: theme.backgroundDark,
      fontSize: '14px',
      fontWeight: 'bold',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 200ms',
      boxShadow: '0 4px 12px rgba(122, 162, 247, 0.2)',
    },
    studyIcon: {
      fontSize: '20px',
    },
    stickyHeader: {
      position: 'sticky' as const,
      top: 0,
      zIndex: 10,
      backgroundColor: `${theme.backgroundDark}99`, // 60% opacity
      backdropFilter: 'blur(4px)',
      borderBottom: `1px solid ${theme.borderDark}`,
      transition: 'all 200ms',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    filterSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
    },
    searchAndFilters: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
    },
    searchContainer: {
      position: 'relative' as const,
      flex: 1,
      maxWidth: '400px',
    },
    searchIcon: {
      position: 'absolute' as const,
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: theme.themeDim,
      fontSize: '20px',
    },
    searchInput: {
      width: '100%',
      height: '40px',
      paddingLeft: '40px',
      paddingRight: '16px',
      borderRadius: '8px',
      border: `1px solid ${theme.borderDark}`,
      backgroundColor: theme.surfaceDark,
      color: theme.themeFG,
      fontSize: '14px',
      outline: 'none',
      transition: 'all 200ms',
    },
    actionButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    iconButton: {
      padding: '8px',
      color: theme.themeMuted,
      backgroundColor: 'transparent',
      border: '1px solid transparent',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 200ms',
    },
    listViewButton: {
      padding: '8px',
      color: theme.themeMuted,
      backgroundColor: 'transparent',
      border: '1px solid transparent',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 200ms',
    },
    activeViewButton: {
      color: theme.primary,
      backgroundColor: `${theme.primary}15`, // 15% opacity
      borderColor: 'transparent',
    },
    verticalDivider: {
      width: '1px',
      height: '24px',
      backgroundColor: theme.borderDark,
      margin: '0 4px',
    },
    tagFilters: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap' as const,
    },
    tagButton: {
      display: 'flex',
      height: '32px',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '9999px',
      backgroundColor: theme.surfaceDark,
      border: `1px solid ${theme.borderDark}`,
      padding: '0 12px',
      cursor: 'pointer',
      transition: 'all 200ms',
    },
    inactiveTagButton: {
      display: 'flex',
      height: '32px',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '9999px',
      backgroundColor: theme.backgroundDark,
      border: '1px solid transparent',
      padding: '0 12px',
      cursor: 'pointer',
      transition: 'all 200ms',
    },
    tagText: {
      color: theme.themeFG,
      fontSize: '12px',
      fontWeight: 'bold',
    },
    inactiveTagText: {
      color: theme.themeMuted,
      fontSize: '12px',
      fontWeight: 'normal',
    },
    addIcon: {
      fontSize: '16px',
      color: theme.themeMuted,
    },
    contentSection: {
      padding: '0 32px 48px 32px',
    },
    tableContainer: {
      backgroundColor: theme.surfaceDark,
      borderRadius: '8px',
      border: `1px solid ${theme.borderDark}`,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      transition: 'all 200ms',
    },
    table: {
      width: '100%',
      textAlign: 'left',
      borderCollapse: 'collapse' as const,
    },
    tableHead: {
      backgroundColor: theme.surfaceDark,
      border: `1px solid ${theme.borderDark}`,
    },
    tableRow: {
      borderBottom: `1px solid ${theme.borderDark}`,
    },
    tableRowHover: {
      borderBottom: `1px solid ${theme.borderDark}`,
      backgroundColor: '#2f3549',
    },
    columnHeader: {
      padding: '16px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: theme.themeMuted,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    tableCell: {
      padding: '16px',
      fontSize: '14px',
      color: theme.themeFG,
    },
    checkbox: {
      borderRadius: '4px',
      borderColor: theme.borderDark,
      color: theme.primary,
      backgroundColor: 'transparent',
    },
    wordContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    wordWithIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    wordText: {
      color: theme.themeFG,
      fontWeight: 'bold',
      fontSize: '14px',
    },
    pronunciation: {
      color: theme.themeMuted,
      fontSize: '12px',
      fontFamily: 'monospace',
    },
    dueIndicator: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: theme.accentOrange,
    },
    definitionText: {
      color: theme.themeMuted,
      fontSize: '14px',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical' as const,
      WebkitLineClamp: 1,
      overflow: 'hidden',
    },
    posBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    masteryContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    progressBarBg: {
      flex: 1,
      height: '6px',
      backgroundColor: theme.backgroundDark,
      borderRadius: '9999px',
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: '9999px',
    },
    masteryPercent: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: theme.themeFG,
      width: '32px',
    },
    actionsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '4px',
      opacity: 0,
    },
    rowHover: {
      opacity: 1,
    },
    actionButton: {
      padding: '6px',
      color: theme.themeMuted,
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 200ms',
    },
    actionIcon: {
      fontSize: '20px',
    },
    paginationContainer: {
      marginTop: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 8px',
    },
    resultsText: {
      fontSize: '12px',
      color: theme.themeMuted,
    },
    paginationButtons: {
      display: 'flex',
      gap: '8px',
    },
    pageButton: {
      padding: '8px',
      border: `1px solid ${theme.borderDark}`,
      borderRadius: '6px',
      backgroundColor: theme.surfaceDark,
      color: theme.themeMuted,
      cursor: 'pointer',
      transition: 'all 200ms',
    },
    pageIcon: {
      fontSize: '16px',
    },
    materialIcon: {
      fontSize: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <div style={styles.flex1}>
          <div style={styles.layoutContainer}>
            <header style={styles.header}>
              <div style={styles.headerContent}>
                <div style={styles.headerLeft}>
                  <h1 style={styles.title}>My Favorites</h1>
                  <div style={styles.wordCountContainer}>
                    <span style={styles.wordCount}>42 words saved</span>
                  </div>
                </div>
              </div>
            </header>

            <section style={styles.stickyHeader}>
              <div style={styles.filterSection}>
                <div style={styles.searchAndFilters}>
                  <div style={styles.searchContainer}>
                    <span className="material-symbols-outlined" style={styles.searchIcon}>search</span>
                    <input
                      style={styles.searchInput}
                      placeholder="Search favorites..."
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section style={styles.contentSection}>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead style={styles.tableHead}>
                    <tr style={styles.tableRow}>
                      <th style={{ ...styles.tableCell, textAlign: 'center', width: '48px' }}>
                        <input style={styles.checkbox} type="checkbox" />
                      </th>
                      <th style={{ ...styles.tableCell, ...styles.columnHeader, width: '25%' }}>Word</th>
                      <th style={{ ...styles.tableCell, ...styles.columnHeader, display: 'table-cell' }}>Definition</th>
                      <th style={{ ...styles.tableCell, ...styles.columnHeader, width: '128px', display: 'table-cell' }}>Part of Speech</th>
                      <th style={{ ...styles.tableCell, ...styles.columnHeader, width: '160px', display: 'table-cell' }}>Mastery</th>
                      <th style={{ ...styles.tableCell, ...styles.columnHeader, width: '96px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={styles.tableBody}>
                    {/* Table rows would go here */}
                    <TableRow
                      word="Serendipity"
                      pronunciation="/ˌser.ənˈdɪp.ə.t̬i/"
                      definition="The occurrence of events by chance in a happy or beneficial way."
                      pos="noun"
                      masteryPercent={80}
                      masteryColor={theme.accentGreen}
                      dueForReview={false}
                      styles={styles}
                    />
                    <TableRow
                      word="Ephemeral"
                      pronunciation="/əˈfem.ər.əl/"
                      definition="Lasting for a very short time."
                      pos="adjective"
                      masteryPercent={45}
                      masteryColor={theme.accentOrange}
                      dueForReview={true}
                      styles={styles}
                    />
                    <TableRow
                      word="Mellifluous"
                      pronunciation="/məˈlɪf.lu.əs/"
                      definition="(of a voice or words) sweet or musical; pleasant to hear."
                      pos="adjective"
                      masteryPercent={20}
                      masteryColor={theme.accentRed}
                      dueForReview={false}
                      styles={styles}
                    />
                    <TableRow
                      word="Ineffable"
                      pronunciation="/ɪnˈef.ə.bəl/"
                      definition="Too great or extreme to be expressed or described in words."
                      pos="adjective"
                      masteryPercent={90}
                      masteryColor={theme.primary}
                      dueForReview={false}
                      styles={styles}
                    />
                    <TableRow
                      word="Limerence"
                      pronunciation="/ˈlɪm.ər.əns/"
                      definition="The state of being infatuated or obsessed with another person."
                      pos="noun"
                      masteryPercent={10}
                      masteryColor={theme.accentYellow}
                      dueForReview={false}
                      styles={styles}
                    />
                  </tbody>
                </table>
              </div>

              <div style={styles.paginationContainer}>
                <p style={styles.resultsText}>Showing 1 to 5 of 42 results</p>
                <div style={styles.paginationButtons}>
                  <button style={styles.pageButton} disabled={true}>
                    <span className="material-symbols-outlined" style={styles.pageIcon}>chevron_left</span>
                  </button>
                  <button style={styles.pageButton}>
                    <span className="material-symbols-outlined" style={styles.pageIcon}>chevron_right</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// Row component for table entries
function TableRow({
  word,
  pronunciation,
  definition,
  pos,
  masteryPercent,
  masteryColor,
  dueForReview,
  styles
}: {
  word: string;
  pronunciation: string;
  definition: string;
  pos: string;
  masteryPercent: number;
  masteryColor: string;
  dueForReview: boolean;
  styles: { [key: string]: CSSProperties };
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <tr
      style={{
        ...styles.tableRowHover,
        ...(isHovered ? styles.rowHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td style={{ ...styles.tableCell, textAlign: 'center' }}>
        <input style={styles.checkbox} type="checkbox" />
      </td>
      <td style={styles.tableCell}>
        <div style={styles.wordContainer}>
          <div style={styles.wordWithIndicator}>
            <span style={styles.wordText}>{word}</span>
            {dueForReview && (
              <span
                style={styles.dueIndicator}
                title="Due for review"
              ></span>
            )}
          </div>
          <span style={styles.pronunciation}>{pronunciation}</span>
        </div>
      </td>
      <td style={styles.tableCell}>
        <p style={styles.definitionText}>{definition}</p>
      </td>
      <td style={styles.tableCell}>
        <span style={{
          ...styles.posBadge,
          backgroundColor: `${masteryColor}20`, // 20% opacity
          color: masteryColor
        }}>
          {pos}
        </span>
      </td>
      <td style={styles.tableCell}>
        <div style={styles.masteryContainer}>
          <div style={styles.progressBarBg}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${masteryPercent}%`,
                backgroundColor: masteryColor
              }}
            ></div>
          </div>
          <span style={styles.masteryPercent}>{masteryPercent}%</span>
        </div>
      </td>
      <td style={{ ...styles.tableCell, textAlign: 'right' }}>
        <div style={{
          ...styles.actionsContainer,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 200ms'
        }}>
          <button style={styles.actionButton}>
            <span className="material-symbols-outlined" style={styles.actionIcon}>delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
