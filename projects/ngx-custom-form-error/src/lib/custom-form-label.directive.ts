import { Directive, ElementRef } from "@angular/core";

@Directive({
    selector: "[cLabel]"
})
export class CustomFormControlLabelDirective {
    constructor(public el: ElementRef) {
    }
}