import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../context/authContext';

// Import Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ServiceDetailScreen from '../screens/services/ServiceDetailScreen';
import BookingScreen from '../screens/bookings/BookingScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SearchScreen from '../screens/search/SearchScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import BookingsManagementScreen from '../screens/bookings/BookingsManagementScreen';
import ServiceListScreen from '../screens/services/ServiceListScreen';
import AddServiceScreen from '../screens/services/AddServiceScreen';

// Icon imports
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Auth Stack Navigator
 * Handles authentication flow screens
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

/**
 * Main App Stack Navigator
 * Client/User app navigation
 */
const ClientAppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'BookingsTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MessagesTab') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Event Compass',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: 'Search Services',
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsManagementScreen}
        options={{
          title: 'My Bookings',
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesScreen}
        options={{
          title: 'Messages',
          tabBarLabel: 'Messages',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Service Provider Dashboard Stack
 * Handles service provider tab navigation
 */
const ProviderDashboardTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'ServicesTab') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'BookingsTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MessagesTab') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="ServicesTab"
        component={ServiceListScreen}
        options={{
          title: 'My Services',
          tabBarLabel: 'Services',
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsManagementScreen}
        options={{
          title: 'Bookings',
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesScreen}
        options={{
          title: 'Messages',
          tabBarLabel: 'Messages',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Service Provider App Stack
 * Navigation for service providers
 */
const ProviderAppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ProviderDashboard"
        component={ProviderDashboardTabs}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{
          title: 'Add Service',
          headerShown: true,
          headerBackTitleVisible: false,
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Root Navigation Component
 * Main entry point for navigation logic
 * 
 * Authentication Flow:
 * 1. Initialize auth state from AsyncStorage
 * 2. Show loading screen while checking auth
 * 3. If authenticated (token + user exist) → Show App Stack (Client or Provider)
 * 4. If NOT authenticated → Show Auth Stack (Login/Register only)
 */
export default function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  // Subscribe to token and user changes from Zustand
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const initAuth = useAuthStore((state) => state.initAuth);
  const navigationRef = React.useRef();

  useEffect(() => {
    // Initialize auth from persistent storage (runs only once on mount)
    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        await initAuth();
        console.log('✅ Auth initialization complete');
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeAuth();
    // Empty dependency array - Zustand functions are stable
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    console.log('================================================');
    console.log('📡 AUTH STATE CHANGED IN ROOTNAVIGATOR');
    console.log('================================================');
    console.log('Token:', token ? `✅ ${token.substring(0, 20)}...` : '❌ null');
    console.log('User:', user ? `✅ ${user.email}` : '❌ null');
    console.log('isReady:', isReady);
    console.log('isUserAuthenticated:', !!(token && user && (user.id || user._id)));
    console.log('================================================');
    
    // If user logs out (token becomes null), reset navigation to login
    if (!token && isReady) {
      console.log('🚨 LOGOUT DETECTED! Resetting navigation to AuthStack...');
      if (navigationRef.current) {
        console.log('✅ navigationRef available - resetting...');
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        console.log('✅ Navigation reset complete');
      } else {
        console.error('❌ navigationRef not available!');
      }
    }
  }, [token, user, isReady]);

  // Show loading screen while checking auth status
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // Check if user is authenticated (must have BOTH token AND user data)
  // Note: Backend returns _id (MongoDB), not id
  const isUserAuthenticated = !!(token && user && (user.id || user._id));
  
  const userId = user?.id || user?._id || 'unknown';
  
  // Create a simple navigation key - short and effective
  // 'auth_USERID' when logged in, 'unauth' when logged out
  // This forces complete re-render of navigation stack
  const navigationKey = isUserAuthenticated ? `auth_${userId}` : `unauth_${Date.now()}`;

  console.log(`🔐 Navigation Auth Check:
    - Token: ${token ? '✅' : '❌'} (${token ? token.substring(0, 20) + '...' : 'none'})
    - User: ${user ? '✅' : '❌'} (${user?.email || 'no email'})
    - User ID: ${userId}
    - Is Authenticated: ${isUserAuthenticated ? '✅ YES' : '❌ NO'}
    - Navigation Key: ${navigationKey}
  `);

  console.log(`🔐 Navigation State: ${isUserAuthenticated ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);

  return (
    <NavigationContainer 
      key={navigationKey}
      ref={navigationRef}
    >
      {isUserAuthenticated ? (
        // ✅ USER IS LOGGED IN - Show appropriate app stack
        user.role === 'service_provider' || user.role === 'admin' ? (
          // Service Provider/Admin Dashboard
          <ProviderAppStack />
        ) : (
          // Regular Client App
          <ClientAppStack />
        )
      ) : (
        // ❌ USER IS NOT LOGGED IN - Show login/register only
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
