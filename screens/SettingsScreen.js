/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { useApp } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sun, Moon, Key, Trash2, Eye, EyeOff, Plus, Check, ChevronRight, Tv2, FolderOpen, AlertCircle, RefreshCw } from 'lucide-react-native';

const languages = [
  { code: 'hinglish', label: 'Hinglish' },
  { code: 'hindi', label: 'Hindi' },
  { code: 'urdu', label: 'Urdu' },
  { code: 'english_us', label: 'English (US)' },
  { code: 'english_uk', label: 'English (UK)' },
  { code: 'punjabi', label: 'Punjabi' },
  { code: 'bengali', label: 'Bengali' },
  { code: 'marathi', label: 'Marathi' },
  { code: 'gujarati', label: 'Gujarati' },
  { code: 'tamil', label: 'Tamil' },
  { code: 'telugu', label: 'Telugu' },
];

const PURPOSE_OPTIONS = [
  { value: 'script', label: 'Script Generation' },
  { value: 'video', label: 'Video Search' },
  { value: 'subtitle', label: 'Subtitle Generation' },
  { value: 'audio', label: 'Voice Generation' },
  { value: 'image', label: 'Image Generation' },
  { value: 'custom', label: 'Custom' },
];

export default function SettingsScreen() {
  const {
    C, theme, toggleTheme, language, setLanguage,
    apiKeys, addApiKey, removeApiKey, updateApiKey,
    detectPurpose, getKeysByPurpose,
    channels, activeChannel, activeChannelId,
    addChannel, updateChannel, deleteChannel, switchChannel,
  } = useApp();

  const [newService, setNewService] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [newPurposeLabel, setNewPurposeLabel] = useState('');
  const [showAddKey, setShowAddKey] = useState(false);
  const [showKey, setShowKey] = useState({});
  const [testingKey, setTestingKey] = useState({});

  // Channel form
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const [channelForm, setChannelForm] = useState({ name: '', handle: '', folderPath: '' });

  function handleServiceChange(text) {
    setNewService(text);
    if (text.trim()) {
      const detected = detectPurpose(text);
      setNewPurpose(detected.purpose);
      setNewPurposeLabel(detected.label);
    }
  }

  async function testKey(k) {
    setTestingKey(prev => ({ ...prev, [k.id]: 'testing' }));
    try {
      if (k.purpose === 'script') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': k.key, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 10, messages: [{ role: 'user', content: 'Hi' }] })
        });
        const data = await res.json();
        if (data.content) {
          setTestingKey(prev => ({ ...prev, [k.id]: 'success' }));
          Alert.alert('Valid', k.service + ' key is working');
        } else {
          setTestingKey(prev => ({ ...prev, [k.id]: 'error' }));
          Alert.alert('Invalid', data.error?.message || 'Key not working');
        }
      } else if (k.purpose === 'video' && k.service.toLowerCase().includes('pexels')) {
        const res = await fetch('https://api.pexels.com/videos/search?query=money&per_page=1', { headers: { Authorization: k.key } });
        const data = await res.json();
        if (data.videos) {
          setTestingKey(prev => ({ ...prev, [k.id]: 'success' }));
          Alert.alert('Valid', 'Pexels key is working');
        } else {
          setTestingKey(prev => ({ ...prev, [k.id]: 'error' }));
          Alert.alert('Invalid', 'Pexels key not working');
        }
      } else if (k.purpose === 'video' && k.service.toLowerCase().includes('pixabay')) {
        const res = await fetch(`https://pixabay.com/api/videos/?key=${k.key}&q=money&per_page=1`);
        const data = await res.json();
        if (data.hits) {
          setTestingKey(prev => ({ ...prev, [k.id]: 'success' }));
          Alert.alert('Valid', 'Pixabay key is working');
        } else {
          setTestingKey(prev => ({ ...prev, [k.id]: 'error' }));
          Alert.alert('Invalid', 'Pixabay key not working');
        }
      } else {
        setTestingKey(prev => ({ ...prev, [k.id]: 'success' }));
        Alert.alert('Saved', 'Auto-test not available for this service');
      }
    } catch (e) {
      setTestingKey(prev => ({ ...prev, [k.id]: 'error' }));
      Alert.alert('Error', e.message);
    }
  }

  const purposeGroups = PURPOSE_OPTIONS.map(opt => ({
    ...opt,
    keys: getKeysByPurpose(opt.value)
  })).filter(g => g.keys.length > 0);

  const Label = ({ text }) => (
    <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, marginBottom: 14, marginTop: 4, textTransform: 'uppercase' }}>{text}</Text>
  );

  function renderKeyCard(k) {
    const testStatus = testingKey[k.id];
    const testColor = testStatus === 'success' ? C.success : testStatus === 'error' ? C.danger : C.text3;

    return (
      <View key={k.id} style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Text style={{ fontWeight: '700', color: C.text, fontSize: 15 }}>{k.service}</Text>
              {k.priority === 1 && (
                <View style={{ backgroundColor: C.accent + '20', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 10, color: C.accent, fontWeight: '700' }}>PRIMARY</Text>
                </View>
              )}
              {k.priority > 1 && (
                <View style={{ backgroundColor: C.accent2 + '20', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 10, color: C.accent2, fontWeight: '700' }}>FALLBACK</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 11, color: C.text3, marginBottom: 8 }}>{k.purposeLabel}</Text>
            <TouchableOpacity onPress={() => setShowKey(prev => ({ ...prev, [k.id]: !prev[k.id] }))}>
              <Text style={{ fontSize: 12, color: C.text2, fontFamily: 'monospace' }}>
                {showKey[k.id] ? k.key : k.key.substring(0, 10) + '••••••••'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert('Delete?', 'Remove ' + k.service + '?', [
              { text: 'Cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => removeApiKey(k.id) }
            ])}
            style={{ padding: 8 }}>
            <Trash2 size={16} color={C.danger} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => testKey(k)}
            disabled={testStatus === 'testing'}
            style={{ flex: 1, backgroundColor: C.surface2, borderRadius: 10, padding: 9, alignItems: 'center', borderWidth: 1, borderColor: C.border, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
            {testStatus === 'testing'
              ? <RefreshCw size={13} color={C.text3} strokeWidth={1.8} />
              : testStatus === 'success'
                ? <Check size={13} color={C.success} strokeWidth={2} />
                : testStatus === 'error'
                  ? <AlertCircle size={13} color={C.danger} strokeWidth={1.8} />
                  : <Key size={13} color={C.text3} strokeWidth={1.8} />}
            <Text style={{ fontSize: 12, color: testStatus === 'success' ? C.success : testStatus === 'error' ? C.danger : C.text2, fontWeight: '600' }}>
              {testStatus === 'testing' ? 'Testing...' : 'Test Key'}
            </Text>
          </TouchableOpacity>

          {getKeysByPurpose(k.purpose).length > 1 && (
            <TouchableOpacity
              onPress={() => {
                const sameKeys = getKeysByPurpose(k.purpose);
                sameKeys.forEach((sk, i) => updateApiKey(sk.id, { priority: sk.id === k.id ? 1 : i + 2 }));
                Alert.alert('Done', k.service + ' set as primary');
              }}
              style={{ flex: 1, backgroundColor: k.priority === 1 ? C.accent + '20' : C.surface2, borderRadius: 10, padding: 9, alignItems: 'center', borderWidth: 1, borderColor: k.priority === 1 ? C.accent + '40' : C.border }}>
              <Text style={{ fontSize: 12, color: k.priority === 1 ? C.accent : C.text2, fontWeight: '600' }}>
                {k.priority === 1 ? 'Primary' : 'Set Primary'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 60 }}>

      <Text style={{ fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 28, letterSpacing: -0.5 }}>Settings</Text>

      {/* APPEARANCE */}
      <Label text="Appearance" />
      <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 28, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {theme === 'dark' ? <Moon size={16} color={C.accent} strokeWidth={1.8} /> : <Sun size={16} color={C.warning} strokeWidth={1.8} />}
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>Dark Mode</Text>
              <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{theme === 'dark' ? 'Currently dark' : 'Currently light'}</Text>
            </View>
          </View>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} trackColor={{ false: C.border, true: C.accent }} thumbColor="#fff" />
        </View>
      </View>

      {/* LANGUAGE */}
      <Label text="Script Language" />
      <Text style={{ fontSize: 12, color: C.text2, marginBottom: 12 }}>AI writes scripts and subtitles in this language</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        {languages.map(lang => (
          <TouchableOpacity key={lang.code}
            onPress={() => setLanguage(lang.code)}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100, borderWidth: 1.5, borderColor: language === lang.code ? C.accent : C.border, backgroundColor: language === lang.code ? C.accent + '15' : C.surface }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: language === lang.code ? C.accent : C.text2 }}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CHANNELS */}
      <Label text="Channels" />
      <View style={{ marginBottom: 28 }}>
        {channels.map(ch => (
          <View key={ch.id} style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: ch.id === activeChannelId ? C.accent + '50' : C.border, padding: 16, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: ch.id === activeChannelId ? 12 : 0 }}>
              <Tv2 size={16} color={ch.id === activeChannelId ? C.accent : C.text3} strokeWidth={1.8} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{ch.name}</Text>
                <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{ch.handle}</Text>
              </View>
              {ch.id === activeChannelId && (
                <View style={{ backgroundColor: C.accent + '20', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 10, color: C.accent, fontWeight: '700' }}>ACTIVE</Text>
                </View>
              )}
            </View>

            {editingChannel === ch.id ? (
              <View style={{ gap: 8 }}>
                <TextInput
                  value={channelForm.name}
                  onChangeText={v => setChannelForm(p => ({ ...p, name: v }))}
                  placeholder="Channel name"
                  placeholderTextColor={C.text3}
                  style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14 }} />
                <TextInput
                  value={channelForm.handle}
                  onChangeText={v => setChannelForm(p => ({ ...p, handle: v }))}
                  placeholder="@handle"
                  placeholderTextColor={C.text3}
                  style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14 }} />
                <TextInput
                  value={channelForm.folderPath}
                  onChangeText={v => setChannelForm(p => ({ ...p, folderPath: v }))}
                  placeholder="Folder name (e.g. KahaniPaisonKi)"
                  placeholderTextColor={C.text3}
                  style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14 }} />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => { updateChannel(ch.id, channelForm); setEditingChannel(null); Alert.alert('Saved', 'Channel updated'); }}
                    style={{ flex: 2, backgroundColor: C.accent, borderRadius: 10, padding: 10, alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditingChannel(null)}
                    style={{ flex: 1, backgroundColor: C.surface2, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
                    <Text style={{ color: C.text3, fontSize: 13 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {ch.id !== activeChannelId && (
                  <TouchableOpacity
                    onPress={() => switchChannel(ch.id)}
                    style={{ flex: 2, backgroundColor: C.surface2, borderRadius: 10, padding: 9, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
                    <Text style={{ fontSize: 12, color: C.text2, fontWeight: '600' }}>Switch</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => { setChannelForm({ name: ch.name, handle: ch.handle, folderPath: ch.folderPath }); setEditingChannel(ch.id); }}
                  style={{ flex: 1, backgroundColor: C.surface2, borderRadius: 10, padding: 9, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
                  <Text style={{ fontSize: 12, color: C.text2, fontWeight: '600' }}>Edit</Text>
                </TouchableOpacity>
                {channels.length > 1 && (
                  <TouchableOpacity
                    onPress={() => Alert.alert('Delete?', 'Delete ' + ch.name + '?', [
                      { text: 'Cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteChannel(ch.id) }
                    ])}
                    style={{ width: 38, backgroundColor: C.danger + '15', borderRadius: 10, padding: 9, alignItems: 'center', borderWidth: 1, borderColor: C.danger + '30' }}>
                    <Trash2 size={14} color={C.danger} strokeWidth={1.8} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}

        {showAddChannel ? (
          <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1.5, borderColor: C.accent + '40', padding: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 }}>Add Channel</Text>
            <TextInput
              value={channelForm.name}
              onChangeText={v => setChannelForm(p => ({ ...p, name: v }))}
              placeholder="Channel name"
              placeholderTextColor={C.text3}
              style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14, marginBottom: 8 }} />
            <TextInput
              value={channelForm.handle}
              onChangeText={v => setChannelForm(p => ({ ...p, handle: v }))}
              placeholder="@handle"
              placeholderTextColor={C.text3}
              style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14, marginBottom: 8 }} />
            <TextInput
              value={channelForm.folderPath}
              onChangeText={v => setChannelForm(p => ({ ...p, folderPath: v }))}
              placeholder="Folder name (e.g. Channel2)"
              placeholderTextColor={C.text3}
              style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14, marginBottom: 14 }} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  if (!channelForm.name.trim()) { Alert.alert('Required', 'Channel name required'); return; }
                  addChannel(channelForm);
                  setChannelForm({ name: '', handle: '', folderPath: '' });
                  setShowAddChannel(false);
                  Alert.alert('Added', channelForm.name + ' added');
                }}
                style={{ flex: 2, backgroundColor: C.accent, borderRadius: 10, padding: 12, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Add Channel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setShowAddChannel(false); setChannelForm({ name: '', handle: '', folderPath: '' }); }}
                style={{ flex: 1, backgroundColor: C.surface2, borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
                <Text style={{ color: C.text3 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => { setChannelForm({ name: '', handle: '', folderPath: '' }); setShowAddChannel(true); }}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.surface, borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: C.border, borderStyle: 'dashed' }}>
            <Plus size={16} color={C.accent} strokeWidth={2} />
            <Text style={{ color: C.accent, fontWeight: '600', fontSize: 14 }}>Add Channel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* API KEYS */}
      <Label text="API Keys" />
      <Text style={{ fontSize: 12, color: C.text2, marginBottom: 16 }}>
        API keys are shared across all channels. Multiple keys for same purpose — first is primary, second is fallback.
      </Text>

      {apiKeys.length === 0 ? (
        <View style={{ padding: 24, backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 12, alignItems: 'center' }}>
          <Key size={24} color={C.text3} strokeWidth={1.5} style={{ marginBottom: 10 }} />
          <Text style={{ color: C.text2, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>No API keys added</Text>
          <Text style={{ color: C.text3, fontSize: 12, textAlign: 'center' }}>Add Claude, Pexels, Pixabay or any other service</Text>
        </View>
      ) : (
        purposeGroups.map(group => (
          <View key={group.value} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.text3, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
              {group.label} ({group.keys.length})
            </Text>
            {group.keys.map(k => renderKeyCard(k))}
          </View>
        ))
      )}

      {showAddKey ? (
        <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1.5, borderColor: C.accent + '40', padding: 16, marginBottom: 12 }}>
          <Text style={{ fontWeight: '700', color: C.text, fontSize: 15, marginBottom: 16 }}>Add API Key</Text>

          <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>Service name</Text>
          <TextInput value={newService} onChangeText={handleServiceChange}
            placeholder="e.g. Claude, Pexels, OpenAI..."
            placeholderTextColor={C.text3}
            style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 8, fontSize: 14 }} />

          {newService.trim() && (
            <View style={{ backgroundColor: C.accent + '10', borderRadius: 8, padding: 10, marginBottom: 14 }}>
              <Text style={{ fontSize: 12, color: C.accent }}>
                Detected: <Text style={{ fontWeight: '700' }}>{newPurposeLabel || newPurpose}</Text>
              </Text>
            </View>
          )}

          <Text style={{ fontSize: 12, color: C.text2, marginBottom: 8 }}>Purpose</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {PURPOSE_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.value} onPress={() => { setNewPurpose(opt.value); setNewPurposeLabel(opt.label); }}
                style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100, borderWidth: 1.5, borderColor: newPurpose === opt.value ? C.accent : C.border, backgroundColor: newPurpose === opt.value ? C.accent + '15' : C.surface2 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: newPurpose === opt.value ? C.accent : C.text2 }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>API Key</Text>
          <TextInput value={newKey} onChangeText={setNewKey}
            placeholder="Paste your API key..."
            placeholderTextColor={C.text3}
            secureTextEntry={true}
            style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, marginBottom: 16, fontSize: 14 }} />

          {getKeysByPurpose(newPurpose).length > 0 && (
            <View style={{ backgroundColor: C.accent2 + '10', borderRadius: 8, padding: 10, marginBottom: 14 }}>
              <Text style={{ fontSize: 12, color: C.accent2 }}>
                Already have {getKeysByPurpose(newPurpose).length} key for {newPurposeLabel}. This will be added as fallback.
              </Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => { setShowAddKey(false); setNewService(''); setNewKey(''); setNewPurpose(''); setNewPurposeLabel(''); }}
              style={{ flex: 1, backgroundColor: C.surface2, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
              <Text style={{ color: C.text2, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!newService.trim() || !newKey.trim()) { Alert.alert('Required', 'Service name and API key required'); return; }
                if (!newPurpose) { Alert.alert('Required', 'Select a purpose'); return; }
                addApiKey({ id: Date.now(), service: newService.trim(), key: newKey.trim(), purpose: newPurpose, purposeLabel: newPurposeLabel });
                setNewService(''); setNewKey(''); setNewPurpose(''); setNewPurposeLabel('');
                setShowAddKey(false);
                Alert.alert('Saved', newService + ' key added');
              }}
              style={{ flex: 2, backgroundColor: C.accent, borderRadius: 12, padding: 14, alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', color: '#fff', fontSize: 15 }}>Save Key</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShowAddKey(true)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.surface, borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: C.border, borderStyle: 'dashed', marginBottom: 28 }}>
          <Plus size={16} color={C.accent} strokeWidth={2} />
          <Text style={{ color: C.accent, fontWeight: '600', fontSize: 14 }}>Add API Key</Text>
        </TouchableOpacity>
      )}

      {/* DANGER */}
      <Label text="Danger Zone" />
      <TouchableOpacity
        onPress={() => Alert.alert('Clear all data?', 'All videos and settings will be deleted.', [
          { text: 'Cancel' },
          {
            text: 'Clear Everything', style: 'destructive', onPress: async () => {
              await AsyncStorage.multiRemove(['videos', 'apiKeys', 'draft', 'theme', 'language', 'channels', 'activeChannelId']);
              Alert.alert('Cleared', 'Please restart the app');
            }
          }
        ])}
        style={{ backgroundColor: C.danger + '10', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.danger + '25', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        <Trash2 size={15} color={C.danger} strokeWidth={1.8} />
        <Text style={{ color: C.danger, fontWeight: '600' }}>Clear All Data</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
