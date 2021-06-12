export interface ILevel { 
    id:string,
    level:string,
    color:string,
    checked:boolean,
}
export interface IProgram { 
    id:string,
    program:string,
    color:string,
    checked:boolean,
}
export interface IFootball{
    id:string,
    EventDate: string,
    EventName: string,
    EventThumbnail: any,
}
export interface ICoaches{
    id:string,
    CoachName:string,
    CoachTitle:string,
    CoachImage:any,
}
export interface IPlayer{
    id:string,
    PlayerName:string,
    PlayerRole:string,
    PlayerImage:any,
}