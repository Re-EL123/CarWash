import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity,
  Alert, Animated, Platform, Modal, StatusBar, Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ArrowLeft, Check, CheckCircle, Calendar, Clock,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS, STATUS_BAR_HEIGHT } from '../styles/theme';
import AnimatedButton from '../components/AnimatedButton';
import { fetchServices, createBooking } from '../lib/supabase';

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

const VEHICLE_TYPES = ['Sedan', 'Hatchback', 'SUV / 4x4', 'Bakkie', 'Minibus / Van', 'Luxury'];

const TIME_SLOTS = [
  '07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00',
  '11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00',
  '15:30','16:00','16:30',
];

const STEPS = ['Service', 'Schedule', 'Details', 'Confirm'];

export default function BookingScreen({ navigation, route }) {
  const preSelected = route?.params?.service || null;

  const [step, setStep]               = useState(preSelected ? 1 : 0);
  const [services, setServices]       = useState([]);
  const [selectedService, setSelected] = useState(preSelected);
  const [selectedDate, setDate]       = useState('');
  const [selectedTime, setTime]       = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleReg, setVehicleReg]   = useState('');
  const [name, setName]               = useState('');
  const [phone, setPhone]             = useState('');
  const [notes, setNotes]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [bookingRef, setBookingRef]   = useState('');

  // Date picker state
  const [showDatePicker, setShowDatePicker]   = useState(false);
  const [tempDate, setTempDate]               = useState(new Date());

  const stepAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchServices().then(setServices).catch(() => {});
  }, []);

  const goToStep = (n) => {
    Animated.sequence([
      Animated.timing(stepAnim, { toValue: -20, duration: 150, useNativeDriver: true }),
      Animated.timing(stepAnim, { toValue: 0,   duration: 200, useNativeDriver: true }),
    ]).start();
    setStep(n);
  };

  const validateStep = () => {
    switch (step) {
      case 0: return !!selectedService;
      case 1: return !!selectedDate && !!selectedTime;
      case 2: return name.trim().length > 1 && phone.trim().length >= 9 && !!vehicleType;
      default: return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      Alert.alert('Required', stepError());
      return;
    }
    goToStep(step + 1);
  };

  const stepError = () => {
    switch (step) {
      case 0: return 'Please select a service.';
      case 1: return 'Please select a date and time.';
      case 2: return 'Please fill in all required fields.';
      default: return '';
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const booking = {
        customer_name: name.trim(),
        phone:         phone.trim(),
        vehicle_type:  vehicleType,
        vehicle_reg:   vehicleReg.trim(),
        service:       selectedService.name,
        service_id:    selectedService.id,
        booking_date:  selectedDate,
        booking_time:  selectedTime,
        notes:         notes.trim(),
        status:        'Pending',
      };
      const result = await createBooking(booking);
      setBookingRef(result.id?.slice(0, 8).toUpperCase());
      setSuccess(true);
    } catch (e) {
      Alert.alert('Error', 'Could not submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const getMinDate = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getMinDateObj = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const formatDate = (s) => {
    if (!s) return '';
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // ── Date picker handlers ──
  const openDatePicker = () => {
    if (selectedDate) {
      setTempDate(new Date(selectedDate + 'T00:00:00'));
    } else {
      setTempDate(new Date());
    }
    setShowDatePicker(true);
  };

  const onDateChangeAndroid = (event, date) => {
    setShowDatePicker(false);
    if (event.type === 'dismissed' || !date) return;
    const formatted = date.toISOString().split('T')[0];
    setDate(formatted);
  };

  const onDateChangeIOS = (event, date) => {
    if (date) setTempDate(date);
  };

  const confirmIOSDate = () => {
    const formatted = tempDate.toISOString().split('T')[0];
    setDate(formatted);
    setShowDatePicker(false);
  };

  const cancelIOSDate = () => {
    setShowDatePicker(false);
  };

  // ── Success Screen ──
  if (success) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
        <View style={styles.successCard}>
          <View style={styles.successIconWrap}>
            <CheckCircle size={64} color="#22C55E" strokeWidth={1.5} />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successRef}>Ref: {bookingRef}</Text>
          <Text style={styles.successMsg}>
            We'll reach out on {phone} to confirm your booking.
          </Text>
          <View style={styles.successDetails}>
            <SuccessRow label="Service"  value={selectedService?.name} />
            <SuccessRow label="Date"     value={formatDate(selectedDate)} />
            <SuccessRow label="Time"     value={selectedTime} />
            <SuccessRow label="Vehicle"  value={vehicleType} />
          </View>
          <AnimatedButton title="Back to Home" onPress={() => navigation.navigate('Home')} />
          <View style={{ height: SPACING.sm }} />
          <AnimatedButton title="My Bookings" onPress={() => navigation.navigate('MyBookings', { phone })} variant="outline" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 0 ? navigation.goBack() : goToStep(step - 1)} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {logoSource ? (
            <Image source={logoSource} style={styles.headerLogo} resizeMode="cover" />
          ) : null}
          <Text style={styles.headerTitle}>Book a Wash</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Progress */}
      <View style={styles.progress}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <TouchableOpacity
              onPress={() => i < step && goToStep(i)}
              style={styles.stepWrap}
            >
              <View style={[styles.stepCircle, i <= step && styles.stepActive, i < step && styles.stepDone]}>
                {i < step ? (
                  <Check size={14} color={COLORS.white} strokeWidth={3} />
                ) : (
                  <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
            </TouchableOpacity>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, i < step && styles.stepLineDone]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View style={{ transform: [{ translateX: stepAnim }] }}>

          {/* Step 0 — Service */}
          {step === 0 && (
            <View>
              <SectionTitle title="Choose a Service" />
              {services.map((svc) => (
                <TouchableOpacity
                  key={svc.id}
                  style={[styles.serviceRow, selectedService?.id === svc.id && styles.serviceRowSelected]}
                  onPress={() => setSelected(svc)}
                >
                  <View style={styles.serviceRowLeft}>
                    <View style={[styles.radioOuter, selectedService?.id === svc.id && styles.radioOuterActive]}>
                      {selectedService?.id === svc.id && <View style={styles.radioInner} />}
                    </View>
                    <View>
                      <Text style={styles.serviceRowName}>{svc.name}</Text>
                      <Text style={styles.serviceRowDesc}>{svc.description}</Text>
                    </View>
                  </View>
                  {svc.price > 0 && <Text style={styles.serviceRowPrice}>R{svc.price}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Step 1 — Schedule */}
          {step === 1 && (
            <View>
              <View style={styles.scheduleSectionHeader}>
                <Calendar size={18} color={COLORS.primary} strokeWidth={2} />
                <SectionTitle title="Pick a Date" style={{ marginLeft: SPACING.sm, marginBottom: 0 }} />
              </View>
              <View style={{ height: SPACING.sm }} />

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={openDatePicker}
                activeOpacity={0.7}
              >
                <Calendar size={20} color={selectedDate ? COLORS.primary : COLORS.lightGray} strokeWidth={2} />
                <Text style={[styles.datePickerText, !selectedDate && styles.datePickerPlaceholder]}>
                  {selectedDate ? formatDate(selectedDate) : 'Tap to select a date'}
                </Text>
              </TouchableOpacity>

              {selectedDate ? (
                <Text style={styles.inputHint}>Selected: {selectedDate}</Text>
              ) : (
                <Text style={styles.inputHint}>Min date: {getMinDate()}</Text>
              )}

              {/* Android DateTimePicker (shows as dialog) */}
              {Platform.OS === 'android' && showDatePicker && (
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="default"
                  minimumDate={getMinDateObj()}
                  onChange={onDateChangeAndroid}
                />
              )}

              {/* iOS DateTimePicker (shows in modal) */}
              {Platform.OS === 'ios' && (
                <Modal
                  visible={showDatePicker}
                  transparent
                  animationType="slide"
                  onRequestClose={cancelIOSDate}
                >
                  <View style={styles.dateModalOverlay}>
                    <View style={styles.dateModalContent}>
                      <View style={styles.dateModalHeader}>
                        <TouchableOpacity onPress={cancelIOSDate}>
                          <Text style={styles.dateModalCancel}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.dateModalTitle}>Select Date</Text>
                        <TouchableOpacity onPress={confirmIOSDate}>
                          <Text style={styles.dateModalDone}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display="spinner"
                        minimumDate={getMinDateObj()}
                        onChange={onDateChangeIOS}
                        style={styles.iosDatePicker}
                        textColor={COLORS.black}
                      />
                    </View>
                  </View>
                </Modal>
              )}

              <View style={styles.scheduleSectionHeader}>
                <Clock size={18} color={COLORS.primary} strokeWidth={2} />
                <SectionTitle title="Pick a Time" style={{ marginLeft: SPACING.sm, marginBottom: 0, marginTop: 0 }} />
              </View>
              <View style={{ height: SPACING.sm }} />

              <View style={styles.timeGrid}>
                {TIME_SLOTS.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.timeChip, selectedTime === t && styles.timeChipSelected]}
                    onPress={() => setTime(t)}
                  >
                    <Text style={[styles.timeChipText, selectedTime === t && styles.timeChipTextSelected]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 2 — Details */}
          {step === 2 && (
            <View>
              <SectionTitle title="Your Details" />
              <Label text="Full Name *" />
              <TextInput
                style={styles.input}
                placeholder="e.g. John Smith"
                placeholderTextColor={COLORS.lightGray}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <Label text="Phone Number *" />
              <TextInput
                style={styles.input}
                placeholder="e.g. 072 318 3495"
                placeholderTextColor={COLORS.lightGray}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <SectionTitle title="Vehicle" style={{ marginTop: SPACING.md }} />
              <Label text="Vehicle Type *" />
              <View style={styles.chipGrid}>
                {VEHICLE_TYPES.map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={[styles.typeChip, vehicleType === v && styles.typeChipSelected]}
                    onPress={() => setVehicleType(v)}
                  >
                    <Text style={[styles.typeChipText, vehicleType === v && styles.typeChipTextSelected]}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Label text="Registration Number (optional)" />
              <TextInput
                style={styles.input}
                placeholder="e.g. GP 123-456"
                placeholderTextColor={COLORS.lightGray}
                value={vehicleReg}
                onChangeText={setVehicleReg}
                autoCapitalize="characters"
              />

              <Label text="Additional Notes (optional)" />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special requests?"
                placeholderTextColor={COLORS.lightGray}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>
          )}

          {/* Step 3 — Confirm */}
          {step === 3 && (
            <View>
              <SectionTitle title="Confirm Booking" />
              <View style={styles.summaryCard}>
                <SummaryRow label="Service"   value={selectedService?.name} />
                <SummaryRow label="Date"      value={formatDate(selectedDate)} />
                <SummaryRow label="Time"      value={selectedTime} />
                <SummaryRow label="Vehicle"   value={`${vehicleType}${vehicleReg ? ' · ' + vehicleReg : ''}`} />
                <SummaryRow label="Name"      value={name} />
                <SummaryRow label="Phone"     value={phone} />
                {notes ? <SummaryRow label="Notes" value={notes} /> : null}
                {selectedService?.price > 0 && (
                  <SummaryRow label="Approx. Price" value={`R${selectedService.price}`} highlight />
                )}
              </View>
              <Text style={styles.disclaimer}>
                By confirming, you agree that our staff may contact you to finalise your booking.
                Trading hours: Mon–Sun 07:30–17:00.
              </Text>
            </View>
          )}

        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {step < STEPS.length - 1 ? (
          <AnimatedButton title={`Next: ${STEPS[step + 1]} →`} onPress={handleNext} />
        ) : (
          <AnimatedButton
            title="Confirm Booking"
            onPress={handleSubmit}
            loading={loading}
          />
        )}
      </View>
    </View>
  );
}

// ── Sub-components ──
function SectionTitle({ title, style }) {
  return <Text style={[titleStyles.title, style]}>{title}</Text>;
}
function Label({ text }) {
  return <Text style={titleStyles.label}>{text}</Text>;
}
function SummaryRow({ label, value, highlight }) {
  return (
    <View style={summaryStyles.row}>
      <Text style={summaryStyles.label}>{label}</Text>
      <Text style={[summaryStyles.value, highlight && summaryStyles.highlight]}>{value}</Text>
    </View>
  );
}
function SuccessRow({ label, value }) {
  return (
    <View style={successRowStyles.row}>
      <Text style={successRowStyles.label}>{label}</Text>
      <Text style={successRowStyles.value}>{value}</Text>
    </View>
  );
}

const titleStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.black,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.body,
  },
  label: {
    fontSize: 12,
    color: COLORS.mediumGray,
    marginBottom: 4,
    marginTop: SPACING.sm,
    fontFamily: FONTS.body,
    fontWeight: '600',
  },
});
const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  label: {
    fontSize: 13,
    color: COLORS.mediumGray,
    fontFamily: FONTS.body,
    flex: 1,
  },
  value: {
    fontSize: 13,
    color: COLORS.black,
    fontWeight: '600',
    fontFamily: FONTS.body,
    flex: 2,
    textAlign: 'right',
  },
  highlight: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '800',
  },
});
const successRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
    width: '100%',
  },
  label: { fontSize: 12, color: COLORS.mediumGray, fontFamily: FONTS.body },
  value: { fontSize: 12, fontWeight: '700', color: COLORS.black, fontFamily: FONTS.body },
});

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.accent },
  successContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  successCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    ...SHADOWS.lg,
  },
  successIconWrap: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.black,
    fontFamily: FONTS.heading,
    marginBottom: SPACING.xs,
  },
  successRef: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  successMsg: {
    fontSize: 14,
    color: COLORS.mediumGray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontFamily: FONTS.body,
    lineHeight: 20,
  },
  successDetails: { width: '100%', marginBottom: SPACING.lg },

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

  // Progress
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  stepWrap: { alignItems: 'center' },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  stepActive: { borderColor: COLORS.primary },
  stepDone:   { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepNum:    { fontSize: 11, fontWeight: '700', color: COLORS.lightGray },
  stepNumActive: { color: COLORS.primary },
  stepLabel:  { fontSize: 9, color: COLORS.lightGray, fontFamily: FONTS.body, textAlign: 'center' },
  stepLabelActive: { color: COLORS.primary, fontWeight: '700' },
  stepLine:   { flex: 1, height: 2, backgroundColor: COLORS.accent, marginBottom: 14 },
  stepLineDone: { backgroundColor: COLORS.primary },

  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  // Schedule section headers
  scheduleSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: 0,
  },

  // Date picker
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    ...SHADOWS.sm,
  },
  datePickerText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.black,
    fontFamily: FONTS.body,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  datePickerPlaceholder: {
    color: COLORS.lightGray,
    fontWeight: '400',
  },

  // iOS date modal
  dateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dateModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
  },
  dateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  dateModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.body,
  },
  dateModalCancel: {
    fontSize: 15,
    color: COLORS.mediumGray,
    fontFamily: FONTS.body,
    fontWeight: '600',
  },
  dateModalDone: {
    fontSize: 15,
    color: COLORS.primary,
    fontFamily: FONTS.body,
    fontWeight: '700',
  },
  iosDatePicker: {
    height: 216,
  },

  // Inputs
  input: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 15,
    color: COLORS.black,
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    fontFamily: FONTS.body,
    ...SHADOWS.sm,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  inputHint: { fontSize: 11, color: COLORS.lightGray, marginBottom: SPACING.sm, fontFamily: FONTS.body },

  // Service rows
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  serviceRowSelected: { borderColor: COLORS.primary, backgroundColor: '#FFF5F5' },
  serviceRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  radioOuterActive: { borderColor: COLORS.primary },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  serviceRowName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.body,
  },
  serviceRowDesc: {
    fontSize: 11,
    color: COLORS.mediumGray,
    fontFamily: FONTS.body,
  },
  serviceRowPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: FONTS.body,
  },

  // Time slots
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  timeChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    ...SHADOWS.sm,
  },
  timeChipSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  timeChipText: { fontSize: 13, color: COLORS.darkGray, fontFamily: FONTS.body, fontWeight: '600' },
  timeChipTextSelected: { color: COLORS.white },

  // Vehicle chips
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  typeChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  typeChipSelected: { borderColor: COLORS.primary, backgroundColor: '#FFF5F5' },
  typeChipText: { fontSize: 13, color: COLORS.darkGray, fontFamily: FONTS.body },
  typeChipTextSelected: { color: COLORS.primary, fontWeight: '700' },

  // Summary
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.mediumGray,
    textAlign: 'center',
    lineHeight: 17,
    fontFamily: FONTS.body,
  },

  // Bottom nav
  bottomNav: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.accent,
    ...SHADOWS.md,
  },
});