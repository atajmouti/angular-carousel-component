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

  get data() {
    let array = [];
    for (let i = 0; i < this.maxRecord; i++) {
      array.push({
        title: "Slide " + i
      });
    }
    return array;
  }

  nextRecordSet(size) {
    // let start = this.index; // 0 => 0 à 9
    let start = 0;
    let end = 0;
    console.log("Index - next : " + this.index);
    if (this.index + size > this.data.length)
    if (this.index == this.data.length) {
        start = 0; 
        this.index = 0;
        end = Math.min(this.data.length, start + size); // 25 -> 25
    } else {
      start = Math.min(this.index, this.data.length - size); // => 0 -> 15
      end = Math.min(this.data.length, start + size); // 25 -> 25
    }
    this.index = Math.min(this.index + (2*size/3) , this.data.length); // 11
    return this.data.slice(start, end);
  }

  previousRecordSet() {
    console.log("Index - prev : " + this.index);
    let start = Math.max(0, this.index - this.size); // 0 -> 24 => 14
    let end = Math.min(start + this.size, this.data.length); // 4 -> 10
    this.index = Math.max(0, this.index - this.size);
    console.log("start - end : " + start + "-" + end);
    return this.data.slice(start, end);
  }

  constructor() {
    this.items = this.nextRecordSet(9);
    console.log(this.items);
  }


  fetch(event) {
    console.log("fetch direction : " + event);
    console.log("fetch - Index  : " + this.index);

    if (event == "prev") {
      let currentRecordSet = this.previousRecordSet();
      console.log(currentRecordSet);

      if (currentRecordSet.length > 0) this.items = currentRecordSet;
    } else if (event == "next") {
      let currentRecordSet = this.nextRecordSet(9);
      console.log(currentRecordSet);

      if (currentRecordSet.length > 0) this.items = currentRecordSet;
    }
  }
}
