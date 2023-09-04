import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { DisplayItem } from '../display-item';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display no data when data is empty', () => {
    fixture.detectChanges();
    const tableRows = fixture.nativeElement.querySelectorAll('tr.row');

    expect(tableRows.length).toEqual(0);
  });
  
  it('should display data when data is provided', () => {
    const testData: DisplayItem[] = [
      new DisplayItem(1, 1, 'red', 1, 1, 'blue'),
      new DisplayItem(2, 2, 'blue', 2, 2, 'red'),
    ];
    fixture.componentRef.setInput('data', testData);
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tr.row');

    expect(tableRows.length).toEqual(testData.length);
  });

  it('should update the view when data changes', () => {
    const initialData: DisplayItem[] = [
      new DisplayItem(1, 1, 'red', 1, 1, 'blue'),
    ];
    const updatedData: DisplayItem[] = [
      new DisplayItem(2, 2, 'blue', 2, 2, 'red'),
      new DisplayItem(3, 3, 'green', 3, 3, 'pink'),
    ];
  
    fixture.componentRef.setInput('data', initialData);
    fixture.detectChanges();

    let tableRows = fixture.nativeElement.querySelectorAll('tr.row');

    expect(tableRows.length).toEqual(initialData.length);
  
    fixture.componentRef.setInput('data', updatedData);
    fixture.detectChanges();
    
    tableRows = fixture.nativeElement.querySelectorAll('tr.row');
    
    expect(tableRows.length).toEqual(updatedData.length);
  });
});
