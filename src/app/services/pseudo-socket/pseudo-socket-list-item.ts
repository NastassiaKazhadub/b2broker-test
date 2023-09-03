export interface PseudoSocketListItem {
  id: number;
  int: number;
  float: number;
  color: string;
  child: {
      id: number;
      color: string;
  };
}
