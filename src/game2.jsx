import { useEffect, useState } from "react";

export function Gamme({ }) {
    const players = [
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1323485189967712308/Untitled.png?ex=677fe3e2&is=677e9262&hm=df8e25d1872a886978632fc3d885ec48f80b52210e6823bb5be310ff11900003&', 'Jugador 1', 1, 1, true, ''],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1323120476721119344/traje.png?ex=677fe1b8&is=677e9038&hm=4dac1cb11edc741d2c041d315023ce77cbd15f401f81e79c63210703842e4c4d&', 'Jugador 2', 1, 1, true, ''],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Jugador 3', 1, 1, true, ''],
        ['https://cdn.discordapp.com/attachments/775443770145112094/1286898993686646849/871_sin_titulo_20240526231723.png?ex=677ff1d5&is=677ea055&hm=4d6eb9cbcf38496de3d60a7b5ed1b0b95a46edbe2b7b1cab2b024f5fd1fb9438&', 'Jugador 4', 1, 1, true, '']
    ]

    // 0=url, 1=nombre, 2=% de matar 3=% de revivir, 4= estado (vivo o muerto), 5 = nombre de jugador con relacion
    let [activePlayers, setActive] = useState(players);
    // 0=url, 1=nombre, 2=% de matar 3=% de revivir, 4= estado (vivo o muerto), 5 = nombre de jugador con relacion
    let [inactivePlayers, setInactive] = useState([]);
    // Dia = ture, noche = false
    let [time, setTime] = useState(true);
    // mostrando eventos especiales
    let [specialEv, setEv] = useState(false);
    // indice de evento actual mostrandose
    let [evIndex, setIndex] = useState(0);
    // player, evento, mensaje, target
    let [regEvents, setReg] = useState([])


    useEffect(() => {
        getEvents(activePlayers);
    }, [time])

    function selectSomeone(current, playersList, action) {
        // Action true = kill o trato, false = relacion

        // Kill o trato
        if (action) {
            // Filtrar jugadores vivos y descartar el actual
            let playersLiving = playersList.filter(player => player[4] === true && player !== current);


            if (playersLiving.length === 0) {
                return false;
            }

            const random = Math.floor(Math.random() * playersLiving.length);
            const player = playersLiving[random];
            return player;
        }
        else {
            // Relacion
            let playersLiving = playersList.filter(player => player[4] === true && player !== current && player[5] === '');
            if (playersLiving.length === 0) {
                return false;
            }
            const random = Math.floor(Math.random() * playersLiving.length);
            const player = playersLiving[random];
            player[5] = current[1];
            return player;


        }
    }

    const getEvents = (livingPlayers) => {
        let events = [];
        // Dia
        livingPlayers.map((current) => {
            let random = Math.floor(Math.random() * 99) + 1;

            // Accion individual
            if (current[4]) {
                if (random > 20 && random <= 90) {
                    if (random > 20 && random <= 70) {
                        let temp = [current, 'comun', 'mensaje'];
                        events.push(temp);
                    } else { // > 71 <= 90
                        let messange = getDeathMessange(time);
                        let temp = [current, 'deadth', messange];
                        matar(current);
                        events.push(temp);
                    }
                } else { // accion grupal
                    if (random > 90 && random <= 100) {
                        // Asesinato
                        let target = selectSomeone(current, livingPlayers, true)

                        if (target) {
                            let messange;
                            if (current[5] === target[1]) {
                                messange = 'traiciono a ' + target[1];
                            } else {
                                messange = 'mato a ' + target[1];
                            }

                            let temp = [current, 'kill', messange, target];
                            matar(target);
                            events.push(temp);
                        } else {
                            let temp = [current, 'comun', 'mensaje'];
                            events.push(temp);
                        }

                    } else {
                        if (random >= 5 && random <= 20) {
                            // Trato
                            let target = selectSomeone(current, livingPlayers, true)

                            if (target) {
                                let temp = [current, 'deal', 'formo un trato con ' + target[1], target];
                                events.push(temp);
                            } else {
                                let temp = [current, 'comun', 'mensaje'];
                                events.push(temp);
                            }
                        } else {
                            // Relacion
                            let target = selectSomeone(current, livingPlayers, false)

                            if (target) {
                                let temp = [current, 'relation', 'compartio refugio con ' + target[1], target];
                                current[5] = target[1];
                                events.push(temp);
                            } else {
                                let temp = [current, 'comun', 'mensaje'];
                                events.push(temp);
                            }
                        }
                    }
                }
            }
        })
        setReg(events);
    }

    const matar = (target) => {
        let temp = [];
        activePlayers.map((current) => {
            // if (current !== target) {
            //     temp.push(current);
            // }
            if (current === target) {
                current[4] = false;
            }
            temp.push(current);
        })
        setActive(temp);

    }

    const handleEvents = () => {
        switch (time) {
            // Dia
            case true:

                if (!specialEv) {
                    return comunEvents();
                } else {
                    return specialEvents(evIndex);
                }

                break;
            // Noche
            case false:

                if (!specialEv) {
                    return comunEvents();
                } else {
                    return specialEvents(evIndex);
                }
                break
        }

    }

    const comunEvents = () => {
        // player, evento, mensaje, target
        let comun = [];
        regEvents.map((current) => {
            if (current[1] === 'comun') {
                comun.push(current);
            }
        })
        if (comun.length > 0) {
            return (
                <div>
                    <h1>Eventos comunes</h1>
                    {comun.map((current, index) => {
                        let messange = `${current[0][1]} ${current[2]}`;
                        return (
                            <div key={index}>
                                <img style={{ height: 200 }} src={current[0][0]} />
                                <h2>{messange}</h2>
                            </div>
                        );
                    })}
                    <button onClick={() => { setEv(true), setIndex(0) }}>Continuar</button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h1>No hay eventos comunes</h1>
                    <button onClick={() => { setEv(true), setIndex(0) }}>Continuar</button>
                </div>
            )
        }
    }

    const specialEvents = (eventIndex) => {
        // [player, evento, mensaje, target]
        let especial = [];
        regEvents.map((current) => {
            if (current[1] != 'comun') {
                especial.push(current)
            }
        })
        // Si aun hay eventos
        if (eventIndex < especial.length) {
            let messange = `${especial[eventIndex][0][1]} ${especial[eventIndex][2]}`;

            // Si es un evento en pareja, se agrega el target
            // if (especial[eventIndex][1] === 'kill' || especial[eventIndex][1] === 'deal' || especial[eventIndex][1] === 'relation') {
            //     // messange = messange + ` ${especial[eventIndex][3][1]}`;
            //     // console.log(especial[eventIndex][0][5])
            //     // messange = messange + ` target ${especial[eventIndex][0][5]}`;
            // }
            console.log(activePlayers);
            return (
                <div>
                    <img style={{ height: 200 }} src={especial[eventIndex][0][0]} />
                    <h1>{messange}</h1>
                    <button onClick={() => {
                        setIndex(eventIndex + 1)
                    }} >next</button>
                </div>
            )
        } else {
            let deadths = activePlayers.filter(player => player[4] === false);
            // Si todos murieron o no
            if (deadths.length === activePlayers.length) {
                return (
                    <div>
                        <h1>{`Fin de ${time ? 'el dia' : 'la noche'}`}</h1>
                        <h1>Todos murieron antes de llegar al final</h1>
                        <h2>muertos</h2>
                        {activePlayers.map((current) => {
                            if (!current[4]) {
                                return (
                                    <div key={current[1]}>
                                        <img style={{ height: 100 }} src={current[0]} />
                                        <h3>{current[1]}</h3>
                                    </div>
                                )
                            }
                        })}
                        <button onClick={() => { setIndex(0); setEv(false); setTime(!time); }} >Continuar</button>
                    </div>
                )
            } else {
                if (deadths.length === activePlayers.length - 1) {
                    let winner = activePlayers.filter(player => player[4]===true);
                    console.log("ganadores")
                    console.log(winner)
                    console.log(activePlayers)
                    return (
                        <div>
                            <h1>{`Ganador ${winner[0][1]}`}</h1>
                            <img style={{ height: 200 }} src={winner[0][0]} alt={winner[0][1]} />
                            <h2>{winner[0][1]}</h2>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <h1>{`Fin de ${time ? 'el dia' : 'la noche'}`}</h1>
                            <h2>muertos</h2>
                            {activePlayers.map((current) => {
                                if (!current[4]) {
                                    return (
                                        <div key={current[1]}>
                                            <img style={{ height: 100 }} src={current[0]} />
                                            <h3>{current[1]}</h3>
                                        </div>
                                    )
                                }
                            })}
                            <button onClick={() => { setIndex(0); setEv(false); setTime(!time); }} >Continuar</button>
                        </div>
                    )
                }
            }
        }
    }

    return (
        <div>
            {handleEvents()}
        </div>
    );
}

// 15
const deathMessangesDay = [
    'intento disparar un arma defectuosa, explotando el cañon de esta misma en su cara.', // posibilidad de sobrevivir 2/4
    'al disparar al cielo, la bala cayó en su cabeza, que mala suerte.',
    'se enterro su propio cuchillo en el pecho al tropezar mientras huia de una manada de lobos.',
    'accidentalmente activo un explosivo en su cara.',
    'piso su proia mina.',

    'no aguanto el hambre.',
    'no aguanto la deshidratación.',
    'murio horas despues de probar una fruta venenosa.',
    'bebio agua de un charco infectado, muriendo una fiebre mortal.',

    'murio al caer de cabeza de un arbol.',
    'murio al ser atacado por una horda de hamsters salvajes.',
    'se desmayo por el calor, siendo una presa facil para los lobos, para su suerte, los lobos lo encontraron a los minutos', // PS 1/4
    'murio a los minutos de ser mordido por una cobra real.',
    'fue atacado por monos al tratar de obtener fruta de un arbol.',
    'creyo que le ganaria a aun oso, obviamente no.',
    'cayó en un rio helado, muriendo de hipotermia.',
]
// 13
const deathMessangesNight = [
    'intento disparar un arma defectuosa, explotando el cañon de esta misma en su cara.', // posibilidad de sobrevivir 2/4
    'al disparar al cielo, la bala cayó en su cabeza, que mala suerte.',
    'se enterro su propio cuchillo en el pecho al tropezar mientras huia de una manada de lobos.',
    'accidentalmente activo un explosivo en su cara.',
    'piso su proia mina.',

    'no aguanto el hambre.',
    'no aguanto la deshidratación.',
    'murio horas despues de probar una fruta venenosa.',
    'bebio agua de un charco infectado, muriendo una fiebre mortal.',

    'no soporto el fuerte frio de la noche.',
    'murio tras ser atacado por un oso mientras dormia.',
    'se quemo hasta la muerte al tratar de encender una fogata.',
    'cayó de un precipicio al no ver en la oscuridad.', // PS 1/4
    'fue emboscado por una manada de lobos mientras dormia.', // PS // 1/4
]

function getDeathMessange(day) {
    if (day) {
        let random = Math.floor(Math.random() * 15)
        return deathMessangesDay[random];
    } else {
        let random = Math.floor(Math.random() * 13)
        return deathMessangesNight[random];
    }
}