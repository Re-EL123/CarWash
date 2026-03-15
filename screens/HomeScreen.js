import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Animated,
  TouchableOpacity, Dimensions, StatusBar, Platform, Image,
  ImageBackground,
} from 'react-native';
import {
  Droplets, Sparkles, ClipboardList, Phone,
  Leaf, Hand, Zap, Gem,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS, STATUS_BAR_HEIGHT } from '../styles/theme';
import AnimatedButton from '../components/AnimatedButton';

const { width, height } = Dimensions.get('window');

// ── Resolve hero background ──
let heroBgSource;
try {
  heroBgSource = require('../../assets/hero-bg.jpg');
} catch {
  try {
    heroBgSource = require('../assets/hero-bg.jpg');
  } catch {
    heroBgSource = null;
  }
}

// ── Resolve logo ──
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

const QUICK_ACTIONS = [
  { key: 'book',     Icon: Droplets,      label: 'Book Wash',    screen: 'Booking',    color: COLORS.primary },
  { key: 'services', Icon: Sparkles,      label: 'Services',     screen: 'Services',   color: '#3B82F6'      },
  { key: 'mybk',    Icon: ClipboardList, label: 'My Bookings',  screen: 'MyBookings', color: '#8B5CF6'      },
  { key: 'contact', Icon: Phone,         label: 'Contact',       screen: 'Contact',    color: '#22C55E'      },
];

const FEATURES = [
  { Icon: Leaf, text: 'Enjoy Rietvlei Zoo Farm while we work' },
  { Icon: Hand, text: 'Expert hand-wash every time'            },
  { Icon: Zap,  text: 'Fast, efficient & careful'              },
  { Icon: Gem,  text: 'Premium products only'                  },
];

export default function HomeScreen({ navigation }) {
  // Animations
  const logoAnim    = useRef(new Animated.Value(0)).current;
  const headingAnim = useRef(new Animated.Value(0)).current;
  const cardAnim    = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const featAnim    = useRef(new Animated.Value(30)).current;
  const featOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(headingAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(cardAnim,    { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(featOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(featAnim,    { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const heroContent = (
    <>
      {/* Dark overlay for readability */}
      <View style={styles.heroOverlay} />

      {/* Background accent */}
      <View style={styles.heroAccent} />

      {/* Logo block */}
      <Animated.View style={[styles.logoBlock, { opacity: logoAnim }]}>
        <View style={styles.logoCircle}>
          {logoSource ? (
            <Image
              source={logoSource}
              style={styles.logoImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.logoFallback}>CW</Text>
          )}
        </View>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>EST. 2024</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: headingAnim }}>
        <Text style={styles.brandName}>The Carwash</Text>
        <Text style={styles.brandSub}>Car Wash @Rietvlei</Text>
        <Text style={styles.tagline}>
          Uniquely designed with the Customer's Experience in mind
        </Text>
      </Animated.View>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      {/* Hero */}
      {heroBgSource ? (
        <ImageBackground
          source={heroBgSource}
          style={styles.hero}
          resizeMode="cover"
        >
          {heroContent}
        </ImageBackground>
      ) : (
        <View style={styles.hero}>
          {heroContent}
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.section,
            { opacity: cardOpacity, transform: [{ translateY: cardAnim }] },
          ]}
        >
          <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={[styles.actionCard, { borderTopColor: action.color }]}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: action.color + '18' }]}>
                  <action.Icon size={24} color={action.color} strokeWidth={2} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Features */}
        <Animated.View
          style={[
            styles.section,
            { opacity: featOpacity, transform: [{ translateY: featAnim }] },
          ]}
        >
          <Text style={styles.sectionLabel}>WHY CHOOSE US</Text>
          <View style={styles.featuresCard}>
            {FEATURES.map((f, i) => (
              <View key={i} style={[styles.featureRow, i < FEATURES.length - 1 && styles.featureBorder]}>
                <View style={styles.featureIconWrap}>
                  <f.Icon size={20} color={COLORS.primary} strokeWidth={2} />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Trading Hours */}
        <Animated.View style={[styles.section, { opacity: featOpacity }]}>
          <Text style={styles.sectionLabel}>TRADING HOURS</Text>
          <View style={styles.hoursCard}>
            <Text style={styles.hoursDay}>Monday – Sunday</Text>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursTime}>07:30</Text>
              <View style={styles.hoursDivider} />
              <Text style={styles.hoursTime}>17:00</Text>
            </View>
            <Text style={styles.hoursNote}>Open every day including public holidays</Text>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.section, { opacity: featOpacity }]}>
          <AnimatedButton
            title="Book Your Wash Now"
            onPress={() => navigation.navigate('Booking')}
            variant="primary"
            size="lg"
          />
          <View style={{ height: SPACING.sm }} />
          <AnimatedButton
            title="View All Services"
            onPress={() => navigation.navigate('Services')}
            variant="outline"
            size="lg"
          />
        </Animated.View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.accent },

  // ── Hero ──
  hero: {
    backgroundColor: COLORS.black,
    paddingTop: STATUS_BAR_HEIGHT + (Platform.OS === 'ios' ? 50 : 16),
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  heroAccent: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    opacity: 0.12,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoFallback: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: FONTS.body,
  },
  badgeRow: { flexDirection: 'row' },
  badge: {
    backgroundColor: COLORS.primary + '30',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.primary + '60',
  },
  badgeText: {
    color: COLORS.lightGray,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
    fontFamily: FONTS.body,
  },
  brandName: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    fontFamily: FONTS.heading,
    letterSpacing: -0.5,
  },
  brandSub: {
    color: COLORS.primary,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 2,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.body,
  },
  tagline: {
    color: COLORS.lightGray,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    fontFamily: FONTS.body,
    paddingHorizontal: SPACING.xl,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: { paddingTop: SPACING.lg, paddingHorizontal: SPACING.md },
  section: { marginBottom: SPACING.lg },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mediumGray,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.body,
  },

  // ── Actions Grid ──
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  actionCard: {
    width: (width - SPACING.md * 2 - SPACING.sm) / 2 - 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderTopWidth: 4,
    ...SHADOWS.sm,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.body,
    textAlign: 'center',
  },

  // ── Features ──
  featuresCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  featureBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    fontFamily: FONTS.body,
    lineHeight: 20,
  },

  // ── Hours ──
  hoursCard: {
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  hoursDay: {
    color: COLORS.lightGray,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    fontFamily: FONTS.body,
    letterSpacing: 1,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  hoursTime: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '900',
    fontFamily: FONTS.heading,
  },
  hoursDivider: {
    width: 32,
    height: 3,
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    borderRadius: 2,
  },
  hoursNote: {
    color: COLORS.mediumGray,
    fontSize: 11,
    fontFamily: FONTS.body,
  },
});