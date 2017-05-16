import { Component, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { ViewController, NavParams, Slides, Content, Platform } from 'ionic-angular';
import { Photo } from '../interfaces/photo-interface';
import { Subject }    from 'rxjs/Subject';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'gallery-modal',
  template: `<style> .gallery-modal {   position: relative;   background: #37415d; }   .gallery-modal .close-button {     position: absolute;     left: 5px;     top: 10px;     z-index: 10;     background: none; }     .gallery-modal .close-button.button-ios {       top: 20px; }   .gallery-modal .slider .slide-zoom {     height: 100%; }   .gallery-modal .image-on-top {     position: absolute;     left: 0;     top: 0;     width: 100%;     height: 100%;     z-index: 10;     display: block;     background-repeat: no-repeat;     background-position: center center;     background-size: contain; }   .gallery-modal close-button {     position: absolute;     right: 0;     z-index: 100; }     .gallery-modal close-button .icon {       margin-right: 0 !important; } </style> <ion-content #content class="gallery-modal no-scroll" (window:resize)="resize($event)" (window:orientationchange)="orientationChange($event)">   <close-button></close-button>    <!-- Initial image while modal is animating -->   <div class="image-on-top" #image [ngStyle]="{ 'background-image': 'url(' + photos[initialSlide].url + ')'}" [hidden]="sliderLoaded">     &nbsp;   </div>    <!-- Slider with images -->   <ion-slides #slider [initialSlide]="initialSlide" class="slider" *ngIf="photos.length" [ngStyle]="{ 'visibility': sliderLoaded ? 'visible' : 'hidden' }">     <ion-slide *ngFor="let photo of photos;">       <zoomable-image         src="{{ photo.url }}"         [ngClass]="{ 'swiper-no-swiping': sliderDisabled }"         (disableScroll)="disableScroll($event)"         (enableScroll)="enableScroll($event)"         [parentSubject]="parentSubject"       ></zoomable-image>     </ion-slide>   </ion-slides> </ion-content>`,
})
export class GalleryModal {
  @ViewChild('slider') slider: Slides;
  @ViewChild('content') content: Content;

  public photos: Photo[];
  private sliderDisabled: boolean = false;
  private initialSlide: number = 0;
  private currentSlide: number = 0;
  private sliderLoaded: boolean = false;
  private closeIcon: string = 'arrow-back';
  private parentSubject: Subject<any> = new Subject();

  constructor(private viewCtrl: ViewController, params: NavParams, private element: ElementRef, private platform: Platform) {
    this.photos = params.get('photos') || [];
    this.closeIcon = params.get('closeIcon') || 'arrow-back';
    this.initialSlide = params.get('initialSlide') || 0;
  }

  /**
   * Closes the modal (when user click on CLOSE)
   */
  public dismiss() {
    this.viewCtrl.dismiss();
  }

  private resize(event) {
    this.slider.update();

    let width = this.element['nativeElement'].offsetWidth;
    let height = this.element['nativeElement'].offsetHeight;

    this.parentSubject.next({
      width: width,
      height: height,
    });
  }

  private orientationChange(event) {
    // TODO: See if you can remove timeout
    window.setTimeout(() => {
      this.resize(event);
    }, 150);
  }

  /**
   * When the modal has entered into view
   */
  private ionViewDidEnter() {
    this.resize(false);
    this.sliderLoaded = true;
  }

  /**
   * Disables the scroll through the slider
   *
   * @param  {Event} event
   */
  private disableScroll(event) {
    if (!this.sliderDisabled) {
      this.currentSlide = this.slider.getActiveIndex();
      this.sliderDisabled = true;
    }
  }

  /**
   * Enables the scroll through the slider
   *
   * @param  {Event} event
   */
  private enableScroll(event) {
    if (this.sliderDisabled) {
      this.slider.slideTo(this.currentSlide, 0, false);
      this.sliderDisabled = false;
    }
  }
}
