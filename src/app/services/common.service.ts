import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public abc: EventEmitter<string> = new EventEmitter<string>();
  public path: EventEmitter<string> = new EventEmitter<string>();
  public setICECarousel: EventEmitter<boolean> = new EventEmitter<boolean>();
  public flowId: string;
  public setICE: EventEmitter<boolean> = new EventEmitter<boolean>();
  public triggerIceValidations: EventEmitter<boolean> = new EventEmitter<boolean>();
  public setADAS: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor() { }
}
