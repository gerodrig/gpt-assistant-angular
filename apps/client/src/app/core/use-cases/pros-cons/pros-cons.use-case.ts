import { ProsConsResponse } from '@interfaces/index';

export const prosConsUseCase = async (prompt: string) => {

    try {
        const response = await fetch('/api/gpt/pros-cons-evaluator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('Pros and cons evaluation failed.');
        }

        const data = await response.json() as ProsConsResponse;

        return {
            ok: true,
            ...data
        }


    } catch (error: any) {
        console.log(error);
        return {
            ok: false,
            message: error.message ?? 'Pros and cons evaluation failed.'
        }
    }
};