export interface Nodo {
    id: string;
    nombre: string;
    url: string;
    color: string;
}

const NODOS: Nodo[] = [
    {
        id: 'laravel',
        nombre: 'Nodo Laravel',
        url: 'http://nodo-blockchain.test',
        color: '#7F77DD',
    },
    {
        id: 'express',
        nombre: 'Nodo Express',
        url: 'http://100.x.x.x:8002',
        color: '#1D9E75',
    },
    {
        id: 'next',
        nombre: 'Nodo Next',
        url: 'http://100.x.x.x:8003',
        color: '#D85A30',
    },
];

export default NODOS;