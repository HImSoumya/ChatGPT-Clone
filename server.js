const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require("cors");

const configuration = new Configuration({
  organization: "org-EC31zl1F0uplwW83TaZK7e7I",
  apiKey: "Enter your Open AI API Key",
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.json());
app.use(cors());
const port = 8082;

app.post("/", async (req, res) => {
  const { message, currentModel } = req.body;
  console.log(message, currentModel);
  const response = await openai.createCompletion({
    model: `${currentModel}`,
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5,
  });

  res.json({
    message: response.data.choices[0].text,
  });
});

app.get("/models", async (req, res) => {
  const response = await openai.listEngines();
  console.log(response.data.data);
  res.json({
    models: response.data.data,
  });
});

app.listen(port, () => {
  console.log(`Node server started at post http://localhost:${port}`);
});
