"use client"

import { z } from "zod";

export const formSchema = z.object({
    initialLiquidity: z
        .number({
            required_error: "Initial Liquidity is required",
            invalid_type_error: "Initial liquidity must be a number",
        })
        .min(1.001, {
            message: "Please enter a number greater than 1"
        })
        .max(357.999, {
            message: 'Please enter a number less than 358'
        }),
    power: z
    .number({
        required_error: "Power is required",
        invalid_type_error: "Power must be a number",
    })
    .int("Power must be an integer")
    .min(2, {
        message: "Power must be atleast 2"
    })
    .max(32, {
        message: 'Power cannot be greater than 32'
    }),
    sqlFee: z
    .number({
        required_error: "Sql Fee is required",
        invalid_type_error: "Sql Fee must be a number",
    })
    .min(101, {
        message: "Please enter a number greater than 100"
    })
    .max(1999, {
        message: 'Please enter a number less than 2000'
    }),
    halfLife: z
    .number({
        required_error: "Half life is required",
        invalid_type_error: "Half life must be a number",
    })
    .min(0.001, {
        message: "Please enter a number greater than 0"
    })
    .max(999.999, {
        message: 'Please enter a number less than 1000'
    }),
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

export type CreatePoolFormSchema = z.infer<typeof formSchema>;