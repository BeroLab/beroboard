import { useForm } from "@tanstack/react-form";
import { useCreateProject } from "@/modules/projects/services/create-project";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { ProjectCreateHandlerProps } from "./types";

export function ProjectCreateHandler({ open, onOpenChange }: ProjectCreateHandlerProps) {
   const { createProject, isPending } = useCreateProject({
      onSuccess: () => {},
   });
   const form = useForm({
      defaultValues: {
         name: "",
         description: "",
      },
      onSubmit: ({ value }) => {
         createProject({
            description: value.description,
            name: value.name,
         });
      },
   });
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <form
            onSubmit={(e) => {
               e.preventDefault();
               e.stopPropagation();
               form.handleSubmit();
            }}
         >
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                  <DialogTitle>Criar projeto</DialogTitle>
               </DialogHeader>
               <div className="grid gap-4">
                  <form.Field
                     name="name"
                     validators={{
                        onChange: ({ value }) => (!value ? "O nome é obrigatório" : value.length < 3 ? "O nome deve ter pelo menos 3 caracteres" : undefined),
                     }}
                     children={(field) => (
                        <div className="grid gap-3">
                           <Label htmlFor={field.name}>Nome:</Label>
                           <Input id={field.name} name={field.name} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                     )}
                  />

                  <form.Field
                     name="description"
                     children={(field) => (
                        <div className="grid gap-3">
                           <Label htmlFor={field.name}>Descrição:</Label>
                           <Input id={field.name} name={field.name} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                     )}
                  />
               </div>
               <DialogFooter>
                  <DialogClose asChild>
                     <Button variant="outline">Cancel</Button>
                  </DialogClose>

                  <Button type="submit">Criar</Button>
               </DialogFooter>
            </DialogContent>
         </form>
      </Dialog>
   );
}
