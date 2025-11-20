import { z } from "zod";

export const signUpSchema = z.object({
   name: z.string({ error: "Campo vázio." }),
   email: z.email({ error: "Email invalido." }),
   password: z.string({ error: "Campo vázio." }).min(5, "Senha muito curta."),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
