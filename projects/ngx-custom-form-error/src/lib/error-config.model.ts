export interface IErrorConfig {
    required?: Function | string;
    nullValidator?: Function | string;
    requiredTrue?: Function | string;
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
