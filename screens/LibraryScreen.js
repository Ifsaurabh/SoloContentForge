/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import {
  Search, ArrowLeft, Pencil, Trash2, Share2, Download,
  Copy, Check, X, ChevronRight, Lightbulb, FileText,
  CheckCircle, Upload, Clock, Zap, Circle, TrendingUp,
  AlertTriangle, Star, Flag, Play
} from 'lucide-react-native';


const statusColor = { draft: '#F5C518', ready: '#7B6EF6', uploaded: '#00C875', idea: '#4D9FFF' };
const statusLabel = { draft: 'Draft', ready: 'Ready', uploaded: 'Uploaded', idea: 'Idea' };

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

function StatusIcon({ status, size = 14 }) {
  const color = statusColor[status];
  if (status === 'idea') return <Lightbulb size={size} color={color} strokeWidth={1.8} />;
  if (status === 'draft') return <FileText size={size} color={color} strokeWidth={1.8} />;
  if (status === 'ready') return <CheckCircle size={size} color={color} strokeWidth={1.8} />;
  if (status === 'uploaded') return <Upload size={size} color={color} strokeWidth={1.8} />;
  return null;
}

async function copyText(text) {
  try {
    const Clipboard = await import('expo-clipboard');
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Text copied to clipboard');
  } catch (e) { Alert.alert('Error', 'Could not copy'); }
}

export default function LibraryScreen() {
  const { C, videos, updateVideo, deleteVideo } = useApp();
  const route = useRoute();
  const navigation = useNavigation();

  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const [newTag, setNewTag] = useState('');
  const [reSelectSection, setReSelectSection] = useState(null); // for clip re-selection

  useEffect(() => {
    if (route.params?.openVideoId) setSelected(route.params.openVideoId);
  }, [route.params?.openVideoId]);

  const filtered = videos.filter(v => {
    const matchStatus = filter === 'all' || v.status === filter;
    const matchType = typeFilter === 'all' || v.type === typeFilter;
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  function daysRemaining(v) {
    if (!v.createdAt) return null;
    return 30 - Math.floor((Date.now() - v.createdAt) / (24 * 60 * 60 * 1000));
  }

  async function shareScript(v, format) {
    const sections = v.type === 'short' ? shortSections : longSections;
    const plain = (v.script || []).map(s => {
      const info = sections.find(sec => sec.id === s.id);
      return `[${info?.label || s.id}]\n${s.text}`;
    }).join('\n\n');
    const structured = `SCRIPT: ${v.title}\nPillar: ${v.pillar}\nType: ${v.type}\n\n` + plain;
    const content = format === 'plain' ? plain : structured;
    try {
      const fileUri = FileSystem.documentDirectory + 'script_' + Date.now() + '.txt';
      await FileSystem.writeAsStringAsync(fileUri, content);
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(fileUri, { mimeType: 'text/plain' });
    } catch (e) { Alert.alert('Error', 'Could not share'); }
  }

  async function exportFull(v) {
    const sections = v.type === 'short' ? shortSections : longSections;
    const scriptText = (v.script || []).map(s => {
      const info = sections.find(sec => sec.id === s.id);
      return `[${info?.label || s.id}] ${info?.timing || ''}\n${s.text}`;
    }).join('\n\n');
    const content = [
      `TITLE: ${v.title}`,
      `Pillar: ${v.pillar} | Type: ${v.type} | Status: ${statusLabel[v.status]}`,
      `Created: ${v.created}`,
      ``, `SCRIPT`, `───────────────────`, scriptText || 'No script',
      ``, `TITLES`, `───────────────────`,
      (v.titles || []).map((t, i) => `${i + 1}. ${t}`).join('\n'),
      `Selected: ${v.selectedTitle || v.title}`,
      ``, `DESCRIPTION`, `───────────────────`, v.description || 'None',
      ``, `TAGS`, `───────────────────`, (v.tags || []).join(' '),
      ``, `SUBTITLES (${(v.subtitleLines || []).length} lines)`, `───────────────────`,
      (v.subtitleLines || []).slice(0, 20).map(l => `${l.start.substring(0, 8)} → ${l.text}`).join('\n'),
    ].join('\n');
    try {
      const fileUri = FileSystem.documentDirectory + 'export_' + Date.now() + '.txt';
      await FileSystem.writeAsStringAsync(fileUri, content);
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(fileUri, { mimeType: 'text/plain', dialogTitle: 'Export Video Package' });
    } catch (e) { Alert.alert('Error', 'Could not export'); }
  }

  // ===== CLIP RE-SELECTION VIEW =====
  if (reSelectSection !== null && selected) {
    const v = videos.find(vid => vid.id === selected);
    if (!v) { setReSelectSection(null); return null; }
    const sec = v.videoSections?.[reSelectSection];
    if (!sec) { setReSelectSection(null); return null; }

    return (
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ padding: 20, paddingTop: 60, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity onPress={() => setReSelectSection(null)}>
            <ArrowLeft size={20} color={C.accent} strokeWidth={1.8} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>{sec.label} Clips</Text>
            <Text style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>{sec.selectedClips?.length || 0} selected</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              updateVideo(v.id, { videoSections: v.videoSections });
              setReSelectSection(null);
              Alert.alert('Saved', 'Clip selection updated');
            }}
            style={{ backgroundColor: C.success, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Section script */}
        {v.script?.find(s => s.id === sec.id) && (
          <View style={{ marginHorizontal: 20, backgroundColor: C.surface2, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border, marginBottom: 16 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.text3, letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>Script</Text>
            <Text style={{ fontSize: 13, color: C.text2, lineHeight: 20 }}>{v.script.find(s => s.id === sec.id)?.text}</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20 }}>
          {(sec.clips || []).map(clip => {
            const isSelected = sec.selectedClips?.includes(clip.id);
            return (
              <View key={clip.id} style={{ width: '47%', borderWidth: 2, borderColor: isSelected ? C.success : C.border, borderRadius: 14, overflow: 'hidden', backgroundColor: C.surface }}>
                <View style={{ height: 90, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={24} color={C.text3} strokeWidth={1.5} />
                  <View style={{ position: 'absolute', bottom: 4, right: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
                    <Text style={{ fontSize: 9, color: '#fff' }}>{clip.duration}s · {clip.source}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const updatedSections = v.videoSections.map((s, i) => {
                      if (i !== reSelectSection) return s;
                      const isSel = s.selectedClips?.includes(clip.id);
                      return { ...s, selectedClips: isSel ? s.selectedClips.filter(id => id !== clip.id) : [...(s.selectedClips || []), clip.id] };
                    });
                    updateVideo(v.id, { videoSections: updatedSections });
                  }}
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
      </ScrollView>
    );
  }

  // ===== DETAIL VIEW =====
  if (selected) {
    const v = videos.find(vid => vid.id === selected);
    if (!v) { setSelected(null); return null; }

    const sections = v.type === 'short' ? shortSections : longSections;
    const days = daysRemaining(v);

    // EDIT: SCRIPT
    if (editMode === 'script') {
      const localScript = editData.script || v.script || [];
      return (
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity onPress={() => setEditMode(null)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={18} color={C.accent} strokeWidth={1.8} />
              <Text style={{ color: C.accent, fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { updateVideo(v.id, { script: editData.script || v.script }); setEditMode(null); Alert.alert('Saved', 'Script updated'); }}
              style={{ backgroundColor: C.success, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, paddingHorizontal: 20, marginBottom: 16 }}>Edit Script</Text>
          {localScript.map((sec, idx) => {
            const info = sections.find(s => s.id === sec.id) || { label: sec.id, timing: '', Icon: FileText };
            return (
              <View key={sec.id} style={{ borderWidth: 1, borderColor: C.border, borderRadius: 16, marginHorizontal: 20, marginBottom: 12, overflow: 'hidden' }}>
                <View style={{ padding: 12, backgroundColor: C.surface2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <info.Icon size={13} color={C.accent} strokeWidth={1.8} />
                    <Text style={{ fontWeight: '700', color: C.text, fontSize: 13 }}>{info.label}</Text>
                  </View>
                  <Text style={{ fontSize: 10, color: C.text3 }}>{info.timing}</Text>
                </View>
                <View style={{ padding: 14, backgroundColor: C.surface }}>
                  <TextInput multiline value={sec.text}
                    onChangeText={val => setEditData(prev => ({
                      ...prev,
                      script: (prev.script || localScript).map((s, i) => i === idx ? { ...s, text: val } : s)
                    }))}
                    style={{ color: C.text, fontSize: 14, lineHeight: 24, minHeight: 80 }} />
                </View>
              </View>
            );
          })}
        </ScrollView>
      );
    }

    // EDIT: TITLE
    if (editMode === 'title') {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setEditMode(null)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={18} color={C.accent} strokeWidth={1.8} />
              <Text style={{ color: C.accent, fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { updateVideo(v.id, { title: editData.title || v.title, selectedTitle: editData.title || v.selectedTitle }); setEditMode(null); Alert.alert('Saved', 'Title updated'); }}
              style={{ backgroundColor: C.success, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 16 }}>Edit Title</Text>
          {(v.titles || []).map((t, i) => (
            <TouchableOpacity key={i} onPress={() => setEditData(prev => ({ ...prev, title: t }))}
              style={{ padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: (editData.title || v.selectedTitle) === t ? C.accent : C.border, backgroundColor: (editData.title || v.selectedTitle) === t ? C.accent + '10' : C.surface, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 12, color: C.text3, minWidth: 22, fontWeight: '700' }}>{i + 1}</Text>
              <Text style={{ flex: 1, fontSize: 14, color: C.text }}>{t}</Text>
              <TouchableOpacity onPress={() => copyText(t)}><Copy size={14} color={C.text3} strokeWidth={1.8} /></TouchableOpacity>
              {(editData.title || v.selectedTitle) === t && <Check size={14} color={C.accent} strokeWidth={2.5} />}
            </TouchableOpacity>
          ))}
          <Text style={{ fontSize: 12, color: C.text3, marginTop: 12, marginBottom: 6 }}>Custom title:</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              value={editData.title !== undefined ? editData.title : (v.selectedTitle || v.title)}
              onChangeText={val => setEditData(prev => ({ ...prev, title: val }))}
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 14, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14 }} />
            <TouchableOpacity onPress={() => copyText(editData.title || v.title)} style={{ width: 46, backgroundColor: C.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border }}>
              <Copy size={16} color={C.text2} strokeWidth={1.8} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    // EDIT: DESCRIPTION
    if (editMode === 'description') {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setEditMode(null)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={18} color={C.accent} strokeWidth={1.8} />
              <Text style={{ color: C.accent, fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => copyText(editData.description || v.description || '')}
                style={{ backgroundColor: C.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Copy size={13} color={C.text2} strokeWidth={1.8} />
                <Text style={{ color: C.text2, fontSize: 13 }}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { updateVideo(v.id, { description: editData.description }); setEditMode(null); Alert.alert('Saved', 'Description updated'); }}
                style={{ backgroundColor: C.success, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 16 }}>Edit Description</Text>
          <TextInput multiline
            value={editData.description !== undefined ? editData.description : v.description}
            onChangeText={val => setEditData(prev => ({ ...prev, description: val }))}
            style={{ backgroundColor: C.surface, borderRadius: 14, padding: 14, color: C.text, borderWidth: 1, borderColor: C.border, minHeight: 220, fontSize: 14, lineHeight: 22 }} />
        </ScrollView>
      );
    }

    // EDIT: TAGS
    if (editMode === 'tags') {
      const localTags = editData.tags || v.tags || [];
      return (
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setEditMode(null)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={18} color={C.accent} strokeWidth={1.8} />
              <Text style={{ color: C.accent, fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { updateVideo(v.id, { tags: editData.tags || v.tags }); setEditMode(null); Alert.alert('Saved', 'Tags updated'); }}
              style={{ backgroundColor: C.success, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 16 }}>Edit Tags</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {localTags.map((tag, i) => (
              <TouchableOpacity key={i}
                onPress={() => setEditData(prev => ({ ...prev, tags: (prev.tags || localTags).filter((_, idx) => idx !== i) }))}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: C.surface, borderRadius: 100, borderWidth: 1, borderColor: C.border }}>
                <Text style={{ fontSize: 12, color: C.text2 }}>{tag}</Text>
                <X size={11} color={C.danger} strokeWidth={2} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput value={newTag} onChangeText={setNewTag} placeholder="#tag"
              placeholderTextColor={C.text3}
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14 }} />
            <TouchableOpacity
              onPress={() => { if (newTag.trim()) { setEditData(prev => ({ ...prev, tags: [...(prev.tags || localTags), newTag.startsWith('#') ? newTag : '#' + newTag] })); setNewTag(''); } }}
              style={{ backgroundColor: C.accent, borderRadius: 12, padding: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>+</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    // EDIT: SUBTITLES
    if (editMode === 'subtitles') {
      const localSubs = editData.subtitleLines || v.subtitleLines || [];
      return (
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity onPress={() => setEditMode(null)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={18} color={C.accent} strokeWidth={1.8} />
              <Text style={{ color: C.accent, fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { updateVideo(v.id, { subtitleLines: editData.subtitleLines || v.subtitleLines }); setEditMode(null); Alert.alert('Saved', 'Subtitles updated'); }}
              style={{ backgroundColor: C.success, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, paddingHorizontal: 20, marginBottom: 4 }}>Edit Subtitles</Text>
          <Text style={{ fontSize: 12, color: C.text3, paddingHorizontal: 20, marginBottom: 16 }}>{localSubs.length} lines — tap text to edit</Text>
          <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginHorizontal: 20, overflow: 'hidden' }}>
            {localSubs.map((line, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: i < localSubs.length - 1 ? 1 : 0, borderColor: C.border }}>
                <Text style={{ fontSize: 10, color: C.accent, minWidth: 72, marginTop: 4 }}>{line.start.substring(0, 8)}</Text>
                <TextInput value={line.text}
                  onChangeText={val => setEditData(prev => ({
                    ...prev,
                    subtitleLines: (prev.subtitleLines || localSubs).map((l, idx) => idx === i ? { ...l, text: val } : l)
                  }))}
                  style={{ flex: 1, fontSize: 13, color: C.text, lineHeight: 20 }} />
              </View>
            ))}
          </View>
        </ScrollView>
      );
    }

    // MAIN DETAIL VIEW
    return (
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ padding: 20, paddingTop: 60 }}>
          <TouchableOpacity onPress={() => { setSelected(null); setEditMode(null); setEditData({}); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            <ArrowLeft size={18} color={C.accent} strokeWidth={1.8} />
            <Text style={{ color: C.accent, fontSize: 15 }}>Library</Text>
          </TouchableOpacity>

          {days !== null && days <= 7 && (
            <View style={{ backgroundColor: days <= 3 ? C.danger + '10' : C.warning + '10', borderRadius: 10, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: days <= 3 ? C.danger + '25' : C.warning + '25', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Clock size={14} color={days <= 3 ? C.danger : C.warning} strokeWidth={1.8} />
              <Text style={{ fontSize: 12, color: days <= 3 ? C.danger : C.warning }}>
                {days <= 0 ? 'Expires today' : `Expires in ${days} day${days > 1 ? 's' : ''}`}
              </Text>
            </View>
          )}

          <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: statusColor[v.status] + '15', borderRadius: 100, alignSelf: 'flex-start', marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <StatusIcon status={v.status} size={12} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: statusColor[v.status] }}>{statusLabel[v.status]}</Text>
          </View>

          <Text style={{ fontWeight: '700', fontSize: 22, color: C.text, marginBottom: 4, lineHeight: 28 }}>{v.title}</Text>
          <Text style={{ fontSize: 13, color: C.text3, marginBottom: 20 }}>{v.pillar} · {v.type} · {v.created}</Text>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
            <TouchableOpacity onPress={() => Alert.alert('Export', 'Choose format', [
              { text: 'Plain Text', onPress: () => shareScript(v, 'plain') },
              { text: 'Structured', onPress: () => shareScript(v, 'structured') },
              { text: 'Cancel', style: 'cancel' },
            ])} style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border, gap: 4 }}>
              <Share2 size={18} color={C.text2} strokeWidth={1.8} />
              <Text style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>Script</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => exportFull(v)} style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border, gap: 4 }}>
              <Download size={18} color={C.text2} strokeWidth={1.8} />
              <Text style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>Export All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert('Delete?', 'This video will be deleted.', [
                { text: 'Cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => { deleteVideo(v.id); setSelected(null); } }
              ])}
              style={{ flex: 1, backgroundColor: C.danger + '10', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.danger + '25', gap: 4 }}>
              <Trash2 size={18} color={C.danger} strokeWidth={1.8} />
              <Text style={{ fontSize: 11, color: C.danger, marginTop: 2 }}>Delete</Text>
            </TouchableOpacity>
          </View>

          {/* Status update */}
          <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, marginBottom: 12, textTransform: 'uppercase' }}>Status</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {['idea', 'draft', 'ready', 'uploaded'].map(s => (
              <TouchableOpacity key={s} onPress={() => updateVideo(v.id, { status: s })}
                style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 100, borderWidth: 1.5, borderColor: v.status === s ? statusColor[s] : C.border, backgroundColor: v.status === s ? statusColor[s] + '15' : C.surface2, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <StatusIcon status={s} size={13} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: v.status === s ? statusColor[s] : C.text2 }}>{statusLabel[s]}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* SCRIPT */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, textTransform: 'uppercase' }}>Script</Text>
            <TouchableOpacity onPress={() => { setEditData({ script: v.script ? JSON.parse(JSON.stringify(v.script)) : [] }); setEditMode('script'); }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.border }}>
              <Pencil size={12} color={C.accent} strokeWidth={1.8} />
              <Text style={{ fontSize: 12, color: C.accent, fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>
          </View>
          {v.script && v.script.length > 0 ? (
            <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 24, overflow: 'hidden' }}>
              {v.script.map((sec, i) => {
                const info = sections.find(s => s.id === sec.id) || { label: sec.id, timing: '', Icon: FileText };
                return (
                  <View key={sec.id} style={{ borderBottomWidth: i < v.script.length - 1 ? 1 : 0, borderColor: C.border }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, paddingBottom: 6, backgroundColor: C.surface2, alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <info.Icon size={12} color={C.accent} strokeWidth={1.8} />
                        <Text style={{ fontSize: 11, fontWeight: '700', color: C.accent }}>{info.label}</Text>
                      </View>
                      <Text style={{ fontSize: 10, color: C.text3 }}>{info.timing}</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: C.text2, lineHeight: 20, padding: 12, paddingTop: 8 }}>{sec.text}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 20, alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ color: C.text3, fontSize: 13 }}>No script saved</Text>
            </View>
          )}

          {/* TITLE */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, textTransform: 'uppercase' }}>Title</Text>
            <TouchableOpacity onPress={() => { setEditData({ title: v.selectedTitle || v.title }); setEditMode('title'); }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.border }}>
              <Pencil size={12} color={C.accent} strokeWidth={1.8} />
              <Text style={{ fontSize: 12, color: C.accent, fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 24, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: '700', color: C.text, lineHeight: 22 }}>{v.selectedTitle || v.title}</Text>
            <TouchableOpacity onPress={() => copyText(v.selectedTitle || v.title)}>
              <Copy size={16} color={C.text3} strokeWidth={1.8} />
            </TouchableOpacity>
          </View>

          {/* DESCRIPTION */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, textTransform: 'uppercase' }}>Description</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => copyText(v.description || '')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, borderWidth: 1, borderColor: C.border }}>
                <Copy size={12} color={C.text2} strokeWidth={1.8} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setEditData({ description: v.description }); setEditMode('description'); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.border }}>
                <Pencil size={12} color={C.accent} strokeWidth={1.8} />
                <Text style={{ fontSize: 12, color: C.accent, fontWeight: '600' }}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 24 }}>
            {v.description ? <Text style={{ fontSize: 13, color: C.text2, lineHeight: 20 }}>{v.description}</Text> : <Text style={{ color: C.text3, fontSize: 13 }}>No description saved</Text>}
          </View>

          {/* TAGS */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, textTransform: 'uppercase' }}>Tags</Text>
            <TouchableOpacity onPress={() => { setEditData({ tags: [...(v.tags || [])] }); setEditMode('tags'); }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.border }}>
              <Pencil size={12} color={C.accent} strokeWidth={1.8} />
              <Text style={{ fontSize: 12, color: C.accent, fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>
          </View>
          {v.tags && v.tags.length > 0 ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
              {v.tags.map((tag, i) => (
                <View key={i} style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: C.surface, borderRadius: 100, borderWidth: 1, borderColor: C.border }}>
                  <Text style={{ fontSize: 12, color: C.text2 }}>{tag}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 24 }}>
              <Text style={{ color: C.text3, fontSize: 13 }}>No tags saved</Text>
            </View>
          )}

          {/* SUBTITLES */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, textTransform: 'uppercase' }}>Subtitles</Text>
            {v.subtitleLines?.length > 0 && (
              <TouchableOpacity onPress={() => { setEditData({ subtitleLines: JSON.parse(JSON.stringify(v.subtitleLines)) }); setEditMode('subtitles'); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.border }}>
                <Pencil size={12} color={C.accent} strokeWidth={1.8} />
                <Text style={{ fontSize: 12, color: C.accent, fontWeight: '600' }}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          {v.subtitleLines && v.subtitleLines.length > 0 ? (
            <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 24, overflow: 'hidden' }}>
              {v.subtitleLines.slice(0, 8).map((line, i) => (
                <View key={i} style={{ flexDirection: 'row', padding: 10, paddingHorizontal: 14, borderBottomWidth: i < Math.min(v.subtitleLines.length, 8) - 1 ? 1 : 0, borderColor: C.border }}>
                  <Text style={{ fontSize: 10, color: C.accent, minWidth: 72 }}>{line.start.substring(0, 8)}</Text>
                  <Text style={{ flex: 1, fontSize: 12, color: C.text2 }}>{line.text}</Text>
                </View>
              ))}
              {v.subtitleLines.length > 8 && (
                <View style={{ padding: 10, alignItems: 'center' }}>
                  <Text style={{ color: C.text3, fontSize: 12 }}>+{v.subtitleLines.length - 8} more lines</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 24 }}>
              <Text style={{ color: C.text3, fontSize: 13 }}>No subtitles saved</Text>
            </View>
          )}

          {/* VIDEO CLIPS */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, textTransform: 'uppercase' }}>Video Clips</Text>
          </View>
          {v.videoSections && v.videoSections.some(s => s.selectedClips?.length > 0) ? (
            <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 24, overflow: 'hidden' }}>
              {v.videoSections.filter(s => s.clips?.length > 0).map((sec, i, arr) => (
                <TouchableOpacity key={sec.id}
                  onPress={() => setReSelectSection(v.videoSections.indexOf(sec))}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: C.border }}>
                  <View>
                    <Text style={{ fontSize: 13, color: C.text, fontWeight: '600' }}>{sec.label}</Text>
                    <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{sec.selectedClips?.length || 0} of {sec.clips?.length} selected</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 12, color: C.accent, fontWeight: '600' }}>Edit clips</Text>
                    <ChevronRight size={14} color={C.accent} strokeWidth={1.8} />
                  </View>
                </TouchableOpacity>
              ))}
              <View style={{ padding: 12, backgroundColor: C.surface2 }}>
                <Text style={{ fontSize: 12, color: C.text3 }}>
                  Total: {v.videoSections.reduce((acc, s) => acc + (s.selectedClips?.length || 0), 0)} clips selected
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 24 }}>
              <Text style={{ color: C.text3, fontSize: 13 }}>No clips selected</Text>
            </View>
          )}

          {/* DETAILS */}
          <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, marginBottom: 12, textTransform: 'uppercase' }}>Details</Text>
          <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 24, overflow: 'hidden' }}>
            {[
              ['Type', v.type === 'short' ? 'Short' : 'Long'],
              ['Pillar', v.pillar],
              ['Created', v.created],
              ['Duration', v.duration ? v.duration + 's' : 'Not set'],
            ].map(([label, value], i, arr) => (
              <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: C.border }}>
                <Text style={{ fontSize: 13, color: C.text3 }}>{label}</Text>
                <Text style={{ fontSize: 13, color: C.text, fontWeight: '600' }}>{value}</Text>
              </View>
            ))}
          </View>

          {v.status !== 'uploaded' && (
            <TouchableOpacity
              onPress={() => { updateVideo(v.id, { status: 'uploaded' }); Alert.alert('Done', 'Marked as uploaded'); }}
              style={{ backgroundColor: C.success, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 10, flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
              <Upload size={16} color="#fff" strokeWidth={2} />
              <Text style={{ fontWeight: '700', fontSize: 15, color: '#fff' }}>Mark as Uploaded</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  // ===== LIST VIEW =====
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ padding: 20, paddingTop: 60 }}>
        <Text style={{ fontWeight: '700', fontSize: 22, color: C.text, marginBottom: 16, letterSpacing: -0.5 }}>Library</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 2, borderWidth: 1, borderColor: C.border, marginBottom: 14 }}>
          <Search size={15} color={C.text3} strokeWidth={1.8} />
          <TextInput placeholder="Search videos..." placeholderTextColor={C.text3} value={search} onChangeText={setSearch}
            style={{ flex: 1, padding: 11, color: C.text, fontSize: 14 }} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 6 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {['all', 'idea', 'draft', 'ready', 'uploaded'].map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, borderWidth: 1.5, borderColor: filter === f ? C.accent : C.border, backgroundColor: filter === f ? C.accent + '15' : C.surface, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {f !== 'all' && <StatusIcon status={f} size={12} />}
            <Text style={{ fontSize: 12, fontWeight: '600', color: filter === f ? C.accent : C.text2 }}>
              {f === 'all' ? 'All' : statusLabel[f]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 10 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {[['all', 'All Types'], ['short', 'Short'], ['long', 'Long']].map(([type, label]) => (
          <TouchableOpacity key={type} onPress={() => setTypeFilter(type)}
            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, borderWidth: 1.5, borderColor: typeFilter === type ? C.accent2 : C.border, backgroundColor: typeFilter === type ? C.accent2 + '15' : C.surface }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: typeFilter === type ? C.accent2 : C.text2 }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView>
        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', padding: 60 }}>
            <Text style={{ color: C.text3, fontSize: 14 }}>
              {search ? 'No results found' : 'No videos yet'}
            </Text>
          </View>
        )}
        {filtered.map((v, i, arr) => {
          const days = daysRemaining(v);
          return (
            <TouchableOpacity key={v.id} onPress={() => { setEditData({}); setEditMode(null); setSelected(v.id); }}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: statusColor[v.status] + '15', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <StatusIcon status={v.status} size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 3 }} numberOfLines={1}>{v.title}</Text>
                <Text style={{ fontSize: 11, color: C.text3 }}>{v.pillar} · {v.type} · {v.created}</Text>
                {days !== null && days <= 7 && (
                  <Text style={{ fontSize: 10, color: days <= 3 ? C.danger : C.warning, marginTop: 2 }}>
                    {days <= 0 ? 'Expires today' : `${days}d left`}
                  </Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <View style={{ backgroundColor: statusColor[v.status] + '15', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor[v.status] }}>{statusLabel[v.status]}</Text>
                </View>
                <ChevronRight size={14} color={C.text3} strokeWidth={1.8} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
