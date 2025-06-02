const mongoose = require('mongoose');
const express = require('express');
const artistRoutes = require('./src/routes/user.route');
const songRoutes = require('./src/routes/song.route');
const albumRoutes = require('./src/routes/album.route');
const morgan = require('morgan');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Routes
app.use('/users', artistRoutes);
app.use('/songs', songRoutes);
app.use('/albums', albumRoutes);

// Xử lý lỗi 404
app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));