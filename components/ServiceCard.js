import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../styles/theme';

const ICON_MAP = {
  droplets:    '💧',
  wind:        '🌬️',
  sparkles:    '✨',
  'spray-can': '🧴',
  settings:    '⚙️',
  star:        '⭐',
  'circle-dot':'⚫',
  default:     '🚗',
};

export default function ServiceCard({ service, onSelect, selected = false }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 50 }).start();
  };

  const emoji = ICON_MAP[service.icon] || ICON_MAP.default;

  return (
    <Animated.View style={{ transform: [{ scale }], marginBottom: SPACING.md }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onSelect && onSelect(service)}
        activeOpacity={0.9}
        style={[
          styles.card,
          selected && styles.cardSelected,
        ]}
      >
        {/* Selected badge */}
        {selected && <View style={styles.selectedBadge}><Text style={styles.selectedBadgeText}>✓</Text></View>}

        {/* Icon circle */}
        <View style={[styles.iconCircle, selected && styles.iconCircleSelected]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.name, selected && styles.nameSelected]}>
            {service.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {service.description}
          </Text>
          <View style={styles.meta}>
            {service.price > 0 && (
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>R{service.price}</Text>
              </View>
            )}
            {service.duration_minutes > 0 && (
              <Text style={styles.duration}>⏱ {service.duration_minutes} min</Text>
            )}
          </View>
        </View>

        {/* Chevron */}
        <Text style={[styles.chevron, selected && styles.chevronSelected]}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.md,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F5',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconCircleSelected: {
    backgroundColor: '#FFE0E1',
  },
  emoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 3,
    fontFamily: FONTS.body,
  },
  nameSelected: {
    color: COLORS.primary,
  },
  description: {
    fontSize: 12,
    color: COLORS.mediumGray,
    lineHeight: 17,
    marginBottom: 6,
    fontFamily: FONTS.body,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  priceBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  priceText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: FONTS.body,
  },
  duration: {
    fontSize: 11,
    color: COLORS.mediumGray,
    fontFamily: FONTS.body,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.lightGray,
    marginLeft: SPACING.sm,
  },
  chevronSelected: {
    color: COLORS.primary,
  },
});
