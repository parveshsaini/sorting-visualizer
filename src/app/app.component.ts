import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  n = 40;
  array: number[] = [];
  highlightedIndices: number[] = [];
  audioCtx: AudioContext | null = null;

  init() {
    this.array = [];
    for (let i = 0; i < this.n; i++) {
      this.array[i] = Math.random();
    }
    this.showBars();
  }

  play(sortAlgo: string) {
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
      case 'mergeSort':
        swaps = this.mergeSort([...this.array]);
        break;
      default:
        swaps = this.bubbleSort([...this.array]);
        break;
    }
  
    this.animate(swaps);
  }

  animate(swaps: number[][]) {
    if (swaps.length == 0) {
      this.showBars();
      return;
    }
    const [i, j] = swaps.shift()!;
    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
    this.showBars([i, j]);
    this.playNote(200 + this.array[i] * 500);
    this.playNote(200 + this.array[j] * 500);

    setTimeout(() => {
      this.animate(swaps);
    }, 50);
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

  mergeSort(array: number[]) {
    const swaps: number[][] = [];
  
    const merge = (
      left: number[],
      right: number[],
      leftIndex: number,
      rightIndex: number
    ) => {
      const result: number[] = [];
      let leftPointer = 0;
      let rightPointer = 0;
  
      while (leftPointer < left.length && rightPointer < right.length) {
        if (left[leftPointer] < right[rightPointer]) {
          result.push(left[leftPointer]);
          leftPointer++;
        } else {
          result.push(right[rightPointer]);
          rightPointer++;
        }
      }
  
      return result.concat(left.slice(leftPointer), right.slice(rightPointer));
    };
  
    const mergeSortRecursive = (arr: number[]): number[] => {
      if (arr.length <= 1) {
        return arr;
      }
  
      const middle = Math.floor(arr.length / 2);
      const left = arr.slice(0, middle);
      const right = arr.slice(middle);
  
      return merge(
        mergeSortRecursive(left),
        mergeSortRecursive(right),
        middle,
        middle
      );
    };
  
    const sortedArray = mergeSortRecursive(array.slice());
  
    return swaps; // Since merge sort doesn't involve swapping elements
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

  showBars(indices?: number[]) {
    this.highlightedIndices = indices || [];
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
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(this.audioCtx.destination);
  }
}
