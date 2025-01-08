import { act, useEffect, useState } from "react";

export function Game({ players }) {
    // Vivos [[url,name,level,true]] level=probabilidad de matar 1...4, true = vivo o muerto
    let [activePlayers, setActive] = useState(players.map((current) => { return [...current] }));
    // relaciones, [[j1,j2,type]], type : 1 = relacion, 0 = trato;
    let [relation, setRelation] = useState([]);
    // impar dia, par = noche
    let [round, setRound] = useState(2);

    let [eventsReg, setEvents] = useState([]);

    function killSelf(self) {
        setActive(activePlayers.map((actual) => {
            if (actual === self) {
                actual[3] = false;
            }
            return actual;
        }))
    }

    function KillSomeone(current) {
        let band = true;
        let dif = true;
        let ind = 0;
        let history = [];

        while (band && ind <= activePlayers.length) {
            dif = true;
            let random = Math.floor(Math.random() * activePlayers.length);

            // Verificar si ya se ha elegido ese jugador
            for (let i = 0; i < history.length; i++) {
                if (history[i] === random) {
                    dif = false;
                    break;
                }
            }

            if (history.length === activePlayers.length) {
                console.log("Todos los jugadores muertos");
                break;
            }

            if (dif) {
                // Verificar si el jugador está muerto
                if (activePlayers[random][3] === false) {
                    console.log('Está muerto el target: ' + activePlayers[random][1]);
                    history.push(random);
                    ind++;
                } else {
                    // Verificar si no es el mismo jugador
                    if (activePlayers[random] !== current) {
                        setActive(activePlayers.map((actual, index) => {
                            if (index === random) {
                                actual[3] = false; // Marcar como muerto
                            }
                            return actual;
                        }));
                        console.log('Matamos a: ' + activePlayers[random][0]);
                        band = false; // Terminar la función
                        return random;
                    } else {
                        console.log('Es el mismo, cambiando...');
                        history.push(random);
                        ind++;
                    }
                }
            }
        }
    }

    function SelectDuo(current) {
        // FALTA VERIFICAR QUE EL QUE SEA SELECCIONADO NO ESTE EN UNA RELACION O TRATO
        let dif = true;
        let ind = 0;
        let history = [];

        while (ind <= activePlayers.length) {
            dif = true;
            let random = Math.floor(Math.random() * activePlayers.length);

            // Verificar si ya se ha elegido ese jugador
            for (let i = 0; i < history.length; i++) {
                if (history[i] === random) {
                    dif = false;
                    break;
                }
            }

            if (history.length === activePlayers.length) {
                console.log("Todos los jugadores muertos");
                break;
            }

            if (dif) {
                // Verificar si el jugador está muerto
                if (activePlayers[random][3] === false) {
                    console.log('Está muerto el target: ' + activePlayers[random][1]);
                    history.push(random);
                    ind++;
                } else {
                    // Verificar si no es el mismo jugador
                    if (activePlayers[random] !== current) {
                        // Retornar duo
                        return activePlayers[random];
                    } else {
                        console.log('Es el mismo, cambiando...');
                        history.push(random);
                        ind++;
                    }
                }
            }
        }
    }

    function event(current) {
        if (current[3] === false) {
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
                    console.log(`murio ${current[0]}`)
                    return [current, 'death'];
                }
                else {
                    // Comun
                    if (random >= 20 && random <= 70) {
                        console.log(`comun ${current[0]}`)
                        return [current, 'comun']
                    }
                }
            }
            else { // Accion en grupo
                // Asesinato
                if (random > 90 && random <= 100) {
                    // a quien matamos
                    let killed = KillSomeone(current);
                    return [current, 'kill', killed]
                } else {
                    // Trato
                    if (random > 5 && random < 20) {
                        let duo = SelectDuo(current);
                        console.log(`Trato ${current[0]} with ${duo}`)
                        return [current, 'deal', duo]
                    }
                    else {
                        // Relacion
                        if (random >= 0 && random < 5) {
                            let duo = SelectDuo(current);
                            console.log(`Relacion ${current[0]} with ${duo}`)
                            return [current, 'relation', duo]
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {
        start();
    },[])

    const start = () => {
        let tempEventReg = [];
        for (let i = 0; i < activePlayers.length; i++) {
            let current = activePlayers[i];
            if (current != null) {
                let ok = event(current);
                if (ok !== false) {
                    tempEventReg.push(ok);
                }
            }
        }
        setEvents(tempEventReg); 
    }

    return (
        <div>
            <h1>hola</h1>
            {eventsReg.map((current, index) => (
                <div key={index}>
                    <img style={{ width: 200 }} src={current[0]} alt={current[1]} />
                    <h2>{`${current[1]} mensaje`}</h2>
                </div>
            ))}
            {/* {start()} */}
            {/* <button onClick={() => {
                start()
            }}>Test</button> */}
        </div>
    );
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