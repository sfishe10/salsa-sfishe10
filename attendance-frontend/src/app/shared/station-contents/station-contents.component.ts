import {Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform} from '@angular/core';
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
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';

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
    NgClass,
    FormsModule,
    MatFormField,
    MatInput
  ],
  templateUrl: './station-contents.component.html',
  styleUrl: './station-contents.component.css'
})
export class StationContentsComponent {
  @Input('station') station!: Station;

  @Input('editing') editing!: boolean;

  @Output() groupDeleted = new EventEmitter<number>();
  @Output() itemDeleted = new EventEmitter<number>();

  @Output() groupAdded = new EventEmitter<number>();
  @Output() itemAdded = new EventEmitter<number>();

  // editingItem: StationItem | null = null;
  editingItemText = '';

  editingGroup: StationGroup | null = null;
  editingGroupText = '';

  dropItem(event: CdkDragDrop<StationItem[]> | any) {
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

  dropGroup(event: CdkDragDrop<StationGroup[]> | any) {
    moveItemInArray(
      this.station.groups,
      event.previousIndex,
      event.currentIndex
    );

    this.station.groups.forEach((group, index) => {
      group.level = index;
    });
  }

  addStationItem(groupIndex: number) {
    const group = this.station.groups[groupIndex];

    const newItem = {
      item: '',
      required: true,
      group: {groupId: group.groupId} as StationGroup, // avoid circular reference
      level: group.items.length,
      editing: true,
      deleted: false
    } as StationItem

    group.items.push(newItem);

    group.items = [...group.items];
  }

  addStationGroup(level: number) {
    const newGroup = {
      station: {stationId: this.station.stationId} as Station, // avoid circular reference
      title: '',
      level: level,
      items: [],
      editing: true,
      deleted: false
    } as StationGroup

    this.station.groups.splice(level, 0, newGroup);

    this.station.groups = [...this.station.groups];
  }

  deleteItem(groupIndex: number, itemIndex: number) {
    const group = this.station.groups[groupIndex];
    const item = group.items[itemIndex];

    // if the item has been saved (has an ID), we'll have to indicate to the database to delete it
    if (item.itemId) {
      this.itemDeleted.emit(item.itemId);
    }

    group.items.splice(itemIndex, 1);
    group.items = [...group.items];
  }

  deleteGroup(groupIndex: number) {
    const group = this.station.groups[groupIndex];

    // if the group has been saved (has an ID), we'll have to indicate to the database to delete it
    if (group.groupId) {
      this.groupDeleted.emit(group.groupId);
    }

    this.station.groups.splice(groupIndex, 1);
    this.station.groups = [...this.station.groups];
  }

  startEditingItem(item: StationItem) {
    item.editing = true;
    this.editingItemText = item.item;
  }

  saveItem(item: StationItem) {
    item.item = this.editingItemText;
    this.editingItemText = '';
    item.editing = false;
  }

  cancelEditingItem(item: StationItem, groupIndex: number, itemIndex: number) {
    if (this.editingItemText.trim() == '') {
      this.deleteItem(groupIndex, itemIndex)
    }

    item.editing = false;
    this.editingItemText = '';
  }

  startEditingGroupTitle(group: StationGroup) {
    group.editing = true;
    this.editingGroupText = group.title;
  }

  saveGroupTitle(group: StationGroup) {
    group.title = this.editingGroupText;
    this.editingGroupText = '';
    group.editing = false;
  }

  cancelEditingGroupTitle(group: StationGroup, groupIndex: number) {
    if (this.editingGroupText.trim() == '') {
      this.deleteGroup(groupIndex)
    }

    group.editing = false;
    this.editingGroupText = '';
  }

  updateLevels() {
    this.station.groups.forEach((group, index) => {
      group.level = index;

      group.items.forEach((item, index) => {
        item.level = index;
      });
    })
  }
}
