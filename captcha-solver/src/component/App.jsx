import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [captcha, setCaptcha] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [coinBalance, setCoinBalance] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    getNewCaptcha();
  }, []);

  const getNewCaptcha = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/captcha');
      setCaptcha(response.data.captcha);
    } catch (error) {
      console.error('Error fetching CAPTCHA:', error);
    }
  };

  const handleSkip = () => {
    setSkippedCount(skippedCount + 1);
    getNewCaptcha();
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify', {
        answer: userAnswer,
      });
      if (response.data.correct) {
        setCorrectCount(correctCount + 1);
        setCoinBalance(response.data.newBalance);
      } else {
        setWrongCount(wrongCount + 1);
        alert('Incorrect CAPTCHA. Try again!');
      }
      setUserAnswer('');
      getNewCaptcha();
    } catch (error) {
      console.error('Error verifying CAPTCHA:', error);
    }
  };

  return (
    <div className="App">
      <p>Coin Balance: {coinBalance}</p>
      
      <div className="captcha-container">
        {captcha}
      </div>
      <div>
      <h3 style={{ color: "red" }}>All Words are case sensitive</h3>

      </div>

      <div className="input-container">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter CAPTCHA"
        />
        <button className="skip-button" onClick={handleSkip}>Skip</button>
      </div>

      <button onClick={handleSubmit}>Submit</button>

      <div className="stats-container">
        <div className="stat-box">
          <span className="symbol">⏩</span> {skippedCount}
        </div>
        <div className="stat-box">
          <span className="symbol">❌</span> {wrongCount}
        </div>
        <div className="stat-box">
          <span className="symbol">✅</span> {correctCount}
        </div>
      </div>
      <button className='refer-btn'>Refer & Earn</button>
    </div>
  );
}

export default App;
