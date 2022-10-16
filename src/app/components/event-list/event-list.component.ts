import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../services/account.service";
import {first, Subject, takeUntil} from "rxjs";
import {IAccount} from "../../interfaces/IAccount";
import {EventService} from "../../services/event.service";
import {IEvent} from "../../interfaces/IEvent";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  user: IAccount;
  myEvents: IEvent[] = [];
  myInvites: IEvent[] = [];
  $componentDestroyed: Subject<boolean> = new Subject()
  account: IAccount | null = null;
  constructor(private accountService: AccountService, private eventService: EventService, private router: Router) {
    this.user = JSON.parse(sessionStorage['user']) as IAccount
    this.eventService.getMyEvents(this.user.id)
    this.eventService.getMyInvites(this.user)

  }

  ngOnInit(): void {
    this.eventService.$myEvents.pipe(takeUntil(this.$componentDestroyed)).subscribe({
      next: value => this.myEvents = value
    })
    this.eventService.$myInvites.pipe(takeUntil(this.$componentDestroyed)).subscribe({
      next: value => {
        this.myInvites = value
        console.log(this.myInvites)
      }
    })
  }

  myEventsDatePicker(startDate: HTMLInputElement, endDate: HTMLInputElement){
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    console.log(start)
    const filteredEvents = this.myEvents.filter(event => {
      const eventDate = new Date(event.date)
      return (start < eventDate &&  eventDate < end)
    })
    this.myEvents = filteredEvents
  }

  myInvitesDatePicker(startDate: HTMLInputElement, endDate: HTMLInputElement){
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    const filteredInvites = this.myInvites.filter(invite => {
      const inviteDate = new Date(invite.date)
      return (start < inviteDate &&  inviteDate < end)
    })
    this.myInvites = filteredInvites
  }

  ngOnDestroy(){
    this.$componentDestroyed.next(true)
    this.$componentDestroyed.complete()
  }

  logout() {
      sessionStorage.clear()
    this.router.navigate(['/'])
  }
}
