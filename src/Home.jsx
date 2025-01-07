import { useState } from 'react';
import './css/home.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

export function Home({ setPlayers }) {
    const navigate = useNavigate();

    let [input, setInput] = useState('');

    const saveInput = (event) => {
        setInput(event.target.value);
    }

    const updatePlayers = (num) => {
        setPlayers(num)
        navigate('/players')
    }

    return (
        <div className='radial-gradient'>
            <section className='welcome'>
                <h3>The last</h3>
                <h1>Games</h1>
                <img src='icon/swords.png' />
            </section>
            <section className='players-count'>
                <h1>Numero de jugadores</h1>
                <article>
                    <img src='icon/swords.png' />
                    <input value={input} onChange={saveInput} />
                    <img src='icon/swords.png' />
                    <p>maximo 20</p>
                </article>
                <button onClick={() => {
                    updatePlayers(input)
                }} className='continue'>Continuar</button>
            </section>
        </div>
    );
}