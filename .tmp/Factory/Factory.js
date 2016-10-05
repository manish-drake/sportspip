import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { File } from 'ionic-native';
import 'rxjs/Rx';
export var Factory = (function () {
    function Factory(http, platform) {
        this.http = http;
        this.platform = platform;
    }
    Factory.prototype.SaveRoamingHeader = function (content, channel, sport, matrixName) {
        this.SaveServerHeader(content, channel, sport, matrixName, "Matrices");
    };
    Factory.prototype.SaveServerHeader = function (content, channel, sport, matrixName, typeFolder) {
        this.platform.ready().then(function () {
            var fs = cordova.file.dataDirectory;
            //create Server Folder
            File.createDir(fs, "Server", true).then(function (success) {
                var serverFolder = fs + "Server/";
                File.createDir(serverFolder, channel, true).then(function () {
                    var channelFolder = serverFolder + channel + "/";
                    File.createDir(channelFolder, sport, true).then(function () {
                        var sportFolder = channelFolder + sport + "/";
                        File.createDir(sportFolder, typeFolder, true).then(function () {
                            var contentFolder = sportFolder + typeFolder + "/";
                            File.createDir(contentFolder, matrixName, true).then(function (success) {
                                var fileLocation = contentFolder + matrixName;
                                File.createFile(fileLocation, "Header.xml", true).then(function () {
                                    File.writeFile(fileLocation, "Header.xml", content, true)
                                        .then(function (success) {
                                        alert("created");
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };
    Factory.prototype.SaveLocalHeader = function (content, channel, sport, matrixName, typeFolder) {
        this.platform.ready().then(function () {
            var fs = cordova.file.dataDirectory;
            //create Server Folder
            File.createDir(fs, "Local", true).then(function (success) {
                var serverFolder = fs + "Local/";
                File.createDir(serverFolder, channel, true).then(function () {
                    var channelFolder = serverFolder + channel + "/";
                    File.createDir(channelFolder, sport, true).then(function () {
                        var sportFolder = channelFolder + sport + "/";
                        File.createDir(sportFolder, typeFolder, true).then(function () {
                            var contentFolder = sportFolder + typeFolder + "/";
                            File.createDir(contentFolder, matrixName, true).then(function (success) {
                                var fileLocation = contentFolder + matrixName;
                                File.createFile(fileLocation, "Header.xml", true).then(function () {
                                    File.writeFile(fileLocation, "Header.xml", content, true)
                                        .then(function (success) {
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };
    Factory.prototype.DeleteServerHeader = function (DirName) {
        this.platform.ready().then(function () {
            var headerFolder = cordova.file.dataDirectory + "Server/Mayfair/Tennis/Matrices/";
            File.removeRecursively(headerFolder, DirName).then(function () {
                alert("Deleted successfully");
            });
        });
    };
    Factory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Factory.ctorParameters = [
        { type: Http, },
        { type: Platform, },
    ];
    return Factory;
}());
