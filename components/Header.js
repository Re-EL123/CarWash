import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTS, STATUS_BAR_HEIGHT } from '../styles/theme';

export default function Header({ title, showBack = false, onBack, rightAction }) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* Left */}
        <View style={styles.side}>
          {showBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.logoWrap}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>CW</Text>
              </View>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {title || 'The Carwash'}
        </Text>

        {/* Right */}
        <View style={styles.side}>
          {rightAction || null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    paddingTop: STATUS_BAR_HEIGHT + (Platform.OS === 'ios' ? 44 : 8),
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: {
    width: 44,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: FONTS.body,
    letterSpacing: 0.5,
  },
  backBtn: {
    padding: 4,
  },
  backArrow: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
