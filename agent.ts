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
const agentTools = [new TavilySearchResults({ maxResults: 5 })];
// Define LLModel
//const agentModel = new ChatOpenAI({ temperature: 0 });
const agentModel = new ChatOllama({
  //model: "mistral-small",
  //model: "mistral-nemo",
  //model: "llama3.2:3b",
  //model: "mistral",
  model: "qwen2.5:14b",
  //temperature: 0,
  //verbose: true,
});

////////////////////////
// DEV Variables
const stateThreadId = "3028871487";
const systemPrompt =
  "you are a personal assistant. use tools to search the internet for realtime information. cite sources. be concise";
const firstRequest = "what was the price of $KUJI on March 1st, 2025";
const secondRequest = "translate the answer to catalá";
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
