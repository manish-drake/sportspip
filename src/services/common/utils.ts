//This would be a static service class with functions that are all static. It shouldbe used for creating general purpose functions
import { Injectable } from "@angular/core";
import 'rxjs/Rx';

@Injectable()
export class Utils {
   constructor(){}

   FormatDate(value) {
        var st = value;
        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        var date = new Date(st.replace(pattern, '$1-$2-$3 $4:$5:$6'));
        return date.toDateString().slice(4, 10)

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
}