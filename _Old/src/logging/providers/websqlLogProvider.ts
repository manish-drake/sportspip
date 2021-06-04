import { AProvider } from '../aProvider';

export class WebSqlLogProvider extends AProvider {
    write(log: string) {

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