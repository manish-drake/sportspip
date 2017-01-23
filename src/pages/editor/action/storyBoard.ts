// import { Injectable } from "@angular/core";
// import { Utils } from '../../../Services/common/utils';


// @Injectable()
// export class StoryBoard {
//     markersDirectory = [];
//     index = 0;
//     constructor(private utils: Utils) {

//     }

//     PlayStoryBoard(model) {
//         var marker = this.markers.find(x => x.checked == true)
//         if (marker != undefined && this.index == 0) {
//             this.markersobjects = [];
//             this.markersDirectory = [];
//             this.InvalidateObjects(marker);
//             this.index = 1;
//         }
//         else if (marker == undefined) {
//             this.markers.forEach(mar => {
//                 this.InvalidateObjects(mar);
//                 this.RemoveObjects();
//             });
//         }
//     }

//     RemoveObjects() {
//         var objects = this.markersobjects.find(x => this.formatTime(this.video.currentTime) >= x.totalDuartion)
//         if (objects != null) {
//             this.markersobjects.splice(objects, 1);
//         }
//     }

//     InvalidateObjects(selctedMarker) {
//         var objs = selctedMarker["Marker.Objects"];
//         if (selctedMarker._Position == "00:00:00") {
//             if (this.IsMarkerObjectExist(selctedMarker) == -1) {
//                 var durationMS = this.formatDurationInMiliSecond(selctedMarker._Duration);
//                 var positionMS = 0;
//                 var totalDuartion = this.formatTime((durationMS + positionMS) / 10000000);
//                 this.markersDirectory.push(selctedMarker);
//                 for (var key in objs) {
//                     if (!objs.hasOwnProperty(key)) continue;
//                     var val = objs[key];
//                     if (val instanceof Array) val.forEach(val => { this.markersobjects.push({ key, val, totalDuartion }); });
//                     else this.markersobjects.push({ key, val, totalDuartion });
//                 }
//             }
//         }
//         else {
//             var durationMS = this.formatDurationInMiliSecond(selctedMarker._Duration);
//             var positionMS = this.formatPoistionInMiliSecond(selctedMarker._Position);
//             if (this.formatTime(this.video.currentTime) >= selctedMarker._Position) {
//                 var totalDuartion = this.formatTime((durationMS + positionMS) / 10000000);

//                 if (this.IsMarkerObjectExist(selctedMarker) == -1) {
//                     for (var key in objs) {
//                         if (!objs.hasOwnProperty(key)) continue;
//                         var val = objs[key];

//                         if (val instanceof Array) {
//                             val.forEach(val => {
//                                 this.markersobjects.push({ key, val });
//                             });
//                         }
//                         else {
//                             this.markersDirectory.push(selctedMarker);
//                             this.markersobjects.push({ key, val, totalDuartion });
//                         }
//                     }
//                 }
//             }
//         }
//     }

//     IsMarkerObjectExist(selctedMarker) {
//         return this.markersDirectory.indexOf(selctedMarker)
//     }


//     formatPoistionInMiliSecond(pos) {
//         return this.utils.formatPoistionInMiliSecond(pos);
//     }

//     formatDurationInMiliSecond(dur) {
//         return this.utils.formatDurationInMiliSecond(dur);
//     }

//     formatTime(time) {
//         return this.utils.formatTime(time);
//     }

// }