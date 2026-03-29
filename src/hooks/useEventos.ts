import { useState, useEffect, useRef } from 'react';
import NODOS from '../config';

export interface Evento {
    id: number;
    tipo: string;
    mensaje: string;
    datos: Record<string, string>;
    nodo: string;
    timestamp: string;
    nodoId: string;
    color: string;
    nombre: string;
}

export default function useEventos() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [conectado, setConectado] = useState<Record<string, boolean>>({});
    const sourcesRef = useRef<Record<string, EventSource>>({});

    useEffect(() => {
        NODOS.forEach(nodo => {
            const conectar = () => {
                const source = new EventSource(`${nodo.url}/api/eventos`);
                sourcesRef.current[nodo.id] = source;

                source.onopen = () =>
                    setConectado(prev => ({ ...prev, [nodo.id]: true }));

                source.addEventListener('actividad', (e: MessageEvent) => {
                    try {
                        const evento = JSON.parse(e.data);
                        setEventos(prev => [{
                            ...evento,
                            id: Date.now() + Math.random(),
                            nodoId: nodo.id,
                            color: nodo.color,
                            nombre: nodo.nombre,
                        }, ...prev].slice(0, 150));
                    } catch { }
                });

                source.onerror = () => {
                    setConectado(prev => ({ ...prev, [nodo.id]: false }));
                    source.close();
                    setTimeout(conectar, 5000);
                };
            };

            conectar();
        });

        return () => {
            Object.values(sourcesRef.current).forEach(s => s.close());
        };
    }, []);

    const limpiar = () => setEventos([]);

    return { eventos, conectado, limpiar };
}