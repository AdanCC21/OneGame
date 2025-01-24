import { useEffect, useState } from "react";

export function SEOnePlayer({ event, index, icon, messange, setIndex }) {
    const [showIcon, setShowIcon] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);

    useEffect(() => {
        if (showIcon) {
            setTimeout(() => {
                setShowIcon(false);
            }, 1200);
        } else {
            setTimeout(() => {
                setShowPlayer(true);
            }, 1);
        }
    }, [index, showIcon]);

    return (
        <div className="container-gen">
            <div className={showIcon ? 'up-show-hide-short special-icon' : 'not-display'}>
                <img src={icon} />
            </div>
            <div className={showPlayer ? 'event show-item' : 'not-display'}>
                <section>
                    <img src={icon} />
                    <img src={event[0][0]} alt={event[0][1]} />
                    <div className="line-event"></div>
                    <p>{messange}</p>
                </section>
                <button
                    className="bottom-button button-style"
                    onClick={() => {
                        setIndex(index + 1);
                        setShowPlayer(false); // Oculta el player para el siguiente paso
                    }}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export function SEMurder({ event, eventIndex, icon, messange, setIndex }) {
    const [showIcon, setShowIcon] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);

    useEffect(() => {
        if (showIcon) {
            setTimeout(() => {
                setShowIcon(false);
            }, 1200);
        } else {
            setTimeout(() => {
                setShowPlayer(true);
            }, 1);
        }
    }, [eventIndex, showIcon]);

    let player = event[0];
    let target = [[]];
    target = event[3];
    if (player[5] === null || player[5][4] === false || player[5][1] === target[0][1]) {
        return (
            <div className="container-gen hide-overflow-y">
                <div className={showIcon ? 'up-show-hide-short special-icon' : 'not-display'}>
                    <img src={icon} />
                </div>

                <section className={showPlayer ? 'show-item event-row' : 'not-display'}>
                    <article className="event-row-player">
                        <img src={player[0]} alt={player[1]} />
                        <h3>{player[1]}</h3>
                        <div className="line-event"></div>
                    </article>

                    <article className="flex-colum center">
                        <img src={icon} className="icon" />
                        <p>{messange}</p>
                    </article>

                    <article className="event-row-player">
                        {target.length > 1 ?
                            target.map((actual) => {
                                return (
                                    <div key={actual[1]}>
                                        <img src={actual[0]} alt={actual[1]} />
                                        <h3>{actual[1]}</h3>
                                    </div>
                                )
                            })
                            : <div>
                                <img src={target[0][0]} alt={target[0][1]} />
                                <h3>{target[0][1]}</h3>
                                <div className="line-event"></div>
                            </div>
                        }

                    </article>
                    <button className="bottom-button button-style" onClick={() => {
                        setIndex(eventIndex + 1)
                        setShowPlayer(false)
                    }} >Siguiente</button>
                </section>
            </div>
        )
    } else {
        return (
            <div className="container-gen hide-overflow-y">
                <div className={showIcon ? 'up-show-hide-short special-icon' : 'not-display'}>
                    <img src={icon} />
                </div>

                <section className={showPlayer ? 'show-item event-row' : 'not-display'}>
                    <article className="event-row-player">
                        <div>
                            <img src={player[0]} alt={player[1]} />
                            <h3>{player[1]}</h3>
                        </div>
                        <div>
                            <img src={player[5][0]} alt={player[5][1]} />
                            <h3>{player[5][1]}</h3>
                        </div>
                    </article>

                    <article className="flex-colum center">
                        <img src={icon} className="icon" />
                        <p>{`${player[5][1]} y ${messange}`}</p>
                    </article>

                    <article className="event-row-player">
                        {target.length > 1 ?
                            target.map((actual) => {
                                return (
                                    <div key={actual[1]}>
                                        <img src={actual[0]} alt={actual[1]} />
                                        <h3>{actual[1]}</h3>
                                    </div>
                                )
                            })
                            : <div>
                                <img src={target[0][0]} alt={target[0][1]} />
                                <h3>{target[0][1]}</h3>
                                <div className="line-event"></div>
                            </div>
                        }

                    </article>
                    <button className="bottom-button button-style" onClick={() => {
                        setIndex(eventIndex + 1)
                        setShowPlayer(false)
                    }} >Siguiente</button>
                </section>
            </div>
        )
    }
}

export function SpecialEvent({ event, eventIndex, setIndex, messange, icon }) {
    const [showIcon, setShowIcon] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);
    // },[eventIndex])

    useEffect(() => {
        if (showIcon) {
            setTimeout(() => {
                setShowIcon(false);
            }, 1200);
        } else {
            setTimeout(() => {
                setShowPlayer(true);
            }, 1);
        }
    }, [eventIndex, showIcon]);


    let player = event[0];
    let target = event[3];
    return (
        <div className="container-gen hide-overflow-y">
            <div className={showIcon ? 'up-show-hide-short special-icon' : 'not-display'}>
                <img src={icon} />
            </div>
            <section className={showPlayer ? 'event-row show-item' : 'not-display'}>
                <article className="event-row-player">
                    <img src={player[0]} />
                    <h3>{player[1]}</h3>
                    <div className="line-event"></div>
                </article>
                <article className="flex-colum center">
                    <img src={icon} className="icon" />
                    <p>{messange}</p>
                </article>
                <article className="event-row-player">
                    <div>
                        <img src={target[0]} />
                        <h3>{target[1]}</h3>
                        <div className="line-event"></div>
                    </div>
                </article>
                <button className="bottom-button button-style" onClick={() => {
                    setIndex(eventIndex + 1)
                    setShowPlayer(false);
                }} >Siguiente</button>
            </section>
        </div>
    )
}

export function AllDeaths({ players, resetGame, time }) {

    return (
        <div className="deaths-father">
            <h1 style={{ margin: 0, marginTop: 20 }} >{`Fin de ${time ? 'el dia' : 'la noche'}`}</h1>
            <h3 style={{ fontWeight: 500 }}>Todos murieron antes de llegar al final</h3>
            <h3 style={{ fontWeight: 300, marginBottom: 50 }}>muertos</h3>
            <article className="deaths-list show-item-delay">
                {players.map((current) => {
                    if (!current[4]) {
                        return (
                            <div key={current[1]} className="deaths-list-item">
                                <img src={current[0]} />
                                <p>{current[1]}</p>
                                <div className="line-event"></div>
                            </div>
                        )
                    }
                })}
            </article>
            <button onClick={() => { resetGame() }} className="button-style">Terminar juego</button>
        </div>
    )
}

export function Winner({ winner, resetGame }) {
    const [showIcon, setShowIcon] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);
    // },[eventIndex])

    useEffect(() => {
        if (showIcon) {
            setTimeout(() => {
                setShowIcon(false);
            }, 1200);
        } else {
            setTimeout(() => {
                setShowPlayer(true);
            }, 1);
        }
    }, [showIcon]);

    return (
        <div className="container-gen hide-overflow-y">
            <div className={showIcon ? 'up-show-hide-short special-icon' : 'not-display'}>
                <img className="winner-crown" src="icon/crown.png" />
            </div>
            <section className={showPlayer ? 'flex-colum full-screen center show-item' : 'not-display'}>
                <img className="winner-crown" src="icon/crown.png" />
                <img className="winner-image" src={winner[0][0]} alt={winner[0][1]} />
                <div className="line-event winner"></div>
                <h1>{`${winner[0][1]}`}</h1>
                <p>Es el ganador</p>
                <button onClick={() => { 
                    resetGame(); 
                    setShowIcon(true);
                    setShowPlayer(false);
                    }} className="bottom-button button-style">Terminar juego</button>
            </section>

        </div>
    )
}

export function Deaths({ roundDeaths, setIndex, setEv, setTime, time }) {
    return (
        <div className="deaths-father">
            {/* <h1>{`Fin de ${time ? 'el dia' : 'la noche'}`}</h1> */}
            <section className="deaths-title show-item">
                <h1>Jugadores Eliminados</h1>
                <img src="icon/death.png" />
            </section>
            <article className="deaths-list show-item-delay" >

                {roundDeaths && roundDeaths.length >= 1 ? (
                    roundDeaths
                        .filter((current) => !current[4])
                        .map((current) => (
                            <div className="deaths-list-item" key={current[1]}>
                                <img src={current[0]} alt={`Imagen de ${current[1]}`} />
                                <p>{current[1]}</p>
                                <div className="line-event"></div>
                            </div>
                        ))
                ) : (
                    <>
                        <h1>Ningún jugador murió esta vez</h1>
                    </>
                )}
            </article>

            <button className="button-style" onClick={() => {
                setIndex(0);
                setEv(false);
                setTime(!time);
            }} >Continuar</button>
        </div>
    )
}