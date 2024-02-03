type GeneratedImage = Image | null;

type Image = {
  url: string;
  alt: string;
};

export const imageVariationUseCase = async (
  originalImage: string,
): Promise<GeneratedImage> => {
  try {
    const response = await fetch('/api/gpt/image-variation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ baseImage: originalImage }),
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
