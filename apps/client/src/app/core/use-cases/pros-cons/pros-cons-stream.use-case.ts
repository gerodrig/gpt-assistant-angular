import { ProsConsResponse } from '@interfaces/index';
export async function* prosConsStreamUseCase(prompt: string, abortSignal: AbortSignal) {

    try {
        const response = await fetch('/api/gpt/pros-cons-evaluator-stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt }),
            signal: abortSignal
        });

        if (!response.ok) {
            throw new Error('Pros and cons evaluation failed.');
        }

        const reader = response.body?.getReader();

        if (!reader) {
            throw new Error('Pros and cons evaluation failed.');
        }

        const decoder = new TextDecoder();
        let text = '';

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }
            const decodedChunk = decoder.decode(value, { stream: true });
            text += decodedChunk;
            yield text;
        }

        return text;

    } catch (error: any) {
        console.log(error);
        return null;
    }
};