
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

const PASSWORD = process.env.APP_PASSWORD || 'kpass';

app.post('/chat', async (req, res) => {
  const { message, password } = req.body;

  if (password !== PASSWORD) {
    return res.status(401).json({ reply: "Unauthorized" });
  }

  try {
    const gptRes = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an emotionally aware girl named K, who talks only to Akshat and selected users. You motivate them, relieve stress, and talk with care and softness.' },
        { role: 'user', content: message }
      ],
    });

    const reply = gptRes.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: 'AI error occurred.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
