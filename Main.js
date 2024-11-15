import express from 'express';
import cors from 'cors';
import routes from './Routes/Router.js';
import env from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';

env.config();


const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin:[
    //'https://frontend-chi-eight-28.vercel.app',
    'http://localhost:8000',
    'http://localhost:5173/'
  ],
  methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));


app.use(express.json());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('./uploads'));


//SA may front end pala tong mga urls hehehhe
const io = new Server(httpServer, {
  cors: {
    origin:[
     // 'https://frontend-chi-eight-28.vercel.app',
      //'http://localhost:8000',
      'http://localhost:5173/'
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

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(routes);



app.get('/', (req, res) => {
  console.log("Request received at root endpoint");
  res.json({ message: 'Hello from API!' });
});


httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});