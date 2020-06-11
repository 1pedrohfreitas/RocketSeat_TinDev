import axios from 'axios';

const app = axios.create({
    baseURL: 'http://192.168.0.6:3333'
})

export default app;