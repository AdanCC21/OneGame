import { useEffect, useState } from "react";

import './css/game2.css'

// TO DO
// Multiples Asesinatos
// Asesinatos por pareja
// Muertes por noche y dia
// Resureccion
// Icono de traicion
// Ajustar probabilidades por % de matar y % de sobrevivir
// Solo 1 relacion por partida
// Solo 1 resureccion por dia

export function Game({ }) {
    const players = [
        ['', 'Cinthia', 5, 5, true, ''],
        ['', 'Palob', 5, 5, true, ''],
        ['', 'Roxane', 5, 5, true, ''],
        ['', 'Malone', 5, 5, true, ''],
        ['', 'Juan', 5, 5, true, ''],
        ['', 'Foka', 5, 5, true, ''],
        ['', 'Steve', 5, 5, true, ''],
        ['', 'Maria', 5, 5, true, ''],
        ['', 'Josue', 5, 5, true, ''],
        ['', 'Gabriel', 5, 5, true, ''],
    ]

    // 0=url, 1=nombre, 2=% de matar 3=% de sobrevivir [4=buen estado, 1=casi muerto], 4= estado (vivo o muerto), 5 = nombre de jugador con relacion
    let [activePlayers, setActive] = useState(players);
    // 0=url, 1=nombre, 2=% de matar 3=% de revivir, 4= estado (vivo o muerto), 5 = nombre de jugador con relacion
    let [tempDeaths, setDeths] = useState([]);
    // Dia = ture, noche = false
    let [time, setTime] = useState(true);

    let [round, setRound] = useState(0);
    // mostrando eventos especiales
    let [specialEv, setEv] = useState(false);
    // indice de evento actual mostrandose
    let [evIndex, setIndex] = useState(0);
    // player, evento, mensaje, target
    let [regEvents, setReg] = useState([])


    useEffect(() => {
        if(time){
            setRound(round+1);
        }
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
                        let messange = getComunMessange(time);
                        let temp = [current, 'comun', messange];
                        events.push(temp);
                    } else { // > 71 <= 90
                        let messange = getDeathMessange(time);
                        let temp = [current, 'death', messange];
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
                                let temp = [current, 'deal', 'formo un trato con ' + target[1] + ' por ahora estan a mano', target];
                                events.push(temp);
                            } else {
                                let temp = [current, 'comun', 'mensaje'];
                                events.push(temp);
                            }
                        } else {
                            // Relacion
                            let target = selectSomeone(current, livingPlayers, false)

                            if (target) {
                                let temp = [current, 'relation', 'compartio refugio con ' + target[1] + ' por muchas horas', target];
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
                <div className="e-comun">
                    <h1>{time ?`Dia ${round}` : `Noche ${round}`}</h1>
                    {comun.map((current, index) => {
                        let messange = `${current[0][1]} ${current[2]}`;
                        return (
                            <div key={index} className={`e-comun-item e${index}`}>
                                <img style={{ height: 200 }} src={current[0][0]} />
                                <div className="line"></div>
                                <p>{messange}</p>
                            </div>
                        );
                    })}
                    <button className="button-style" onClick={() => { setEv(true), setIndex(0) }}>Continuar</button>
                </div>
            )
        }
        else {
            return (
                setEv(true),
                setIndex(0)
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
        // Si aun hay eventos especiales
        if (eventIndex < especial.length) {
            let messange = `${especial[eventIndex][0][1]} ${especial[eventIndex][2]}`;
            let onlyOne = false;
            let icon = 'icon/';
            switch (especial[eventIndex][1]) {
                case 'kill':
                    icon = icon + 'swords.png';
                    break;
                case 'relation':
                    icon = icon + 'heart.png';
                    break;
                case 'deal':
                    icon = icon + 'handsShake.png';
                    break;
                case 'death':
                    icon = icon + 'death.png'
                    onlyOne = true;
                    break;
            }
            if (onlyOne) {
                return (
                    <div className="event">
                        <section>
                            <img src={icon} />
                            <img src={especial[eventIndex][0][0]} />
                            <div className="line-event"></div>
                            <p>{messange}</p>
                        </section>
                        <button className="bottom-button button-style" onClick={() => {
                            setIndex(eventIndex + 1)
                        }} >Siguiente</button>
                    </div>
                )
            } else {
                return (
                    <div className="cont">
                        <section className="event-row">
                            <article className="event-row-player">
                                <img src={especial[eventIndex][0][0]} />
                                <h3>{especial[eventIndex][0][1]}</h3>
                                <div className="line-event"></div>
                            </article>
                            <article className="flex-colum center">
                                <img src={icon} className="icon" />
                                <p>{messange}</p>
                            </article>
                            <article className="event-row-player">
                                <img src={especial[eventIndex][3][0]} />
                                <h3>{especial[eventIndex][3][1]}</h3>
                                <div className="line-event"></div>
                            </article>
                        </section>
                        <button className="bottom-button button-style" onClick={() => {
                            setIndex(eventIndex + 1)
                        }} >Siguiente</button>
                    </div>
                )
            }
        } else {
            // Terminaron todos los eventos especiales
            let deaths = activePlayers.filter(player => player[4] === false);

            // Si todos murieron
            if (deaths.length === activePlayers.length) {
                return (
                    <div className="e-comun">
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
                        <button className="button-style">Terminar juego</button>
                    </div>
                )
            } else {
                // si hay queda 1 solo jugador
                if (deaths.length === activePlayers.length - 1) {
                    let winner = activePlayers.filter(player => player[4] === true);

                    return (
                        <div className="flex-colum full-screen center">
                            <img className="winner-crown" src="icon/crown.png" />
                            <img className="winner-image" src={winner[0][0]} alt={winner[0][1]} />
                            <div className="line-event winner"></div>
                            <h1>{`${winner[0][1]}`}</h1>
                            <p>Es el ganador</p>
                            <button className="bottom-button button-style">Terminar juego</button>
                        </div>
                    )
                } else {
                    return (
                        <div className="deaths-father">
                            {/* <h1>{`Fin de ${time ? 'el dia' : 'la noche'}`}</h1> */}
                            <section className="deaths-title">
                                <h1>Jugadores Eliminados</h1>
                                <img src="icon/death.png" />
                            </section>
                            <article className="deaths-list">
                                {activePlayers.map((current) => {
                                    if (!current[4]) {
                                        return (
                                            <div className="deaths-list-item" key={current[1]}>
                                                <img src={current[0]} />
                                                <p>{current[1]}</p>
                                                <div className="line-event"></div>
                                            </div>
                                        )
                                    }
                                })}
                            </article>
                            <button className="button-style" onClick={() => { setIndex(0); setEv(false); setTime(!time); }} >Continuar</button>
                        </div>
                    )
                }
            }
        }
    }

    return (
        <div className="background">
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

// mensaje, puntos de fuerza, puntos de supervivencia
const comunMessangeDay = [
    ['encontró una caja de municiones.', 0, 0],
    ['recolectó bayas y frutos del bosque.', 0, 0],
    ['se movió hacia una nueva zona para explorar.', 0, 0],
    ['avistó a otro competidor, pero decidió mantenerse oculto.', 0, 0],
    ['descansó brevemente bajo la sombra de un árbol.', 0, 0],
    ['bebió agua de un arroyo cercano.', 0, 0],
    ['se desmaya de agotamiento', 0, 0],

    // acciones que debilita - cuantos puntos debilita
    ['se lastimo al buscar frutos en los arbustos.', 0, -0.5],
    ['fue atacado por un lobo, sobrevivio pero le dejo el brazo sangrando, debera atender sus heridas y cuidarse de la manada de lobos.', -1.5, -1.5],
    ['cayó de un arbol muy alto, se quebro una pierna.', -2, -2],
    ['fue mordido por una serpiente, decidio cortarse el brazo antes de que el veneno se esparza', -3.5, -3],
    ['fue atacado por una manada de lobos, apenas logra sobrevivir', -2, -3],
    ['fue atacado por un enjambre de abejas, una serpiente, un oso bebe, y 2 hamsters salvajes, apenas sobrevivio.', -2, -3.5],

    // acciones que fortalecen + puntos a fortalecer
    ["practica su tiro con arco.", 1],
    ["construyó una lanza improvisada.", 1],
    ["encontró un arma.", 3],
    ["construyó una pequeña trampa para animales.", 1],
]

const comunMessangeNight = [
    ["encontró un lugar seguro para pasar la noche.",0],
    ["escuchó ruidos extraños, pero decidió no investigar.",0],
    ["reforzó su refugio con ramas y piedras.",0],
    ["encendió una pequeña fogata para mantenerse caliente.",0],
    ["intentó mantenerse despierto para vigilar el área.",0],
    ["cazo lobos durante la noche.",0],
    ["se quedó en completo silencio al escuchar pasos cercanos.",0],
    ["revisó su equipo para prepararse para el día siguiente.",0],
    ["vio el brillo de una fogata en la distancia.",0],

    // Acciones que lo debilitan
    ["no pudo dormir por un ataque de ansiedad.", -1],
    ["no pudo dormir por el miedo a los lobos.", -1],
    ["se quemo la mano gravemente al encender una fogata, sera dificil sostener firme un arma.", -3],
    // Acciones que lo fortalecen
    ["extraña su familia...", 2],
    ["descansó durante el resto de la noche.", 1],
]


function getDeathMessange(day) {
    if (day) {
        let random = Math.floor(Math.random() * deathMessangesDay.length-1)
        
        return deathMessangesDay[random];
    } else {
        let random = Math.floor(Math.random() * deathMessangesNight.length-1)
        
        return deathMessangesNight[random];
    }
}

function getComunMessange(day) {
    if (day) {
        let random = Math.floor(Math.random() * comunMessangeDay.length-1)
        
        return comunMessangeDay[random];
    } else {
        let random = Math.floor(Math.random() * comunMessangeNight.length-1)
        
        return comunMessangeNight[random];
    }
}



/**Inicia el dia
    Recorre la lista de jugadores
    toma al primero y selecciona su evento

    -- Eventos de dia
    -    Asesinato 90-100 = 10
    -    Muerte 70-90 = 20
    -    Comun 20-70 = 50
    -    Amistad/Trato = 5-20 = 15
    -    Relacion 0-5 = 5

    Si evento == muerte || comun
        ocurre, y pasa al siguiente jugador
        Si es comun y es una caja de equipamiento militar, tendra mas posibilidades de matar a mas gente

    Si evento == Asesinato || Amistad || Relacion
        Si es amistad
        selecciona un jugador random y se elimina de la proxima seleccion de evento, y pasa a un arreglo de parejas o tratos

        Si es asesinato
        Se toma un num random del 1 al 4 (tomando en cuenta su porbabilidad de matar) y sera la cantidad de jugadores asesinados, dependiendo el numero de muertes el mensaje sera diferente

        antes de formar una relacion, hay que confirmar si el usuario ya esta en una

    Inicia la noche
    -- Eventos de noche
    -    Asesinato 60-100 = 40
    -    Muerte 40-60 = 30
    -    Comun 20-40 = 20
    -    Amistad/Trato = 10-20 = 10
    -    Relacion 0-10 = 10

    Una vez termine la noche se vera la lista de muertos y pasara al siguente dia

 */

/**
    players = [
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1323485189967712308/Untitled.png?ex=677fe3e2&is=677e9262&hm=df8e25d1872a886978632fc3d885ec48f80b52210e6823bb5be310ff11900003&', 'Jugador 1', 1, true],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1323120476721119344/traje.png?ex=677fe1b8&is=677e9038&hm=4dac1cb11edc741d2c041d315023ce77cbd15f401f81e79c63210703842e4c4d&', 'Jugador 2', 1, true],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Jugador 3', 1, true],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Jugador 4', 1, true],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Jugador 5', 1, true],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Jugador 6', 1, true],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Jugador 7', 1, true],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Jugador 8', 1, true],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Jugador 9', 1, true],
    ]
*/