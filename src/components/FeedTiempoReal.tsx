import useEventos from '../hooks/useEventos';
import NODOS from '../config';

const META: Record<string, { icono: string; color: string; label: string }> = {
    transaccion: { icono: '◆', color: '#7F77DD', label: 'Transacción' },
    minando: { icono: '⬡', color: '#EF9F27', label: 'Minando' },
    bloque_minado: { icono: '■', color: '#1D9E75', label: 'Minado' },
    bloque_recibido: { icono: '●', color: '#378ADD', label: 'Recibido' },
    propagacion: { icono: '→', color: '#5DCAA5', label: 'Propagado' },
    consenso: { icono: '◈', color: '#EF9F27', label: 'Consenso' },
    advertencia: { icono: '▲', color: '#BA7517', label: 'Advertencia' },
    error: { icono: '✕', color: '#E24B4A', label: 'Error' },
};

export default function FeedTiempoReal() {
    const { eventos, conectado, limpiar } = useEventos();

    return (
        <div className="feed">
            <div className="feed-header">
                <div className="feed-titulo">
                    <span className="pulso"></span>
                    En vivo
                </div>
                <div className="feed-estados">
                    {NODOS.map(n => (
                        <span key={n.id} className="feed-estado">
                            <span
                                className="feed-dot"
                                style={{ background: conectado[n.id] ? n.color : '#475569' }}
                            ></span>
                            {n.nombre}
                        </span>
                    ))}
                </div>
                <button className="btn-limpiar" onClick={limpiar}>Limpiar</button>
            </div>

            <div className="feed-lista">
                {eventos.length === 0 && (
                    <div className="feed-vacio">Esperando actividad...</div>
                )}
                {eventos.map(ev => {
                    const meta = META[ev.tipo];
                    if (!meta) return null;
                    return (
                        <div key={ev.id} className="feed-item">
                            <span className="feed-icono" style={{ color: meta.color }}>
                                {meta.icono}
                            </span>
                            <div className="feed-contenido">
                                <div className="feed-fila">
                                    <span className="feed-nodo" style={{ color: ev.color }}>
                                        {ev.nombre}
                                    </span>
                                    <span className="feed-tipo" style={{ color: meta.color }}>
                                        {meta.label}
                                    </span>
                                    <span className="feed-hora">
                                        {new Date(ev.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="feed-msg">{ev.mensaje}</div>
                                {ev.datos && Object.keys(ev.datos).length > 0 && (
                                    <div className="feed-datos">
                                        {Object.entries(ev.datos).map(([k, v]) => (
                                            <span key={k} className="feed-dato">
                                                <b>{k}:</b> {String(v).slice(0, 35)}{String(v).length > 35 ? '…' : ''}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}