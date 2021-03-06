import {Component, OnInit} from '@angular/core';
import {NumberGeneratorService} from '../../services/number-generator.service';

@Component({
  selector: 'app-bubble-sort',
  templateUrl: './bubble-sort.component.html',
  styleUrls: ['./bubble-sort.component.css']
})
export class BubbleSortComponent implements OnInit {

  randomNumberArray: number[] = [];
  sortType: string = 'Merge Sort';
  sortId: number = 0;
  constructor(private numberService: NumberGeneratorService) {
  }

  ngOnInit(): void {
    this.generateRandomNumberArray(100, this.sizeOfArray);
  }

  generateRandomNumberArray(highest: number, size: number) {
    this.randomNumberArray = this.numberService.getRandomNumbers(highest, size);
    // this.randomNumberArray = [13,3,7,9,2,1,6,7,3,4,12];
  }

  iterationTime: number = 50;
  sizeOfArray: number = 20;
  colorSwapBefore: string = "red";
  colorSwapAfter: string = "green";
  colorNeutral:string = "blue";
  /**
   * list of actions to do every iteration delay
   * [0] = actionID (0 = swap numbers, 1 = move number, 2 = color before swap, 3 = color after swap)
   * [1] = moveToIndex / firstNumber
   * [2] = moveFromIndex / secondNumber
   */
  sortActionList = [];



  radixSortArray(numbers: number[]) {
    for(let i =0 ;i<numbers.length;i++){
      Math.pow(10, Math.floor(Math.log(5) / Math.log(10)) - 1);
    }
  }

  selectionSortArray(numbers: number[]) {
    let minPos = 0;
    let smallestPos = 0;
    while(true){
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



  bubbleSortArray(numbers: number[]) {
    let iteration = 0;
    let index = 0;
    while(true){{
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

  quickSortArray(numbers: number[], firstIndex: number, lastIndex: number) {
      //pick pivot
    while(true) {
      let pivot = this.pickPivot(numbers, firstIndex, lastIndex);
      //move pivot to end
      this.moveNumMapping(lastIndex, pivot, numbers);
      //get first largest than pivot from left
      let largest = this.firstLargest(numbers, firstIndex, lastIndex);
      //get first smallest than pivot from right
      let smallest = this.firstSmallest(numbers, firstIndex, lastIndex);
      if (largest > smallest) {
        //swap pivot and largest values
        this.swapNumbersMapping(largest, lastIndex, numbers);
        //new subArray firstIndex - pivot    pivot+1 - lastIndex
        if (largest - firstIndex > 1) {
          this.quickSortArray(numbers, firstIndex, largest);
        } else if (largest - firstIndex === 1 && numbers[firstIndex] > numbers[largest]) {
          // if theres two elements left swap them if left one is bigger
          this.swapNumbersMapping(firstIndex, largest, numbers);
        }
        if (lastIndex - (largest + 1) > 1) {
          this.quickSortArray(numbers, largest + 1, lastIndex);
        } else if (lastIndex - (largest + 1) === 1 && numbers[largest + 1] > numbers[lastIndex]) {
          // if theres two elements left swap them if left one is bigger
          this.swapNumbersMapping(largest + 1, lastIndex, numbers);
        }
        break;
      }
      else if(largest < smallest){
        this.swapNumbersMapping(largest, smallest, numbers);
      }
    }
  }

  /**
   * sorts a copy of array, makes sort action list, interval goes through list and sorts actual array
   * @param randomNumberArray
   * @param number
   * @param number2
   * @param algorithm
   * @private
   */
  private prepareSort(randomNumberArray: number[], number: number, number2: number,algorithm:number) {
    this.sortActionList = [];
    let mappingArray = randomNumberArray.slice();
    switch(algorithm){
      case 0:this.mergeSortArray(mappingArray,number,number2);break;
      case 1:this.bubbleSortArray(mappingArray);break;
      case 2:this.quickSortArray(mappingArray, number, number2);break;
      case 3:this.selectionSortArray(mappingArray);break;
    }


    let i: number=0;
    this.sortId = setInterval(()=>{
    let index1:number = (this.sortActionList[i])[1];
    let index2: number = (this.sortActionList[i])[2];
    switch(this.sortActionList[i][0]){
      case 0: this.swapNumbers(index1,index2,randomNumberArray);break; // number swap
      case 1: this.moveNum(index1,index2,randomNumberArray);break; // number move
      case 2: this.colorIndex(index1,index2,this.colorSwapBefore);break;
      case 3: this.colorIndex(index1,index2,this.colorSwapAfter);break;
      case 4: this.colorIndex(index1,index2,this.colorNeutral);break;
    }
     i++;
    if(i>=this.sortActionList.length){
      clearInterval(this.sortId);
    }
    },this.getIterationSpeed());
  }

  mergeSortArray(numbers: number[], startIndex: number, lastIndex: number) {
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
  merge(nums: number[], firstIndex: number, lastIndex: number) {
    let si: number = Math.floor((lastIndex - firstIndex) / 2) + 1 + firstIndex;
    let fi: number = firstIndex;
    while (true) {
      //check if already merged
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

  private disableSortButton(bool: boolean) {
    const element = <HTMLInputElement> document.getElementById('sortButton');
    const element2 = <HTMLInputElement> document.getElementById('iterationSpeed');
    element.disabled = bool;
    element2.disabled = bool;
  }

  setArraySize(sizeOfArray: number) {
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
    if (numbers[pos1] > numbers[pos2]) {
      this.swapNumbersMapping(pos1, pos2, numbers);
    }
    if (numbers[pos2] > numbers[pos3]) {
      this.swapNumbersMapping(pos2, pos3, numbers);
    }
    if (numbers[pos1] > numbers[pos2]) {
      this.swapNumbersMapping(pos1, pos2, numbers);
    }
    return pos2;
  }

  private swapNumbers(index: number, index2: number, numbers: number[]) {
    let tempNum = numbers[index];
    numbers[index] = numbers[index2];
    numbers[index2] = tempNum;
  }
  private swapNumbersMapping(index: number, index2: number, numbers: number[]) {
    this.sortActionList.push([2,index,index2]); // color before
    this.sortActionList.push([4,index,index2]); // color neutral
    this.sortActionList.push([0,index, index2]); // swap numbers
    this.sortActionList.push([3,index,index2]); // color before
    this.sortActionList.push([4,index,index2]); // color after
    this.swapNumbers(index,index2,numbers);

  }

  private colorIndex(index: number,index2:number, color: string) {
    if(index !== -1) {
      document.getElementById("" + index).style.backgroundColor = color;
    }
    if(index2 !== -1) {
      document.getElementById("" + index2).style.background = color;
    }
  }

  private moveNum(moveToIndex: number, moveFromIndex: number, numbers: number[]) {
    let tempNum: number = numbers[moveFromIndex];
    numbers.splice(moveFromIndex, 1);
    numbers.splice(moveToIndex, 0, tempNum);
  }
  private moveNumMapping(moveToIndex: number, moveFromIndex: number, numbers: number[]) {
    this.sortActionList.push([2,moveFromIndex,-1]); // color before
    this.sortActionList.push([4,moveFromIndex,-1]); // color neutral
    this.sortActionList.push([1, moveToIndex, moveFromIndex]); // move number
    this.sortActionList.push([3,moveToIndex,-1]); // color before
    this.sortActionList.push([4,moveToIndex,-1]); // color after
    this.moveNum(moveToIndex,moveFromIndex,numbers);

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

  setSortType(value: string) {
    this.stopSort();
    this.sortType = value;
  }

  sort(randomNumberArray: number[]) {
    this.stopSort();
    switch (this.sortType) {
      case 'Quick Sort' :
        this.prepareSort(randomNumberArray,0,randomNumberArray.length - 1,2);
        break;
      case 'Bubble Sort' :
        this.prepareSort(randomNumberArray,0,randomNumberArray.length - 1,1);
        break;
      case 'Merge Sort' :
        this.prepareSort(randomNumberArray, 0, randomNumberArray.length - 1,0);
        break;
      case 'Selection Sort':
        this.prepareSort(randomNumberArray,0,randomNumberArray.length - 1,3);
        break;
    }
  }


  setIterationSpeed(value: number) {
    this.iterationTime = value;
    this.stopSort();
  }

  getIterationSpeed():number{
    return this.iterationTime;
  }

  stopSort() {
    clearInterval(this.sortId);
    for(let i=0; i<this.randomNumberArray.length;i++) {
    this.colorIndex(i,-1,this.colorNeutral);
    }
  }
}

