/* eslint-disable */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('hinglish');
  const [apiKeys, setApiKeys] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedLanguage = await AsyncStorage.getItem('language');
        const savedApiKeys = await AsyncStorage.getItem('apiKeys');
        const savedVideos = await AsyncStorage.getItem('videos');
        const launched = await AsyncStorage.getItem('launched');

        if (!launched) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('launched', 'true');
        }
        if (savedTheme) setTheme(savedTheme);
        if (savedLanguage) setLanguage(savedLanguage);
        if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));
        if (savedVideos) setVideos(JSON.parse(savedVideos));
        else setVideos([
          { id: 1, title: 'EMI Trap — Middle Class', pillar: 'Paiso Ki Psychology', type: 'short', status: 'draft', created: '2 hrs ago', description: '', tags: [] },
          { id: 2, title: 'UPI Scam — New Types', pillar: 'Scam Files', type: 'short', status: 'ready', created: 'Yesterday', description: '', tags: [] },
          { id: 3, title: 'Dopamine Shopping', pillar: 'Paiso Ki Psychology', type: 'short', status: 'uploaded', created: '3 days ago', description: '', tags: [] },
        ]);
      } catch (e) {
        console.log('Load error:', e);
      }
      setLoaded(true);
    }
    loadData();
  }, []);

  useEffect(() => { if (loaded) AsyncStorage.setItem('theme', theme); }, [theme, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem('language', language); }, [language, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem('apiKeys', JSON.stringify(apiKeys)); }, [apiKeys, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem('videos', JSON.stringify(videos)); }, [videos, loaded]);

  const colors = {
    dark: {
      bg: '#080810',
      surface: '#111120',
      surface2: '#1A1A2E',
      border: '#222233',
      text: '#F2F2FF',
      text2: '#8888AA',
      text3: '#444466',
      accent: '#F5C518',
      accent2: '#FF8C00',
      success: '#00C875',
      danger: '#FF4444',
      info: '#4D9FFF',
    },
    light: {
      bg: '#F5F5F2',
      surface: '#FFFFFF',
      surface2: '#EEEEEA',
      border: '#DDDDDA',
      text: '#111118',
      text2: '#666670',
      text3: '#AAAAAA',
      accent: '#C49A00',
      accent2: '#E07840',
      success: '#00A85A',
      danger: '#E04040',
      info: '#3370CC',
    }
  };

  const C = colors[theme];
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const addVideo = (video) => {
    setVideos(prev => [{ ...video, id: Date.now(), created: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) }, ...prev]);
  };

  const updateVideo = (id, updates) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const addApiKey = (key) => setApiKeys(prev => [...prev, key]);
  const removeApiKey = (id) => setApiKeys(prev => prev.filter(k => k.id !== id));

  const getKey = (service) => apiKeys.find(k => k.service.toLowerCase().includes(service.toLowerCase()))?.key;

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, C, language, setLanguage,
      apiKeys, addApiKey, removeApiKey, getKey,
      videos, addVideo, updateVideo, deleteVideo,
      isFirstLaunch, setIsFirstLaunch
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}