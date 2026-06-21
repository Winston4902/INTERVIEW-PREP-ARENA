import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Note the .js extensions required for ES Modules
import User from './models/User.js'; 
import { protect } from './middleware/authMiddleware.js';

// --- API KEY ROULETTE SETUP ---
const apiKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3
].filter(Boolean);

if (apiKeys.length === 0) {
    console.error("🚨 FATAL ERROR: Missing Gemini API Keys in .env file!");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// --- CONNECT TO MONGODB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// --- ROUTE: REGISTER NEW USER ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const user = await User.create({ name, email, password });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROUTE: LOGIN USER ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({ _id: user._id, name: user.name, email: user.email, token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const systemInstruction = `You are a Senior Software Engineer and Technical Interviewer at a top-tier tech company (e.g., Google, Meta, Amazon). Your objective is to conduct realistic, challenging, and constructive mock interviews for candidates preparing for Software Engineering roles, specifically focusing on Data Structures & Algorithms (DSA) and System Design.

**Your Persona & Tone:**
* **Professional yet Encouraging:** You maintain the formal, analytical tone of a real interviewer, but you want the candidate to succeed. 
* **Interactive:** You do NOT just hand out questions and answers. You engage in a back-and-forth dialogue.
* **Probing:** You actively ask follow-up questions about edge cases, trade-offs, and time/space complexity.

**Strict Rules of Conduct:**
1.  **Never Repeat Questions:** You must keep an internal track of the topics and specific questions you have asked the candidate. Never ask the same question twice, and ensure a diverse rotation of concepts.
2.  **One Step at a Time:** Never give the candidate a list of questions. Ask ONE question, and wait for their response. 
3.  **Do Not Spoon-feed:** If the candidate is stuck, do not immediately give them the solution. Provide a subtle hint or ask a guiding question to help them reach the answer themselves.
4.  **Demand Optimization:** Always ask for the brute-force approach first (if applicable), and then push the candidate to optimize their solution. Always ask for Time and Space Complexity (Big O).

**Interview Flow:**
1.  **Initialization:** Greet the candidate professionally. Ask them what they would like to focus on today: DSA, System Design, or a mix, and what their target seniority level is.
2.  **The Question:** Present a clear, unambiguous problem statement. 
3.  **The Dialogue (DSA):** Expect the candidate to clarify requirements, propose an approach, analyze complexity, and write code.
4.  **The Dialogue (System Design):** Expect the candidate to clarify functional/non-functional requirements, do capacity estimation, define APIs, design the high-level architecture, and discuss bottlenecks.
5.  **Feedback:** Once a problem is fully solved (or the candidate gives up), provide a structured "Interviewer Feedback" summary. 

Begin the session now by introducing yourself as their interviewer and asking how they would like to structure today's mock interview.`;

const cleanTextForSpeech = (rawText) => {
    let text = rawText;
    text = text.replace(/```[\s\S]*?```/g, ' I have provided the code in the chat. ');
    text = text.replace(/`/g, '');
    text = text.replace(/\*\*/g, '');
    text = text.replace(/\*/g, '');
    text = text.replace(/([a-zA-Z0-9_]+)\[([a-zA-Z0-9_]+)\]/g, '$1 of $2');
    text = text.replace(/O\((.*?)\)/gi, 'O of $1');
    text = text.replace(/\^2/g, ' squared');
    text = text.replace(/\bDFS\b/gi, 'D F S');
    text = text.replace(/\bBFS\b/gi, 'B F S');
    text = text.replace(/\bDP\b/g, 'Dynamic Programming');
    text = text.replace(/\bBST\b/gi, 'Binary Search Tree');
    text = text.replace(/\bLCA\b/gi, 'Lowest Common Ancestor');
    text = text.replace(/C\+\+/gi, 'C plus plus');
    text = text.replace(/C#/gi, 'C sharp');
    text = text.replace(/==/g, ' equals ');
    text = text.replace(/!=/g, ' does not equal ');
    text = text.replace(/<=/g, ' less than or equal to ');
    text = text.replace(/>=/g, ' greater than or equal to ');
    return text;
};

// --- ROUTE 1: THE AI INTERVIEWER ---
app.post('/api/chat', protect, async (req, res) => {
    try {
        const { history } = req.body;

        const activeKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
        const ai = new GoogleGenAI({ apiKey: activeKey });

        const contents = history.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: { systemInstruction: systemInstruction }
        });

        const aiText = response.text;
        res.json({ text: aiText, audio: null });

    } catch (error) {
        console.error("Gemini Chat Error:", error);
        res.status(500).json({ error: "Something went wrong with the AI." });
    }
});

// --- ROUTE 2: THE PDF RESUME ANALYZER ---
app.post('/api/analyze-resume', protect, upload.single('resumeFile'), async (req, res) => {
    try {
        const jobDescription = req.body.jobDescription;
        const resumeFile = req.file;

        if (!resumeFile || !jobDescription) {
            return res.status(400).json({ error: "Please provide both a PDF resume and a job description." });
        }

        const PDFParserModule = await import('pdf2json');
        const PDFParser = PDFParserModule.default || PDFParserModule;
        const pdfParser = new PDFParser();

        const resumeText = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", pdfData => {
                let textContent = "";
                for (let page of pdfData.Pages) {
                    for (let texts of page.Texts) {
                        const rawText = texts.R[0].T;
                        try {
                            textContent += decodeURIComponent(rawText) + " ";
                        } catch (err) {
                            try {
                                textContent += unescape(rawText) + " ";
                            } catch (e) {
                                textContent += rawText + " ";
                            }
                        }
                    }
                }
                resolve(textContent);
            });
            pdfParser.parseBuffer(resumeFile.buffer);
        });

        const systemPrompt = `"""You are an expert Applicant Tracking System (ATS) algorithm and a highly critical Senior Technical Recruiter. Your task is to evaluate the provided resume against the provided job description practically, objectively, and rigorously.

**Evaluation Criteria for a "Practical" Rating:**
1. **Context over Keyword Stuffing:** Do not just count keywords. A candidate mentioning "Java" gets a low score; a candidate stating "Optimized Java microservices to reduce latency by 20%" gets a high score.
2. **Quantifiable Impact:** Strongly penalize resumes that list duties without metrics, scale, or outcomes.
3. **Strict Scoring Rubric:**
   * **90-100:** Exceptional. Meets all core requirements, highly quantified achievements, exact domain experience.
   * **75-89:** Strong fit. Meets most core requirements, good contextual evidence of skills, some metrics.
   * **50-74:** Average/Moderate fit. Missing some core requirements OR lists skills without proving them via accomplishments.
   * **< 50:** Poor fit. Lacks fundamental requirements or relies entirely on generic buzzwords.

**Instructions:**
Analyze the resume against the job description based on the criteria above.
You MUST respond in strict JSON format. Do not include any conversational text, introductory sentences, or markdown outside of the JSON block. Use exactly these keys:
{
  "matchScore": <number between 0 and 100 based strictly on the rubric>,
  "strengths": [<array of strings highlighting matched skills well-supported by context/metrics>],
  "missingKeywords": [<array of strings highlighting critical required skills from the JD that are absent>],
  "improvementTips": [<array of strings containing highly actionable, specific advice to improve the resume for this exact role>]
}"""`;

        const activeKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
        const ai = new GoogleGenAI({ apiKey: activeKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}`,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json"
            }
        });

        const analysisData = JSON.parse(response.text);
        res.json(analysisData);

    } catch (error) {
        console.error("Resume Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze resume." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 PrepArena backend online (Gemini Edition) at http://localhost:${PORT}`);
});