import { useState } from 'react';
import './css/home.css'
import './css/animations.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

export function Home({ setPlayers }) {
    const navigate = useNavigate();

    let [input, setInput] = useState('');
    let [messange, setMessange] = useState('Máximo 20');

    const saveInput = (event) => {
        setInput(event.target.value);
    }

    const updatePlayers = (event) => {
        if(Number(input) > 20 || Number(input) <=1){
            if(Number(input)<=1){
                setMessange('Minimo 2 jugadores')
            }if(Number(input)>20){
                setMessange('Limite superado, máximo 20')
            }
        }else{
            if(event.key==='Enter'){
                setPlayers(input)
                navigate('/OneGame/players')
            }
        }
    }

    return (
        <div className='radial-gradient'>
            <section className='welcome'>
                <h3>Wolf in the</h3>
                <h1>Forest</h1>
                <img src='logo.png' />
            </section>
            <section className='players-count'>
                <h1>Numero de jugadores</h1>
                <article>
                    <img src='icon/swords.png' />
                    <input value={input} onChange={saveInput} onKeyDown={updatePlayers} />
                    <img src='icon/swords.png' />
                    <p>{messange}</p>
                </article>
            </section>
        </div>
    );
}