import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, font } from '../theme/tokens';
import { useAuth } from '../store/auth';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import BoardScreen from '../screens/BoardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OverviewScreen from '../screens/OverviewScreen';
import OrdersScreen from '../screens/OrdersScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();
const icon =
  (e: string) =>
  ({ color }: { color: string }) =>
    <Text style={{ fontSize: 20, color }}>{e}</Text>;

export default function Tabs() {
  const { user } = useAuth();
  const isWorker = user?.role === 'WORKER';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest900,
        tabBarInactiveTintColor: colors.mute,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontFamily: font.medium, fontSize: 11 },
      }}
    >
      {isWorker ? (
        <>
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'หน้าหลัก', tabBarIcon: icon('🏠') }} />
          <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: 'งาน', tabBarIcon: icon('📋') }} />
          <Tab.Screen name="Alerts" component={NotificationsScreen} options={{ title: 'แจ้งเตือน', tabBarIcon: icon('🔔') }} />
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'โปรไฟล์', tabBarIcon: icon('👤') }} />
        </>
      ) : (
        <>
          <Tab.Screen name="Overview" component={OverviewScreen} options={{ title: 'ภาพรวม', tabBarIcon: icon('📊') }} />
          <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: 'งาน', tabBarIcon: icon('📋') }} />
          <Tab.Screen name="Board" component={BoardScreen} options={{ title: 'บอร์ด', tabBarIcon: icon('🗂️') }} />
          <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'ออเดอร์', tabBarIcon: icon('📦') }} />
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'โปรไฟล์', tabBarIcon: icon('👤') }} />
        </>
      )}
    </Tab.Navigator>
  );
}
