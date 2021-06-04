import { AProvider } from '../aProvider';

export class ConsoleLogProvider implements AProvider {

    constructor() {

    }
    write(log: string) {
        console.log(log);
    }


    readLast(count: number): string[] {
        return new Array<string>();
    }

    readBefore(dateTime: Date): string[] {
        return new Array<string>();
    }

    readAll(): string[] {
        return new Array<string>();
    }

    removeAll() { }
}