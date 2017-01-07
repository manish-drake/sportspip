import { Injectable } from "@angular/core";
import { HttpService } from '../Services/httpService';

@Injectable()
export class Subscription {
    constructor(private httpService: HttpService) {
        console.log("stubs......")
    }

    GetChannelsAsync(userid) {
        var channelList = [];
        return this.httpService.GetFileFromServer("http://sportspipservice.cloudapp.net:10106/IMobile/channels/list?uid=" + userid)
            .then((res) => {
                var data = JSON.parse(res);
                data.Returns.forEach(ch => {
                    var ChList = { ChannelName: ch.Name, IsPrivate: ch.IsPrivate, Description: ch.Description }
                    channelList.push(ChList);
                });
                return channelList;
            })
    }

    GetSubscriptionList(userid) {
        var subscriptionList = [];
        return this.httpService.GetFileFromServer("http://sportspipservice.cloudapp.net:10106/IMobile/subscriptions/list?uid=" + userid)
            .then((res) => {
                var data = JSON.parse(res);
                data.Returns.forEach(sbchn => {
                    var subscription =
                        {
                            ChannelName: sbchn.Channel.Name,
                            Description: sbchn.Channel.Description,
                            IsAuthorized: sbchn.IsAuthorized,
                            DtExpiry: sbchn.DtExpiry,
                            IsMatrixUploader: sbchn.IsMatrixUploader
                        }
                    subscriptionList.push(subscription);
                });
                return subscriptionList;
            })
    }

    RequestSubscriptionAsync(channelName, userid) {
        return this.httpService.GetFileFromServer("http://sportspipservice.cloudapp.net:10106/IMobile/subscriptions/create/" + channelName + "?uid=" + userid)
            .then((res) => {
                var data = JSON.parse(res);
                var subscription =
                    {
                        ChannelName: channelName,
                        Description: data.Returns.Channel.Description,
                        IsAuthorized: data.Returns.IsAuthorized,
                        DtExpiry: data.Returns.DtExpiry,
                        IsMatrixUploader: data.Returns.IsMatrixUploader
                    };
                return subscription;
            })

        // var subscription =
        //     {
        //         ChannelName: channelName,
        //         Description: "Tennis",
        //         IsAuthorized: true,
        //         DtExpiry: new Date(),
        //         IsMatrixUploader: true
        //     };
        // return subscription;
    }

    RemoveSubscriptionAsync(channelName, userid) {
        return this.httpService.GetFileFromServer("http://sportspipservice.cloudapp.net:10106/IMobile/subscriptions/remove/" + channelName + "?uid=" + userid)
            .then((res) => {
                return true;
            })
    }

    RegisterAsync(firstName, lastName, email) {
        console.log(firstName, lastName, email);
        return this.httpService.GetFileFromServer("http://sportspipservice.cloudapp.net:10106/IMobile/users/" + firstName + "/" + lastName + "/" + email + "/abc123/0")
            .then((res) => {
                var data = JSON.parse(res);
                var user = { Name: firstName + " " + lastName, FirstName: firstName, LastName: lastName, Email: email, UserId: data.ID };
                return user;
            });
    }

    LoginAsync(email, password) {
        return this.httpService.GetFileFromServer("http://sportspipservice.cloudapp.net:10106/IMobile/users/" + email + "/" + password + "/0")
            .then((res) => {
                var data = JSON.parse(res);
                var user = { Name: data.Returns.Name, FirstName: data.Returns.FirstName, LastName: data.Returns.LastName, Email: data.Returns.Email, UserId: data.Returns.ID }
                return user;
            })
    }

}