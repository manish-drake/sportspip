import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

@Injectable()
export class Subscription {
    constructor(private http: Http) {
        console.log("stubs......")
    }

    GetChannelsAsync(userid) {
        var channelList = [];
        return this.http.get("http://sportspipservice.cloudapp.net:10106/IMobile/channels/list?uid=" + userid + "")
            .map(res => res.json())
            .map(us => {
                var data = JSON.parse(us);
                data.Returns.forEach(ch => {
                    var ChList = { ChannelName: ch.Name, IsPrivate: ch.IsPrivate, Description: ch.Description }
                    channelList.push(ChList);
                });
                return channelList;
            }).toPromise();
    }

    GetSubscriptionList(userid) {
        var subscriptionList = [];
        return this.http.get("http://sportspipservice.cloudapp.net:10106/IMobile/subscriptions/list?uid=" + userid + "")
            .map(res => res.json())
            .map(us => {
                var data = JSON.parse(us);
                data.Returns.forEach(sbchn => {
                    var subscription =
                        { ChannelName: sbchn.Channel.Name, Description: sbchn.Channel.Description, IsAuthorized: sbchn.IsAuthorized, DtExpiry: sbchn.DtExpiry, IsMatrixUploader: sbchn.IsMatrixUploader }
                    subscriptionList.push(subscription);
                });
                return subscriptionList;
            }).toPromise();
    }

    RequestSubscriptionAsync(channelName, userid) {
        // return this.http.get("http://sportspipservice.cloudapp.net:10106/IMobile/subscriptions/" + channelName + "?uid=" + userid + "")
        //     .map(res => res.json())
        //     .map(us => {
        //         var data = JSON.parse(us);
        //         console.log(data);
        //         var subscription =
        //             { ChannelName: channelName, IsPrivate: false, Description: "Tennis,Badminton,serve", IsAuthorized: true, DtExpiry: new Date(), IsMatrixUploader: false };
        //         return subscription;
        //     }).toPromise();

        var subscription =
            { ChannelName: channelName, IsPrivate: false, Description: "Tennis,Badminton,serve", IsAuthorized: true, DtExpiry: new Date(), IsMatrixUploader: false };
        return subscription;

    }

    RegisterAsync(firstName, lastName, email) {
        console.log(firstName, lastName, email);
        return this.http.get("http://sportspipservice.cloudapp.net:10106/IMobile/users/" + firstName + "/" + lastName + "/" + email + "/abc123/0")
            .map(res => res.json())
            .map(us => {
                console.log(us);
                var data = JSON.parse(us);
                console.log(data);
                var user = { Name: firstName + " " + lastName, FirstName: firstName, LastName: lastName, Email: email, UserId: data.ID };
                return user;
            }).toPromise();
    }

    LoginAsync(email, password) {
        return this.http.get("http://sportspipservice.cloudapp.net:10106/IMobile/users/" + email + "/" + password + "/0")
            .map(res => res.json())
            .map(us => {
                var data = JSON.parse(us);
                console.log(data);
                var user = { Name: data.Returns.Name, FirstName: data.Returns.FirstName, LastName: data.Returns.LastName, Email: data.Returns.Email, UserId: data.Returns.ID }
                return user;
            }).toPromise();
    }

}