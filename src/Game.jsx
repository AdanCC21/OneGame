import { useEffect, useState } from "react";

import './css/game.css'
import { useNavigate } from "react-router-dom";
import { ComunEvent, NotComunEvents } from "./assets/components/ComunEvents";
import { AllDeaths, SEMurder, SEOnePlayer, SpecialEvent, Winner, Deaths } from "./assets/components/SpecialEvents";


export function Game({players }) {
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
        navigator('/OneGame/')
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
            let relationActive = relation;
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
                            let event = getComunEvent(current);
                            events.push(event);
                            current = event[0];
                        } else if (r2 > eventRange.deal) {
                            let target = selectSomeone(current, players, 'deal');

                            // Si no es su pareja
                            if (target !== false && current[5] !== target) {
                                // let message = ["Formo trato con",target]
                                let message = getDealMessage(target);
                                let temp = [current, 'deal', message, target];
                                events.push(temp);

                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }
                        } else if (r2 > eventRange.relation) {
                            let target = selectSomeone(current, players, 'relation')

                            // Mientras no haya una relacion
                            if (target !== false && relationActive === false) {
                                let temp = [current, 'relation', 'compartio refugio con ' + target[1] + ' por muchas horas', target];
                                relationActive = true;
                                setRelation(relationActive);
                                current[5] = target;
                                events.push(temp);
                            } else {
                                let event = getComunEvent(current);
                                events.push(event);
                                current = event[0];
                            }
                        } else if (r2 > eventRange.death) {
                            // ["mensaje",cantidad de puntos que disminuye]
                            let message = getDeathMessange(time);
                            if ((current[3] + message[1]) > 2) {
                                let temp = [current, 'death', `${message[0]} Sin embargo, apenas duras logro sobrevivir.`];
                                current[3] += message[1];
                                current[2] = 2;

                                events.push(temp);
                            } else {
                                let temp = [current, 'death', message[0]];
                                if (current[6] != '') {
                                    message + message + " a pesar de estar armado, no tuvo la habilidad suficiente."
                                }
                                events.push(temp);

                                current[4] = false;
                                current[3] += message[1];
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
                // Verificar que no se haya pasado del rango de habilidades
                if (current[2] > 10) {
                    current[2] = 10;
                }
                if (current[3] > 10) {
                    current[3] = 10;
                }
            });
        }

        // Si es de dia o noche
        if (time) {
            getEvents(probEventsDay);
        } else {
            getEvents(probEventsNight);
        }

        let sortEvents = () => {
            let finalEvent = [];
            events.map((current) => {
                if (current[1] === 'comun') {
                    finalEvent.push(current);
                }
            })

            events.map((current) => {
                if (current[1] === 'relation') {
                    finalEvent.push(current);
                }
            })

            events.map((current) => {
                if (current[1] === 'deal') {
                    finalEvent.push(current);
                }
            })

            events.map((current) => {
                if (current[1] === 'kill') {
                    finalEvent.push(current);
                }
            })

            events.map((current) => {
                if (current[1] === 'death') {
                    finalEvent.push(current);
                }
            })

            events.map((current) => {
                if (current[1] === 'revive') {
                    finalEvent.push(current);
                }
            })
            return finalEvent;
        }
        let finalEvents = sortEvents();
        // console.log(players);
        setActive(players);
        setReg(finalEvents);
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

        if (comun.length > 0) {
            return (<ComunEvent eventsList={comun} time={time} round={round} setEv={setEv} setIndex={setIndex} />)
        }
        else {
            return (<NotComunEvents time={time} setEv={setEv} setIndex={setIndex} />)
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
        // player = [,,,,], mensaje = "", target=[t1,t2,t3,t4,,,]

        // Si aun hay eventos especiales
        if (eventIndex < especial.length) {
            let event = especial[eventIndex];
            let messange = `${event[0][1]} ${event[2]}`;
            // Solo para mostrar 1 o 2 campos
            let onlyOne = false;
            // Ruta del icono
            let icon = 'icon/';
            switch (event[1]) {
                case 'kill':
                    if (event[0][5] != null && event[0][5][1] === event[3][0][1]) {
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
                    <SEOnePlayer event={event} messange={messange} icon={icon} index={evIndex} setIndex={setIndex} />
                )
            } else {
                if (event[1] === 'kill') {
                    return (<SEMurder event={event} eventIndex={eventIndex} icon={icon} messange={messange} setIndex={setIndex} />)
                } else {
                    return (<SpecialEvent event={event} eventIndex={eventIndex} setIndex={setIndex} messange={messange} icon={icon} />)
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

// ------------ Asesinatos ------------ //
const lvWeapon = ['arrow', 'navaja', 'lanza', 'machete', 'hacha', 'gun']

// Armas de fuego y explosivos
const gunMurder = [
    //guns 0-3
    ["le disparo en la cabeza a ", "un disparo mortal.", -10],
    ["le disparo a ", "en el pecho, un disparo mortal.", -10],
    ["le disparo a ", "en una de sus extremidades, lo dejo gravemente herido.", -9],
    ["amenazo con disparar a ", "este se resistio, y le dispararon.", -9],

    //bombs 4-5
    ["detono a ", "arrojando un explosivo en su campamento, no dejo rasto alguno de vida", -10],
    ["detono a ", "plantando una mina en su campamento", -10],
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

const duoMurderMessage = [
    ["traiciono a ", "apuñalandolo por la espalda...", 0, 0],
    ["traiciono a ", "disparandole en la cabeza...", 0, 0],
    ["traiciono a ", "atravezando su corazon con una flecha...", 0, 0],
    ["traiciono a ", "rompiendole el cuello...", 0, 0],
]

function getMurderMessage(amount, players, killer) {
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
                message = message + current[1] + ", ";
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

    const getBetrayal = (messagesList, limit) => {
        let message;
        if (amount > 1) {
            message = messagesList[limit][0];

            players.forEach((current, index) => {
                if (index < players.length - 1) {
                    message = message + current[1] + ", ";
                } else {
                    message = message + current[1] + ", ";
                }
            })
            message = message + messagesList[limit][1];
        } else {
            message = messagesList[limit][0] + players[0][1] + " " + messagesList[limit][1];
        }

        return [message, messagesList[limit][2]];
    }

    const murders = (func) => {

        if (killer[5] != null && players[0][1] == killer[5][1]) {
            let duoRange = {
                machete: 1,
                navaja: 1,
                hacha: 1,
                lanza: 1,
                gun: 2,
                arrow: 3,
                default: 4,
            }
            let range = duoRange[killer[6]] || duoRange.default;
            return getBetrayal(duoMurderMessage, range - 1);
        } else {
            if (killer[6] ==='gun') {
                // Flata cambiar lo de las bombas
                let fireWeapons = {
                    gun: { min: 0, max: 3 },
                    bomb: { min: 4, max: 5 },
                    default: { min: 0, max: 5 },
                };

                let range = fireWeapons[killer[6]] || fireWeapons.default;

                return func(gunMurder, range);

            } else if (killer[6].includes('machete')|| killer[6].includes('navaja') || killer[6].includes('hacha')|| killer[6].includes('lanza')) {
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

            } else if (killer[6].includes("arrow")) {
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
    }

    if (amount > 1) {
        return murders(getMultipleMurder);
    } else {
        return murders(getSingleMurder);
    }
}

// ------------ Muertes ------------ //

// Mensaje, Habilidad para sobrevivir que se restara
const deathMessangesDay = [
    ['intentó disparar un arma defectuosa, explotando el cañón de esta misma en su cara.', -9],
    ['al querer probar un arma la disparó al cielo, la bala cayó en su cabeza, qué mala suerte.', -10],
    ['se enterró un cuchillo en el pecho al tropezar mientras huía de una manada de lobos.', -10],
    ['accidentalmente activó un explosivo en su cara.', -9],
    ['pisó una mina de los cazadores.', -10],

    ['no aguantó el hambre.', -10],
    ['no aguantó la deshidratación.', -10],
    ['murió horas después de probar una fruta venenosa.', -10],
    ['bebió agua de un charco infectado, muriendo de una fiebre mortal.', -10],

    ['murió al caer de cabeza de un árbol.', -10],
    ['murió al ser atacado por una horda de hámsters salvajes.', -10],
    ['se desmayó por el calor, siendo una presa fácil para los lobos.', -8],
    ['murió a los minutos de ser mordido por una cobra real.', -10],
    ['fue atacado por monos al tratar de obtener fruta de un árbol.', -7],
    ['creyó que le ganaría a un oso.', -9],
    ['cayó en un río helado, muriendo de hipotermia.', -8],
    ['al resbalar, murió.', -8],

    ["intentó cruzar un río caudaloso, pero fue arrastrado por la corriente y se ahogó.", -10],
    ["fue embestido por un jabalí mientras recolectaba bayas.", -9],
    ["se quedó atrapado en arenas movedizas, sin poder salir a tiempo.", -10],
    ["fue alcanzado por un rayo mientras trataba de refugiarse de una tormenta.", -10],
    ["cayó por un acantilado al perder el equilibrio mientras escalaba.", -10],
    ["se acercó demasiado a un panal y fue atacado por un enjambre de abejas mortales.", -9],
    ["bebió un líquido desconocido que resultó ser veneno, muriendo poco después.", -10],
    ["fue alcanzado por un árbol que cayó tras un fuerte viento.", -8],
    ["quedó atrapado bajo rocas al provocar un derrumbe accidental.", -10],
    ["subió a un árbol en busca de frutas, pero una rama se rompió y cayó de cabeza.", -10],
    ["intentó cazar un animal grande, pero terminó siendo atacado.", -8],
    ["se aventuró en una cueva oscura y fue atacado por un depredador al interior.", -10],
    ["resbaló en una pendiente y terminó cayendo sobre rocas puntiagudas.", -10],
    ["se acercó demasiado a un cocodrilo mientras trataba de pescar y fue atacado.", -9],
    ["fue emboscado por una serpiente mientras buscaba frutas entre los arbustos.", -9],
    ["murió tras ser atacado por una manada de lobos mientras intentaba huir.", -10],
    ["ignoró una advertencia y cayó en una trampa colocada por otros competidores.", -8],
    ["intento atacar a un oso y murió tras un solo zarpazo.", -10],
    ["se desplomó por el calor extremo, sin fuerzas para seguir adelante.", -10],

]
// 13
const deathMessangesNight = [
    ['intentó disparar un arma defectuosa, explotando el cañón de esta misma en su cara.', -9],
    ['al querer probar un arma la disparó al cielo, la bala cayó en su cabeza, qué mala suerte.', -10],
    ['se enterró un cuchillo en el pecho al tropezar mientras huía de una manada de lobos.', -10],
    ['accidentalmente activó un explosivo en su cara.', -9],
    ['pisó una mina de los cazadores.', -10],

    ['no aguantó el hambre.', -10],
    ['no aguantó la deshidratación.', -10],
    ['murió horas después de probar una fruta venenosa.', -10],
    ['bebió agua de un charco infectado, muriendo de una fiebre mortal.', -10],

    ['no soportó el fuerte frío de la noche.', -6],
    ['murió tras ser atacado por un oso mientras dormía.', -10],
    ['se quemó hasta la muerte al tratar de encender una fogata.', -9],
    ['cayó de un precipicio al no ver en la oscuridad.', -7],
    ['fue emboscado por una manada de lobos mientras dormía.', -9],
    ['se le metió un ciempiés en la oreja mientras dormía.', -10],

    ["fue atacado por un depredador nocturno mientras trataba de descansar.", -10],
    ["cayó en una trampa colocada por otros competidores, sin poder pedir ayuda en la oscuridad.", -8],
    ["fue arrastrado por una corriente helada al intentar cruzar un río en la noche.", -8],
    ["intentó encender una antorcha, pero provocó un incendio que terminó con su vida.", -9],
    ["fue atacado por un enjambre de murciélagos rabiosos dentro de una cueva.", -9],
    ["se perdió en la oscuridad y cayó en un barranco profundo.", -9],
    ["murió al ser mordido por una serpiente venenosa mientras buscaba refugio.", -10],
    ["se acercó demasiado a un pantano y fue atacado por un caimán bajo el agua.", -10],
    ["fue alcanzado por una rama caída al intentar refugiarse de los fuertes vientos nocturnos.", -8],
    ["se quedó dormido bajo el cielo abierto y murió congelado debido a la baja temperatura.", -10],
    ["tropezó en la oscuridad y cayó sobre una roca puntiaguda.", -10],
    ["fue emboscado por una manada de lobos mientras intentaba encender una fogata.", -10],
    ["bebió agua contaminada de un charco nocturno y murió horas después.", -10],
    ["se acercó a un acantilado sin darse cuenta y cayó al vacío en la penumbra.", -9],
    ["murió tras ser atacado por un depredador que no pudo ver venir en la oscuridad.", -10],
    ["se desplomó al caminar en círculos por horas, agotado y sin encontrar refugio.", -7],
    ["fue aplastado por rocas al provocar un derrumbe mientras escalaba de noche.", -10],
    ["murió de hipotermia tras quedar atrapado en una tormenta nocturna.", -9],
    ["fue sorprendido por un jabalí nocturno y no logró escapar.", -9],

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

// --------------- Eventos comunes genericos --------------- //
const comunMessangeDay = [
    ['recolectó bayas y frutos del bosque.', 0, 0],
    ['se movió hacia una nueva zona para explorar.', 0, 0],
    ['avistó a otro competidor, pero decidió mantenerse oculto.', 0, 0],
    ['descansó brevemente bajo la sombra de un árbol.', 0, 0],
    ['bebió agua de un arroyo cercano.', 0, 0],
    ['se desmaya de agotamiento', 0, 0],
    ['se desmaya de agotamiento', 0, 0],
    ["exploró una cueva cercana, pero no encontró nada interesante.", 0, 0],
    ["se detuvo a afilar un palo, preparándose para cualquier peligro.", 0, 0],
    ["escuchó un ruido extraño y se mantuvo alerta.", 0, 0],
    ["ayudó a un animal herido que encontró en su camino.", 0, 0],
    ["se escondió en un arbusto tras escuchar pasos cercanos.", 0, 0],
    ["cruzó un río con cuidado para no mojar sus pertenencias.", 0, 0],
    ["pasó horas recolectando leña para mantener el fuego encendido.", 0, 0],
    ["encontró un refugio natural entre las rocas para descansar un rato.", 0, 0],

    // acciones que debilita - cuantos puntos debilita
    ['se lastimo al buscar frutos en los arbustos.', 0, -0.5],
    ['fue atacado por un lobo, sobrevivio pero le dejo el brazo sangrando, debera atender sus heridas y cuidarse de la manada de lobos.', -1.5, -1.5],
    ['cayó de un arbol muy alto, se quebro una pierna.', -2, -2],
    ['fue mordido por una serpiente, decidio cortarse el brazo antes de que el veneno se esparza', -3.5, -3],
    ['fue atacado por una manada de lobos, apenas logra sobrevivir', -2, -3],
    ['fue atacado por un enjambre de abejas, una serpiente, un oso bebe, y 2 hamsters salvajes, apenas sobrevivio.', -2, -3.5],
    ["comió bayas venenosas y comenzó a sentirse mal del estómago.", 0, -1],
    ["fue atrapado por una tormenta, quedando empapado y con frío.", 0, -1],
    ["tropezó con una raíz y se lastimó el tobillo.", 0, -0.5],
    ["fue emboscado por un jabalí, logrando escapar con algunas heridas.", -1, -2],
    ["se cortó la mano al intentar abrir una lata con un palo afilado.", 0, -0.5],
    ["fue atacado por un enjambre de avispas y tuvo que huir dolorido.", -1, -2],
    ["se deshidrató tras un día entero sin encontrar agua.", -2, -2],
    ["perdió su mochila al intentar cruzar un río caudaloso.", -1, -1],
    ["sufrió un ataque de fiebre debido a la exposición prolongada al frío, esto le afectara mas adelante.", -2, -4],

    // acciones que fortalecen + puntos a fortalecer
    ["construyó una pequeña trampa para animales.", 1, 1],
    ["practica su punteria", 1, 1]
    ["encontró un refugio seguro y lo mejoró con ramas y hojas.", 1, 1],
    ["cazó un conejo.", 0, 1.5],
    ["descubrió un árbol con frutas nutritivas y recolectó suficiente para días.", 1, 1],
    ["aprendió a hacer fuego sin herramientas, ganando confianza.", 0, 1.5],
    ["se topó con una fuente de agua limpia y llenó su cantimplora.", 1, 1],
    ["construyó una rudimentaria armadura con corteza de árbol.", 1, 1],
    ["estableció un punto estratégico para vigilar los alrededores.", 1, 1],
    ["logró encender un fuego incluso bajo la lluvia.", 1, 1.5],

]

// mensaje, fuerza, supervivencia
const comunMessangeNight = [
    ["encontró un lugar seguro para pasar la noche.", 0, 0],
    ["escuchó ruidos extraños, pero decidió no investigar.", 0, 0],
    ["reforzó su refugio con ramas y piedras.", 0, 0],
    ["encendió una pequeña fogata para mantenerse caliente.", 0, 0],
    ["intentó mantenerse despierto para vigilar el área.", 0, 0],
    ["cazó lobos durante la noche.", 0, 0],
    ["se quedó en completo silencio al escuchar pasos cercanos.", 0, 0],
    ["revisó su equipo para prepararse para el día siguiente.", 0, 0],
    ["vio el brillo de una fogata en la distancia.", 0, 0],
    ["observó el cielo nocturno en busca de constelaciones para orientarse.", 0, 0],
    ["escuchó a los búhos mientras se mantenía alerta en la oscuridad.", 0, 0],
    ["encontró un lugar apartado para descansar bajo la luz de la luna.", 0, 0],
    ["se escondió entre los arbustos al escuchar pasos en la oscuridad.", 0, 0],
    ["encendió una pequeña fogata para mantenerse caliente en la fría noche.", 0, 0],
    ["caminó sigilosamente para evitar ser detectado en la oscuridad.", 0, 0],
    ["encontró luciérnagas que iluminaron brevemente su camino.", 0, 0],
    ["escuchó el crujir de ramas cercanas y se preparó para cualquier peligro.", 0, 0],
    ["escondió sus pertenencias antes de intentar dormir un poco.", 0, 0],
    ["fabricó una antorcha improvisada para iluminar su camino.", 0, 0],

    // Acciones que lo debilitan
    ["decidió mantenerse despierto toda la noche por precaución.", 0, -1],
    ["no pudo dormir por un ataque de ansiedad.", 0, -1],
    ["no pudo dormir por el miedo a los lobos.", 0, -1],
    ["se quemó la mano gravemente al encender una fogata. Será difícil sostener firme un arma.", 0, -3],
    ["se tropezó en la oscuridad y cayó sobre una roca, lastimándose el brazo.", 0, -0.5],
    ["se perdió al intentar moverse en la noche, agotando sus fuerzas.", 0, -3],
    ["fue sorprendido por un depredador nocturno y apenas logró escapar.", -2, -3],
    ["sufrió una picadura de insectos mientras dormía al aire libre.", 0, -0.5],
    ["se mojó al quedarse dormido bajo una lluvia inesperada.", 0, -0.5],
    ["se cortó con una rama mientras intentaba moverse en la oscuridad.", 0, -0.5],
    ["el frío nocturno lo debilitó al no tener suficiente abrigo.", -2, -3],
    ["su fogata atrajo a un depredador y tuvo que huir, perdiendo base.", -2, -5],
    ["se deshidrató al no encontrar agua durante la noche.", -1, -3],

    // Acciones que lo fortalecen
    ["extraña a su familia...", 2, 0],
    ["descansó durante el resto de la noche.", 1, 1],
    ["encontró un refugio oculto que lo protegió durante toda la noche.", 0, 2],
    ["descansó profundamente en un lugar seguro, recuperando energía.", 0, 2],
    ["cazó un animal pequeño con sigilo durante la noche.", 1.5, 1.5],
    ["logró encender una fogata en medio de la oscuridad para protegerse del frío.", 1, 1.5],
    ["usó la oscuridad para moverse sin ser detectado por otros competidores.", 0, 1],
    ["afinó sus sentidos en la oscuridad, mejorando su percepción del entorno.", 2, 2],
    ["encontró un árbol lleno de frutos incluso bajo la luz tenue de la luna.", 0, 1],
];


const getWeaponsMessage = [
    ["encontró una caja con armamento militar.", 8, 0, 'gun'],
    ["recogió un arma del suelo para su suerte, tiene 2 cartuchos de munición.", 8, 0, 'gun'],
    ["encontró el cadáver de un cazador y le arrebató el arma y sus provisiones.", 8, 0, 'gun'],

    // Acciones que fortalecen + puntos a fortalecer
    ["construyó una lanza improvisada.", 6, 0, 'lanza'],
    ["encontró una lanza reforzada.", 6, 0, 'lanza'],

    ["encontró un machete.", 6, 0, 'machete'],
    ["encontró un machete, algo oxidado, pero eso le suma puntos.", 6, 0, 'machete'],

    ["encontró un hacha.", 6, 0, 'hacha'],
    ["robó un hacha de un campamento de cazadores.", 6, 0, 'hacha'],

    ["fabricó un arco.", 4, 0, 'arrow'],
    ["encontró un arco.", 4, 0, 'arrow'],

    ["encontró una navaja.", 6, 0, 'navaja'],
    ["robó una navaja del cadáver de un cazador.", 6, 0, 'navaja'],
];


function getComunMessange(day, current) {

    const getMessage = (messagesList) => {
        let random = Math.floor(Math.random() * (messagesList.length - 1))
        let message = messagesList[random];

        current[2] += message[1];
        current[3] += message[2];

        if (message.length > 3) {
            let i = lvWeapon.indexOf(current[6]);
            let i2 = lvWeapon.indexOf(message[3]);
            if (i2 > i) {
                current[6] = message[3];
            }
        }

        return message;
    }

    let lucky = Math.floor(Math.random() * 10);

    if (lucky >= 2) {
        return getMessage(getWeaponsMessage)
    } else {
        if (day) {
            return getMessage(comunMessangeDay)
        } else {
            return getMessage(comunMessangeNight)
        }
    }
}

// --------------- Tratos --------------- //
const dealMessage = [
    ["intentó huir de ", ", este lo atrapo, pero este le perdonó la vida... por ahora."],
    ["intentó asesinar a ", ", pero este le perdonó la vida... por ahora."],
    ["intentó robar provisiones a ", ", pero este le perdonó la vida... por ahora."],
    ["y ", " decidieron compartir recursos por ahora están a mano."],
    ["y ", " se dieron la mano y dejaron que cada quien tomara su rumbo."],
    ["dejó que ", " huyera; por ahora le perdonó la vida."],
    ["le advirtió a ", " que la próxima vez que lo viera sería su final; por ahora, cada quien tomó su rumbo."],
];


function getDealMessage(target) {
    let random = Math.floor(Math.random() * (dealMessage.length - 1))
    let message = dealMessage[random][0] + target[1] + dealMessage[random][1];
    return message;
}