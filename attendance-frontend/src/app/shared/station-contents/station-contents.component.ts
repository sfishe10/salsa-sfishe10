import {Component, Input} from '@angular/core';
import {Station} from '../../models/station';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop, CdkDragHandle,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {StationGroup} from '../../models/station-group';
import {StationItem} from '../../models/station-item';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Constants} from '../../utilities/constants';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-station-contents',
  standalone: true,
  imports: [
    NgForOf,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    NgIf,
    NgStyle,
    MatButton,
    CdkDragHandle,
    MatIcon,
    MatIconButton,
    NgClass
  ],
  templateUrl: './station-contents.component.html',
  styleUrl: './station-contents.component.css'
})
export class StationContentsComponent {
  @Input('station') station!: Station;

  @Input('editing') editing!: boolean;

  dropItem(event: CdkDragDrop<StationItem[]>) {
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

  dropGroup(event: CdkDragDrop<StationGroup[]>) {
    moveItemInArray(
      this.station.groups,
      event.previousIndex,
      event.currentIndex
    );

    this.station.groups.forEach((group, index) => {
      group.level = index;
    });
  }


  updateItemLevels() {
    this.station.groups.forEach(group => {
      group.items.forEach((item, index) => {
        item.level = index;
        item.group = group;
      });
    });
  }

  addStationItem(groupId: number) {

  }

  addStationGroup() {

  }
}
