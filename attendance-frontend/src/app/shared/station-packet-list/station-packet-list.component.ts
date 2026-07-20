import {Component, Input} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {StationGroup} from '../../models/station-group';
import {Station} from '../../models/station';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {StationPacket} from '../../models/station-packet';
import {StationItem} from '../../models/station-item';

@Component({
  selector: 'app-station-packet-list',
  standalone: true,
  imports: [
    CdkDropList,
    NgStyle,
    NgForOf,
    CdkDrag,
    FormsModule,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    NgIf,
    MatButton
  ],
  templateUrl: './station-packet-list.component.html',
  styleUrl: './station-packet-list.component.css'
})
export class StationPacketListComponent {
  @Input('station') station!: Station;

  @Input('editing') editing!: boolean;

  editingPacketTitleText: string = '';

  dropPacket(event: CdkDragDrop<StationPacket[]> | any) {
    moveItemInArray(
      this.station.packets,
      event.previousIndex,
      event.currentIndex
    );

    this.station.packets.forEach((packet, index) => {
      packet.level = index;
    });
  }

  addPacket() {
    const newPacket = {
      title: '',
      level: this.station.packets.length,
      editing: true
    } as StationPacket

    this.editingPacketTitleText = '';

    this.station.packets.push(newPacket);
    this.station.packets = [...this.station.packets];
  }

  savePacketTitle(packet: StationPacket) {
    packet.title = this.editingPacketTitleText;
    this.editingPacketTitleText = '';
    packet.editing = false;
  }

  cancelEditingPacketTitle() {
    // since this is only called if the user is adding a new packet (not in the database), we can just remove it from the array
    // it will always be the last item in the array
    const currentLength = this.station.packets.length;
    this.station.packets.splice(currentLength - 1, 1);
    this.station.packets = [...this.station.packets];

    this.editingPacketTitleText = '';
  }
}
