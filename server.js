// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

// OpenAI API key from environment variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Shared secret to validate Roblox requests
const SHARED_SECRET = process.env.ROBLOX_SHARED_SECRET || "secret123";

// Route for AI
app.post("/chat", async (req, res) => {
  if (req.headers["x-roblox-secret"] !== SHARED_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const messages = req.body.messages;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI error" });
  }
});

// Test route
app.get("/", (req, res) => res.json({ ok: true, service: "roblox-openai-proxy" }));

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
