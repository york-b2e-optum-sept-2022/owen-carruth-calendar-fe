import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../services/account.service";
import {first, Subject, takeUntil} from "rxjs";
import {IAccount} from "../../interfaces/IAccount";
import {EventService} from "../../services/event.service";
import {IEvent} from "../../interfaces/IEvent";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  user: IAccount;
  myEvents: IEvent[]
  $componentDestroyed: Subject<boolean> = new Subject()
  account: IAccount | null = null;
  constructor(private accountService: AccountService, private eventService: EventService) {
    this.user = JSON.parse(sessionStorage['user']) as IAccount
    this.myEvents = this.eventService.myEvents
    console.log(this.user)
  }

  ngOnInit(): void {
   this.eventService.getMyEvents(this.user)
  }

  ngOnDestroy(){
    this.$componentDestroyed.next(true)
    this.$componentDestroyed.complete()
  }
}
