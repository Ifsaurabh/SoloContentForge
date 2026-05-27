/* eslint-disable */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const shortSections = [
  { id: 'hook', label: 'HOOK', timing: '0 – 5 sec', emojis: [{ e: '😮', l: 'Shock' }, { e: '🤔', l: 'Curiosity' }, { e: '😟', l: 'Relatable' }, { e: '⚡', l: 'Urgency' }] },
  { id: 'openloop', label: 'OPEN LOOP', timing: '5 – 15 sec', emojis: [{ e: '🕵️', l: 'Mystery' }, { e: '😯', l: 'Surprise' }, { e: '🔥', l: 'Tension' }, { e: '💡', l: 'Intrigue' }] },
  { id: 'progress', label: 'PROGRESSION', timing: '15 – 40 sec', emojis: [{ e: '📖', l: 'Storytelling' }, { e: '⚖️', l: 'Contrast' }, { e: '🪜', l: 'Step by Step' }, { e: '🎯', l: 'Direct' }] },
  { id: 'tension', label: 'TENSION BUILD', timing: '40 – 55 sec', emojis: [{ e: '😬', l: 'Suspense' }, { e: '⚠️', l: 'Warning' }, { e: '🌊', l: 'Build Up' }, { e: '🎭', l: 'Drama' }] },
  { id: 'payoff', label: 'PAYOFF', timing: '55 – 70 sec', emojis: [{ e: '💡', l: 'Revelation' }, { e: '✅', l: 'Clarity' }, { e: '🤯', l: 'Mind Shift' }, { e: '🏆', l: 'Confidence' }] },
  { id: 'endline', label: 'END LINE', timing: '70 – 75 sec', emojis: [{ e: '🪞', l: 'Reflection' }, { e: '🚨', l: 'Consequence' }, { e: '💬', l: 'Challenge' }, { e: '🙏', l: 'Motivation' }] },
];

const longSections = [
  { id: 'hook', label: 'HOOK', timing: '0 – 30 sec', emojis: [{ e: '😮', l: 'Shock' }, { e: '🤔', l: 'Curiosity' }, { e: '😟', l: 'Relatable' }, { e: '⚡', l: 'Urgency' }] },
  { id: 'problem', label: 'PROBLEM INTRO', timing: '30 sec – 2 min', emojis: [{ e: '🕵️', l: 'Mystery' }, { e: '😯', l: 'Surprise' }, { e: '🔥', l: 'Tension' }, { e: '💡', l: 'Intrigue' }] },
  { id: 'explain', label: 'EXPLANATION', timing: '2 – 5 min', emojis: [{ e: '📖', l: 'Storytelling' }, { e: '⚖️', l: 'Contrast' }, { e: '🪜', l: 'Step by Step' }, { e: '🎯', l: 'Direct' }] },
  { id: 'example', label: 'REAL EXAMPLE', timing: '5 – 8 min', emojis: [{ e: '😬', l: 'Suspense' }, { e: '⚠️', l: 'Warning' }, { e: '🌊', l: 'Build Up' }, { e: '🎭', l: 'Drama' }] },
  { id: 'breakdown', label: 'BREAKDOWN', timing: '8 – 12 min', emojis: [{ e: '💡', l: 'Revelation' }, { e: '✅', l: 'Clarity' }, { e: '🤯', l: 'Mind Shift' }, { e: '🏆', l: 'Confidence' }] },
  { id: 'takeaway', label: 'FINAL TAKEAWAY', timing: '12 – 15 min', emojis: [{ e: '🪞', l: 'Reflection' }, { e: '🚨', l: 'Consequence' }, { e: '💬', l: 'Challenge' }, { e: '🙏', l: 'Motivation' }] },
];

const pillars = [
  { name: 'Finance Pulse', icon: '📰' },
  { name: 'Explained Series', icon: '🔍' },
  { name: 'Paiso Ki Psychology', icon: '🧠' },
  { name: 'Scam Files', icon: '🚨' },
  { name: 'Smart Money Guide', icon: '💰' },
  { name: 'Finance & Geopolitics', icon: '🌍' },
  { name: 'Quick Finance', icon: '⚡' },
];

const demoScript = [
  { id: 'hook', text: 'Same duniya… par results different kyun?\n\nYe question aapke dimag mein bhi zaroor aaya hoga…' },
  { id: 'openloop', text: 'Asli reason abhi baaki hai…\nJo cheez koi clearly nahi batata…\nwoh hai decision system.' },
  { id: 'progress', text: 'Middle class price dekhta hai…\nRich log value dekhte hain…\n\nMiddle class ek income pe depend karta hai…\nRich log multiple streams banate hain…' },
  { id: 'tension', text: 'Ab tak jo dekha… wo sirf surface tha.\n\nAssali game hota hai kuch aur hi…' },
  { id: 'payoff', text: 'Woh hai aapka decision system.\n\nJab tak aap apna decision system nahi badalte…\ntab tak income badhne ke baad bhi result same rehta hai.' },
  { id: 'endline', text: 'Socho — aaj aapne kaunsa financial decision liya?\nKya woh aapke future ke liye tha?' },
];

const demoTitles = [
  'Paisa kyun nahi badh raha? Hidden Psychology',
  'Middle Class ki sabse badi galti — Explained',
  'Rich aur Middle Class ka asli fark kya hai?',
  'Ye ek cheez badlo — financial life badal jayegi',
  'Log paisa kyun nahi bacha pate? Real Reason',
];

export default function NewVideoScreen() {
  const { C, addVideo, getKey, language } = useApp();
  const [step, setStep] = useState(1);
  const [idea, setIdea] = useState('');
  const [videoType, setVideoType] = useState('');
  const [duration, setDuration] = useState('75');
  const [pillar, setPillar] = useState('');
  const [emotions, setEmotions] = useState({});
  const [script, setScript] = useState([]);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [titles, setTitles] = useState([...demoTitles]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['#personalfinance', '#paisa', '#middleclass', '#kahanipaisonki', '#hindishorts', '#moneypsychology']);
  const [newTag, setNewTag] = useState('');

  // Video section state
  const [videoSections, setVideoSections] = useState([]);
  const [currentVideoSection, setCurrentVideoSection] = useState(0);
  const [videoLoading, setVideoLoading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [selectedClips, setSelectedClips] = useState({});

  // Subtitle state
  const [subtitleLines, setSubtitleLines] = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  const sections = videoType === 'short' ? shortSections : longSections;
  const claudeKey = getKey('claude');
  const pexelsKey = getKey('pexels');
  const pixabayKey = getKey('pixabay');
  const deepgramKey = getKey('deepgram');

  const primaryBtn = { backgroundColor: C.accent, borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 8 };
  const secondaryBtn = { backgroundColor: C.surface, borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: C.border };

  const StepDots = () => (
    <View style={{ flexDirection: 'row', gap: 3, padding: 16, paddingTop: 56, flexWrap: 'wrap' }}>
      {Array.from({ length: 11 }, (_, i) => i + 1).map(i => (
        <View key={i} style={{ height: 5, width: step === i ? 20 : 5, borderRadius: 100, backgroundColor: i < step ? C.success : i === step ? C.accent : C.border }} />
      ))}
    </View>
  );

  // ===== SCRIPT GENERATION =====
  async function generateScript() {
    setScriptLoading(true);
    setStep(5);
    if (claudeKey) {
      try {
        const emotionDesc = sections.map(s => `${s.label}: ${emotions[s.id] || 'Curiosity'}`).join(', ');
        const langMap = {
          hinglish: 'Hinglish (Hindi + English mix, Roman script)',
          hindi: 'Pure Hindi (Roman script)',
          urdu: 'Roman Urdu',
          english_us: 'American English',
          english_uk: 'British English',
          punjabi: 'Punjabi Hinglish',
          bengali: 'Bengali',
          marathi: 'Marathi',
          gujarati: 'Gujarati',
          tamil: 'Tamil',
          telugu: 'Telugu',
        };
        const prompt = `You are a YouTube finance script writer for "Kahani Paison Ki".
Language: ${langMap[language] || 'Hinglish'}
Topic: ${idea}
Pillar: ${pillar}
Format: ${videoType === 'short' ? 'YouTube Short (75 seconds)' : 'Long video (10 minutes)'}
Emotions per section: ${emotionDesc}

Rules:
- No greetings like "Hello friends"
- Hook must grab attention instantly
- Punchy, short sentences
- Storytelling style
- Real life examples

Return JSON only, no extra text:
{"sections":[{"id":"hook","text":"..."},{"id":"openloop","text":"..."},{"id":"progress","text":"..."},{"id":"tension","text":"..."},{"id":"payoff","text":"..."},{"id":"endline","text":"..."}]}`;

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': claudeKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] })
        });
        const data = await res.json();
        const text = data.content[0].text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(text);
        setScript(parsed.sections);
        await generateTitles(claudeKey);
      } catch (e) {
        setScript(demoScript);
        setTitles(demoTitles);
      }
    } else {
      await new Promise(r => setTimeout(r, 2000));
      setScript(demoScript);
      setTitles(demoTitles);
    }
    setScriptLoading(false);
    setStep(6);
  }

  // ===== TITLE GENERATION =====
  async function generateTitles(key) {
    if (!key) { setTitles(demoTitles); return; }
    try {
      const prompt = `Generate 5 clickable YouTube title options in ${language === 'hinglish' ? 'Hinglish' : language} for topic: "${idea}". Pillar: ${pillar}. Titles must be curiosity-based, simple, trending style. No boring titles. Return JSON only: {"titles":["title1","title2","title3","title4","title5"]}`;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 500, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      const parsed = JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
      setTitles(parsed.titles);
    } catch { setTitles(demoTitles); }
  }

  // ===== DESCRIPTION GENERATION =====
  async function generateDescription(key) {
    const defaultDesc = `${idea}\n\nIs video mein hum dekhenge:\n✅ Asli reason kyun aisa hota hai\n✅ Simple system jo kaam karta hai\n✅ Ek rule jo life badal dega\n\nChannel subscribe karo aur notification on karo!\n\n${tags.join(' ')}`;
    if (!key) { setDescription(defaultDesc); return; }
    try {
      const prompt = `Write a YouTube description in ${language === 'hinglish' ? 'Hinglish' : language} for video titled "${selectedTitle}" about "${idea}". Include 3 bullet points. End with subscribe CTA. Under 150 words. Plain text only.`;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 400, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      setDescription(data.content[0].text.trim());
    } catch { setDescription(defaultDesc); }
  }

  // ===== CLAUDE VIDEO SUGGESTIONS =====
  async function getVideoSuggestions() {
    setVideoLoading(true);
    setStep(9);

    if (claudeKey && script.length > 0) {
      try {
        const scriptSummary = script.map(s => `${s.id}: ${s.text.substring(0, 100)}`).join('\n');
        const prompt = `You are a video editor helping find stock footage for a YouTube ${videoType} video.

Script sections:
${scriptSummary}

Video duration: ${duration} seconds
Sections count: ${sections.length}

For each section, suggest:
1. How many clips needed (based on timing)
2. 2 search keywords for stock footage
3. Visual mood

Return JSON only:
{"sections":[{"id":"hook","clips_needed":2,"keywords":["keyword1","keyword2"],"mood":"tense, curious"},{"id":"openloop","clips_needed":3,"keywords":["keyword1","keyword2"],"mood":"relatable"}]}`;

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': claudeKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 800, messages: [{ role: 'user', content: prompt }] })
        });
        const data = await res.json();
        const parsed = JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());

        // Now search videos for each section
        const sectionsWithClips = await Promise.all(
          parsed.sections.map(async (sec) => {
            const clips = await searchVideos(sec.keywords[0], sec.clips_needed);
            return { ...sec, clips, selectedClips: [] };
          })
        );
        setVideoSections(sectionsWithClips);
        setCurrentVideoSection(0);
      } catch (e) {
        // Fallback demo
        setVideoSections(sections.map(s => ({
          id: s.id,
          label: s.label,
          clips_needed: 2,
          keywords: [idea.split(' ')[0] || 'money', 'finance'],
          mood: 'neutral',
          clips: [],
          selectedClips: []
        })));
        setCurrentVideoSection(0);
      }
    } else {
      setVideoSections(sections.map(s => ({
        id: s.id,
        label: s.label,
        clips_needed: 2,
        keywords: [idea.split(' ')[0] || 'money'],
        mood: 'neutral',
        clips: [],
        selectedClips: []
      })));
      setCurrentVideoSection(0);
    }
    setVideoLoading(false);
  }

  // ===== SEARCH VIDEOS (Pexels + Pixabay) =====
  async function searchVideos(keyword, count = 5) {
    const results = [];

    // Search Pexels
    if (pexelsKey) {
      try {
        const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(keyword)}&per_page=5`, {
          headers: { Authorization: pexelsKey }
        });
        const data = await res.json();
        if (data.videos) {
          data.videos.forEach(v => {
            results.push({
              id: 'pexels_' + v.id,
              source: 'Pexels',
              thumbnail: v.image,
              url: v.video_files?.find(f => f.quality === 'sd')?.link || v.video_files?.[0]?.link,
              duration: v.duration + 's',
              label: v.user?.name || 'Pexels',
              approved: false,
            });
          });
        }
      } catch (e) { console.log('Pexels error:', e); }
    }

    // Search Pixabay
    if (pixabayKey) {
      try {
        const res = await fetch(`https://pixabay.com/api/videos/?key=${pixabayKey}&q=${encodeURIComponent(keyword)}&per_page=5`);
        const data = await res.json();
        if (data.hits) {
          data.hits.forEach(v => {
            results.push({
              id: 'pixabay_' + v.id,
              source: 'Pixabay',
              thumbnail: v.videos?.medium?.thumbnail || v.userImageURL,
              url: v.videos?.medium?.url || v.videos?.small?.url,
              duration: v.duration + 's',
              label: v.user || 'Pixabay',
              approved: false,
            });
          });
        }
      } catch (e) { console.log('Pixabay error:', e); }
    }

    // If no API keys — show placeholders
    if (results.length === 0) {
      for (let i = 0; i < 5; i++) {
        results.push({
          id: 'demo_' + i,
          source: 'Demo',
          thumbnail: null,
          url: null,
          duration: (Math.floor(Math.random() * 20) + 5) + 's',
          label: keyword + ' clip ' + (i + 1),
          approved: false,
        });
      }
    }

    return results.slice(0, 5);
  }

  // ===== TOGGLE CLIP SELECTION =====
  function toggleClip(sectionIdx, clipId) {
    setVideoSections(prev => prev.map((sec, i) => {
      if (i !== sectionIdx) return sec;
      const isSelected = sec.selectedClips.includes(clipId);
      const newSelected = isSelected
        ? sec.selectedClips.filter(id => id !== clipId)
        : [...sec.selectedClips, clipId];
      return { ...sec, selectedClips: newSelected };
    }));
  }

  // ===== SUBTITLE GENERATION =====
  async function generateSubtitles() {
    setSubLoading(true);
    if (deepgramKey && script.length > 0) {
      // Generate SRT from script text
      const lines = [];
      let timeCounter = 0;
      script.forEach(sec => {
        const sentences = sec.text.split('\n').filter(s => s.trim());
        sentences.forEach(sentence => {
          if (sentence.trim()) {
            const startTime = formatSRTTime(timeCounter);
            timeCounter += 3;
            const endTime = formatSRTTime(timeCounter);
            lines.push({ start: startTime, end: endTime, text: sentence.trim() });
          }
        });
      });
      setSubtitleLines(lines);
    } else {
      const lines = script.flatMap((sec, si) =>
        sec.text.split('\n').filter(s => s.trim()).map((sentence, i) => ({
          start: formatSRTTime((si * 12) + (i * 3)),
          end: formatSRTTime((si * 12) + (i * 3) + 3),
          text: sentence.trim()
        }))
      );
      setSubtitleLines(lines);
    }
    setSubLoading(false);
  }

  function formatSRTTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},000`;
  }

  async function saveSRTFile() {
    try {
      const srtContent = subtitleLines.map((line, i) =>
        `${i + 1}\n${line.start} --> ${line.end}\n${line.text}\n`
      ).join('\n');

      const fileName = (selectedTitle || idea).replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30) + '.srt';
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, srtContent, { encoding: FileSystem.EncodingType.UTF8 });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'text/plain', dialogTitle: 'Save SRT File' });
      } else {
        Alert.alert('✅', 'SRT file saved: ' + fileName);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not save SRT file');
    }
  }

  async function shareScript() {
    const content = `SCRIPT: ${selectedTitle || idea}\n\n` +
      script.map(s => `[${s.id.toUpperCase()}]\n${s.text}`).join('\n\n');
    try {
      const fileName = 'script_' + Date.now() + '.txt';
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, content);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'text/plain' });
      }
    } catch (e) {
      Alert.alert('Error', 'Could not share script');
    }
  }

  const durationFilters = ['any', 'under10', '10-30', '30-60', '1-3min', '3min+'];
  const durationLabels = { any: '⏱️ Any', under10: 'Under 10s', '10-30': '10–30s', '30-60': '30–60s', '1-3min': '1–3 min', '3min+': '3 min+' };
  const [durationFilter, setDurationFilter] = useState('any');

  // ===== STEP 1 — Idea =====
  if (step === 1) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 1 — YOUR IDEA</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 }}>Kya idea hai? 💡</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>Works offline — type and save anytime</Text>
        <View style={{ backgroundColor: C.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 16 }}>
          <TextInput multiline value={idea} onChangeText={setIdea}
            placeholder="Apna idea likhein... jaise 'EMI trap kyun dangerous hai'"
            placeholderTextColor={C.text3}
            style={{ color: C.text, fontSize: 15, minHeight: 100, lineHeight: 24 }} />
          <Text style={{ fontSize: 11, color: C.text3, marginTop: 8 }}>💾 Auto-saved locally · {idea.length} chars</Text>
        </View>
        <TouchableOpacity style={primaryBtn} onPress={() => { if (!idea.trim()) { Alert.alert('⚠️', 'Pehle idea likhein'); return; } setStep(2); }}>
          <Text style={{ fontWeight: '700', color: '#111', fontSize: 15 }}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ===== STEP 2 — Type =====
  if (step === 2) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 2 — VIDEO TYPE</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 }}>Kaunsa format? 📱</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>Script structure is different for each</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          {[['short', '📱', 'SHORT', '30 – 90 sec'], ['long', '🎬', 'LONG', '5 – 15 min']].map(([type, icon, lbl, sl]) => (
            <TouchableOpacity key={type} onPress={() => setVideoType(type)}
              style={{ flex: 1, padding: 24, borderRadius: 16, borderWidth: 1.5, borderColor: videoType === type ? C.accent : C.border, backgroundColor: videoType === type ? C.accent + '15' : C.surface, alignItems: 'center' }}>
              <Text style={{ fontSize: 36, marginBottom: 10 }}>{icon}</Text>
              <Text style={{ fontWeight: '800', fontSize: 16, color: C.text, marginBottom: 4 }}>{lbl}</Text>
              <Text style={{ fontSize: 11, color: C.text3 }}>{sl}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 8 }}>Exact duration (seconds):</Text>
        <TextInput keyboardType="numeric" value={duration} onChangeText={setDuration}
          style={{ backgroundColor: C.surface, borderRadius: 12, padding: 14, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 16, fontSize: 15 }} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(1)}><Text style={{ color: C.text, fontWeight: '600' }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => { if (!videoType) { Alert.alert('⚠️', 'Video type select karo'); return; } setStep(3); }}>
            <Text style={{ fontWeight: '700', color: '#111', fontSize: 15 }}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 3 — Pillar =====
  if (step === 3) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 3 — CONTENT PILLAR</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 }}>Kaunsa pillar? 🏛️</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>AI style adjusts per pillar</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {pillars.map(p => (
            <TouchableOpacity key={p.name} onPress={() => setPillar(p.name)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: pillar === p.name ? C.accent : C.border, backgroundColor: pillar === p.name ? C.accent + '15' : C.surface, width: '48%' }}>
              <Text style={{ fontSize: 22 }}>{p.icon}</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: pillar === p.name ? C.text : C.text2, flex: 1 }}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(2)}><Text style={{ color: C.text, fontWeight: '600' }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => { if (!pillar) { Alert.alert('⚠️', 'Pillar select karo'); return; } setStep(4); }}>
            <Text style={{ fontWeight: '700', color: '#111', fontSize: 15 }}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 4 — Emotions =====
  if (step === 4) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 4 — EMOTION SELECTOR</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 }}>Feel choose karo 🎭</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>Har section ke liye emotion tap karo</Text>
        {sections.map(sec => (
          <View key={sec.id} style={{ borderWidth: 1, borderColor: C.border, borderRadius: 16, marginBottom: 12, overflow: 'hidden' }}>
            <View style={{ padding: 14, backgroundColor: C.surface2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', color: C.text, fontSize: 13 }}>{sec.label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {emotions[sec.id] && <Text style={{ fontSize: 11, color: C.accent }}>✓ {emotions[sec.id]}</Text>}
                <Text style={{ fontSize: 11, color: C.text3 }}>{sec.timing}</Text>
              </View>
            </View>
            <View style={{ padding: 12, backgroundColor: C.surface, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {sec.emojis.map(em => (
                <TouchableOpacity key={em.l} onPress={() => setEmotions(prev => ({ ...prev, [sec.id]: em.l }))}
                  style={{ width: '47%', padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: emotions[sec.id] === em.l ? C.accent : C.border, backgroundColor: emotions[sec.id] === em.l ? C.accent + '15' : C.surface2, alignItems: 'center' }}>
                  <Text style={{ fontSize: 24 }}>{em.e}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: emotions[sec.id] === em.l ? C.accent : C.text2, marginTop: 4 }}>{em.l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(3)}><Text style={{ color: C.text, fontWeight: '600' }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={generateScript}>
            <Text style={{ fontWeight: '700', color: '#111', fontSize: 15 }}>✨ Generate Script</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 5 — Loading =====
  if (step === 5) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <Text style={{ fontSize: 50 }}>✨</Text>
      <Text style={{ fontWeight: '800', fontSize: 22, color: C.text }}>Script ban raha hai...</Text>
      <Text style={{ fontSize: 14, color: C.text2, textAlign: 'center', paddingHorizontal: 40 }}>Claude aapke emotions aur pillar ke hisaab se likh raha hai</Text>
      <ActivityIndicator size="large" color={C.accent} style={{ marginTop: 10 }} />
    </View>
  );

  // ===== STEP 6 — Script =====
  if (step === 6) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: '800', fontSize: 20, color: C.text }}>Script ✏️</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={shareScript}
            style={{ backgroundColor: C.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.border }}>
            <Text style={{ color: C.text2, fontSize: 13 }}>📤 Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep(7)}
            style={{ backgroundColor: C.success + '22', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.success }}>
            <Text style={{ color: C.success, fontWeight: '700', fontSize: 13 }}>✅ Approve →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!claudeKey && (
        <View style={{ marginHorizontal: 16, padding: 12, backgroundColor: C.accent + '15', borderRadius: 12, borderWidth: 1, borderColor: C.accent + '44', marginBottom: 12 }}>
          <Text style={{ fontSize: 12, color: C.accent }}>🤖 Demo mode — add Claude API key in Settings for AI generation</Text>
        </View>
      )}

      {script.map((sec, idx) => {
        const info = sections.find(s => s.id === sec.id) || { label: sec.id.toUpperCase(), timing: '' };
        return (
          <View key={sec.id} style={{ borderWidth: 1, borderColor: C.border, borderRadius: 16, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' }}>
            <View style={{ padding: 14, backgroundColor: C.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontWeight: '700', color: C.text, fontSize: 13 }}>{info.label}</Text>
                {emotions[sec.id] && <Text style={{ fontSize: 10, color: C.accent, marginTop: 2 }}>🎭 {emotions[sec.id]}</Text>}
              </View>
              <Text style={{ fontSize: 11, color: C.text3 }}>{info.timing}</Text>
            </View>
            <View style={{ padding: 14, backgroundColor: C.surface }}>
              <TextInput multiline value={sec.text}
                onChangeText={val => setScript(prev => prev.map((s, i) => i === idx ? { ...s, text: val } : s))}
                style={{ color: C.text, fontSize: 14, lineHeight: 24, marginBottom: 12 }} />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={{ flex: 1, padding: 9, borderRadius: 10, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center' }}
                  onPress={() => { if (demoScript[idx]) setScript(prev => prev.map((s, i) => i === idx ? { ...s, text: demoScript[idx].text } : s)); }}>
                  <Text style={{ fontSize: 12, color: C.text2 }}>🔄 Regen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, padding: 9, borderRadius: 10, backgroundColor: C.success + '15', borderWidth: 1, borderColor: C.success, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: C.success }}>✅ OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}

      <View style={{ padding: 16, gap: 8 }}>
        <TouchableOpacity style={{ backgroundColor: C.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border }}
          onPress={() => { setScript([]); generateScript(); }}>
          <Text style={{ color: C.text2 }}>🔄 Regenerate Full Script</Text>
        </TouchableOpacity>
        <TouchableOpacity style={primaryBtn} onPress={() => setStep(7)}>
          <Text style={{ fontWeight: '700', color: '#111', fontSize: 15 }}>Continue to Titles →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ===== STEP 7 — Titles =====
  if (step === 7) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 7 — TITLE</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 }}>Kaunsa title? 🏷️</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>Ek choose karo — fir edit bhi kar sakte ho</Text>
        {titles.map((t, i) => (
          <TouchableOpacity key={i} onPress={() => setSelectedTitle(t)}
            style={{ padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: selectedTitle === t ? C.accent : C.border, backgroundColor: selectedTitle === t ? C.accent + '15' : C.surface, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 12, color: C.text3, fontWeight: '700', minWidth: 22 }}>{i + 1}</Text>
            <Text style={{ flex: 1, fontSize: 14, color: C.text, lineHeight: 20 }}>{t}</Text>
            {selectedTitle === t && <Text style={{ fontSize: 16 }}>✓</Text>}
          </TouchableOpacity>
        ))}
        <Text style={{ fontSize: 12, color: C.text3, marginTop: 12, marginBottom: 6 }}>Ya apna title likhein:</Text>
        <TextInput value={selectedTitle} onChangeText={setSelectedTitle}
          placeholder="Apna title type karo..."
          placeholderTextColor={C.text3}
          style={{ backgroundColor: C.surface, borderRadius: 12, padding: 14, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 12, fontSize: 14 }} />
        <TouchableOpacity style={[secondaryBtn, { marginBottom: 8 }]} onPress={() => generateTitles(claudeKey)}>
          <Text style={{ color: C.text2 }}>🔄 Generate 5 More</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(6)}><Text style={{ color: C.text, fontWeight: '600' }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => {
            if (!selectedTitle) { Alert.alert('⚠️', 'Pehle title choose karo'); return; }
            generateDescription(claudeKey);
            setStep(8);
          }}>
            <Text style={{ fontWeight: '700', color: '#111', fontSize: 15 }}>✅ Approve →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 8 — Description + Tags =====
  if (step === 8) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 8 — DESCRIPTION + TAGS</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 16 }}>Description 📄</Text>
        <TextInput multiline value={description} onChangeText={setDescription}
          placeholder="Description generating..."
          placeholderTextColor={C.text3}
          style={{ backgroundColor: C.surface, borderRadius: 14, padding: 14, color: C.text, borderWidth: 1, borderColor: C.border, minHeight: 130, marginBottom: 8, lineHeight: 22, fontSize: 14 }} />
        <TouchableOpacity style={[secondaryBtn, { marginBottom: 24 }]} onPress={() => generateDescription(claudeKey)}>
          <Text style={{ color: C.text2 }}>🔄 Regenerate Description</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 12 }}>Tags 🏷️</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {tags.map((tag, i) => (
            <TouchableOpacity key={i} onPress={() => setTags(prev => prev.filter((_, idx) => idx !== i))}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: C.surface, borderRadius: 100, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 12, color: C.text2 }}>{tag}</Text>
              <Text style={{ fontSize: 12, color: C.danger }}>✕</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
          <TextInput value={newTag} onChangeText={setNewTag} placeholder="#newtag"
            placeholderTextColor={C.text3}
            style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14 }} />
          <TouchableOpacity onPress={() => { if (newTag.trim()) { setTags(prev => [...prev, newTag.startsWith('#') ? newTag : '#' + newTag]); setNewTag(''); } }}
            style={{ backgroundColor: C.accent, borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
            <Text style={{ color: '#111', fontWeight: '700', fontSize: 15 }}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(7)}><Text style={{ color: C.text, fontWeight: '600' }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => { getVideoSuggestions(); }}>
            <Text style={{ fontWeight: '700', color: '#111', fontSize: 15 }}>Continue to Visuals →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 9 — Video Loading =====
  if (step === 9 && videoLoading) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <Text style={{ fontSize: 50 }}>🎬</Text>
      <Text style={{ fontWeight: '800', fontSize: 22, color: C.text }}>Videos dhundh raha hai...</Text>
      <Text style={{ fontSize: 14, color: C.text2, textAlign: 'center', paddingHorizontal: 40 }}>Claude script padh ke best keywords choose kar raha hai</Text>
      <ActivityIndicator size="large" color={C.accent} style={{ marginTop: 10 }} />
    </View>
  );

  // ===== STEP 9 — Video Section Selection =====
  if (step === 9 && !videoLoading && videoSections.length > 0) {
    const currentSec = videoSections[currentVideoSection];
    const isLastSection = currentVideoSection === videoSections.length - 1;

    return (
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
        <StepDots />

        {/* Section Header */}
        <View style={{ padding: 20, paddingTop: 0 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 4 }}>
            STEP 9 — VISUALS · Section {currentVideoSection + 1} of {videoSections.length}
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 }}>
            {currentSec?.label} 🎬
          </Text>
          <Text style={{ fontSize: 13, color: C.text2, marginBottom: 4 }}>
            Suggested clips: {currentSec?.clips_needed} · Keywords: {currentSec?.keywords?.join(', ')}
          </Text>
          <Text style={{ fontSize: 11, color: C.text3, marginBottom: 16 }}>
            Mood: {currentSec?.mood}
          </Text>

          {/* Section Progress */}
          <View style={{ flexDirection: 'row', gap: 4, marginBottom: 20 }}>
            {videoSections.map((sec, i) => (
              <View key={i} style={{ flex: 1, height: 4, borderRadius: 100, backgroundColor: i < currentVideoSection ? C.success : i === currentVideoSection ? C.accent : C.border }} />
            ))}
          </View>

          {/* Duration Filter */}
          <Text style={{ fontSize: 12, fontWeight: '600', color: C.text2, marginBottom: 8 }}>Duration Filter:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ gap: 8 }}>
            {durationFilters.map(f => (
              <TouchableOpacity key={f} onPress={() => setDurationFilter(f)}
                style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100, borderWidth: 1.5, borderColor: durationFilter === f ? C.accent : C.border, backgroundColor: durationFilter === f ? C.accent + '15' : C.surface }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: durationFilter === f ? C.accent : C.text2 }}>{durationLabels[f]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Clips Grid */}
          {currentSec?.clips?.length === 0 ? (
            <View style={{ alignItems: 'center', padding: 30, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 16 }}>
              <Text style={{ fontSize: 30, marginBottom: 10 }}>🔍</Text>
              <Text style={{ color: C.text2, fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
                {pexelsKey || pixabayKey ? 'Searching videos...' : 'Add Pexels or Pixabay API key to search real videos'}
              </Text>
              <TouchableOpacity style={{ backgroundColor: C.accent, borderRadius: 12, padding: 12, paddingHorizontal: 20 }}
                onPress={() => searchVideos(currentSec?.keywords?.[0] || idea).then(clips => {
                  setVideoSections(prev => prev.map((s, i) => i === currentVideoSection ? { ...s, clips } : s));
                })}>
                <Text style={{ color: '#111', fontWeight: '700' }}>🔍 Search Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              {currentSec?.clips?.map((clip, ci) => {
                const isSelected = currentSec.selectedClips?.includes(clip.id);
                return (
                  <View key={clip.id} style={{ width: '47%', borderWidth: 2, borderColor: isSelected ? C.success : C.border, borderRadius: 14, overflow: 'hidden', backgroundColor: C.surface }}>
                    <TouchableOpacity onPress={() => clip.url && setPreviewVideo(clip.url)}>
                      <View style={{ height: 100, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {clip.thumbnail ? (
                          <Image source={{ uri: clip.thumbnail }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                        ) : (
                          <Text style={{ fontSize: 36 }}>🎬</Text>
                        )}
                        {clip.url && (
                          <View style={{ position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16 }}>▶️</Text>
                          </View>
                        )}
                        <View style={{ position: 'absolute', bottom: 4, right: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 10, color: '#fff' }}>{clip.duration}</Text>
                        </View>
                        <View style={{ position: 'absolute', top: 4, left: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 9, color: '#fff' }}>{clip.source}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View style={{ padding: 8 }}>
                      <Text style={{ fontSize: 10, color: C.text3, marginBottom: 6 }} numberOfLines={1}>{clip.label}</Text>
                      <TouchableOpacity onPress={() => toggleClip(currentVideoSection, clip.id)}
                        style={{ padding: 7, borderRadius: 8, backgroundColor: isSelected ? C.success + '20' : C.surface2, borderWidth: 1, borderColor: isSelected ? C.success : C.border, alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: isSelected ? C.success : C.text2, fontWeight: '600' }}>
                          {isSelected ? '✅ Selected' : 'Select'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Search new clips */}
          <TouchableOpacity style={[secondaryBtn, { marginBottom: 8 }]}
            onPress={() => searchVideos(currentSec?.keywords?.[0] || idea).then(clips => {
              setVideoSections(prev => prev.map((s, i) => i === currentVideoSection ? { ...s, clips } : s));
            })}>
            <Text style={{ color: C.text2 }}>🔍 Search New Clips</Text>
          </TouchableOpacity>

          {/* Navigation */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <TouchableOpacity style={[secondaryBtn, { flex: 1 }]}
              onPress={() => currentVideoSection > 0 ? setCurrentVideoSection(prev => prev - 1) : setStep(8)}>
              <Text style={{ color: C.text, fontWeight: '600' }}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[primaryBtn, { flex: 2 }]}
              onPress={() => {
                if (isLastSection) {
                  generateSubtitles();
                  setStep(10);
                } else {
                  setCurrentVideoSection(prev => prev + 1);
                }
              }}>
              <Text style={{ fontWeight: '700', color: '#111', fontSize: 15 }}>
                {isLastSection ? 'Continue to Subtitles →' : `Next: ${videoSections[currentVideoSection + 1]?.label} →`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Preview Modal */}
        <Modal visible={!!previewVideo} transparent animationType="fade" onRequestClose={() => setPreviewVideo(null)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => setPreviewVideo(null)}
              style={{ position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
            {previewVideo && (
              <Video
                source={{ uri: previewVideo }}
                style={{ width: 360, height: 240, borderRadius: 12 }}
                useNativeControls
                resizeMode="contain"
                shouldPlay
              />
            )}
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 16 }}>Tap ✕ to close</Text>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  // ===== STEP 10 — Subtitles =====
  if (step === 10) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 10 — SUBTITLES</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 16 }}>Subtitles 📝</Text>

        {subLoading ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <ActivityIndicator size="large" color={C.accent} />
            <Text style={{ color: C.text2, fontSize: 14, marginTop: 16 }}>Subtitles generate ho rahe hain...</Text>
          </View>
        ) : (
          <>
            {subtitleLines.length === 0 ? (
              <TouchableOpacity style={primaryBtn} onPress={generateSubtitles}>
                <Text style={{ fontWeight: '700', color: '#111' }}>🎙️ Generate Subtitles</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 12, overflow: 'hidden' }}>
                  {subtitleLines.map((line, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: i < subtitleLines.length - 1 ? 1 : 0, borderColor: C.border }}>
                      <Text style={{ fontSize: 10, color: C.accent, fontWeight: '600', minWidth: 80, marginTop: 3, fontFamily: 'monospace' }}>{line.start.substring(0, 8)}</Text>
                      <TextInput value={line.text}
                        onChangeText={val => setSubtitleLines(prev => prev.map((l, idx) => idx === i ? { ...l, text: val } : l))}
                        style={{ flex: 1, fontSize: 13, color: C.text, lineHeight: 20 }} />
                    </View>
                  ))}
                </View>

                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                  <TouchableOpacity style={[secondaryBtn, { flex: 1, marginTop: 0 }]} onPress={generateSubtitles}>
                    <Text style={{ color: C.text2, fontSize: 13 }}>🔄 Regenerate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, backgroundColor: C.info + '20', borderRadius: 14, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: C.info + '44' }} onPress={saveSRTFile}>
                    <Text style={{ color: C.info, fontWeight: '600', fontSize: 13 }}>💾 Save .srt</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(9)}><Text style={{ color: C.text, fontWeight: '600' }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => setStep(11)}>
            <Text style={{ fontWeight: '700', color: '#111', fontSize: 15 }}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // ===== STEP 11 — Ready Checklist =====
  if (step === 11) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 11 — READY CHECKLIST</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 }}>Almost done! 🎬</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 20 }}>Sab kuch check karo pehle upload se</Text>

        <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 24, overflow: 'hidden' }}>
          {[
            { label: 'Script', done: script.length > 0, sub: script.length + ' sections written', step: 6 },
            { label: 'Title', done: !!selectedTitle, sub: selectedTitle?.substring(0, 40) || 'Not selected', step: 7 },
            { label: 'Description', done: !!description, sub: description ? 'Added (' + description.length + ' chars)' : 'Not added', step: 8 },
            { label: 'Tags', done: tags.length > 0, sub: tags.length + ' tags added', step: 8 },
            { label: 'Video Clips', done: videoSections.some(s => s.selectedClips?.length > 0), sub: videoSections.reduce((acc, s) => acc + (s.selectedClips?.length || 0), 0) + ' clips selected', step: 9 },
            { label: 'Subtitles', done: subtitleLines.length > 0, sub: subtitleLines.length + ' lines generated', step: 10 },
          ].map((item, i, arr) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: item.done ? C.success + '20' : C.surface2, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 16 }}>{item.done ? '✅' : '⏳'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{item.label}</Text>
                <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }} numberOfLines={1}>{item.sub}</Text>
              </View>
              <TouchableOpacity onPress={() => setStep(item.step)}
                style={{ backgroundColor: C.surface2, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: C.border }}>
                <Text style={{ fontSize: 12, color: C.text2, fontWeight: '600' }}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={{ backgroundColor: C.accent, borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 10, shadowColor: C.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
          onPress={() => {
            addVideo({
              title: selectedTitle || idea,
              pillar,
              type: videoType,
              status: 'ready',
              description,
              tags,
            });
            Alert.alert('🎬', 'Video marked as Ready to Upload!\n\nLibrary mein dekho.');
            // Reset everything
            setStep(1); setIdea(''); setVideoType(''); setPillar(''); setEmotions({});
            setScript([]); setSelectedTitle(''); setDescription('');
            setTags(['#personalfinance', '#paisa', '#middleclass', '#kahanipaisonki', '#hindishorts', '#moneypsychology']);
            setVideoSections([]); setCurrentVideoSection(0); setSubtitleLines([]);
          }}>
          <Text style={{ fontWeight: '800', fontSize: 17, color: '#111' }}>🚀 Mark as Ready to Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: C.surface, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: C.border }}
          onPress={() => setStep(1)}>
          <Text style={{ color: C.text2, fontWeight: '600' }}>Start New Video</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return null;
}