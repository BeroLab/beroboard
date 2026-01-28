"use client";

import { useQuery } from "@tanstack/react-query";
import type { User } from "@/lib/types";
import { boardKeys } from "./keys";

// TODO: Implementar endpoint GET /members no backend
// O endpoint deve retornar os usuários de uma organização
// Quando implementado, descomentar o código abaixo e remover o mock

export function useMembers(organizationId: string) {
	return useQuery({
		queryKey: boardKeys.members(organizationId),
		queryFn: async (): Promise<User[]> => {
			// Retorna array vazio até o backend ser implementado
			return [];

			// Implementação real (descomentar quando backend estiver pronto):
			// const { data, error } = await api.members.get({
			// 	query: { organizationId },
			// });
			//
			// if (error) {
			// 	throw new Error("Failed to fetch members");
			// }
			//
			// return (data ?? []) as User[];
		},
		enabled: !!organizationId,
	});
}
