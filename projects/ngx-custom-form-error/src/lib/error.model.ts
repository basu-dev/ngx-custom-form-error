export interface IError {
    required?: string | null,
    nullValidator?: string | null,
    requiredTrue?: string | null,
    min?: string | null,
    max?: string | null,
    minLength?: string | null,
    maxLength?: string | null,
    email?: string | null,
    pattern?: string | null;
}