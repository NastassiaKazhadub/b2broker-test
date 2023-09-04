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
      this.getShortListWithSpecifiedIds(list, specifiedIds, this.defaultShortListSize))
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
  
  // looks a bit crazy, but has the best performance
  private getShortListWithSpecifiedIds(
    sourceItems: PseudoSocketListItem[],
    priorityItemIds: number[],
    takeSize: number
  ): PseudoSocketListItem[] {
    if(!sourceItems?.length || takeSize < 0){
      return [];
    }

    if(!priorityItemIds?.length) {
      return sourceItems.slice(-takeSize);
    }

    const uniquePriorityItemIds = new Set(priorityItemIds);
    const priorityItems = [];
    const nonPriorityItems = []; 

    for(let currentItemIndex = sourceItems.length - 1; currentItemIndex >= 0; currentItemIndex--) {
      const currentItem = sourceItems[currentItemIndex];
      const areAllPriorityItemsFound = priorityItems.length === takeSize || priorityItems.length === uniquePriorityItemIds.size;

      if(areAllPriorityItemsFound) {
        const foundItemsCount = priorityItems.length + nonPriorityItems.length;
        const areAllItemsFound = foundItemsCount >= takeSize;

        if(areAllItemsFound) {
          break;
        }

        nonPriorityItems.unshift(currentItem);
      } else if(uniquePriorityItemIds.has(currentItem.id)) {
        priorityItems.unshift(currentItem);
      } else {
        const areAllNonPriorityItemsFound = nonPriorityItems.length >= takeSize;

        if(!areAllNonPriorityItemsFound) {
          nonPriorityItems.unshift(currentItem);
        }
      }
    }

    const takeNonPriorityItemsCount = takeSize - priorityItems.length;

    return takeNonPriorityItemsCount > 0
      ? priorityItems.concat(nonPriorityItems.slice(-takeNonPriorityItemsCount))
      : priorityItems;
  }
}