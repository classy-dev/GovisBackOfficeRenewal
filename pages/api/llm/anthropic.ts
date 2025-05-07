import Anthropic from '@anthropic-ai/sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system, stream, isVoiceMode } = req.body;

    const modelConfig = isVoiceMode
      ? {
          model: 'claude-3-haiku-20240307',
          max_tokens: 2048,
          temperature: 0.7,
        }
      : {
          model: 'claude-3-5-haiku-latest',
          // model: 'claude-3-haiku-20240307',
          max_tokens: 8096,
        };

    if (stream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      const stream = await anthropic.messages.stream({
        messages,
        system,
        ...modelConfig,
      });

      // eslint-disable-next-line no-restricted-syntax
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
      }

      res.end();
    } else {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-haiku-latest',
        // model: 'claude-3-5-sonnet-20240620',
        max_tokens: 8096,
        system,
        messages,
      });

      res.status(200).json(response);
    }
  } catch (error) {
    console.error('Anthropic API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
