import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { useAllStreamers } from '../hooks/useAllStreamers';
import StreamerCard from '../components/stream/StreamCard';
import StreamerCardSkeleton from '../components/stream/StreamCardSkeleton';
import FilterBar from '../components/stream/FilterBar';

export default function AllStreamersScreen() {
  const insets = useSafeAreaInsets();
  const { streamers, isLoading, error, refresh } = useAllStreamers();
  const [platformFilter, setPlatformFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // 👇 TEMPORARY DEBUG — paste output here then remove
  useEffect(() => {
    if (!streamers?.length) return;
    const ytLive    = streamers.find(s => s.platform === 'youtube' && (s.isLive || s.is_live));
    const ytOffline = streamers.find(s => s.platform === 'youtube' && !s.isLive && !s.is_live);
    console.log('YT LIVE streamer:', JSON.stringify(ytLive,    null, 2));
    console.log('YT OFFLINE streamer:', JSON.stringify(ytOffline, null, 2));
  }, [streamers]);

  const safeStreamers = useMemo(() => streamers || [], [streamers]);

  const filtered = useMemo(() => {
    let s = safeStreamers;
    if (platformFilter !== 'all') s = s.filter((st) => st.platform === platformFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      s = s.filter((st) =>
        (st.channelName || '').toLowerCase().includes(q) ||
        (st.title || '').toLowerCase().includes(q)
      );
    }
    return s;
  }, [safeStreamers, platformFilter, search]);

  const counts = useMemo(() => ({
    all:     safeStreamers.length,
    youtube: safeStreamers.filter((s) => s.platform === 'youtube').length,
    kick:    safeStreamers.filter((s) => s.platform === 'kick').length,
  }), [safeStreamers]);

  const liveStreams    = useMemo(() => filtered.filter((s) => s.isLive || s.is_live),  [filtered]);
  const offlineStreams = useMemo(() => filtered.filter((s) => !s.isLive && !s.is_live), [filtered]);

  const listData = useMemo(() => {
    const data = [];
    if (liveStreams.length > 0) {
      data.push({ type: 'header', id: 'live-header',    label: 'Live Now', count: liveStreams.length,    accent: true  });
      liveStreams.forEach((s, i)    => data.push({ type: 'card', id: `live-${s.id    || i}`, streamer: s }));
    }
    if (offlineStreams.length > 0) {
      data.push({ type: 'header', id: 'offline-header', label: 'Offline',  count: offlineStreams.length, accent: false });
      offlineStreams.forEach((s, i) => data.push({ type: 'card', id: `offline-${s.id || i}`, streamer: s }));
    }
    return data;
  }, [liveStreams, offlineStreams]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.titleRow}>
        <View style={styles.redAccent} />
        <Text style={styles.titleText}>
          COMMUNITY <Text style={styles.textRed}>AGENTS</Text>
        </Text>
      </View>
      {!isLoading && (
        <Text style={styles.statsText}>
          <Text style={styles.textGreen}>{liveStreams.length} live</Text>
          {'  ·  '}
          <Text style={styles.textMuted}>{offlineStreams.length} offline</Text>
          {'  ·  '}
          <Text style={styles.textMuted}>{filtered.length} total</Text>
        </Text>
      )}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search channels..."
            placeholderTextColor="#444"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FilterBar active={platformFilter} onChange={setPlatformFilter} counts={counts} />
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠ {error}</Text>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, item.accent ? styles.dotLive : styles.dotOffline]} />
          <Text style={[styles.sectionLabel, item.accent && styles.textRed]}>{item.label}</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{item.count}</Text>
          </View>
          <View style={styles.sectionLine} />
        </View>
      );
    }
    return <StreamerCard streamer={item.streamer} />;
  };

  const EmptyComponent = () => (
    isLoading ? (
      <View style={styles.skeletonContainer}>
        {[1, 2, 3].map(i => <StreamerCardSkeleton key={i} />)}
      </View>
    ) : (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>◈</Text>
        <Text style={styles.emptyTitle}>NO CHANNELS FOUND</Text>
        <Text style={styles.emptyDesc}>Try adjusting your filters or search term.</Text>
      </View>
    )
  );

  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      <FlatList
        data={isLoading ? [] : listData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyComponent}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#ff4655"
            colors={['#ff4655']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:           { flex: 1, backgroundColor: '#000' },
  listContent:         { paddingHorizontal: 16 },
  listHeader:          { paddingTop: 20, paddingBottom: 20 },
  titleRow:            { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  redAccent:           { width: 4, height: 28, backgroundColor: '#ff4655', borderRadius: 2, marginRight: 12 },
  titleText:           { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1.5, textTransform: 'uppercase' },
  textRed:             { color: '#ff4655' },
  textGreen:           { color: '#4ade80', fontWeight: 'bold' },
  textMuted:           { color: '#555' },
  statsText:           { fontSize: 11, color: '#555', marginLeft: 16, marginBottom: 16, letterSpacing: 0.5 },
  searchRow:           { marginBottom: 12 },
  searchInputWrapper:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d0d0d', borderWidth: 1, borderColor: '#222', borderRadius: 10, paddingHorizontal: 12, height: 44 },
  searchIcon:          { color: '#444', fontSize: 18, marginRight: 8 },
  searchInput:         { flex: 1, color: '#fff', fontSize: 14, height: '100%' },
  clearBtn:            { padding: 4 },
  clearText:           { color: '#555', fontSize: 12 },
  errorBox:            { backgroundColor: 'rgba(255,70,85,0.08)', borderColor: 'rgba(255,70,85,0.2)', borderWidth: 1, borderRadius: 8, padding: 12, marginTop: 12 },
  errorText:           { color: '#f87171', fontSize: 12 },
  sectionHeader:       { flexDirection: 'row', alignItems: 'center', marginBottom: 14, marginTop: 8 },
  sectionDot:          { width: 7, height: 7, borderRadius: 3.5, marginRight: 8 },
  dotLive:             { backgroundColor: '#ff4655' },
  dotOffline:          { backgroundColor: '#333' },
  sectionLabel:        { fontSize: 11, fontWeight: '900', color: '#888', textTransform: 'uppercase', letterSpacing: 1.5, marginRight: 8 },
  sectionBadge:        { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', paddingHorizontal: 7, paddingVertical: 1, borderRadius: 10, marginRight: 10 },
  sectionBadgeText:    { color: '#555', fontSize: 10, fontWeight: 'bold' },
  sectionLine:         { flex: 1, height: 1, backgroundColor: '#1a1a1a' },
  skeletonContainer:   { marginTop: 8 },
  emptyState:          { alignItems: 'center', paddingVertical: 60 },
  emptyIcon:           { color: '#333', fontSize: 32, marginBottom: 12 },
  emptyTitle:          { color: '#555', fontSize: 13, fontWeight: '900', letterSpacing: 2, marginBottom: 6 },
  emptyDesc:           { color: '#333', fontSize: 12 },
});
