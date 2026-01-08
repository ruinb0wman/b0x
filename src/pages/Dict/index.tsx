import { useState, useEffect } from "react";
import { BookOutlined, SettingOutlined, StarOutlined, AudioOutlined, HistoryOutlined } from "@ant-design/icons";
import Aside, { type MenuItem } from "./components/Aside";
import Home from "./components/Home";
import Favorite from "./components/Favorite";
import Setting from "./components/Setting";
import Study from "./components/Study"
import History from "./components/History"
// import Home from "./components/Test"

export default function Dict() {
  const [activeItem, setActiveItem] = useState<MenuItem>();
  useEffect(() => {
    setActiveItem(menuItems[0]);
  }, [])

  const handleItemClick = (menu: MenuItem) => {
    setActiveItem(menu);
  };

  return (
    <div style={styles.body}>
      <div style={styles.headerBar}></div>
      <div style={styles.container}>
        <Aside
          menuItems={menuItems}
          activeItem={activeItem}
          onPress={handleItemClick}
        />
        {activeItem?.component && <activeItem.component />}
      </div>
    </div>
  );
}

const menuItems: MenuItem[] = [
  {
    key: 'dictionary',
    title: 'Dictionary',
    icon: <BookOutlined />,
    component: () => <Home />,
  },
  {
    key: 'study-queue',
    title: 'Study Queue',
    icon: <AudioOutlined />,
    badge: 12,
    component: () => <Study />,
  },
  {
    key: 'favorites',
    title: 'Favorites',
    icon: <StarOutlined />,
    component: () => <Favorite />,
  },
  {
    key: 'history',
    title: 'History',
    icon: <HistoryOutlined />,
    component: () => <History />
  },
  {
    key: 'settings',
    title: 'Settings',
    icon: <SettingOutlined />,
    category: 'System',
    component: () => <Setting />,
  },
];

// Extend CSSProperties to include vendor-specific properties
type ExtendedCSSProperties = React.CSSProperties & {
  WebkitAppRegion?: 'drag' | 'no-drag';
};

const styles: { [key: string]: ExtendedCSSProperties } = {
  headerBar: {
    WebkitAppRegion: 'drag',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 5px',
    boxSizing: 'border-box',
    position: 'absolute',
  },
  body: {
    height: '100vh',
    margin: 0,
    backgroundColor: '#f6f6f8',
    color: '#0f172a',
    fontFamily: '"Inter", sans-serif',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
};
