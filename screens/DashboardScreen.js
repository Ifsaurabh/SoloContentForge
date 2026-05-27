/* eslint-disable */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const statusColor = { draft: '#F5C518', ready: '#FF8C00', uploaded: '#00C875', idea: '#4D9FFF' };
const statusLabel = { draft: 'Draft', ready: 'Ready', uploaded: 'Uploaded', idea: 'Idea' };
const statusIcon = { draft: '📝', ready: '🎬', uploaded: '🚀', idea: '💡' };

export default function DashboardScreen() {
  const { C, videos, apiKeys } = useApp();
  const navigation = useNavigation();

  const ideas = videos.filter(v => v.status === 'idea').length;
  const drafted = videos.filter(v => v.status === 'draft').length;
  const ready = videos.filter(v => v.status === 'ready').length;
  const uploaded = videos.filter(v => v.status === 'uploaded').length;
  const shorts = videos.filter(v => v.type === 'short').length;
  const recent = videos.slice(0, 4);
  const hasKeys = apiKeys.length > 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 30 }}>

      {/* Header */}
      <View style={{ padding: 20, paddingTop: 64, paddingBottom: 12 }}>
        <Text style={{ fontWeight: '800', fontSize: 26, color: C.text, letterSpacing: -0.5 }}>🔥 Solo Content Forge</Text>
        <Text style={{ fontSize: 13, color: C.text3, marginTop: 4 }}>Kahani Paison Ki — Idea se upload tak</Text>
      </View>

      {/* API Notice — only show if no keys */}
      {!hasKeys && (
        <View style={{ marginHorizontal: 16, padding: 12, backgroundColor: 'rgba(245,197,24,0.08)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(245,197,24,0.2)', marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontSize: 18 }}>⚙️</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: C.accent, fontWeight: '600' }}>API keys not added</Text>
            <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>Add in Settings to enable AI features</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ backgroundColor: C.accent, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#111' }}>Add →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Today Stats */}
      <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginLeft: 20, marginBottom: 10 }}>TODAY</Text>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 24 }}>
        {[
          ['💡', ideas + drafted, 'Ideas', C.info],
          ['📝', drafted, 'Drafted', C.accent],
          ['🎬', ready, 'Ready', C.accent2],
        ].map(([icon, num, label, color]) => (
          <View key={label} style={{ flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 26, fontWeight: '800', color }}>{num}</Text>
            <Text style={{ fontSize: 10, color: C.text3, marginTop: 4 }}>{icon} {label}</Text>
          </View>
        ))}
      </View>

      {/* Total Stats */}
      <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginLeft: 20, marginBottom: 10 }}>TOTAL</Text>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 28 }}>
        {[
          ['🎬', videos.length, 'Videos', C.accent2],
          ['📱', shorts, 'Shorts', C.info],
          ['🚀', uploaded, 'Live', C.success],
        ].map(([icon, num, label, color]) => (
          <View key={label} style={{ flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 26, fontWeight: '800', color }}>{num}</Text>
            <Text style={{ fontSize: 10, color: C.text3, marginTop: 4 }}>{icon} {label}</Text>
          </View>
        ))}
      </View>

      {/* New Video Button */}
      <View style={{ paddingHorizontal: 16, marginBottom: 28 }}>
        <TouchableOpacity
          style={{ backgroundColor: C.accent, borderRadius: 16, padding: 18, alignItems: 'center', shadowColor: C.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
          onPress={() => navigation.navigate('New')}>
          <Text style={{ fontWeight: '800', fontSize: 17, color: '#111' }}>➕ New Video</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 16, marginBottom: 20 }} />

      {/* Recent */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3 }}>RECENT</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Library')}>
          <Text style={{ fontSize: 12, color: C.accent }}>See all →</Text>
        </TouchableOpacity>
      </View>

      {recent.length === 0 ? (
        <View style={{ alignItems: 'center', padding: 30 }}>
          <Text style={{ fontSize: 40, marginBottom: 10 }}>🎬</Text>
          <Text style={{ color: C.text3, fontSize: 14 }}>Koi video nahi — pehla video banao!</Text>
        </View>
      ) : (
        recent.map(v => (
          <TouchableOpacity key={v.id} onPress={() => navigation.navigate('Library')}
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: statusColor[v.status] + '20', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Text style={{ fontSize: 20 }}>{statusIcon[v.status]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 3 }} numberOfLines={1}>{v.title}</Text>
              <Text style={{ fontSize: 11, color: C.text3 }}>{v.pillar} · {v.type} · {v.created}</Text>
            </View>
            <View style={{ backgroundColor: statusColor[v.status] + '22', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor[v.status] }}>{statusLabel[v.status]}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}