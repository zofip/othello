import { Injectable } from '@angular/core';

import { Ball } from './ball';
import { BALLS } from './mock-ball';

@Injectable()
export class BallService {
  getBalls(): Promise<Ball[]> {
    return Promise.resolve(BALLS);
  }
}
