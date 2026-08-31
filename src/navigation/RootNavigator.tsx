import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, font } from '../theme/tokens';
import { useAuth } from '../store/auth';
import { Loading } from '../components/ui';
import { RootStackParamList } from './types';
import LoginScreen from '../screens/LoginScreen';
import Tabs from './Tabs';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;

  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.page },
            headerTintColor: colors.forest900,
            headerTitleStyle: { fontFamily: font.semibold },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.page },
          }}
        >
          <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'รายละเอียดงาน' }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'ประวัติงาน' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
