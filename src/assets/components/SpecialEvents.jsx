export function SEOnePlayer({ event, index, icon, messange, setIndex }) {
    return (
        <div className="event">
            <section>
                <img src={icon} />
                <img src={event[0][0]} alt={event[0][1]} />
                <div className="line-event"></div>
                <p>{messange}</p>
            </section>
            <button className="bottom-button button-style" onClick={() => {
                setIndex(index + 1)
            }} >Siguiente</button>
        </div>
    )
}

export function SEMurder({ event, eventIndex, icon, messange, setIndex }) {
    let player = event[0];
    let target = [[]];
    target = event[3];
    if (player[5] === null || player[5][4] === false || player[5][1] === target[0][1]) {
        return (
            <div className="cont">
                <section className="event-row">
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
                </section>
                <button className="bottom-button button-style" onClick={() => {
                    setIndex(eventIndex + 1)
                }} >Siguiente</button>
            </div>
        )
    }
}

export function SpecialEvent({ event, eventIndex, setIndex, messange, icon }) {
    let player = event[0];
    let target = event[3];
    return (
        <div className="cont">
            <section className="event-row">
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
            </section>
            <button className="bottom-button button-style" onClick={() => {
                setIndex(eventIndex + 1)
            }} >Siguiente</button>
        </div>
    )
}

export function AllDeaths({ players, resetGame, time }) {
    return (
        <div className="e-comun">
            <h1>{`Fin de ${time ? 'el dia' : 'la noche'}`}</h1>
            <h1>Todos murieron antes de llegar al final</h1>
            <h2>muertos</h2>
            {players.map((current) => {
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
}

export function Winner({ winner, resetGame }) {
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
}

export function Deaths({ roundDeaths, setIndex, setEv, setTime, time }) {
    return (
        <div className="deaths-father">
            {/* <h1>{`Fin de ${time ? 'el dia' : 'la noche'}`}</h1> */}
            <section className="deaths-title">
                <h1>Jugadores Eliminados</h1>
                <img src="icon/death.png" />
            </section>
            <article className="deaths-list">

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