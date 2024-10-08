import express from 'express';
import http from 'http';
import { handler } from '../build/handler.js';
import injectSocketIO from '../socketIoHandler.js';

const app = express();
const server = http.createServer(app);

// Inject SocketIO
injectSocketIO(server);

// SvelteKit handlers
app.use(handler);

server.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});
