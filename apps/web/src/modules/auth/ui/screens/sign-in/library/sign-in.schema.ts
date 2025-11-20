import { z } from "zod";

export const signInSchema = z.object({
   email: z.email({ error: "Email inválido." }),

   password: z.string({ error: "Campo vazio." }),
});

export type SignInSchema = z.infer<typeof signInSchema>;
