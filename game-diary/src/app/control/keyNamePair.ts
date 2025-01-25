import {IKeyNamePair} from "@/control/diaryControlInterfaces"
export class KeyNamePair implements IKeyNamePair{
  constructor(private key:string,private name:string){}
  getKey(): string {
    return this.key
  }
  getName(): string {
    return this.name
  }
  setName(newName: string): void {
    this.name = newName
  }  
}