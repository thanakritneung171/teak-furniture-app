import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  TaskDetail: { id: string };
  History: { id: string; taskNumber?: string };
  OrderDetail: { id: string };
  CreateOrder: undefined;
  AddProduct: { orderId: string; orderNumber?: string };
  Notifications: undefined;
  Employees: undefined;
  CreateEmployee: undefined;
};

export type Nav = NativeStackNavigationProp<RootStackParamList>;
