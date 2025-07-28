import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  console.log('App component rendering...');
  
  return (
    <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, color: 'white' }}>Hello World!</Text>
      <Text style={{ fontSize: 18, color: 'white' }}>Test App</Text>
      <Text style={{ fontSize: 16, color: 'white' }}>Time: {Date.now()}</Text>
    </View>
  );
} 