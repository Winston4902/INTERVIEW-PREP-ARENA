# Interview Prep Arena

A comprehensive web application designed to help software engineers prepare for technical interviews with AI-powered mock interviews and resume analysis. Features real-time voice input, code editing, and intelligent feedback powered by Google Gemini AI.

## 🎯 Features

### 1. **AI Mock Interview**
- **Realistic Interview Experience**: Conduct mock interviews focused on Data Structures & Algorithms (DSA) and System Design
- **Voice Input**: Speak your answers naturally with Web Speech API integration
- **Code Editor**: Write and test your code solutions with Monaco Editor
- **Auto-Pilot Mode**: Let the AI guide you through the interview seamlessly
- **Interactive Dialogue**: Get follow-up questions and hints to improve your solutions
- **Feedback Loop**: Receive structured feedback on your performance, including optimal solutions

### 2. **ATS Resume Analyzer**
- **Resume Upload**: Upload your resume as a PDF
- **Job Description Matching**: Paste job descriptions to analyze compatibility
- **Match Score**: Get instant insights on how well your resume aligns with the job
- **AI-Powered Analysis**: Uses advanced AI to provide detailed recommendations

## 💻 Tech Stack

### Frontend
- **React** 19.2.5 - UI framework
- **Vite** 8.0.10 - Fast build tool
- **React Router** 7.15.0 - Client-side routing
- **Monaco Editor** 4.7.0 - Code editor component
- **Google GenAI SDK** 1.52.0 - AI integration

### Backend
- **Express** 5.2.1 - Web server framework
- **Google GenAI SDK** 1.52.0 - AI API integration
- **OpenAI SDK** 6.37.0 - Alternative AI provider
- **Multer** 2.1.1 - File upload handling
- **pdf-parse** 2.4.5 - PDF parsing
- **pdf2json** 4.0.3 - PDF to JSON conversion
- **CORS** 2.8.6 - Cross-origin resource sharing
- **dotenv** 17.4.2 - Environment variable management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API keys (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interview-prep-arena
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd interview-backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the `interview-backend` directory:
   ```env
   GEMINI_API_KEY_1=your_api_key_1
   GEMINI_API_KEY_2=your_api_key_2
   GEMINI_API_KEY_3=your_api_key_3
   ```

### Running the Application

1. **Start the backend server** (from `interview-backend` directory)
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

2. **Start the frontend development server** (from root directory)
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
interview-prep-arena/
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Navigation component
│   ├── pages/
│   │   ├── Interview.jsx       # Mock interview page
│   │   └── ResumeAnalyzer.jsx  # Resume analyzer page
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── interview-backend/
│   ├── server.js               # Express server
│   ├── package.json
│   └── .env                    # API keys (not in repo)
├── public/
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## 🎓 How to Use

### Mock Interview
1. Navigate to the Interview page
2. Choose your interview focus: DSA, System Design, or mixed
3. Select your target seniority level
4. Answer questions using text or voice input
5. Use the code editor for algorithm solutions
6. Enable Auto-Pilot for guided learning
7. Receive detailed feedback after each problem

### Resume Analyzer
1. Navigate to the Resume Analyzer page
2. Upload your resume (PDF format)
3. Paste the job description you're applying for
4. Click "Analyze"
5. Review the match score and recommendations

## 🔑 API Endpoints

### Backend Routes
- `POST /api/analyze-resume` - Analyze resume against job description
- Mock interview conversations handled via WebSocket or HTTP endpoints (see server.js for details)

## 🔒 Security Notes

- API keys are stored in `.env` and should never be committed to version control
- The application implements API key rotation for resilience
- Always use environment variables for sensitive data

## 📝 Features in Detail

### Interview System
- **Interview Modes**: DSA problems, System Design, or mixed
- **Seniority Levels**: Intern, Junior, Mid-level, Senior
- **Problem Diversity**: Avoids repeating questions and rotates between topics
- **Hints System**: Progressive hints to guide without spoon-feeding
- **Complexity Analysis**: Requires Big O time and space complexity analysis
- **Voice Output**: AI responses can be spoken aloud (browser audio support required)

### Resume Analyzer
- **PDF Support**: Handles PDF resume uploads
- **ATS Optimization**: Checks for ATS compatibility
- **Keyword Matching**: Analyzes keyword match between resume and job description
- **Detailed Feedback**: Provides actionable recommendations for improvement

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Quality
- ESLint configured for React and React Hooks
- ES Module support throughout

## 📦 Browser Support

- Chrome/Chromium (recommended for Web Speech API)
- Firefox
- Safari
- Edge

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 🙋 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## 🎉 Acknowledgments

- Google Gemini AI for powering the mock interview system
- Monaco Editor for the code editing experience
- Express.js community for the backend framework
- React community for the frontend framework

---

**Happy interviewing! Good luck with your technical interview preparation!** 🚀
