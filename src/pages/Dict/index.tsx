import type { CSSProperties } from "react";
import { useState, useEffect } from "react";
import { BookTwoTone, SettingTwoTone, StarTwoTone, AudioOutlined, BookOutlined } from "@ant-design/icons";
import Aside, { type MenuItem } from "./components/Aside";
import Home from "./components/Home";
import Favorite from "./components/Favorite";
import Setting from "./components/Setting";

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

const menuItems = [
  {
    key: 'dictionary',
    title: 'Dictionary',
    icon: <BookTwoTone twoToneColor="#135bec" />,
    component: Home,
  },
  {
    key: 'study-queue',
    title: 'Study Queue',
    icon: <AudioOutlined />,
    badge: 12,
  },
  {
    key: 'favorites',
    title: 'Favorites',
    icon: <StarTwoTone />,
    component: Favorite,
  },
  {
    key: 'history',
    title: 'History',
    icon: <BookOutlined />,
  },
  {
    key: 'settings',
    title: 'Settings',
    icon: <SettingTwoTone />,
    category: 'System',
    component: Setting,
  },
];

const styles: { [key: string]: CSSProperties } = {
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
