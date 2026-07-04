import {Component, EventEmitter, Input, Output} from '@angular/core';
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

  editingItem: StationItem | null = null;
  editingItemText = '';

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

    this.updateItemLevels();
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


  updateItemLevels() {
    this.station.groups.forEach(group => {
      group.items.forEach((item, index) => {
        item.level = index;
      });
    });
  }

  addStationItem(groupId: number) {

  }

  addStationGroup() {

  }

  deleteItem(groupId: number, itemId: number) {
    let group = this.station.groups.find((group) => group.groupId == groupId)
    if (!group) return;

    group.items = group.items.filter((item) => item.itemId != itemId);
    this.itemDeleted.emit(itemId);
  }

  deleteGroup(groupId: number) {
    this.station.groups = this.station.groups.filter((group) => group.groupId != groupId);
    this.groupDeleted.emit(groupId);
  }

  startEditingItem(item: StationItem) {
    this.editingItem = item;
    this.editingItemText = item.item;
  }

  saveEditingItem() {
    if (!this.editingItem) return;

    this.editingItem.item = this.editingItemText;
    this.editingItem = null;
    this.editingItemText = '';
  }

  cancelEditingItem() {
    this.editingItem = null;
    this.editingItemText = '';
  }

  isEditingItem(item: StationItem): boolean {
    return this.editingItem === item;
  }
}
