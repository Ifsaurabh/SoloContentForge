/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';
import {
  Zap, Circle, TrendingUp, AlertTriangle, Star, Flag,
  ArrowLeft, ArrowRight, RotateCcw, Copy, Download, Plus,
  Search, Play, Check, ChevronRight, X, Lightbulb,
  FileText, Youtube, Globe
} from 'lucide-react-native';

const shortSections = [
  { id: 'hook', label: 'Hook', timing: '0–5 sec', Icon: Zap },
  { id: 'openloop', label: 'Open Loop', timing: '5–15 sec', Icon: Circle },
  { id: 'progress', label: 'Progression', timing: '15–40 sec', Icon: TrendingUp },
  { id: 'tension', label: 'Tension', timing: '40–55 sec', Icon: AlertTriangle },
  { id: 'payoff', label: 'Payoff', timing: '55–70 sec', Icon: Star },
  { id: 'endline', label: 'End Line', timing: '70–75 sec', Icon: Flag },
];

const longSections = [
  { id: 'hook', label: 'Hook', timing: '0–30 sec', Icon: Zap },
  { id: 'problem', label: 'Problem', timing: '30s–2 min', Icon: AlertTriangle },
  { id: 'explain', label: 'Explanation', timing: '2–5 min', Icon: Circle },
  { id: 'example', label: 'Example', timing: '5–8 min', Icon: TrendingUp },
  { id: 'breakdown', label: 'Breakdown', timing: '8–12 min', Icon: Star },
  { id: 'takeaway', label: 'Takeaway', timing: '12–15 min', Icon: Flag },
];

const pillars = [
  { name: 'Finance Pulse', desc: 'News & updates' },
  { name: 'Explained Series', desc: 'How things work' },
  { name: 'Paiso Ki Psychology', desc: 'Money behavior' },
  { name: 'Scam Files', desc: 'Fraud awareness' },
  { name: 'Smart Money Guide', desc: 'Personal finance' },
  { name: 'Finance & Geopolitics', desc: 'Global impact' },
  { name: 'Quick Finance', desc: 'Shorts explainer' },
];

const emotions = [
  { e: 'Shock', sec: ['hook'] },
  { e: 'Curiosity', sec: ['hook', 'openloop', 'problem'] },
  { e: 'Relatable', sec: ['hook', 'problem'] },
  { e: 'Mystery', sec: ['openloop'] },
  { e: 'Tension', sec: ['tension', 'problem'] },
  { e: 'Storytelling', sec: ['progress', 'explain', 'example'] },
  { e: 'Contrast', sec: ['progress', 'breakdown'] },
  { e: 'Warning', sec: ['tension'] },
  { e: 'Revelation', sec: ['payoff', 'takeaway'] },
  { e: 'Clarity', sec: ['payoff', 'takeaway'] },
  { e: 'Reflection', sec: ['endline', 'takeaway'] },
  { e: 'Motivation', sec: ['endline'] },
];

const EMOTION_VISUALS = {
  Shock: ['shocking news india', 'person surprised face'],
  Curiosity: ['person thinking wondering', 'question concept india'],
  Relatable: ['middle class india daily life', 'common man india'],
  Mystery: ['dark shadow mystery reveal', 'hidden secret'],
  Tension: ['tense dramatic moment india', 'stress anxiety'],
  Storytelling: ['storytelling narration india', 'timeline journey'],
  Contrast: ['rich poor contrast india', 'before after comparison'],
  Warning: ['warning danger sign india', 'red alert caution'],
  Revelation: ['revelation lightbulb moment', 'truth revealed india'],
  Clarity: ['clear solution visual', 'simple concept india'],
  Reflection: ['person thinking reflection india', 'contemplation'],
  Motivation: ['motivation inspire india', 'achievement celebration'],
};

const demoScript = [
  { id: 'hook', text: 'Same duniya… par results alag kyun?\n\nYe sawaal aapke dimag mein bhi zaroor aaya hoga...' },
  { id: 'openloop', text: 'Asli reason abhi baaki hai…\nJo cheez koi clearly nahi batata…' },
  { id: 'progress', text: 'Middle class price dekhta hai…\nRich log value dekhte hain…' },
  { id: 'tension', text: 'Ab tak jo dekha… wo sirf surface tha.\nAssali game kuch aur hi hai…' },
  { id: 'payoff', text: 'Woh hai aapka decision system.\nJab tak ye nahi badlega… result same rehega.' },
  { id: 'endline', text: 'Socho — aaj aapne kaunsa financial decision liya?' },
];

const demoTitles = [
  'Paisa kyun nahi badh raha? Hidden Psychology',
  'Middle Class ki sabse badi galti — Explained',
  'Rich aur Middle Class ka asli fark kya hai?',
  'Ye ek cheez badlo — financial life badal jayegi',
  'Log paisa kyun nahi bacha pate? Real Reason',
];

// Video player component using expo-video
function VideoPlayer({ uri, onClose }) {
  useEffect(() => { Linking.openURL(uri); onClose(); }, []);
  return null;
}

export default function NewVideoScreen() {
  const { C, addVideo, getPrimaryKey, getFallbackKey, getKeysByPurpose, language, draft, saveDraft, clearDraft, activeChannel } = useApp();
  const navigation = useNavigation();

  const [step, setStep] = useState(1);
  const [idea, setIdea] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [selectedAngle, setSelectedAngle] = useState('');
  const [customAngle, setCustomAngle] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [videoType, setVideoType] = useState('');
  const [duration, setDuration] = useState('75');
  const [pillar, setPillar] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState({});
  const [script, setScript] = useState([]);
  const [titles, setTitles] = useState([]);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState({});
  const [selectedTitle, setSelectedTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['#personalfinance', '#paisa', '#kahanipaisonki', '#hindishorts']);
  const [newTag, setNewTag] = useState('');
  const [videoSections, setVideoSections] = useState([]);
  const [currentVideoSection, setCurrentVideoSection] = useState(0);
  const [videoLoading, setVideoLoading] = useState(false);
  const [previewUri, setPreviewUri] = useState(null);
  const [subtitleLines, setSubtitleLines] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [durationFilter, setDurationFilter] = useState('any');
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = videoType === 'short' ? shortSections : longSections;
  const scriptKey = getPrimaryKey('script');
  const scriptFallback = getFallbackKey('script');
  const videoKeys = getKeysByPurpose('video');
  const pexelsKey = videoKeys.find(k => k.service.toLowerCase().includes('pexels'))?.key;
  const pixabayKey = videoKeys.find(k => k.service.toLowerCase().includes('pixabay'))?.key;

  const totalClips = Math.max(Math.ceil(parseInt(duration || '75') / 2), 6);
  const clipsPerSection = Math.max(Math.ceil(totalClips / sections.length), 2);

  const finalIdea = showCustom ? customAngle : (selectedAngle || idea);

  // Load draft
  useEffect(() => {
    if (draft) {
      setStep(draft.step || 1);
      setIdea(draft.idea || '');
      setSelectedAngle(draft.selectedAngle || '');
      setVideoType(draft.videoType || '');
      setDuration(draft.duration || '75');
      setPillar(draft.pillar || '');
      setSelectedEmotions(draft.selectedEmotions || {});
      setScript(draft.script || []);
      setTitles(draft.titles || []);
      setSelectedTitle(draft.selectedTitle || '');
      setDescription(draft.description || '');
      setTags(draft.tags || ['#personalfinance', '#paisa', '#kahanipaisonki', '#hindishorts']);
      setVideoSections(draft.videoSections || []);
      setSubtitleLines(draft.subtitleLines || []);
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (step > 1 || idea) {
      saveDraft({ step, idea, selectedAngle, videoType, duration, pillar, selectedEmotions, script, titles, selectedTitle, description, tags, videoSections, subtitleLines });
    }
  }, [step, idea, selectedAngle, videoType, duration, pillar, selectedEmotions, script, titles, selectedTitle, description, tags, videoSections, subtitleLines]);

  // SEARCH SUGGESTIONS from Google + YouTube
  async function fetchSuggestions(query) {
    if (!query.trim() || query.trim().length < 3) return;
    setSuggestionsLoading(true);
    setSuggestions([]);
    try {
      const scored = {};

      const addResult = (text, score) => {
        const key = text.toLowerCase().trim();
        if (!key || key === query.toLowerCase().trim()) return;
        scored[key] = (scored[key] || 0) + score;
      };

      // Google suggestions
      try {
        const gRes = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&hl=en`);
        const gData = await gRes.json();
        if (gData[1]) {
          gData[1].forEach((s, i) => addResult(s, 10 - i));
        }
      } catch (e) {}

      // YouTube suggestions
      try {
        const yRes = await fetch(`https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}&hl=en`);
        const yData = await yRes.json();
        if (yData[1]) {
          yData[1].forEach((s, i) => addResult(s[0] || s, 10 - i));
        }
      } catch (e) {}

      const sorted = Object.entries(scored)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([text, score]) => ({ text, score, bothPlatforms: score >= 15 }));

      setSuggestions(sorted);
    } catch (e) {}
    setSuggestionsLoading(false);
  }

  // Claude API with fallback
  async function callClaude(prompt, maxTokens = 2000) {
    const keys = [scriptKey, scriptFallback].filter(Boolean);
    for (const key of keys) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
        });
        const data = await res.json();
        if (data.content?.[0]?.text) return data.content[0].text;
      } catch (e) { continue; }
    }
    return null;
  }

  // GENERATE SCRIPT + TITLES in one call
  async function generateScriptAndTitles() {
    setScriptLoading(true);
    setStep(5);

    const langMap = {
      hinglish: 'Hinglish (Hindi + English mix, Roman script)',
      hindi: 'Pure Hindi Roman script',
      urdu: 'Roman Urdu',
      english_us: 'American English',
      english_uk: 'British English',
      punjabi: 'Punjabi Hinglish',
      bengali: 'Bengali', marathi: 'Marathi', gujarati: 'Gujarati', tamil: 'Tamil', telugu: 'Telugu',
    };

    const topKeywords = suggestions.slice(0, 3).map(s => s.text).join(', ');
    const emotionDesc = sections.map(s => `${s.label}: ${selectedEmotions[s.id] || 'Curiosity'}`).join(', ');

    if (scriptKey || scriptFallback) {
      try {
        const prompt = `You are a YouTube finance script writer for "Kahani Paison Ki" — an Indian Hindi finance channel.

Language: ${langMap[language] || 'Hinglish'}
Topic/Angle: ${finalIdea}
Pillar: ${pillar}
Format: ${videoType === 'short' ? 'YouTube Short (75 seconds)' : 'Long video (10-15 minutes)'}
Emotions per section: ${emotionDesc}
Trending keywords to incorporate: ${topKeywords || finalIdea}

SCRIPT RULES:
- No greetings like "Hello friends" or "Namaste"
- Hook must grab in first 3 seconds with contradiction or shock
- Short punchy sentences
- Real life Indian examples
- Storytelling style
- Each section must be distinct and build on previous

TITLE RULES:
- Use trending keywords: ${topKeywords || finalIdea}
- Clickbait but honest
- Simple Hinglish
- Create curiosity or shock
- No boring academic titles

Return ONLY valid JSON, no extra text:
{
  "sections": [${sections.map(s => `{"id":"${s.id}","text":"..."}`).join(',')}],
  "titles": ["title1","title2","title3","title4","title5"]
}`;

        const text = await callClaude(prompt, 2300);
        if (text) {
          const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
          setScript(parsed.sections || demoScript);
          setTitles(parsed.titles || demoTitles);
        } else {
          setScript(demoScript);
          setTitles(demoTitles);
        }
      } catch (e) {
        setScript(demoScript);
        setTitles(demoTitles);
      }
    } else {
      await new Promise(r => setTimeout(r, 1500));
      setScript(demoScript);
      setTitles(demoTitles);
    }
    setScriptLoading(false);
    setStep(6);
  }

  // REGEN single section
  async function regenSection(idx) {
    setRegenLoading(prev => ({ ...prev, [idx]: true }));
    const sec = sections[idx];
    const emotion = selectedEmotions[sec?.id] || 'Curiosity';
    if (scriptKey || scriptFallback) {
      try {
        const prompt = `Rewrite only the "${sec?.label}" section of a YouTube ${videoType} finance script.
Topic: ${finalIdea}, Pillar: ${pillar}, Emotion: ${emotion}
Language: ${language}. Punchy short sentences. No greetings. Indian context. Return ONLY the section text.`;
        const text = await callClaude(prompt, 400);
        if (text) {
          setScript(prev => prev.map((s, i) => i === idx ? { ...s, text: text.trim() } : s));
          setRegenLoading(prev => ({ ...prev, [idx]: false }));
          return;
        }
      } catch (e) {}
    }
    if (demoScript[idx]) setScript(prev => prev.map((s, i) => i === idx ? { ...s, text: demoScript[idx].text } : s));
    setRegenLoading(prev => ({ ...prev, [idx]: false }));
  }

  // GENERATE DESCRIPTION
  async function generateDescription() {
    const defaultDesc = `${finalIdea}\n\nIs video mein:\n✅ Asli reason samjhenge\n✅ Simple system sikhenge\n✅ Ek rule jo life badlega\n\nChannel subscribe karo!\n\n${tags.join(' ')}`;
    if (!scriptKey && !scriptFallback) { setDescription(defaultDesc); return; }
    try {
      const prompt = `Write YouTube description in ${language} for video titled "${selectedTitle}" about "${finalIdea}". Include 3 bullet points with ✅. End with subscribe CTA. Include these hashtags naturally: ${tags.slice(0, 5).join(' ')}. Under 200 words. Plain text only.`;
      const text = await callClaude(prompt, 400);
      setDescription(text ? text.trim() : defaultDesc);
    } catch { setDescription(defaultDesc); }
  }

  // SMART KEYWORDS per section
  function getKeywordsForSection(sec, emotion, topicWords) {
    const emotionVisuals = EMOTION_VISUALS[emotion] || [`${topicWords} india`];
    const sectionContext = {
      hook: 'dramatic opening india',
      openloop: 'mystery suspense india',
      progress: 'comparison contrast india',
      tension: 'tense dramatic india',
      payoff: 'revelation solution india',
      endline: 'reflection conclusion india',
      problem: 'problem issue india',
      explain: 'explanation concept india',
      example: 'real life example india',
      breakdown: 'breakdown analysis india',
      takeaway: 'lesson learning india',
    };
    return [emotionVisuals[0], `${topicWords} ${sectionContext[sec.id] || 'india'}`, emotionVisuals[1] || `finance india`];
  }

  // GET VIDEO SUGGESTIONS
  async function getVideoSuggestions() {
    setVideoLoading(true);
    setStep(9);
    const topicWords = finalIdea.split(' ').slice(0, 3).join(' ');

    let sectionKeywords = sections.map(sec => ({
      id: sec.id, label: sec.label,
      clips_needed: clipsPerSection,
      keywords: getKeywordsForSection(sec, selectedEmotions[sec.id] || 'Curiosity', topicWords),
      mood: selectedEmotions[sec.id] || 'neutral',
      clips: [], selectedClips: [],
    }));

    if (scriptKey || scriptFallback) {
      try {
        const scriptSummary = script.map(s => `${s.id}: ${s.text.substring(0, 60)}`).join('\n');
        const prompt = `You are a video editor for Indian Hindi finance YouTube channel.
Script: ${scriptSummary}
Topic: ${finalIdea}
For each section suggest 3 specific stock footage search keywords. Mix Indian daily life + cinematic. Match emotion and mood.
Return ONLY JSON: {"sections":[${sections.map(s => `{"id":"${s.id}","keywords":["kw1","kw2","kw3"]}`).join(',')}]}`;
        const text = await callClaude(prompt, 600);
        if (text) {
          const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
          sectionKeywords = sectionKeywords.map(sec => {
            const found = parsed.sections?.find(s => s.id === sec.id);
            return found ? { ...sec, keywords: found.keywords } : sec;
          });
        }
      } catch (e) {}
    }

    const sectionsWithClips = await Promise.all(
      sectionKeywords.map(async (sec) => {
        const clips = await searchVideos(sec.keywords, sec.clips_needed);
        return { ...sec, clips };
      })
    );
    setVideoSections(sectionsWithClips);
    setCurrentVideoSection(0);
    setVideoLoading(false);
  }

  // SEARCH VIDEOS — Pexels + Pixabay merged
  async function searchVideos(keywords, count = clipsPerSection) {
    const results = [];
    const keyword = keywords[0] || finalIdea;
    if (pexelsKey) {
      try {
        const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(keyword)}&per_page=8&orientation=portrait`, { headers: { Authorization: pexelsKey } });
        const data = await res.json();
        if (data.videos) data.videos.forEach(v => results.push({
          id: 'pexels_' + v.id, source: 'Pexels',
          thumbnail: v.image,
          url: v.video_files?.find(f => f.quality === 'sd')?.link || v.video_files?.[0]?.link,
          duration: v.duration, label: keyword, approved: false, relevanceScore: 2,
        }));
      } catch (e) {}
    }
    if (pixabayKey) {
      try {
        const res = await fetch(`https://pixabay.com/api/videos/?key=${pixabayKey}&q=${encodeURIComponent(keyword)}&per_page=8&video_type=film`);
        const data = await res.json();
        if (data.hits) data.hits.forEach(v => results.push({
          id: 'pixabay_' + v.id, source: 'Pixabay',
          thumbnail: v.videos?.medium?.thumbnail || v.userImageURL,
          url: v.videos?.medium?.url || v.videos?.small?.url,
          duration: v.duration, label: keyword, approved: false, relevanceScore: 1,
        }));
      } catch (e) {}
    }
    if (results.length < count && keywords[1]) {
      try {
        if (pexelsKey) {
          const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(keywords[1])}&per_page=4`, { headers: { Authorization: pexelsKey } });
          const data = await res.json();
          if (data.videos) data.videos.forEach(v => results.push({ id: 'pexels_alt_' + v.id, source: 'Pexels', thumbnail: v.image, url: v.video_files?.[0]?.link, duration: v.duration, label: keywords[1], approved: false, relevanceScore: 1 }));
        }
      } catch (e) {}
    }
    const seen = new Set();
    const unique = results.sort((a, b) => b.relevanceScore - a.relevanceScore).filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; });
    if (unique.length === 0) {
      for (let i = 0; i < 4; i++) unique.push({ id: 'demo_' + i + '_' + Date.now(), source: 'Demo', thumbnail: null, url: null, duration: 10, label: keyword, approved: false, relevanceScore: 0 });
    }
    return unique.slice(0, Math.max(count, 8));
  }

  // SEARCH NEW CLIPS for current section
  async function searchNewClips() {
    if (!videoSections[currentVideoSection]) return;
    const sec = videoSections[currentVideoSection];
    const query = searchQuery.trim() || sec.keywords[0] || finalIdea;
    const clips = await searchVideos([query, sec.keywords[1] || query], clipsPerSection);
    setVideoSections(prev => prev.map((s, i) => i === currentVideoSection ? { ...s, clips } : s));
    setSearchQuery('');
  }

  // DURATION FILTER
  function applyDurationFilter(clips) {
    if (durationFilter === 'any') return clips;
    return clips.filter(c => {
      const d = c.duration || 0;
      if (durationFilter === 'under10') return d < 10;
      if (durationFilter === '10-30') return d >= 10 && d <= 30;
      if (durationFilter === '30-60') return d > 30 && d <= 60;
      return true;
    });
  }

  function toggleClip(sectionIdx, clipId) {
    setVideoSections(prev => prev.map((sec, i) => {
      if (i !== sectionIdx) return sec;
      const isSelected = sec.selectedClips.includes(clipId);
      return { ...sec, selectedClips: isSelected ? sec.selectedClips.filter(id => id !== clipId) : [...sec.selectedClips, clipId] };
    }));
  }

  // SUBTITLES — 3-4 words per line
  async function generateSubtitles() {
    setSubLoading(true);
    const lines = [];
    let timeCounter = 0;
    const totalDuration = parseInt(duration || '75');
    const allText = script.map(s => s.text).join(' ');
    const words = allText.split(/\s+/).filter(w => w.trim());
    const wordsPerLine = 3;
    const totalLines = Math.ceil(words.length / wordsPerLine);
    const timePerLine = totalDuration / Math.max(totalLines, 1);

    for (let i = 0; i < words.length; i += wordsPerLine) {
      const lineWords = words.slice(i, i + wordsPerLine);
      const start = timeCounter;
      const end = timeCounter + timePerLine;
      lines.push({
        start: formatSRTTime(Math.floor(start)),
        end: formatSRTTime(Math.floor(end)),
        text: lineWords.join(' ')
      });
      timeCounter = end;
    }
    setSubtitleLines(lines);
    setSubLoading(false);
  }

  function formatSRTTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},000`;
  }

  // COPY to clipboard
  async function copyText(text) {
    try {
      const Clipboard = await import('expo-clipboard');
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied', 'Text copied to clipboard');
    } catch (e) { Alert.alert('Error', 'Could not copy'); }
  }

  // SHARE SCRIPT
  async function shareScript(format) {
    const plain = script.map(s => {
      const info = sections.find(sec => sec.id === s.id);
      return `[${info?.label || s.id}]\n${s.text}`;
    }).join('\n\n');
    const structured = `SCRIPT: ${selectedTitle || finalIdea}\nPillar: ${pillar}\nType: ${videoType}\n\n` + plain;
    const content = format === 'plain' ? plain : structured;
    try {
      const fileUri = FileSystem.documentDirectory + 'script_' + Date.now() + '.txt';
      await FileSystem.writeAsStringAsync(fileUri, content);
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(fileUri, { mimeType: 'text/plain' });
    } catch (e) { Alert.alert('Error', 'Could not share'); }
  }

  // DOWNLOAD ALL TO FOLDER
  async function downloadAllToFolder() {
    setDownloading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Storage permission required');
        setDownloading(false); return;
      }
      const folderName = (selectedTitle || finalIdea).replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40);
      const channelFolder = activeChannel.folderPath || 'SoloContentForge';
      const basePath = FileSystem.documentDirectory + 'SoloContentForge/' + channelFolder + '/' + folderName + '/';
      await FileSystem.makeDirectoryAsync(basePath, { intermediates: true });

      setDownloadProgress('Saving script...');
      const scriptContent = `TITLE: ${selectedTitle || finalIdea}\n\n` +
        script.map(s => { const info = sections.find(sec => sec.id === s.id); return `[${info?.label || s.id}] ${info?.timing || ''}\n${s.text}`; }).join('\n\n');
      await FileSystem.writeAsStringAsync(basePath + 'script.txt', scriptContent);

      if (subtitleLines.length > 0) {
        setDownloadProgress('Saving subtitles...');
        const srtContent = subtitleLines.map((line, i) => `${i + 1}\n${line.start} --> ${line.end}\n${line.text}\n`).join('\n');
        await FileSystem.writeAsStringAsync(basePath + 'subtitles.srt', srtContent);
      }

      setDownloadProgress('Saving titles...');
      const titlesContent = titles.map((t, i) => `${i + 1}. ${t}`).join('\n') + (selectedTitle ? `\n\nSelected: ${selectedTitle}` : '');
      await FileSystem.writeAsStringAsync(basePath + 'titles.txt', titlesContent);

      if (description) {
        setDownloadProgress('Saving description...');
        await FileSystem.writeAsStringAsync(basePath + 'description.txt', description);
      }

      setDownloadProgress('Saving tags...');
      await FileSystem.writeAsStringAsync(basePath + 'tags.txt', tags.join('\n'));

      setDownloadProgress('Saving metadata...');
      await FileSystem.writeAsStringAsync(basePath + 'metadata.json', JSON.stringify({
        title: selectedTitle || finalIdea, idea: finalIdea, pillar, type: videoType, duration,
        createdAt: new Date().toISOString(), status: 'ready', channel: activeChannel.name,
      }, null, 2));

      const allSelected = videoSections.flatMap((sec, si) =>
        sec.selectedClips.map(clipId => {
          const clip = sec.clips.find(c => c.id === clipId);
          return clip ? { ...clip, sectionId: sec.id } : null;
        }).filter(Boolean)
      );

      if (allSelected.length > 0) {
        await FileSystem.makeDirectoryAsync(basePath + 'clips/', { intermediates: true });
        for (let i = 0; i < allSelected.length; i++) {
          const clip = allSelected[i];
          if (clip.url && clip.source !== 'Demo') {
            setDownloadProgress(`Downloading clip ${i + 1}/${allSelected.length}...`);
            try {
              const dest = basePath + 'clips/' + clip.sectionId + '_' + (i + 1) + '.mp4';
              await FileSystem.downloadAsync(clip.url, dest);
              await MediaLibrary.saveToLibraryAsync(dest);
            } catch (e) {}
          }
        }
      }

      Alert.alert('Saved!', `Folder: ${channelFolder}/${folderName}/\n\nFiles: script, subtitles, titles, description, tags, ${allSelected.length} clips`);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setDownloading(false); setDownloadProgress('');
  }

  // SHARED STYLES
  const btn = { backgroundColor: C.accent, borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 8 };
  const btnSecondary = { backgroundColor: C.surface, borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: C.border };
  const btnText = { fontWeight: '700', color: '#fff', fontSize: 15 };
  const btnSecText = { fontWeight: '600', color: C.text2, fontSize: 14 };

  const StepDots = () => (
    <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 8 }}>
      {Array.from({ length: 11 }, (_, i) => i + 1).map(i => (
        <View key={i} style={{ height: 3, flex: i === step ? 3 : 1, borderRadius: 100, backgroundColor: i < step ? C.success : i === step ? C.accent : C.border }} />
      ))}
    </View>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
      <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, marginBottom: 6, textTransform: 'uppercase' }}>Step {step} of 11</Text>
      <Text style={{ fontSize: 24, fontWeight: '700', color: C.text, letterSpacing: -0.5 }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: 13, color: C.text2, marginTop: 4 }}>{subtitle}</Text>}
    </View>
  );

  // ===== STEP 1 — IDEA + SUGGESTIONS =====
  if (step === 1) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <StepDots />
      <SectionHeader title="What's your idea?" subtitle="Type a topic — we'll find what people are searching" />
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 12 }}>
          <TextInput multiline value={idea} onChangeText={text => { setIdea(text); setSelectedAngle(''); setSuggestions([]); }}
            placeholder="e.g. home loan, mutual funds, credit card..."
            placeholderTextColor={C.text3}
            style={{ color: C.text, fontSize: 15, padding: 16, minHeight: 80, lineHeight: 24 }} />
        </View>

        <TouchableOpacity
          onPress={() => fetchSuggestions(idea)}
          disabled={suggestionsLoading || idea.trim().length < 3}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: idea.trim().length >= 3 ? C.accent2 : C.surface, borderRadius: 12, padding: 13, marginBottom: 20, borderWidth: idea.trim().length < 3 ? 1 : 0, borderColor: C.border }}>
          {suggestionsLoading ? <ActivityIndicator size="small" color="#fff" /> : <Search size={16} color={idea.trim().length >= 3 ? '#fff' : C.text3} strokeWidth={1.8} />}
          <Text style={{ fontSize: 14, fontWeight: '600', color: idea.trim().length >= 3 ? '#fff' : C.text3 }}>
            {suggestionsLoading ? 'Searching...' : 'Find What People Search'}
          </Text>
        </TouchableOpacity>

        {suggestions.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Globe size={13} color={C.text3} strokeWidth={1.8} />
              <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.2, color: C.text3, textTransform: 'uppercase' }}>
                Trending Searches
              </Text>
            </View>
            {suggestions.map((s, i) => (
              <TouchableOpacity key={i}
                onPress={() => { setSelectedAngle(s.text); setShowCustom(false); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: selectedAngle === s.text ? C.accent + '15' : C.surface, borderRadius: 12, borderWidth: 1.5, borderColor: selectedAngle === s.text ? C.accent : C.border, marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: C.text, fontWeight: selectedAngle === s.text ? '700' : '400' }}>{s.text}</Text>
                  {s.bothPlatforms && <Text style={{ fontSize: 10, color: C.success, marginTop: 2, fontWeight: '600' }}>Trending on Google + YouTube</Text>}
                </View>
                {selectedAngle === s.text && <Check size={15} color={C.accent} strokeWidth={2.5} />}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => { setShowCustom(true); setSelectedAngle(''); }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, backgroundColor: showCustom ? C.accent + '10' : C.surface2, borderRadius: 12, borderWidth: 1.5, borderColor: showCustom ? C.accent : C.border, marginBottom: 8 }}>
              <Lightbulb size={15} color={showCustom ? C.accent : C.text3} strokeWidth={1.8} />
              <Text style={{ fontSize: 14, color: showCustom ? C.accent : C.text2, fontWeight: '600' }}>Write my own angle</Text>
            </TouchableOpacity>

            {showCustom && (
              <TextInput multiline value={customAngle} onChangeText={setCustomAngle}
                placeholder="Describe your specific angle..."
                placeholderTextColor={C.text3}
                style={{ backgroundColor: C.surface, borderRadius: 12, padding: 14, color: C.text, borderWidth: 1, borderColor: C.accent + '50', fontSize: 14, minHeight: 80, marginBottom: 8 }} />
            )}
          </View>
        )}

        {(selectedAngle || (showCustom && customAngle)) && (
          <View style={{ backgroundColor: C.success + '10', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.success + '30', marginBottom: 16 }}>
            <Text style={{ fontSize: 11, color: C.success, fontWeight: '600', marginBottom: 4 }}>Selected angle</Text>
            <Text style={{ fontSize: 14, color: C.text }}>{finalIdea}</Text>
          </View>
        )}

        <TouchableOpacity style={btn} onPress={() => {
          if (!idea.trim()) { Alert.alert('Required', 'Enter your topic first'); return; }
          if (suggestions.length > 0 && !selectedAngle && !showCustom) { Alert.alert('Select an angle', 'Pick a suggestion or write your own'); return; }
          setStep(2);
        }}>
          <Text style={btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ===== STEP 2 — VIDEO TYPE =====
  if (step === 2) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <StepDots />
      <SectionHeader title="Video format?" subtitle="Structure changes based on type" />
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[['short', 'Short', '30–90 sec'], ['long', 'Long', '5–15 min']].map(([type, lbl, sl]) => (
            <TouchableOpacity key={type} onPress={() => { setVideoType(type); setDuration(type === 'short' ? '75' : '600'); }}
              style={{ flex: 1, padding: 24, borderRadius: 16, borderWidth: 1.5, borderColor: videoType === type ? C.accent : C.border, backgroundColor: videoType === type ? C.accent + '10' : C.surface, alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: 17, color: videoType === type ? C.accent : C.text, marginBottom: 6 }}>{lbl}</Text>
              <Text style={{ fontSize: 12, color: C.text3 }}>{sl}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 8 }}>Duration (seconds)</Text>
        <TextInput keyboardType="numeric" value={duration} onChangeText={setDuration}
          style={{ backgroundColor: C.surface, borderRadius: 12, padding: 14, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 8, fontSize: 15 }} />
        <Text style={{ fontSize: 11, color: C.text3, marginBottom: 20 }}>~{totalClips} total clips needed ({clipsPerSection} per section)</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[btnSecondary, { flex: 1 }]} onPress={() => setStep(1)}><Text style={btnSecText}>Back</Text></TouchableOpacity>
          <TouchableOpacity style={[btn, { flex: 2, marginTop: 8 }]} onPress={() => { if (!videoType) { Alert.alert('Required', 'Select video type'); return; } setStep(3); }}><Text style={btnText}>Continue</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 3 — PILLAR =====
  if (step === 3) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <StepDots />
      <SectionHeader title="Content pillar?" subtitle="AI style adjusts per pillar" />
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ gap: 8, marginBottom: 20 }}>
          {pillars.map(p => (
            <TouchableOpacity key={p.name} onPress={() => setPillar(p.name)}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: pillar === p.name ? C.accent : C.border, backgroundColor: pillar === p.name ? C.accent + '10' : C.surface }}>
              <View>
                <Text style={{ fontWeight: '600', color: pillar === p.name ? C.accent : C.text, fontSize: 14 }}>{p.name}</Text>
                <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{p.desc}</Text>
              </View>
              {pillar === p.name && <Check size={16} color={C.accent} strokeWidth={2.5} />}
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[btnSecondary, { flex: 1 }]} onPress={() => setStep(2)}><Text style={btnSecText}>Back</Text></TouchableOpacity>
          <TouchableOpacity style={[btn, { flex: 2, marginTop: 8 }]} onPress={() => { if (!pillar) { Alert.alert('Required', 'Select a pillar'); return; } setStep(4); }}><Text style={btnText}>Continue</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 4 — EMOTIONS =====
  if (step === 4) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <StepDots />
      <SectionHeader title="Set the tone" subtitle="Choose emotion for each section" />
      <View style={{ paddingHorizontal: 20 }}>
        {sections.map(sec => {
          const secEmotions = emotions.filter(e => e.sec.includes(sec.id) || e.sec.length > 2);
          return (
            <View key={sec.id} style={{ borderWidth: 1, borderColor: C.border, borderRadius: 16, marginBottom: 12, overflow: 'hidden' }}>
              <View style={{ padding: 14, backgroundColor: C.surface2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <sec.Icon size={14} color={C.text2} strokeWidth={1.8} />
                  <Text style={{ fontWeight: '700', color: C.text, fontSize: 13 }}>{sec.label}</Text>
                </View>
                <Text style={{ fontSize: 11, color: selectedEmotions[sec.id] ? C.accent : C.text3 }}>
                  {selectedEmotions[sec.id] || sec.timing}
                </Text>
              </View>
              <View style={{ padding: 12, backgroundColor: C.surface, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {emotions.map(em => (
                  <TouchableOpacity key={em.e} onPress={() => setSelectedEmotions(prev => ({ ...prev, [sec.id]: em.e }))}
                    style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100, borderWidth: 1.5, borderColor: selectedEmotions[sec.id] === em.e ? C.accent : C.border, backgroundColor: selectedEmotions[sec.id] === em.e ? C.accent + '15' : C.surface2 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: selectedEmotions[sec.id] === em.e ? C.accent : C.text2 }}>{em.e}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[btnSecondary, { flex: 1 }]} onPress={() => setStep(3)}><Text style={btnSecText}>Back</Text></TouchableOpacity>
          <TouchableOpacity style={[btn, { flex: 2, marginTop: 8 }]} onPress={generateScriptAndTitles}><Text style={btnText}>Generate Script</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 5 — LOADING =====
  if (step === 5) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40 }}>
      <ActivityIndicator size="large" color={C.accent} />
      <Text style={{ fontWeight: '700', fontSize: 20, color: C.text, textAlign: 'center' }}>Generating script and titles...</Text>
      <Text style={{ fontSize: 13, color: C.text2, textAlign: 'center' }}>Using your selected angle and emotions</Text>
      <TouchableOpacity onPress={() => { setScript(demoScript); setTitles(demoTitles); setScriptLoading(false); setStep(6); }} style={{ marginTop: 20 }}>
        <Text style={{ color: C.text3, fontSize: 13 }}>Skip — use demo content</Text>
      </TouchableOpacity>
    </View>
  );

  // ===== STEP 6 — SCRIPT =====
  if (step === 6) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: C.text }}>Script</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => Alert.alert('Export', 'Choose format', [
              { text: 'Plain Text', onPress: () => shareScript('plain') },
              { text: 'Structured', onPress: () => shareScript('structured') },
              { text: 'Cancel', style: 'cancel' },
            ])}
            style={{ backgroundColor: C.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.border }}>
            <Text style={{ color: C.text2, fontSize: 13, fontWeight: '600' }}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep(7)}
            style={{ backgroundColor: C.success + '20', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.success + '40' }}>
            <Text style={{ color: C.success, fontWeight: '700', fontSize: 13 }}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!scriptKey && !scriptFallback && (
        <View style={{ marginHorizontal: 20, padding: 12, backgroundColor: C.warning + '10', borderRadius: 12, borderWidth: 1, borderColor: C.warning + '30', marginBottom: 12 }}>
          <Text style={{ fontSize: 12, color: C.warning }}>Demo mode — add Claude API key in Settings for AI generation</Text>
        </View>
      )}

      {script.map((sec, idx) => {
        const info = sections.find(s => s.id === sec.id) || { label: sec.id, timing: '', Icon: FileText };
        return (
          <View key={sec.id} style={{ borderWidth: 1, borderColor: C.border, borderRadius: 16, marginHorizontal: 20, marginBottom: 12, overflow: 'hidden' }}>
            <View style={{ padding: 14, backgroundColor: C.surface2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <info.Icon size={14} color={C.accent} strokeWidth={1.8} />
                <Text style={{ fontWeight: '700', color: C.text, fontSize: 13 }}>{info.label}</Text>
                {selectedEmotions[sec.id] && <Text style={{ fontSize: 10, color: C.text3 }}>· {selectedEmotions[sec.id]}</Text>}
              </View>
              <Text style={{ fontSize: 10, color: C.text3 }}>{info.timing}</Text>
            </View>
            <View style={{ padding: 14, backgroundColor: C.surface }}>
              <TextInput multiline value={sec.text}
                onChangeText={val => setScript(prev => prev.map((s, i) => i === idx ? { ...s, text: val } : s))}
                style={{ color: C.text, fontSize: 14, lineHeight: 24, marginBottom: 12 }} />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={{ flex: 1, padding: 8, borderRadius: 10, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onPress={() => regenSection(idx)} disabled={regenLoading[idx]}>
                  {regenLoading[idx] ? <ActivityIndicator size="small" color={C.accent} /> : <RotateCcw size={13} color={C.text2} strokeWidth={1.8} />}
                  <Text style={{ fontSize: 12, color: C.text2 }}>Regen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, padding: 8, borderRadius: 10, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onPress={() => copyText(sec.text)}>
                  <Copy size={13} color={C.text2} strokeWidth={1.8} />
                  <Text style={{ fontSize: 12, color: C.text2 }}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}

      <View style={{ padding: 20, gap: 8 }}>
        <TouchableOpacity style={btnSecondary} onPress={() => { setScript([]); generateScriptAndTitles(); }}>
          <Text style={btnSecText}>Regenerate Full Script</Text>
        </TouchableOpacity>
        <TouchableOpacity style={btn} onPress={() => setStep(7)}>
          <Text style={btnText}>Continue to Titles</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ===== STEP 7 — TITLES =====
  if (step === 7) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <StepDots />
      <SectionHeader title="Choose a title" subtitle="Based on trending keywords" />
      <View style={{ paddingHorizontal: 20 }}>
        {titles.map((t, i) => (
          <TouchableOpacity key={i} onPress={() => setSelectedTitle(t)}
            style={{ padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: selectedTitle === t ? C.accent : C.border, backgroundColor: selectedTitle === t ? C.accent + '10' : C.surface, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 12, color: C.text3, fontWeight: '700', minWidth: 22 }}>{i + 1}</Text>
            <Text style={{ flex: 1, fontSize: 14, color: C.text, lineHeight: 20 }}>{t}</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {selectedTitle === t && <Check size={14} color={C.accent} strokeWidth={2.5} />}
              <TouchableOpacity onPress={() => copyText(t)}>
                <Copy size={14} color={C.text3} strokeWidth={1.8} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={{ fontSize: 12, color: C.text3, marginTop: 12, marginBottom: 6 }}>Or write your own:</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          <TextInput value={selectedTitle} onChangeText={setSelectedTitle}
            placeholder="Custom title..."
            placeholderTextColor={C.text3}
            style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 14, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14 }} />
          <TouchableOpacity onPress={() => copyText(selectedTitle)} style={{ width: 46, backgroundColor: C.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border }}>
            <Copy size={16} color={C.text2} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[btnSecondary, { flex: 1 }]} onPress={() => setStep(6)}><Text style={btnSecText}>Back</Text></TouchableOpacity>
          <TouchableOpacity style={[btn, { flex: 2, marginTop: 8 }]} onPress={() => {
            if (!selectedTitle) { Alert.alert('Required', 'Select or write a title'); return; }
            generateDescription(); setStep(8);
          }}><Text style={btnText}>Approve</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 8 — DESCRIPTION + TAGS =====
  if (step === 8) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <StepDots />
      <SectionHeader title="Description & Tags" subtitle="YouTube-ready copy" />
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>Description</Text>
          <TouchableOpacity onPress={() => copyText(description)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Copy size={13} color={C.accent} strokeWidth={1.8} />
            <Text style={{ fontSize: 12, color: C.accent }}>Copy</Text>
          </TouchableOpacity>
        </View>
        <TextInput multiline value={description} onChangeText={setDescription}
          placeholder="Generating description..."
          placeholderTextColor={C.text3}
          style={{ backgroundColor: C.surface, borderRadius: 14, padding: 14, color: C.text, borderWidth: 1, borderColor: C.border, minHeight: 140, marginBottom: 8, lineHeight: 22, fontSize: 14 }} />
        <TouchableOpacity style={[btnSecondary, { marginBottom: 24 }]} onPress={generateDescription}>
          <Text style={btnSecText}>Regenerate Description</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 12 }}>Tags</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {tags.map((tag, i) => (
            <TouchableOpacity key={i} onPress={() => setTags(prev => prev.filter((_, idx) => idx !== i))}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: C.surface, borderRadius: 100, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 12, color: C.text2 }}>{tag}</Text>
              <X size={11} color={C.danger} strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
          <TextInput value={newTag} onChangeText={setNewTag} placeholder="#tag"
            placeholderTextColor={C.text3}
            style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14 }} />
          <TouchableOpacity onPress={() => { if (newTag.trim()) { setTags(prev => [...prev, newTag.startsWith('#') ? newTag : '#' + newTag]); setNewTag(''); } }}
            style={{ backgroundColor: C.accent, borderRadius: 12, padding: 12, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={18} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[btnSecondary, { flex: 1 }]} onPress={() => setStep(7)}><Text style={btnSecText}>Back</Text></TouchableOpacity>
          <TouchableOpacity style={[btn, { flex: 2, marginTop: 8 }]} onPress={() => getVideoSuggestions()}><Text style={btnText}>Continue to Visuals</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 9 LOADING =====
  if (step === 9 && videoLoading) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40 }}>
      <ActivityIndicator size="large" color={C.accent} />
      <Text style={{ fontWeight: '700', fontSize: 20, color: C.text, textAlign: 'center' }}>Finding video clips...</Text>
      <Text style={{ fontSize: 13, color: C.text2, textAlign: 'center' }}>Generating smart keywords per section</Text>
      <TouchableOpacity onPress={() => { setVideoLoading(false); setVideoSections(sections.map(s => ({ id: s.id, label: s.label, clips_needed: clipsPerSection, keywords: [finalIdea], mood: 'neutral', clips: [], selectedClips: [] }))); }} style={{ marginTop: 20 }}>
        <Text style={{ color: C.text3, fontSize: 13 }}>Skip video search</Text>
      </TouchableOpacity>
    </View>
  );

  // ===== STEP 9 — CLIP SELECTION =====
  if (step === 9 && !videoLoading && videoSections.length > 0) {
    const currentSec = videoSections[currentVideoSection];
    const isLastSection = currentVideoSection === videoSections.length - 1;
    const filteredClips = applyDurationFilter(currentSec?.clips || []);
    const totalSelected = videoSections.reduce((acc, s) => acc + (s.selectedClips?.length || 0), 0);
    const currentScript = script.find(s => s.id === currentSec?.id);

    return (
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
        <StepDots />
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, marginBottom: 4, textTransform: 'uppercase' }}>
            Step 9 · {currentVideoSection + 1}/{videoSections.length} · {totalSelected} selected
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: C.text, letterSpacing: -0.5 }}>{currentSec?.label}</Text>
          <Text style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>{currentSec?.mood} · ~{clipsPerSection} clips needed</Text>
        </View>

        {/* Section script preview */}
        {currentScript && (
          <View style={{ marginHorizontal: 20, backgroundColor: C.surface2, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border, marginBottom: 16 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.text3, letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>Script for this section</Text>
            <Text style={{ fontSize: 13, color: C.text2, lineHeight: 20 }} numberOfLines={4}>{currentScript.text}</Text>
          </View>
        )}

        {/* Section progress */}
        <View style={{ flexDirection: 'row', gap: 4, marginHorizontal: 20, marginBottom: 16 }}>
          {videoSections.map((sec, i) => (
            <TouchableOpacity key={i} onPress={() => setCurrentVideoSection(i)}
              style={{ flex: 1, height: 3, borderRadius: 100, backgroundColor: sec.selectedClips?.length > 0 ? C.success : i === currentVideoSection ? C.accent : C.border }} />
          ))}
        </View>

        {/* Duration filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {[['any', 'Any'], ['under10', '<10s'], ['10-30', '10–30s'], ['30-60', '30–60s']].map(([f, l]) => (
            <TouchableOpacity key={f} onPress={() => setDurationFilter(f)}
              style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100, borderWidth: 1.5, borderColor: durationFilter === f ? C.accent : C.border, backgroundColor: durationFilter === f ? C.accent + '15' : C.surface }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: durationFilter === f ? C.accent : C.text2 }}>{l}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search new clips */}
        <View style={{ flexDirection: 'row', gap: 8, marginHorizontal: 20, marginBottom: 16 }}>
          <TextInput value={searchQuery} onChangeText={setSearchQuery}
            placeholder={`Search clips: ${currentSec?.keywords?.[0] || finalIdea}`}
            placeholderTextColor={C.text3}
            style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 13 }} />
          <TouchableOpacity onPress={searchNewClips}
            style={{ backgroundColor: C.accent2, borderRadius: 12, padding: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' }}>
            <Search size={16} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Clips grid */}
        {filteredClips.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 40, marginHorizontal: 20, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 16 }}>
            <Text style={{ color: C.text2, fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
              {pexelsKey || pixabayKey ? 'No clips found — try different keywords' : 'Add Pexels or Pixabay key in Settings'}
            </Text>
            <TouchableOpacity style={{ backgroundColor: C.accent, borderRadius: 12, padding: 12, paddingHorizontal: 20 }} onPress={searchNewClips}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Search Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20, marginBottom: 16 }}>
            {filteredClips.map((clip) => {
              const isSelected = currentSec.selectedClips?.includes(clip.id);
              return (
                <View key={clip.id} style={{ width: '47%', borderWidth: 2, borderColor: isSelected ? C.success : C.border, borderRadius: 14, overflow: 'hidden', backgroundColor: C.surface }}>
                  <TouchableOpacity onPress={() => clip.url && setPreviewUri(clip.url)}>
                    <View style={{ height: 90, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {clip.thumbnail
                        ? <Image source={{ uri: clip.thumbnail }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                        : <FileText size={24} color={C.text3} strokeWidth={1.5} />}
                      {clip.url && (
                        <View style={{ position: 'absolute', width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}>
                          <Play size={14} color="#fff" strokeWidth={2} />
                        </View>
                      )}
                      <View style={{ position: 'absolute', bottom: 4, right: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 9, color: '#fff' }}>{clip.duration}s</Text>
                      </View>
                      <View style={{ position: 'absolute', top: 4, left: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 9, color: '#fff' }}>{clip.source}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleClip(currentVideoSection, clip.id)}
                    style={{ padding: 8, backgroundColor: isSelected ? C.success + '15' : C.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    {isSelected && <Check size={12} color={C.success} strokeWidth={2.5} />}
                    <Text style={{ fontSize: 12, color: isSelected ? C.success : C.text2, fontWeight: '600' }}>
                      {isSelected ? 'Selected' : 'Select'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20 }}>
          <TouchableOpacity style={[btnSecondary, { flex: 1 }]}
            onPress={() => currentVideoSection > 0 ? setCurrentVideoSection(prev => prev - 1) : setStep(8)}>
            <Text style={btnSecText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[btn, { flex: 2, marginTop: 8 }]}
            onPress={() => {
              if (isLastSection) { generateSubtitles(); setStep(10); }
              else setCurrentVideoSection(prev => prev + 1);
            }}>
            <Text style={btnText}>{isLastSection ? 'Continue to Subtitles' : `Next: ${videoSections[currentVideoSection + 1]?.label}`}</Text>
          </TouchableOpacity>
        </View>

        {/* Video preview modal */}
        {previewUri && <VideoPlayer uri={previewUri} onClose={() => setPreviewUri(null)} />}
      </ScrollView>
    );
  }

  // ===== STEP 10 — SUBTITLES =====
  if (step === 10) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <StepDots />
      <SectionHeader title="Subtitles" subtitle="3-4 words per line for better readability" />
      <View style={{ paddingHorizontal: 20 }}>
        {subLoading ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <ActivityIndicator size="large" color={C.accent} />
            <Text style={{ color: C.text2, fontSize: 14, marginTop: 16 }}>Generating...</Text>
          </View>
        ) : subtitleLines.length === 0 ? (
          <TouchableOpacity style={btn} onPress={generateSubtitles}>
            <Text style={btnText}>Generate Subtitles</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 12, overflow: 'hidden' }}>
              {subtitleLines.slice(0, 30).map((line, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: i < Math.min(subtitleLines.length, 30) - 1 ? 1 : 0, borderColor: C.border }}>
                  <Text style={{ fontSize: 10, color: C.accent, minWidth: 72, marginTop: 2 }}>{line.start.substring(0, 8)}</Text>
                  <TextInput value={line.text}
                    onChangeText={val => setSubtitleLines(prev => prev.map((l, idx) => idx === i ? { ...l, text: val } : l))}
                    style={{ flex: 1, fontSize: 13, color: C.text }} />
                </View>
              ))}
              {subtitleLines.length > 30 && (
                <View style={{ padding: 12, alignItems: 'center' }}>
                  <Text style={{ color: C.text3, fontSize: 12 }}>+{subtitleLines.length - 30} more lines</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={[btnSecondary, { marginBottom: 8 }]} onPress={generateSubtitles}>
              <Text style={btnSecText}>Regenerate</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity style={[btnSecondary, { flex: 1 }]} onPress={() => setStep(9)}><Text style={btnSecText}>Back</Text></TouchableOpacity>
          <TouchableOpacity style={[btn, { flex: 2, marginTop: 8 }]} onPress={() => setStep(11)}><Text style={btnText}>Continue</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 11 — FINAL =====
  if (step === 11) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <StepDots />
      <SectionHeader title="Ready to save" subtitle="Review everything before saving" />
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 20, overflow: 'hidden' }}>
          {[
            { label: 'Script', done: script.length > 0, sub: script.length + ' sections', step: 6 },
            { label: 'Title', done: !!selectedTitle, sub: selectedTitle?.substring(0, 45) || 'Not selected', step: 7 },
            { label: 'Description', done: !!description, sub: description ? description.length + ' chars' : 'Not added', step: 8 },
            { label: 'Tags', done: tags.length > 0, sub: tags.length + ' tags', step: 8 },
            { label: 'Video Clips', done: videoSections.some(s => s.selectedClips?.length > 0), sub: videoSections.reduce((acc, s) => acc + (s.selectedClips?.length || 0), 0) + ' clips selected', step: 9 },
            { label: 'Subtitles', done: subtitleLines.length > 0, sub: subtitleLines.length + ' lines', step: 10 },
          ].map((item, i, arr) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: item.done ? C.success + '15' : C.surface2, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                {item.done ? <Check size={14} color={C.success} strokeWidth={2.5} /> : <Circle size={14} color={C.text3} strokeWidth={1.8} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{item.label}</Text>
                <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }} numberOfLines={1}>{item.sub}</Text>
              </View>
              <TouchableOpacity onPress={() => setStep(item.step)}
                style={{ backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.border }}>
                <Text style={{ fontSize: 12, color: C.text2, fontWeight: '600' }}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {downloading ? (
          <View style={{ backgroundColor: C.surface, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: C.border }}>
            <ActivityIndicator size="large" color={C.accent} />
            <Text style={{ color: C.text, fontWeight: '600', marginTop: 12 }}>{downloadProgress}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={{ backgroundColor: C.accent2 + '15', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: C.accent2 + '40', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
            onPress={downloadAllToFolder}>
            <Download size={18} color={C.accent2} strokeWidth={1.8} />
            <View>
              <Text style={{ fontWeight: '700', fontSize: 15, color: C.accent2 }}>Download All Files</Text>
              <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>Script, subtitles, clips, titles, tags</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{ backgroundColor: C.accent, borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 10, flexDirection: 'row', justifyContent: 'center', gap: 10 }}
          onPress={() => {
            addVideo({
              title: selectedTitle || finalIdea,
              pillar, type: videoType, status: 'ready',
              description, tags, idea: finalIdea,
              selectedEmotions, duration,
              script, titles, selectedTitle,
              videoSections, subtitleLines,
              searchKeywords: suggestions.slice(0, 3).map(s => s.text),
            });
            clearDraft();
            Alert.alert('Saved', 'Video added to Library', [
              { text: 'View in Library', onPress: () => navigation.navigate('Library') }
            ]);
          }}>
          <Check size={18} color="#fff" strokeWidth={2.5} />
          <Text style={{ fontWeight: '700', fontSize: 17, color: '#fff' }}>Save to Library</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: C.surface, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: C.border }}
          onPress={() => {
            clearDraft();
            setStep(1); setIdea(''); setSelectedAngle(''); setSuggestions([]); setVideoType(''); setPillar('');
            setSelectedEmotions({}); setScript([]); setTitles([]); setSelectedTitle(''); setDescription('');
            setTags(['#personalfinance', '#paisa', '#kahanipaisonki', '#hindishorts']);
            setVideoSections([]); setCurrentVideoSection(0); setSubtitleLines([]);
          }}>
          <Text style={{ color: C.text2, fontWeight: '600' }}>Start New Video</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return null;
}
