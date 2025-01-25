import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './css/players.css'

// Validaciones
/**
 * Cada nombre que sea unico
 * nombre maximo de 15 caracteres
 * url maximo de 300 caracteres?
 * Rellenar todos los cuadros
 */

export function ConfigPlayers({ playersCount = 1, setPlayers }) {
    const navigate = useNavigate();

    let [users, setUser] = useState(Array(playersCount).fill(['', '', 2, 5, true, null, '']));

    const handleInput = (event, index, campo) => {
        // Asegurarnos de que el valor de users[index] sea siempre un array
        const upUsers = [...users];
        upUsers[index] = Array.isArray(upUsers[index]) ? [...upUsers[index]] : ['', '', 2, 5, true, null, ''];
        upUsers[index][campo] = event.target.value;
        setUser(upUsers);
    };

    const confirm = () => {
        setPlayers(users);
        navigate('/OneGame/players/preview')
    }

    const createInputs = () => {
        return (
            <div className='p-config-players'>
                {Array.from({ length: playersCount }, (_, index) => {
                    // Asegurarnos de que users[index] siempre tenga el formato esperado
                    const player = Array.isArray(users[index]) ? users[index] : ['', '', 2, 5, true, null, ''];
                    return (
                        <div className='player' key={index}>
                            <img src={player[0]} alt={`Jugador ${index + 1}`} />
                            <div>
                                <input
                                    className='player-input'
                                    value={player[0]}
                                    onChange={(event) => handleInput(event, index, 0)}
                                    type='text'
                                    // placeholder={player[0]}
                                    placeholder='Url de imagen'
                                />
                                <input
                                    className='player-input'
                                    value={player[1]}
                                    onChange={(event) => handleInput(event, index, 1)}
                                    type='text'
                                    // placeholder={player[1]}
                                    placeholder='Nombre'
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
            <button className='button-style' onClick={() => { confirm() }}>Continuar</button>
        </div>
    );
}

export function ViewPlayers({ players }) {
    const navigate = useNavigate();
    const play = () => {
        navigate('/OneGame/game')
    }
    return (
        <div className='view-players'>
            <h1>Jugadores</h1>
            <section className='v-list'>
                {players.map((current, index) => {
                    return (
                        <div key={index}>
                            <img src={current[0]} />
                            <h3>{current[1]}</h3>
                        </div>
                    );
                })}
            </section>
            <button className='button-style' onClick={play}>Jugar</button>
        </div>
    );
}
