import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../services/account.service";
import {IAccount} from "../../interfaces/IAccount";
import {EventService} from "../../services/event.service";
import {NgForm} from "@angular/forms";
import {IEvent} from "../../interfaces/IEvent";
import {IEventForm} from "../../interfaces/IEventForm";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {

  user: IAccount;
  otherAccounts: IAccount[] | null = null;
  invitedEmails: string[] = [];
  $componentDestroyed: Subject<boolean> = new Subject()
  createEventError: string = '';
  createInviteListError: string = '';
  constructor(private accountService: AccountService, private eventService: EventService, private router: Router) {
    this.user = JSON.parse(sessionStorage['user']) as IAccount
      this.eventService.$addInvitesError.pipe(takeUntil(this.$componentDestroyed)).subscribe({
        next: err => this.createInviteListError = err
        }
      )
  }

  ngOnInit(): void {
  }
  display = "none";



  onCloseHandled(event: Event) {
    this.display = "none";
    console.log(event)

    this.eventService.resetInviteList()
  }
  getAccounts(){

    if(this.user !== null){
      this.accountService.getAccounts(this.user)
      this.accountService.$inviteList.subscribe({
        next: inviteList => {
          this.otherAccounts = inviteList
        }
      })
    }
    this.eventService.$invitedEmails.subscribe({
      next: accounts => this.invitedEmails = accounts
    })
    console.log(this.invitedEmails)
    this.display = "block";
  }

createEvent(formData: IEventForm){
  console.log(this.invitedEmails)
console.log(formData)
  this.eventService.createEvent(formData, this.user)
  this.eventService.$eventCreated.pipe(takeUntil(this.$componentDestroyed)).subscribe({
    next: value => {if(value){
      this.router.navigate(['/events'])
    }}, error : err => this.createEventError = err
  })
}


  addInviteToEvent() {
    this.eventService.addInvitesToEvent()
    this.display = "none";
  }


  createInviteList(selected: Event) {
    this.eventService.createInviteList(selected)
  }

  ngOnDestroy(){
    this.$componentDestroyed.next(true)
  }
}
