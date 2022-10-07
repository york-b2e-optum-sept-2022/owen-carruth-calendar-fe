import { Component, OnInit } from '@angular/core';
import {IAccount} from "../../interfaces/IAccount";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  account: IAccount | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
