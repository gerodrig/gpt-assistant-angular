type Options = {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
};

type GeneratedImage = Image | null;

type Image = {
  url: string;
  alt: string;
};

export const imageGenerationUseCase = async ({
  prompt,
  originalImage,
  maskImage,
}: Options): Promise<GeneratedImage> => {
  try {
    const response = await fetch('/api/gpt/image-generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, originalImage, maskImage }),
    });

    const { ok, url, revised_prompt: alt } = await response.json();
    if (!ok) throw new Error('Error in Image Generation');

    return {
      url,
      alt,
    };

  } catch (error) {
    console.log(error);
    return null;
  }
};
