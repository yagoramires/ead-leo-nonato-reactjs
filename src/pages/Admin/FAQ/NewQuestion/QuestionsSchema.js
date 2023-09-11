import { z } from 'zod';

export const QuestionsSchema = z.object({
  order: z.number().min(1, 'Digite uma posição válida.'),
  question: z.string().min(10, 'Digite uma pergunta válida.'),
  answer: z.string().min(10, 'Digite uma resposta válida.'),
});
