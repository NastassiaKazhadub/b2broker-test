import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
import { FilterForm } from './filter-form';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() formData: FilterForm | null = null;
  @Output() changeTimer = new EventEmitter<number>();
  @Output() changeArraySize = new EventEmitter<number>();
  @Output() changeSpecifiedIds = new EventEmitter<number[]>();

  private destroy$ = new Subject<void>();
  private filterFormSource: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterFormSource = this.fb.group({
      timer: [0, [this.timerValidator()]],
      arraySize: [0, [this.arraySizeValidator()]],
      specifiedIds: ['', [this.specifiedIdsValidator()]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const formData: FilterForm = changes['formData']?.currentValue;

    if (formData) {
      const { specifiedIds } = formData;
      this.filterFormSource.patchValue({ ...formData, specifiedIds: specifiedIds.toString() });
    }
  }

  ngOnInit(): void {
    this.timerControl.valueChanges.pipe(
      debounceTime(500),
      filter(() => this.timerControl.valid),
      takeUntil(this.destroy$),
    ).subscribe((value: number) => this.changeTimer.emit(value));

    this.arraySizeControl.valueChanges.pipe(
      debounceTime(500),
      filter(() => this.arraySizeControl.valid),
      takeUntil(this.destroy$),
    ).subscribe((value: number) => this.changeArraySize.emit(value));

    this.specifiedIdsControl.valueChanges.pipe(
      debounceTime(500),
      filter(() => this.specifiedIdsControl.valid),
      map(value => this.mapSpecifiedIdsFromStringToArray(value)),
      takeUntil(this.destroy$),
    ).subscribe((value: number[]) => this.changeSpecifiedIds.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get filterForm(): FormGroup {
    return this.filterFormSource;
  }

  get timerControl(): FormControl {
    return this.filterForm.get('timer') as FormControl;
  }

  get arraySizeControl(): FormControl {
    return this.filterForm.get('arraySize') as FormControl;
  }

  get specifiedIdsControl(): FormControl {
    return this.filterForm.get('specifiedIds') as FormControl;
  }

  private timerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
  
      if (isNaN(value) || value < 0) {
        return { invalidMilliseconds: true };
      }
  
      return null;
    };
  }

  private arraySizeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
  
      if (isNaN(value) || value <= 0) {
        return { incorrectNumber: true };
      }
  
      return null;
    };
  }

  private specifiedIdsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      if (!/^\d+(,\d+)*$/.test(value)) {
        return { invalidFormat: true };
      }
  
      return null;
    };
  }

  private mapSpecifiedIdsFromStringToArray(value: string): number[] {
    return value.split(',').map(Number);
  }
}
