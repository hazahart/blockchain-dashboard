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
        url: 'http://hazahart.tailad6c60.ts.net:8001/nodo-laravel/public',
        color: '#7F77DD',
    },
    {
        id: 'Next',
        nombre: 'Nodo Next',
        url: 'http://100.85.161.96:8001',
        color: '#1D9E75',
    },
    {
        id: 'Express',
        nombre: 'Nodo Express',
        url: 'http://100.72.110.89:8002',
        color: '#D85A30',
    },
];

export default NODOS;