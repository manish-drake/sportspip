export interface ILevel {
    id: string,
    level: string,
    color: string,
    checked: boolean,
}
export interface IProgram {
    id: string,
    program: string,
    color: string,
    checked: boolean,
}
export interface IFootball {
    id: string,
    EventDate: string,
    EventName: string,
    EventThumbnail: any,
}
export interface ITeams {
    id: string,
    date: string,
    teamName: string,
    teamThumbnail: any,
    contact: string,
    status: string,
    country: string,
    role: string,
    schoolName: string,
    userName: string,
}
export interface ICoaches {
    id: string,
    coachName: string,
    coachTitle: string,
    coachImage: any,
    college: string,
    dates: string,
    aboutCoach: string,
}
export interface IPlayer {
    id: string,
    playerName: string,
    playerRole: string,
    playerImage: any,
    playerHeight: string,
    playerWeight: string,
    playerClass: string,
    playerHometown: string,
    aboutPlayer: string
}
export interface IRoster {
    id: string,
    sport: string,
    level: string,
    program: string,
    year: string,
    name: string,
    playerNumber: string,
    playerLevel: string,
    address: string,
    school: string,
    rosterId:number,

}
export interface ISchedule {
    id: string,
    url: string,
    title: string,
    start: string,
    end: string,
    allDay: boolean,
    calendar: string

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

export class Runs {
    Runs_0: string[];
    Runs_1: string[];
    Runs_2: string[];
    Runs_4: string[];
    Runs_6: string[];
}
export class pivoteT {
    Batsman_18: Runs;
    Batsman_45: Runs;
    Bowler_15: Runs;
    Bowler_22: Runs;
}
export class events {
    id: number;
    eventName: string;
    eventDate: string;
    eventThumbnail: any;
    state: string;
}

export interface Interpretation {
    firstName: string;
    lastName: string;
    quote: string;
    interpretation: string;
  }

  export interface Character {
    firstName: string;
    lastName: string;
    favQuote: string;
    job?: string;
    age?: number;
    address?: any;
    isHidden?: boolean;
    interpretation?: string;
  }

  export class School {
    name: string;
    checked: boolean; 
    district: string
    subCategory: Subcategory[];
} 

export class Subcategory {
    id: number;
    name: string;
    checked: boolean;
}
  