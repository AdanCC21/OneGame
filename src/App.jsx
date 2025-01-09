import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import { Home } from "./Home";
import { ConfigPlayers, ViewPlayers } from "./Players";
import { Game } from "./Game";
import { Gamme } from "./game2";

export default function App() {
  let [numPlayers, setNumPlayers] = useState(0);
  let [players, setPlayers] = useState(Array(numPlayers).fill(['', '']));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setPlayers={setNumPlayers} />} />

        <Route path="/players" element={<ConfigPlayers playersCount={numPlayers} setPlayers={setPlayers} />} />
        
        <Route path="/players/preview" element={<ViewPlayers players={players} />} />
        
        <Route path="/game" element={<Game players={players} />} />
        
        <Route path="/game2" element={<Gamme players={players} />} />
      </Routes>
    </Router>
  );
}


