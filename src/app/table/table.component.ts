import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DisplayItem } from '../display-item';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  @Input() data: DisplayItem[] | null = [];
}
