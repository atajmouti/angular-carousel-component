import { Component, ViewChild } from "@angular/core";
import { CarouselComponent } from "./carousel.component";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  @ViewChild(CarouselComponent) carousel: CarouselComponent;
  maxRecord = 25;
  index = 0;
  items = [];
  moreitems = [];
  size = 9;
  nomoredata = false;
  previtems = [];

  get data() {
    let array = [];
    for (let i = 0; i < this.maxRecord; i++) {
      array.push({
        title: "Slide " + i
      });
    }
    return array;
  }

  _extRecordSet(size) {
    // let start = this.index; // 0 => 0 à 9
    let start = 0;
    let end = 0;

    console.log("Index - next : " + this.index);
    if (this.index + 9 == this.data.length) {
      start = 0;
      this.index = 0;
      end = Math.min(this.data.length, start + size); // 25 -> 25
    } else {
      start = Math.min(this.index, this.data.length - size); // => 0 -> 15
      end = Math.min(this.data.length, start + size); // 25 -> 25
    }
    this.index = Math.min(this.index + (2 * size) / 3, this.data.length); // 11
    return this.data.slice(start, end);
  }

  nextRecordSet(size) {
    let start = 0;
    let end = 0;
    let arr = [];
    console.log("Index - next : " + this.index);
    if (this.index == this.data.length) {
      this.index = 0;
      start = 0;
      end = Math.min(this.data.length, start + 2*size); 
      this.index = Math.min(this.index + size, this.data.length);
      arr = this.data.slice(start, end);
      this.previtems = arr.slice(size/2, size);
      return arr;
    }
    if (this.index + size  >= this.data.length) {
      start = this.index;
      end = this.data.length;
      arr = this.data.slice(start, end);
      // if (arr.length < size) {
      //   // complete les size elements par les elemnts du 1er _extRecordSet
      //   // Ex arr retourné 24,0,1
      //   arr = arr.concat(this.data.slice(0, size - arr.length));
      //   this.index = size - arr.length - 1;
      // }
      this.index = Math.min(this.index + size, this.data.length);
      return arr;
    } else {
      this.previtems = this.items.slice(3, 6);
      console.log("previous)");
      console.log(this.previtems);
      start = Math.min(this.index, this.data.length - size); // => 0 -> 15
      end = Math.min(this.data.length, start + size); // 25 -> 25
      this.index = Math.min(this.index + size, this.data.length);
    }
    arr = this.data.slice(start, end);
    arr = this.previtems.concat(arr);
    return arr;
  }

  previousRecordSet(size) {
    console.log("Index - prev : " + this.index);
    let start = 0;
    let end = 0;
    let arr = [];
    if (this.index - size >= 0) {
      start = Math.max(0, this.index - size);
      end = Math.min(start + size, this.data.length);
      this.index = Math.max(0, this.index - size);
      console.log("start - end : " + start + "-" + end);
      return this.data.slice(start, end);
    } else {
      return [];
    }
  }

  constructor() {
    let arr = this.nextRecordSet(3);
    this.previtems = this.nextRecordSet(3);
    this.items = arr.concat(this.previtems);
    console.log(this.items);
  }

  fetch(event) {
    console.log("fetch direction : " + event);
    console.log("fetch - Index  : " + this.index);

    if (event == "prev") {
      console.log("Previous Recordset");
      console.log(this.previtems);
      let currentRecordSet = this.previousRecordSet(3);
      this.items = currentRecordSet.concat(this.previtems);
      this.previtems = currentRecordSet;
      if (currentRecordSet.length > 0) {
        this.items = currentRecordSet;
        console.log(this.items);
      }
    } else if (event == "next") {
      let currentRecordSet = this.nextRecordSet(3);
      if (currentRecordSet.length > 0) {
        this.items = currentRecordSet;
        console.log(this.items);
      }
    }
  }
}
