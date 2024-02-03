import { QuestionResponse } from '../../interfaces/question.reponse';
export const postQuestionUseCase = async (
  threadId: string,
  question: string,
) => {
  try {
    const response = await fetch('/api/sd-assistant/user-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threadId, question }),
    });

    const replies = (await response.json()) as QuestionResponse[];

    return replies;
  } catch (error) {
    throw new Error('Error creating thread id');
  }
};
