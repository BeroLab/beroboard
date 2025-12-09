import { useForm } from "react-hook-form";
import type { CreateProjectDTO } from "@/modules/projects/services/create-project/types";

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
