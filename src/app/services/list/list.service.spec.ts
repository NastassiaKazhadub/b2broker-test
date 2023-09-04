import { TestBed } from '@angular/core/testing';

import { ListService } from './list.service';
import { take } from 'rxjs';

describe('ListService', () => {
  let service: ListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change the interval and call generateNewList()', () => {
    const interval = 500;
    const generateNewListSpy = spyOn(service, 'generateNewList');
  
    service.changeInterval(interval);
  
    expect(generateNewListSpy).toHaveBeenCalled();
    service.listOptionsAction$.pipe(take(1)).subscribe(value => expect(value.interval).toEqual(interval));
  });

  it('should change the listSize and call generateNewList()', () => {
    const listSize = 100;
    const generateNewListSpy = spyOn(service, 'generateNewList');
  
    service.changeListSize(listSize);
  
    expect(generateNewListSpy).toHaveBeenCalled();
    service.listOptionsAction$.pipe(take(1)).subscribe(value => expect(value.listSize).toEqual(listSize));
  });

  it('should change the specifiedIds', () => {
    const specifiedIds = [1, 2, 3];
  
    service.changeSpecifiedIds(specifiedIds);
  
    service.specifiedIdsAction$.pipe(take(1)).subscribe(value => expect(value).toEqual(specifiedIds));
  });
});
