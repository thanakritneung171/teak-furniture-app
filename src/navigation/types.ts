import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  TaskDetail: { id: string };
  History: { id: string; taskNumber?: string };
};

export type Nav = NativeStackNavigationProp<RootStackParamList>;
