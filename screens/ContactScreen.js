import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Animated,
  StatusBar,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Map,
  ChevronRight,
  MapPin,
  Clock,
} from 'lucide-react-native';
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
  FONTS,
  STATUS_BAR_HEIGHT,
} from '../styles/theme';
import AnimatedButton from '../components/AnimatedButton';

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

const PHONE_NUM = '0723183495';
const PHONE_DISPLAY = '072 318 3495';
const MAPS_URL = 'https://maps.google.com/?q=Rietvlei+Zoo+Farm+Pretoria';

const HOURS = [
  { day: 'Monday', open: '07:30', close: '17:00' },
  { day: 'Tuesday', open: '07:30', close: '17:00' },
  { day: 'Wednesday', open: '07:30', close: '17:00' },
  { day: 'Thursday', open: '07:30', close: '17:00' },
  { day: 'Friday', open: '07:30', close: '17:00' },
  { day: 'Saturday', open: '07:30', close: '17:00' },
  { day: 'Sunday', open: '07:30', close: '17:00' },
];

const getCurrentDay = () => {
  return new Date().toLocaleDateString('en-ZA', { weekday: 'long' });
};

const isOpen = () => {
  const now = new Date();
  const h = now.getHours(),
    m = now.getMinutes();
  const total = h * 60 + m;
  return total >= 7 * 60 + 30 && total <= 17 * 60;
};

export default function ContactScreen({ navigation }) {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(30)).current;
  const cardOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardOp, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnim, {
          toValue: 0,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleCall = () => Linking.openURL(`tel:${PHONE_NUM}`);
  const handleWhatsApp = () =>
    Linking.openURL(
      `whatsapp://send?phone=27${PHONE_NUM.slice(
        1
      )}&text=Hi, I'd like to book a car wash`
    );
  const handleMaps = () => Linking.openURL(MAPS_URL);

  const today = getCurrentDay();
  const open = isOpen();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Status pill */}
        <Animated.View style={[styles.statusWrap, { opacity: headerAnim }]}>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: open ? '#22C55E20' : '#EF444420' },
            ]}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: open ? '#22C55E' : '#EF4444' },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: open ? '#22C55E' : '#EF4444' },
              ]}>
              {open ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        </Animated.View>

        {/* Hero card */}
        <Animated.View
          style={[
            styles.heroCard,
            { opacity: cardOp, transform: [{ translateY: cardAnim }] },
          ]}>
          <View style={styles.heroLogoCircle}>
            {logoSource ? (
              <Image
                source={logoSource}
                style={styles.heroLogoImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.heroLogoFallback}>CW</Text>
            )}
          </View>
          <Text style={styles.heroTitle}>The Carwash</Text>
          <Text style={styles.heroSub}>Car Wash @Rietvlei</Text>
          <View style={styles.heroLocationRow}>
            <MapPin size={14} color={COLORS.lightGray} strokeWidth={2} />
            <Text style={styles.heroLocation}>
              Rietvlei Zoo Farm, Pretoria
            </Text>
          </View>
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View style={[styles.section, { opacity: cardOp }]}>
          <Text style={styles.sectionLabel}>GET IN TOUCH</Text>

          <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
            <View
              style={[styles.contactIcon, { backgroundColor: '#22C55E20' }]}>
              <Phone size={22} color="#22C55E" strokeWidth={2} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>{PHONE_DISPLAY}</Text>
            </View>
            <ChevronRight size={20} color={COLORS.lightGray} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={handleWhatsApp}>
            <View
              style={[styles.contactIcon, { backgroundColor: '#22C55E30' }]}>
              <MessageCircle size={22} color="#22C55E" strokeWidth={2} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactValue}>{PHONE_DISPLAY}</Text>
            </View>
            <ChevronRight size={20} color={COLORS.lightGray} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={handleMaps}>
            <View
              style={[styles.contactIcon, { backgroundColor: '#3B82F620' }]}>
              <Map size={22} color="#3B82F6" strokeWidth={2} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Directions</Text>
              <Text style={styles.contactValue}>Open in Google Maps</Text>
            </View>
            <ChevronRight size={20} color={COLORS.lightGray} strokeWidth={2} />
          </TouchableOpacity>
        </Animated.View>

        {/* Trading Hours */}
        <Animated.View style={[styles.section, { opacity: cardOp }]}>
          <Text style={styles.sectionLabel}>TRADING HOURS</Text>
          <View style={styles.hoursCard}>
            {HOURS.map((h) => {
              const isToday = h.day === today;
              return (
                <View
                  key={h.day}
                  style={[styles.hourRow, isToday && styles.hourRowToday]}>
                  <Text
                    style={[styles.hourDay, isToday && styles.hourDayToday]}>
                    {h.day}
                  </Text>
                  <Text
                    style={[styles.hourTime, isToday && styles.hourTimeToday]}>
                    {h.open} – {h.close}
                  </Text>
                  {isToday && (
                    <View
                      style={[
                        styles.todayBadge,
                        { backgroundColor: open ? '#22C55E' : '#EF4444' },
                      ]}>
                      <Text style={styles.todayText}>
                        {open ? 'Open' : 'Closed'}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Book CTA */}
        <Animated.View style={[styles.section, { opacity: cardOp }]}>
          <AnimatedButton
            title="Book a Wash"
            onPress={() => navigation.navigate('Booking')}
          />
        </Animated.View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.accent },

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
  backBtn: { padding: 4 },
  headerTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: FONTS.body,
  },

  content: { padding: SPACING.md },

  // Status
  statusWrap: { alignItems: 'center', marginBottom: SPACING.md },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: SPACING.sm },
  statusText: { fontSize: 13, fontWeight: '700', fontFamily: FONTS.body },

  // Hero
  heroCard: {
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  heroLogoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    overflow: 'hidden',
  },
  heroLogoImage: {
    width: '100%',
    height: '100%',
  },
  heroLogoFallback: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: FONTS.body,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
    fontFamily: FONTS.heading,
  },
  heroSub: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    fontFamily: FONTS.body,
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  heroLocation: {
    color: COLORS.lightGray,
    fontSize: 13,
    fontFamily: FONTS.body,
    marginLeft: 6,
  },

  // Sections
  section: { marginBottom: SPACING.lg },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mediumGray,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.body,
  },

  // Contact rows
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  contactInfo: { flex: 1 },
  contactLabel: {
    fontSize: 11,
    color: COLORS.lightGray,
    fontFamily: FONTS.body,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.body,
  },

  // Hours
  hoursCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  hourRowToday: { backgroundColor: '#FFF5F5' },
  hourDay: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    fontFamily: FONTS.body,
  },
  hourDayToday: { color: COLORS.primary, fontWeight: '700' },
  hourTime: {
    fontSize: 13,
    color: COLORS.mediumGray,
    fontFamily: FONTS.body,
  },
  hourTimeToday: { color: COLORS.black, fontWeight: '600' },
  todayBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginLeft: SPACING.sm,
  },
  todayText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.body,
  },
});