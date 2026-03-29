import { useState, useEffect } from 'react';
import NODOS from '../config';
import { getNodoApi } from '../api';

export default function NodosPanel() {
    const [red, setRed] = useState<Record<string, any>>({});
    const [form, setForm] = useState({ url: '', nombre: '' });
    const [destino, setDestino] = useState(NODOS[0].id);
    const [resultado, setRes] = useState<{ ok: boolean; msg?: string } | null>(null);

    const cargar = async () => {
        const res: Record<string, any> = {};
        for (const nodo of NODOS) {
            try {
                res[nodo.id] = await getNodoApi(nodo.url).getNodos();
            } catch {
                res[nodo.id] = { nodos: [], error: true };
            }
        }
        setRed(res);
    };

    useEffect(() => { cargar(); }, []);

    const registrar = async () => {
        const nodo = NODOS.find(n => n.id === destino)!;
        try {
            await getNodoApi(nodo.url).registrarNodo(form.url, form.nombre);
            setRes({ ok: true });
            setForm({ url: '', nombre: '' });
            cargar();
        } catch (e: any) {
            setRes({ ok: false, msg: e.message });
        }
    };

    return (
        <div>
            <div className="panel-header">
                <h2>Nodos de la red</h2>
                <button className="btn-secondary" onClick={cargar}>Actualizar</button>
            </div>

            <div className="nodos-grid">
                {NODOS.map(nodo => {
                    const data = red[nodo.id];
                    return (
                        <div key={nodo.id} className="nodo-card"
                            style={{ '--color': nodo.color } as React.CSSProperties}>
                            <div className="nodo-card-top">
                                <span className="nodo-card-dot" style={{ background: nodo.color }}></span>
                                <h3>{nodo.nombre}</h3>
                            </div>
                            <code className="nodo-url">{nodo.url}</code>
                            {data?.error && <p className="err-txt">Sin conexión</p>}
                            <p className="nodos-count">{data?.nodos?.length ?? 0} nodos conocidos</p>
                            {data?.nodos?.map((n: any) => (
                                <div key={n.id} className="nodo-item">
                                    <span>{n.nombre || 'Sin nombre'}</span>
                                    <code>{n.url}</code>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            <div className="form-card">
                <h3>Registrar nodo</h3>
                <div className="selector-nodo">
                    <label>Registrar en</label>
                    <div className="opciones-nodo">
                        {NODOS.map(n => (
                            <button
                                key={n.id}
                                className={`opt-nodo ${destino === n.id ? 'activo' : ''}`}
                                style={{ '--color': n.color } as React.CSSProperties}
                                onClick={() => setDestino(n.id)}
                            >
                                {n.nombre}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="form-fila">
                    <div className="campo">
                        <label>URL del nodo</label>
                        <input
                            type="text"
                            value={form.url}
                            placeholder="http://100.x.x.x:8002"
                            onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                        />
                    </div>
                    <div className="campo">
                        <label>Nombre</label>
                        <input
                            type="text"
                            value={form.nombre}
                            placeholder="Nodo Express"
                            onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                        />
                    </div>
                </div>
                <button className="btn-primary" onClick={registrar}>Registrar</button>
                {resultado && (
                    <div className={`resultado ${resultado.ok ? 'ok' : 'err'}`}>
                        {resultado.ok ? 'Nodo registrado' : resultado.msg}
                    </div>
                )}
            </div>
        </div>
    );
}