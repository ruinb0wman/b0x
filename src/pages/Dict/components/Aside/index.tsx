import type { CSSProperties, ReactElement } from "react";

export interface MenuItem {
  key: string;
  title: string;
  icon: ReactElement;
  badge?: string | number;
  category?: string; // For categorizing items (e.g., 'System')
  component?: () => JSX.Element;
}

interface AsideProps {
  menuItems: MenuItem[];
  activeItem?: MenuItem;
  onPress: (item: MenuItem) => void;
}

export default function Aside({ menuItems, activeItem, onPress }: AsideProps) {
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'default';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <aside style={styles.aside}>
      <div style={styles.sidebarHeader}>
        <div style={styles.logo} />
        <div style={styles.sidebarTextContainer}>
          <h1 style={styles.sidebarTitle}>Lexicon AI</h1>
          <p style={styles.sidebarSubtitle}>Personal Edition</p>
        </div>
      </div>
      <nav style={styles.nav}>
        {Object.entries(groupedMenuItems).map(([category, items]) => (
          <div key={category}>
            {category !== 'default' && (
              <div style={styles.navCategory}>
                <p style={styles.categoryText}>{category}</p>
              </div>
            )}
            {items.map((item) => (
              <div
                className="hover"
                key={item.key}
                style={
                  item.key === activeItem?.key
                    ? { ...styles.navLink, ...styles.activeNavLink }
                    : styles.navLink
                }
                onClick={(e) => {
                  e.preventDefault();
                  onPress(item);
                }}
              >
                {item.icon && <span style={styles.navIcon}>{item.icon}</span>}
                <span style={styles.navText}>{item.title}</span>
                {item.badge && (
                  <span style={styles.badge}>{item.badge}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div style={styles.sidebarFooter}>
        <div style={styles.dailyGoalCard}>
          <div style={styles.dailyGoalHeader}>
            <p style={styles.dailyGoalTitle}>Daily Goal</p>
            <span style={styles.dailyGoalPercentage}>80%</span>
          </div>
          <div style={styles.progressBackground}>
            <div style={styles.progressFill}></div>
          </div>
          <p style={styles.dailyGoalText}>4 of 5 words mastered today.</p>
        </div>
      </div>
    </aside>
  );
}

const styles: { [key: string]: CSSProperties } = {
  aside: {
    width: '288px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 20,
    height: '100%',
    flexShrink: 0
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
    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxO1veDgmmcCchPpeeWkmv8610BZLgLxlhMpiklG2RXgIQLmA1RBMIkxizSUo8BSRyHCspqUFpJKLg8frjB2F8i7B5qyzjjtXcSUVwzFkASEH0RNuB5exjurgF57NH-uMYA0akT5D7wdKp6D7JvNNVT9OgDXoIHFbWJ7fyLfP7YsFyTIROnjK7WouoN02Nndfdhh-Erlbvsu-yq8xBmly8OmCr4uXZXtO_LgVWa5HAqn_MDc34XFlKlfAmSfXly9gZ4EEORhvskG4")',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    flexShrink: 0,
  },
  sidebarTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarTitle: {
    color: '#0f172a',
    fontSize: '18px',
    fontWeight: 'bold',
    lineHeight: '1.2',
    margin: 0,
  },
  sidebarSubtitle: {
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '500',
    margin: 0,
    marginTop: '2px',
  },
  nav: {
    flex: 1,
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    color: '#475569',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    marginBottom: '4px',
    userSelect: 'none',
    cursor: 'pointer',
  },
  activeNavLink: {
    backgroundColor: 'rgba(19, 91, 236, 0.1)',
    color: '#135bec',
    fontWeight: '600',
  },
  navIcon: {
    fontSize: '24px',
  },
  navText: {
    fontSize: '14px',
    fontWeight: 500,
  },
  badge: {
    marginLeft: 'auto',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '9999px',
  },
  navCategory: {
    paddingTop: '16px',
    paddingBottom: '8px',
  },
  categoryText: {
    paddingLeft: '12px',
    fontSize: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#94a3b8',
    margin: 0,
  },
  sidebarFooter: {
    padding: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  dailyGoalCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #f1f5f9',
  },
  dailyGoalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  dailyGoalTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
  },
  dailyGoalPercentage: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#135bec',
  },
  progressBackground: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    height: '8px',
    marginBottom: '8px',
  },
  progressFill: {
    backgroundColor: '#135bec',
    height: '8px',
    borderRadius: '4px',
    width: '80%',
  },
  dailyGoalText: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
};
