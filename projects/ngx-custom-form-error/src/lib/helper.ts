export function hasTwoObjectsSameProps(x: Object, y: Object): boolean {
    let xProp: string[], yProp: string[];
    try {
        xProp = Object.getOwnPropertyNames(x);
    } catch {
        xProp = [];
    }
    try {
        yProp = Object.getOwnPropertyNames(y);
    } catch {
        yProp = [];
    }
    if (xProp.length !== yProp.length) return false;
    return xProp.every((prop: string) => yProp.includes(prop));
}