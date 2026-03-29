import { useState, useEffect } from 'react';
import NODOS from '../config';
import { getNodoApi } from '../api';

const FORM_INICIAL = {
    persona_id: '', institucion_id: '', programa_id: '',
    titulo_obtenido: '', fecha_fin: '', fecha_inicio: '',
    numero_cedula: '', menciones: '',
};

interface FormNuevo {
    // Persona
    nombre?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    curp?: string;
    correo?: string;
    // Institución
    inst_nombre?: string;
    inst_pais?: string;
    inst_estado?: string;
    // Programa
    prog_nombre?: string;
    nivel_grado_id?: string;
}

export default function TransaccionPanel() {
    const [nodoId, setNodoId]           = useState(NODOS[0].id);
    const [form, setForm]               = useState(FORM_INICIAL);
    const [personas, setPersonas]       = useState<any[]>([]);
    const [instituciones, setInst]      = useState<any[]>([]);
    const [programas, setProg]          = useState<any[]>([]);
    const [niveles, setNiveles]         = useState<any[]>([]);
    const [resultado, setResultado]     = useState<{ ok: boolean; msg?: string } | null>(null);
    const [loading, setLoading]         = useState(false);
    const [nuevo, setNuevo]             = useState<'persona' | 'inst' | 'prog' | null>(null);
    const [formNuevo, setFormNuevo]     = useState<FormNuevo>({});
    const [creando, setCreando]         = useState(false);
    const [mensajeNuevo, setMensajeNuevo] = useState<{ ok: boolean; msg: string } | null>(null);

    const nodo = NODOS.find(n => n.id === nodoId)!;

    const cargarCatalogos = () => {
        const api = getNodoApi(nodo.url);
        Promise.all([
            api.getPersonas().catch(() => []),
            api.getInstituciones().catch(() => []),
            api.getProgramas().catch(() => []),
            fetch(`${nodo.url}/api/niveles-grado`).then(r => r.json()).catch(() => []),
        ]).then(([p, i, g, n]) => {
            setPersonas(p);
            setInst(i);
            setProg(g);
            setNiveles(n);
        });
    };

    useEffect(() => {
        cargarCatalogos();
        setForm(FORM_INICIAL);
        setResultado(null);
        setNuevo(null);
    }, [nodoId]);

    const set = (k: string, v: string) =>
        setForm(prev => ({ ...prev, [k]: v }));

    const setN = (k: string, v: string) =>
        setFormNuevo(prev => ({ ...prev, [k]: v }));

    const crearPersona = async () => {
        setCreando(true);
        try {
            const res = await fetch(`${nodo.url}/api/personas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    nombre:           formNuevo.nombre,
                    apellido_paterno: formNuevo.apellido_paterno,
                    apellido_materno: formNuevo.apellido_materno,
                    curp:             formNuevo.curp,
                    correo:           formNuevo.correo,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al crear');
            setMensajeNuevo({ ok: true, msg: `${data.nombre} ${data.apellido_paterno} creado` });
            setForm(prev => ({ ...prev, persona_id: data.id }));
            setNuevo(null);
            setFormNuevo({});
            cargarCatalogos();
        } catch (e: any) {
            setMensajeNuevo({ ok: false, msg: e.message });
        }
        setCreando(false);
    };

    const crearInstitucion = async () => {
        setCreando(true);
        try {
            const res = await fetch(`${nodo.url}/api/instituciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    nombre: formNuevo.inst_nombre,
                    pais:   formNuevo.inst_pais,
                    estado: formNuevo.inst_estado,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al crear');
            setMensajeNuevo({ ok: true, msg: `${data.nombre} creada` });
            setForm(prev => ({ ...prev, institucion_id: data.id }));
            setNuevo(null);
            setFormNuevo({});
            cargarCatalogos();
        } catch (e: any) {
            setMensajeNuevo({ ok: false, msg: e.message });
        }
        setCreando(false);
    };

    const crearPrograma = async () => {
        setCreando(true);
        try {
            const res = await fetch(`${nodo.url}/api/programas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    nombre:         formNuevo.prog_nombre,
                    nivel_grado_id: formNuevo.nivel_grado_id,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al crear');
            setMensajeNuevo({ ok: true, msg: `${data.nombre} creado` });
            setForm(prev => ({ ...prev, programa_id: data.id }));
            setNuevo(null);
            setFormNuevo({});
            cargarCatalogos();
        } catch (e: any) {
            setMensajeNuevo({ ok: false, msg: e.message });
        }
        setCreando(false);
    };

    const enviar = async () => {
        setLoading(true);
        setResultado(null);
        try {
            const api = getNodoApi(nodo.url);
            await api.crearTransaccion(form);
            setResultado({ ok: true });
            setForm(FORM_INICIAL);
        } catch (e: any) {
            setResultado({ ok: false, msg: e.response?.data?.message || e.message });
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Nueva transacción</h2>

            <div className="selector-nodo">
                <label>Enviar al nodo</label>
                <div className="opciones-nodo">
                    {NODOS.map(n => (
                        <button
                            key={n.id}
                            className={`opt-nodo ${nodoId === n.id ? 'activo' : ''}`}
                            style={{ '--color': n.color } as React.CSSProperties}
                            onClick={() => setNodoId(n.id)}
                        >
                            {n.nombre}
                        </button>
                    ))}
                </div>
            </div>

            {mensajeNuevo && (
                <div className={`resultado ${mensajeNuevo.ok ? 'ok' : 'err'}`}
                    style={{ marginBottom: '0.75rem' }}>
                    {mensajeNuevo.msg}
                </div>
            )}

            <div className="form-card">

                {/* Persona */}
                <div className="campo-con-boton">
                    <div className="campo">
                        <label>Persona</label>
                        <select value={form.persona_id} onChange={e => set('persona_id', e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {personas.map((p: any) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} {p.apellido_paterno}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className={`btn-nuevo ${nuevo === 'persona' ? 'activo' : ''}`}
                        onClick={() => { setNuevo(nuevo === 'persona' ? null : 'persona'); setMensajeNuevo(null); }}
                        title="Crear nueva persona"
                    >
                        {nuevo === 'persona' ? '✕' : '+'}
                    </button>
                </div>

                {nuevo === 'persona' && (
                    <div className="mini-form">
                        <div className="form-fila">
                            <div className="campo">
                                <label>Nombre</label>
                                <input type="text" placeholder="Juan"
                                    onChange={e => setN('nombre', e.target.value)}/>
                            </div>
                            <div className="campo">
                                <label>Apellido paterno</label>
                                <input type="text" placeholder="García"
                                    onChange={e => setN('apellido_paterno', e.target.value)}/>
                            </div>
                        </div>
                        <div className="form-fila">
                            <div className="campo">
                                <label>Apellido materno</label>
                                <input type="text" placeholder="López"
                                    onChange={e => setN('apellido_materno', e.target.value)}/>
                            </div>
                            <div className="campo">
                                <label>CURP</label>
                                <input type="text" placeholder="GALJ990101HDFXXX01"
                                    onChange={e => setN('curp', e.target.value)}/>
                            </div>
                        </div>
                        <div className="campo" style={{ marginBottom: '0.75rem' }}>
                            <label>Correo</label>
                            <input type="email" placeholder="juan@correo.com"
                                onChange={e => setN('correo', e.target.value)}/>
                        </div>
                        <button className="btn-crear" onClick={crearPersona} disabled={creando}>
                            {creando ? 'Creando...' : 'Crear persona'}
                        </button>
                    </div>
                )}

                {/* Institución */}
                <div className="campo-con-boton" style={{ marginTop: '0.75rem' }}>
                    <div className="campo">
                        <label>Institución</label>
                        <select value={form.institucion_id} onChange={e => set('institucion_id', e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {instituciones.map((i: any) => (
                                <option key={i.id} value={i.id}>{i.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className={`btn-nuevo ${nuevo === 'inst' ? 'activo' : ''}`}
                        onClick={() => { setNuevo(nuevo === 'inst' ? null : 'inst'); setMensajeNuevo(null); }}
                        title="Crear nueva institución"
                    >
                        {nuevo === 'inst' ? '✕' : '+'}
                    </button>
                </div>

                {nuevo === 'inst' && (
                    <div className="mini-form">
                        <div className="campo" style={{ marginBottom: '0.75rem' }}>
                            <label>Nombre</label>
                            <input type="text" placeholder="Universidad de Guadalajara"
                                onChange={e => setN('inst_nombre', e.target.value)}/>
                        </div>
                        <div className="form-fila">
                            <div className="campo">
                                <label>País</label>
                                <input type="text" placeholder="México"
                                    onChange={e => setN('inst_pais', e.target.value)}/>
                            </div>
                            <div className="campo">
                                <label>Estado</label>
                                <input type="text" placeholder="Jalisco"
                                    onChange={e => setN('inst_estado', e.target.value)}/>
                            </div>
                        </div>
                        <button className="btn-crear" onClick={crearInstitucion} disabled={creando}>
                            {creando ? 'Creando...' : 'Crear institución'}
                        </button>
                    </div>
                )}

                {/* Programa */}
                <div className="campo-con-boton" style={{ marginTop: '0.75rem' }}>
                    <div className="campo">
                        <label>Programa</label>
                        <select value={form.programa_id} onChange={e => set('programa_id', e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {programas.map((g: any) => (
                                <option key={g.id} value={g.id}>{g.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className={`btn-nuevo ${nuevo === 'prog' ? 'activo' : ''}`}
                        onClick={() => { setNuevo(nuevo === 'prog' ? null : 'prog'); setMensajeNuevo(null); }}
                        title="Crear nuevo programa"
                    >
                        {nuevo === 'prog' ? '✕' : '+'}
                    </button>
                </div>

                {nuevo === 'prog' && (
                    <div className="mini-form">
                        <div className="form-fila">
                            <div className="campo">
                                <label>Nombre del programa</label>
                                <input type="text" placeholder="Ingeniería en Sistemas"
                                    onChange={e => setN('prog_nombre', e.target.value)}/>
                            </div>
                            <div className="campo">
                                <label>Nivel</label>
                                <select onChange={e => setN('nivel_grado_id', e.target.value)}>
                                    <option value="">Seleccionar...</option>
                                    {niveles.map((n: any) => (
                                        <option key={n.id} value={n.id}>{n.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button className="btn-crear" onClick={crearPrograma} disabled={creando}>
                            {creando ? 'Creando...' : 'Crear programa'}
                        </button>
                    </div>
                )}

                {/* Resto del formulario */}
                <div className="form-fila" style={{ marginTop: '0.75rem' }}>
                    <div className="campo">
                        <label>Título obtenido</label>
                        <input
                            type="text"
                            value={form.titulo_obtenido}
                            placeholder="Ej: Ingeniero en Sistemas"
                            onChange={e => set('titulo_obtenido', e.target.value)}
                        />
                    </div>
                    <div className="campo">
                        <label>Número de cédula</label>
                        <input type="text" value={form.numero_cedula}
                            onChange={e => set('numero_cedula', e.target.value)}/>
                    </div>
                </div>

                <div className="form-fila">
                    <div className="campo">
                        <label>Fecha inicio</label>
                        <input type="date" value={form.fecha_inicio}
                            onChange={e => set('fecha_inicio', e.target.value)}/>
                    </div>
                    <div className="campo">
                        <label>Fecha fin</label>
                        <input type="date" value={form.fecha_fin}
                            onChange={e => set('fecha_fin', e.target.value)}/>
                    </div>
                </div>

                <div className="campo" style={{ marginBottom: '1rem' }}>
                    <label>Menciones</label>
                    <input type="text" value={form.menciones}
                        onChange={e => set('menciones', e.target.value)}/>
                </div>

                <button className="btn-primary" onClick={enviar} disabled={loading}>
                    {loading ? 'Enviando...' : 'Crear transacción'}
                </button>

                {resultado && (
                    <div className={`resultado ${resultado.ok ? 'ok' : 'err'}`}>
                        {resultado.ok ? 'Transacción creada y propagada' : `Error: ${resultado.msg}`}
                    </div>
                )}
            </div>
        </div>
    );
}