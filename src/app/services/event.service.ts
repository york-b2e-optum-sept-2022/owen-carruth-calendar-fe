import { Injectable } from '@angular/core';
import {BehaviorSubject, first, Subject} from "rxjs";
import {NgForm} from "@angular/forms";
import {IEvent} from "../interfaces/IEvent";
import {IEventForm} from "../interfaces/IEventForm";
import {HttpService} from "./http.service";
import {IAccount} from "../interfaces/IAccount";
import {v4 as uuidv4} from 'uuid'
import {AccountService} from "./account.service";
@Injectable({
  providedIn: 'root'
})
export class EventService {
  $invitedEmails = new Subject<string[]>();
  invitedEmails: string[] = [];

  invitedAccounts: IAccount[] = []
  $invitedAccounts = new Subject<IAccount[]>();

  otherAccounts: IAccount[] = []
  $otherAccounts = new Subject<IAccount[]>();

  $eventCreated = new Subject<IEvent>();
  $myEvents = new Subject<IEvent[]>();

  $myInvites = new Subject<IEvent[]>();


  constructor(private httpService: HttpService, private accountService: AccountService) { }

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

  editEventClick(invitedAccounts: IAccount[]){
    this.invitedAccounts = invitedAccounts
    this.accountService.$inviteList.pipe(first()).subscribe({
      next: accountList => {
            console.log(invitedAccounts)
            const otherAccounts = accountList.filter(account => invitedAccounts.every(idk => idk.id !== account.id))
            this.otherAccounts = otherAccounts
            this.$otherAccounts.next(otherAccounts)
      }
  })
  }

  editInviteList(selected: MouseEvent) {
    console.log(this.invitedAccounts)
    const selectedElement = selected.target as HTMLInputElement
    if(selectedElement.id === 'notInvited'){
      this.httpService.findAccountByEmail(selectedElement.value).subscribe({
        next: account => {
          console.log(account)
          this.invitedAccounts.push(account[0])
          console.log(this.invitedAccounts)
          this.otherAccounts = this.otherAccounts.filter(otherAccount => otherAccount.id !== account[0].id)
          console.log(this.otherAccounts)
          this.$otherAccounts.next(this.otherAccounts)
        }
      })
    }else if (selectedElement.id === 'invited') {
      console.log(this.invitedAccounts)
      this.httpService.findAccountByEmail(selectedElement.value).subscribe({
        next: account => {
          this.otherAccounts.push(account[0])
          this.invitedAccounts = this.invitedAccounts.filter(invitedAccount => selectedElement.value !== invitedAccount.email)
          this.$invitedAccounts.next(this.invitedAccounts)
        }
      })

    }

  }

  submitEdit(userEvent: IEvent) {
    this.httpService.editEvent(userEvent).pipe(first()).subscribe({
        next: value => console.log(value)
    })
  }

  getMyInvites(user: IAccount) {
    this.httpService.getInvites(user).pipe(first()).subscribe({
      next: events => {
       const myInvites = events.filter(event => event.invitedAccounts.every(acc => acc.id === user.id))
        console.log(myInvites)
        this.$myInvites.next(myInvites)
      }
    })
  }
}
