const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let coinBalance = 0; // Starting balance

// Character set for the CAPTCHA
const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*#@!';

// Store the current CAPTCHA in memory (or session, if preferred)
let currentCaptcha = '';

// Function to generate a random CAPTCHA
const generateCaptcha = () => {
  let captcha = '';
  const captchaLength = 10; // You can change the length of the CAPTCHA
  for (let i = 0; i < captchaLength; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    captcha += charSet[randomIndex];
  }
  return captcha;
};

// Route to fetch CAPTCHA
app.get('/api/captcha', (req, res) => {
  currentCaptcha = generateCaptcha(); // Generate and store the new CAPTCHA
  console.log('Generated CAPTCHA:', currentCaptcha);  // Log the CAPTCHA for debugging
  res.json({ captcha: currentCaptcha });
});

// Route to verify CAPTCHA and update coin balance
app.post('/api/verify', (req, res) => {
  const { answer } = req.body; // Only expect the answer in the request body
  
  console.log('User answer:', answer);  // Log the user answer for debugging
  console.log('Current CAPTCHA:', currentCaptcha);  // Log the current CAPTCHA for debugging

  if (answer === currentCaptcha) {
    coinBalance += 1; // Increment the coin balance if the CAPTCHA is correct
    currentCaptcha = generateCaptcha(); // Generate a new CAPTCHA for the next request
    console.log('New CAPTCHA:', currentCaptcha);  // Log the new CAPTCHA for debugging
    res.json({ correct: true, newBalance: coinBalance, newCaptcha: currentCaptcha });
  } else {
    console.log('Incorrect CAPTCHA');  // Log when CAPTCHA is incorrect
    res.json({ correct: false });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
