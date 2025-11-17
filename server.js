require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5000',
    'https://ea-w4if.onrender.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.static(path.join(__dirname)));

// Request log
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ======================================
// 🚀 FIXED MONGODB CONNECTION (NO WARNINGS)
// ======================================

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables!');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('\n💡 Quick Fix:');
    console.log('1. Check your MONGODB_URI in .env file');
    console.log('2. Verify IP Access in MongoDB Atlas');
    console.log('3. Restart server after updating settings\n');
  });

// ======================================
// SCHEMAS, ROUTES, AND EVERYTHING ELSE
// (UNCHANGED — your full code continues)
// ======================================

// Student Schema
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  faceDescriptor: { type: [Number], required: true },
  registeredAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true, ref: 'Student' },
  name: { type: String, required: true },
  course: { type: String, required: true },
  checkInTime: { type: Date, default: Date.now },
  date: { type: String, required: true },
  confidence: { type: Number, min: 0, max: 100 }
}, { timestamps: true });

attendanceSchema.index({ studentId: 1, date: 1 });

const Student = mongoose.model('Student', studentSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// ==== ALL YOUR ROUTES BELOW (unchanged from your code) ====
// ... (kept exactly the same)
// ==========================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 ========================================');
  console.log(`   Biometric Attendance System API`);
  console.log('   ========================================');
  console.log(`   📡 Server: http://localhost:${PORT}`);
  console.log(`   🔗 API: http://localhost:${PORT}/api`);
  console.log(`   🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   💾 Database: ${MONGODB_URI.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas'}`);
  console.log('   ========================================\n');
});

