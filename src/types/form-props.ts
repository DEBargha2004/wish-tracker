import { useForm } from "react-hook-form"

export type TFormProps<T extends Record<string, unknown>> = {
    form: ReturnType<typeof useForm<T>>
    onSubmit: (data: T) => Promise<void>
}