import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

@Injectable()
export class Subscription {
    constructor(private http: Http) {
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
        this.http.get("http://sportspipservice.cloudapp.net:10106/IMobile/users/{" + firstName + "}/{" + lastName + "}/{" + email + "}/{@abc123}/{0}")
            .subscribe(data => {
                console.log(data.text());
            })
        // var user =
        //     { FirstName: firstName, LastName: lastName, Email: email, Password: "@abc123" };
        // return user;
    }

    LoginAsync(email, password) {

        var user = { FirstName: "Sachin", LastName: "Tendulkar", Email: email }
        return user;
    }

}