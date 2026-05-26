/* eslint-disable */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
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
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');

  const sections = videoType === 'short' ? shortSections : longSections;
  const claudeKey = apiKeys.find(k => k.service.toLowerCase().includes('claude'))?.key;

  const primaryBtn = { backgroundColor: C.accent, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 };
  const secondaryBtn = { backgroundColor: C.surface2, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: C.border };

  const StepDots = () => (
    <View style={{ flexDirection: 'row', gap: 4, padding: 16, paddingTop: 56 }}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <View key={i} style={{ height: 6, width: step === i ? 20 : 6, borderRadius: 100, backgroundColor: i < step ? '#40c070' : i === step ? C.accent : C.border }} />
      ))}
    </View>
  );

  async function generateScript() {
    setLoading(true);
    setStep(5);
    if (claudeKey) {
      try {
        const emotionDesc = sections.map(s => `${s.label}: ${emotions[s.id] || 'Curiosity'}`).join(', ');
        const prompt = `You are a Hinglish YouTube finance script writer for "Kahani Paison Ki". Topic: ${idea}. Pillar: ${pillar}. Format: ${videoType === 'short' ? 'Short 75s' : 'Long 10min'}. Emotions: ${emotionDesc}. Write script sections. Return JSON only: {"sections":[{"id":"hook","text":"..."},...]}`;
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': claudeKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
        });
        const data = await res.json();
        const parsed = JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
        setScript(parsed.sections);
      } catch { setScript(demoScript); }
    } else {
      await new Promise(r => setTimeout(r, 2000));
      setScript(demoScript);
    }
    setTitles(demoTitles);
    setLoading(false);
    setStep(6);
  }

  // STEP 1
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

  // STEP 2
  if (step === 2) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 2 — VIDEO TYPE</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 }}>Kaunsa format? 📱</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>Script structure is different for each</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          {[['short', '📱', 'SHORT', '30 – 90 seconds'], ['long', '🎬', 'LONG', '5 – 15 minutes']].map(([type, icon, lbl, sl]) => (
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

  // STEP 3
  if (step === 3) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 3 — CONTENT PILLAR</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 }}>Kaunsa pillar? 🏛️</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>AI style adjusts per pillar</Text>
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

  // STEP 4
  if (step === 4) return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}>
      <StepDots />
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 8 }}>STEP 4 — EMOTION SELECTOR</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 4 }}>Feel choose karo 🎭</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>Har section ke liye emotion tap karo</Text>
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
  if (step === 5 && loading) return (
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
        <TouchableOpacity onPress={() => { addVideo({ title: idea, pillar, type: videoType, status: 'draft' }); Alert.alert('✅', 'Script approved! Saved to library.'); setStep(1); setIdea(''); setVideoType(''); setPillar(''); setEmotions({}); }}
          style={{ backgroundColor: '#40c07022', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#40c070' }}>
          <Text style={{ color: '#40c070', fontWeight: '600', fontSize: 13 }}>✅ Approve</Text>
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
        <TouchableOpacity style={{ backgroundColor: C.surface2, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
          <Text style={{ color: C.text2 }}>🔄 Regenerate Full Script</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return null;
}