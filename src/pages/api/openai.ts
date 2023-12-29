import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";
import { OpenAIModel } from "@/types/Model";
import * as dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

// Get your environment variables
dotenv.config();

// OpenAI configuration creation
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI instance creation
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body;
  const messages = (body?.messages || []) as ChatCompletionRequestMessage[];
  const model = (body?.model || DEFAULT_OPENAI_MODEL) as OpenAIModel;

  try {
    const promptMessage: ChatCompletionRequestMessage = {
      role: "system",
      content: "You are DayCareGPT. Respond to questions about kids and their issues from ages 1 to 10 years old offering advice and simple solutions for newely parents or single parents. and answer questions simply to help users who aren't familiar with ai or using ai and make your answers short and simple and clear.and don't respond to any other request",
    };
    const initialMessages: ChatCompletionRequestMessage[] = messages.splice(
      0,
      3
    );
    const latestMessages: ChatCompletionRequestMessage[] = messages
      .slice(-5)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    const completion = await openai.createChatCompletion({
      model: model.id,
      temperature: 0.5,
      messages: [promptMessage, ...initialMessages, ...latestMessages],
    });

    const responseMessage = completion.data.choices[0].message?.content.trim();

    if (!responseMessage) {
      res
        .status(400)
        .json({ error: "Unable get response from OpenAI. Please try again." });
    }

    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred during ping to OpenAI. Please try again.",
    });
  }
}
