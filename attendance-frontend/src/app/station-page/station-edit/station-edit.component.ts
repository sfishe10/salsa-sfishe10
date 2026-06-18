import {Component, Input} from '@angular/core';
import {Station} from '../../models/station';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {StationGroup} from '../../models/station-group';
import {StationItem} from '../../models/station-item';

@Component({
  selector: 'app-station-edit',
  standalone: true,
  imports: [
    NgForOf,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    NgIf,
    NgStyle
  ],
  templateUrl: './station-edit.component.html',
  styleUrl: './station-edit.component.css'
})
export class StationEditComponent {
  @Input('station') station!: Station;

  @Input('editing') editing!: boolean;

  drop(event: CdkDragDrop<StationItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  updateItemLevels() {
    this.station.groups.forEach(group => {
      group.items.forEach((item, index) => {
        item.level = index;
        item.group = group;
      });
    });
  }
}
