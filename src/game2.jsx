import { act, useEffect, useState } from "react";

import './css/game2.css'
import { useNavigate } from "react-router-dom";

// TO DO
// Asesinatos por pareja
// Muertes por noche y dia
// Resureccion
// Solo 1 resureccion por dia
// Ajustar probabilidades por % de matar y % de sobrevivir
// Iconos de dia y noche
// Cambiar iconos .png a .svg

// Multiples Asesinatos -- Backend Done
// Icono de traicion -- Creo que ya quedo
// Solo 1 relacion por partida - creo que ya esta :D

export function Gamme({ }) {
    const players = [
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1323485189967712308/Untitled.png?ex=677fe3e2&is=677e9262&hm=df8e25d1872a886978632fc3d885ec48f80b52210e6823bb5be310ff11900003&', 'Cinthia', 1, 4, true, ''],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1323120476721119344/traje.png?ex=677fe1b8&is=677e9038&hm=4dac1cb11edc741d2c041d315023ce77cbd15f401f81e79c63210703842e4c4d&', 'Palob', 1, 4, true, ''],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Roxane', 1, 4, true, ''],
        ['https://cdn.discordapp.com/attachments/775443770145112094/1286898993686646849/871_sin_titulo_20240526231723.png?ex=677ff1d5&is=677ea055&hm=4d6eb9cbcf38496de3d60a7b5ed1b0b95a46edbe2b7b1cab2b024f5fd1fb9438&', 'Post malone', 1, 4, true, ''],
        ['https://cdn.discordapp.com/attachments/775443770145112094/1322420009674477568/20241126_084815.jpg?ex=678149db&is=677ff85b&hm=fdb9ee43a56b93fc85c93e76ad3b4a84a5be4fad4d8c78fb2ba8dd99e28a448a&', 'Juan', 1, 4, true, ''],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1320638914373091350/awdawdzxds.png?ex=67816695&is=67801515&hm=682c28935d9feac784904d13ed299b30d6d36da789d25ea78067a2e8eda268a4&', 'Foka', 1, 4, true, ''],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1298485605914771457/image.png?ex=67813a35&is=677fe8b5&hm=f0fe3a6f1772930e284b5f9d1aaa52319488441e893c7033906f3df8604f58a7&', 'Steve', 1, 4, true, ''],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1295949022724620338/ADawdasd.png?ex=67813a54&is=677fe8d4&hm=d773faef2771cfdb7d90c275e2f53925260b97cd59f1c58be00a0a4c60589f71&', 'Maria', 1, 4, true, ''],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1162064998319792208/Screenshot_20230918_004554.jpg?ex=67814b5d&is=677ff9dd&hm=79ae8403cd718e55f46a268a436e65ce0ae41a2c29b52c0b44e1055d1e4effaa&', 'Josue', 1, 4, true, ''],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1156456100556701697/WhatsApp_Image_2023-09-25_at_11.11.04_AM.jpeg?ex=678152ec&is=6780016c&hm=82c27cf2a62e88aee11aba5532f53cf98b105466bb80c8021a6bad1ac1f749ac&', 'Gabriel', 1, 4, true, ''],
    ]

    const navigator = useNavigate();

    // 0=url, 1=nombre, 2=% de matar 3=% de sobrevivir [4=buen estado, 1=casi muerto], 4= estado (vivo o muerto), 5 = nombre de jugador con relacion
    let [activePlayers, setActive] = useState(players);
    // 0=url, 1=nombre, 2=% de matar 3=% de revivir, 4= estado (vivo o muerto), 5 = nombre de jugador con relacion
    let [roundDeaths, setDeaths] = useState([]);

    // 2 campos, pareja 1 y 2
    let [relation, setRelation] = useState([]);
    // Dia = ture, noche = false
    let [time, setTime] = useState(true);

    let [round, setRound] = useState(0);
    // mostrando eventos especiales
    let [specialEv, setEv] = useState(false);
    // indice de evento actual mostrandose
    let [evIndex, setIndex] = useState(0);
    // player, evento, mensaje, target
    let [regEvents, setReg] = useState([])

    const resetGame = () => {
        setActive([]);
        setDeaths([]);
        setTime([])
        setRound(0);
        setEv(false);
        setIndex(0);
        setReg([]);
        setRelation([]);
        navigator('/')
    }

    useEffect(() => {
        getEvents(activePlayers);
        if (time) {
            setRound(round + 1);
        }

    }, [time])

    function selectSomeone(current, playersList, action) {
        // Action true = kill o trato, false = relacion
        let kills = 1;
        if (current[5] != '') {
            kills = Math.floor(Math.random() * 4);
        } else {
            kills = Math.floor(Math.random() * 2);
        }

        // Cambiarlo por switch

        // Kill o trato
        if (action === 'kill') {
            // Filtrar jugadores vivos y descartar el actual
            let playersLiving = playersList.filter(player => player[4] === true && player !== current);

            if (playersLiving.length === 0) {
                return false;
            }

            console.log("PLayers ");
            console.log(playersLiving)

            // Jugadores a matar
            let objetivos = [];
            // selecciona un random, para cada elemento en targets si el chango seleccionado ya fue seleccionado, se skipea y baja la cantidad de kills, asi que reduce la probabilidad de matar a varios

            for (let i = 0; i <= kills && i < playersLiving.length; i++) {
                let random = Math.floor(Math.random() * playersLiving.length);
                let player = playersLiving[random];

                // Eliminar el indice seleccionado
                playersLiving.splice(random, 1);
                // Tambien puedo usar includes, que es target.includes(player)
                // que esto retorna un true o false si el array incluye ese jugador
                // pero esto aumentaria la probabilidad de hacer multiples kills.

                objetivos.push(player);
            }
            // console.log(targets.length);
            return objetivos;
        }
        else {
            if (action === 'deal') {
                // Relacion
                let playersLiving = playersList.filter(player => player[4] === true && player !== current);
                if (playersLiving.length === 0) {
                    return false;
                }
                const random = Math.floor(Math.random() * playersLiving.length);
                const player = playersLiving[random];
                return player;

            } else {
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
    }

    const getEvents = (livingPlayers) => {
        let events = [];
        let deaths = [];
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

                        let death = current;
                        // death[4] = false;
                        deaths.push(death);
                    }
                } else { // accion grupal
                    if (random > 90 && random <= 100) {
                        // Asesinato
                        let target = selectSomeone(current, livingPlayers, 'kill')

                        if (target !== false) {
                            let messange;
                            // console.log(target);
                            // Si son mas de 1
                            if (target.length > 1) {
                                let list = target[0][1];
                                let duo = false;
                                console.log('Multiples')
                                console.log(target);

                                for (let i = 1; i < target.length; i++) {
                                    list = list + ", " + target[i][1];
                                }

                                if (duo) {
                                    messange = 'mato y traiciono a ' + list;
                                } else {
                                    messange = 'mato a ' + list;
                                }

                                for (let i = 0; i < target.length; i++) {
                                    let temp = [current, 'kill', messange, target];

                                    matar(target[i]);
                                    events.push(temp);

                                    let death = target[i];
                                    death[4] = false;
                                    deaths.push(death);
                                }

                            } else {
                                console.log('Unico')
                                if (current[5] === target[0][1]) {
                                    messange = 'traiciono a ' + target[0][1];
                                } else {
                                    messange = 'mato a ' + target[0][1];
                                }
                                console.log("targets apa ---")
                                console.log(target[0]);

                                let temp = [current, 'kill', messange, target];

                                matar(target[0]);
                                events.push(temp);
                                console.log(target);

                                let death = target[0];
                                death[4] = false;
                                deaths.push(death);
                            }

                        } else {
                            let temp = [current, 'comun', 'mensaje'];
                            events.push(temp);
                        }

                    } else {
                        if (random >= 5 && random <= 20) {
                            // Trato
                            let target = selectSomeone(current, livingPlayers, 'deal')

                            // Que se haya seleccionado un jugador
                            // y que ese jugador no sea la pareja de current
                            // no tiene sentido que formen un trato siendo pareja
                            if (target && current[5] !== target[1]) {
                                let temp = [current, 'deal', 'formo un trato con ' + target[1] + ' por ahora estan a mano', target];
                                events.push(temp);
                            } else {
                                let temp = [current, 'comun', 'mensaje'];
                                events.push(temp);
                            }
                        } else {
                            // Relacion
                            let target = selectSomeone(current, livingPlayers, 'relation')
                            console.log('relation')
                            console.log(target);

                            // Mientras no haya una relacion
                            if (target && relation.length === 0) {
                                let temp = [current, 'relation', 'compartio refugio con ' + target[1] + ' por muchas horas', target];
                                setRelation(true);
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
        setDeaths(deaths)
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
                    <h1>{time ? `Dia ${round}` : `Noche ${round}`}</h1>
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
                <div>
                    <h1>Pasamos directo a la accion</h1>
                    <button onClick={() => {
                        setEv(true),
                            setIndex(0)
                    }}></button>
                </div>
            )
        }
    }

    // Post malone - foka

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
                    if (especial[eventIndex][0][5] === especial[eventIndex][3]) {
                        icon = icon + 'brokenHeart.png'
                    } else {
                        icon = icon + 'swords.png';
                    }
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
                let indexSum = 1;
                if (especial[eventIndex][1] === 'kill') {
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
                                    {especial[eventIndex][3].length > 1 ?
                                        especial[eventIndex][3].map((actual, index) => {
                                            indexSum = 2;
                                            return (
                                                <div key={index}>
                                                    <img src={actual[0]} />
                                                    <h3>{actual[1]}</h3>
                                                </div>
                                            )
                                        })
                                        : <div>
                                            <img src={especial[eventIndex][3][0][0]} />
                                            <h3>{especial[eventIndex][3][0][1]}</h3>
                                            <div className="line-event"></div>
                                        </div>
                                    }

                                </article>
                            </section>
                            <button className="bottom-button button-style" onClick={() => {
                                setIndex(eventIndex + indexSum)
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
                                    <div>
                                        <img src={especial[eventIndex][3][0]} />
                                        <h3>{especial[eventIndex][3][1]}</h3>
                                        <div className="line-event"></div>
                                    </div>
                                </article>
                            </section>
                            <button className="bottom-button button-style" onClick={() => {
                                setIndex(eventIndex + indexSum)
                            }} >Siguiente</button>
                        </div>
                    )
                }
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
                        <button onClick={() => { resetGame() }} className="button-style">Terminar juego</button>
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
                            <button onClick={() => { resetGame() }} className="bottom-button button-style">Terminar juego</button>
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
                                {roundDeaths.length > 0 ? roundDeaths.map((current) => {
                                    if (!current[4]) {
                                        return (
                                            <div className="deaths-list-item" key={current[1]}>
                                                <img src={current[0]} />
                                                <p>{current[1]}</p>
                                                <div className="line-event"></div>
                                            </div>
                                        )
                                    }
                                }) : <div>
                                    <h1>Ningun jugador murio esta vez</h1>
                                </div>
                                }
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
    ["practica su tiro con arco.", 1, 0],
    ["construyó una lanza improvisada.", 1, 0],
    ["encontró un arma.", 3, 0],
    ["construyó una pequeña trampa para animales.", 1, 1],
]

// mensaje, fuerza, supervivencia
const comunMessangeNight = [
    ["encontró un lugar seguro para pasar la noche.", 0, 0],
    ["escuchó ruidos extraños, pero decidió no investigar.", 0, 0],
    ["reforzó su refugio con ramas y piedras.", 0, 0],
    ["encendió una pequeña fogata para mantenerse caliente.", 0, 0],
    ["intentó mantenerse despierto para vigilar el área.", 0, 0],
    ["cazo lobos durante la noche.", 0, 0],
    ["se quedó en completo silencio al escuchar pasos cercanos.", 0, 0],
    ["revisó su equipo para prepararse para el día siguiente.", 0, , 0],
    ["vio el brillo de una fogata en la distancia.", 0, 0],

    // Acciones que lo debilitan
    ["no pudo dormir por un ataque de ansiedad.", 0, -1],
    ["no pudo dormir por el miedo a los lobos.", 0, -1],
    ["se quemo la mano gravemente al encender una fogata, sera dificil sostener firme un arma.", 0, -3],
    // Acciones que lo fortalecen
    ["extraña su familia...", 2, 0],
    ["descansó durante el resto de la noche.", 1, 1],
]


function getDeathMessange(day) {
    if (day) {
        let random = Math.floor(Math.random() * (deathMessangesDay.length - 1))

        return deathMessangesDay[random];
    } else {
        let random = Math.floor(Math.random() * (deathMessangesNight.length - 1))

        return deathMessangesNight[random];
    }
}

function getComunMessange(day) {
    if (day) {
        let random = Math.floor(Math.random() * (comunMessangeDay.length - 1))
        let messange = comunMessangeDay[random][0];

        return messange;
    } else {
        let random = Math.floor(Math.random() * (comunMessangeNight.length - 1))
        let messange = comunMessangeNight[random][0];

        return messange;
    }
}