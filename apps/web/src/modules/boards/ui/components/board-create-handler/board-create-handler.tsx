import { useCreateBoard, type CreateBoardDTO } from "@/modules/boards/services/create-board";
import { useCreateBoardForm } from "./hooks/useCreateBoardForm";
import type { BoardCreateHandlerProps } from "./types";

import { FormInput } from "@/shared/components/form-input";

import { modalManager } from "@/shared/services/modal-manager";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Label } from "@/shared/components/ui/label";
import { X } from "lucide-react";

export function BoardCreateHandler({ projectID }: BoardCreateHandlerProps) {
   const { createBoard, isPending } = useCreateBoard({
      onSuccess: () => {
         modalManager.hide();
      },
      onError: () => {},
   });
   const { control, onSubmit, stages, addStage, removeStage } = useCreateBoardForm({
      onSubmit: handleCreateBoard,
   });

   function handleCreateBoard(data: CreateBoardDTO) {
      createBoard({
         ...data,
         projectId: projectID,
      });
   }

   return (
      <form
         onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSubmit();
         }}
      >
         <div className="grid gap-4">
            <FormInput control={control} name="name" label="Nome:" />
            <FormInput control={control} name="description" label="Descrição:" />
            <div className="grid gap-3">
               <Label>Estágios</Label>
               <Input
                  onKeyDown={(e) => {
                     if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                        e.preventDefault();
                        console.log("Enter pressionado");
                        addStage(e.currentTarget.value);
                     }
                  }}
               />
               <p className="text-sm text-gray-500">Pressione enter para adicionar mais estágios. Você pode editar os estágios mais tarde.</p>
            </div>

            <div className="flex flex-row gap-2 mt-2 flex-wrap">
               {stages?.map((stage, index) => (
                  <Badge variant={"secondary"} key={`${stage}-${String(index)}`} title={stage}>
                     {stage}
                     <button type="button" className="cursor-pointer" onClick={() => removeStage(stage)}>
                        <X size={10} />
                     </button>
                  </Badge>
               ))}
            </div>
         </div>

         <div className="mt-4 flex w-full flex-row justify-end gap-3">
            <Button variant={"outline"}>Cancelar</Button>
            <Button type="submit">Criar</Button>
         </div>
      </form>
   );
}
