"use client";
import React from "react";
import type { FieldValues, UseControllerProps } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
               <div className="grid gap-2">
                  <Label htmlFor={field.name}>{label}</Label>
                  <Input id={field.name} name={field.name} onChange={(e) => field.onChange(e.target.value)} />
                  {fieldState.error && <p className="text-red-500">{fieldState.error.message}</p>}
               </div>
            );
         }}
      />
   );
}
