import {Component, Input, OnInit} from '@angular/core';
import {IEvent} from "../../interfaces/IEvent";
import {EventService} from "../../services/event.service";
import {IAccount} from "../../interfaces/IAccount";
import {AccountService} from "../../services/account.service";
import {first, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() userEvent!: IEvent;
  viewingDetails: boolean = false;
  user: IAccount
  display = "none";
  invitedAccounts: IAccount[] = []
  otherAccounts: IAccount[] = [];
  editForm!: FormGroup;
  isEditing: boolean = false;
  $componentDestroyed: Subject<boolean> = new Subject()
  eventError: string = ''

  constructor(private eventService: EventService, private accountService: AccountService, private formBuilder:FormBuilder) {
    this.user = JSON.parse(sessionStorage['user']) as IAccount
    console.log(this.userEvent)
    this.eventService.$editEventError.pipe(takeUntil(this.$componentDestroyed)).subscribe({
      next: err => this.eventError = err
    })

  }

  ngOnInit(): void {
    this.invitedAccounts = this.userEvent.invitedAccounts
    console.log(this.userEvent.invitedAccounts)
    this.editForm = this.formBuilder.group({
      title: [this.userEvent.title],
      description:[this.userEvent.description],
      date:[this.userEvent.date]
    })
  }

  viewDetails() {
    console.log(this.userEvent)
    this.display = "block";
    this.viewingDetails = true;
  }

  deleteEvent() {
    if (this.userEvent.createdBy.id === this.user.id) {
      this.eventService.deleteEvent(this.userEvent)
    } else {
      alert("unauthorized to delete account")
    }
  }

  stopViewingDetails() {
    this.viewingDetails = false;
    this.display = "none";
  }

  editEventClick() {
    this.isEditing = true;
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
    this.isEditing = false;
  }
  cancelEdit(){
    console.log(this.invitedAccounts)
    this.editForm = this.formBuilder.group({
      title: [this.userEvent.title],
      description:[this.userEvent.description],
      date:[this.userEvent.date]
    })
    this.invitedAccounts = this.userEvent.invitedAccounts
    this.isEditing = false;
  }

  ngOnDestroy(){
    this.$componentDestroyed.next(true)
    this.$componentDestroyed.complete()
  }



}
