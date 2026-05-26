import { useState } from 'react';
import { Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

export default function SettingsScreen() {
  const { C, theme, toggleTheme, language, setLanguage, apiKeys, addApiKey, removeApiKey } = useApp();
  const [newService, setNewService] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [showAddKey, setShowAddKey] = useState(false);

  const sectionLabel = (txt) => (
    <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 12, marginTop: 4 }}>{txt}</Text>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
      <Text style={{ fontWeight: '800', fontSize: 20, color: C.text, marginBottom: 20 }}>Settings ⚙️</Text>

      {/* APPEARANCE */}
      {sectionLabel('APPEARANCE')}
      <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: C.border }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>Dark Mode</Text>
            <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>Switch between dark and light</Text>
          </View>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} trackColor={{ false: C.border, true: C.accent }} thumbColor="#fff" />
        </View>
      </View>

      {/* LANGUAGE */}
      {sectionLabel('APP LANGUAGE')}
      <Text style={{ fontSize: 12, color: C.text2, marginBottom: 10 }}>Script generation language</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {languages.map(lang => (
          <TouchableOpacity key={lang.code} onPress={() => { setLanguage(lang.code); Alert.alert('✅', lang.label + ' selected'); }}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100, borderWidth: 1.5, borderColor: language === lang.code ? C.accent : C.border, backgroundColor: language === lang.code ? C.accent + '15' : C.surface2 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: language === lang.code ? C.accent : C.text2 }}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* API KEYS */}
      {sectionLabel('API KEYS')}
      {apiKeys.length === 0 && (
        <View style={{ padding: 16, backgroundColor: C.surface2, borderRadius: 10, borderWidth: 1, borderColor: C.border, marginBottom: 12, alignItems: 'center' }}>
          <Text style={{ color: C.text3, fontSize: 13 }}>No API keys added yet</Text>
        </View>
      )}
      {apiKeys.map(k => (
        <View key={k.id} style={{ backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: C.text, fontSize: 14 }}>{k.service}</Text>
              {k.purpose ? <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{k.purpose}</Text> : null}
              <Text style={{ fontSize: 11, color: C.text2, marginTop: 6, fontFamily: 'monospace' }}>{k.key.substring(0, 8)}{'*'.repeat(12)}</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Delete?', 'Remove ' + k.service + ' API key?', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: () => removeApiKey(k.id) }])}
              style={{ backgroundColor: '#e0404022', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#e0404033' }}>
              <Text style={{ color: '#e04040', fontSize: 12 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {showAddKey ? (
        <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.accent + '44', padding: 16, marginBottom: 12 }}>
          <Text style={{ fontWeight: '700', color: C.text, fontSize: 14, marginBottom: 12 }}>Add New API Key</Text>
          <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>Service / Website name</Text>
          <TextInput value={newService} onChangeText={setNewService} placeholder="e.g. Claude, Pexels, Pixabay..."
            placeholderTextColor={C.text3} style={{ backgroundColor: C.surface2, borderRadius: 8, padding: 10, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 12 }} />
          <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>API Key</Text>
          <TextInput value={newKey} onChangeText={setNewKey} placeholder="Paste your API key here..."
            placeholderTextColor={C.text3} style={{ backgroundColor: C.surface2, borderRadius: 8, padding: 10, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 12 }} />
          <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>Purpose (optional)</Text>
          <TextInput value={newPurpose} onChangeText={setNewPurpose} placeholder="e.g. Script generation, Stock videos..."
            placeholderTextColor={C.text3} style={{ backgroundColor: C.surface2, borderRadius: 8, padding: 10, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 16 }} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => setShowAddKey(false)}
              style={{ flex: 1, backgroundColor: C.surface2, borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
              <Text style={{ color: C.text2 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (!newService.trim() || !newKey.trim()) { Alert.alert('⚠️', 'Service name aur API key required'); return; }
              addApiKey({ id: Date.now(), service: newService.trim(), key: newKey.trim(), purpose: newPurpose.trim() });
              setNewService(''); setNewKey(''); setNewPurpose(''); setShowAddKey(false);
              Alert.alert('✅', newService + ' API key saved!');
            }} style={{ flex: 2, backgroundColor: C.accent, borderRadius: 10, padding: 12, alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', color: '#111' }}>💾 Save Key</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShowAddKey(true)}
          style={{ backgroundColor: C.surface2, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: C.border, borderStyle: 'dashed', marginBottom: 20 }}>
          <Text style={{ color: C.accent, fontWeight: '600' }}>+ Add New API Key</Text>
        </TouchableOpacity>
      )}

      {/* CHANNEL */}
      {sectionLabel('CHANNEL INFO')}
      <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 20 }}>
        <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>Channel Name</Text>
        <TextInput defaultValue="Kahani Paison Ki" style={{ backgroundColor: C.surface2, borderRadius: 8, padding: 10, color: C.text, borderWidth: 1, borderColor: C.border }} />
      </View>

      <TouchableOpacity onPress={() => Alert.alert('🗑️', 'Cache cleared')}
        style={{ backgroundColor: '#e0404015', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#e0404033' }}>
        <Text style={{ color: '#e04040', fontWeight: '600' }}>🗑️ Clear Cache</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}