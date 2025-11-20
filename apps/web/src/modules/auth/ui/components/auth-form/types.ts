import type { FormInputProps, FormInputSecurityProps } from "@/shared/components/form-input";
import type { Control } from "react-hook-form";

export type FormSchemaConstraints = {
   email: string;
   password: string;
};

export type AuthFormFields<FormSchema extends FormSchemaConstraints> = {
   type: "security" | "default";
   props: FormInputProps<FormSchema> | FormInputSecurityProps<FormSchema>;
};

export type AuthFormProps<FormSchema extends FormSchemaConstraints> = {
   onSubmit: () => void;
   loadingSubmit: boolean;
   buttonText: string;
   control: Control<FormSchema>;
   fields: AuthFormFields<FormSchema>[];
};
