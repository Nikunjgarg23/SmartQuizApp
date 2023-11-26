import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }
  ,{role:"assistant",content:"What can I do for you today?"},
  {role:"user",content:"compare two answers provide me a score on a value ranges from 0 to 10"},
  {role:"assistant",content:"Ok! give me Answer1 "},
  {role:"user",content:"Ram is a good boy"},
  {role:"assistant",content:" give me Answer2 "},
  {role:"user",content:"ram is fine boy"},
  {role:"usre",content:"now compare give me a score"},
],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();