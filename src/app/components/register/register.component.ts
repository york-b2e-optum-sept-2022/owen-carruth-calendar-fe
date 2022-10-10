import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {IRegisterForm} from "../../interfaces/IRegisterForm";
import {AccountService} from "../../services/account.service";
import {BehaviorSubject, first, Subject, takeUntil} from "rxjs";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  $componentDestroyed: Subject<boolean> = new Subject()
  registerSuccess: boolean = false;
  registerError: string = '';
  constructor(private accountService: AccountService, private router: Router) {
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

    this.accountService.$account.pipe(takeUntil(this.$componentDestroyed)).subscribe({
      next: account => {
        this.registerSuccess = !!account
        if(this.registerSuccess){
          this.router.navigate(['/events'])
        }
      }
    })

  }
}
