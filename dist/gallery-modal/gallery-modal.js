"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var Subject_1 = require("rxjs/Subject");
var GalleryModal = (function () {
    function GalleryModal(viewCtrl, params, element, platform) {
        this.viewCtrl = viewCtrl;
        this.element = element;
        this.platform = platform;
        this.sliderDisabled = false;
        this.initialSlide = 0;
        this.currentSlide = 0;
        this.sliderLoaded = false;
        this.closeIcon = 'arrow-back';
        this.parentSubject = new Subject_1.Subject();
        this.photos = params.get('photos') || [];
        this.closeIcon = params.get('closeIcon') || 'arrow-back';
        this.initialSlide = params.get('initialSlide') || 0;
    }
    GalleryModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    GalleryModal.prototype.resize = function (event) {
        this.slider.update();
        var width = this.element['nativeElement'].offsetWidth;
        var height = this.element['nativeElement'].offsetHeight;
        this.parentSubject.next({
            width: width,
            height: height,
        });
    };
    GalleryModal.prototype.orientationChange = function (event) {
        var _this = this;
        window.setTimeout(function () {
            _this.resize(event);
        }, 150);
    };
    GalleryModal.prototype.ionViewDidEnter = function () {
        this.resize(false);
        this.sliderLoaded = true;
    };
    GalleryModal.prototype.disableScroll = function (event) {
        if (!this.sliderDisabled) {
            this.currentSlide = this.slider.getActiveIndex();
            this.sliderDisabled = true;
        }
    };
    GalleryModal.prototype.enableScroll = function (event) {
        if (this.sliderDisabled) {
            this.slider.slideTo(this.currentSlide, 0, false);
            this.sliderDisabled = false;
        }
    };
    return GalleryModal;
}());
__decorate([
    core_1.ViewChild('slider'),
    __metadata("design:type", ionic_angular_1.Slides)
], GalleryModal.prototype, "slider", void 0);
__decorate([
    core_1.ViewChild('content'),
    __metadata("design:type", ionic_angular_1.Content)
], GalleryModal.prototype, "content", void 0);
GalleryModal = __decorate([
    core_1.Component({
        encapsulation: core_1.ViewEncapsulation.None,
        selector: 'gallery-modal',
        template: "<style> .gallery-modal {   position: relative;   background: #37415d; }   .gallery-modal .close-button {     position: absolute;     left: 5px;     top: 10px;     z-index: 10;     background: none; }     .gallery-modal .close-button.button-ios {       top: 20px; }   .gallery-modal .slider .slide-zoom {     height: 100%; }   .gallery-modal .image-on-top {     position: absolute;     left: 0;     top: 0;     width: 100%;     height: 100%;     z-index: 10;     display: block;     background-repeat: no-repeat;     background-position: center center;     background-size: contain; }   .gallery-modal close-button {     position: absolute;     right: 0;     z-index: 100; }     .gallery-modal close-button .icon {       margin-right: 0 !important; } </style> <ion-content #content class=\"gallery-modal no-scroll\" (window:resize)=\"resize($event)\" (window:orientationchange)=\"orientationChange($event)\">   <close-button></close-button>    <!-- Initial image while modal is animating -->   <div class=\"image-on-top\" #image [ngStyle]=\"{ 'background-image': 'url(' + photos[initialSlide].url + ')'}\" [hidden]=\"sliderLoaded\">     &nbsp;   </div>    <!-- Slider with images -->   <ion-slides #slider [initialSlide]=\"initialSlide\" class=\"slider\" *ngIf=\"photos.length\" [ngStyle]=\"{ 'visibility': sliderLoaded ? 'visible' : 'hidden' }\">     <ion-slide *ngFor=\"let photo of photos;\">       <zoomable-image         src=\"{{ photo.url }}\"         [ngClass]=\"{ 'swiper-no-swiping': sliderDisabled }\"         (disableScroll)=\"disableScroll($event)\"         (enableScroll)=\"enableScroll($event)\"         [parentSubject]=\"parentSubject\"       ></zoomable-image>     </ion-slide>   </ion-slides> </ion-content>",
    }),
    __metadata("design:paramtypes", [ionic_angular_1.ViewController, ionic_angular_1.NavParams, core_1.ElementRef, ionic_angular_1.Platform])
], GalleryModal);
exports.GalleryModal = GalleryModal;
//# sourceMappingURL=gallery-modal.js.map