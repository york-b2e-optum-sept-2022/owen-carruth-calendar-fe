import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../services/event.service";
import {IAccount} from "../../interfaces/IAccount";
import {IEvent} from "../../interfaces/IEvent";

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css']
})
export class InvitesComponent implements OnInit {

  @Input() invite!: IEvent;

  user: IAccount


  constructor(private eventService: EventService) {
    this.user = JSON.parse(sessionStorage['user']) as IAccount

  }

  ngOnInit(): void {

  }

  removeInvite() {
    this.eventService.removeInvite(this.invite, this.user)
  }
}
