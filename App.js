import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { COLORS } from './styles/theme';

import HomeScreen       from './screens/HomeScreen';
import ServicesScreen   from './screens/ServicesScreen';
import BookingScreen    from './screens/BookingScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import ContactScreen    from './screens/ContactScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Home"       component={HomeScreen}       />
        <Stack.Screen name="Services"   component={ServicesScreen}   />
        <Stack.Screen name="Booking"    component={BookingScreen}    />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
        <Stack.Screen name="Contact"    component={ContactScreen}    />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
