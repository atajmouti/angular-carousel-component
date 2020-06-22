import {
  AfterViewInit,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from "@angular/core";
import { CarouselItemDirective } from "./carousel-item.directive";
import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  style
} from "@angular/animations";

@Directive({
  selector: ".carousel-item"
})
export class CarouselItemElement {}

@Component({
  selector: "carousel",
  exportAs: "carousel",
  template: `
    <section class="carousel-wrapper" [ngStyle]="carouselWrapperStyle">
      <ul class="carousel-inner" #carousel>
        <li *ngFor="let item of items" class="carousel-item">
          <ng-container [ngTemplateOutlet]="item.tpl"></ng-container>
        </li>
      </ul>
    </section>
    <div *ngIf="showControls" style="margin-top: 1em">
      <button (click)="next()" class="btn btn-default">Next</button>
      <button (click)="prev()" class="btn btn-default">Prev</button>
    </div>
  `,
  styles: [
    `
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        width: 6000px;
      }

      .carousel-wrapper {
        overflow: hidden;
      }

      .carousel-inner {
        display: flex;
      }
    `
  ]
})
export class CarouselComponent implements AfterViewInit {
   @ContentChildren(CarouselItemDirective) items: QueryList<
    CarouselItemDirective
  >;
  @ViewChildren(CarouselItemElement, { read: ElementRef })
  private itemsElements: QueryList<ElementRef>;
  @ViewChild("carousel") private carousel: ElementRef;
  @Input() timing = "1250ms ease-in";
  @Input() showControls = true;
  @Input() slidesize = 4; // number of items per slide

  @Output() fetchRecordSet: EventEmitter<string>;

  private player: AnimationPlayer;
  private itemWidth: number;
  public currentSlide = 0;
  carouselWrapperStyle = {};

  constructor(private builder: AnimationBuilder) {
    this.fetchRecordSet = new EventEmitter<string>();
  }

  next() {
    console.log("[ ==> next- this.currentSlide] : " + this.currentSlide);
    console.log("number of items : " + this.items.length);
    //if we are in the last
    if (this.currentSlide + 1 == this.items.length / this.slidesize) {
      this.fetchRecordSet.emit("next");
      this.currentSlide--; //less currentSlide
      this.transitionCarousel(0); //execute the animation in 0 seconds
    }
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    this.transitionCarousel(null);
    console.log("[ <== next- this.currentSlide] : " + this.currentSlide);
  }

  public prev() {
    console.log("[prev- this.currentSlide] : " + this.currentSlide);
    console.log("number of items : " + this.items.length);
    if (this.currentSlide == 0 && this.items.length > this.slidesize) {
      this.fetchRecordSet.emit("prev");
      this.currentSlide++; //less currentSlide
      this.transitionCarousel(0); //execute the animation in 0 seconds
    }
    if (this.items.length > this.slidesize ) {
      this.currentSlide = (this.currentSlide - 1) % this.items.length;
      this.transitionCarousel(null);
    }
  }

  transitionCarousel(time: any) {
    const offset = this.currentSlide * this.itemWidth * this.slidesize;
    const myAnimation: AnimationFactory = this.buildAnimation(offset, time);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }
  
  private buildAnimation(offset, time: any) {
    return this.builder.build([
      animate(
        time == null ? this.timing : 0,
        style({ transform: `translateX(-${offset}px)` })
      )
    ]);
  }

  ngAfterViewInit() {
    // For some reason only here I need to add setTimeout, in my local env it's working without this.
    console.log(this.items.length);
    setTimeout(() => {
      this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
      this.carouselWrapperStyle = {
        width: `${this.itemWidth * this.slidesize }px`
      };
    });

    this.items.changes // throws "Cannot read property 'changes' of undefined"
      .subscribe(() => {
        console.log("chenges detected");
      });
  }
 }
