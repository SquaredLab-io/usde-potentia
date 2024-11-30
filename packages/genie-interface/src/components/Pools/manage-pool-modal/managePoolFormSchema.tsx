"use client"

import { z } from "zod";

export const formSchema = z.object({
    sqlDiscount: z
    .number({
        required_error: "Sql Fee is required",
        invalid_type_error: "Sql Fee must be a number",
    })
    .int("Sql discount must be an integer")
    .min(1, {
        message: "Please enter a number greater than 0"
    })
    .max(1999, {
        message: 'Please enter a number less than 2000'
    }),
    halfLife: z
    .number({
        required_error: "Half life is required",
        invalid_type_error: "Half life must be a number",
    })
    .min(0.0001, {
        message: "Please enter a number greater than 0"
    })
   /*  .max(1000, {
        message: 'Value exceeded max range'
    }) */,
    priceUpdateFactor: z
    .number({
        required_error: "Price update factor is required",
        invalid_type_error: "Value must be a number"
    })
    .min(0.001, {
        message: "Please enter a number greater than 0"
    })
    .max(0.999, {
        message: 'Please enter a number less than 1'
    }),
})

export type ManagePoolFormSchema = z.infer<typeof formSchema>;