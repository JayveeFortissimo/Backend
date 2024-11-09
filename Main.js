import express from 'express';
import cookie from 'cookie-parser';
import cors from 'cors';
import routes from './Routes/Router.js';
import bodyParser from 'body-parser';
import env from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

env.config();



const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = createServer(app);


app.use(cors({
  origin:[
    'https://frontend-chi-eight-28.vercel.app',
    'https://frontend-chi-eight-28.vercel.app/',
    'https://frontend-3g30f0t4c-jayveefortissimos-projects.vercel.app/',
    'https://frontend-3g30f0t4c-jayveefortissimos-projects.vercel.app',
     '*'
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
}));



app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

//SA may front end pala tong mga urls hehehhe
const io = new Server(httpServer, {
  cors: {
    origin:[
      'https://frontend-chi-eight-28.vercel.app',
      'https://frontend-chi-eight-28.vercel.app/',
      'http://localhost:5173/',
      'https://frontend-3g30f0t4c-jayveefortissimos-projects.vercel.app/',
      'https://frontend-3g30f0t4c-jayveefortissimos-projects.vercel.app',
       '*'
    ],
    methods:['GET', 'POST'],
    credentials: true
  }
});


// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// For accessing images added by admin
app.use('/uploads', express.static('./uploads'));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(routes);


/*
app.get('/', (req, res) => {
  console.log("Request received at root endpoint");
  res.json({ message: 'Hello from API!' });
});
*/

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});