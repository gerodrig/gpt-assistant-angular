

export const textToSpeechUseCase = async ( prompt: string, voice: string ) => {

    try {
        const response = await fetch('/api/gpt/text-to-speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: prompt, voice })
        });

        if(!response.ok) throw new Error('Error in Text to Audio Conversion');

        const audioFile = await response.blob();
        const audioFileUrl = URL.createObjectURL(audioFile);

        return {
            ok: true, 
            message: prompt,
            audioUrl: audioFileUrl
        }
    } catch (error: any) {
        console.log(error);
        return {
            ok: false,
            message: error.message || 'Error in Text to Audio Conversion',
            audiUrl: ''
        }
    }
};