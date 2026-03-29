import { useState } from 'react';
import Header from './components/Header';
import CadenaPanel from './components/CadenaPanel';
import TransaccionPanel from './components/TransaccionPanel';
import MinadoPanel from './components/MinadoPanel';
import NodosPanel from './components/NodosPanel';
import FeedTiempoReal from './components/FeedTiempoReal';
import './index.css';

export default function App() {
  const [tab, setTab] = useState('cadena');

  return (
    <div className="app">
      <Header tab={tab} setTab={setTab} />
      <div className="layout">
        <main className="main">
          {tab === 'cadena' && <CadenaPanel />}
          {tab === 'transaccion' && <TransaccionPanel />}
          {tab === 'minado' && <MinadoPanel />}
          {tab === 'nodos' && <NodosPanel />}
        </main>
        <aside className="sidebar">
          <FeedTiempoReal />
        </aside>
      </div>
    </div>
  );
}