import { SpeechToTextResponse } from "../../../interfaces";

export const speechToTextUseCase = async (audioFile: File, prompt?: string) => {


    try {
        const formData = new FormData();
        formData.append('file', audioFile);

        if (prompt) {
            formData.append('prompt', prompt);
        }

        const response = await fetch('/api/gpt/speech-to-text', {
            method: 'POST',
            body: formData
        });

        const data = (await response.json()) as SpeechToTextResponse;

        return data;
        
    } catch (error) {
        console.log(error);
        return null;
    }
};