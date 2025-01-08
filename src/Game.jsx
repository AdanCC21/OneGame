import { act, useState } from "react";

export function Game({ players }) {
    // Vivos [[url,name,level,true]] level=probabilidad de matar 1...4, true = vivo o muerto
    let [activePlayers, setActive] = useState(players.map((current) => { return [...current] }));
    // relaciones, [[j1,j2,type]], type : 1 = relacion, 0 = trato;
    let [relation, setRelation] = useState([]);

    // impar dia, par = noche
    let [round, setRound] = useState(2);

    function event(current) {
        if (current[3] === false) {
            console.log('jugador muerto')
        }
        else {
            let random = Math.floor(Math.random() * 100);
            console.log('---- Random ' + random)

            // Accion individual
            if (random >= 80 && random <= 90) {
                // Muerte
                if (random >= 70 && random <= 90) {
                    setActive(activePlayers.map((actual) => {
                        if (actual === current) {
                            actual[3] = false;
                        }
                        return actual;
                    }))
                    console.log(`murio ${current}`)

                }
                else {
                    // Comun
                    if (random >= 20 && random <= 70) {
                        console.log(`comun ${current}`)
                    }
                }
            }
            else { // Accion en grupo
                // Asesinato
                if (random > 20 && random <= 99) {
                    let band = true;
                    let ind = 0;
                    while (band === true && ind <= activePlayers.length) {
                        random = Math.floor(Math.random() * activePlayers.length)
                        
                        if (activePlayers[random][3] === false) {
                            console.log('esta muerto el' + activePlayers[random])
                            ind++;
                        } else {
                            if (activePlayers[random] != current) {
                                console.log('esta vivo, listo para asesinar' + activePlayers[random])
                                setActive(activePlayers.map((actual, index) => {
                                    if (index === random) {
                                        actual[3] = false;
                                    }
                                    return actual
                                }))
                                console.log(activePlayers)
                                band = false;
                            } else {
                                console.log('es el mismo cambiando')
                                ind++;
                            }
                        }
                    }
                } else {
                    // Trato
                    if (random > 5 && random < 20) {
                        console.log(`Trato ${current}`)


                    }
                    else {
                        // Relacion
                        if (random >= 0 && random < 5) {
                            console.log(`Relacion ${current}`)


                        }
                    }
                }
            }
        }
    }


    const start = () => {

        if (round % 2 == 0) {// Dia
            for (let i = 0; i <= players.length - 1; i++) {
                console.log(i)
                let current = activePlayers[i];
                if (current != null || current != undefined) {
                    event(current)
                }
            }

        }
    }


    return (
        <div>
            <h1>hola</h1>
            <button onClick={() => {
                start()
            }}>Test</button>
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