const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// --- Local Imports ---
const { authRouter } = require('./routes/authRoutes');
const messageRouter = require('./routes/messageRoutes');
const { connectDB } = require('./lib/db');
const { app, server } = require('./lib/socket');

const PORT = process.env.PORT || 5000;

// --- 1. CORE MIDDLEWARE ---
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// --- 2. API ROUTES ---
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

// --- 3. SERVE STATIC FRONTEND ---
const parentDir = path.join(__dirname, '..'); // Go up to the project's root directory
app.use(express.static(path.join(parentDir, "frontend", "dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(parentDir, "frontend", "dist", "index.html"));
});

// --- SERVER INITIALIZATION ---
server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    connectDB();
});
