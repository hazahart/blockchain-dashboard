import NODOS from '../config';

interface Props {
    tab: string;
    setTab: (tab: string) => void;
}

const TABS = [
    { id: 'cadena', label: 'Cadena' },
    { id: 'transaccion', label: 'Transacción' },
    { id: 'minado', label: 'Minado' },
    { id: 'nodos', label: 'Nodos' },
];

export default function Header({ tab, setTab }: Props) {
    return (
        <header className="header">
            <div className="header-top">
                <div className="header-title">
                    <div className="header-logo">⬡</div>
                    <div>
                        <h1>Red Blockchain</h1>
                        <span className="header-sub">Grados Académicos Distribuidos</span>
                    </div>
                </div>
                <div className="nodos-status">
                    {NODOS.map(n => (
                        <div key={n.id} className="nodo-badge" style={{ borderColor: n.color + '66' }}>
                            <span className="dot" style={{ background: n.color }}></span>
                            {n.nombre}
                        </div>
                    ))}
                </div>
            </div>
            <nav className="tabs">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        className={`tab ${tab === t.id ? 'active' : ''}`}
                        onClick={() => setTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </nav>
        </header>
    );
}