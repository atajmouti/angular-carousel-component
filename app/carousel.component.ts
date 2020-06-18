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

  @Output() fetchRecordSet: EventEmitter<string>;

  private player: AnimationPlayer;
  private itemWidth: number;
  public currentSlide = 0;
  carouselWrapperStyle = {};

  constructor(private builder: AnimationBuilder) {
    this.fetchRecordSet = new EventEmitter<string>();
  }

  public next() {
    console.log("[ ==> next- this.currentSlide] : " + this.currentSlide);
    console.log("number of items : " + this.items.length);

    if (this.currentSlide === this.items.length / 3 - 1 ) {
      this.fetchRecordSet.emit("next");
      this.currentSlide = 0;
    }

    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    const offset = this.currentSlide * this.itemWidth * 3;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
    console.log("[ <== next- this.currentSlide] : " + this.currentSlide);

  }

  public prev() {
    console.log("[prev- this.currentSlide] : " + this.currentSlide);
    console.log("number of items : " + this.items.length);

    if (this.currentSlide === 1) {
      this.fetchRecordSet.emit("prev");
      return;

    }

    this.currentSlide =
      (this.currentSlide - 1 + this.items.length) % this.items.length;
    const offset = this.currentSlide * this.itemWidth * 3;

    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  private buildAnimation(offset) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
    ]);
  }

  ngAfterViewInit() {
    // For some reason only here I need to add setTimeout, in my local env it's working without this.
    console.log(this.items.length);
    setTimeout(() => {
      this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
      this.carouselWrapperStyle = {
        width: `${this.itemWidth * 3}px`
      };
    });

    this.items.changes // throws "Cannot read property 'changes' of undefined"
      .subscribe(() => {
        console.log("chenges detected");
    //    this.currentSlide = 0;
//  /*       this.currentSlide = (this.currentSlide + 1) % this.items.length;
//         const offset = this.currentSlide * this.itemWidth * 3;
//         const myAnimation: AnimationFactory = this.buildAnimation(offset);
//         this.player = myAnimation.create(this.carousel.nativeElement);
//         this.player.play();
//         console.log("chenges detected nb of items : " + this.items.length);*/
      });
  }
}
