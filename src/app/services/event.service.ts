import { Injectable } from '@angular/core';
import {BehaviorSubject, first, Subject} from "rxjs";
import {NgForm} from "@angular/forms";
import {IEvent} from "../interfaces/IEvent";
import {IEventForm} from "../interfaces/IEventForm";
import {HttpService} from "./http.service";
import {IAccount} from "../interfaces/IAccount";
import {v4 as uuidv4} from 'uuid'
@Injectable({
  providedIn: 'root'
})
export class EventService {
  invitedAccounts: IAccount[] = []
  $invitedEmails = new Subject<string[]>();
  invitedEmails: string[] = [];
  $eventCreated = new Subject<IEvent>();
  $myEvents = new Subject<IEvent[]>();
  constructor(private httpService: HttpService) { }

  createInviteList(selected: Event) {
    const isChecked: boolean =  (selected.target as HTMLInputElement).checked
    const selectedList = (selected.target as HTMLInputElement).value
      if(isChecked){
        this.invitedEmails.push(selectedList)
      }else{
        const removeEmailList = this.invitedEmails.filter(account => {
          console.log(account == selectedList)
          return account !== selectedList
        })
        this.invitedEmails = removeEmailList
      }
      console.log(this.invitedEmails)
  }

  resetInviteList() {

  }

  addInvitesToEvent() {
    this.$invitedEmails.next(this.invitedEmails)

    for(let email of this.invitedEmails){
      this.httpService.findAccountByEmail(email).subscribe({
        next: account => {
          console.log(account)
          this.invitedAccounts.push(account[0])
          console.log(this.invitedAccounts)
        }
      })
    }
  }

  createEvent(formData: IEventForm, user: IAccount) {

    console.log(this.invitedAccounts)
    // const newEvent = {
    //  title: formData.title,
    //   date: formData.date,
    //   description: formData.description,
    //   invitedAccounts: this.invitedAccounts
    // }
    this.httpService.createEvent({
      id: uuidv4(),
      createdBy: user,
      title: formData.title,
      date: formData.date,
      description: formData.description,
      invitedAccounts: this.invitedAccounts
    }).pipe(first()).subscribe({
      next: event => this.$eventCreated.next(event),
      error: err => console.log(err)
    })
  }

  getMyEvents(userID: string) {
    this.httpService.getEvents(userID).pipe(first()).subscribe({
      next: myEventList =>{
        this.$myEvents.next(myEventList)
      }

    })

  }

  deleteEvent(event: IEvent) {
    console.log(event)
    this.httpService.deleteEvent(event.id).pipe(first()).subscribe({
      next: value => { this.getMyEvents(event.createdBy.id)


      }
    })
  }
}
