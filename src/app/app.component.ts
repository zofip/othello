import { Component, OnInit } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import {
  BLACK,
  WHITE,
  GREEN,
  GREEN_LIGHT,
  LENGHT_MATRIX
} from './constants';

import { Ball } from './ball';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('state', [
      state('white', style({
        backgroundColor: 'white',
        transform: 'scale(1)'
      })),
      state('green', style({
        backgroundColor: 'green',
        transform: 'scale(1.1)'
      })),
      state('green-light', style({
        backgroundColor: '#009900',
        transform: 'scale(1.1)'
      })),
      state('black', style({
        backgroundColor: 'black',
        transform: 'scale(1.1)'
      })),
      transition('green-light => white', animate('100ms ease-in')),
      transition('white => green-light', animate('100ms ease-out'))
    ])
  ]
})
export class AppComponent {
  balls: Ball[][];
  countBallsWhite: number = 2;
  countBallsBlack: number = 2;

  constructor() { }

  ngOnInit() {
    this.getBalls();
    this.getPossibleMovements();
  }

  toggleState(ball: Ball) {
    if (ball.state == GREEN_LIGHT) {

      ball.changeState();
      this.countBallsWhite = this.countBallsWhite + 1;

      this.changeBlackToWhite(ball);
      this.resetBalls();
      this.getPossibleMovements()

      setTimeout(() => {
        this.playMinMax();
        this.resetBalls();
        this.getPossibleMovements();
      }, 3000);

    }
  }

  changeBlackToWhite(ball: Ball) {
    for (let itemBlack of ball.possibleWhite) {
      itemBlack.state = WHITE;
      this.countBallsWhite = this.countBallsWhite + 1;
      this.countBallsBlack = this.countBallsBlack - 1;
    }
  }

  changeWhiteToBlack(ball: Ball) {
    for (let itemBlack of ball.possibleBlack) {
      itemBlack.state = BLACK;
      this.countBallsWhite = this.countBallsWhite - 1;
      this.countBallsBlack = this.countBallsBlack + 1;
    }
  }

  getBalls() {
    this.balls = [];
    let count = 0;
    for (let row = 0; row < LENGHT_MATRIX; row++) {
      this.balls[row] = [];
      for (let column = 0; column < LENGHT_MATRIX; column++) {
        this.balls[row][column] = new Ball(count, GREEN);
        count++;
      }
    }
    this.balls[1][1]['state'] = WHITE;
    this.balls[1][2]['state'] = BLACK;
    this.balls[2][1]['state'] = BLACK;
    this.balls[2][2]['state'] = WHITE;
  }

  resetBalls() {
    for (let row = 0; row < LENGHT_MATRIX; row++) {
      for (let column = 0; column < LENGHT_MATRIX; column++) {
        let ball = this.balls[row][column];
        ball.possibleBlack = [];
        ball.possibleWhite = [];
        if (ball.state == GREEN_LIGHT) {
          ball.state = GREEN;
        }
      }
    }
  }

  // Get Max or Min by ball White/Black
  getPossibleMovements() {
    for (let row = 0; row < LENGHT_MATRIX; row++) {
      for (let column = 0; column < LENGHT_MATRIX; column++) {
        let ballValidate = this.balls[row][column];

        let ballsTransversalDown = [];
        let ballsTransversalUp = [];
        let ballsVerticalDown = [];
        let ballsVerticalUp = [];
        let ballsHorizontalLeft = [];
        let ballsHorizontalRight = [];

        if (ballValidate['state'] == WHITE) {
          this.validateTransversalDownW(ballsTransversalDown, row, column);
          this.validateTransversalUpW(ballsTransversalUp, row, column);
          this.validateVerticalDownW(ballsVerticalDown, row, column);
          this.validateVerticalUpW(ballsVerticalUp, row, column);
          this.validateHorizontalLeftW(ballsHorizontalLeft, row, column);
          this.validateHorizontalRightW(ballsHorizontalRight, row, column);
        } else if (ballValidate['state'] == BLACK) {
          this.validateTransversalDownB(ballsTransversalDown, row, column);
          this.validateTransversalUpB(ballsTransversalUp, row, column);
          this.validateVerticalDownB(ballsVerticalDown, row, column);
          this.validateVerticalUpB(ballsVerticalUp, row, column);
          this.validateHorizontalLeftB(ballsHorizontalLeft, row, column);
          this.validateHorizontalRightB(ballsHorizontalRight, row, column);
        }

      }
    }
  }

  playMinMax() {
    let selectedBall = this.getOneBlack();
    if (selectedBall != undefined) {
      let valid = selectedBall.possibleBlack.length - selectedBall.possibleWhite.length;
      for (let row = 0; row < LENGHT_MATRIX; row++) {
        for (let column = 0; column < LENGHT_MATRIX; column++) {
          let ball = this.balls[row][column];
          if (ball.possibleBlack.length > 0) {
            let validTemp = ball.possibleBlack.length - ball.possibleWhite.length
            if (validTemp > valid) {
              valid = validTemp;
              selectedBall = ball;
            }
          }
        }
      }
      selectedBall['state'] = BLACK;
      this.changeWhiteToBlack(selectedBall);
      this.countBallsBlack = this.countBallsBlack + 1;
    }
  }

  getOneBlack() {
    for (let row = 0; row < LENGHT_MATRIX; row++) {
      for (let column = 0; column < LENGHT_MATRIX; column++) {
        let ball = this.balls[row][column];
        if (ball.possibleBlack.length > 0) {
          return ball;
        }
      }
    }
  }

  // Functions for white ball
  validateTransversalDownW(ballsTransversalDown, row, column) {
    if (row < LENGHT_MATRIX - 1 && column > 0) {

      let row_t = row + 1;
      let column_t = 0;

      if (row == column) {
        column_t = column + 1;
      } else {
        column_t = column - 1;
      }

      let ballTemp = this.balls[row_t][column_t]
      if (ballTemp['state'] == BLACK) {
        ballsTransversalDown.push(ballTemp);
        this.validateTransversalDownW(ballsTransversalDown, row_t, column_t);
      } else if ((ballTemp['state'] != WHITE) && (ballsTransversalDown.length > 0)) {
        ballTemp['state'] = GREEN_LIGHT;
        this.validateRepeatItemsW(ballTemp, ballsTransversalDown);
      }

    }
    return;
  }

  validateTransversalUpW(ballsTransversalUp, row, column) {
    if (row > 0 && column < LENGHT_MATRIX - 1) {

      let row_t = row - 1;
      let column_t = 0;

      if (row == column) {
        column_t = column - 1;
      } else {
        column_t = column + 1;
      }

      let ballTemp = this.balls[row_t][column_t];
      if (ballTemp['state'] == BLACK) {
        ballsTransversalUp.push(ballTemp);
        this.validateTransversalUpW(ballsTransversalUp, row_t, column_t);
      } else if ((ballTemp['state'] != WHITE) && (ballsTransversalUp.length > 0)) {
        ballTemp['state'] = GREEN_LIGHT;
        this.validateRepeatItemsW(ballTemp, ballsTransversalUp);
      }
    }
    return;
  }

  validateVerticalDownW(ballsVerticalDown, row, column) {
    if (row < LENGHT_MATRIX - 1) {
      let rowDown = row + 1;
      let ballTemp = this.balls[rowDown][column];
      if (ballTemp['state'] == BLACK) {
        ballsVerticalDown.push(ballTemp);
        this.validateVerticalDownW(ballsVerticalDown, rowDown, column);
      } else if ((ballTemp['state'] != WHITE) && (ballsVerticalDown.length > 0)) {
        ballTemp['state'] = GREEN_LIGHT;
        this.validateRepeatItemsW(ballTemp, ballsVerticalDown);
      }
    }
    return;
  }

  validateVerticalUpW(ballsVerticalUp, row, column) {
    if (row > 0) {
      let rowUp = row - 1;
      let ballTemp = this.balls[rowUp][column];
      if (ballTemp['state'] == BLACK) {
        ballsVerticalUp.push(ballTemp);
        this.validateVerticalUpW(ballsVerticalUp, rowUp, column);
      } else if ((ballTemp['state'] != WHITE) && (ballsVerticalUp.length > 0)) {
        ballTemp['state'] = GREEN_LIGHT;
        this.validateRepeatItemsW(ballTemp, ballsVerticalUp);
      }
    }
    return;
  }

  validateHorizontalLeftW(ballsHorizontalLeft, row, column) {
    if (column > 0) {
      let columnLeft = column - 1;
      let ballTemp = this.balls[row][columnLeft];
      if (ballTemp['state'] == BLACK) {
        ballsHorizontalLeft.push(ballTemp);
        this.validateHorizontalLeftW(ballsHorizontalLeft, row, columnLeft);
      } else if ((ballTemp['state'] != WHITE) && (ballsHorizontalLeft.length > 0)) {
        ballTemp['state'] = GREEN_LIGHT;
        this.validateRepeatItemsW(ballTemp, ballsHorizontalLeft);
      }
    }
    return;
  }

  validateHorizontalRightW(ballsHorizontalRight, row, column) {
    if (column < LENGHT_MATRIX - 1) {
      let columnRight = column + 1;
      let ballTemp = this.balls[row][columnRight];
      if (ballTemp['state'] == BLACK) {
        ballsHorizontalRight.push(ballTemp);
        this.validateHorizontalRightW(ballsHorizontalRight, row, columnRight);
      } else if ((ballTemp['state'] != WHITE) && (ballsHorizontalRight.length > 0)) {
        ballTemp['state'] = GREEN_LIGHT;
        this.validateRepeatItemsW(ballTemp, ballsHorizontalRight);
      }
    }
    return;
  }

  // Functions for black ball
  validateTransversalDownB(ballsTransversalDown, row, column) {
    if (row < LENGHT_MATRIX - 1 && column > 0) {
      let row_t = row + 1;
      let column_t = 0;

      if (row == column) {
        column_t = column + 1;
      } else {
        column_t = column - 1;
      }

      let ballTemp = this.balls[row_t][column_t];
      if (ballTemp['state'] == WHITE) {
        ballsTransversalDown.push(ballTemp);
        this.validateTransversalDownB(ballsTransversalDown, row_t, column_t);
      } else if ((ballTemp['state'] != BLACK) && (ballsTransversalDown.length > 0)) {
        this.validateRepeatItemsB(ballTemp, ballsTransversalDown);
      }
    }
    return;
  }


  validateTransversalUpB(ballsTransversalUp, row, column) {
    if (row > 0 && column < LENGHT_MATRIX - 1) {
      let row_t = row - 1;
      let column_t = 0;

      if (row == column) {
        column_t = column - 1;
      } else {
        column_t = column + 1;
      }
      let ballTemp = this.balls[row_t][column_t];
      if (ballTemp['state'] == WHITE) {
        ballsTransversalUp.push(ballTemp);
        this.validateTransversalUpB(ballsTransversalUp, row_t, column_t);
      } else if ((ballTemp['state'] != BLACK) && (ballsTransversalUp.length > 0)) {
        this.validateRepeatItemsB(ballTemp, ballsTransversalUp);
      }
    }
    return;
  }

  validateVerticalDownB(ballsVerticalDown, row, column) {
    if (row < LENGHT_MATRIX - 1) {
      let rowDown = row + 1;
      let ballTemp = this.balls[rowDown][column];
      if (ballTemp['state'] == WHITE) {
        ballsVerticalDown.push(ballTemp);
        this.validateVerticalDownB(ballsVerticalDown, rowDown, column);
      } else if ((ballTemp['state'] != BLACK) && (ballsVerticalDown.length > 0)) {
        this.validateRepeatItemsB(ballTemp, ballsVerticalDown);
      }
    }
    return;
  }

  validateVerticalUpB(ballsVerticalUp, row, column) {
    if (row > 0) {
      let rowUp = row - 1;
      let ballTemp = this.balls[rowUp][column];
      if (ballTemp['state'] == WHITE) {
        ballsVerticalUp.push(ballTemp);
        this.validateVerticalUpB(ballsVerticalUp, rowUp, column);
      } else if ((ballTemp['state'] != BLACK) && (ballsVerticalUp.length > 0)) {
        this.validateRepeatItemsB(ballTemp, ballsVerticalUp);
      }
    }
    return;
  }

  validateHorizontalLeftB(ballsHorizontalLeft, row, column) {
    if (column > 0) {
      let columnLeft = column - 1;
      let ballTemp = this.balls[row][columnLeft];
      if (ballTemp['state'] == WHITE) {
        ballsHorizontalLeft.push(ballTemp);
        this.validateHorizontalLeftB(ballsHorizontalLeft, row, columnLeft);
      } else if ((ballTemp['state'] != BLACK) && (ballsHorizontalLeft.length > 0)) {
        this.validateRepeatItemsB(ballTemp, ballsHorizontalLeft);
      }
    }
    return;
  }

  validateHorizontalRightB(ballsHorizontalRight, row, column) {
    if (column < LENGHT_MATRIX - 1) {
      let columnRight = column + 1;
      let ballTemp = this.balls[row][columnRight];
      if (ballTemp['state'] == WHITE) {
        ballsHorizontalRight.push(ballTemp);
        this.validateHorizontalRightB(ballsHorizontalRight, row, columnRight);
      } else if ((ballTemp['state'] != BLACK) && (ballsHorizontalRight.length > 0)) {
        this.validateRepeatItemsB(ballTemp, ballsHorizontalRight);
      }
    }
    return;
  }

  validateRepeatItemsW(ball: Ball, balls: Ball[]) {
    if (ball.possibleWhite == undefined || ball.possibleWhite.length == 0) {
      ball.possibleWhite = balls;
    } else {
      for (let item of balls) {
        if (ball.possibleWhite.indexOf(item) == -1) {
          ball.possibleWhite.push(item);
        }
      }
    }
  }

  validateRepeatItemsB(ball: Ball, balls: Ball[]) {
    if (ball.possibleBlack == undefined || ball.possibleBlack.length == 0) {
      ball.possibleBlack = balls;
    } else {
      for (let item of balls) {
        if (ball.possibleBlack.indexOf(item) == -1) {
          ball.possibleBlack.push(item);
        }
      }
    }
  }

}
