import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{

  ngOnInit(): void {
      this.init();
  }

  n = 60;
  array: number[] = [];
  highlightedIndices: number[] = [];
  audioCtx: AudioContext | null = null;
  giphy: boolean= false;


  init() {
    this.array = [];
    for (let i = 0; i < this.n; i++) {
      this.array[i] = Math.random();
    }
    this.showBars();
  
  }

  play(event: Event) {
    const target = event.target as HTMLSelectElement;
    const sortAlgo = target.value;
    let swaps: number[][] = [];
  
    switch (sortAlgo) {
      case 'bubbleSort':
        swaps = this.bubbleSort([...this.array]);
        break;
      case 'insertionSort':
        swaps = this.insertionSort([...this.array]);
        break;
      case 'selectionSort':
        swaps = this.selectionSort([...this.array]);
        break;
      case 'quickSort':
        swaps = this.quicksort([...this.array]);
        break;
        // case 'countSort':
        //   swaps = this.countSort([...this.array]);
        //   break;
        case 'mergeSort':
  
          this.mergeSort([...this.array]);
          break;
      default:
        swaps = this.bubbleSort([...this.array]);
        break;
    }
    this.giphy= true;
    this.animate(swaps);
  }

  showBars(indices?: number[]) {
    this.highlightedIndices = indices || [];
  }


  animate(swaps: number[][]) {

    if (swaps.length == 0) {
      this.showBars();
      this.giphy= false;
      return;
    }
    
    const [i, j] = swaps.shift()!;
    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
    this.showBars([i, j]);
    this.playNote(200 + this.array[i] * 50);
    this.playNote(200 + this.array[j] * 400);

    setTimeout(() => {
      this.animate(swaps);
    }, 100);

  }

  mergeSort(array: number[]) {
    this.giphy= true;
    console.log("giphy true now at func");
    
    const animations: any = [];
    if (array.length <= 1) return array;
    const auxiliaryArray = array.slice();
    this.mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
    for(let i=0; i<array.length; i++){
      console.log(array[i]);
    }
    
    return this.animateMergeSort(animations);
  }
  
  mergeSortHelper(
    mainArray: number[],
    startIdx: number,
    endIdx: number,
    auxiliaryArray: number[],
    animations: any,
  ) {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    this.mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
    this.mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
    this.doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
  }
  
  doMerge(
    mainArray: number[],
    startIdx: number,
    middleIdx: number,
    endIdx: number,
    auxiliaryArray: number[],
    animations: any,
  ) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    while (i <= middleIdx && j <= endIdx) {
      // These are the values that we're comparing; we push them once
      // to change their color.
      animations.push([i, j]);
      // These are the values that we're comparing; we push them a second
      // time to revert their color.
      animations.push([i, j]);
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        // We overwrite the value at index k in the original array with the
        // value at index i in the auxiliary array.
        animations.push([k, auxiliaryArray[i]]);
        mainArray[k++] = auxiliaryArray[i++];
      } else {
        // We overwrite the value at index k in the original array with the
        // value at index j in the auxiliary array.
        animations.push([k, auxiliaryArray[j]]);
        mainArray[k++] = auxiliaryArray[j++];
      }
    }
    while (i <= middleIdx) {
      // These are the values that we're comparing; we push them once
      // to change their color.
      animations.push([i, i]);
      // These are the values that we're comparing; we push them a second
      // time to revert their color.
      animations.push([i, i]);
      // We overwrite the value at index k in the original array with the
      // value at index i in the auxiliary array.
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    }
    while (j <= endIdx) {
      // These are the values that we're comparing; we push them once
      // to change their color.
      animations.push([j, j]);
      // These are the values that we're comparing; we push them a second
      // time to revert their color.
      animations.push([j, j]);
      // We overwrite the value at index k in the original array with the
      // value at index j in the auxiliary array.
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }

  animateMergeSort(animations: number[][]) {
    
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('bar') as HTMLCollectionOf<HTMLElement>;
      let colorChange = i % 3 !== 2;
      if (colorChange) { // For every even-indexed animation, we change the colors of the bars
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? 'red' : 'black';

        setTimeout(() => {
          this.playNote(200 + this.array[barOneIdx] * 50);
          this.playNote(200 + this.array[barOneIdx] * 400);
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * 50);
      } else { // For every odd-indexed animation, we revert the color and height of the bars
        setTimeout(() => {
          const [barIdx, newHeight] = animations[i];
          const barStyle = arrayBars[barIdx].style;
          barStyle.height = `${newHeight* 100}%`;
        }, i * 50);
      }
      colorChange = !colorChange;
    // console.log("gif false after loop");

      // this.giphy= false;
    }
     
  }
  


  bubbleSort(array: number[]) {
    const swaps: number[][] = [];
    let swapped: boolean;
    do {
      swapped = false; // Reset swapped to false before each pass
      for (let i = 1; i < array.length; i++) {
        if (array[i - 1] > array[i]) {
          swaps.push([i - 1, i]);
          swapped = true;
          [array[i - 1], array[i]] = [array[i], array[i - 1]];
        }
      }
    } while (swapped);
    return swaps;
  }

 
  insertionSort(array: number[]) {
    const swaps: number[][] = [];
    for (let i = 1; i < array.length; i++) {
      let j = i;
      while (j > 0 && array[j - 1] > array[j]) {
        swaps.push([j - 1, j]);
        [array[j - 1], array[j]] = [array[j], array[j - 1]];
        j--;
      }
    }
    return swaps;
  }

  selectionSort(array: number[]) {
    const swaps: number[][] = [];
    for (let i = 0; i < array.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < array.length; j++) {
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        swaps.push([i, minIndex]);
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
      }
    }
    return swaps;
  }

  quicksort(array: number[]) {
    if (array.length <= 1) {
      return [];
    }

    const swaps: number[][] = [];
    const partition = (low: number, high: number) => {
      const pivot = array[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
          i++;
          swaps.push([i, j]);
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      swaps.push([i + 1, high]);
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      return i + 1;
    };

    const quicksortRecursive = (low: number, high: number) => {
      if (low < high) {
        const pivotIndex = partition(low, high);
        quicksortRecursive(low, pivotIndex - 1);
        quicksortRecursive(pivotIndex + 1, high);
      }
    };

    quicksortRecursive(0, array.length - 1);
    return swaps;
  }

  countSort(array: number[]) {
    const swaps: number[][] = [];
    const max = Math.max(...array);
    const count = Array(max + 1).fill(0);
    
    // Count occurrences of each value
    array.forEach(val => count[val]++);
    
    let index = 0;
    for (let val = 0; val <= max; val++) {
      while (count[val] > 0) {
        swaps.push([index, val]); // Push [index, val] to record swaps
        array[index++] = val;
        count[val]--;
      }
    }
    
    return swaps;
  }
  

  radixSort(array: number[]) {
    const swaps: number[][] = [];
    const max = Math.max(...array);
    const maxDigits = Math.floor(Math.log10(max)) + 1;
    let divisor = 1;
    for (let i = 0; i < maxDigits; i++, divisor *= 10) {
      const buckets: number[][] = Array.from({ length: 10 }, () => []);
      for (let num of array) {
        buckets[Math.floor((num / divisor) % 10)].push(num);
      }
      array = ([] as number[]).concat(...buckets);
      array.forEach((val, index) => {
        swaps.push([index, val]);
      });
    }
    return swaps;
  }
  


 
  playNote(freq: number) {
    if (this.audioCtx == null) {
      this.audioCtx = new (AudioContext || (<any>window).webkitAudioContext)();
    }
    const dur = 0.1;
    const osc = this.audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(this.audioCtx.currentTime + dur);
    const node = this.audioCtx.createGain();
    node.gain.value = 0.5;
    node.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(this.audioCtx.destination);
  }
}
