import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {IRegisterForm} from "../../interfaces/IRegisterForm";
import {AccountService} from "../../services/account.service";
import {BehaviorSubject, first, Subject, takeUntil} from "rxjs";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  $componentDestroyed: Subject<boolean> = new Subject()
  registerError: string = '';
  constructor(private accountService: AccountService) {
    this.accountService.$registerError.pipe(takeUntil(this.$componentDestroyed)).subscribe({
      next: registerError => this.registerError = registerError
    })
  }

  ngOnInit(): void {
  }
  ngOnDestroy(){
    this.$componentDestroyed.next(true)
    this.$componentDestroyed.complete()
  }

  onRegister(registrationData: IRegisterForm) {
    this.accountService.register(registrationData)
    console.log(this.registerError)

  }
}
