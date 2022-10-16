import { Component, OnInit } from '@angular/core';
import {EventService} from "../../services/event.service";
import {IEvent} from "../../interfaces/IEvent";
import {first} from "rxjs";
import {AccountService} from "../../services/account.service";
import {IAccount} from "../../interfaces/IAccount";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  userEvent!: IEvent;
  user: IAccount
  display = "none";
  invitedAccounts: IAccount[] = []
  otherAccounts: IAccount[] = [];

  editForm!: FormGroup;

  constructor(private eventService: EventService, private accountService: AccountService,private formBuilder:FormBuilder, private route: ActivatedRoute) {
    this.user = JSON.parse(sessionStorage['user']) as IAccount
    this.eventService.$currentEvent.subscribe({
      next: value => {
        this.userEvent = value
        console.log(this.userEvent)
      }
    })
  }

  ngOnInit(): void {
    console.log(this.userEvent)
    if(this.userEvent.invitedAccounts.length > 0){
      this.invitedAccounts = this.userEvent.invitedAccounts
    }else{

    }

    console.log(this.userEvent.invitedAccounts)
    this.editForm = this.formBuilder.group({
      title: [this.userEvent.title],
      description:[this.userEvent.description],
      date:[this.userEvent.date]
    })
  }

  editEventClick() {
    this.accountService.getAccounts(this.user)
    this.eventService.editEventClick(this.userEvent.invitedAccounts)
    this.otherAccounts = this.eventService.otherAccounts
    this.eventService.$otherAccounts.pipe(first()).subscribe({
      next: value => {
        console.log(this.userEvent.invitedAccounts)
        this.otherAccounts = value}
    })
    console.log(this.userEvent.invitedAccounts)
    this.display = "block";
  }

  editInviteList(selected: MouseEvent) {
    this.eventService.editInviteList(selected)
    this.eventService.$otherAccounts.pipe(first()).subscribe({
      next: value => this.otherAccounts = value
    })

    this.eventService.$invitedAccounts.pipe(first()).subscribe({
      next: value => this.invitedAccounts = value
    })
    this.userEvent.invitedAccounts = this.userEvent.invitedAccounts
    // console.log(this.userEvent.invitedAccounts)
  }

  confirmEditClick(){
    console.log("CONFIRMATION CLICK RUNNING")
    console.log(this.userEvent.invitedAccounts)
    const editTitle = this.editForm.value.title
    const editDescription = this.editForm.value.description
    const editDate = this.editForm.value.date

    this.userEvent.title = editTitle
    this.userEvent.date = editDate
    this.userEvent.description = editDescription
    this.userEvent.invitedAccounts = this.invitedAccounts

    this.eventService.submitEdit(this.userEvent)
    this.display = "none";
  }
  cancelEdit(){
    this.editForm = this.formBuilder.group({
      title: [this.userEvent.title],
      description:[this.userEvent.description],
      date:[this.userEvent.date]
    })

    this.display = "none";
  }


  deleteEvent() {
    if (this.userEvent.createdBy.id === this.user.id) {
      this.eventService.deleteEvent(this.userEvent)
    } else {
      // TODO improve way of telling user the cant delete
      alert("unauthorized to delete account")
    }
  }

}
