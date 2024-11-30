const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// MongoDB Connection
const mongoURI = 'mongodb+srv://shifaulkareem06:8SD12sltjB0j3yA5@bismillah-foods.rh8fo.mongodb.net/?retryWrites=true&w=majority&appName=bismillah-foods'; // Replace with your connection string
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Define a Review Schema
const reviewSchema = new mongoose.Schema({
    name: String,
    foodImage: String,
    review: String,
    rating: Number,
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage });

// POST endpoint to submit a review
app.post('/api/reviews', upload.single('foodImage'), (req, res) => {
    const { name, review, rating } = req.body;
    const foodImage = req.file.path; // Get the file path

    const newReview = new Review({ name, foodImage, review, rating });
    newReview.save()
        .then(review => res.status(201).json(review))
        .catch(err => res.status(400).json({ error: err.message }));
});

// GET endpoint to fetch all reviews
app.get('/api/reviews', (req, res) => {
    Review.find()
        .then(reviews => res.json(reviews))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});