/* eslint-disable */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { Lightbulb, FileText, CheckCircle, Upload, ArrowRight, Settings, Plus, AlertCircle, Clock } from 'lucide-react-native';

const statusColor = {
  draft: '#F5C518',
  ready: '#7B6EF6',
  uploaded: '#00C875',
  idea: '#4D9FFF'
};

const statusLabel = {
  draft: 'Draft',
  ready: 'Ready',
  uploaded: 'Uploaded',
  idea: 'Idea'
};

function StatusIcon({ status, size = 14, color }) {
  const c = color || statusColor[status];
  if (status === 'idea') return <Lightbulb size={size} color={c} strokeWidth={1.8} />;
  if (status === 'draft') return <FileText size={size} color={c} strokeWidth={1.8} />;
  if (status === 'ready') return <CheckCircle size={size} color={c} strokeWidth={1.8} />;
  if (status === 'uploaded') return <Upload size={size} color={c} strokeWidth={1.8} />;
  return null;
}

export default function DashboardScreen() {
  const { C, videos, apiKeys, inProgress, history, expiringVideos, draft, clearDraft, activeChannel, channels, switchChannel } = useApp();
  const navigation = useNavigation();

  const shorts = videos.filter(v => v.type === 'short').length;
  const uploaded = videos.filter(v => v.status === 'uploaded').length;
  const recent = videos.slice(0, 5);
  const hasKeys = apiKeys.length > 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 }}>
        <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, marginBottom: 6, textTransform: 'uppercase' }}>
          Content Studio
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '700', color: C.text, letterSpacing: -0.5 }}>
              {activeChannel.name}
            </Text>
            <Text style={{ fontSize: 13, color: C.text3, marginTop: 2 }}>{activeChannel.handle}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={16} color={C.text2} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>

        {/* Channel switcher */}
        {channels.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }} contentContainerStyle={{ gap: 8 }}>
            {channels.map(ch => (
              <TouchableOpacity key={ch.id} onPress={() => switchChannel(ch.id)}
                style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, borderWidth: 1.5, borderColor: activeChannel.id === ch.id ? C.accent : C.border, backgroundColor: activeChannel.id === ch.id ? C.accent + '15' : C.surface }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: activeChannel.id === ch.id ? C.accent : C.text2 }}>{ch.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 20, marginBottom: 20 }} />

      {/* Alerts */}
      {expiringVideos.length > 0 && (
        <View style={{ marginHorizontal: 20, padding: 14, backgroundColor: C.danger + '10', borderRadius: 14, borderWidth: 1, borderColor: C.danger + '25', marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Clock size={16} color={C.danger} strokeWidth={1.8} />
          <Text style={{ flex: 1, fontSize: 13, color: C.danger, fontWeight: '600' }}>
            {expiringVideos.length} video{expiringVideos.length > 1 ? 's' : ''} expiring in 3 days
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Library')}>
            <ArrowRight size={16} color={C.danger} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      )}

      {/* Draft Resume */}
      {draft && (
        <View style={{ marginHorizontal: 20, padding: 16, backgroundColor: C.accent + '10', borderRadius: 14, borderWidth: 1, borderColor: C.accent + '25', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <FileText size={16} color={C.accent} strokeWidth={1.8} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: C.accent, fontWeight: '700' }}>Unfinished video</Text>
              <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }} numberOfLines={1}>
                Step {draft.step} — {draft.idea || 'Untitled'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('New')}
              style={{ flex: 2, backgroundColor: C.accent, borderRadius: 10, padding: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => clearDraft()}
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 13, color: C.text3 }}>Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* API Notice */}
      {!hasKeys && (
        <View style={{ marginHorizontal: 20, padding: 14, backgroundColor: C.warning + '10', borderRadius: 14, borderWidth: 1, borderColor: C.warning + '25', marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <AlertCircle size={16} color={C.warning} strokeWidth={1.8} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: C.warning, fontWeight: '600' }}>No API keys added</Text>
            <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>Add in Settings to enable AI features</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <ArrowRight size={16} color={C.warning} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      )}

      {/* In Progress */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, marginBottom: 14, textTransform: 'uppercase' }}>In Progress</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { label: 'Ideas', count: videos.filter(v => v.status === 'idea').length, status: 'idea', color: '#4D9FFF' },
            { label: 'Drafts', count: videos.filter(v => v.status === 'draft').length, status: 'draft', color: '#F5C518' },
            { label: 'Ready', count: videos.filter(v => v.status === 'ready').length, status: 'ready', color: '#7B6EF6' },
          ].map(item => (
            <TouchableOpacity key={item.label}
              onPress={() => navigation.navigate('Library')}
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
              <StatusIcon status={item.status} size={18} color={item.color} />
              <Text style={{ fontSize: 24, fontWeight: '700', color: item.color, marginTop: 8 }}>{item.count}</Text>
              <Text style={{ fontSize: 11, color: C.text3, marginTop: 4, fontWeight: '500' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* History */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, marginBottom: 14, textTransform: 'uppercase' }}>History</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { label: 'Total', count: videos.length, color: C.text2 },
            { label: 'Shorts', count: shorts, color: C.accent2 },
            { label: 'Uploaded', count: uploaded, color: C.success },
          ].map(item => (
            <TouchableOpacity key={item.label}
              onPress={() => navigation.navigate('Library')}
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: item.color }}>{item.count}</Text>
              <Text style={{ fontSize: 11, color: C.text3, marginTop: 4, fontWeight: '500' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* New Video Button */}
      <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
        <TouchableOpacity
          style={{ backgroundColor: C.accent, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          onPress={() => navigation.navigate('New')}>
          <Plus size={18} color="#fff" strokeWidth={2} />
          <Text style={{ fontWeight: '700', fontSize: 15, color: '#fff' }}>New Video</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 20, marginBottom: 20 }} />

      {/* Recent */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 }}>
        <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: 1.5, color: C.text3, textTransform: 'uppercase' }}>Recent</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Library')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 12, color: C.accent, fontWeight: '600' }}>See all</Text>
          <ArrowRight size={13} color={C.accent} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {recent.length === 0 ? (
        <View style={{ alignItems: 'center', padding: 40 }}>
          <Text style={{ color: C.text3, fontSize: 14 }}>No videos yet — create your first one</Text>
        </View>
      ) : (
        <View style={{ paddingHorizontal: 20, gap: 2 }}>
          {recent.map((v, i) => (
            <TouchableOpacity key={v.id}
              onPress={() => navigation.navigate('Library', { openVideoId: v.id })}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: i < recent.length - 1 ? 1 : 0, borderColor: C.border, gap: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: statusColor[v.status] + '15', alignItems: 'center', justifyContent: 'center' }}>
                <StatusIcon status={v.status} size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 3 }} numberOfLines={1}>{v.title}</Text>
                <Text style={{ fontSize: 11, color: C.text3 }}>{v.pillar} · {v.type} · {v.created}</Text>
              </View>
              <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: statusColor[v.status] + '15', borderRadius: 100 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor[v.status] }}>{statusLabel[v.status]}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
