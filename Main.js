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

//SA may front end pala tong mga urls hehehhe
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: 'http://localhost:5173',
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


app.get('/', (req, res) => {
  res.json({ message: 'Hello from API!' });
});


httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});