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
export interface ITeams{
    id:string,
    Date: string,
    TeamName: string,
    TeamThumbnail: any,
    Contact:string,
    Status:string,
    Country:string,
    Role:string,
    SchoolName: string,
    UserName:string,
}
export interface ICoaches{
    id:string,
    CoachName:string,
    CoachTitle:string,
    CoachImage:any,
    College:string,
    Dates: string,
    AboutCoach:string,
}
export interface IPlayer{
    id:string,
    PlayerName:string,
    PlayerRole:string,
    PlayerImage:any,
    PlayerHeight:string,
    PlayerWeight:string,
    PlayerClass:string,
    PlayerHometown:string,
    AboutPlayer:string
}
export interface IRoster{
    id:string,
    Sport:string,
    Level:string,
    Program:string,
    Year:string,
    Name:string,
    PlayerNumber:string,
    PlayerLevel:string,
    Address:string,
    School:string

}