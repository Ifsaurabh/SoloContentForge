/* eslint-disable */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Share } from 'react-native';
import { useApp } from '../context/AppContext';

const statusColor = { draft: '#F5C518', ready: '#FF8C00', uploaded: '#00C875', idea: '#4D9FFF' };
const statusLabel = { draft: 'Draft', ready: 'Ready', uploaded: 'Uploaded', idea: 'Idea' };
const statusIcon = { draft: '📝', ready: '🎬', uploaded: '🚀', idea: '💡' };

export default function LibraryScreen() {
  const { C, videos, updateVideo, deleteVideo } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filters = ['all', 'idea', 'draft', 'ready', 'uploaded'];

  const filtered = videos.filter(v => {
    const matchFilter = filter === 'all' || v.status === filter;
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Detail View
  if (selected) {
    const v = videos.find(vid => vid.id === selected);
    if (!v) { setSelected(null); return null; }

    return (
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ padding: 20, paddingTop: 60 }}>

          {/* Back */}
          <TouchableOpacity onPress={() => setSelected(null)} style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: C.accent, fontSize: 15 }}>← Library</Text>
          </TouchableOpacity>

          {/* Status Badge */}
          <View style={{ backgroundColor: statusColor[v.status] + '20', borderRadius: 100, padding: 6, paddingHorizontal: 12, alignSelf: 'flex-start', marginBottom: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: statusColor[v.status] }}>{statusIcon[v.status]} {statusLabel[v.status]}</Text>
          </View>

          {/* Title */}
          <Text style={{ fontWeight: '800', fontSize: 22, color: C.text, marginBottom: 4, lineHeight: 28 }}>{v.title}</Text>
          <Text style={{ fontSize: 13, color: C.text3, marginBottom: 24 }}>{v.pillar} · {v.type === 'short' ? '📱 Short' : '🎬 Long'} · {v.created}</Text>

          {/* Quick Actions */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => Share.share({ message: v.title + '\n\n' + (v.description || '') })}
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 18 }}>📤</Text>
              <Text style={{ fontSize: 11, color: C.text2, marginTop: 4 }}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const content = `TITLE:\n${v.title}\n\nDESCRIPTION:\n${v.description || 'Not added'}\n\nTAGS:\n${v.tags?.join(' ') || 'Not added'}`;
                Share.share({ message: content });
              }}
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 18 }}>📋</Text>
              <Text style={{ fontSize: 11, color: C.text2, marginTop: 4 }}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert('Delete?', 'Ye video delete ho jayega.', [
                { text: 'Cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => { deleteVideo(v.id); setSelected(null); } }
              ])}
              style={{ flex: 1, backgroundColor: '#FF444415', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FF444430' }}>
              <Text style={{ fontSize: 18 }}>🗑️</Text>
              <Text style={{ fontSize: 11, color: '#FF4444', marginTop: 4 }}>Delete</Text>
            </TouchableOpacity>
          </View>

          {/* Update Status */}
          <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 12 }}>UPDATE STATUS</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {['idea', 'draft', 'ready', 'uploaded'].map(s => (
              <TouchableOpacity key={s} onPress={() => updateVideo(v.id, { status: s })}
                style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 100, borderWidth: 1.5, borderColor: v.status === s ? statusColor[s] : C.border, backgroundColor: v.status === s ? statusColor[s] + '20' : C.surface2 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: v.status === s ? statusColor[s] : C.text2 }}>
                  {statusIcon[s]} {statusLabel[s]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Video Details */}
          <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 12 }}>DETAILS</Text>
          <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, marginBottom: 24, overflow: 'hidden' }}>
            {[
              ['Type', v.type === 'short' ? '📱 Short' : '🎬 Long'],
              ['Pillar', v.pillar],
              ['Created', v.created],
              ['Status', statusLabel[v.status]],
            ].map(([label, value], i, arr) => (
              <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: C.border }}>
                <Text style={{ fontSize: 13, color: C.text3 }}>{label}</Text>
                <Text style={{ fontSize: 13, color: C.text, fontWeight: '600' }}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          {v.description ? (
            <>
              <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 12 }}>DESCRIPTION</Text>
              <View style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 24 }}>
                <Text style={{ fontSize: 13, color: C.text2, lineHeight: 20 }}>{v.description}</Text>
              </View>
            </>
          ) : null}

          {/* Tags */}
          {v.tags && v.tags.length > 0 ? (
            <>
              <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginBottom: 12 }}>TAGS</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                {v.tags.map((tag, i) => (
                  <View key={i} style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: C.surface2, borderRadius: 100, borderWidth: 1, borderColor: C.border }}>
                    <Text style={{ fontSize: 12, color: C.text2 }}>{tag}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {/* Mark Uploaded */}
          {v.status !== 'uploaded' && (
            <TouchableOpacity
              onPress={() => { updateVideo(v.id, { status: 'uploaded' }); Alert.alert('🚀', 'Video marked as uploaded!'); }}
              style={{ backgroundColor: C.success, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontWeight: '700', fontSize: 15, color: '#fff' }}>🚀 Mark as Uploaded</Text>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>
    );
  }

  // List View
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>

      <View style={{ padding: 20, paddingTop: 60 }}>
        <Text style={{ fontWeight: '800', fontSize: 22, color: C.text, marginBottom: 14 }}>Content Library 📚</Text>
        <TextInput
          placeholder="🔍 Search videos..."
          placeholderTextColor={C.text3}
          value={search}
          onChangeText={setSearch}
          style={{ backgroundColor: C.surface, borderRadius: 12, padding: 13, color: C.text, borderWidth: 1, borderColor: C.border, fontSize: 14 }}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 10 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        {filters.map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, borderWidth: 1.5, borderColor: filter === f ? C.accent : C.border, backgroundColor: filter === f ? C.accent + '15' : C.surface }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: filter === f ? C.accent : C.text2 }}>
              {f === 'all' ? 'All' : statusIcon[f] + ' ' + statusLabel[f]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView>
        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', padding: 50 }}>
            <Text style={{ fontSize: 50, marginBottom: 14 }}>📭</Text>
            <Text style={{ color: C.text3, fontSize: 14, textAlign: 'center' }}>
              {search ? 'Koi result nahi mila' : 'Koi video nahi — pehla video banao!'}
            </Text>
          </View>
        )}
        {filtered.map(v => (
          <TouchableOpacity key={v.id} onPress={() => setSelected(v.id)}
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.bg }}>
            <View style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: statusColor[v.status] + '20', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Text style={{ fontSize: 22 }}>{statusIcon[v.status]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 4 }} numberOfLines={1}>{v.title}</Text>
              <Text style={{ fontSize: 11, color: C.text3 }}>{v.pillar} · {v.type} · {v.created}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <View style={{ backgroundColor: statusColor[v.status] + '22', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor[v.status] }}>{statusLabel[v.status]}</Text>
              </View>
              <Text style={{ fontSize: 13, color: C.text3 }}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </View>
  );
}