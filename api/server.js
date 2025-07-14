// Load environment variables from a .env file
require('dotenv').config();

// Import necessary libraries
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

// Initialize the Express application
const app = express();

// --- Multer Configuration ---
// Vercel has a temporary folder at /tmp where we can write files
const upload = multer({ dest: '/tmp' });

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to understand JSON data

// --- The API Endpoint ---
// All Vercel serverless functions are automatically placed under the /api/ path
app.post('/api/generate-cover-letter', upload.single('resume'), async (req, res) => {
    const { jobDescription } = req.body;
    const resumeFile = req.file;

    if (!jobDescription || !resumeFile) {
        return res.status(400).json({ error: 'Missing job description or resume file.' });
    }

    console.log('Received Job Description:', jobDescription.substring(0, 100) + '...');
    console.log('Received Resume File:', resumeFile);

    // Placeholder for AI logic
    res.json({
        message: 'File and text received successfully!',
        fileName: resumeFile.originalname,
        jobDescriptionSnippet: jobDescription.substring(0, 100) + '...'
    });

    // Clean up the uploaded file after processing
    fs.unlinkSync(resumeFile.path);
});

// Export the app for Vercel to use.
// NOTICE: There is NO app.listen() here. Vercel handles that.
module.exports = app;