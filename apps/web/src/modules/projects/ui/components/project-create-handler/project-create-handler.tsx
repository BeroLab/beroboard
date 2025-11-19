import { useForm } from "react-hook-form";
import { useCreateProject } from "@/modules/projects/services/create-project";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";

import type { ProjectCreateHandlerProps } from "./types";
import { useCreateProjectForm } from "./hooks/useCreateProjectForm";
import { FormInput } from "@/shared/components/form-input";

export function ProjectCreateHandler({ open, onOpenChange }: ProjectCreateHandlerProps) {
   const { createProject, isPending } = useCreateProject({
      onSuccess: () => {
        onOpenChange(false);
      },
   });

   const { control, onSubmit } = useCreateProjectForm({
      onSubmit: createProject,
   });

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <form
            onSubmit={(e) => {
               console.log("SUBMIT");
               e.preventDefault();
               e.stopPropagation();
               onSubmit();
            }}
         >
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                  <DialogTitle>Criar projeto</DialogTitle>
               </DialogHeader>
               <div className="grid gap-4">
                  <FormInput control={control} name="name" label="Nome:" />
                  <FormInput control={control} name="description" label="Descrição:" />
               </div>
               <DialogFooter>
                  <DialogClose asChild>
                     <Button variant="outline">Cancel</Button>
                  </DialogClose>

                  <Button  onClick={onSubmit}>Criar</Button>
               </DialogFooter>
            </DialogContent>
         </form>
      </Dialog>
   );
}
