import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './css/players.css'
import { use } from 'react';

export function Players({ playersCount = 1 }) {
    let [users, setUser] = useState(Array(playersCount).fill(['url', 'name']));

    const handleInput = (event, index, campo) => {
        // Asegurarnos de que el valor de users[index] sea siempre un array
        const upUsers = [...users];
        upUsers[index] = Array.isArray(upUsers[index]) ? [...upUsers[index]] : ['url', 'name'];  // Verificar que sea un array
        upUsers[index][campo] = event.target.value;
        setUser(upUsers);
    };

    const createInputs = () => {
        return (
            <div className='p-config-players'>
                {Array.from({ length: playersCount }, (_, index) => {
                    // Asegurarnos de que users[index] siempre tenga el formato esperado
                    const player = Array.isArray(users[index]) ? users[index] : ['url', 'name'];
                    return (
                        <div className='player' key={index}>
                            <img src={player[0]} alt={`Jugador ${index + 1}`} />
                            <div>
                                <input
                                    value={player[0]}
                                    onChange={(event) => handleInput(event, index, 0)}
                                    type='text'
                                    placeholder={player[0]}
                                />
                                <input
                                    value={player[1]}
                                    onChange={(event) => handleInput(event, index, 1)}
                                    type='text'
                                    placeholder={player[1]}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className='p-config'>
            <h1>Jugadores</h1>
            {createInputs()}
            <button>Continuar</button>
        </div>
    );
}
