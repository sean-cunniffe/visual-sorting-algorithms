import {Component, OnInit} from '@angular/core';
import {NumberGeneratorService} from '../../services/number-generator.service';

@Component({
  selector: 'app-bubble-sort',
  templateUrl: './bubble-sort.component.html',
  styleUrls: ['./bubble-sort.component.css']
})
export class BubbleSortComponent implements OnInit {

  randomNumberArray: number[] = [];
  sortType: string = "Quick Sort";
  constructor(private numberService: NumberGeneratorService) {
  }

  ngOnInit(): void {
    this.generateRandomNumberArray(100, this.sizeOfArray);
  }

  generateRandomNumberArray(highest: number, size: number) {
    this.randomNumberArray = this.numberService.getRandomNumbers(highest, size);
    this.iteration = 0;
    if (this.functionId > 0) {
      clearInterval(this.functionId);
    }
  }

  iterationTime: number = 10;
  iteration: number = 0;
  index: number = 0;
  functionId: number = -1;
  sizeOfArray: number = 20;

  bubbleSortArray(numbers: number[]) {
    this.iteration = 0;
    let index = 0;
    let id = setInterval(
      (numbers: number[]) => {
        if (index < numbers.length) {
          if (numbers[index] > numbers[index + 1]) {
            this.swapNumbers(index, index + 1, numbers);
          }
          index++;
        } else {
          this.iteration++;
          index = 0;
        }

        if (numbers.length === this.iteration) {
          clearInterval(id);
          this.disableSortButton(false);
        }
      },
      this.iterationTime,
      numbers);

    // this.functionId = setInterval(sort, this.iterationTime, this.iteration, numbers);


  }

  quickSortArray(numbers: number[], firstIndex: number, lastIndex: number) {

    let id = setInterval(() =>
    {
    //pick pivot
    let pivot = this.pickPivot(numbers, firstIndex, lastIndex);
    console.log(`Pivot: ${pivot}(${numbers[pivot]}) firstIndex: ${firstIndex}(${numbers[firstIndex]}) lastIndex ${lastIndex}(${numbers[lastIndex]})`);
    console.log(numbers);
    //move pivot to end
    this.moveNum(lastIndex, pivot, numbers);


    //get first largest than pivot from left
    let largest = this.firstLargest(numbers, firstIndex, lastIndex);
    //get first smallest than pivot from right
    let smallest = this.firstSmallest(numbers, firstIndex, lastIndex);
    if (largest > smallest) {
      //swap pivot and largest values
      this.swapNumbers(largest, lastIndex, numbers);
      //new subArray firstIndex - pivot    pivot+1 - lastIndex
      if (largest - firstIndex > 1) {
        this.quickSortArray(numbers, firstIndex, largest);
      } else if (largest - firstIndex == 1 && numbers[firstIndex] > numbers[largest]) {
        // if theres two elements left swap them if left one is bigger
        this.swapNumbers(firstIndex, largest, numbers);
      }
      if (lastIndex - (largest + 1) > 1) {
        console.log("starting quick of second half");
        this.quickSortArray(numbers, largest + 1, lastIndex);
      } else if (lastIndex - (largest + 1) == 1 && numbers[largest + 1] > numbers[lastIndex]) {
        // if theres two elements left swap them if left one is bigger
        this.swapNumbers(largest + 1, lastIndex, numbers);
      }
      clearInterval(id);
      return;
    } else {
      this.swapNumbers(largest, smallest, numbers);
    }
  },this.iterationTime);
  }

  private disableSortButton(bool: boolean) {
    const element = <HTMLInputElement> document.getElementById('sortButton');
    element.disabled = bool;
  }

  setArraySize(sizeOfArray: number) {
    this.sizeOfArray = sizeOfArray;
    console.log(sizeOfArray);
  }

  /**
   * picks median pivot between the first, last and middle index
   * picks between two indexes of an array
   * @param numbers
   * @param firstIndex
   * @param lastIndex
   */
  pickPivot(numbers: number[], firstIndex: number, lastIndex: number): number {
    const pos1 = firstIndex;
    const pos3 = lastIndex;
    const pos2 = Math.round((lastIndex - firstIndex) / 2)+firstIndex;
    if (numbers[pos1] > numbers[pos2]) {
      this.swapNumbers(pos1, pos2, numbers);
    }
    if (numbers[pos2] > numbers[pos3]) {
      this.swapNumbers(pos2, pos3, numbers);
    }
    if (numbers[pos1] > numbers[pos2]) {
      this.swapNumbers(pos1, pos2, numbers);
    }
    return pos2;
  }

  private swapNumbers(index: number, index2: number, numbers: number[]) {
    let tempNum = numbers[index];
    numbers[index] = numbers[index2];
    numbers[index2] = tempNum;
  }

  private moveNum(moveToIndex: number, moveFromIndex: number, numbers: number[]) {
    let tempNum: number = numbers[moveFromIndex];
    numbers.splice(moveFromIndex, 1);
    numbers.splice(moveToIndex, 0, tempNum);
  }

  /**
   * return index of largest from left given the pivot is the last element
   * returns -1 if nothing found
   * @param numbers
   * @param firstIndex
   * @param lastIndex
   * @private
   */
  private firstLargest(numbers: number[], firstIndex: number, lastIndex: number): number {
    //pivot is at the very end 'lastIndex'
    const pivot: number = numbers[lastIndex];
    for (let i = firstIndex; i < lastIndex; i++) {
      if (numbers[i] >= pivot) {
        return i;
      }
    }
    return -1;
  }

  /**
   * return index of smallest from the right
   * returns -1 if none found
   * @param numbers
   * @private
   */
  private firstSmallest(numbers: number[], firstIndex: number, lastIndex: number): number {
    const pivot: number = numbers[lastIndex];
    for (let i = lastIndex - 1; i >= firstIndex; i--) {
      if (numbers[i] < pivot) {
        return i;
      }
    }
    return -1;
  }

  setSortType(value: string) {
    this.sortType = value;
  }

  sort(randomNumberArray: number[]) {
    this.disableSortButton(true);
    switch (this.sortType){
      case "Quick Sort" : this.quickSortArray(randomNumberArray,0,randomNumberArray.length-1);break;
      case "Bubble Sort" : this.bubbleSortArray(randomNumberArray);break;
    }
    this.disableSortButton(false);
  }
}

