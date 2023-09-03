/// <reference lib="webworker" />

import { Subscription, map, timer } from "rxjs";
import { PseudoSocketAction, PseudoSocketActionType } from "./pseudo-socket-action";
import { PseudoSocketListItem } from "./pseudo-socket-list-item";

const DEFAULT_ARRAY_SIZE = 0;
const DEFAULT_INTERVAL = 1000;

let currentTimerSubscription: Subscription | null = null;

addEventListener('message', ({ data }: { data: PseudoSocketAction }) => {
  switch(data.action) {
    case PseudoSocketActionType.Stop:
      cleanSubscription();
      break;

    case PseudoSocketActionType.GenerateList:
      const arraySize = data.options?.listSize || DEFAULT_ARRAY_SIZE;
      const interval = data.options?.interval || DEFAULT_INTERVAL;
  
      cleanSubscription();

      if (!arraySize) {
        postMessage([]);
        break;
      }
  
      currentTimerSubscription = timer(0, interval).pipe(
        map(() => generateList(arraySize)),
      ).subscribe(items => postMessage(items));
      break;

    default:
      break;
  }
});

const generateList = (arraySize: number): PseudoSocketListItem[] => {
  return Array.from({ length: arraySize }, (_, i) => createRandomListItem(i));
}

const createRandomListItem = (id: number): PseudoSocketListItem => {
  return {
    id,
    int: getRandomInt(),
    float: getRandomFloat(),
    color: getRandomColor(),
    child: {
      id: getRandomInt(),
      color: getRandomColor()
    }
  };
}

const cleanSubscription = () => {
  currentTimerSubscription?.unsubscribe();
  currentTimerSubscription = null;
};

const getRandomInt = (): number => Math.floor(Math.random() * 100000);

const getRandomFloat = (): number => parseFloat((Math.random() * 100).toFixed(18));

const getRandomColor = (): string => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const formats = ['rgb', 'hex'];
  const randomFormat = formats[Math.floor(Math.random() * formats.length)];

  switch (randomFormat) {
    case 'rgb':
      return `rgb(${red}, ${green}, ${blue})`;
    case 'hex':
      return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
    default:
      return '';
  }
}
