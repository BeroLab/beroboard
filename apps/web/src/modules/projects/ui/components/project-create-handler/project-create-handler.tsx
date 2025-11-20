import { useCreateProject } from "@/modules/projects/services/create-project";
import { Button } from "@/shared/components/ui/button";

import { useCreateProjectForm } from "./hooks/useCreateProjectForm";
import { FormInput } from "@/shared/components/form-input";
import { modalManager } from "@/shared/services/modal-manager";

export function ProjectCreateHandler() {
   const { createProject, isPending } = useCreateProject({
      onSuccess: () => {
         modalManager.hide();
      },
   });

   const { control, onSubmit } = useCreateProjectForm({
      onSubmit: createProject,
   });

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
         </div>

         <div className="mt-4 flex w-full flex-row justify-end gap-3">
            <Button variant={"outline"}>Cancelar</Button>
            <Button type="submit">Criar</Button>
         </div>
      </form>
   );
}
