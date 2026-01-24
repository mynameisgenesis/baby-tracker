import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack.Screen options={{ title: 'Not Found' }} />

      <Text>Sorry, the page you are looking for does not exist.</Text>

      <Link href="/">Go back to home screen</Link>
    </View>
  );
}