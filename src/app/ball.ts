export class Ball {
  id: number;
  state: string;
  possibleWhite: Ball[] = [];
  possibleBlack: Ball[] = [];

  constructor(id: number, state: string) {
    this.id = id;
    this.state = state;
  }

  changeState() {
    if (this.state == 'green-light') {
      this.state = 'white';
    }
  }
}
