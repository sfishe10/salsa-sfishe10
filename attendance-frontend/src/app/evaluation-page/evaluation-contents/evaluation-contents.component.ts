import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Station} from '../../models/station';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {StationGroup} from '../../models/station-group';
import {StationItem} from '../../models/station-item';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {Evaluation} from '../../models/evaluation';
import {EvaluationItem} from '../../models/evaluation-item';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-evaluation-contents',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatButton,
    MatIcon,
    MatIconButton,
    NgClass,
    FormsModule,
    MatFormField,
    MatInput,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatSlideToggle
  ],
  templateUrl: './evaluation-contents.component.html',
  styleUrl: './evaluation-contents.component.css'
})
export class EvaluationContentsComponent implements OnInit {
  @Input('evaluation') evaluation!: Evaluation;

  @Input('readonly') readonly!: boolean;

  // groups each EvaluationItem to its StationGroup
  groupedItems: Array<[string, EvaluationItem[]]> = [];

  ngOnInit() {
    const itemMap = new Map<string, EvaluationItem[]>();

    for (const item of this.evaluation.items) {
      let groupTitle = item.stationItem?.group?.title;
      let items = itemMap.get(groupTitle) ?? [];

      items.push(item);
      itemMap.set(groupTitle, items);
    }

    this.groupedItems = Array.from(itemMap.entries());
  }

}
