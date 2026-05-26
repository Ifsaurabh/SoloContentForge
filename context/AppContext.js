import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('hinglish');
  const [apiKeys, setApiKeys] = useState([]);
  const [videos, setVideos] = useState([
    { id: 1, title: 'EMI Trap — Middle Class', pillar: 'Paiso Ki Psychology', type: 'short', status: 'draft', created: '2 hrs ago' },
    { id: 2, title: 'UPI Scam — New Types', pillar: 'Scam Files', type: 'short', status: 'ready', created: 'Yesterday' },
    { id: 3, title: 'Dopamine Shopping', pillar: 'Paiso Ki Psychology', type: 'short', status: 'uploaded', created: '3 days ago' },
  ]);

  const colors = {
    dark: {
      bg: '#0a0a0f',
      surface: '#13131a',
      surface2: '#1c1c27',
      border: '#2a2a3a',
      text: '#f0f0f5',
      text2: '#8888aa',
      text3: '#555570',
      accent: '#f0c040',
      accent2: '#e07840',
      success: '#40c070',
      danger: '#e04040',
      info: '#4080e0',
    },
    light: {
      bg: '#f5f5f0',
      surface: '#ffffff',
      surface2: '#eeeeea',
      border: '#ddddd8',
      text: '#111118',
      text2: '#666670',
      text3: '#aaaaaa',
      accent: '#c49a00',
      accent2: '#e07840',
      success: '#2a9e50',
      danger: '#e04040',
      info: '#4080e0',
    }
  };

  const C = colors[theme];
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const addVideo = (video) => setVideos(prev => [{ ...video, id: Date.now(), created: 'Just now' }, ...prev]);
  const addApiKey = (key) => setApiKeys(prev => [...prev, key]);
  const removeApiKey = (id) => setApiKeys(prev => prev.filter(k => k.id !== id));

  return (
    <AppContext.Provider value={{ theme, toggleTheme, C, language, setLanguage, apiKeys, addApiKey, removeApiKey, videos, a