import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, map } from 'rxjs';
import { PseudoSocketAction, PseudoSocketActionType, PseudoSocketOptions } from '../pseudo-socket/pseudo-socket-action';
import { PseudoSocketListItem } from '../pseudo-socket/pseudo-socket-list-item';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private readonly defaultShortListSize: number = 10;
  private readonly defaultListOptions: PseudoSocketOptions = {
    interval: 1000,
    listSize: 1000,
  };
  private worker!: Worker;

  private listOptionsSubject = new BehaviorSubject<PseudoSocketOptions>(this.defaultListOptions);
  listOptionsAction$ = this.listOptionsSubject.asObservable();

  private specifiedIdsSubject = new BehaviorSubject<number[]>([]);
  specifiedIdsAction$ = this.specifiedIdsSubject.asObservable();

  private listSubject = new Subject<PseudoSocketListItem[]>();
  list$: Observable<PseudoSocketListItem[]> = this.listSubject.asObservable();

  shortListWithSpecifiedIds$: Observable<PseudoSocketListItem[]> = combineLatest([this.list$, this.specifiedIdsAction$])
  .pipe(
    map(([list, specifiedIds]: [PseudoSocketListItem[], number[]]) =>
      this.getShortListWithSpecifiedIds(list, this.defaultShortListSize, specifiedIds))
  );

  constructor() {
    this.worker = this.createWorker();
    this.worker.onmessage = ({ data }: { data: PseudoSocketListItem[] }) => this.listSubject.next(data);
  }

  stopListProcessing(): void {
    const socketAction: PseudoSocketAction = {
      action: PseudoSocketActionType.Stop,
    };

    this.worker.postMessage(socketAction);
    this.worker.terminate();
  }

  changeInterval(interval: number): void {
    this.listOptionsSubject.next({...this.listOptionsSubject.value, interval });
    this.generateNewList();
  }

  changeListSize(listSize: number): void {
    this.listOptionsSubject.next({...this.listOptionsSubject.value, listSize });
    this.generateNewList();
  }

  changeSpecifiedIds(values: number[]): void {
    this.specifiedIdsSubject.next(values);
  }

  generateNewList(): void {
    const socketAction: PseudoSocketAction = {
      action: PseudoSocketActionType.GenerateList,
      options: this.listOptionsSubject.value,
    };

    this.worker.postMessage(socketAction);
  }

  private createWorker(): Worker {
    return new Worker(new URL('../pseudo-socket/pseudo-socket.worker.ts', import.meta.url));
  }
  
  private getShortListWithSpecifiedIds(
    source: PseudoSocketListItem[] = [],
    size: number,
    specifiedIds: number[] = []
  ): PseudoSocketListItem[] {
    const sourceItemIdToArrayIndexMap: Map<number, PseudoSocketListItem> = new Map(source.map((value) => [value.id, value]));
    const existedSpecifiedItems: PseudoSocketListItem[] = specifiedIds
      .filter(specifiedId => sourceItemIdToArrayIndexMap.has(specifiedId))
      .map(specifiedId => sourceItemIdToArrayIndexMap.get(specifiedId) as PseudoSocketListItem);
    const specifiedItemsWithTailed: PseudoSocketListItem[] = existedSpecifiedItems.concat(source.slice(-size));
    const uniquePriorityItemsWithTailed: Set<PseudoSocketListItem> = new Set(specifiedItemsWithTailed);

    return Array.from(uniquePriorityItemsWithTailed).slice(0, size);
  }
}
