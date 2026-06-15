import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

function Interview() {
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Welcome to your mock interview. We can start with System Design or DSA. What do you prefer?" }
    ]);
    const [currentInput, setCurrentInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isCodeMode, setIsCodeMode] = useState(false);
    const [codeContent, setCodeContent] = useState('// Write your code here...\n');

    const [isAutoPilot, setIsAutoPilot] = useState(false);
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

    const transcriptRef = useRef('');
    const autoPilotRef = useRef(false);
    const currentAudioRef = useRef(null);

    useEffect(() => {
        autoPilotRef.current = isAutoPilot;
    }, [isAutoPilot]);

    useEffect(() => {
        return () => {
            if (currentAudioRef.current) currentAudioRef.current.pause();
        };
    }, []);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser doesn't support voice input. Please try Google Chrome.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            if (currentAudioRef.current) currentAudioRef.current.pause();
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
            setCurrentInput(transcript);
            transcriptRef.current = transcript;
        };

        recognition.onend = () => {
            setIsListening(false);
            if (autoPilotRef.current && transcriptRef.current.trim() !== '') {
                handleSubmit(transcriptRef.current);
            }
        };

        recognition.onerror = () => setIsListening(false);
        recognition.start();
    };

    const handleSubmit = async (autoText = null) => {
        const finalContent = typeof autoText === 'string' ? autoText : (isCodeMode ? codeContent : currentInput);
        if (finalContent.trim() === '') return;

        const messageText = isCodeMode ? `\n\`\`\`javascript\n${finalContent}\n\`\`\`` : finalContent;
        const newUserMessage = { role: 'user', text: messageText };
        const updatedMessages = [...messages, newUserMessage];

        setMessages(updatedMessages);
        setCurrentInput('');
        transcriptRef.current = '';
        setIsLoading(true);
        try {
            // NEW: Slice the array to only keep the last 6 messages so you don't blow up the API limits!
            const optimizedHistory = updatedMessages.slice(-6);

            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: optimizedHistory }) // <-- Send the optimized history here
            });

            const data = await response.json();

            if (data.text) {
                setMessages([...updatedMessages, { role: 'ai', text: data.text }]);

                // Play the hyper-realistic audio from ElevenLabs!
                if (data.audio && isVoiceEnabled) {
                    const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
                    currentAudioRef.current = audio;
                    audio.play();

                    audio.onended = () => {
                        if (autoPilotRef.current) startListening();
                    };
                } else if (autoPilotRef.current) {
                    setTimeout(startListening, 1000);
                }

            } else {
                setMessages([...updatedMessages, { role: 'ai', text: "Sorry, I encountered an error." }]);
            }
        } catch (error) {
            console.error("Failed to connect to backend:", error);
            setMessages([...updatedMessages, { role: 'ai', text: "Error connecting to the server. Is the backend running?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAutoPilot = () => {
        if (!isAutoPilot) {
            setIsAutoPilot(true);
            startListening();
        } else {
            setIsAutoPilot(false);
            if (currentAudioRef.current) currentAudioRef.current.pause();
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1>AI Mock Interview Arena</h1>
                <p>System Design & DSA</p>
            </header>

            <main className="main-content">
                <div className="question-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2>Current Session</h2>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    setIsVoiceEnabled(!isVoiceEnabled);
                                    if (isVoiceEnabled && currentAudioRef.current) currentAudioRef.current.pause();
                                }}
                                style={{
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    backgroundColor: 'var(--bg-main)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: isVoiceEnabled ? 'var(--accent)' : 'var(--text-muted)',
                                    cursor: 'pointer'
                                }}
                            >
                                {isVoiceEnabled ? '🔊 Voice: ON' : '🔇 Voice: OFF'}
                            </button>

                            <button
                                onClick={toggleAutoPilot}
                                style={{
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    backgroundColor: isAutoPilot ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-main)',
                                    border: `1px solid ${isAutoPilot ? 'var(--accent)' : 'var(--border-color)'}`,
                                    borderRadius: '6px',
                                    color: isAutoPilot ? 'var(--accent)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontWeight: isAutoPilot ? 'bold' : 'normal',
                                    animation: isAutoPilot ? 'pulse 2s infinite' : 'none'
                                }}
                            >
                                {isAutoPilot ? '🟢 Auto-Pilot: ON' : '⚪ Auto-Pilot: OFF'}
                            </button>

                            <button
                                onClick={() => setIsCodeMode(!isCodeMode)}
                                style={{
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    backgroundColor: 'var(--bg-main)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-main)',
                                    cursor: 'pointer'
                                }}
                            >
                                {isCodeMode ? 'Switch to Text Mode' : 'Switch to Code Mode 💻'}
                            </button>
                        </div>
                    </div>
                    <p>Click "Auto-Pilot" to start a continuous, hands-free conversation with the AI.</p>
                </div>

                <div className="chat-panel">
                    <div className="chat-history">
                        {messages.map((msg, index) => (
                            <p key={index} className={msg.role === 'ai' ? 'ai-msg' : 'user-msg'} style={{ whiteSpace: 'pre-wrap' }}>
                                <strong>{msg.role === 'ai' ? 'Interviewer: ' : 'You: '}</strong>
                                {msg.text}
                            </p>
                        ))}
                        {isLoading && <p className="ai-msg"><em>Interviewer is thinking...</em></p>}
                    </div>

                    <div className="input-area">
                        {isCodeMode ? (
                            <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                                <Editor
                                    height="200px"
                                    defaultLanguage="javascript"
                                    theme="vs-dark"
                                    value={codeContent}
                                    onChange={(value) => setCodeContent(value)}
                                    options={{ minimap: { enabled: false }, fontSize: 14 }}
                                />
                            </div>
                        ) : (
                            <textarea
                                placeholder={isAutoPilot ? "Listening automatically..." : "Type or speak your answer here..."}
                                value={currentInput}
                                onChange={(e) => setCurrentInput(e.target.value)}
                                disabled={isLoading || isListening || isAutoPilot}
                            ></textarea>
                        )}

                        <div className="button-group">
                            {!isCodeMode && !isAutoPilot && (
                                <button
                                    className={`btn-mic ${isListening ? 'listening' : ''}`}
                                    onClick={startListening}
                                    disabled={isLoading || isListening}
                                    title="Click to speak"
                                >
                                    {isListening ? "🎙️" : "🎙️"}
                                </button>
                            )}
                            {!isAutoPilot && (
                                <button
                                    className="btn-submit"
                                    onClick={() => handleSubmit()}
                                    disabled={isLoading || isListening}
                                >
                                    {isLoading ? "Sending..." : "Submit Answer"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Interview;