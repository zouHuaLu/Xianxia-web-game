import { DeathScreen } from './components/DeathScreen';
import { GameLayout } from './components/GameLayout';
import { StartScreen } from './components/StartScreen';
import { useGameStore } from './store/gameStore';

function App() {
  const deathRecord = useGameStore((state) => state.deathRecord);
  const isStarted = useGameStore((state) => state.isStarted);

  if (deathRecord) {
    return <DeathScreen />;
  }

  return isStarted ? <GameLayout /> : <StartScreen />;
}

export default App;
