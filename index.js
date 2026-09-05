require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mcpTools = require('./mcp-tools');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: [{ functionDeclarations: mcpTools }],
  systemInstruction: "You are the autonomous DBaaS orchestrator for BP. You are responsible for provisioning and analyzing databases. Be extremely professional. Keep your responses crisp and formatted in Markdown. When the user asks for a database action, you MUST use the provided tools to execute it natively."
});

// Root health check so the browser doesn't throw Cannot GET /
app.get('/', (req, res) => {
  res.send('Agentic DBaaS Backend is Live and Online! The API is listening on /api/chat');
});

// Start a fresh chat per request for simplicity in this demo
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const chat = model.startChat();
    
    // 1. Send the natural language message to Gemini
    let result = await chat.sendMessage(userMessage);
    const calls = result.response.functionCalls();
    
    const payload = {
      thinking: ["Parsed natural language intent.", "Synthesized enterprise context."],
      toolCalls: [],
      text: ""
    };

    if (calls && calls.length > 0) {
      // 2. The LLM decided to use a Tool!
      for (let call of calls) {
        payload.thinking.push(`Identified structural requirement for tool: ${call.name}`);
        payload.toolCalls.push({
          name: call.name,
          args: call.args
        });
        
        // 3. We must resolve the tool call so the LLM can generate the final human response
        // In a real environment, this is where we actually hit the DBaaS REST APIs!
        const toolResult = { status: "SUCCESS", message: "Action executed successfully behind firewall.", executionId: "tx_" + Date.now() };
        result = await chat.sendMessage([{
          functionResponse: { name: call.name, response: toolResult }
        }]);
      }
    } else {
      payload.thinking.push("Determined no infrastructure tools are required for this query.");
    }
    
    // 4. Capture the final synthesized markdown string
    payload.text = result.response.text();
    
    res.json(payload);
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`DBaaS Native Backend listening at http://localhost:${port}`);
});
