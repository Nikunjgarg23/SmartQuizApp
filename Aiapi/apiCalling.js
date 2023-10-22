import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "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",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();
console.log("response:", JSON.stringify(response));