import PropTypes, { func } from 'prop-types';
import '../../css/comunEvents.css'

export function ComunEvent({ eventsList, time, round, setEv, setIndex }) {
    return (
        <div className="e-comun">
            <header className='e-comun-header'>
                <h1>{time ? `Dia ${round}` : `Noche ${round}`}</h1>
                <img src={time? 'icon/sun.png':'icon/moon.png'}/>
            </header>
            {eventsList.map((current, index) => {
                let messange = `${current[0][1]} ${current[2]}`;
                return (
                    <div key={index} className={`e-comun-item e${index}`}>
                        <img style={{ height: 200 }} src={current[0][0]} />
                        <div className="line"></div>
                        <p>{messange}</p>
                    </div>
                );
            })}
            <button className="button-style" onClick={() => {
                setEv(true);
                setIndex(0);
            }}>Continuar</button>
        </div>
    )
}

export function NotComunEvents({ time, setEv, setIndex }) {
    return (
        <div className='not-comun-events'>
            <h1>{`Parece ${time ? 'un dia movido' : 'una noche movida'}`}</h1>
            <button className='button-style' onClick={() => {
                setEv(true),
                    setIndex(0)
            }}>Continuar</button>
        </div>
    )
}

ComunEvent.propTypes = {
    eventsList: PropTypes.array.isRequired,
    time: PropTypes.bool.isRequired,
    round: PropTypes.number.isRequired,
    setEv: PropTypes.func.isRequired,
    setIndex: PropTypes.func.isRequired,
};
