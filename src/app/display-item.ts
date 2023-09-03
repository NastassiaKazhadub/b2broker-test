export class DisplayItem {
  float: number;
  child: DisplayItemChild;

  constructor(
    public id: number,
    public int: number,
    public color: string,
    float: number,
    childId: number,
    childColor: string
  ) {
    this.float = parseFloat(float.toPrecision(18));
    this.child = {
      id: childId,
      color: childColor,
    };
  }
}

export interface DisplayItemChild {
  id: number;
  color: string;
}
  