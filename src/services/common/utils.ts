//This would be a static service class with functions that are all static. It shouldbe used for creating general purpose functions
import { Injectable } from "@angular/core";
import { HttpService } from '../../Services/httpService';
import { Package } from '../../Services/Package';
import { Core } from '../../Services/core';
import 'rxjs/Rx';

@Injectable()
export class Utils {
    constructor(private httpService: HttpService, private packages: Package, private core: Core) { }

    FormatDate(value) {
        var st = value;
        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        var date = new Date(st.replace(pattern, '$1-$2-$3 $4:$5:$6'));
        return date.toDateString().slice(4, 10)

    }

    formatTime(time) {
        if (time != null) {
            var hrs = Math.floor(time / 3600);
            var hours = (hrs >= 10) ? hrs : "0" + hrs;
            var min = Math.floor(time / 60);
            var minutes = (min >= 10) ? min : "0" + min;
            var sec = Math.floor(time % 60);
            var seconds = (sec >= 10) ? sec : "0" + sec;
            var milliseconds = time.toFixed(2).substr(-2);
            return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
        }
    }

    FormatDuration(dur) {
        if (dur != null) {
            var hrs = Number(dur.slice(0, 2));
            var h = (hrs == 0) ? "" : hrs + 'h ';
            var mins = Number(dur.slice(3, 5));
            var m = (mins == 0) ? "" : mins + 'm ';
            var secs = Number(dur.slice(6, 8));
            var s = secs + 's';
            return h + m + s;
        }
        else {
            return "";
        }
    }

    static formatPoistionInMiliSecond(pos) {
        if (pos == "00:00:00") pos = "00:00:00.000000";
        var positionInMilliseconds = Number(pos.slice(1, 2)) * 36000000000 + Number(pos.slice(4, 5)) * 60000000 + Number(pos.slice(7, 8)) * 10000000 + Number(pos.substr(-7));
        return positionInMilliseconds;

    }

   static formatDurationInMiliSecond(dur) {
        if (dur != undefined) {
            if (dur.length == 16) {
                var durationInMilliseconds = Number(dur.slice(1, 2)) * 36000000000 + Number(dur.slice(4, 5)) * 60000000 + Number(dur.slice(7, 8)) * 10000000 + Number(dur.substr(-7));
                return durationInMilliseconds;
            }
            else {
                var durationInMilliseconds = Number(dur.slice(1, 2)) * 36000000000 + Number(dur.slice(4, 5)) * 60000000 + Number(dur.slice(7, 8)) * 10000000 + Number(dur.substr(-2)) * 100000;
                return durationInMilliseconds;
            }
        }
    }

    GetserverHeader(channelname) {
        console.log("saving headers list file..");
        this.httpService.GetFileFromServer("http://sportspipservice.cloudapp.net:10106/IMobile/getmtxhdrs")
            .then(res => {
                var HeaderList = JSON.parse(res.toString());
                this.CreateHeaders(HeaderList, channelname);
            });
    }

    //server header
    CreateHeaders(headerList, channel) {
        var Header = [];
        headerList.forEach(header => {
            var result = header;
            if (result.ChannelName == channel) {
                var item = {
                    Title: result.Title, DateCreated: result.DateCreated, Name: result.UploadIndex, Channel: result.ChannelName,
                    ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadIndex, Duration: result.Duration,
                    Views: result.Views
                };
                Header.push(item);
            }
        });
        this.SaveDownloadedHeaders(Header);
    }

    //Save Downloaded Header
    SaveDownloadedHeaders(HeaderList) {
        HeaderList.forEach((header) => {
            console.log(header);
            this.core.SaveServerHeader(header, header.Channel, header.Sport, header.Name, "Matrices").then((res) => {
                this.DownloadThumbnailAsync(header.Channel, header.Name);
            });
        })
    }

    DownloadThumbnailAsync(channelName, matrixName) {
        this.packages.DownloadThumbnailfromServer(channelName, matrixName);
    }
}