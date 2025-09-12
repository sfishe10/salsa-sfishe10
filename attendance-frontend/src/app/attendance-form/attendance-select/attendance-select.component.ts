import {Component, forwardRef, Input, ViewChild} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {CdkOverlayOrigin, Overlay, OverlayModule} from '@angular/cdk/overlay';
import {NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-attendance-select',
  templateUrl: './attendance-select.component.html',
  styleUrls: ['./attendance-select.component.css'],
  standalone: true,
  imports: [
    NgIf,
    MatIcon,
    OverlayModule,
    MatButton,
    ReactiveFormsModule
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AttendanceSelectComponent),
    multi: true
  }]
})
export class AttendanceSelectComponent implements ControlValueAccessor {
  @ViewChild(CdkOverlayOrigin, { static: true }) dropdownTrigger!: CdkOverlayOrigin;

  @Input('includeSub')
  includeSub: boolean = false;

  isDropdownOpen = false;
  openSubMenu: string | null = null;
  selectedOption: string | null = null;

  private onChange = (value: string | null) => {};
  private onTouched = () => {};

  constructor(public overlay: Overlay) {}

  toggleDropdown(event: MouseEvent) {
    this.isDropdownOpen = !this.isDropdownOpen;
    event.stopPropagation();
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    this.openSubMenu = null;
    this.onTouched();
  }

  toggleSubMenu(menu: string) {
    this.openSubMenu = this.openSubMenu === menu ? null : menu;
  }

  select(option: string | null) {
    this.selectedOption = option;
    this.onChange(option);
    this.closeDropdown();
  }

  // ControlValueAccessor methods
  writeValue(value: string | null): void {
    this.selectedOption = value;
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


  sanitizeId(value: string | null): string | null {
    if (!value) return null;
    return 'option-' + value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
