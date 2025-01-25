import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

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
        <Route path="/OneGame/" element={<Home setPlayers={setNumPlayers} />} />

        <Route path="/OneGame/players" element={<ConfigPlayers playersCount={numPlayers} setPlayers={setPlayers} />} />
        
        <Route path="/OneGame/players/preview" element={<ViewPlayers players={players} />} />
        
        <Route path="/OneGame/game" element={<Game players={players} />} />
        
        <Route path="/OneGame/gameDev" element={<Gamme players={players} />} />
      </Routes>
    </Router>
  );
}


