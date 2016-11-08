import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';

@Injectable()
export class Subscription {
    constructor() {
        console.log("stubs......")
    }

    GetChannelsAsync() {
        var channelsList = [
            { ChannelName: "SportsPIP", IsPrivate: false, Description: "" },
            { ChannelName: "Harvest", IsPrivate: false, Description: "" },
            { ChannelName: "Mayfair", IsPrivate: false, Description: "" },
        ];
        return channelsList
    }

    GetSubscriptionList() {
        var subscription = [
            { ChannelName: "SportsPIP", IsPrivate: false, Description: "Football-Handball", IsAuthorized: true, DtExpiry: new Date(), IsMatrixUploader: true },
            { ChannelName: "Harvest", IsPrivate: false, Description: "Tennis,Badminton", IsAuthorized: true, DtExpiry: new Date(), IsMatrixUploader: false }
        ];

        return subscription;
    }

    RequestSubscriptionAsync(channelName) {
        var subscription =
            { ChannelName: channelName, IsPrivate: false, Description: "Tennis,Badminton,serve", IsAuthorized: true, DtExpiry: new Date(), IsMatrixUploader: false };
        return subscription;
    }

    RegisterAsync(firstName, lastName, email) {
        var user =
            { FirstName: firstName, LastName: lastName, Email: email, Password: "@abc123" };
        return user;
    }

    LoginAsync(email, password) {
        if (!email)
            var user = { FirstName: "Sachin", LastName: "Tendulkar", Email: email }
        return user;
    }

}