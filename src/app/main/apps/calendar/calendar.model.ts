export class EventRef {
  id ? = undefined;
  url: string;
  title = '';
  start: string;
  end: string;
  allDay = false;
  calendar: '';
  extendedProps = {
    location: '',
    description: '',
    addGuest: []
  };
}
