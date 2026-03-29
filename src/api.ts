import axios from 'axios';

export const getNodoApi = (url: string) => ({
    getChain: () =>
        axios.get(`${url}/api/chain`).then(r => r.data),

    getTransacciones: () =>
        axios.get(`${url}/api/transactions`).then(r => r.data),

    getNodos: () =>
        axios.get(`${url}/api/nodes`).then(r => r.data),

    getPersonas: () =>
        axios.get(`${url}/api/personas`).then(r => r.data),

    getInstituciones: () =>
        axios.get(`${url}/api/instituciones`).then(r => r.data),

    getProgramas: () =>
        axios.get(`${url}/api/programas`).then(r => r.data),

    mine: () =>
        axios.post(`${url}/api/mine`).then(r => r.data),

    resolve: () =>
        axios.get(`${url}/api/nodes/resolve`).then(r => r.data),

    registrarNodo: (nodoUrl: string, nombre: string) =>
        axios.post(`${url}/api/nodes/register`, { url: nodoUrl, nombre }).then(r => r.data),

    crearTransaccion: (datos: Record<string, string>) =>
        axios.post(`${url}/api/transactions`, datos).then(r => r.data),
});