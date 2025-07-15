// // // // // // // // // // // Load environment variables from a .env file
// // // // // // // // // // require('dotenv').config();

// // // // // // // // // // // Import necessary libraries
// // // // // // // // // // const express = require('express');
// // // // // // // // // // const cors = require('cors');
// // // // // // // // // // const multer = require('multer');
// // // // // // // // // // const pdf = require('pdf-parse');
// // // // // // // // // // const mammoth = require('mammoth');
// // // // // // // // // // const fs = require('fs');

// // // // // // // // // // // Initialize the Express application
// // // // // // // // // // const app = express();

// // // // // // // // // // // --- Multer Configuration ---
// // // // // // // // // // // Vercel has a temporary folder at /tmp where we can write files
// // // // // // // // // // const upload = multer({ dest: '/tmp' });

// // // // // // // // // // // --- Middleware ---
// // // // // // // // // // app.use(cors()); // Enable Cross-Origin Resource Sharing
// // // // // // // // // // app.use(express.json()); // Allow the server to understand JSON data

// // // // // // // // // // // --- The API Endpoint ---
// // // // // // // // // // // All Vercel serverless functions are automatically placed under the /api/ path
// // // // // // // // // // app.post('/api/generate-cover-letter', upload.single('resume'), async (req, res) => {
// // // // // // // // // //     const { jobDescription } = req.body;
// // // // // // // // // //     const resumeFile = req.file;

// // // // // // // // // //     if (!jobDescription || !resumeFile) {
// // // // // // // // // //         return res.status(400).json({ error: 'Missing job description or resume file.' });
// // // // // // // // // //     }

// // // // // // // // // //     console.log('Received Job Description:', jobDescription.substring(0, 100) + '...');
// // // // // // // // // //     console.log('Received Resume File:', resumeFile);

// // // // // // // // // //     // Placeholder for AI logic
// // // // // // // // // //     res.json({
// // // // // // // // // //         message: 'File and text received successfully!',
// // // // // // // // // //         fileName: resumeFile.originalname,
// // // // // // // // // //         jobDescriptionSnippet: jobDescription.substring(0, 100) + '...'
// // // // // // // // // //     });

// // // // // // // // // //     // Clean up the uploaded file after processing
// // // // // // // // // //     fs.unlinkSync(resumeFile.path);
// // // // // // // // // // });

// // // // // // // // // // // Export the app for Vercel to use.
// // // // // // // // // // // NOTICE: There is NO app.listen() here. Vercel handles that.
// // // // // // // // // // module.exports = app;

// // // // // // // // // // Load environment variables
// // // // // // // // // require('dotenv').config();

// // // // // // // // // // Import necessary libraries
// // // // // // // // // const express = require('express');
// // // // // // // // // const cors = require('cors');
// // // // // // // // // const multer = require('multer');
// // // // // // // // // const pdf = require('pdf-parse');
// // // // // // // // // const mammoth = require('mammoth');
// // // // // // // // // const fs = require('fs');

// // // // // // // // // // NEW: Import the Google AI library
// // // // // // // // // const { GoogleGenerativeAI } = require('@google/generative-ai');

// // // // // // // // // // --- AI Configuration ---
// // // // // // // // // // IMPORTANT: Your API key should be in an environment variable, not here directly.
// // // // // // // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // // // // // // // // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// // // // // // // // // // --- Express App Setup ---
// // // // // // // // // const app = express();
// // // // // // // // // const upload = multer({ dest: '/tmp' }); // Use /tmp for Vercel

// // // // // // // // // app.use(cors());
// // // // // // // // // app.use(express.json());


// // // // // // // // // // --- The Main API Endpoint ---
// // // // // // // // // app.post('/api/generate-cover-letter', upload.single('resume'), async (req, res) => {
// // // // // // // // //     try {
// // // // // // // // //         const { jobDescription } = req.body;
// // // // // // // // //         const resumeFile = req.file;

// // // // // // // // //         if (!jobDescription || !resumeFile) {
// // // // // // // // //             return res.status(400).json({ error: 'Missing job description or resume file.' });
// // // // // // // // //         }

// // // // // // // // //         // --- 1. Parse Text from Uploaded Resume ---
// // // // // // // // //         let resumeText = '';
// // // // // // // // //         if (resumeFile.mimetype === 'application/pdf') {
// // // // // // // // //             const dataBuffer = fs.readFileSync(resumeFile.path);
// // // // // // // // //             const data = await pdf(dataBuffer);
// // // // // // // // //             resumeText = data.text;
// // // // // // // // //         } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
// // // // // // // // //             const result = await mammoth.extractRawText({ path: resumeFile.path });
// // // // // // // // //             resumeText = result.value;
// // // // // // // // //         } else {
// // // // // // // // //             // Clean up and reject if the file type is wrong
// // // // // // // // //             fs.unlinkSync(resumeFile.path);
// // // // // // // // //             return res.status(400).json({ error: 'Unsupported file type. Please use PDF or DOCX.' });
// // // // // // // // //         }

// // // // // // // // //         // Clean up the uploaded file as soon as we're done with it
// // // // // // // // //         fs.unlinkSync(resumeFile.path);

// // // // // // // // //         // --- 2. Create the Prompt for the AI ---
// // // // // // // // //         const prompt = `
// // // // // // // // //             You are a professional career coach and an expert in writing compelling cover letters. Your task is to generate a personalized and professional cover letter based on the provided resume and job description.

// // // // // // // // //             **Instructions:**
// // // // // // // // //             1.  **Analyze the Resume:** Carefully read the resume to understand the candidate's skills, experience, and accomplishments.
// // // // // // // // //             2.  **Analyze the Job Description:** Identify the key requirements, responsibilities, and desired qualifications for the role.
// // // // // // // // //             3.  **Tailor the Content:** Write a cover letter that directly addresses the job requirements by highlighting the most relevant skills and experiences from the resume. Use keywords from the job description naturally.
// // // // // // // // //             4.  **Structure and Tone:** The cover letter should have a professional and confident tone. It must include a clear introduction, a body that connects the candidate's experience to the job, and a strong closing statement.
// // // // // // // // //             5.  **Do not invent information.** Base the cover letter only on the details provided in the resume and the job description.

// // // // // // // // //             ---
// // // // // // // // //             **Candidate's Resume:**
// // // // // // // // //             ${resumeText}
// // // // // // // // //             ---
// // // // // // // // //             **Job Description:**
// // // // // // // // //             ${jobDescription}
// // // // // // // // //             ---

// // // // // // // // //             Now, generate the cover letter.
// // // // // // // // //         `;

// // // // // // // // //         // --- 3. Call the Gemini API ---
// // // // // // // // //         const result = await model.generateContent(prompt);
// // // // // // // // //         const response = result.response;
// // // // // // // // //         const generatedText = response.text();

// // // // // // // // //         // --- 4. Send the AI-generated letter back to the frontend ---
// // // // // // // // //         res.json({
// // // // // // // // //             message: "Cover letter generated successfully!",
// // // // // // // // //             coverLetter: generatedText
// // // // // // // // //         });

// // // // // // // // //     } catch (error) {
// // // // // // // // //         console.error("Error in AI generation:", error);
// // // // // // // // //         res.status(500).json({ error: 'Failed to generate cover letter due to an internal server error.' });
// // // // // // // // //     }
// // // // // // // // // });

// // // // // // // // // // Export the app for Vercel
// // // // // // // // // module.exports = app;


// // // // // // // // // Load environment variables
// // // // // // // // require('dotenv').config();

// // // // // // // // // Import necessary libraries
// // // // // // // // const express = require('express');
// // // // // // // // const cors = require('cors');
// // // // // // // // const multer = require('multer');
// // // // // // // // const pdf = require('pdf-parse');
// // // // // // // // const mammoth = require('mammoth');
// // // // // // // // const fs = require('fs');

// // // // // // // // // NEW: Import the Google AI library
// // // // // // // // const { GoogleGenerativeAI } = require('@google/generative-ai');

// // // // // // // // // --- AI Configuration ---
// // // // // // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // // // // // // // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// // // // // // // // // --- Express App Setup ---
// // // // // // // // const app = express();
// // // // // // // // const upload = multer({ dest: '/tmp' }); // Use /tmp for Vercel

// // // // // // // // app.use(cors());
// // // // // // // // app.use(express.json());

// // // // // // // // // --- NEW: Add a handler for the root path ---
// // // // // // // // app.get('/api', (req, res) => {
// // // // // // // //     res.status(200).json({ status: 'ok', message: 'Cover Letter API is running.' });
// // // // // // // // });

// // // // // // // // // --- NEW: Add a handler for the favicon ---
// // // // // // // // app.get('/favicon.ico', (req, res) => {
// // // // // // // //     // Respond with 204 No Content, which tells the browser there is no icon
// // // // // // // //     res.status(204).send();
// // // // // // // // });


// // // // // // // // // --- The Main API Endpoint ---
// // // // // // // // app.post('/api/generate-cover-letter', upload.single('resume'), async (req, res) => {
// // // // // // // //     try {
// // // // // // // //         const { jobDescription } = req.body;
// // // // // // // //         const resumeFile = req.file;

// // // // // // // //         if (!jobDescription || !resumeFile) {
// // // // // // // //             return res.status(400).json({ error: 'Missing job description or resume file.' });
// // // // // // // //         }

// // // // // // // //         // --- 1. Parse Text from Uploaded Resume ---
// // // // // // // //         let resumeText = '';
// // // // // // // //         if (resumeFile.mimetype === 'application/pdf') {
// // // // // // // //             const dataBuffer = fs.readFileSync(resumeFile.path);
// // // // // // // //             const data = await pdf(dataBuffer);
// // // // // // // //             resumeText = data.text;
// // // // // // // //         } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
// // // // // // // //             const result = await mammoth.extractRawText({ path: resumeFile.path });
// // // // // // // //             resumeText = result.value;
// // // // // // // //         } else {
// // // // // // // //             fs.unlinkSync(resumeFile.path);
// // // // // // // //             return res.status(400).json({ error: 'Unsupported file type. Please use PDF or DOCX.' });
// // // // // // // //         }

// // // // // // // //         fs.unlinkSync(resumeFile.path);

// // // // // // // //         // --- 2. Create the Prompt for the AI ---
// // // // // // // //         const prompt = `
// // // // // // // //             You are a professional career coach and an expert in writing compelling cover letters. Your task is to generate a personalized and professional cover letter based on the provided resume and job description.

// // // // // // // //             **Instructions:**
// // // // // // // //             1.  **Analyze the Resume:** Carefully read the resume to understand the candidate's skills, experience, and accomplishments.
// // // // // // // //             2.  **Analyze the Job Description:** Identify the key requirements, responsibilities, and desired qualifications for the role.
// // // // // // // //             3.  **Tailor the Content:** Write a cover letter that directly addresses the job requirements by highlighting the most relevant skills and experiences from the resume. Use keywords from the job description naturally.
// // // // // // // //             4.  **Structure and Tone:** The cover letter should have a professional and confident tone. It must include a clear introduction, a body that connects the candidate's experience to the job, and a strong closing statement.
// // // // // // // //             5.  **Do not invent information.** Base the cover letter only on the details provided in the resume and the job description.

// // // // // // // //             ---
// // // // // // // //             **Candidate's Resume:**
// // // // // // // //             ${resumeText}
// // // // // // // //             ---
// // // // // // // //             **Job Description:**
// // // // // // // //             ${jobDescription}
// // // // // // // //             ---

// // // // // // // //             Now, generate the cover letter.
// // // // // // // //         `;

// // // // // // // //         // --- 3. Call the Gemini API ---
// // // // // // // //         const result = await model.generateContent(prompt);
// // // // // // // //         const response = result.response;
// // // // // // // //         const generatedText = response.text();

// // // // // // // //         // --- 4. Send the AI-generated letter back to the frontend ---
// // // // // // // //         res.json({
// // // // // // // //             message: "Cover letter generated successfully!",
// // // // // // // //             coverLetter: generatedText
// // // // // // // //         });

// // // // // // // //     } catch (error) {
// // // // // // // //         console.error("Error in AI generation:", error);
// // // // // // // //         res.status(500).json({ error: 'Failed to generate cover letter due to an internal server error.' });
// // // // // // // //     }
// // // // // // // // });

// // // // // // // // // Export the app for Vercel
// // // // // // // // module.exports = app;



// // // // // // // // Load environment variables
// // // // // // // require('dotenv').config();

// // // // // // // // Import necessary libraries
// // // // // // // const express = require('express');
// // // // // // // const cors = require('cors');
// // // // // // // const multer = require('multer');
// // // // // // // const pdf = require('pdf-parse');
// // // // // // // const mammoth = require('mammoth');
// // // // // // // const fs = require('fs');

// // // // // // // // NEW: Import the Google AI library
// // // // // // // const { GoogleGenerativeAI } = require('@google/generative-ai');

// // // // // // // // --- AI Configuration ---
// // // // // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // // // // // // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// // // // // // // // --- Express App Setup ---
// // // // // // // const app = express();
// // // // // // // const upload = multer({ dest: '/tmp' });

// // // // // // // app.use(cors());
// // // // // // // app.use(express.json());


// // // // // // // // --- Health Check and Favicon Handlers ---
// // // // // // // // Handle root path GET / for health checks
// // // // // // // app.get('/', (req, res) => {
// // // // // // //     res.status(200).json({ status: 'ok', message: 'Cover Letter API is running.' });
// // // // // // // });

// // // // // // // // Handle Vercel's default /api path
// // // // // // // app.get('/api', (req, res) => {
// // // // // // //     res.status(200).json({ status: 'ok', message: 'Cover Letter API is running.' });
// // // // // // // });

// // // // // // // // Handle favicon requests gracefully
// // // // // // // app.get('/favicon.ico', (req, res) => res.status(204).send());
// // // // // // // app.get('/favicon.png', (req, res) => res.status(204).send());


// // // // // // // // --- The Main API Endpoint ---
// // // // // // // app.post('/api/generate-cover-letter', upload.single('resume'), async (req, res) => {
// // // // // // //     try {
// // // // // // //         const { jobDescription } = req.body;
// // // // // // //         const resumeFile = req.file;

// // // // // // //         if (!jobDescription || !resumeFile) {
// // // // // // //             return res.status(400).json({ error: 'Missing job description or resume file.' });
// // // // // // //         }

// // // // // // //         // --- 1. Parse Text from Uploaded Resume ---
// // // // // // //         let resumeText = '';
// // // // // // //         if (resumeFile.mimetype === 'application/pdf') {
// // // // // // //             const dataBuffer = fs.readFileSync(resumeFile.path);
// // // // // // //             const data = await pdf(dataBuffer);
// // // // // // //             resumeText = data.text;
// // // // // // //         } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
// // // // // // //             const result = await mammoth.extractRawText({ path: resumeFile.path });
// // // // // // //             resumeText = result.value;
// // // // // // //         } else {
// // // // // // //             fs.unlinkSync(resumeFile.path);
// // // // // // //             return res.status(400).json({ error: 'Unsupported file type. Please use PDF or DOCX.' });
// // // // // // //         }

// // // // // // //         fs.unlinkSync(resumeFile.path);

// // // // // // //         // --- 2. Create the Prompt for the AI ---
// // // // // // //         const prompt = `
// // // // // // //             You are a professional career coach and an expert in writing compelling cover letters. Your task is to generate a personalized and professional cover letter based on the provided resume and job description.

// // // // // // //             **Instructions:**
// // // // // // //             1.  **Analyze the Resume:** Carefully read the resume to understand the candidate's skills, experience, and accomplishments.
// // // // // // //             2.  **Analyze the Job Description:** Identify the key requirements, responsibilities, and desired qualifications for the role.
// // // // // // //             3.  **Tailor the Content:** Write a cover letter that directly addresses the job requirements by highlighting the most relevant skills and experiences from the resume. Use keywords from the job description naturally.
// // // // // // //             4.  **Structure and Tone:** The cover letter should have a professional and confident tone. It must include a clear introduction, a body that connects the candidate's experience to the job, and a strong closing statement.
// // // // // // //             5.  **Do not invent information.** Base the cover letter only on the details provided in the resume and the job description.

// // // // // // //             ---
// // // // // // //             **Candidate's Resume:**
// // // // // // //             ${resumeText}
// // // // // // //             ---
// // // // // // //             **Job Description:**
// // // // // // //             ${jobDescription}
// // // // // // //             ---

// // // // // // //             Now, generate the cover letter.
// // // // // // //         `;

// // // // // // //         // --- 3. Call the Gemini API ---
// // // // // // //         const result = await model.generateContent(prompt);
// // // // // // //         const response = result.response;
// // // // // // //         const generatedText = response.text();

// // // // // // //         // --- 4. Send the AI-generated letter back to the frontend ---
// // // // // // //         res.json({
// // // // // // //             message: "Cover letter generated successfully!",
// // // // // // //             coverLetter: generatedText
// // // // // // //         });

// // // // // // //     } catch (error) {
// // // // // // //         console.error("Error in AI generation:", error);
// // // // // // //         res.status(500).json({ error: 'Failed to generate cover letter due to an internal server error.' });
// // // // // // //     }
// // // // // // // });

// // // // // // // // Export the app for Vercel
// // // // // // // module.exports = app;



// // // // // // require('dotenv').config();
// // // // // // const express = require('express');
// // // // // // const cors = require('cors');
// // // // // // const multer = require('multer');
// // // // // // const pdf = require('pdf-parse');
// // // // // // const mammoth = require('mammoth');
// // // // // // const fs = require('fs');
// // // // // // const { GoogleGenerativeAI } = require('@google/generative-ai');

// // // // // // // --- AI Configuration ---
// // // // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // // // // // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // // // // // // --- Express App Setup ---
// // // // // // const app = express();
// // // // // // // Render provides a PORT environment variable.
// // // // // // const PORT = process.env.PORT || 3001; 
// // // // // // const upload = multer({ dest: '/tmp' });

// // // // // // app.use(cors({
// // // // // //   origin: 'https://letter-genius-build-d261kt6im-shaan-uddins-projects.vercel.app/', // replace with your real Vercel domain
// // // // // // }));

// // // // // // app.use(express.json());

// // // // // // // --- API Routes ---
// // // // // // app.get('/', (req, res) => {
// // // // // //   res.status(200).json({ status: 'ok', message: 'Cover Letter API is running.' });
// // // // // // });

// // // // // // app.post('/api/generate-cover-letter', upload.single('resume'), async (req, res) => {
// // // // // //   try {
// // // // // //     // ... (The AI generation logic remains exactly the same) ...
// // // // // //     const { jobDescription } = req.body;
// // // // // //     const resumeFile = req.file;

// // // // // //     if (!jobDescription || !resumeFile) {
// // // // // //         return res.status(400).json({ error: 'Missing job description or resume file.' });
// // // // // //     }

// // // // // //     let resumeText = '';
// // // // // //     if (resumeFile.mimetype === 'application/pdf') {
// // // // // //         const dataBuffer = fs.readFileSync(resumeFile.path);
// // // // // //         const data = await pdf(dataBuffer);
// // // // // //         resumeText = data.text;
// // // // // //     } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
// // // // // //         const result = await mammoth.extractRawText({ path: resumeFile.path });
// // // // // //         resumeText = result.value;
// // // // // //     } else {
// // // // // //         fs.unlinkSync(resumeFile.path);
// // // // // //         return res.status(400).json({ error: 'Unsupported file type. Please use PDF or DOCX.' });
// // // // // //     }

// // // // // //     fs.unlinkSync(resumeFile.path);

// // // // // //     const prompt = `
// // // // // //         You are a professional career coach...
// // // // // //         ---
// // // // // //         **Candidate's Resume:**
// // // // // //         ${resumeText}
// // // // // //         ---
// // // // // //         **Job Description:**
// // // // // //         ${jobDescription}
// // // // // //         ---
// // // // // //         Now, generate the cover letter.
// // // // // //     `;

// // // // // //     const result = await model.generateContent(prompt);
// // // // // //     const response = result.response;
// // // // // //     const generatedText = response.text();

// // // // // //     res.json({
// // // // // //         message: "Cover letter generated successfully!",
// // // // // //         coverLetter: generatedText
// // // // // //     });

// // // // // //   } catch (error) {
// // // // // //     console.error("Error in AI generation:", error);
// // // // // //     res.status(500).json({ error: 'Failed to generate cover letter due to an internal server error.' });
// // // // // //   }
// // // // // // });

// // // // // // // --- ADD THIS BACK ---
// // // // // // // This starts the server and is required for Render
// // // // // // app.listen(PORT, () => {
// // // // // //   console.log(`Server is listening on port ${PORT}`);
// // // // // // });


// // // // // require('dotenv').config();
// // // // // const express = require('express');
// // // // // const cors = require('cors');
// // // // // const multer = require('multer');
// // // // // const pdf = require('pdf-parse');
// // // // // const mammoth = require('mammoth');
// // // // // const fs = require('fs');
// // // // // const { GoogleGenerativeAI } = require('@google/generative-ai');

// // // // // // --- AI Configuration ---
// // // // // if (!process.env.GEMINI_API_KEY) {
// // // // //   throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
// // // // // }
// // // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // // // // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // // // // // --- Express App Setup ---
// // // // // const app = express();
// // // // // // Render provides a PORT environment variable.
// // // // // const PORT = process.env.PORT || 3001;
// // // // // const upload = multer({ dest: '/tmp' });

// // // // // // --- CORS Configuration ---
// // // // // // This allows requests from your Vercel frontend
// // // // // const allowedOrigins = [
// // // // //   'https://letter-genius-build.vercel.app', // Your production domain
// // // // //   // Add other origins if needed, e.g., for local development: 'http://localhost:3000'
// // // // // ];

// // // // // app.use(cors({
// // // // //   origin: function (origin, callback) {
// // // // //     // Allow requests with no origin (like mobile apps or curl requests)
// // // // //     if (!origin) return callback(null, true);

// // // // //     // Vercel preview deployments have a dynamic subdomain.
// // // // //     // This regex allows any subdomain of vercel.app.
// // // // //     const isVercelPreview = /--[a-z0-9-]+\.vercel\.app$/.test(origin);

// // // // //     if (allowedOrigins.indexOf(origin) !== -1 || isVercelPreview) {
// // // // //       callback(null, true);
// // // // //     } else {
// // // // //       callback(new Error('Not allowed by CORS'));
// // // // //     }
// // // // //   }
// // // // // }));


// // // // // app.use(express.json());

// // // // // // --- API Routes ---
// // // // // app.get('/', (req, res) => {
// // // // //   res.status(200).json({ status: 'ok', message: 'Cover Letter API is running.' });
// // // // // });

// // // // // app.post('/api/generate-cover-letter', upload.single('resume'), async (req, res) => {
// // // // //   try {
// // // // //     const { jobDescription } = req.body;
// // // // //     const resumeFile = req.file;

// // // // //     if (!jobDescription || !resumeFile) {
// // // // //         return res.status(400).json({ error: 'Missing job description or resume file.' });
// // // // //     }

// // // // //     let resumeText = '';
// // // // //     if (resumeFile.mimetype === 'application/pdf') {
// // // // //         const dataBuffer = fs.readFileSync(resumeFile.path);
// // // // //         const data = await pdf(dataBuffer);
// // // // //         resumeText = data.text;
// // // // //     } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
// // // // //         const result = await mammoth.extractRawText({ path: resumeFile.path });
// // // // //         resumeText = result.value;
// // // // //     } else {
// // // // //         fs.unlinkSync(resumeFile.path);
// // // // //         return res.status(400).json({ error: 'Unsupported file type. Please use PDF or DOCX.' });
// // // // //     }

// // // // //     // Clean up the uploaded file as soon as we're done
// // // // //     fs.unlinkSync(resumeFile.path);

// // // // //     // The prompt for the AI
// // // // //     const prompt = `
// // // // //         You are a professional career coach and an expert in writing compelling cover letters. Your task is to generate a personalized and professional cover letter based on the provided resume and job description.
// // // // //         **Instructions:**
// // // // //         1. **Analyze the Resume:** Carefully read the resume to understand the candidate's skills, experience, and accomplishments.
// // // // //         2. **Analyze the Job Description:** Identify the key requirements, responsibilities, and desired qualifications for the role.
// // // // //         3. **Tailor the Content:** Write a cover letter that directly addresses the job requirements by highlighting the most relevant skills and experiences from the resume. Use keywords from the job description naturally.
// // // // //         4. **Structure and Tone:** The cover letter should have a professional and confident tone. It must include a clear introduction, a body that connects the candidate's experience to the job, and a strong closing statement.
// // // // //         5. **Do not invent information.** Base the cover letter only on the details provided in the resume and the job description.
// // // // //         ---
// // // // //         **Candidate's Resume:**
// // // // //         ${resumeText}
// // // // //         ---
// // // // //         **Job Description:**
// // // // //         ${jobDescription}
// // // // //         ---
// // // // //         Now, generate the cover letter.
// // // // //     `;

// // // // //     const result = await model.generateContent(prompt);
// // // // //     const response = result.response;
// // // // //     const generatedText = response.text();

// // // // //     res.json({
// // // // //         message: "Cover letter generated successfully!",
// // // // //         coverLetter: generatedText
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error("Error in AI generation:", error);
// // // // //     res.status(500).json({ error: 'Failed to generate cover letter. Please check the server logs.' });
// // // // //   }
// // // // // });

// // // // // // --- Start Server ---
// // // // // app.listen(PORT, () => {
// // // // //   console.log(`Server is listening on port ${PORT}`);
// // // // // });



// // // // require('dotenv').config();
// // // // const express = require('express');
// // // // const cors = require('cors');
// // // // const multer = require('multer');
// // // // const pdf = require('pdf-parse');
// // // // const mammoth = require('mammoth');
// // // // const fs = require('fs');
// // // // const { GoogleGenerativeAI } = require('@google/generative-ai');

// // // // // --- AI Configuration ---
// // // // if (!process.env.GEMINI_API_KEY) {
// // // //   console.error("FATAL ERROR: GEMINI_API_KEY is not defined in your environment variables.");
// // // //   process.exit(1);
// // // // }
// // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // // // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // // // // --- Express App Setup ---
// // // // const app = express();
// // // // const PORT = process.env.PORT || 3001;
// // // // const upload = multer({ dest: '/tmp' });

// // // // // --- CORS Configuration ---
// // // // const allowedOrigins = [
// // // //   'https://letter-genius-build.vercel.app',
// // // //   'https://letter-genius-build-ata5km3hd-shaan-uddins-projects.vercel.app' // Add your specific preview domain
// // // // ];

// // // // app.use(cors({
// // // //   origin: function (origin, callback) {
// // // //     if (!origin || allowedOrigins.indexOf(origin) !== -1 || /--[a-z0-9-]+\.vercel\.app$/.test(origin)) {
// // // //       callback(null, true);
// // // //     } else {
// // // //       callback(new Error('Not allowed by CORS'));
// // // //     }
// // // //   }
// // // // }));

// // // // app.use(express.json());

// // // // // --- API Routes ---
// // // // app.get('/', (req, res) => {
// // // //   res.status(200).json({ status: 'ok', message: 'Cover Letter API is running.' });
// // // // });

// // // // app.post('/api/generate-cover-letter', upload.single('resume'), async (req, res) => {
// // // //   try {
// // // //     const { jobDescription } = req.body;
// // // //     const resumeFile = req.file;

// // // //     if (!jobDescription || !resumeFile) {
// // // //         return res.status(400).json({ error: 'Missing job description or resume file.' });
// // // //     }

// // // //     let resumeText = '';
// // // //     const tempPath = resumeFile.path;

// // // //     if (resumeFile.mimetype === 'application/pdf') {
// // // //         const dataBuffer = fs.readFileSync(tempPath);
// // // //         const data = await pdf(dataBuffer);
// // // //         resumeText = data.text;
// // // //     } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
// // // //         const result = await mammoth.extractRawText({ path: tempPath });
// // // //         resumeText = result.value;
// // // //     } else {
// // // //         fs.unlinkSync(tempPath);
// // // //         return res.status(400).json({ error: 'Unsupported file type. Please use PDF or DOCX.' });
// // // //     }

// // // //     fs.unlinkSync(tempPath);

// // // //     const prompt = `
// // // //         You are a professional career coach and an expert in writing compelling cover letters. Your task is to generate a personalized and professional cover letter based on the provided resume and job description.
// // // //         **Instructions:**
// // // //         1. **Analyze the Resume:** Carefully read the resume to understand the candidate's skills, experience, and accomplishments.
// // // //         2. **Analyze the Job Description:** Identify the key requirements, responsibilities, and desired qualifications for the role.
// // // //         3. **Tailor the Content:** Write a cover letter that directly addresses the job requirements by highlighting the most relevant skills and experiences from the resume. Use keywords from the job description naturally.
// // // //         4. **Structure and Tone:** The cover letter should have a professional and confident tone. It must include a clear introduction, a body that connects the candidate's experience to the job, and a strong closing statement.
// // // //         5. **Do not invent information.** Base the cover letter only on the details provided in the resume and the job description.
// // // //         ---
// // // //         **Candidate's Resume:**
// // // //         ${resumeText}
// // // //         ---
// // // //         **Job Description:**
// // // //         ${jobDescription}
// // // //         ---
// // // //         Now, generate the cover letter.
// // // //     `;

// // // //     const result = await model.generateContent(prompt);
// // // //     const response = result.response;
// // // //     const generatedText = response.text();

// // // //     res.json({
// // // //         message: "Cover letter generated successfully!",
// // // //         coverLetter: generatedText
// // // //     });

// // // //   } catch (error) {
// // // //     console.error("Error in /api/generate-cover-letter:", error);
// // // //     res.status(500).json({ error: 'Failed to generate cover letter. Please check server logs.' });
// // // //   }
// // // // });

// // // // // --- Start Server ---
// // // // app.listen(PORT, () => {
// // // //   console.log(`Server is listening on port ${PORT}`);
// // // // });


// // // require('dotenv').config();
// // // const express = require('express');
// // // const cors = require('cors');
// // // const multer = require('multer');
// // // const pdf = require('pdf-parse');
// // // const mammoth = require('mammoth');
// // // const fs = require('fs');
// // // const { GoogleGenerativeAI } = require('@google/generative-ai');

// // // // --- AI Configuration ---
// // // if (!process.env.GEMINI_API_KEY) {
// // //   console.error("FATAL ERROR: GEMINI_API_KEY is not defined.");
// // //   process.exit(1);
// // // }
// // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // // // --- Express App Setup ---
// // // const app = express();
// // // const PORT = process.env.PORT || 3001;
// // // const upload = multer({ dest: '/tmp' });

// // // // --- CORS Configuration (Simplified for Debugging) ---
// // // // This will allow requests from any origin.
// // // app.use(cors());

// // // app.use(express.json());

// // // // --- API Routes ---
// // // app.get('/', (req, res) => {
// // //   res.status(200).json({ status: 'ok', message: 'API is running.' });
// // // });

// // // // *** IMPORTANT: The route has been simplified ***
// // // app.post('/generate-cover-letter', upload.single('resume'), async (req, res) => {
// // //   try {
// // //     const { jobDescription } = req.body;
// // //     const resumeFile = req.file;

// // //     if (!jobDescription || !resumeFile) {
// // //         return res.status(400).json({ error: 'Missing job description or resume file.' });
// // //     }

// // //     let resumeText = '';
// // //     const tempPath = resumeFile.path;

// // //     if (resumeFile.mimetype === 'application/pdf') {
// // //         const dataBuffer = fs.readFileSync(tempPath);
// // //         const data = await pdf(dataBuffer);
// // //         resumeText = data.text;
// // //     } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
// // //         const result = await mammoth.extractRawText({ path: tempPath });
// // //         resumeText = result.value;
// // //     } else {
// // //         fs.unlinkSync(tempPath);
// // //         return res.status(400).json({ error: 'Unsupported file type. Please use PDF or DOCX.' });
// // //     }

// // //     fs.unlinkSync(tempPath);

// // //     const prompt = `
// // //         You are a professional career coach...
// // //         ---
// // //         **Candidate's Resume:**
// // //         ${resumeText}
// // //         ---
// // //         **Job Description:**
// // //         ${jobDescription}
// // //         ---
// // //         Now, generate the cover letter.
// // //     `;

// // //     const result = await model.generateContent(prompt);
// // //     const response = result.response;
// // //     const generatedText = response.text();

// // //     res.json({
// // //         message: "Cover letter generated successfully!",
// // //         coverLetter: generatedText
// // //     });

// // //   } catch (error) {
// // //     console.error("Error in /generate-cover-letter:", error);
// // //     res.status(500).json({ error: 'Failed to generate cover letter.' });
// // //   }
// // // });

// // // // --- Start Server ---
// // // app.listen(PORT, () => {
// // //   console.log(`Server is listening on port ${PORT}`);
// // // });




// // require('dotenv').config();
// // const express = require('express');
// // const cors = require('cors');
// // const multer = require('multer');
// // const pdf = require('pdf-parse');
// // const mammoth = require('mammoth');
// // const fs = require('fs');
// // const { GoogleGenerativeAI } = require('@google/generative-ai');

// // if (!process.env.GEMINI_API_KEY) {
// //   console.error("FATAL ERROR: GEMINI_API_KEY is not defined.");
// //   process.exit(1);
// // }
// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // const app = express();
// // const PORT = process.env.PORT || 3001;
// // const upload = multer({ dest: '/tmp' });

// // app.use(cors());
// // app.use(express.json());

// // app.get('/', (req, res) => {
// //   res.status(200).json({ status: 'ok', message: 'API is running.' });
// // });

// // app.post('/generate-cover-letter', upload.single('resume'), async (req, res) => {
// //   try {
// //     const { jobDescription } = req.body;
// //     const resumeFile = req.file;

// //     if (!jobDescription || !resumeFile) {
// //         return res.status(400).json({ error: 'Missing job description or resume file.' });
// //     }

// //     let resumeText = '';
// //     const tempPath = resumeFile.path;

// //     if (resumeFile.mimetype === 'application/pdf') {
// //         const dataBuffer = fs.readFileSync(tempPath);
// //         const data = await pdf(dataBuffer);
// //         resumeText = data.text;
// //     } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
// //         const result = await mammoth.extractRawText({ path: tempPath });
// //         resumeText = result.value;
// //     } else {
// //         fs.unlinkSync(tempPath);
// //         return res.status(400).json({ error: 'Unsupported file type. Please use PDF or DOCX.' });
// //     }

// //     fs.unlinkSync(tempPath);

// //     const prompt = `You are a professional career coach...`; // The full prompt

// //     const result = await model.generateContent(prompt);
// //     const response = result.response;
// //     const generatedText = response.text();

// //     res.json({
// //         message: "Cover letter generated successfully!",
// //         coverLetter: generatedText
// //     });

// //   } catch (error) {
// //     console.error("Error in /generate-cover-letter:", error);
// //     res.status(500).json({ error: 'Failed to generate cover letter.' });
// //   }
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server is listening on port ${PORT}`);
// // });


// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const pdf = require('pdf-parse');
// const mammoth = require('mammoth');
// const fs = require('fs');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // --- AI Configuration ---
// if (!process.env.GEMINI_API_KEY) {
//   console.error("FATAL ERROR: GEMINI_API_KEY is not defined.");
//   process.exit(1);
// }
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // --- Express App Setup ---
// const app = express();
// const PORT = process.env.PORT || 3001;
// const upload = multer({ dest: '/tmp' });

// app.use(cors());
// app.use(express.json());

// // --- API Routes ---
// app.get('/', (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'API is running.' });
// });

// app.post('/generate-cover-letter', upload.single('resume'), async (req, res) => {
//   try {
//     const { jobDescription } = req.body;
//     const resumeFile = req.file;

//     if (!jobDescription || !resumeFile) {
//         return res.status(400).json({ error: 'Missing job description or resume file.' });
//     }

//     let resumeText = '';
//     const tempPath = resumeFile.path;

//     if (resumeFile.mimetype === 'application/pdf') {
//         const dataBuffer = fs.readFileSync(tempPath);
//         const data = await pdf(dataBuffer);
//         resumeText = data.text;
//     } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//         const result = await mammoth.extractRawText({ path: tempPath });
//         resumeText = result.value;
//     } else {
//         fs.unlinkSync(tempPath);
//         return res.status(400).json({ error: 'Unsupported file type. Please use PDF or DOCX.' });
//     }

//     fs.unlinkSync(tempPath);

//     // *** THIS IS THE NEW, MORE DIRECT PROMPT ***
//     const prompt = `
//         Based on the following resume and the provided job description, write a professional and tailored cover letter.

//         **Resume Details:**
//         ---
//         ${resumeText}
//         ---

//         **Job Description:**
//         ---
//         ${jobDescription}
//         ---
//     `;

//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const generatedText = response.text();

//     res.json({
//         message: "Cover letter generated successfully!",
//         coverLetter: generatedText
//     });

//   } catch (error) {
//     console.error("Error in /generate-cover-letter:", error);
//     res.status(500).json({ error: 'Failed to generate cover letter.' });
//   }
// });

// // --- Start Server ---
// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });





require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- AI Configuration ---
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not defined.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- Express App Setup ---
const app = express();
const PORT = process.env.PORT || 3001;
const upload = multer({ dest: '/tmp' });

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running.' });
});

app.post('/generate-cover-letter', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const resumeFile = req.file;

    if (!jobDescription || !resumeFile) {
        return res.status(400).json({ error: 'Missing job description or resume file.' });
    }

    let resumeText = '';
    const tempPath = resumeFile.path;

    if (resumeFile.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(tempPath);
        const data = await pdf(dataBuffer);
        resumeText = data.text;
    } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ path: tempPath });
        resumeText = result.value;
    } else {
        fs.unlinkSync(tempPath);
        return res.status(400).json({ error: 'Unsupported file type. Please use PDF or DOCX.' });
    }

    fs.unlinkSync(tempPath);

    // *** THIS IS THE NEW, REFINED PROMPT ***
    const prompt = `
        Generate a concise, professional, and tailored cover letter based on the provided resume and job description.

        **Instructions:**
        1. Keep the entire letter under 300 words.
        2. Directly address the key requirements from the job description, using specific examples from the resume.
        3. Avoid repetitive phrases. Each paragraph should provide new, impactful information.
        4. Maintain a confident and professional tone.

        **Resume Details:**
        ---
        ${resumeText}
        ---

        **Job Description:**
        ---
        ${jobDescription}
        ---
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text();

    res.json({
        message: "Cover letter generated successfully!",
        coverLetter: generatedText
    });

  } catch (error) {
    console.error("Error in /generate-cover-letter:", error);
    res.status(500).json({ error: 'Failed to generate cover letter.' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});