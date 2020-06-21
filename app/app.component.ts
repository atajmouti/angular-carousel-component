import { Component, ViewChild } from "@angular/core";
import { CarouselComponent } from "./carousel.component";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  @ViewChild(CarouselComponent) carousel: CarouselComponent;
  maxRecord = 5;
  index = 0;
  items = [];
  moreitems = [];
  size = 3;
  nomoredata = false;
  previtems = [];

  cs = -1 * this.size;

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

  constructor() {
    let arr = this.nextSet(3);
    this.previtems = this.nextSet(3);
    arr = arr.concat(this.previtems);
    if (arr.length > 0) {
      this.items = arr;
    }
    console.log(this.items);
  }

  fetch(event) {
    console.log("fetch direction : " + event);
    console.log("fetch - cs  : " + this.cs);
    console.log("current - previous  : ");
    console.log(this.previtems);
    if (event == "prev") {
      this.previtems = this.items.slice(0, 3);
      this.cs = this.cs - 3;
      let currentRecordSet = this.previousSet(3);
      if (currentRecordSet.length > 0) {
        if (
          JSON.stringify(currentRecordSet) != JSON.stringify(this.previtems)
        ) {
          // this.previtems = currentRecordSet;
          //  this.items = currentRecordSet.concat(this.previtems);
          this.items = this.previtems.concat(currentRecordSet);
          this.previtems = this.items.slice(4, 6);
        } else {
          this.items =  currentRecordSet;
        }
        console.log(this.items);
      }
    } else if (event == "next") {
      let currentRecordSet = this.nextSet(3);
      if (currentRecordSet.length > 0) {
        this.items = this.previtems.concat(currentRecordSet);
        this.previtems = currentRecordSet;
        console.log(this.items);
      }
    }
  }
}
