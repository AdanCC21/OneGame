import { useEffect, useState } from "react";

export function Gamme({ }) {
    const players = [
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1323485189967712308/Untitled.png?ex=677fe3e2&is=677e9262&hm=df8e25d1872a886978632fc3d885ec48f80b52210e6823bb5be310ff11900003&', 'Jugador 1', 1, 1, true, false],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1323120476721119344/traje.png?ex=677fe1b8&is=677e9038&hm=4dac1cb11edc741d2c041d315023ce77cbd15f401f81e79c63210703842e4c4d&', 'Jugador 2', 1, 1, true, false],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Jugador 3', 1, 1, true, false],
        ['https://cdn.discordapp.com/attachments/775443770145112094/1286898993686646849/871_sin_titulo_20240526231723.png?ex=677ff1d5&is=677ea055&hm=4d6eb9cbcf38496de3d60a7b5ed1b0b95a46edbe2b7b1cab2b024f5fd1fb9438&', 'Jugador 4', 1, 1, true, false]
    ]

    // 0=url, 1=nombre, 2=% de matar 3=% de revivir, 4= estado (vivo o muerto)
    let [activePlayers, setActive] = useState(players);
    // 0=url, 1=nombre, 2=% de matar 3=% de revivir, 4= estado (vivo o muerto)
    let [relationList, addRelation] = useState([]);
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
            const player = playersList[random];
            return player;
        }
        else {
            // Relacion
            let playersLiving = playersList.filter(player => player[4] === true && player !== current && player[5] === true);
            if (playersLiving.length === 0) {
                return false;
            }
            const random = Math.floor(Math.random() * playersLiving.length);
            const player = playersList[random];
            return player;


        }
    }

    const getEvents = (livingPlayers) => {
        let events = [];
        // Dia
        livingPlayers.map((current) => {
            let random = Math.floor(Math.random() * 99) + 1;

            // Accion individual
            if (random > 20 && random <= 90) {
                if (random > 20 && random <= 70) {
                    let temp = [current, 'comun', 'mensaje'];
                    events.push(temp);
                } else { // > 71 <= 90
                    let temp = [current, 'deadth', 'mensaje'];
                    matar(current);
                    events.push(temp);
                }
            } else { // accion grupal
                if (random > 90 && random <= 100) {
                    // Asesinato
                    let target = selectSomeone(current, livingPlayers, true)

                    if (target) {
                        let temp = [current, 'kill', 'mensaje', target];
                        matar(current);
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
                            let temp = [current, 'deal', 'mensaje', target];
                            events.push(temp);
                        } else {
                            let temp = [current, 'comun', 'mensaje'];
                            events.push(temp);
                        }
                    } else {
                        // Relacion
                        let target = selectSomeone(current, livingPlayers, false)

                        if (target) {
                            let temp = [current, 'relation', 'mensaje', target];
                            events.push(temp);
                        } else {
                            let temp = [current, 'comun', 'mensaje'];
                            events.push(temp);
                        }
                    }
                }
            }
        })
        setReg(events);
    }
    // const getEvents = (livingPlayers) => {
    //     let events = [];
    //     livingPlayers.map((current, index) => {
    //         if (index === 0) {
    //             let temp = [current, 'deadth', 'mensaje'];
    //             matar(current);
    //             events.push(temp);
    //         } else {
    //             if (index === 1) {
    //                 let temp = [current, 'comun', 'mensaje'];
    //                 events.push(temp);
    //             }
    //             else {
    //                 let target = selectSomeone(current, activePlayers, true);
    //                 if (target != false) {
    //                     let temp = [current, 'kill', 'mensaje', target];
    //                     events.push(temp);
    //                 } else {
    //                     let temp = [current, 'comun', 'mensaje'];
    //                     events.push(temp);
    //                 }
    //             }
    //         }

    //     })
    //     setReg(events);
    // }

    const matar = (target) => {
        let temp = [];
        activePlayers.map((current) => {
            if (current !== target) {
                temp.push(current);
            }
        })
        setActive(temp);
    }

    const handleEvents = () => {
        if (activePlayers.length > 1) {
            switch (time) {
                // Dia
                case true:
                    console.log('--- dia ---')
                    if (!specialEv) {
                        return comunEvents();
                    } else {
                        return specialEvents(evIndex);
                    }

                    break;
                // Noche
                case false:
                    console.log('--- noche ---')
                    if (!specialEv) {
                        return comunEvents();
                    } else {
                        return specialEvents(evIndex);
                    }
                    break
            }
        } else {
            return (
                <div>
                    <h1>{`Ganador ${activePlayers[0][1]}`}</h1>
                </div>
            )
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
        if (eventIndex < especial.length) {
            let messange = `${especial[eventIndex][0][1]} ${especial[eventIndex][1]}`;

            // Si es un evento en pareja, se agrega el target
            if (especial[eventIndex][1] === 'kill') {
                console.log(especial[eventIndex][3][1]);
                messange = messange + ` target ${especial[eventIndex][3][1]}`;
            }
            return (
                <div>
                    <h1>{`Evento especial: ${messange}`}</h1>
                    <button onClick={() => {
                        setIndex(eventIndex + 1)
                    }} >next</button>
                </div>
            )
        } else {

            return (
                <div>
                    <h1>{`Fin de ${time ? 'el dia' : 'la noche'}`}</h1>
                    <h2>muertos</h2>
                    <button onClick={() => { setIndex(0); setEv(false); setTime(!time); }} >Continuar</button>
                </div>
            )
        }
    }

    return (
        <div>
            {handleEvents()}
        </div>
    );
}