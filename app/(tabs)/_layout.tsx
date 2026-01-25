import IonIcon from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TableLayout() {
  return <Tabs screenOptions={{tabBarActiveTintColor: '#d3d3ff', headerStyle: {backgroundColor: '#967bb6'}, headerShadowVisible: false, headerTitleStyle: {color: '#d3d3ff'}, tabBarStyle: {backgroundColor: '#1e1e2e'}, tabBarInactiveTintColor: '#8080aa'}} >
    <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({color, focused}) => (
      <IonIcon name={focused ? 'home' : 'home-outline'} size={24} color={color} />
    )}} />
    <Tabs.Screen name="log" options={{ title: 'Logs', tabBarIcon: ({color, focused}) => (
      <IonIcon name={focused ? 'folder-open' : 'folder-outline'} size={24} color={color} />
    ) }} /> 
    <Tabs.Screen name="timeline" options={{ title: 'Timeline', tabBarIcon: ({color, focused}) => (
      <IonIcon name={focused ? 'time' : 'time-outline'} size={24} color={color} />
    ) }} /> 
    <Tabs.Screen name="insights" options={{ title: 'Insights', tabBarIcon: ({color, focused}) => (
      <IonIcon name={focused ? 'clipboard' : 'clipboard-outline'} size={24} color={color} />
    ) }} /> 
    <Tabs.Screen name="tips" options={{ title: 'Tips', tabBarIcon: ({color, focused}) => (
      <IonIcon name={focused ? 'time' : 'time-outline'} size={24} color={color} />
    ) }} /> 
  </Tabs>;
}