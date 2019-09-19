import {
    Component,
    Input,
    ElementRef,
    ViewChild,
    forwardRef,
    OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IEditController } from 'src/app/models/interfaces/interfaces';

const INLINE_EDIT_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InlineEditComponent),
    multi: true
};

@Component({
  selector: 'inline-edit',
  templateUrl: 'inline-edit.html',
  providers: [INLINE_EDIT_CONTROL_VALUE_ACCESSOR],
})
export class InlineEditComponent implements ControlValueAccessor, OnInit {

    @ViewChild('inlineEditControl', { static: false }) inlineEditControl: ElementRef;
    @Input() label = '';
    @Input() type = 'text';
    @Input() componentType = 'input';
    @Input() required = false;
    @Input() disabled = false;
    @Input() editOptions: IEditController;
    @Input() additionalData: any;
    @Input() stacked = true;

    // tslint:disable-next-line:variable-name
    private _value = '';
    private preValue = '';
    public onChange: any = Function.prototype;
    public onTouched: any = Function.prototype;

    get value(): any {
        return this._value;
    }

    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }

    stackedDisplay(): string {
        return 'stacked'; // this.stacked ? "stacked" : '';
    }

    writeValue(value: any) {
        this._value = value;
    }

    public getOptionNameById(id: any) {
        if (!this.additionalData || !this.additionalData.options) {
            return;
        }

        const option = this.additionalData.options.filter(o => o.id === id);

        if (option && option.length > 0) {
            return option[0].name;
        }
    }

    public registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    constructor(element: ElementRef) {
    }

    ngOnInit() {
    }

}
