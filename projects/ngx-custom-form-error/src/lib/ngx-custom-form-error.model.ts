export interface IError {
    required?: string | null | Function,
    min?: string | null | Function,
    max?: string | null | Function,
    minlength?: string | null | Function,
    maxlength?: string | null | Function,
    email?: string | null | Function,
    pattern?: string | null | Function;
}

export interface IErrorConfig {
    required?: Function | string | null;
    min?: Function | string;
    max?: Function | string;
    minLength?: Function | string;
    maxLength?: Function | string;
    email?: Function | string;
    pattern?: Function | string;
    onTouchedOnly?: boolean;
    addErrorClassToElement?: boolean;
    errorClass?: string;
    errorTextColor?: string;
}




