import { Component } from "@angular/core";
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
  size = 9;

  get data() {
    let array = [];
    for (let i = 0; i < this.maxRecord; i++) {
      array.push({
        title: "Slide " + i
      });
    }
    return array;
  }

  nextRecordSet() {
    // let start = this.index; // 0 => 0 à 9
    console.log("Index : " + this.index);
    if (this.index == this.data.length ) {
      return this.data.slice(this.data.length - 3, this.data.length);
    };
    let start = Math.min(this.index, this.data.length - this.size); // => 0 -> 15
    let end = Math.min(this.data.length, start + this.size); // 25 -> 25
    this.index = Math.min(this.index + this.size, this.data.length); // 11
    return this.data.slice(start, end);
  }

  previousRecordSet() {
    console.log(this.index);
//    if (this.index == 0 ) return [];
    let start = Math.max(0, this.index - this.size); // 0 -> 24 => 14
    let end = Math.min(start + this.size, this.data.length); // 4 -> 10
    this.index = Math.max(0, this.index - this.size);
    return this.data.slice(start, end);
  }
  constructor() {
    this.items = this.nextRecordSet();
  }

  fetch(event) {
    console.log('fetch direction : ' + event);
    if (event === "prev") {
      this.items = this.previousRecordSet();
      console.log(this.items);

    } else if (event === "next") {
      this.items = this.nextRecordSet();
      console.log(this.items);

    }
  }
}
