// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { apiKey, model, messages, max_tokens } = req.body;
    
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model,
      messages,
      max_tokens
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error forwarding request to Anthropic:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'An error occurred' }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});