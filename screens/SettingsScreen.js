/* eslint-disable */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { useApp } from '../context/AppContext';

const languages = [
  { code: 'hinglish', label: '🇮🇳 Hinglish', desc: 'Hindi + English mix' },
  { code: 'hindi', label: '🔤 Hindi', desc: 'Pure Hindi' },
  { code: 'urdu', label: '🌙 Urdu', desc: 'Roman Urdu' },
  { code: 'english_us', label: '🇺🇸 English (US)', desc: 'American English' },
  { code: 'english_uk', label: '🇬🇧 English (UK)', desc: 'British English' },
  { code: 'punjabi', label: '🌾 Punjabi', desc: 'Punjabi Hinglish' },
  { code: 'bengali', label: '🐟 Bengali', desc: 'Bengali scripts' },
  { code: 'marathi', label: '🏔️ Marathi', desc: 'Marathi scripts' },
  { code: 'gujarati', label: '💎 Gujarati', desc: 'Gujarati scripts' },
  { code: 'tamil', label: '🌴 Tamil', desc: 'Tamil scripts' },
  { code: 'telugu', label: '⭐ Telugu', desc: 'Telugu scripts' },
];

const SERVICE_ICONS = {
  claude: '🤖',
  pexels: '🖼️',
  pixabay: '🎬',
  deepgram: '🎙️',
  openai: '💡',
  whisper: '🎙️',
};

function getServiceIcon(name) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(SERVICE_ICONS)) {
    if (lower.includes(key)) return SERVICE_ICONS[key];
  }
  return '🔑';
}

export default function SettingsScreen() {
  const { C, theme, toggleTheme, language, setLanguage, apiKeys, addApiKey, removeApiKey } = useApp();
  const [newService, setNewService] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [showAddKey, setShowAddKey] = useState(false);
  const [showKey, setShowKey] = useState({});

  const SectionLabel = ({ text }) => (
    <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 12, marginTop: 4 }}>{text}</Text>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 50 }}>

      <Text style={{ fontWeight: '800', fontSize: 22, color: C.text, marginBottom: 24 }}>Settings ⚙️</Text>

      {/* APPEARANCE */}
      <SectionLabel text="APPEARANCE" />
      <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 28, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>Dark Mode</Text>
            <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>Switch between dark and light</Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: C.border, true: C.accent }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* LANGUAGE */}
      <SectionLabel text="APP LANGUAGE" />
      <Text style={{ fontSize: 12, color: C.text2, marginBottom: 12 }}>Script generation language — AI writes in this language</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        {languages.map(lang => (
          <TouchableOpacity key={lang.code} onPress={() => { setLanguage(lang.code); Alert.alert('✅', lang.label + ' set as default language'); }}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100, borderWidth: 1.5, borderColor: language === lang.code ? C.accent : C.border, backgroundColor: language === lang.code ? C.accent + '15' : C.surface }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: language === lang.code ? C.accent : C.text2 }}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* API KEYS */}
      <SectionLabel text="API KEYS" />

      {apiKeys.length === 0 ? (
        <View style={{ padding: 20, backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>🔑</Text>
          <Text style={{ color: C.text2, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>No API keys added yet</Text>
          <Text style={{ color: C.text3, fontSize: 12, textAlign: 'center' }}>Add Claude, Pexels, Pixabay and Deepgram keys to unlock all features</Text>
        </View>
      ) : (
        apiKeys.map(k => (
          <View key={k.id} style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text style={{ fontSize: 18 }}>{getServiceIcon(k.service)}</Text>
                  <Text style={{ fontWeight: '700', color: C.text, fontSize: 15 }}>{k.service}</Text>
                </View>
                {k.purpose ? <Text style={{ fontSize: 11, color: C.text3, marginBottom: 6 }}>{k.purpose}</Text> : null}
                <TouchableOpacity onPress={() => setShowKey(prev => ({ ...prev, [k.id]: !prev[k.id] }))}>
                  <Text style={{ fontSize: 11, color: C.text2, fontFamily: 'monospace' }}>
                    {showKey[k.id] ? k.key : k.key.substring(0, 8) + '••••••••••••'}
                  </Text>
                  <Text style={{ fontSize: 10, color: C.accent, marginTop: 2 }}>{showKey[k.id] ? 'Hide' : 'Tap to reveal'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert('Delete?', 'Remove ' + k.service + ' key?', [
                  { text: 'Cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => removeApiKey(k.id) }
                ])}
                style={{ backgroundColor: '#FF444415', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#FF444430', marginLeft: 10 }}>
                <Text style={{ color: '#FF4444', fontSize: 14 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {showAddKey ? (
        <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1.5, borderColor: C.accent + '44', padding: 16, marginBottom: 12, marginTop: 4 }}>
          <Text style={{ fontWeight: '700', color: C.text, fontSize: 16, marginBottom: 16 }}>➕ Add New API Key</Text>

          <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>Service / Website name *</Text>
          <TextInput value={newService} onChangeText={setNewService}
            placeholder="e.g. Claude, Pexels, Pixabay, Deepgram..."
            placeholderTextColor={C.text3}
            style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 14, fontSize: 14 }} />

          <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>API Key *</Text>
          <TextInput value={newKey} onChangeText={setNewKey}
            placeholder="Paste your API key here..."
            placeholderTextColor={C.text3}
            secureTextEntry={true}
            style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 14, fontSize: 14 }} />

          <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>Purpose (optional)</Text>
          <TextInput value={newPurpose} onChangeText={setNewPurpose}
            placeholder="e.g. Script generation, Stock videos..."
            placeholderTextColor={C.text3}
            style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 16, fontSize: 14 }} />

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => { setShowAddKey(false); setNewService(''); setNewKey(''); setNewPurpose(''); }}
              style={{ flex: 1, backgroundColor: C.surface2, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
              <Text style={{ color: C.text2, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!newService.trim() || !newKey.trim()) { Alert.alert('⚠️', 'Service name aur API key required hai'); return; }
                addApiKey({ id: Date.now(), service: newService.trim(), key: newKey.trim(), purpose: newPurpose.trim() });
                setNewService(''); setNewKey(''); setNewPurpose(''); setShowAddKey(false);
                Alert.alert('✅', newService + ' API key saved!');
              }}
              style={{ flex: 2, backgroundColor: C.accent, borderRadius: 12, padding: 14, alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', color: '#111', fontSize: 15 }}>💾 Save Key</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShowAddKey(true)}
          style={{ backgroundColor: C.surface, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: C.border, borderStyle: 'dashed', marginBottom: 28, marginTop: 4 }}>
          <Text style={{ color: C.accent, fontWeight: '700', fontSize: 14 }}>+ Add New API Key</Text>
          <Text style={{ color: C.text3, fontSize: 11, marginTop: 4 }}>Claude, Pexels, Pixabay, Deepgram, etc.</Text>
        </TouchableOpacity>
      )}

      {/* CHANNEL INFO */}
      <SectionLabel text="CHANNEL INFO" />
      <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 28 }}>
        <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>Channel Name</Text>
        <TextInput defaultValue="Kahani Paison Ki"
          style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14, marginBottom: 14 }} />
        <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>YouTube Handle</Text>
        <TextInput defaultValue="@kahanipaisonki"
          style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14 }} />
      </View>

      {/* DANGER ZONE */}
      <SectionLabel text="DANGER ZONE" />
      <TouchableOpacity
        onPress={() => Alert.alert('Clear Cache?', 'Temporary files delete ho jayenge.', [
          { text: 'Cancel' },
          { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('✅', 'Cache cleared') }
        ])}
        style={{ backgroundColor: '#FF444415', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#FF444430', marginBottom: 10 }}>
        <Text style={{ color: '#FF4444', fontWeight: '600' }}>🗑️ Clear Cache</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}