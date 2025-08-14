console.log('⏳ Server starting...');
import dotenv from 'dotenv';
dotenv.config(); 
import fs from "fs";
import path from "path";



import express from 'express';
import authRoute from './routes/auth';
import cors from "cors"
import { loadDataset } from './services/dataset-service';
import corsOptions from './cors.config';

const UPLOAD_DIR = path.join(__dirname, '../uploads');

// 2) If it doesn’t exist, create it (with nested dirs as needed)
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', authRoute);

// Static files
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 3000;

// Test endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start server

(async () => {
  console.log("⏳ Loading datasets…");
  await loadDataset();

  console.log("⏳ Server starting…");
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
})();
// Add error handlers
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  process.exit(1);
});