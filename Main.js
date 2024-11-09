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

// Define allowed origins
const allowedOrigins = [
  'https://frontend-chi-eight-28.vercel.app',
  'https://frontend-3g30f0t4c-jayveefortissimos-projects.vercel.app',  // Add more origins here if needed
];

// CORS configuration for HTTP requests
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests from any origin in the allowedOrigins array or requests without origin (like Postman)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
}));

// Set up the Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: function(origin, callback) {
      // Allow connections from any origin in the allowedOrigins array
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

// For accessing images uploaded by the admin
app.use('/uploads', express.static('./uploads'));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(routes);

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Uncomment if you want a root endpoint (optional)
// app.get('/', (req, res) => {
//   console.log("Request received at root endpoint");
//   res.json({ message: 'Hello from API!' });
// });

httpServer.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
