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
import OrderDetailScreen from '../screens/OrderDetailScreen';
import CreateOrderScreen from '../screens/CreateOrderScreen';
import AddProductScreen from '../screens/AddProductScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EmployeesScreen from '../screens/EmployeesScreen';
import CreateEmployeeScreen from '../screens/CreateEmployeeScreen';

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
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'รายละเอียดออเดอร์' }} />
          <Stack.Screen name="CreateOrder" component={CreateOrderScreen} options={{ title: 'สร้างออเดอร์' }} />
          <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'เพิ่มสินค้า' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'แจ้งเตือน' }} />
          <Stack.Screen name="Employees" component={EmployeesScreen} options={{ title: 'จัดการพนักงาน' }} />
          <Stack.Screen name="CreateEmployee" component={CreateEmployeeScreen} options={{ title: 'เพิ่มพนักงาน' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
