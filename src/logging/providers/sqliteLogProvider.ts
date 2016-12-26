import { Injectable } from '@angular/core';
import { AProvider } from '../aProvider';
import { SQLite } from 'ionic-native'
import { Platform } from 'ionic-angular';

@Injectable()
export class SqliteLogProvider extends AProvider {
    private _sqlite: SQLite;
    constructor(private _platform: Platform) {
        super();
        this._sqlite = new SQLite();
    }
    write(log: string) {
        //For showing logs on console
        console.log(log);
        //For collecting logs data
        this._platform.ready().then(() => {
            let db = new SQLite();
            db.openDatabase({
                name: "data.db",
                location: "default"
            }).then(() => {
                var dtLog = new Date().toDateString();

                db.executeSql("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, dtLog TEXT, message TEXT)", {}).then((data) => {
                    // console.log("TABLE CREATED: ");
                    db.executeSql("INSERT INTO logs (dtLog, message) VALUES ('" + dtLog + "', '" + log + "')", {}).then((data) => {
                        // console.log("LOG CREATED: ", data);
                    }, (error) => {
                        console.error("Unable to execute sql", error);
                    })
                }, (error) => {
                    console.error("Unable to execute sql", error);
                })
            }, (error) => {
                console.error("Unable to open database", error);
            });
        });
    }
    readLast(count: number): string[] {
        return [];
    }
    readBefore(dateTime: Date): string[] {
        return [];
    }
    readAll(): string[] {
        return [];
    }
    removeAll() {

    }

}