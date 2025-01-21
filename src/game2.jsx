import { act, useEffect, useState } from "react";

import './css/game2.css'
import { useNavigate } from "react-router-dom";
import { ComunEvent } from "./assets/components/ComunEvents";
import { AllDeaths, SEMurder, SEOnePlayer, SpecialEvent, Winner, Deaths } from "./assets/components/SpecialEvents";

// TO DO
// Asesinatos por pareja
// Muertes por noche y dia
// Resureccion
// Solo 1 resureccion por dia
// Ajustar probabilidades por % de matar y % de sobrevivir
// Iconos de dia y noche
// Cambiar iconos .png a .svg


// Recuerda cambiar de nuevo los atributos base en todos los archivos

// Multiples Asesinatos -- Backend Done
// Icono de traicion -- Creo que ya quedo
// Solo 1 relacion por partida - creo que ya esta :D



// VALIDACIONES
// Que cada nombre sea unico
// maximo 20 caracteres para un nombre
// un link maximo de 300 caracteres?
// solo aceptar png, jpg, jpeg y ya

const route = "src/assets/players/";

export function Gamme({ }) {
    // url, nombre ,Habilidad para matar, Habilidad para sobrevivir, vivo o muerto, nombre de su pareja
    // habilidades de 1 a 10, como base 2 y 5 
    const players = [
        [`${route}cinthia.png`, 'Cinthia', 2, 5, true, ''],
        [`${route}palob.png`, 'Palob', 2, 5, true, ''],
        [`${route}malone.png`, 'Malone', 2, 5, true, ''],
        [`${route}eddy.png`, 'Eddy', 2, 5, true, ''],
        [`${route}foka.png`, 'Foka', 2, 5, true, ''],
        [`${route}dlv.png`, 'Dlv', 2, 5, true, ''],
        [`${route}eslo.png`, 'Eslo', 2, 5, true, ''],
        [`${route}josue.png`, 'Josue', 2, 5, true, ''],
        [`${route}chaino.png`, 'Chaino', 2, 5, true, ''],
        [`${route}adan.png`, 'Adan', 2, 5, true, ''],
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
        doEvent(activePlayers);
        if (time) {
            setRound(round + 1);
        }

    }, [time])

    function selectSomeone(current, playersList, action, multiplePlayers = false) {
        // Action true = kill o trato, false = relacion
        let kills = 1;
        // Si no tiene pareja
        if (current[5] !== '') {
            kills = Math.floor(Math.random() * 4) + 1;
        } else {
            kills = Math.floor(Math.random() * 2) + 1;
        }

        // Kill o trato
        if (action === 'kill') {
            // Filtrar jugadores vivos y descartar el actual
            let playersLiving = playersList.filter(player => player[4] === true && player !== current);

            if (playersLiving.length === 0) {
                return false;
            }

            if (multiplePlayers) {
                if (playersLiving.length <= kills) {

                    // Devuelve todos ya que puede matar a todos
                    return playersLiving;

                } else {
                    let objetivos = [];

                    while (objetivos.length < kills) {
                        let random = Math.floor(Math.random() * playersLiving.length);
                        let player = playersLiving[random];

                        if (!objetivos.includes(player)) {

                            objetivos.push(player);
                            matar(player);
                        }
                    }

                    return objetivos;
                }

            } else {
                let player = [];
                player.push(playersLiving[Math.floor(Math.random() * playersLiving.length)]);
                matar(player[0]);
                return player;
            }
        }
        else {
            if (action === 'deal') {
                // Trato
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

    function getComunEvent(player) {
        let messange = getComunMessange(time);

        if (messange[1] != 0 || messange[2] != 0) {
            player[2] += messange[1];
            player[3] += messange[2];
        }

        return [player, 'comun', messange[0]];
    }

    const doEvent = (livingPlayers) => {
        let events = [];
        let deaths = [];
        let playerUpdated = [];
        if (time) {
            livingPlayers.map((current) => {
                // Si esta vivo
                if (current[4]) {
                    let random = Math.floor(Math.random() * 100) + 1;
                    // ASesinar
                    if (random > 80) {
                        // random x
                        let r2 = Math.floor(Math.random() * 10) + 1;

                        // Matar a varios
                        if (r2 < current[2]) {
                            let targets = selectSomeone(current, livingPlayers, 'kill', true);
                            if (targets !== false) {
                                targets.map((current) => {
                                    livingPlayers.forEach((actual) => {
                                        if (current === actual) {
                                            actual[4] = false;
                                        }
                                    })
                                })
                                let messange = getMurderMessange(targets.length, targets);

                                let event = [current, 'kill', messange, targets];
                                events.push(event);

                                targets.forEach((current) => {
                                    let player = current;
                                    // player[4] = false;
                                    deaths.push(player);
                                })

                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }

                        } else { // Matar solo uno
                            let target = selectSomeone(current, livingPlayers, 'kill', false);

                            if (target !== false) {
                                let messange = getMurderMessange(1, target);

                                let event = [current, 'kill', messange, target];
                                events.push(event);

                                let death = target[0];
                                // death[4] = false;
                                deaths.push(death);

                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }

                        }
                    } else { // Evento comun
                        let r2 = Math.floor(Math.random() * 100) + 1;
                        // Base
                        const eventos = {
                            // 0 a 4
                            revive: 0,
                            // 5 a 24
                            muerte: 5,
                            // 25 a 29
                            relacion: 25,
                            // 30 a 39
                            deal: 30,
                            // 40 en adelante
                            comun: 40,
                        };

                        if (r2 >= eventos.comun) {
                            // [mensaje, hm,hs]
                            let event = getComunEvent(current);
                            events.push(event);
                            current = event[0];
                        } else if (r2 > eventos.deal) {
                            let target = selectSomeone(current, livingPlayers, 'deal');

                            // Si no es su pareja
                            if (target !== false && current[5] !== target[1]) {
                                let temp = [current, 'deal', 'formo un trato con ' + target[1] + ' por ahora estan a mano', target];
                                events.push(temp);

                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }
                        } else if (r2 > eventos.relacion) {
                            let target = selectSomeone(current, livingPlayers, 'relation')

                            // Mientras no haya una relacion
                            if (target !== false && relation.length === 0) {
                                let temp = [current, 'relation', 'compartio refugio con ' + target[1] + ' por muchas horas', target];
                                setRelation([current, target]);
                                current[5] = target[1];
                                events.push(temp);
                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }
                        } else if (r2 > eventos.muerte) {
                            let messange = getDeathMessange(time);
                            let temp = [current, 'death', messange];
                            // matar(current);
                            current[4] = false;
                            events.push(temp);

                            let death = current;
                            death[4] = false;
                            deaths.push(death);
                        } else if (r2 > eventos.revive) {
                            // revivir();
                            console.log("Revivir")
                        } else {
                            console.log("Error - Fuera de rango" + r2)
                            // accionDefault();
                        }
                    }
                }
                playerUpdated.push(current);
            });
        } else {
            livingPlayers.map((current) => {
                // Si esta vivo
                if (current[4]) {
                    let random = Math.floor(Math.random() * 100) + 1;
                    // ASesinar
                    if (random > 60) {
                        // random x
                        let r2 = Math.floor(Math.random() * 10) + 1;

                        // Matar a varios
                        if (r2 < current[2]) {
                            let targets = selectSomeone(current, livingPlayers, 'kill', true);
                            if (targets !== false) {
                                targets.map((current) => {
                                    livingPlayers.forEach((actual) => {
                                        if (current === actual) {
                                            actual[4] = false;
                                        }
                                    })
                                })
                                let messange = getMurderMessange(targets.length, targets);

                                let event = [current, 'kill', messange, targets];
                                events.push(event);

                                targets.forEach((current) => {
                                    let player = current;
                                    // player[4] = false;
                                    deaths.push(player);
                                })

                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }

                        } else { // Matar solo uno
                            let target = selectSomeone(current, livingPlayers, 'kill', false);

                            if (target !== false) {
                                let messange = getMurderMessange(1, target);

                                let event = [current, 'kill', messange, target];
                                events.push(event);

                                let death = target[0];
                                // death[4] = false;
                                deaths.push(death);

                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }

                        }
                    } else { // Evento comun
                        let r2 = Math.floor(Math.random() * 100) + 1;
                        // Base
                        const eventos = {
                            // 0 a 4
                            revive: 0,
                            // 5 a 20
                            muerte: 5,
                            // 25 a 29
                            relacion: 25,
                            // 30 a 39
                            deal: 30,
                            // 40 en adelante
                            comun: 35,
                        };

                        if (r2 >= eventos.comun) {
                            // [mensaje, hm,hs]
                            let event = getComunEvent(current);
                            events.push(event);
                            current = event[0];
                        } else if (r2 > eventos.deal) {
                            let target = selectSomeone(current, livingPlayers, 'deal');

                            // Si no es su pareja
                            if (target !== false && current[5] !== target[1]) {
                                let temp = [current, 'deal', 'formo un trato con ' + target[1] + ' por ahora estan a mano', target];
                                events.push(temp);

                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }
                        } else if (r2 > eventos.relacion) {
                            let target = selectSomeone(current, livingPlayers, 'relation')

                            // Mientras no haya una relacion
                            if (target !== false && relation.length === 0) {
                                let temp = [current, 'relation', 'compartio refugio con ' + target[1] + ' por muchas horas', target];
                                setRelation([current, target]);
                                current[5] = target[1];
                                events.push(temp);
                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }
                        } else if (r2 > eventos.muerte) {
                            let messange = getDeathMessange(time);
                            let temp = [current, 'death', messange];
                            // matar(current);
                            current[4] = false;
                            events.push(temp);

                            let death = current;
                            death[4] = false;
                            deaths.push(death);
                        } else if (r2 > eventos.revive) {
                            // revivir();
                            console.log("Revivir")
                        } else {
                            console.log("Error - Fuera de rango" + r2)
                            // accionDefault();
                        }
                    }
                }
                playerUpdated.push(current);
            });
        }
        setReg(events);
        setDeaths(deaths);
        setActive(playerUpdated);

    }

    const matar = (target) => {
        let temp = [];
        activePlayers.map((current) => {
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
        // console.log("Active players",activePlayers);

        if (comun.length > 0) {
            return (<ComunEvent eventsList={comun} time={time} round={round} setEv={setEv} setIndex={setIndex} />)
        }
        else {
            return (
                <div>
                    <h1>No hay eventos comunes</h1>
                    <h2>Pasamos directo a la accion</h2>
                    <button onClick={() => {
                        setEv(true),
                            setIndex(0)
                    }}></button>
                </div>
            )
        }
    }

    const specialEvents = (eventIndex) => {

        // [player, evento, mensaje, target]
        // player = [url,nombre -,-,-,-] unico array
        // evento = 'kill' || 'death' etc. string
        // mensaje = '' string
        // target = [[play],[player],[player]] un array de arrays

        let especial = [];
        regEvents.map((current) => {
            if (current[1] != 'comun') {
                especial.push(current)
            }
        })
        // Sintaxis
        // Evento = [evento1, evento 2, evento3]
        // evento1= [player, tipo de evento, mensaje, target]
        // player = [,,,,], mensaje = "", target=[,,,,,,]

        // Si aun hay eventos especiales
        if (eventIndex < especial.length) {
            let messange = `${especial[eventIndex][0][1]} ${especial[eventIndex][2]}`;
            // Solo para mostrar 1 o 2 campos
            let onlyOne = false;
            // Ruta del icono
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
                    <SEOnePlayer event={especial[evIndex]} messange={messange} icon={icon} index={evIndex} setIndex={setIndex} />
                )
            } else {
                if (especial[eventIndex][1] === 'kill') {
                    return (<SEMurder event={especial[eventIndex]} eventIndex={eventIndex} icon={icon} messange={messange} setIndex={setIndex} />)
                } else {
                    return (<SpecialEvent event={especial[eventIndex]} eventIndex={eventIndex} setIndex={setIndex} messange={messange} icon={icon} />)
                }
            }
        } else {
            // Terminaron todos los eventos especiales
            let deaths = activePlayers.filter(player => player[4] === false);

            // Si todos murieron
            if (deaths.length === activePlayers.length) {
                return (<AllDeaths players={activePlayers} resetGame={resetGame} />)
            } else {
                // si hay queda 1 solo jugador - Osea que gano
                if (deaths.length === activePlayers.length - 1) {
                    let winner = activePlayers.filter(player => player[4] === true);

                    return (<Winner winner={winner} resetGame={resetGame} />)

                } else { // En caso de que queden mas
                    return (<Deaths roundDeaths={roundDeaths} setIndex={setIndex} setEv={setEv} setTime={setTime} />)
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
    'se topo con el caballo homosexual de las montañas, sin posibilidad de supervivencia.',
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

const singleMurderMessange = [
    ['le disparo a ', 'con un rifle de caza'],
    ['le disparo a ', 'con un arco'],
    ['macheteo a ', 'con un machete oxidado'],
]

const multipleMurderMessange = [
    ['le disparo a ', 'con un rifle de caza'],
    ['le disparo a ', 'con un arco'],
    ['macheteo a ', 'con un machete oxidado'],
]

function getMurderMessange(amount, players) {
    if (amount > 1) {
        let random = Math.floor(Math.random() * multipleMurderMessange.length);
        let messange = multipleMurderMessange[random][0];
        players.forEach((current, index) => {
            if (index < players.length - 1) {
                messange = messange + current[1] + ", ";
            } else {
                messange = messange + current[1] + ".";
            }
        })
        return messange;
    } else {
        let random = Math.floor(Math.random() * singleMurderMessange.length);

        let messange = singleMurderMessange[random][0] + players[0][1] + " " + singleMurderMessange[random][1];
        return messange;
    }
}

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
        let messange = comunMessangeDay[random];

        return messange;
    } else {
        let random = Math.floor(Math.random() * (comunMessangeNight.length - 1))
        let messange = comunMessangeNight[random];

        return messange;
    }
}