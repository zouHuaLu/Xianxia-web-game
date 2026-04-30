import { GameLayout } from './components/GameLayout';
import { StartScreen } from './components/StartScreen';
import { useGameStore } from './store/gameStore';

function App() {
  const isStarted = useGameStore((state) => state.isStarted);

  return isStarted ? <GameLayout /> : <StartScreen />;
}

export default App;
