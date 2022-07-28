import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[itemvalidator][ngModel],[itemvalidator][ngFormControl]',
  providers: [{
    multi: true,
    provide: NG_VALIDATORS, 
    useExisting: forwardRef(() => ItemValidatorClass)      
  }]
})
export class ItemValidatorClass {

  @Input() itemvalidator:ValidatorFn; //same name as the selector

  validate(control: AbstractControl):{ [key: string]: any; } {
    return this.itemvalidator(control);
  }

}
