import { useState, useEffect } from 'react';
import NODOS from '../config';
import { getNodoApi } from '../api';

interface Bloque {
    id: string;
    titulo_obtenido: string;
    hash_actual: string;
    hash_anterior: string;
    nonce: number;
    fecha_fin: string;
    numero_cedula: string;
    firmado_por: string;
}

interface CadenaNodo {
    chain: Bloque[];
    longitud: number;
    error?: boolean;
}

export default function CadenaPanel() {
    const [cadenas, setCadenas] = useState<Record<string, CadenaNodo>>({});
    const [loading, setLoading] = useState(true);

    const cargar = async () => {
        setLoading(true);
        const res: Record<string, CadenaNodo> = {};
        for (const nodo of NODOS) {
            try {
                res[nodo.id] = await getNodoApi(nodo.url).getChain();
            } catch {
                res[nodo.id] = { chain: [], longitud: 0, error: true };
            }
        }
        setCadenas(res);
        setLoading(false);
    };

    useEffect(() => { cargar(); }, []);

    return (
        <div>
            <div className="panel-header">
                <h2>Cadena de bloques</h2>
                <button className="btn-secondary" onClick={cargar}>Actualizar</button>
            </div>

            {loading && <p className="loading">Consultando nodos...</p>}

            {NODOS.map(nodo => {
                const data = cadenas[nodo.id];
                return (
                    <div key={nodo.id} className="nodo-seccion">
                        <div className="nodo-seccion-header" style={{ borderLeftColor: nodo.color }}>
                            <h3>{nodo.nombre}</h3>
                            {data && !data.error && (
                                <span className="badge">
                                    {data.longitud ?? data.chain?.length ?? (data as any).length ?? 0} bloques
                                </span>
                            )}
                            {data?.error && <span className="badge error">Sin conexión</span>}
                        </div>

                        {data?.chain?.map((bloque, i) => (
                            <div key={bloque.id} className="bloque">
                                <div className="bloque-header">
                                    <span className="bloque-num" style={{ color: nodo.color }}>
                                        Bloque #{i + 1}
                                    </span>
                                    {bloque.hash_anterior === '0' && (
                                        <span className="bloque-genesis">⬡ Génesis</span>
                                    )}
                                    <span className="bloque-firmado">{bloque.firmado_por}</span>
                                </div>
                                <div className="bloque-body">
                                    <div className="hash-fila">
                                        <label>Hash actual</label>
                                        <code className="hash verde">{bloque.hash_actual}</code>
                                    </div>
                                    <div className="hash-fila">
                                        <label>Hash anterior</label>
                                        <code className="hash gris">{bloque.hash_anterior}</code>
                                    </div>
                                    <div className="bloque-meta">
                                        <span><b>Título:</b> {bloque.titulo_obtenido}</span>
                                        <span><b>Nonce:</b> {bloque.nonce}</span>
                                        <span><b>Fecha:</b> {bloque.fecha_fin}</span>
                                        <span><b>Cédula:</b> {bloque.numero_cedula || '—'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {data && !data.error && data.chain?.length === 0 && (
                            <p className="vacio">Sin bloques aún</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}