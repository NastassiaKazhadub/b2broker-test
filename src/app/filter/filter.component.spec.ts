import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterForm } from './filter-form';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should set formData when input changes', () => {
    const formData: FilterForm = {
      timer: 100,
      arraySize: 10,
      specifiedIds: [1, 2, 3],
    };
    const formGroupValue = {
      timer: 100,
      arraySize: 10,
      specifiedIds: '1,2,3',
    };
    fixture.componentRef.setInput('formData', formData);
    fixture.detectChanges();

    expect(component.filterForm.value).toEqual(formGroupValue);
  });

  it('should have timerControl', () => {
    expect(component.timerControl).toBeTruthy();
  });
  
  it('should have arraySizeControl', () => {
    expect(component.arraySizeControl).toBeTruthy();
  });
  
  it('should have specifiedIdsControl', () => {
    expect(component.specifiedIdsControl).toBeTruthy();
  });
  
  it('should validate timerControl', () => {
    const timerControl = component.timerControl;
    timerControl.setValue(-1);

    expect(timerControl.valid).toBeFalsy();
    expect(timerControl.hasError('invalidMilliseconds')).toBeTruthy();

    timerControl.setValue(1000);

    expect(timerControl.valid).toBeTruthy();
  });

  it('should validate arraySizeControl as a number', () => {
    const arraySizeControl = component.arraySizeControl;
    arraySizeControl.setValue('test');

    expect(arraySizeControl.valid).toBeFalsy();
    expect(arraySizeControl.hasError('incorrectNumber')).toBeTruthy();
    
    arraySizeControl.setValue(-1);

    expect(arraySizeControl.valid).toBeFalsy();
    expect(arraySizeControl.hasError('incorrectNumber')).toBeTruthy();
    
    arraySizeControl.setValue(100);
    
    expect(arraySizeControl.valid).toBeTruthy();
  });

  it('should validate specifiedIdsControl format', () => {
    const specifiedIdsControl = component.specifiedIdsControl;
    specifiedIdsControl.setValue('1,2,3,qweq');

    expect(specifiedIdsControl.valid).toBeFalsy();
    expect(specifiedIdsControl.hasError('invalidFormat')).toBeTruthy();
    
    specifiedIdsControl.setValue('1,2,3');
    
    expect(specifiedIdsControl.valid).toBeTruthy();
  });
});
