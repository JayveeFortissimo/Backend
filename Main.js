import express from 'express';
import cookie from 'cookie-parser';
import cors from 'cors';
import routes from './Routes/Router.js';
import bodyParser from 'body-parser';
import env from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

env.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'https://backend-production-1fc2.up.railway.app',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://backend-production-1fc2.up.railway.app',
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

// For accessing images added by admin
app.use('/uploads', express.static('./uploads'));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(routes);



// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});