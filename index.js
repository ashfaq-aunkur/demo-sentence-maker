const express = require("express");
const { Ollama } = require("ollama");

const app = express();
const PORT = process.env.PORT || 3000;

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || "http://ollama:11434",
});

app.use(express.json());

app.post("/make-sentence", async (req, res) => {
  try {
    const activityObject = req.body;

    if (!activityObject || typeof activityObject !== "object") {
      return res.status(400).json({
        error: "Request Body must be a valid JSON object"
      });
    }

    const systemPrompt = `You are a helpful assistant that converts activity log data into natural English sentences.
Rules:
- If activity_type is NOT "other":
  - Start with activity_type followed by action_type.
  - DO NOT include table_slug.
- If activity_type is "other":
  - Start with the table_slug converted to natural English words (remove any "_table" suffix and turn snake_case into readable words).
  - Then add the action_type.
- Add "by field operator user_name".
- If farmer_name exists, add "for farmer farmer_name" else dont need to add.
- End with "via source on createdAt".
- Format the date nicely (example: February 16, 2026).
- Keep the sentence short, clean, natural, grammatically correct and everything lowercase.`;

    const userMessage = `
activity_type: ${activityObject.activity_type}
action_type: ${activityObject.action_type}
table_slug: ${activityObject.table_slug || ""}
farmer_name: ${activityObject.farmer_name || ""}
user_name: ${activityObject.user_name}
created_at: ${activityObject.createdAt}
source: ${activityObject.source}
`.trim();

    const response = await ollama.chat({
      model: "qwen3:8b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      options: {
        temperature: 0
      }
    });

    const sentence = response.message.content.trim();

    res.json({
      success: true,
      sentence
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate sentence",
      message: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("Sentence Maker API is running");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});