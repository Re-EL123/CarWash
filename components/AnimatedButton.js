import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS, FONTS } from '../styles/theme';

export default function AnimatedButton({
  title,
  onPress,
  variant = 'primary',   // 'primary' | 'outline' | 'ghost' | 'danger'
  size = 'md',           // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = true,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const variantStyles = {
    primary: {
      container: { backgroundColor: COLORS.primary, ...SHADOWS.lg },
      text:      { color: COLORS.white },
    },
    outline: {
      container: { backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.primary },
      text:      { color: COLORS.primary },
    },
    ghost: {
      container: { backgroundColor: COLORS.accent },
      text:      { color: COLORS.black },
    },
    danger: {
      container: { backgroundColor: COLORS.danger, ...SHADOWS.md },
      text:      { color: COLORS.white },
    },
    dark: {
      container: { backgroundColor: COLORS.black, ...SHADOWS.md },
      text:      { color: COLORS.white },
    },
  };

  const sizeStyles = {
    sm: { paddingVertical: SPACING.xs + 2, paddingHorizontal: SPACING.md,  fontSize: 13 },
    md: { paddingVertical: SPACING.sm + 4, paddingHorizontal: SPACING.lg,  fontSize: 15 },
    lg: { paddingVertical: SPACING.md,     paddingHorizontal: SPACING.xl,  fontSize: 16 },
  };

  const v = variantStyles[variant] || variantStyles.primary;
  const s = sizeStyles[size]       || sizeStyles.md;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, fullWidth && { width: '100%' }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[
          styles.base,
          v.container,
          { paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal },
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={v.text.color} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <Text style={[styles.text, v.text, { fontSize: s.fontSize }, textStyle]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: { opacity: 0.5 },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: FONTS.body,
    textAlign: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconWrap: { marginRight: SPACING.sm },
});