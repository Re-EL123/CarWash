import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  Animated, TouchableOpacity, StatusBar, Image,
} from 'react-native';
import {
  ArrowLeft, AlertTriangle,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS, STATUS_BAR_HEIGHT } from '../styles/theme';
import ServiceCard from '../components/ServiceCard';
import AnimatedButton from '../components/AnimatedButton';
import { fetchServices } from '../lib/supabase';

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

export default function ServicesScreen({ navigation }) {
  const [services, setServices]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [error, setError]           = useState(null);
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchServices();
      setServices(data);
      Animated.timing(listAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } catch (e) {
      setError('Unable to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (service) => {
    setSelected(service.id === selected?.id ? null : service);
  };

  const handleBook = () => {
    if (!selected) return;
    navigation.navigate('Booking', { service: selected });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading services…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
        <View style={styles.errorIconWrap}>
          <AlertTriangle size={40} color="#F59E0B" strokeWidth={1.5} />
        </View>
        <Text style={styles.errorText}>{error}</Text>
        <AnimatedButton title="Try Again" onPress={loadServices} fullWidth={false} />
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Our Services</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleWrap}>
        <Text style={styles.subtitle}>Select a service to book</Text>
        <Text style={styles.serviceCount}>{services.length} services available</Text>
      </View>

      <Animated.FlatList
        data={services}
        keyExtractor={(item) => item.id}
        style={{ opacity: listAnim }}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            onSelect={handleSelect}
            selected={selected?.id === item.id}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />

      {/* Sticky CTA */}
      {selected && (
        <Animated.View style={styles.cta}>
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedLabel}>Selected</Text>
            <Text style={styles.selectedName}>{selected.name}</Text>
          </View>
          <AnimatedButton
            title="Book Now →"
            onPress={handleBook}
            fullWidth={false}
            style={styles.bookBtn}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.accent },
  centered:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },

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
    letterSpacing: 0.5,
  },

  subtitleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.mediumGray,
    fontFamily: FONTS.body,
  },
  serviceCount: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    fontFamily: FONTS.body,
  },

  list: { paddingHorizontal: SPACING.md },

  // CTA bar
  cta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.accent,
  },
  selectedInfo: { flex: 1, marginRight: SPACING.md },
  selectedLabel: { fontSize: 11, color: COLORS.mediumGray, fontFamily: FONTS.body },
  selectedName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.body,
  },
  bookBtn: { paddingHorizontal: SPACING.lg, width: 'auto' },

  // States
  loadingText: {
    color: COLORS.mediumGray,
    marginTop: SPACING.md,
    fontFamily: FONTS.body,
  },
  errorIconWrap: {
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.mediumGray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontFamily: FONTS.body,
  },
});