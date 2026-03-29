import { useState } from 'react';
import NODOS from '../config';
import { getNodoApi } from '../api';

interface EstadoNodo {
    minando?: boolean;
    minado?: { ok: boolean; data?: any; msg?: string } | null;
    resolviendo?: boolean;
    resuelto?: any;
}

export default function MinadoPanel() {
    const [estado, setEstado] = useState<Record<string, EstadoNodo>>({});

    const set = (id: string, datos: Partial<EstadoNodo>) =>
        setEstado(prev => ({ ...prev, [id]: { ...prev[id], ...datos } }));

    const minar = async (nodo: typeof NODOS[0]) => {
        set(nodo.id, { minando: true, minado: null });
        try {
            const data = await getNodoApi(nodo.url).mine();
            set(nodo.id, { minando: false, minado: { ok: true, data } });
        } catch (e: any) {
            set(nodo.id, { minando: false, minado: { ok: false, msg: e.message } });
        }
    };

    const resolver = async (nodo: typeof NODOS[0]) => {
        set(nodo.id, { resolviendo: true, resuelto: null });
        try {
            const data = await getNodoApi(nodo.url).resolve();
            set(nodo.id, { resolviendo: false, resuelto: data });
        } catch (e: any) {
            set(nodo.id, { resolviendo: false, resuelto: { mensaje: e.message } });
        }
    };

    return (
        <div>
            <h2>Minado distribuido</h2>
            <p className="subtitulo">Mina transacciones pendientes o resuelve conflictos de consenso.</p>

            <div className="minado-grid">
                {NODOS.map(nodo => {
                    const s = estado[nodo.id] || {};
                    return (
                        <div key={nodo.id} className="minado-card"
                            style={{ '--color': nodo.color } as React.CSSProperties}>
                            <div className="minado-card-header">
                                <span className="minado-dot" style={{ background: nodo.color }}></span>
                                <h3>{nodo.nombre}</h3>
                            </div>

                            <button className="btn-minar" onClick={() => minar(nodo)} disabled={s.minando}>
                                {s.minando ? (
                                    <span className="minando-anim">
                                        Minando<span>.</span><span>.</span><span>.</span>
                                    </span>
                                ) : 'Minar bloques'}
                            </button>

                            {s.minado && (
                                <div className={`resultado ${s.minado.ok ? 'ok' : 'err'}`}>
                                    {s.minado.ok
                                        ? `${s.minado.data?.bloques?.length ?? 0} bloque(s) minados`
                                        : s.minado.msg
                                    }
                                </div>
                            )}

                            <div className="divisor" />

                            <button className="btn-resolver" onClick={() => resolver(nodo)} disabled={s.resolviendo}>
                                {s.resolviendo ? 'Resolviendo...' : 'Resolver consenso'}
                            </button>

                            {s.resuelto && (
                                <div className={`resultado ${s.resuelto.reemplazada ? 'warn' : 'ok'}`}>
                                    {s.resuelto.mensaje}
                                    {s.resuelto.longitud && ` (${s.resuelto.longitud} bloques)`}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}