import { Capture } from './capture';
import { PIP } from './pip';

export class Content{
    constructor(){

    }
  

public _Capture : Capture;
public get Capture() : Capture {
    return this._Capture;
}
public set Capture(v : Capture) {
    this._Capture = v;
}

  
  public _PIP : PIP;
  public get PIP() : PIP {
      return this._PIP;
  }
  public set PIP(v : PIP) {
      this._PIP = v;
  }
    

}