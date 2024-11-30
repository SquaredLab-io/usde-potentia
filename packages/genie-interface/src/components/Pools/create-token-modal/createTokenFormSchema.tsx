"use client";

import { z } from "zod";

export const formSchema = z.object({
  tokenName: z
    .string({
      required_error: "Token Name is required",
      invalid_type_error: "Enter a valid Toke Name"
    })
    .min(1, {
      message: "Token name can not be empty"
    }),
  tokenSymbol: z
    .string({
      required_error: "Token Symbol is required",
      invalid_type_error: "Enter a valid Symbol"
    })
    .min(1, {
      message: "Token symbol can not be empty"
    })
});

export type CreateTokenFormSchema = z.infer<typeof formSchema>;
