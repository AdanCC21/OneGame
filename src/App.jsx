import { useState } from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import { Home } from "./Home";
import { ConfigPlayers, ViewPlayers } from "./Players";
import { Game } from "./Game";
import { Gamme } from "./gameDev";

export default function App() {
  let [numPlayers, setNumPlayers] = useState(0);
  let [players, setPlayers] = useState(Array(numPlayers).fill(['', '']));

  return (
    <Router>
      <Routes>
        <Route path="/wolfForest" element={<Home setPlayers={setNumPlayers} />} />

        <Route path="/wolfForest/players" element={<ConfigPlayers playersCount={numPlayers} setPlayers={setPlayers} />} />
        
        <Route path="/wolfForest/players/preview" element={<ViewPlayers players={players} />} />
        
        <Route path="/wolfForest/game" element={<Game players={players} />} />
        
        <Route path="/wolfForest/gameDev" element={<Gamme players={players} />} />
      </Routes>
    </Router>
  );
}


