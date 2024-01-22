import { TranslateResponse } from '../../../interfaces/';


export const translateTextUseCase = async (prompt: string, language: string) => {
    try {
        const response = await fetch('/api/gpt/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, language })
        });
        
        if (!response.ok) {
            throw new Error('Something went wrong while translating the text.');
        }

        const data = await response.json() as TranslateResponse; 

        return {
            ok: true,
            ...data
        }
        
    } catch (error: any) {
        return {
            ok: false,
            message: error.message || 'Something went wrong while translating the text.'
        }
    }
}