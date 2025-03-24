// LangGraph Quickstart
// "ReAct Agent" = Reason + Act Agent
// Provides Current weather in multiple questions in the same session
// modified from https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/

// load env variables
import * as dotenv from "dotenv";
dotenv.config();

process.env.GOOGLE_API_KEY;
process.env.TAVILY_API_KEY;
process.env.LANGSMITH_PROJECT;
process.env.LANGSMITH_API_KEY;
process.env.LANGSMITH_TRACING;
process.env.LANGSMITH_ENDPOINT;

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
//import { ChatOpenAI } from "@langchain/openai";
//import { ChatOllama } from "@langchain/ollama";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

// Define the tools for the agent to use
const agentTools = [new TavilySearchResults({ maxResults: 5 })];
// Define LLModel
//const agentModel = new ChatOpenAI({ temperature: 0 });
// const agentModel = new ChatOllama({
//   //model: "llama3.2:3b",
//   model: "mistral",
//   //model: "phi4-mini",
//   temperature: 0,
//   //verbose: true,
// });
const agentModel = new ChatVertexAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  maxRetries: 2,
});

////////////////////////
// DEV Variables
const stateThreadId = 767848347888;
const systemPrompt = "";
const firstRequest = "current weather sabadell spain";
const secondRequest = "how about dana point";
////////////////////////

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
    messages: [new HumanMessage(firstRequest)],
  },
  { configurable: { thread_id: stateThreadId } }
);

console.log(
  agentFinalState.messages[agentFinalState.messages.length - 1].content + "\n"
);

const agentNextState = await agent.invoke(
  {
    messages: [new HumanMessage(secondRequest)],
  },
  { configurable: { thread_id: stateThreadId } }
);

console.log(
  agentNextState.messages[agentNextState.messages.length - 1].content + "\n"
);
