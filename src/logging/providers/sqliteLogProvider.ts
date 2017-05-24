import { Injectable } from '@angular/core';
import { AProvider } from '../aProvider';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'
import { Platform } from 'ionic-angular';

@Injectable()
export class SqliteLogProvider extends AProvider {
    private sqlite: SQLite;
    constructor(private platform: Platform) {
        super();
        this.sqlite = new SQLite();
    }

    write(log: string) {
        //For showing logs on console
        console.log(log);
        //For collecting logs data
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                var databaseConfig;
                if (this.platform.is('android')) {
                    databaseConfig = { name: "data.db", location: "default" }
                }
                else if (this.platform.is('ios')) {
                    databaseConfig = { name: "data.db", iosDatabaseLocation: 'Documents' }
                }

                this.sqlite.create(databaseConfig)
                    .then((db: SQLiteObject) => {
                        var dtLog = new Date().toUTCString();

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
                    })
                    .catch(e => console.error("Unable to open database", e));
            }
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