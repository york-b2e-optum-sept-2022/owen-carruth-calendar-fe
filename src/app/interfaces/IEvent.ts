import {IAccount} from "./IAccount";

export interface IEvent {
  id: string
  createdBy: IAccount
  title: string
  description: string
  date: Date
  invitedAccounts: IAccount[]
}
