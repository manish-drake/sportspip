import { Content } from './content';
export class View{
    constructor(){

    }

    
    public _name : string;
    public get name() : string {
        return this._name;
    }
    public set name(v : string) {
        this._name = v;
    }
    
    
    public _Source : string;
    public get Source() : string {
        return this._Source;
    }
    public set Source(v : string) {
        this._Source = v;
    }
    
    
    public _Title : string;
    public get Title() : string {
        return this._Title;
    }
    public set Title(v : string) {
        this._Title = v;
    }

    
    public _Content : Content;
    public get Content() : Content {
        return this._Content;
    }
    public set Content(v : Content) {
        this._Content = v;
    }
    
    
}