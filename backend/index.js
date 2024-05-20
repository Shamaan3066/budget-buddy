import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT;
const allowedOrigin = process.env.ALLOWED_ORIGIN;

//Middlewares
app.use(express.json());
app.use(cors({ origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB Atlas
const uri = process.env.MONGODB_URL;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

//Routes
app.use('/auth', userRoutes);
app.use('/transactions', transactionRoutes);

//Test
app.get('/', (req, res) => {
  res.send('Welcome to Budget Buddy');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});