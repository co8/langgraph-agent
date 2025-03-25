// LangGraph Quickstart
// "ReAct Agent" = Reason + Act Agent
// Provides Current weather in multiple questions in the same session
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
const agentTools = [new TavilySearchResults({ maxResults: 3 })];
// Define LLModel
//const agentModel = new ChatOpenAI({ temperature: 0 });
const agentModel = new ChatOllama({
  model: "mistral-nemo",
  //model: "nemotron-mini",
  //model: "llama3.2:3b",
  //model: "mistral",
  //model: "solar-pro",
  //model: "qwen2.5:14b",
  //model: "hermes3:3b",
  //model: "aya-expanse",
  //model: "smollm2",
  //model: "command-r7b",
  //model: "granite3.1-moe:3b",
  //model: "granite3.1-dense:2b",
  //temperature: 0,
  //verbose: true,
});

////////////////////////
// DEV Variables
const stateThreadId = 767848347888;
const systemPrompt =
  "you are typescript software engineer with expertise in javascript and the langgraph framework and libraries";
const firstRequest =
  "use langgraph.js to create a langgraph agent that can check the latest price the US Dollar to Euro";
const secondRequest =
  "Review and Test the code and make it easy for me to copy";
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
