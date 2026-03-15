import { Platform, StatusBar } from 'react-native';

export const COLORS = {
  primary:     '#D7262E',
  primaryDark: '#A81B22',
  primaryLight:'#F04850',
  black:       '#111111',
  darkGray:    '#222222',
  mediumGray:  '#555555',
  lightGray:   '#B0B0B0',
  accent:      '#F3F3F3',
  white:       '#FFFFFF',
  success:     '#22C55E',
  warning:     '#F59E0B',
  info:        '#3B82F6',
  danger:      '#EF4444',
  statusPending:    '#F59E0B',
  statusConfirmed:  '#3B82F6',
  statusInProgress: '#8B5CF6',
  statusCompleted:  '#22C55E',
  statusCancelled:  '#EF4444',
};

export const FONTS = {
  heading: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  body:    Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#D7262E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':     return COLORS.statusPending;
    case 'Confirmed':   return COLORS.statusConfirmed;
    case 'In Progress': return COLORS.statusInProgress;
    case 'Completed':   return COLORS.statusCompleted;
    case 'Cancelled':   return COLORS.statusCancelled;
    default:            return COLORS.lightGray;
  }
};