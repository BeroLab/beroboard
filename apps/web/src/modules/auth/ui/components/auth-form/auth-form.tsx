import { FormInput, FormInputSecurity } from "@/shared/components/form-input";
import { Button } from "@/shared/components/ui/button";
import type { AuthFormProps, FormSchemaConstraints } from "./types";

export function AuthForm<FormSchema extends FormSchemaConstraints>({ fields, loadingSubmit, onSubmit, control, buttonText }: AuthFormProps<FormSchema>) {
   return (
      <form
         className="flex min-w-[350px] flex-col gap-3"
         onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSubmit();
         }}
      >
         {fields.map((field, index) =>
            field.type === "security" ? (
               <FormInputSecurity key={String(index)} {...field.props} control={control} />
            ) : (
               <FormInput key={String(index)} {...field.props} control={control} />
            ),
         )}
         <div className="w-full">
            <Button className="w-full" type="submit">
               {loadingSubmit ? "Carregando..." : buttonText}
            </Button>
         </div>
      </form>
   );
}
