import express from 'express';
import cors from 'cors';
import routes from './Routes/Router.js';
import env from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

env.config();

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = createServer(app);

// Middleware configuration
app.use(cors({
  origin: [
    //'https://frontend-chi-eight-28.vercel.app',
    'http://localhost:8000',
    'http://localhost:5173',
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('./uploads'));

// Socket.io configuration
const io = new Server(httpServer, {
  cors: {
    origin: [
      // 'https://frontend-chi-eight-28.vercel.app',
      'http://localhost:8000',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Use main router
app.use(routes);


// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
