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
app.use(express.json({ limit: "10mb" })); // To parse JSON payloads
app.use(cookieParser()); // To parse cookies for authentication

// --- 2. API ROUTES ---
// All API calls are handled first
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

// --- 3. SERVE STATIC FRONTEND ---
// Serve static files from the React app's 'dist' folder
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// The "catch-all" handler: for any request that doesn't match an API route,
// send back React's index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// --- SERVER INITIALIZATION ---
server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    connectDB();
});
