import {IAccount} from "./IAccount";

export interface IEvent {
  createdBy: IAccount
  title: string
  description: string
  date: Date
  invitedAccounts: IAccount[]
}
