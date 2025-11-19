import React from "react";

import { Controller } from "react-hook-form";
import type { FieldValues, UseControllerProps } from "react-hook-form";

import { Label } from "../ui/label";
import { Input } from "../ui/input";

export type FormInputProps<TFieldValue extends FieldValues> = {
   label: string;
} & UseControllerProps<TFieldValue>;

export function FormInput<TFieldValue extends FieldValues>({ control, name, rules, label }: FormInputProps<TFieldValue>) {
   return (
      <Controller
         control={control}
         name={name}
         rules={rules}
         render={({ fieldState, field }) => {
            return (
               <div className="grid gap-3">
                  <Label htmlFor={field.name}>{label}</Label>
                  <Input id={field.name} name={field.name} onChange={(e) => field.onChange(e.target.value)} />
                  {fieldState.error && <p className="text-red-500">{fieldState.error.message}</p>}
               </div>
            );
         }}
      />
   );
}
