import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { TableComponent } from './table/table.component';
import { ListService } from './services/list/list.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let listService: ListService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FilterComponent,
        TableComponent,
      ],
      providers: [ListService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    listService = TestBed.inject(ListService);
  });

  it('should call generateNewList() on ngOnInit', () => {
    const generateNewListSpy = spyOn(listService, 'generateNewList');
    component.ngOnInit();

    expect(generateNewListSpy).toHaveBeenCalled();
  });

  it('should call stopListProcessing() on ngOnDestroy', () => {
    const stopListProcessingSpy = spyOn(listService, 'stopListProcessing');
    component.ngOnDestroy();

    expect(stopListProcessingSpy).toHaveBeenCalled();
  });

  it('should call changeInterval() with the correct value', () => {
    const changeIntervalSpy = spyOn(listService, 'changeInterval');
    const value = 500;
    component.changeTimer(value);

    expect(changeIntervalSpy).toHaveBeenCalledWith(value);
  });

  it('should call changeListSize() with the correct value', () => {
    const changeListSizeSpy = spyOn(listService, 'changeListSize');
    const value = 1000;
    component.changeArraySize(value);
    
    expect(changeListSizeSpy).toHaveBeenCalledWith(value);
  });

  it('should call changeSpecifiedIds() with the correct value', () => {
    const changeSpecifiedIdsSpy = spyOn(listService, 'changeSpecifiedIds');
    const value = [1, 2, 3];
    component.changeSpecifiedIds(value);
    
    expect(changeSpecifiedIdsSpy).toHaveBeenCalledWith(value);
  });
});
