import { act, useEffect, useState } from "react";

import './css/game.css'


export function Game({ players }) {
    players = [
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1323485189967712308/Untitled.png?ex=677fe3e2&is=677e9262&hm=df8e25d1872a886978632fc3d885ec48f80b52210e6823bb5be310ff11900003&', 'Jugador 1', 1, 1, true],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1323120476721119344/traje.png?ex=677fe1b8&is=677e9038&hm=4dac1cb11edc741d2c041d315023ce77cbd15f401f81e79c63210703842e4c4d&', 'Jugador 2', 1, 1, true],
        ['https://cdn.discordapp.com/attachments/1088654568218443926/1266950721845330105/Borracho_2.jpg?ex=677fe20e&is=677e908e&hm=8ddb8ced4e3f03e2fa4e8b6baa2af9aac2910c6b238e71f5fda3b69ce271c2fe&', 'Jugador 3', 1, 1, true]
    ]


    // Vivos [[url,name,level,true]] level=probabilidad de matar 1...4, true = vivo o muerto
    let [activePlayers, setActive] = useState(players.map((current) => { return [...current] }));
    // relaciones, [[j1,j2,type]], type : 1 = relacion, 0 = trato;
    let [relation, setRelation] = useState([]);
    // impar dia, par = noche
    let [round, setRound] = useState(2);

    let [eventsReg, setEvents] = useState([]);

    let [reload, setReload] = useState(false);

    let [bandera, setBand] = useState(0);

    useEffect(() => {
        start();
    }, [reload])

    function killSelf(self) {
        setActive(activePlayers.map((actual) => {
            if (actual === self) {
                actual[4] = false;
            }
            return actual;
        }))
    }

    function KillSomeone(current, act) {
        let band = true;
        let dif = true;
        let ind = 0;
        let history = [];

        while (band && ind < act.length) {
            dif = true;
            let random = Math.floor(Math.random() * act.length);

            // Verificar si ya se ha elegido ese jugador
            for (let i = 0; i < history.length; i++) {
                if (history[i] === random) {
                    dif = false;
                    break;
                }
            }

            if (history.length === act.length) {
                // console.log("Todos los jugadores muertos");
                break;
            }

            if (dif) {
                // Verificar si el jugador está muerto
                if (act[random][4] === false) {
                    // console.log('Está muerto el target: ' + activePlayers[random][1]);
                    history.push(random);
                    ind++;
                } else {
                    // Verificar si no es el mismo jugador
                    if (act[random] !== current) {
                        const jugadorMuerto = act[random]; // Capturar jugador antes de modificar el estado

                        setActive(
                            act.map((actual, index) => {
                                if (index === random) {
                                    return { ...actual, 3: false }; // Marcar como muerto
                                }
                                return actual; // Devolver el elemento sin cambios
                            })
                        );

                        console.log('Matamos a: ' + jugadorMuerto[0]); // Usar la copia almacenada
                        band = false; // Terminar la función
                        return jugadorMuerto;
                    } else {
                        // console.log('Es el mismo, cambiando...');
                        history.push(random);
                        ind++;
                    }
                }
            }
        }
        return false
    }

    function SelectDuo(current) {
        // FALTA VERIFICAR QUE EL QUE SEA SELECCIONADO NO ESTE EN UNA RELACION O TRATO
        let dif = true;
        let ind = 0;
        let history = [];

        while (ind < activePlayers.length) {
            dif = true;
            let random = Math.floor(Math.random() * activePlayers.length);

            // Verificar si ya se ha elegido ese jugador
            for (let i = 0; i <= history.length; i++) {
                if (history[i] === random) {
                    dif = false;
                    break;
                }
            }

            if (history.length === activePlayers.length) {
                // console.log("Todos los jugadores muertos");
                break;
            }

            if (dif) {
                // Verificar si el jugador está muerto
                if (activePlayers[random][4] === false) {
                    history.push(random);
                    ind++;
                } else {
                    // Verificar si no es el mismo jugador
                    if (activePlayers[random] === current) {
                        history.push(random);
                        ind++;
                    } else {
                        // Retornar duo
                        return activePlayers[random];
                    }
                }
            }
        }
        return false;
    }

    // Seleccion de eventos
    function event(current) {
        console.log(current)
        if (current[4] === false) {
            console.log('jugador muerto')
            return false;
        }
        else {
            // Evento
            let random = Math.floor(Math.random() * 100);

            // Accion individual
            if (random >= 20 && random <= 90) {
                // Muerte
                if (random >= 70 && random <= 90) {
                    killSelf(current);
                    console.log(`Murio ${current[1]}`)
                    // Cambiar luego de true o false por dia y noche
                    let messange = getDeathMessange(true);

                    return [current, 'death', messange];
                }
                else {
                    // Comun
                    if (random >= 20 && random <= 70) {
                        console.log(`comun ${current[1]}`)
                        return [current, 'comun']
                    }
                }
            }
            else { // Accion en grupo
                // Asesinato
                if (random > 90 && random <= 100) {
                    // a quien matamos
                    let killed = KillSomeone(current, activePlayers);
                    if (killed) {
                        console.log('matado ' + killed)
                        return [current, 'kill', killed[1]]
                    }
                    return [current, 'comun'];
                } else {
                    // Trato
                    if (random > 5 && random < 20) {
                        let duo = SelectDuo(current);
                        if (duo) {
                            console.log('Genero un trato con ' + duo)
                            console.log(`Trato ${current[1]} with ${duo[1]}`)
                            return [current, 'deal','formo un trato con ', duo]
                        } else {
                            return [current, 'comun'];
                        }
                    }
                    else {
                        // Relacion
                        if (random >= 0 && random < 5) {
                            let duo = SelectDuo(current);
                            console.log(`Relacion ${current[1]} with ${duo[1]}`)
                            return [current, 'relation', 'compartio refugio con ', duo]
                        }
                    }
                }
            }
        }
    }

    // Iniciar eventos
    function start() {
        let tempEventReg = [];
        for (let i = 0; i < activePlayers.length; i++) {
            let current = activePlayers[i];
            if (current != null || current != undefined) {
                let ok = event(current);
                if (ok !== false) {
                    tempEventReg.push(ok);
                }
            }
        }
        setEvents(tempEventReg);
    }


    function comunEvents(events, bandera, setBand, reload, setReload) {
        let comunEvents = []
        events.map((current) => {
            if (current != null) {
                if (current[1] == 'comun') {
                    comunEvents.push(current)
                }
            }
        })

        if (comunEvents.length == 0) {
            return (
                <div>
                    <h1>No hay eventos comunes</h1>
                    <button onClick={() => {
                        if (bandera >= comunEvents.length) {
                            setBand(0)
                            let negation = !reload;
                            setReload(negation);
                        } else {
                            setBand(bandera + 1)
                        }
                    }}>next</button>
                </div>
            )
        }


        return (
            <div className="events">
                {comunEvents.map((current, index) => (
                    <div key={index} className="c-one-event">
                        <img className="player-icon" src={current[0]} alt={current[0][1]} />
                        <div className="line"></div>
                        <p>{`${current[0][1]} evento : ${current[1]} `}</p>
                    </div>
                ))}
                <button onClick={() => { setBand(1) }}>continue</button>
            </div>
        );
    }


    function specialEvents(events, index, setBand, reload, setReload) {
        let specialEvents = []
        events.map((current) => {
            if (current != null) {
                if (current[1] != 'comun') {
                    specialEvents.push(current)
                }
            }
        })

        if (specialEvents.length == 0) {
            return (
                <div>
                    <h1>No hay eventos especiales</h1>
                    <button onClick={() => {
                        if (index >= specialEvents.length) {
                            setBand(0)
                            let negation = !reload;
                            setReload(negation);
                        } else {
                            setBand(index + 1)
                        }
                    }}>next</button>
                </div>
            )
        }

        let current = [];
        current = [...specialEvents[index]];
        console.log(current);
        let messange = current[0][1] + " " + current[2];
        if(current[1] === 'deal' || current[1] === 'relation'){
            messange = messange + current[3][1]
        }

        // current [0], array, 1, evento, 2 mensaje, 3 compañero
        
        return (
            <div className="s-event-global">
                <img className="player-icon" src={current[0][0]} alt={current[0][1]} />
                <div className="line"></div>
                <p>{messange}</p>

                <button onClick={() => {
                    if (bandera >= specialEvents.length) {
                        setBand(0)
                        let negation = !reload;
                        setReload(negation);
                    } else {
                        setBand(bandera + 1)
                    }
                }}>next</button>
            </div>
        );
    }

    function handleEvents() {
        if (bandera == 0) {
            return comunEvents(eventsReg, bandera, setBand, reload, setReload);
        } else {
            return specialEvents(eventsReg, bandera - 1, setBand, reload, setReload);
        }
    }

    return (
        <div className="background">
            {handleEvents()}
            <div className="top">
            </div>
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