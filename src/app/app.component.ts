import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ListService } from './services/list/list.service';
import { Observable, combineLatest, map, take } from 'rxjs';
import { PseudoSocketListItem } from './services/pseudo-socket/pseudo-socket-list-item';
import { DisplayItem } from './display-item';
import { FilterForm } from './filter/filter-form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  list$: Observable<DisplayItem[]> = this.listService.shortListWithSpecifiedIds$.pipe(
    map(list =>list.map((item: PseudoSocketListItem) => this.mapListItemToDisplayItem(item)))
  );
  filterData$: Observable<FilterForm> = combineLatest([
    this.listService.listOptionsAction$,
    this.listService.specifiedIdsAction$,
  ]).pipe(
    map(([listOptions, specifiedIds]) => ({
      timer: listOptions.interval,
      arraySize: listOptions.listSize,
      specifiedIds,
    })),
    take(1),
  );

  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.listService.generateNewList();
  }

  ngOnDestroy(): void {
    this.listService.stopListProcessing();
  }

  changeTimer(value: number) {
    this.listService.changeInterval(value);
  }

  changeArraySize(value: number) {
    this.listService.changeListSize(value);
  }

  changeSpecifiedIds(value: number[]) {
    this.listService.changeSpecifiedIds(value);
  }

  private mapListItemToDisplayItem(item: PseudoSocketListItem): DisplayItem {
    return new DisplayItem(
      item.id,
      item.int,
      item.color,
      item.float,
      item.child.id,
      item.child.color
    );
  };
}
