const express = require('express');
const { authRouter } = require('./routes/authRoutes');
const { connectDB } = require('./lib/db');
const messageRouter = require('./routes/messageRoutes');
const path = require('path');

const { app, io, server } = require('./lib/socket');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send("Hello jithu!");
});

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter)
const port = process.env.PORT;


server.listen(port || 5000, () => {
    console.log(`server is running in port ${port ? port : 5000}`);
    connectDB();
});