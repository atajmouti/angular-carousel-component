import { Component, ViewChild } from "@angular/core";
import { CarouselComponent } from "./carousel.component";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  maxRecord = 25;
  index = 0;
  items = [];
  moreitems = [];
  slidesize = 3;
  nomoredata = false;
  previtems = [];

  cs = -1 * this.slidesize;

  get data() {
    let array = [];
    for (let i = 0; i < this.maxRecord; i++) {
      array.push({
        title: "Slide " + i
      });
    }
    return array;
  }

  nextSet(size) {
    // Generate an infinte chunk of data
    let arr = [];
    let start = 0;
    let end = 0;
    start = this.cs = (this.cs + size) % this.maxRecord;
    end = this.cs + size;
    arr = this.data.slice(start, end);
    if (arr.length < size) {
      // complete arr with items from the head of data array
      // Ex arr =  24,0,1
      arr = arr.concat(this.data.slice(0, size - arr.length));
      // this.cs = -1 * this.size;
    }
    return arr;
  }

  previousSet(size) {
    // Generate an infinte chunk of data
    let arr = [];
    let start = 0;
    let end = 0;
    if (this.cs - size < 0) this.cs = size;
    start = this.cs = (this.cs - size) % this.maxRecord;
    end = this.cs + size;
    arr = this.data.slice(start, end);
    return arr;
  }

  init(size) {
    let arr = this.nextSet(size);
    this.previtems = this.nextSet(size);
    arr = arr.concat(this.previtems);
    if (arr.length > 0) {
      this.items = arr;
    }
    this.items = arr;
  }
  constructor() {
    this.init(this.slidesize);
    console.log(this.items);
  }

  fetch(event) {
    console.log("fetch direction : " + event);
    console.log("fetch - cs  : " + this.cs);
    console.log("current - previous  : ");
    console.log(this.previtems);
    if (event == "prev") {
      let currentRecordSet = this.previousSet(this.slidesize);
      if (currentRecordSet.length > 0) {
        if (this.cs == -1 * this.slidesize) {
          this.items = currentRecordSet;
        } else {
          this.items = currentRecordSet.concat(this.previtems);
          this.previtems = currentRecordSet;
        }
        console.log(this.items);
      }
    } else if (event == "next") {
      if (this.cs == -1 * this.slidesize) {
        this.init(this.slidesize);
      }
      let currentRecordSet = this.nextSet(this.slidesize);
      if (currentRecordSet.length > 0) {
        this.items = this.previtems.concat(currentRecordSet);
        this.previtems = currentRecordSet;
        console.log(this.items);
      }
    }
  }

  }
