import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';

const statusColor = { draft: '#f0c040', ready: '#e07840', uploaded: '#40c070', idea: '#4080e0' };
const statusLabel = { draft: 'Draft', ready: 'Ready', uploaded: 'Uploaded', idea: 'Idea' };
const statusIcon = { draft: '📝', ready: '🎬', uploaded: '🚀', idea: '💡' };

export default function LibraryScreen() {
  const { C, videos } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filters = ['all', 'idea', 'draft', 'ready', 'uploaded'];
  const filtered = videos.filter(v => {
    const matchFilter = filter === 'all' || v.status === filter;
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ padding: 20, paddingTop: 60 }}>
        <Text style={{ fontWeight: '800', fontSize: 20, color: C.text, marginBottom: 12 }}>Content Library 📚</Text>
        <TextInput
          placeholder="🔍 Search videos..." placeholderTextColor={C.text3} value={search} onChangeText={setSearch}
          style={{ backgroundColor: C.surface2, borderRadius: 10, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border }}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 8, flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
        {filters.map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, borderWidth: 1.5, borderColor: filter === f ? C.accent : C.border, backgroundColor: filter === f ? C.accent + '15' : C.surface2 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: filter === f ? C.accent : C.text2 }}>
              {f === 'all' ? 'All' : statusIcon[f] + ' ' + statusLabel[f]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView>
        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📭</Text>
            <Text style={{ color: C.text3, fontSize: 14 }}>Koi video nahi mila</Text>
          </View>
        )}
        {filtered.map(v => (
          <View key={v.id} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: statusColor[v.status] + '20', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 20 }}>{statusIcon[v.status]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 3 }}>{v.title}</Text>
              <Text style={{ fontSize: 11, color: C.text3 }}>{v.pillar} · {v.type} · {v.created}</Text>
            </View>
            <View style={{ backgroundColor: statusColor[v.status] + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor[v.status] }}>{statusLabel[v.status]}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}