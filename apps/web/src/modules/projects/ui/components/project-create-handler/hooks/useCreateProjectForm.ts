import type { CreateProjectDTO } from "@/modules/projects/services/create-project/types";
import { useForm } from "react-hook-form";
type Props = {
   onSubmit: (data: CreateProjectDTO) => void;
};
export function useCreateProjectForm({ onSubmit }: Props) {
   const { control, handleSubmit } = useForm<CreateProjectDTO>({
      defaultValues: {
         description: "",
         name: "",
      },
      mode: "onChange",
   });

   return {
      control,
      onSubmit: handleSubmit(onSubmit),
   };
}
