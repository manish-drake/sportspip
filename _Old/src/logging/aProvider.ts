export abstract class AProvider {

    abstract write(log: string);

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