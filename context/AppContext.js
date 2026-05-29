/* eslint-disable */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const colors = {
  dark: {
    bg: '#0D0D14',
    surface: '#141420',
    surface2: '#1C1C2E',
    border: '#2A2A3D',
    text: '#F0F0FA',
    text2: '#8080A0',
    text3: '#404060',
    accent: '#7B6EF6',
    accent2: '#4D9FFF',
    success: '#00C875',
    danger: '#FF5555',
    warning: '#F5C518',
  },
  light: {
    bg: '#F5F5F7',
    surface: '#FFFFFF',
    surface2: '#F0F0F5',
    border: '#E0E0EA',
    text: '#0D0D14',
    text2: '#60607A',
    text3: '#A0A0B8',
    accent: '#6B5EE4',
    accent2: '#3D8FE8',
    success: '#00A855',
    danger: '#E04444',
    warning: '#C49A00',
  }
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('hinglish');
  const [apiKeys, setApiKeys] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [draft, setDraft] = useState(null);
  const [channels, setChannels] = useState([
    { id: 1, name: 'Kahani Paison Ki', handle: '@kahanipaisonki', folderPath: 'KahaniPaisonKi' },
  ]);
  const [activeChannelId, setActiveChannelId] = useState(1);

  useEffect(() => {
    async function loadData() {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedLanguage = await AsyncStorage.getItem('language');
        const savedApiKeys = await AsyncStorage.getItem('apiKeys');
        const savedVideos = await AsyncStorage.getItem('videos');
        const savedDraft = await AsyncStorage.getItem('draft');
        const savedChannels = await AsyncStorage.getItem('channels');
        const savedActiveChannel = await AsyncStorage.getItem('activeChannelId');
        const launched = await AsyncStorage.getItem('launched');

        if (!launched) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('launched', 'true');
        }
        if (savedTheme) setTheme(savedTheme);
        if (savedLanguage) setLanguage(savedLanguage);
        if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));
        if (savedDraft) setDraft(JSON.parse(savedDraft));
        if (savedChannels) setChannels(JSON.parse(savedChannels));
        if (savedActiveChannel) setActiveChannelId(JSON.parse(savedActiveChannel));

        if (savedVideos) {
          const parsed = JSON.parse(savedVideos);
          const now = Date.now();
          const fresh = parsed.filter(v => {
            if (!v.createdAt) return true;
            return now - v.createdAt < THIRTY_DAYS_MS;
          });
          setVideos(fresh);
        }
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
  useEffect(() => { if (loaded) AsyncStorage.setItem('draft', JSON.stringify(draft)); }, [draft, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem('channels', JSON.stringify(channels)); }, [channels, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem('activeChannelId', JSON.stringify(activeChannelId)); }, [activeChannelId, loaded]);

  const C = colors[theme];
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  const addChannel = (channel) => {
    const id = Date.now();
    setChannels(prev => [...prev, { ...channel, id }]);
  };
  const updateChannel = (id, updates) => setChannels(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteChannel = (id) => {
    if (channels.length === 1) return;
    setChannels(prev => prev.filter(c => c.id !== id));
    if (activeChannelId === id) setActiveChannelId(channels[0].id);
  };
  const switchChannel = (id) => setActiveChannelId(id);

  const channelVideos = videos.filter(v => v.channelId === activeChannelId);

  const addVideo = (video) => {
    const now = Date.now();
    setVideos(prev => [{
      ...video,
      id: now,
      createdAt: now,
      channelId: activeChannelId,
      created: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }, ...prev]);
  };
  const updateVideo = (id, updates) => setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  const deleteVideo = (id) => setVideos(prev => prev.filter(v => v.id !== id));

  const expiringVideos = channelVideos.filter(v => {
    if (!v.createdAt) return false;
    const remaining = THIRTY_DAYS_MS - (Date.now() - v.createdAt);
    return remaining > 0 && remaining < 3 * 24 * 60 * 60 * 1000;
  });

  const saveDraft = (draftData) => setDraft(draftData);
  const clearDraft = () => setDraft(null);

  const SERVICE_MAP = {
    claude: { purpose: 'script', label: 'Script Generation' },
    anthropic: { purpose: 'script', label: 'Script Generation' },
    openai: { purpose: 'script', label: 'Script Generation' },
    gpt: { purpose: 'script', label: 'Script Generation' },
    openrouter: { purpose: 'script', label: 'Script Generation' },
    pexels: { purpose: 'video', label: 'Video Search' },
    pixabay: { purpose: 'video', label: 'Video Search' },
    deepgram: { purpose: 'subtitle', label: 'Subtitle Generation' },
    whisper: { purpose: 'subtitle', label: 'Subtitle Generation' },
    elevenlabs: { purpose: 'audio', label: 'Voice Generation' },
    stability: { purpose: 'image', label: 'Image Generation' },
  };

  const detectPurpose = (serviceName) => {
    const lower = serviceName.toLowerCase();
    for (const [key, val] of Object.entries(SERVICE_MAP)) {
      if (lower.includes(key)) return val;
    }
    return { purpose: 'custom', label: 'Custom' };
  };

  const addApiKey = (key) => setApiKeys(prev => {
    const detected = detectPurpose(key.service);
    const existing = prev.filter(k => k.purpose === detected.purpose);
    return [...prev, {
      ...key,
      purpose: key.purpose || detected.purpose,
      purposeLabel: key.purposeLabel || detected.label,
      priority: existing.length + 1,
    }];
  });

  const removeApiKey = (id) => setApiKeys(prev => prev.filter(k => k.id !== id));
  const updateApiKey = (id, updates) => setApiKeys(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
  const getKeysByPurpose = (purpose) => apiKeys.filter(k => k.purpose === purpose).sort((a, b) => (a.priority || 1) - (b.priority || 1));
  const getPrimaryKey = (purpose) => getKeysByPurpose(purpose)[0]?.key;
  const getFallbackKey = (purpose) => getKeysByPurpose(purpose)[1]?.key;
  const getKey = (service) => apiKeys.find(k => k.service.toLowerCase().includes(service.toLowerCase()))?.key;

  const inProgress = channelVideos.filter(v => ['idea', 'draft'].includes(v.status));
  const history = channelVideos.filter(v => ['ready', 'uploaded'].includes(v.status));

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, C,
      language, setLanguage,
      apiKeys, addApiKey, removeApiKey, updateApiKey,
      getKey, getKeysByPurpose, getPrimaryKey, getFallbackKey, detectPurpose,
      videos: channelVideos,
      allVideos: videos,
      addVideo, updateVideo, deleteVideo,
      inProgress, history, expiringVideos,
      isFirstLaunch, setIsFirstLaunch,
      draft, saveDraft, clearDraft,
      channels, activeChannel, activeChannelId,
      addChannel, updateChannel, deleteChannel, switchChannel,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
