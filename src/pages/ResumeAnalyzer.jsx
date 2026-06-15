import { useState } from 'react';

function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      alert("Please upload your resume PDF and paste the job description!");
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('resumeFile', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('http://localhost:5000/api/analyze-resume', {
        method: 'POST',
        body: formData 
      });

      const data = await response.json();
      
      if (response.ok) {
        setAnalysis(data);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <header className="header" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>ATS Resume Analyzer</h1>
        <p style={{ color: '#888', fontSize: '16px' }}>Upload your PDF resume and paste the target job description to get an instant match score.</p>
      </header>

      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
        
        {/* --- UPGRADED FILE UPLOAD SECTION --- */}
        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ marginBottom: '15px', color: '#eaeaea' }}>Your Resume (PDF)</h3>
          
          <div 
            style={{ 
              height: '300px', 
              border: '2px dashed #333', 
              borderRadius: '16px', 
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}
          >
            {/* We hide the ugly native input and stretch it over the div */}
            <input 
              type="file" 
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              style={{ 
                opacity: 0, 
                position: 'absolute', 
                top: 0, left: 0, width: '100%', height: '100%', 
                cursor: 'pointer' 
              }}
            />
            
            <div style={{ pointerEvents: 'none', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📄</div>
              {resumeFile ? (
                <div>
                  <p style={{ color: '#10b981', fontWeight: 'bold', margin: 0 }}>File Selected:</p>
                  <p style={{ color: '#eaeaea', marginTop: '5px' }}>{resumeFile.name}</p>
                </div>
              ) : (
                <div>
                  <p style={{ color: '#eaeaea', fontWeight: '600', margin: 0 }}>Click or Drag PDF to Upload</p>
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>Max file size 5MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- UPGRADED JOB DESCRIPTION SECTION --- */}
        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ marginBottom: '15px', color: '#eaeaea' }}>Job Description</h3>
          <textarea 
            style={{ 
              width: '100%', 
              height: '300px', 
              padding: '20px', 
              borderRadius: '16px', 
              backgroundColor: 'rgba(255, 255, 255, 0.02)', 
              color: '#eaeaea', 
              border: '1px solid #333', 
              resize: 'none',
              fontSize: '15px',
              lineHeight: '1.5',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
            placeholder="Paste the target job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      {/* --- UPGRADED BUTTON --- */}
      <button 
        onClick={handleAnalyze} 
        disabled={isLoading}
        style={{ 
          width: '100%', 
          padding: '18px', 
          fontSize: '18px',
          fontWeight: '700',
          backgroundColor: isLoading ? '#0d9467' : '#10b981', 
          color: '#000',
          border: 'none',
          borderRadius: '12px', 
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.2s ease',
          marginBottom: '40px'
        }}
        onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
      >
        {isLoading ? 'Scanning PDF & Analyzing Match...' : 'Analyze Resume'}
      </button>

      {/* --- RESULTS DASHBOARD --- */}
      {analysis && (
        <div style={{ 
          padding: '30px', 
          backgroundColor: 'rgba(16, 185, 129, 0.05)', 
          border: '1px solid rgba(16, 185, 129, 0.2)', 
          borderRadius: '20px' 
        }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', color: '#10b981', margin: '0 0 30px 0' }}>
            Match Score: {analysis.matchScore}%
          </h2>
          
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ color: '#10b981', marginTop: 0 }}>✅ Strengths</h3>
              <ul style={{ paddingLeft: '20px', color: '#eaeaea', lineHeight: '1.6' }}>
                {analysis.strengths.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
              </ul>
            </div>
            
            <div style={{ flex: '1 1 300px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ color: '#ef4444', marginTop: 0 }}>⚠️ Missing Keywords</h3>
              <ul style={{ paddingLeft: '20px', color: '#eaeaea', lineHeight: '1.6' }}>
                {analysis.missingKeywords.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '30px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ color: '#3b82f6', marginTop: 0 }}>💡 Actionable Tips</h3>
            <ul style={{ paddingLeft: '20px', color: '#eaeaea', lineHeight: '1.6' }}>
              {analysis.improvementTips.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;