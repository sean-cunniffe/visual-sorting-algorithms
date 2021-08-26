import {Component, OnInit} from '@angular/core';
import {NumberGeneratorService} from '../../services/number-generator.service';

@Component({
  selector: 'app-bubble-sort',
  templateUrl: './bubble-sort.component.html',
  styleUrls: ['./bubble-sort.component.css']
})
export class BubbleSortComponent implements OnInit {

  constructor(private numberService: NumberGeneratorService) {
  }

  processText = '';

  randomNumberArray: number[] = [];
  sortType = 'Merge Sort';
  sortId = 0;

  iterationTime = 50;
  sizeOfArray = 20;
  colorSwapBefore = 'red';
  colorSwapAfter = 'green';
  colorNeutral = 'blue';
  /**
   * list of actions to do every iteration delay
   * [0] = actionID (0 = swap numbers, 1 = move number, 2 = color before swap, 3 = color after swap)
   * [1] = moveToIndex / firstNumber
   * [2] = moveFromIndex / secondNumber
   */
  sortActionList = [];

  ngOnInit(): void {
    this.generateRandomNumberArray(100, this.sizeOfArray);
  }

  generateRandomNumberArray(highest: number, size: number): void {
    this.randomNumberArray = this.numberService.getRandomNumbers(highest, size);
    //  this.randomNumberArray = [13,3,7,9,2,1,6,7,3,4,12];
  }


  radixSortArray(numbers: number[]): void {
    for (const item of numbers) {
      Math.pow(10, Math.floor(Math.log(5) / Math.log(10)) - 1);
    }
  }

  selectionSortArray(numbers: number[]): void {
    let minPos = 0;
    let smallestPos = 0;
    while (true) {
      smallestPos = minPos;
      for (let j = minPos; j < numbers.length; j++) {
        if (numbers[j] < numbers[smallestPos]) {
          smallestPos = j;
        }
      }
      if (minPos !== smallestPos) {
        this.swapNumbersMapping(minPos, smallestPos, numbers);
      }
      minPos++;

      if (minPos === numbers.length) {
        break;
      }
    }
  }


  bubbleSortArray(numbers: number[]): void {
    let iteration = 0;
    let index = 0;
    while (true) {
      {
        if (index < numbers.length) {
          if (numbers[index] > numbers[index + 1]) {
            this.swapNumbersMapping(index, index + 1, numbers);
          }
          index++;
        } else {
          iteration++;
          index = 0;
        }
        if (numbers.length === iteration) {
          break;
        }
      }
    }

  }

  quickSortArray(numbers: number[], firstIndex: number, lastIndex: number): void {
    // pick pivot
    while (true) {
      if (firstIndex - lastIndex !== 1 || firstIndex - lastIndex !== -1) {
        const pivot = this.pickPivot(numbers, firstIndex, lastIndex);
        if (pivot - lastIndex !== -1 || pivot - lastIndex !== 1) {
          this.moveNumMapping(lastIndex, pivot, numbers);
        }
      }
      // move pivot to end


      // get first largest than pivot from left
      const largest = BubbleSortComponent.firstLargest(numbers, firstIndex, lastIndex);
      // get first smallest than pivot from right
      const smallest = this.firstSmallest(numbers, firstIndex, lastIndex);
      if (largest > smallest) {
        // swap pivot and largest values
        this.swapNumbersMapping(largest, lastIndex, numbers);
        // new subArray firstIndex - pivot    pivot+1 - lastIndex
        if (largest - firstIndex > 1) {
          this.quickSortArray(numbers, firstIndex, largest);
        } else if (numbers[firstIndex] > numbers[largest]) {
          //  if theres two elements left swap them if left one is bigger
          this.swapNumbersMapping(firstIndex, largest, numbers);
        }
        if (lastIndex - (largest + 1) > 1) {
          this.quickSortArray(numbers, largest + 1, lastIndex);
        } else if (numbers[largest + 1] > numbers[lastIndex]) {
          //  if theres two elements left swap them if left one is bigger
          this.swapNumbersMapping(largest + 1, lastIndex, numbers);
        }
        break;
      } else if (largest < smallest) {
        this.swapNumbersMapping(largest, smallest, numbers);
      }
    }
  }


  /**
   * sorts a copy of array, makes sort action list, interval goes through list and sorts actual array
   * @param randomNumberArray
   * @param number1
   * @param number2
   * @param algorithm
   * @private
   */
  private prepareSort(randomNumberArray: number[], number1: number, number2: number, algorithm: number): void {
    this.sortActionList = [];
    const mappingArray = randomNumberArray.slice();
    switch (algorithm) {
      case 0:
        this.mergeSortArray(mappingArray, number1, number2);
        break;
      case 1:
        this.bubbleSortArray(mappingArray);
        break;
      case 2:
        this.quickSortArray(mappingArray, number1, number2);
        break;
      case 3:
        this.selectionSortArray(mappingArray);
        break;
    }


    let i = 0;

    this.sortId = setInterval(() => {
      const index1: number = (this.sortActionList[i])[1];
      const index2: number = (this.sortActionList[i])[2];
      switch (this.sortActionList[i][0]) {
        case 0:
          this.processText = 'Swapping columns no. ' + index1 + ' and ' + index2;
          BubbleSortComponent.swapNumbers(index1, index2, randomNumberArray);
          break;   //  number swap
        case 1:
          this.processText = 'Moving column from ' + index1 + ' to ' + index2;
          BubbleSortComponent.moveNum(index1, index2, randomNumberArray);
          break;   //  number move
        case 2:
          BubbleSortComponent.colorIndex(index1, index2, this.colorSwapBefore);
          let tempI = i;
          while (tempI < this.sortActionList.length) {
            let tempArr = this.sortActionList[tempI];
            if (tempArr[0] == 1) {
              this.processText = 'Moving column from ' + tempArr[2] + ' to ' + tempArr[1];
              break;
            } else if (tempArr[0] == 0) {
              this.processText = 'Swapping columns no. ' + tempArr[1] + ' and ' + tempArr[2];
              break;
            } else {
              tempI++;
            }

          }

          break;
        case 3:
          BubbleSortComponent.colorIndex(index1, index2, this.colorSwapAfter);
          break;
        case 4:
          BubbleSortComponent.colorIndex(index1, index2, this.colorNeutral);
          break;
      }
      i++;
      if (i >= this.sortActionList.length) {
        clearInterval(this.sortId);
        this.processText = 'Finished';
      }
    }, this.iterationTime);
  }

  mergeSortArray(numbers: number[], startIndex: number, lastIndex: number): void {
    switch (lastIndex - startIndex) {
      case 1:
        if (numbers[startIndex] > numbers[lastIndex]) {
          this.swapNumbersMapping(startIndex, lastIndex, numbers);
        }
        break;
      case 0:
        break;
      default :
        this.mergeSortArray(numbers, startIndex, Math.floor((lastIndex - startIndex) / 2) + startIndex);
        this.mergeSortArray(numbers, Math.floor((lastIndex - startIndex) / 2) + 1 + startIndex, lastIndex);
        this.merge(numbers, startIndex, lastIndex);
        break;
    }
  }

  merge(nums: number[], firstIndex: number, lastIndex: number): void {
    let si: number = Math.floor((lastIndex - firstIndex) / 2) + 1 + firstIndex;
    let fi: number = firstIndex;
    while (true) {
      //  check if already merged
      if (si <= fi || si > lastIndex) {
        break;
      }
      if (nums[fi] > nums[si]) {
        this.moveNumMapping(fi, si, nums);
        si++;
      }
      fi++;
    }
  }

  private disableSortButton(bool: boolean): void {
    const element = document.getElementById('sortButton') as HTMLInputElement;
    const element2 = document.getElementById('iterationSpeed') as HTMLInputElement;
    element.disabled = bool;
    element2.disabled = bool;
  }

  setArraySize(sizeOfArray: number): void {
    this.stopSort();
    this.sizeOfArray = sizeOfArray;
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
    const pos2 = Math.round((lastIndex - firstIndex) / 2) + firstIndex;

    // get the larger of pos1 and pos2
    let larger = numbers[pos1] > numbers[pos2] ? pos1 : pos2;
    if (numbers[larger] > numbers[pos3]) {
      this.swapNumbersMapping(larger, pos3, numbers);
    }
    if (numbers[pos1] > numbers[pos2]) {
      this.swapNumbersMapping(pos1, pos2, numbers);
    }

    // let smallest = numbers[pos1] < numbers[pos2] ? pos1 : pos2;
    // if(numbers[smallest] > numbers[pos3]){
    //   this.swapNumbersMapping(smallest, pos3, numbers);
    // }
    // if(numbers[pos1] > numbers[pos2]){
    //   this.swapNumbersMapping(pos1, pos2, numbers);
    // }

    return pos2;
  }

  private static swapNumbers(index: number, index2: number, numbers: number[]): void {
    const tempNum = numbers[index];
    numbers[index] = numbers[index2];
    numbers[index2] = tempNum;
  }

  private swapNumbersMapping(index: number, index2: number, numbers: number[]): void {
    this.sortActionList.push([2, index, index2]);   //  color before
    this.sortActionList.push([4, index, index2]);   //  color neutral
    this.sortActionList.push([0, index, index2]);   //  swap numbers
    this.sortActionList.push([3, index, index2]);   //  color before
    this.sortActionList.push([4, index, index2]);   //  color after
    BubbleSortComponent.swapNumbers(index, index2, numbers);

  }

  private static colorIndex(index: number, index2: number, color: string): void {
    if (index !== -1) {
      document.getElementById('' + index).style.backgroundColor = color;
    }
    if (index2 !== -1) {
      document.getElementById('' + index2).style.background = color;
    }
  }

  private static moveNum(moveToIndex: number, moveFromIndex: number, numbers: number[]): void {
    const tempNum: number = numbers[moveFromIndex];
    numbers.splice(moveFromIndex, 1);
    numbers.splice(moveToIndex, 0, tempNum);
  }

  private moveNumMapping(moveToIndex: number, moveFromIndex: number, numbers: number[]): void {
    this.sortActionList.push([2, moveFromIndex, -1]);   //  color before
    this.sortActionList.push([4, moveFromIndex, -1]);   //  color neutral
    this.sortActionList.push([1, moveToIndex, moveFromIndex]);   //  move number
    this.sortActionList.push([3, moveToIndex, -1]);   //  color before
    this.sortActionList.push([4, moveToIndex, -1]);   //  color after
    BubbleSortComponent.moveNum(moveToIndex, moveFromIndex, numbers);

  }

  /**
   * return index of largest from left given the pivot is the last element
   * returns -1 if nothing found
   * @param numbers
   * @param firstIndex
   * @param lastIndex
   * @private
   */
  private static firstLargest(numbers: number[], firstIndex: number, lastIndex: number): number {
    //  pivot is at the very end 'lastIndex'
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
   * @param firstIndex
   * @param lastIndex
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

  setSortType(value: string): void {
    this.stopSort();
    this.sortType = value;
  }

  sort(randomNumberArray: number[]): void {
    this.stopSort();
    switch (this.sortType) {
      case 'Quick Sort' :
        this.prepareSort(randomNumberArray, 0, randomNumberArray.length - 1, 2);
        break;
      case 'Bubble Sort' :
        this.prepareSort(randomNumberArray, 0, randomNumberArray.length - 1, 1);
        break;
      case 'Merge Sort' :
        this.prepareSort(randomNumberArray, 0, randomNumberArray.length - 1, 0);
        break;
      case 'Selection Sort':
        this.prepareSort(randomNumberArray, 0, randomNumberArray.length - 1, 3);
        break;
    }
  }


  setIterationSpeed(value: number): void {
    this.iterationTime = value;
    this.stopSort();
  }


  stopSort(): void {
    clearInterval(this.sortId);
    for (let i = 0; i < this.randomNumberArray.length; i++) {
      BubbleSortComponent.colorIndex(i, -1, this.colorNeutral);
    }
  }
}

