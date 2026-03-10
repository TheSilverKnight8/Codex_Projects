const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', taskRoutes);

app.listen(PORT, () => {
  console.log(`Student Task Portal server running on http://localhost:${PORT}`);
});
