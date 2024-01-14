import { GrammarCheckerResponse } from '@interfaces/index';


export const grammarCheckerUseCase = async (prompt: string) => {


    try {
        const response = await fetch('/api/gpt/grammar-checker', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('Grammar correction failed.');
        }

        const data = await response.json() as GrammarCheckerResponse;

        return {
            ok: true,
            ...data
        }


    } catch (error: any) {
        console.log(error);
        return {
            ok: false,
            message: error.message ?? 'Grammar correction failed.'
        }
    }
};