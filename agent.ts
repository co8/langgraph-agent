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
  model: "mistral-small",
  //model: "mistral-nemo",
  //model: "llama3.2:3b",
  //model: "mistral",
  //model: "qwen2.5:14b",
  //temperature: 0,
  //verbose: true,
});

////////////////////////
// DEV Variables
const stateThreadId = "28877148878787";
const systemPrompt =
  "you are a copywriter and can use the internet to research and get to know the client you're writing about";
const firstRequest =
  "write me a short headline and body copy for an email for a happy hour at Jett Thompson Home. Highlight their store offering, the new design studio, and last projects in their portfolio";
const secondRequest = "make it shorter and more sophisticated";
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
