const path = require('path');
const fs = require('fs');

const envPaths = [
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '../.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    break;
  }
}
if (!process.env.MONGO_URI) {
  require('dotenv').config();
}
const app = require('./app');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};
startServer();
