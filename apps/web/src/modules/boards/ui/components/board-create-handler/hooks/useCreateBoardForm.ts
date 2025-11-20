import type { CreateBoardDTO } from "@/modules/boards/services/create-board";

import { useForm } from "react-hook-form";

type Props = {
   onSubmit: (data: CreateBoardDTO) => void;
};
export function useCreateBoardForm({ onSubmit }: Props) {
   const { control, handleSubmit, setValue, watch } = useForm<CreateBoardDTO>({
      defaultValues: {
         description: "",
         name: "",
         stages: ["Backlog", "In Progress", "Done"],
      },
      mode: "onChange",
   });
   const stages = watch("stages");
   function addStage(stageName: string) {
      setValue("stages", [...(control._formValues.stages || []), stageName]);
   }

   function removeStage(stageName: string) {
      if (!stages) return;
      const updatedStages = stages.filter((stage) => stage !== stageName);
      setValue("stages", updatedStages);
   }

   return {
      stages,
      control,
      addStage,
      removeStage,
      onSubmit: handleSubmit(onSubmit),
   };
}
