
export class Capture{
    constructor(){

    }

    
    private _Kernel : string;
    public get Kernel() : string {
        return this._Kernel;
    }
    public set Kernel(v : string) {
        this._Kernel = v;
    }

    
    private _Title : string;
    public get Title() : string {
        return this._Title;
    }
    public set Title(v : string) {
        this._Title = v;
    }
    
    
    private _Name : string;
    public get Name() : string {
        return this._Name;
    }
    public set Name(v : string) {
        this._Name = v;
    }
    
    
    private _IsActive : Boolean;
    public get IsActive() : Boolean {
        return this._IsActive;
    }
    public set IsActive(v : Boolean) {
        this._IsActive = v;
    }

   
    

}