/* eslint-disable */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useApp } from '../context/AppContext';

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

const demoClips = [
  { id: 0, icon: '💰', label: 'Money stress', duration: '8s', approved: true, thumbnail: null },
  { id: 1, icon: '🧠', label: 'Thinking man', duration: '12s', approved: true, thumbnail: null },
  { id: 2, icon: '📊', label: 'Finance chart', duration: '6s', approved: true, thumbnail: null },
  { id: 3, icon: '💸', label: 'Cash flow', duration: '15s', approved: true, thumbnail: null },
  { id: 4, icon: '🏙️', label: 'City life', duration: '20s', approved: true, thumbnail: null },
  { id: 5, icon: '📱', label: 'Phone scroll', duration: '5s', approved: true, thumbnail: null },
  { id: 6, icon: '🤔', label: 'Decision maker', duration: '10s', approved: true, thumbnail: null },
  { id: 7, icon: '💼', label: 'Business walk', duration: '18s', approved: true, thumbnail: null },
];

export default function NewVideoScreen() {
  const { C, addVideo, apiKeys } = useApp();
  const [step, setStep] = useState(1);
  const [idea, setIdea] = useState('');
  const [videoType, setVideoType] = useState('');
  const [duration, setDuration] = useState('75');
  const [pillar, setPillar] = useState('');
  const [emotions, setEmotions] = useState({});
  const [script, setScript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState([...demoTitles]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['#personalfinance', '#paisa', '#middleclass', '#kahanipaisonki', '#hindishorts', '#moneypsychology']);
  const [newTag, setNewTag] = useState('');
  const [clips, setClips] = useState([...demoClips]);
  const [durationFilter, setDurationFilter] = useState('any');
  const [subtitleLines, setSubtitleLines] = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  const sections = videoType === 'short' ? shortSections : longSections;
  const claudeKey = apiKeys.find(k => k.service.toLowerCase().includes('claude'))?.key;
  const pexelsKey = apiKeys.find(k => k.service.toLowerCase().includes('pexels'))?.key;

  const primaryBtn = { backgroundColor: C.accent, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 };
  const secondaryBtn = { backgroundColor: C.surface2, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: C.border };

  const StepDots = () => (
    <View style={{ flexDirection: 'row', gap: 3, padding: 16, paddingTop: 56, flexWrap: 'wrap' }}>
      {Array.from({ length: 11 }, (_, i) => i + 1).map(i => (
        <View key={i} style={{ height: 5, width: step === i ? 18 : 5, borderRadius: 100, backgroundColor: i < step ? '#40c070' : i === step ? C.accent : C.border }} />
      ))}
    </View>
  );

  async function generateScript() {
    setLoading(true);
    setStep(5);
    if (claudeKey) {
      try {
        const emotionDesc = sections.map(s => `${s.label}: ${emotions[s.id] || 'Curiosity'}`).join(', ');
        const prompt = `You are a Hinglish YouTube finance script writer for "Kahani Paison Ki". Topic: ${idea}. Pillar: ${pillar}. Format: ${videoType === 'short' ? 'Short 75s' : 'Long 10min'}. Emotions: ${emotionDesc}. Write script sections in Hinglish. Return JSON only no extra text: {"sections":[{"id":"hook","text":"..."},{"id":"openloop","text":"..."},{"id":"progress","text":"..."},{"id":"tension","text":"..."},{"id":"payoff","text":"..."},{"id":"endline","text":"..."}]}`;
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': claudeKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
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
    setLoading(false);
    setStep(6);
  }

  async function generateTitles(key) {
    if (!key) { setTitles(demoTitles); return; }
    try {
      const prompt = `Generate 5 clickable YouTube title options in Hinglish for topic: "${idea}". Pillar: ${pillar}. Titles should be curiosity-based, simple, trending style. Return JSON only: {"titles":["title1","title2","title3","title4","title5"]}`;
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

  async function generateDescription(key) {
    const defaultDesc = `${idea}\n\nIs video mein hum dekhenge:\n✅ Asli reason kyun aisa hota hai\n✅ Simple system jo kaam karta hai\n✅ Ek rule jo life badal dega\n\nChannel subscribe karo aur notification on karo!\n\n${tags.join(' ')}`;
    if (!key) { setDescription(defaultDesc); return; }
    try {
      const prompt = `Write a YouTube description in Hinglish for video titled "${selectedTitle}" about "${idea}". Include 3 bullet points of what viewer will learn. End with subscribe CTA. Keep it under 150 words. Return plain text only.`;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 300, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      setDescription(data.content[0].text);
    } catch { setDescription(defaultDesc); }
  }

  async function searchPexelsClips() {
    if (!pexelsKey) { setClips(demoClips); return; }
    try {
      const query = idea.split(' ').slice(0, 3).join('+');
      const res = await fetch(`https://api.pexels.com/videos/search?query=${query}&per_page=8`, {
        headers: { Authorization: pexelsKey }
      });
      const data = await res.json();
      if (data.videos && data.videos.length > 0) {
        const mapped = data.videos.map((v, i) => ({
          id: i,
          icon: '🎬',
          label: v.user.name,
          duration: v.duration + 's',
          approved: true,
          thumbnail: v.image,
          url: v.video_files[0]?.link
        }));
        setClips(mapped);
      } else {
        setClips(demoClips);
      }
    } catch (e) {
      setClips(demoClips);
    }
  }

  async function generateSubtitles() {
    setSubLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    const lines = [
      { t: '00:00', text: script[0]?.text?.split('\n')[0] || 'Same duniya…' },
      { t: '00:03', text: script[0]?.text?.split('\n')[1] || 'par results different kyun?' },
      { t: '00:06', text: script[1]?.text?.split('\n')[0] || 'Asli reason abhi baaki hai…' },
      { t: '00:10', text: script[1]?.text?.split('\n')[1] || 'Jo cheez koi nahi batata…' },
      { t: '00:14', text: script[2]?.text?.split('\n')[0] || 'Middle class price dekhta hai…' },
      { t: '00:18', text: script[2]?.text?.split('\n')[1] || 'Rich log value dekhte hain…' },
      { t: '00:22', text: script[3]?.text?.split('\n')[0] || 'Ab tak jo dekha — wo surface tha.' },
      { t: '00:27', text: script[4]?.text?.split('\n')[0] || 'Woh hai aapka decision system.' },
      { t: '00:31', text: script[5]?.text?.split('\n')[0] || 'Jab tak ye nahi badlega…' },
      { t: '00:34', text: 'result nahi badlega.' },
    ];
    setSubtitleLines(lines);
    setSubLoading(false);
  }

  const durationFilters = ['any', 'under10', '10-30', '30-60', '1-3min', '3min+'];
  const durationLabels = { any: '⏱️ Any', under10: 'Under 10s', '10-30': '10–30s', '30-60': '30–60s', '1-3min': '1–3 min', '3min+': '3 min+' };

  // STEP 1 — Idea
  if (step === 1) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 1 — YOUR IDEA</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 }}>Kya idea hai? 💡</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>Works offline — type and save anytime</Text>
        <View style={{ backgroundColor: C.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 16 }}>
          <TextInput multiline value={idea} onChangeText={setIdea} placeholder="Apna idea likhein..." placeholderTextColor={C.text3} style={{ color: C.text, fontSize: 15, minHeight: 80, lineHeight: 22 }} />
          <Text style={{ fontSize: 11, color: C.text3, marginTop: 8 }}>💾 Auto-saved locally</Text>
        </View>
        <TouchableOpacity style={primaryBtn} onPress={() => { if (!idea.trim()) { Alert.alert('⚠️', 'Pehle idea likhein'); return; } setStep(2); }}>
          <Text style={{ fontWeight: '700', color: '#111' }}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // STEP 2 — Type
  if (step === 2) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 2 — VIDEO TYPE</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 }}>Kaunsa format? 📱</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          {[['short', '📱', 'SHORT', '30 – 90 sec'], ['long', '🎬', 'LONG', '5 – 15 min']].map(([type, icon, lbl, sl]) => (
            <TouchableOpacity key={type} onPress={() => setVideoType(type)} style={{ flex: 1, padding: 20, borderRadius: 14, borderWidth: 1.5, borderColor: videoType === type ? C.accent : C.border, backgroundColor: videoType === type ? C.accent + '15' : C.surface2, alignItems: 'center' }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>{icon}</Text>
              <Text style={{ fontWeight: '800', fontSize: 15, color: C.text, marginBottom: 4 }}>{lbl}</Text>
              <Text style={{ fontSize: 11, color: C.text3 }}>{sl}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 8 }}>Duration (seconds):</Text>
        <TextInput keyboardType="numeric" value={duration} onChangeText={setDuration} style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 16 }} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(1)}><Text style={{ color: C.text }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => { if (!videoType) { Alert.alert('⚠️', 'Video type select karo'); return; } setStep(3); }}>
            <Text style={{ fontWeight: '700', color: '#111' }}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // STEP 3 — Pillar
  if (step === 3) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 3 — CONTENT PILLAR</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 }}>Kaunsa pillar? 🏛️</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {pillars.map(p => (
            <TouchableOpacity key={p.name} onPress={() => setPillar(p.name)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 10, borderWidth: 1.5, borderColor: pillar === p.name ? C.accent : C.border, backgroundColor: pillar === p.name ? C.accent + '15' : C.surface2, width: '48%' }}>
              <Text style={{ fontSize: 20 }}>{p.icon}</Text>
              <Text style={{ fontSize: 12, fontWeight: '500', color: pillar === p.name ? C.text : C.text2, flex: 1 }}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(2)}><Text style={{ color: C.text }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => { if (!pillar) { Alert.alert('⚠️', 'Pillar select karo'); return; } setStep(4); }}>
            <Text style={{ fontWeight: '700', color: '#111' }}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // STEP 4 — Emotions
  if (step === 4) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 4 — EMOTION SELECTOR</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 }}>Feel choose karo 🎭</Text>
        {sections.map(sec => (
          <View key={sec.id} style={{ borderWidth: 1, borderColor: C.border, borderRadius: 14, marginBottom: 12, overflow: 'hidden' }}>
            <View style={{ padding: 12, backgroundColor: C.surface2, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '700', color: C.text, fontSize: 13 }}>{sec.label}</Text>
              <Text style={{ fontSize: 11, color: C.text3 }}>{sec.timing}</Text>
            </View>
            <View style={{ padding: 12, backgroundColor: C.surface, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {sec.emojis.map(em => (
                <TouchableOpacity key={em.l} onPress={() => setEmotions(prev => ({ ...prev, [sec.id]: em.l }))} style={{ width: '47%', padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: emotions[sec.id] === em.l ? C.accent : C.border, backgroundColor: emotions[sec.id] === em.l ? C.accent + '15' : C.surface2, alignItems: 'center' }}>
                  <Text style={{ fontSize: 22 }}>{em.e}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: emotions[sec.id] === em.l ? C.accent : C.text2, marginTop: 4 }}>{em.l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(3)}><Text style={{ color: C.text }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={generateScript}>
            <Text style={{ fontWeight: '700', color: '#111' }}>✨ Generate Script</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // STEP 5 — Loading
  if (step === 5) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontSize: 40 }}>✨</Text>
      <Text style={{ fontWeight: '800', fontSize: 20, color: C.text }}>Generating Script...</Text>
      <Text style={{ fontSize: 13, color: C.text2 }}>Claude aapka script likh raha hai</Text>
    </View>
  );

  // STEP 6 — Script
  if (step === 6) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: '800', fontSize: 18, color: C.text }}>Script ✏️</Text>
        <TouchableOpacity onPress={() => setStep(7)} style={{ backgroundColor: '#40c07022', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#40c070' }}>
          <Text style={{ color: '#40c070', fontWeight: '600', fontSize: 13 }}>✅ Approve →</Text>
        </TouchableOpacity>
      </View>
      {script.map((sec, idx) => {
        const info = sections.find(s => s.id === sec.id) || { label: sec.id.toUpperCase(), timing: '' };
        return (
          <View key={sec.id} style={{ borderWidth: 1, borderColor: C.border, borderRadius: 14, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' }}>
            <View style={{ padding: 12, backgroundColor: C.surface2, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontWeight: '700', color: C.text, fontSize: 13 }}>{info.label}</Text>
                {emotions[sec.id] && <Text style={{ fontSize: 10, color: C.accent, marginTop: 2 }}>🎭 {emotions[sec.id]}</Text>}
              </View>
              <Text style={{ fontSize: 11, color: C.text3 }}>{info.timing}</Text>
            </View>
            <View style={{ padding: 14, backgroundColor: C.surface }}>
              <TextInput multiline value={sec.text} onChangeText={val => setScript(prev => prev.map((s, i) => i === idx ? { ...s, text: val } : s))} style={{ color: C.text, fontSize: 14, lineHeight: 22, marginBottom: 12 }} />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={{ flex: 1, padding: 8, borderRadius: 8, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center' }} onPress={() => { if (demoScript[idx]) setScript(prev => prev.map((s, i) => i === idx ? { ...s, text: demoScript[idx].text } : s)); }}>
                  <Text style={{ fontSize: 12, color: C.text2 }}>🔄 Regen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, padding: 8, borderRadius: 8, backgroundColor: '#40c07015', borderWidth: 1, borderColor: '#40c070', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: '#40c070' }}>✅ OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
      <View style={{ padding: 16 }}>
        <TouchableOpacity style={{ backgroundColor: C.surface2, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border, marginBottom: 8 }} onPress={() => setScript(demoScript)}>
          <Text style={{ color: C.text2 }}>🔄 Regenerate Full Script</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: C.accent, borderRadius: 12, padding: 14, alignItems: 'center' }} onPress={() => setStep(7)}>
          <Text style={{ fontWeight: '700', color: '#111' }}>Continue to Titles →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // STEP 7 — Titles
  if (step === 7) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 7 — TITLE</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 }}>Kaunsa title? 🏷️</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>Ek choose karo — fir edit bhi kar sakte ho</Text>
        {titles.map((t, i) => (
          <TouchableOpacity key={i} onPress={() => setSelectedTitle(t)} style={{ padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: selectedTitle === t ? C.accent : C.border, backgroundColor: selectedTitle === t ? C.accent + '15' : C.surface, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 11, color: C.text3, fontWeight: '600', minWidth: 20 }}>{i + 1}</Text>
            <Text style={{ flex: 1, fontSize: 14, color: C.text }}>{t}</Text>
          </TouchableOpacity>
        ))}
        <Text style={{ fontSize: 12, color: C.text3, marginTop: 8, marginBottom: 6 }}>Ya apna title likhein:</Text>
        <TextInput value={selectedTitle} onChangeText={setSelectedTitle} placeholder="Apna title type karo..." placeholderTextColor={C.text3} style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 12 }} />
        <TouchableOpacity style={[secondaryBtn, { marginBottom: 8 }]} onPress={() => generateTitles(claudeKey)}>
          <Text style={{ color: C.text2 }}>🔄 Generate 5 More</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(6)}><Text style={{ color: C.text }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => {
            if (!selectedTitle) { Alert.alert('⚠️', 'Pehle title choose karo'); return; }
            generateDescription(claudeKey);
            setStep(8);
          }}>
            <Text style={{ fontWeight: '700', color: '#111' }}>✅ Approve →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // STEP 8 — Description + Tags
  if (step === 8) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 8 — DESCRIPTION + TAGS</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 16 }}>Description 📄</Text>
        <TextInput multiline value={description} onChangeText={setDescription} placeholder="Description loading..." placeholderTextColor={C.text3} style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, minHeight: 120, marginBottom: 8, lineHeight: 20 }} />
        <TouchableOpacity style={[secondaryBtn, { marginBottom: 20 }]} onPress={() => generateDescription(claudeKey)}>
          <Text style={{ color: C.text2 }}>🔄 Regenerate Description</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 12 }}>Tags 🏷️</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {tags.map((tag, i) => (
            <TouchableOpacity key={i} onPress={() => setTags(prev => prev.filter((_, idx) => idx !== i))} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: C.surface2, borderRadius: 100, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 12, color: C.text2 }}>{tag}</Text>
              <Text style={{ fontSize: 12, color: '#e04040' }}>✕</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          <TextInput value={newTag} onChangeText={setNewTag} placeholder="#newtag" placeholderTextColor={C.text3} style={{ flex: 1, backgroundColor: C.surface2, borderRadius: 10, padding: 10, color: C.text, borderWidth: 1, borderColor: C.border }} />
          <TouchableOpacity onPress={() => { if (newTag.trim()) { setTags(prev => [...prev, newTag.startsWith('#') ? newTag : '#' + newTag]); setNewTag(''); } }} style={{ backgroundColor: C.accent, borderRadius: 10, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#111', fontWeight: '700' }}>+ Add</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(7)}><Text style={{ color: C.text }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => { searchPexelsClips(); setStep(9); }}>
            <Text style={{ fontWeight: '700', color: '#111' }}>Continue to Visuals →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // STEP 9 — Visuals
  if (step === 9) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 9 — VISUALS</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 }}>Video Clips 🎬</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 12 }}>
          Video: {duration}s · Clips needed: {Math.floor(parseInt(duration) / 3)}–{Math.floor(parseInt(duration) / 2)}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: C.text2, marginBottom: 8 }}>Duration Filter:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ gap: 8 }}>
          {durationFilters.map(f => (
            <TouchableOpacity key={f} onPress={() => setDurationFilter(f)} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100, borderWidth: 1.5, borderColor: durationFilter === f ? C.accent : C.border, backgroundColor: durationFilter === f ? C.accent + '15' : C.surface2 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: durationFilter === f ? C.accent : C.text2 }}>{durationLabels[f]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          {clips.map((clip, i) => (
            <View key={i} style={{ width: '47%', borderWidth: 1, borderColor: clip.approved ? '#40c070' : C.border, borderRadius: 12, overflow: 'hidden', backgroundColor: C.surface }}>
              <View style={{ height: 90, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {clip.thumbnail ? (
                  <Image source={{ uri: clip.thumbnail }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                ) : (
                  <Text style={{ fontSize: 30 }}>{clip.icon}</Text>
                )}
                <Text style={{ position: 'absolute', bottom: 4, right: 6, fontSize: 10, color: '#fff', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 4, borderRadius: 4 }}>{clip.duration}</Text>
              </View>
              <View style={{ padding: 8 }}>
                <Text style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>clip-{String(i + 1).padStart(2, '0')} · {clip.label}</Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <TouchableOpacity onPress={() => setClips(prev => prev.map((c, idx) => idx === i ? { ...c, approved: !c.approved } : c))} style={{ flex: 1, padding: 5, borderRadius: 6, backgroundColor: clip.approved ? '#40c07015' : C.surface2, borderWidth: 1, borderColor: clip.approved ? '#40c070' : C.border, alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, color: clip.approved ? '#40c070' : C.text2 }}>{clip.approved ? '✅' : 'Keep'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Alert.alert('🔄', 'Swapping clip...')} style={{ flex: 1, padding: 5, borderRadius: 6, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, color: C.text2 }}>🔄</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
        <TouchableOpacity style={[secondaryBtn, { marginBottom: 8 }]} onPress={() => searchPexelsClips()}>
          <Text style={{ color: C.text2 }}>🔍 Search New Clips</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(8)}><Text style={{ color: C.text }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => { generateSubtitles(); setStep(10); }}>
            <Text style={{ fontWeight: '700', color: '#111' }}>Continue to Subtitles →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // STEP 10 — Subtitles
  if (step === 10) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 10 — SUBTITLES</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 16 }}>Subtitles 📝</Text>
        {subLoading ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 30, marginBottom: 12 }}>🎙️</Text>
            <Text style={{ color: C.text2, fontSize: 14 }}>Generating subtitles...</Text>
          </View>
        ) : (
          <>
            {subtitleLines.map((line, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderColor: C.border }}>
                <Text style={{ fontSize: 11, color: C.accent, fontWeight: '600', minWidth: 55 }}>[{line.t}]</Text>
                <TextInput value={line.text} onChangeText={val => setSubtitleLines(prev => prev.map((l, idx) => idx === i ? { ...l, text: val } : l))} style={{ flex: 1, fontSize: 13, color: C.text, lineHeight: 20 }} />
              </View>
            ))}
            <TouchableOpacity style={[secondaryBtn, { marginTop: 12, marginBottom: 8 }]} onPress={generateSubtitles}>
              <Text style={{ color: C.text2 }}>🔄 Regenerate Subtitles</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity style={[secondaryBtn, { flex: 1 }]} onPress={() => setStep(9)}><Text style={{ color: C.text }}>← Back</Text></TouchableOpacity>
          <TouchableOpacity style={[primaryBtn, { flex: 2 }]} onPress={() => setStep(11)}>
            <Text style={{ fontWeight: '700', color: '#111' }}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // STEP 11 — Ready Checklist
  if (step === 11) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 11 — READY CHECKLIST</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 }}>Almost done! ✅</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>Sab kuch check karo pehle</Text>
        <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 20 }}>
          {[
            { label: 'Script', done: script.length > 0, sub: script.length + ' sections', step: 6 },
            { label: 'Title', done: !!selectedTitle, sub: selectedTitle?.substring(0, 35) + '...', step: 7 },
            { label: 'Description', done: !!description, sub: description ? 'Added' : 'Not added', step: 8 },
            { label: 'Tags', done: tags.length > 0, sub: tags.length + ' tags', step: 8 },
            { label: 'Video Clips', done: clips.filter(c => c.approved).length > 0, sub: clips.filter(c => c.approved).length + ' clips approved', step: 9 },
            { label: 'Subtitles', done: subtitleLines.length > 0, sub: subtitleLines.length + ' lines', step: 10 },
          ].map((item, i, arr) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: item.done ? '#40c07020' : C.surface2, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 14 }}>{item.done ? '✅' : '⏳'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: C.text }}>{item.label}</Text>
                <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{item.sub}</Text>
              </View>
              <TouchableOpacity onPress={() => setStep(item.step)} style={{ backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: C.border }}>
                <Text style={{ fontSize: 12, color: C.text2 }}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={{ backgroundColor: C.accent, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 10 }}
          onPress={() => {
            addVideo({ title: selectedTitle || idea, pillar, type: videoType, status: 'ready' });
            Alert.alert('🎬', 'Video marked as Ready to Upload!');
            setStep(1);
            setIdea(''); setVideoType(''); setPillar(''); setEmotions({});
            setScript([]); setSelectedTitle(''); setDescription('');
            setTags(['#personalfinance', '#paisa', '#middleclass', '#kahanipaisonki', '#hindishorts', '#moneypsychology']);
            setClips([...demoClips]); setSubtitleLines([]);
          }}>
          <Text style={{ fontWeight: '700', fontSize: 16, color: '#111' }}>🚀 Mark as Ready to Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: C.surface2, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border }} onPress={() => setStep(1)}>
          <Text style={{ color: C.text2 }}>Start New Video</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return null;
}