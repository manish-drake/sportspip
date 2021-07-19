export class EventRef {
    id? = undefined;
    title: string = '';
    start: string;
    end: string;
    home = false;
    schedule: '';
    extendedProps = {
      location: '',
      description: '',
      addGuest: []
    };
  }
  