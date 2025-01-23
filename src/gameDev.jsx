import { act, useEffect, useState } from "react";

import './css/game2.css'
import { useNavigate } from "react-router-dom";
import { ComunEvent } from "./assets/components/ComunEvents";
import { AllDeaths, SEMurder, SEOnePlayer, SpecialEvent, Winner, Deaths } from "./assets/components/SpecialEvents";

// TO DO
// Iconos de dia y noche
// Cambiar iconos .png a .svg

// Recuerda cambiar de nuevo los atributos base en todos los archivos

// VALIDACIONES
// Que cada nombre sea unico
// maximo 20 caracteres para un nombre
// un link maximo de 300 caracteres?
// solo aceptar png, jpg, jpeg y ya

//-----------
// que ganen una pareja
// Mensaje de traicion, aunque creo que ya esta
// mas mensajes de personalizados
// mensajes de trato
// pedirle al toño avr si me ayuda con los estilos
// falta que cada que maten a alguien se le resten los puntos de muerte al asesinado.

// -----------------------------------------------
// Hm = Habilidad para matar, Hs = Habilidad para sobrevivir
// survivalSkill - killingSkill
// -----------------------------------------------


const route = "src/assets/players/";

export function Gamme({ }) {
    // url, nombre ,Habilidad para matar, Habilidad para sobrevivir, vivo o muerto, nombre de su pareja, arma principal
    // habilidades de 1 a 10, como base 2 y 5

    const players = [
        [`${route}cinthia.png`, 'Cinthia', 6, 5, true, null, 'lanza'],
        [`${route}palob.png`, 'Palob', 6, 5, true, null, 'machete'],
        [`${route}malone.png`, 'Malone', 6, 5, true, null, 'hacha'],
        [`${route}eddy.png`, 'Eddy', 8, 5, true, null, 'gun'],
        [`${route}foka.png`, 'Foka', 4, 5, true, null, 'arrow'],
        [`${route}dlv.png`, 'Dlv', 6, 5, true, null, 'navaja'],
        [`${route}eslo.png`, 'Eslo', 2, 5, true, null, ''],
        [`${route}josue.png`, 'Josue', 2, 5, true, null, ''],
        [`${route}chaino.png`, 'Chaino', 2, 5, true, null, ''],
        [`${route}adan.png`, 'Adan', 2, 5, true, null, ''],
    ]

    const navigator = useNavigate();

    // 0=url, 1=nombre, 2=% de matar 3=% de sobrevivir [4=buen estado, 1=casi muerto], 4= estado (vivo o muerto), 5 = nombre de jugador con relacion
    let [activePlayers, setActive] = useState(players);
    // 0=url, 1=nombre, 2=% de matar 3=% de revivir, 4= estado (vivo o muerto), 5 = nombre de jugador con relacion
    let [roundDeaths, setDeaths] = useState([]);

    // 2 campos, pareja 1 y 2
    let [relation, setRelation] = useState(false);
    // Dia = ture, noche = false
    let [time, setTime] = useState(true);

    let [round, setRound] = useState(0);
    // mostrando eventos especiales
    let [specialEv, setEv] = useState(false);
    // indice de evento actual mostrandose
    let [evIndex, setIndex] = useState(0);
    // player, evento, mensaje, target
    let [regEvents, setReg] = useState([])
    // Revivio un jugador?
    let [playerRevive, setRevive] = useState(false);

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
        doEvent();
        if (time) {
            setRound(round + 1);
        }

    }, [time])

    function selectSomeone(current, playersList, action, multiplePlayers = false) {
        // Action true = kill o trato, false = relacion
        let kills = 1;
        // Si no tiene pareja
        if (current[5] !== null) {
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

                        if (!objetivos.includes(player) && player !== current[5]) {

                            objetivos.push(player);
                            // matar(player);
                        }
                    }

                    return objetivos;
                }

            } else {
                let player = [];
                player.push(playersLiving[Math.floor(Math.random() * playersLiving.length)]);
                // matar(player[0]);
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
                let playersLiving = playersList.filter(player => player[4] === true && player !== current && player[5] === null);
                if (playersLiving.length === 0) {
                    return false;
                }
                const random = Math.floor(Math.random() * playersLiving.length);
                const player = playersLiving[random];
                player[5] = current;
                return player;
            }
        }
    }

    function getComunEvent(player) {
        let messange = getComunMessange(time, player);
        if (messange[1] != 0 || messange[2] != 0) {
            player[2] += messange[1];
            player[3] += messange[2];
        }

        return [player, 'comun', messange[0]];
    }

    const doEvent = () => {
        let events = [];
        let deaths = [];
        let players = activePlayers.map(player => {
            return [
                ...player.slice(0, 5), // Copia los primeros 5 elementos directamente, de 0 hasta 4
                Array.isArray(player[5]) ? [...player[5]] : null, // Hace una copia del array en la posición 5 o deja `null`
                player[6] // Copia el último elemento
            ];
        });

        const probEventsDay = {
            // desde n, hasta 100
            murder: 80,
            comun: 40,
            deal: 35,
            relation: 30,
            death: 0,
            // desde 0 hasta n
            revive: 5
        }

        const probEventsNight = {
            // desde n, hasta 100
            murder: 60,
            comun: 40,
            deal: 30,
            relation: 25,
            death: 0,
            // desde 0 hasta n
            revive: 5
        }

        const getEvents = (eventRange) => {
            players.forEach((current) => {
                let random = Math.floor(Math.random() * 100) + 1;

                if (current[4]) {
                    // Asesinar
                    if (random > eventRange.murder) {
                        // random x
                        let r2 = Math.floor(Math.random() * 10) + 1;

                        // Matar a varios
                        if (r2 < current[2]) {
                            let targets = selectSomeone(current, players, 'kill', true);
                            if (targets !== false) {
                                let message = getMurderMessage(targets.length, targets, current);

                                targets.map((current) => {
                                    players.forEach((actual) => {
                                        if (current === actual) {
                                            actual[2] += message[1];
                                            actual[4] = false;
                                        }
                                    })
                                })


                                let event = [current, 'kill', message[0], targets];
                                events.push(event);

                                targets.forEach((current) => {
                                    let player = current;
                                    deaths.push(player);
                                })

                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }

                        } else { // Matar solo uno
                            let target = selectSomeone(current, players, 'kill', false);

                            if (target !== false) {
                                let message = getMurderMessage(1, target, current);
                                players.forEach((actual) => {
                                    if (actual === target[0]) {
                                        actual[2] += message[1];
                                        actual[4] = false;
                                    }
                                })

                                let event = [current, 'kill', message[0], target];
                                events.push(event);

                                let death = target[0];
                                deaths.push(death);

                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }

                        }
                    } else {
                        let r2 = Math.floor(Math.random() * 100) + 1;

                        if (r2 >= eventRange.comun) {
                            // [player, tipo de evento, mensaje]
                            // en la misma funcion se modifica el jugador
                            let event = getComunEvent(current);
                            events.push(event);
                            current = event[0];
                        } else if (r2 > eventRange.deal) {
                            let target = selectSomeone(current, players, 'deal');

                            // Si no es su pareja
                            if (target !== false && current[5] !== target) {
                                // let message = ["Formo trato con",target]
                                let temp = [current, 'deal', 'formo un trato con ' + target[1] + ' por ahora estan a mano', target];
                                events.push(temp);

                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }
                        } else if (r2 > eventRange.relation) {
                            let target = selectSomeone(current, players, 'relation')

                            // Mientras no haya una relacion
                            if (target !== false && relation === false) {
                                let temp = [current, 'relation', 'compartio refugio con ' + target[1] + ' por muchas horas', target];
                                setRelation(true);
                                current[5] = target;
                                events.push(temp);
                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }
                        } else if (r2 > eventRange.death) {
                            // ["mensaje",cantidad de puntos que disminuye]
                            let messange = getDeathMessange(time);
                            if ((current[3] + messange[1]) > 2) {
                                let temp = [current, 'death', `${messange[0]} Sin embargo, apenas duras logro sobrevivir.`];
                                current[3] += messange[1];
                                current[2] = 2;

                                events.push(temp);
                            } else {
                                let temp = [current, 'death', messange[0]];
                                events.push(temp);

                                current[4] = false;
                                current[3] += messange[1];
                                current[2] = 2;

                                deaths.push(current);
                            }
                        } else {
                            console.log("Error - Fuera de rango" + r2)
                        }
                    }
                } else {
                    if (!playerRevive) {
                        if (random < eventRange.revive) {
                            let r1 = Math.floor(Math.random() * 10) + 1;
                            if (current[3] > r1) {
                                let messange = 'resurgio de las sombras para seguir jugando';
                                let temp = [current, 'revive', messange];

                                current[4] = true;
                                events.push(temp);
                                setRevive(true);
                            }
                        }
                    }
                }
            });
        }

        // Si es de dia o noche
        if (time) {
            getEvents(probEventsDay);
        } else {
            getEvents(probEventsNight);
        }

        setActive(players);
        setReg(events);
        setDeaths(deaths);
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
                case 'revive':
                    icon = icon + 'heartUp.png'
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
                return (<AllDeaths players={activePlayers} resetGame={resetGame} time={time} />)
            } else {
                // si hay queda 1 solo jugador - Osea que gano
                if (deaths.length === activePlayers.length - 1) {
                    let winner = activePlayers.filter(player => player[4] === true);

                    return (<Winner winner={winner} resetGame={resetGame} />)

                } else { // En caso de que queden mas
                    return (<Deaths roundDeaths={roundDeaths} setIndex={setIndex} setEv={setEv} setTime={setTime} time={time} />)
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

// Mensaje, Habilidad para sobrevivir que se restara
const deathMessangesDay = [
    ['intento disparar un arma defectuosa, explotando el cañon de esta misma en su cara.', -9],
    ['al disparar al cielo, la bala cayó en su cabeza, que mala suerte.', -10],
    ['se enterro su propio cuchillo en el pecho al tropezar mientras huia de una manada de lobos.', -10],
    ['accidentalmente activo un explosivo en su cara.', 9],
    ['piso su proia mina.', -10],

    ['no aguanto el hambre.', -10],
    ['no aguanto la deshidratación.', -10],
    ['murio horas despues de probar una fruta venenosa.', -10],
    ['bebio agua de un charco infectado, muriendo una fiebre mortal.', -10],

    ['murio al caer de cabeza de un arbol.', -10],
    ['murio al ser atacado por una horda de hamsters salvajes.', -10],
    ['se desmayo por el calor, siendo una presa facil para los lobos.', -8],
    ['murio a los minutos de ser mordido por una cobra real.', -10],
    ['fue atacado por monos al tratar de obtener fruta de un arbol.', -7],
    ['creyo que le ganaria a aun oso.', -9],
    ['cayó en un rio helado, muriendo de hipotermia.', -8],
    ['al resbalar se murio', -8],
]
// 13
const deathMessangesNight = [
    ['intento disparar un arma defectuosa, explotando el cañon de esta misma en su cara.', -9],
    ['al disparar al cielo, la bala cayó en su cabeza, que mala suerte.', -10],
    ['se enterro su propio cuchillo en el pecho al tropezar mientras huia de una manada de lobos.', -10],
    ['accidentalmente activo un explosivo en su cara.', 9],
    ['piso su proia mina.', -10],

    ['no aguanto el hambre.', -10],
    ['no aguanto la deshidratación.', -10],
    ['murio horas despues de probar una fruta venenosa.', -10],
    ['bebio agua de un charco infectado, muriendo una fiebre mortal.', -10],
    ['piso una mina.', -10],

    ['no soporto el fuerte frio de la noche.', -6],
    ['murio tras ser atacado por un oso mientras dormia.', -10],
    ['se quemo hasta la muerte al tratar de encender una fogata.', -9],
    ['cayó de un precipicio al no ver en la oscuridad.', -7],
    ['fue emboscado por una manada de lobos mientras dormia.', -9],
    ['se le metio un 100 pies, mientras dormia.', -10],
]

// mensaje, puntos de fuerza, puntos de supervivencia
const comunMessangeDay = [
    // Guns 0 a 2
    ['encontró una caja con armamento militar.', 8, 0],
    ['recogio un arma del suelo, para su suerte tiene 2 cartuchos de municion.', 8, 0],
    ['encontro el cadaver de un cazador, le arrebato el arma y sus proviciones', 8, 0],

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
    ["practica su tiro con arco.", 2, 0],
    ["construyó una lanza improvisada.", 1, 0],
    ["encontró un arma.", 4, 0],
    ["construyó una pequeña trampa para animales.", 1, 1],
    ["construyó una trampa mortal.", 3, 0],
    ["encontro y preparo una mina terrestre.", 2, 0],
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

// ------------ Asesinatos ------------ //

// Armas de fuego y explosivos
const gunMurder = [
    ["le disparo en la cabeza a ", "un disparo mortal.", -10],
    ["le disparo a ", "en el pecho, un disparo mortal.", -10],
    ["le disparo a ", "en una de sus extremidades, lo dejo gravemente herido.", -9],
    ["amenazo con disparar a ", "este se resistio, y le dispararon.", -9],

    ["detono a ", "arrojando un explosivo en su campamento, no dejo rasto alguno de vida", -10],
]

const meleeWeapon = [
    // Navajas0-1
    ["apuñalo a ", "con una navaja, murio desangrado", -10],
    ["apuñalo a ", "con una navaja en el estomago.", -8],

    // Hacha 2-3
    ["decapito a ", "con un hacha.", -10],
    ["corto por la mitad a ", "con un hacha.", -10],

    //Machete 4-5
    ["ataco a ", "con un machete oxidado, lo dejo gravemente herido.", -9],
    ["atraveso ", "con un machete, murio a los pocos minutos.", -10],

    // Lanzas 6-7
    ["ataco a ", "con una lanza hecha a mano, atravezo su corazon.", -10],
    ["le arrojo una lanza a ", "con su buena punteria atravezo su estomago.", -10],
]

const arrowMurder = [
    ["le disparo una flecha a ", "atravezando su corazon", -10],
    ["le disparo a ", "con un arco", -10],
    ["en un enfrentamiento con ", "lo ahorco con el hilo de su arco, rematandolo con una unica flecha en la cabeza", -10],
    ["en un enfrentamiento con ", "lo asfixio con el hilo de su arco, y robo todas sus proviciones", -8],
]

// Genericas
const murderMessage = [
    ['embosco a ', 'asfixiandolo y rematandolo a golpes', -10],
    ['asesino a ', 'a golpes en un enfrentamiento por recursos', -8],
    ['empujo a ', 'de un barranco', -9],
]


function getMurderMessage(amount, players, killer) {
    console.log(killer);
    const getMultipleMurder = (messagesList, range) => {
        if (range.min > range.max) {
            console.log("Error de rangos");
            return null;
        }
        let random = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        let message = messagesList[random][0];

        players.forEach((current, index) => {
            if (index < players.length - 1) {
                message = message + current[1] + ", ";
            } else {
                message = message + current[1] + ".";
            }
        })
        message = message + messagesList[random][1];

        return [message, messagesList[random][2]];
    }

    const getSingleMurder = (messagesList, range) => {
        if (range.min > range.max) {
            console.log("Error de rangos");
            return null;
        }
        let random = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        let message;

        message = messagesList[random][0] + players[0][1] + " " + messagesList[random][1];

        return [message, messagesList[random][2]];
    }

    const murders = (func) => {
        if (killer[2] >= 8) {
            // Flata cambiar lo de las bombas
            let range = {
                gun: { min: 0, max: gunMurder.length - 1 },
                bomb: { min: 0, max: gunMurder.length - 1 },
            };
            return func(gunMurder, range.gun);

        } else if (killer[2] >= 6) {
            let bestWeapon = killer[6];
            const weaponRanges = {
                machete: { min: 4, max: 5 },
                navaja: { min: 0, max: 1 },
                hacha: { min: 2, max: 3 },
                lanza: { min: 6, max: 7 },
                default: { min: 0, max: 2 },
            };

            let range = weaponRanges[bestWeapon] || weaponRanges.default;

            return func(meleeWeapon, range);

        } else if (killer[2] >= 4) {
            let range = {
                max: arrowMurder.length - 1,
                min: 0
            }
            return func(arrowMurder, range);

        } else { // generico
            let range = {
                max: murderMessage.length - 1,
                min: 0
            }
            return func(murderMessage, range);
        }
    }



    if (amount > 1) {
        return murders(getMultipleMurder);
    } else {
        return murders(getSingleMurder);
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

function getComunMessange(day, current) {
    if (day) {
        let random = Math.floor(Math.random() * (comunMessangeDay.length - 1))
        let messange = comunMessangeDay[random];
        if (random >= 0 && random <= 2) {
            if (current[2] < 8) {
                messange[1] = messange[1] - current
            } else {
                messange[1] = 0;
            }
        }

        return messange;
    } else {
        let random = Math.floor(Math.random() * (comunMessangeNight.length - 1))
        let messange = comunMessangeNight[random];

        return messange;
    }
}
