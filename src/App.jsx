import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import { Home } from "./Home";
import { Players } from "./Playes";

export default function App() {
  let [numPlayers, setPlayers] = useState(0);



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setPlayers={setPlayers} />} />
        <Route path="/players" element={<Players playersCount={numPlayers} />} />
      </Routes>
    </Router>
  );
}


