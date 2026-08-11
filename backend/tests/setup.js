// Test environment bootstrap — runs before each test file's imports.
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cricket-legends-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.FRONTEND_URL = 'http://localhost:5173';
