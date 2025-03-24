// agent.ts
// modified from https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/

// load env variables
import * as dotenv from "dotenv";
dotenv.config();

process.env.TAVILY_API_KEY;
process.env.LANGSMITH_PROJECT;
process.env.LANGSMITH_API_KEY;
process.env.LANGSMITH_TRACING;
process.env.LANGSMITH_ENDPOINT;

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
//import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

// Define the tools for the agent to use
const agentTools = [new TavilySearchResults({ maxResults: 1 })];
// Define LLModel
//const agentModel = new ChatOpenAI({ temperature: 0 });
const agentModel = new ChatOllama({
  //model: "llama3.2:3b",
  model: "mistral",
  //model: "phi4-mini",
  temperature: 0,
  //verbose: true,
});

const stateThreadId = 4834495747888;

const systemPrompt =
  "Use available tools to access the internet for each request. Present the answer for command line in a formatted list with fun emojis for each location in local measurements. Do not provide anything additional or sources. Here's an API key if needed, OPEN_WEATHER_API_KEY=" +
  process.env.OPEN_WEATHER_API_KEY;

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  checkpointSaver: agentCheckpointer,
  prompt: systemPrompt,
});

// Now it's time to use!
const agentFinalState = await agent.invoke(
  {
    messages: [
      new HumanMessage(
        "what is the current time, date, and weather in sabadell spain 08203"
      ),
    ],
  },
  { configurable: { thread_id: stateThreadId } }
);

console.log(
  agentFinalState.messages[agentFinalState.messages.length - 1].content + "\n"
);

const agentNextState = await agent.invoke(
  {
    messages: [
      new HumanMessage(
        "how about dana point california 92629? Use Open Weather to get realtime data"
      ),
    ],
  },
  { configurable: { thread_id: stateThreadId } }
);

console.log(
  agentNextState.messages[agentNextState.messages.length - 1].content + "\n"
);
