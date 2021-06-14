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
export interface ISchedule{
    id:string,
    url:string,
    title:string,
    start:string,
    end:string,
    allDay:boolean,
    calendar:string

}
export class Delivery {
    Session: string;
    DeliveryTime: number;
    LeadTime: number;
    LagTime: number;
    DeliveryCounter: number;
    BowlerNumber: number;
    BatsmanNumber: number;
    Runs: number;

}

export class Runs
{
    Runs_0: string[];
    Runs_1: string[];
    Runs_2: string[];
    Runs_4: string[];
    Runs_6: string[];
}
export class pivoteT
{   
    Batsman_18: Runs;
    Batsman_45: Runs;
    Bowler_15: Runs;
    Bowler_22: Runs;    
} 
export class events
{
    id : number;
    EventName : string;
    EventDate:string;
    EventThumbnail : any;
    State:string;
}
