import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberGeneratorService {

  randomNumbers: number[] = [];

  constructor() { }


  getRandomNumbers(highest: number, size: number): number[]{
    this.randomNumbers = []
    for(let i = 0; i<size; i++){
      const num:number = Math.round(Math.random()*highest);
      this.randomNumbers.push(num);
    }
    return this.randomNumbers;
  }

}
