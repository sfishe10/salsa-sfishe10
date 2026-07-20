import {Component, Input} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgForOf, NgStyle} from '@angular/common';
import {StationGroup} from '../../models/station-group';
import {Station} from '../../models/station';

@Component({
  selector: 'app-station-packet-list',
  standalone: true,
  imports: [
    CdkDropList,
    NgStyle,
    NgForOf,
    CdkDrag
  ],
  templateUrl: './station-packet-list.component.html',
  styleUrl: './station-packet-list.component.css'
})
export class StationPacketListComponent {
  @Input('station') station!: Station;

  @Input('editing') editing!: boolean;

  dropPacket(event: CdkDragDrop<StationGroup[]> | any) {
    moveItemInArray(
      this.station.packets,
      event.previousIndex,
      event.currentIndex
    );

    this.station.packets.forEach((packet, index) => {
      packet.level = index;
    });
  }
}
