import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';
import {ThemeProvider} from './src/context';
import {MainNavigator} from './src/navigation';
import {store} from './src/store';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <ThemeProvider>
            <MainNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
