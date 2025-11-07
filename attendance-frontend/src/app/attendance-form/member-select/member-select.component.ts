import {AfterViewInit, ChangeDetectorRef, Component, forwardRef, Input, ViewChild} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {CdkOverlayOrigin, Overlay, OverlayModule} from '@angular/cdk/overlay';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {Member} from '../../../../../shared/models/member';

@Component({
  selector: 'app-member-select',
  templateUrl: './member-select.component.html',
  styleUrls: ['./member-select.component.css'],
  standalone: true,
  imports: [
    MatIcon,
    OverlayModule,
    MatButton,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MemberSelectComponent),
    multi: true
  }]
})
export class MemberSelectComponent implements ControlValueAccessor {
  @ViewChild(CdkOverlayOrigin, { static: true }) dropdownTrigger!: CdkOverlayOrigin;

  @Input('memberOptions')
  memberOptions!: Member[];

  @Input('forSub')
  forSub: boolean = false;

  isDropdownOpen = false;
  selectedOption: Member | null = null;

  constructor(public overlay: Overlay, private cdr: ChangeDetectorRef) {}

  private onChange = (value: Member | null) => {};
  private onTouched = () => {};

  toggleDropdown(event: MouseEvent) {
    this.isDropdownOpen = !this.isDropdownOpen;
    event.stopPropagation();
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    this.onTouched();
  }

  select(option: Member) {
    this.selectedOption = option;
    this.onChange(option);
    this.closeDropdown();
  }

  // ControlValueAccessor methods
  writeValue(value: Member | null): void {
    this.selectedOption = value;
    this.cdr.detectChanges()
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // handle disabled state if you want
  }
}
