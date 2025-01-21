import PropTypes from 'prop-types';

export function ComunEvent({ eventsList, time, round, setEv, setIndex }) {
    return (
        <div className="e-comun">
            <h1>{time ? `Dia ${round}` : `Noche ${round}`}</h1>
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

ComunEvent.propTypes = {
    eventsList: PropTypes.array.isRequired,
    time: PropTypes.bool.isRequired,
    round: PropTypes.number.isRequired,
    setEv: PropTypes.func.isRequired,
    setIndex: PropTypes.func.isRequired,
};
