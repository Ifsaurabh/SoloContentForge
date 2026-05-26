import { useNavigation } from '@react-navigation/native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';

export default function DashboardScreen() {
  const { C, videos } = useApp();
  const navigation = useNavigation();

  const drafted = videos.filter(v => v.status === 'draft').length;
  const ready = videos.filter(v => v.status === 'ready').length;
  const uploaded = videos.filter(v => v.status === 'uploaded').length;
  const recent = videos.slice(0, 3);

  const statusColor = { draft: C.accent, ready: C.accent2, uploaded: C.success, idea: C.info };
  const statusLabel = { draft: 'Draft', ready: 'Ready', uploaded: 'Uploaded', idea: 'Idea' };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Header */}
      <View style={{ padding: 20, paddingTop: 60, backgroundColor: C.bg }}>
        <Text style={{ fontWeight: '800', fontSize: 22, color: C.text }}>🔥 Solo Content Forge</Text>
        <Text style={{ fontSize: 13, color: C.text2, marginTop: 2 }}>Kahani Paison Ki — Idea se upload tak</Text>
      </View>

      {/* API Notice */}
      <View style={{ margin: 16, padding: 12, backgroundColor: 'rgba(240,192,64,0.08)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(240,192,64,0.2)' }}>
        <Text style={{ fontSize: 12, color: C.accent }}>⚙️ API keys not set — add in Settings to enable AI</Text>
      </View>

      {/* Stats Today */}
      <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginLeft: 16, marginBottom: 8 }}>TODAY</Text>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 20 }}>
        {[['💡', videos.length, 'Ideas'], ['📝', drafted, 'Drafted'], ['🎬', ready, 'Ready']].map(([icon, num, label]) => (
          <View key={label} style={{ flex: 1, backgroundColor: C.surface, borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: C.accent }}>{num}</Text>
            <Text style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>{icon} {label}</Text>
          </View>
        ))}
      </View>

      {/* Total Stats */}
      <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginLeft: 16, marginBottom: 8 }}>TOTAL VIDEOS</Text>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 24 }}>
        {[['🎬', videos.length, C.accent2], ['📱', videos.filter(v=>v.type==='short').length, C.info], ['🚀', uploaded, C.success]].map(([icon, num, color], i) => (
          <View key={i} style={{ flex: 1, backgroundColor: C.surface, borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color }}>{num}</Text>
            <Text style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>{icon}</Text>
          </View>
        ))}
      </View>

      {/* New Video Button */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <TouchableOpacity
          style={{ backgroundColor: C.accent, borderRadius: 14, padding: 16, alignItems: 'center' }}
          onPress={() => navigation.navigate('New')}
        >
          <Text style={{ fontWeight: '700', fontSize: 16, color: '#111' }}>➕ New Video</Text>
        </TouchableOpacity>
      </View>

      {/* Recent */}
      <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 16, marginBottom: 16 }} />
      <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: C.text3, marginLeft: 16, marginBottom: 12 }}>RECENT</Text>
      {recent.map(v => (
        <TouchableOpacity key={v.id} onPress={() => navigation.navigate('Library')}
          style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: C.border }}>
          <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Text style={{ fontSize: 18 }}>{v.status === 'draft' ? '📝' : v.status === 'ready' ? '✅' : '🚀'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>{v.title}</Text>
            <Text style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{v.pillar} · {v.type} · {v.created}</Text>
          </View>
          <View style={{ backgroundColor: statusColor[v.status] + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor[v.status] }}>{statusLabel[v.status]}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}