import {Component, Input, OnInit} from '@angular/core';
import {IEvent} from "../../interfaces/IEvent";
import {EventService} from "../../services/event.service";
import {IAccount} from "../../interfaces/IAccount";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() userEvent!: IEvent;
  viewingDetails: boolean = false;
  user: IAccount
  constructor(private eventService: EventService) {
    this.user = JSON.parse(sessionStorage['user']) as IAccount
  }

  ngOnInit(): void {
  }

  viewDetails(){
    this.viewingDetails = true;
  }
  deleteEvent(){
    if(this.userEvent.createdBy.id === this.user.id){
      this.eventService.deleteEvent(this.userEvent)
    }else{
      // TODO improve way of telling user the cant delete
      alert("unauthorized to delete account")
    }

  }

  stopViewingDetails() {
    this.viewingDetails = false;
  }
}
