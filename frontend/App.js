import { AbrigoProvider } from './AppContext';
import AppNavigator from './src/navigation/AppNavigator.js';
                            
export default function App() {
  return (
    <AbrigoProvider>
      <AppNavigator />
    </AbrigoProvider>
  );
}