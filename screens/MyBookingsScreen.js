import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TextInput, TouchableOpacity, Animated, Alert, StatusBar, Image,
} from 'react-native';
import {
  ArrowLeft, Search, AlertTriangle, ClipboardList, SearchX,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS, STATUS_BAR_HEIGHT } from '../styles/theme';
import BookingCard from '../components/BookingCard';
import AnimatedButton from '../components/AnimatedButton';
import { fetchMyBookings } from '../lib/supabase';

// ── Resolve logo from project root ──
let logoSource;
try {
  logoSource = require('../../assets/logo.jpg');
} catch {
  try {
    logoSource = require('../assets/logo.jpg');
  } catch {
    logoSource = null;
  }
}

const STATUSES = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function MyBookingsScreen({ navigation, route }) {
  const prefillPhone = route?.params?.phone || '';

  const [phone, setPhone]           = useState(prefillPhone);
  const [bookings, setBookings]     = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [searched, setSearched]     = useState(false);
  const [activeFilter, setFilter]   = useState('All');
  const [error, setError]           = useState(null);
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (prefillPhone) handleSearch(prefillPhone);
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFiltered(bookings);
    } else {
      setFiltered(bookings.filter((b) => b.status === activeFilter));
    }
  }, [activeFilter, bookings]);

  const handleSearch = async (overridePhone) => {
    const p = (overridePhone || phone).trim();
    if (p.length < 9) {
      Alert.alert('Invalid', 'Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyBookings(p);
      setBookings(data);
      setFiltered(data);
      setFilter('All');
      setSearched(true);
      Animated.timing(listAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } catch (e) {
      setError('Could not fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'All' ? bookings.length : bookings.filter((b) => b.status === s).length;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {logoSource ? (
            <Image source={logoSource} style={styles.headerLogo} resizeMode="cover" />
          ) : null}
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter your phone number"
            placeholderTextColor={COLORS.lightGray}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="search"
            onSubmitEditing={() => handleSearch()}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch()}>
            <Search size={20} color={COLORS.white} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <Text style={styles.searchHint}>We'll find all bookings linked to this number</Text>
      </View>

      {/* Filters */}
      {searched && bookings.length > 0 && (
        <FlatList
          data={STATUSES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(s) => s}
          style={styles.filterList}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, item === activeFilter && styles.filterChipActive]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterText, item === activeFilter && styles.filterTextActive]}>
                {item}
                {statusCounts[item] > 0 && (
                  <Text style={styles.filterCount}> {statusCounts[item]}</Text>
                )}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching your bookings…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <View style={styles.stateIconWrap}>
            <AlertTriangle size={40} color="#F59E0B" strokeWidth={1.5} />
          </View>
          <Text style={styles.errorText}>{error}</Text>
          <AnimatedButton title="Retry" onPress={handleSearch} fullWidth={false} />
        </View>
      ) : !searched ? (
        <View style={styles.centered}>
          <View style={styles.stateIconWrap}>
            <ClipboardList size={48} color={COLORS.lightGray} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>Find Your Bookings</Text>
          <Text style={styles.emptySubtitle}>Enter your phone number above to view all your car wash bookings.</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centered}>
          <View style={styles.stateIconWrap}>
            <SearchX size={48} color={COLORS.lightGray} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>
            {bookings.length === 0 ? 'No Bookings Found' : `No ${activeFilter} Bookings`}
          </Text>
          <Text style={styles.emptySubtitle}>
            {bookings.length === 0
              ? `No bookings found for ${phone}. Make your first booking today!`
              : 'Try a different filter.'}
          </Text>
          {bookings.length === 0 && (
            <>
              <View style={{ height: SPACING.lg }} />
              <AnimatedButton
                title="Book a Wash"
                onPress={() => navigation.navigate('Booking')}
                fullWidth={false}
              />
            </>
          )}
        </View>
      ) : (
        <Animated.FlatList
          style={{ opacity: listAnim }}
          data={filtered}
          keyExtractor={(b) => b.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <BookingCard booking={item} />}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {filtered.length} booking{filtered.length !== 1 ? 's' : ''} found
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: SPACING.xxl }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.accent },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },

  // Header
  header: {
    backgroundColor: COLORS.black,
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  backBtn:      { padding: 4 },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: FONTS.body,
  },

  // Search
  searchWrap: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    padding: SPACING.md,
    fontSize: 15,
    color: COLORS.black,
    fontFamily: FONTS.body,
  },
  searchBtn: {
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchHint: {
    fontSize: 11,
    color: COLORS.lightGray,
    marginTop: 6,
    fontFamily: FONTS.body,
  },

  // Filters
  filterList: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
    maxHeight: 52,
  },
  filterContent: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, gap: SPACING.sm },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterChipActive: { borderColor: COLORS.primary, backgroundColor: '#FFF5F5' },
  filterText: {
    fontSize: 12,
    color: COLORS.mediumGray,
    fontFamily: FONTS.body,
    fontWeight: '600',
  },
  filterTextActive: { color: COLORS.primary },
  filterCount: { color: COLORS.lightGray, fontSize: 10 },

  // List
  list: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  resultsHeader: { marginBottom: SPACING.sm },
  resultsText: {
    fontSize: 12,
    color: COLORS.mediumGray,
    fontFamily: FONTS.body,
    fontWeight: '600',
  },

  // Empty / error states
  stateIconWrap: {
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.black,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.body,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.mediumGray,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: FONTS.body,
  },
  errorText: {
    color: COLORS.mediumGray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontFamily: FONTS.body,
  },
  loadingText: {
    color: COLORS.mediumGray,
    marginTop: SPACING.md,
    fontFamily: FONTS.body,
  },
});