import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS, getStatusColor } from '../styles/theme';

export default function BookingCard({ booking }) {
  const statusColor = getStatusColor(booking.status);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-ZA', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      {/* Status bar accent */}
      <View style={[styles.statusBar, { backgroundColor: statusColor }]} />

      <View style={styles.inner}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.serviceWrap}>
            <Text style={styles.serviceText}>{booking.service}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20', borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{booking.status}</Text>
          </View>
        </View>

        {/* Details grid */}
        <View style={styles.detailsGrid}>
          <Detail icon="🗓" label="Date"    value={formatDate(booking.booking_date)} />
          <Detail icon="⏰" label="Time"    value={booking.booking_time} />
          <Detail icon="🚗" label="Vehicle" value={booking.vehicle_type} />
          <Detail icon="📞" label="Phone"   value={booking.phone} />
        </View>

        {/* Booking ID */}
        <Text style={styles.bookingId}>Ref: {booking.id?.slice(0, 8).toUpperCase()}</Text>
      </View>
    </View>
  );
}

function Detail({ icon, label, value }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  statusBar: {
    width: 5,
  },
  inner: {
    flex: 1,
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  serviceWrap: {},
  serviceText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.black,
    fontFamily: FONTS.body,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONTS.body,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    marginBottom: 4,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.lightGray,
    fontFamily: FONTS.body,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontWeight: '600',
    fontFamily: FONTS.body,
  },
  bookingId: {
    fontSize: 10,
    color: COLORS.lightGray,
    fontFamily: FONTS.body,
    marginTop: 4,
  },
});
