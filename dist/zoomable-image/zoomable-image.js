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
var ZoomableImage = (function () {
    function ZoomableImage() {
        this.disableScroll = new core_1.EventEmitter();
        this.enableScroll = new core_1.EventEmitter();
        this.scale = 1;
        this.scaleStart = 1;
        this.maxScale = 3;
        this.minScale = 1;
        this.minScaleBounce = 0.2;
        this.maxScaleBounce = 0.35;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.position = {
            x: 0,
            y: 0,
        };
        this.scroll = {
            x: 0,
            y: 0,
        };
        this.centerRatio = {
            x: 0,
            y: 0,
        };
        this.centerStart = {
            x: 0,
            y: 0,
        };
        this.dimensions = {
            width: 0,
            height: 0,
        };
        this.panCenterStart = {
            x: 0, y: 0,
        };
    }
    ZoomableImage.prototype.ngOnInit = function () {
        var _this = this;
        this.scrollableElement = this.ionScrollContainer['_elementRef'].nativeElement.querySelector('.scroll-content');
        this.attachEvents();
        this.parentSubject.subscribe(function (event) {
            _this.resize(event);
        });
        this.resize(false);
    };
    ZoomableImage.prototype.ngOnDestroy = function () {
        this.scrollableElement.removeEventListener('scroll', this.scrollListener);
    };
    ZoomableImage.prototype.attachEvents = function () {
        var _this = this;
        this.gesture = new ionic_angular_1.Gesture(this.container.nativeElement);
        this.gesture.listen();
        this.gesture.on('doubletap', function (e) { return _this.doubleTapEvent(e); });
        this.gesture.on('pinch', function (e) { return _this.pinchEvent(e); });
        this.gesture.on('pinchstart', function (e) { return _this.pinchStartEvent(e); });
        this.gesture.on('pinchend', function (e) { return _this.pinchEndEvent(e); });
        this.gesture.on('pan', function (e) { return _this.panEvent(e); });
        this.scrollListener = this.scrollEvent.bind(this);
        this.scrollableElement.addEventListener('scroll', this.scrollListener);
    };
    ZoomableImage.prototype.resize = function (event) {
        this.setWrapperDimensions(event.width, event.height);
        this.setImageDimensions();
    };
    ZoomableImage.prototype.setWrapperDimensions = function (width, height) {
        this.dimensions.width = width || window.innerWidth;
        this.dimensions.height = height || window.innerHeight;
    };
    ZoomableImage.prototype.setImageDimensions = function () {
        if (!this.imageElement) {
            this.imageElement = new Image();
            this.imageElement.src = this.src;
            this.imageElement.onload = this.saveImageDimensions.bind(this);
            return;
        }
        this.saveImageDimensions();
    };
    ZoomableImage.prototype.saveImageDimensions = function () {
        var width = this.imageElement['width'];
        var height = this.imageElement['height'];
        if (width / height > this.dimensions.width / this.dimensions.height) {
            this.imageWidth = this.dimensions.width;
            this.imageHeight = height / width * this.dimensions.width;
        }
        else {
            this.imageHeight = this.dimensions.height;
            this.imageWidth = width / height * this.dimensions.height;
        }
        this.maxScale = Math.max(width / this.imageWidth - this.maxScaleBounce, 1.5);
        this.image.nativeElement.style.width = this.imageWidth + "px";
        this.image.nativeElement.style.height = this.imageHeight + "px";
        this.displayScale();
    };
    ZoomableImage.prototype.pinchEvent = function (event) {
        var scale = this.scaleStart * event.scale;
        if (scale > this.maxScale) {
            scale = this.maxScale + (1 - this.maxScale / scale) * this.maxScaleBounce;
        }
        else if (scale < this.minScale) {
            scale = this.minScale - (1 - scale / this.minScale) * this.minScaleBounce;
        }
        this.scale = scale;
        this.displayScale();
        event.preventDefault();
    };
    ZoomableImage.prototype.pinchStartEvent = function (event) {
        this.scaleStart = this.scale;
        this.setCenter(event);
    };
    ZoomableImage.prototype.pinchEndEvent = function (event) {
        this.checkScroll();
        if (this.scale > this.maxScale) {
            this.animateScale(this.maxScale);
        }
        else if (this.scale < this.minScale) {
            this.animateScale(this.minScale);
        }
    };
    ZoomableImage.prototype.doubleTapEvent = function (event) {
        this.setCenter(event);
        var scale = this.scale > 1 ? 1 : 2.5;
        if (scale > this.maxScale) {
            scale = this.maxScale;
        }
        this.animateScale(scale);
    };
    ZoomableImage.prototype.panEvent = function (event) {
        var x = Math.max(Math.floor(this.panCenterStart.x + event.deltaX), 0);
        var y = Math.max(Math.floor(this.panCenterStart.y + event.deltaY), 0);
        this.centerStart.x = x;
        this.centerStart.y = y;
        if (event.isFinal) {
            this.panCenterStart.x = x;
            this.panCenterStart.y = y;
        }
        this.displayScale();
    };
    ZoomableImage.prototype.scrollEvent = function (event) {
        this.scroll.x = event.target.scrollLeft;
        this.scroll.y = event.target.scrollTop;
    };
    ZoomableImage.prototype.setCenter = function (event) {
        var realImageWidth = this.imageWidth * this.scale;
        var realImageHeight = this.imageHeight * this.scale;
        this.centerStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
        this.centerStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);
        this.panCenterStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
        this.panCenterStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);
        this.centerRatio.x = Math.min((this.centerStart.x + this.scroll.x) / realImageWidth, 1);
        this.centerRatio.y = Math.min((this.centerStart.y + this.scroll.y) / realImageHeight, 1);
    };
    ZoomableImage.prototype.setScroll = function () {
        this.scrollableElement.scrollLeft = this.scroll.x;
        this.scrollableElement.scrollTop = this.scroll.y;
    };
    ZoomableImage.prototype.displayScale = function () {
        var realImageWidth = this.imageWidth * this.scale;
        var realImageHeight = this.imageHeight * this.scale;
        this.position.x = Math.max((this.dimensions.width - realImageWidth) / (2 * this.scale), 0);
        this.position.y = Math.max((this.dimensions.height - realImageHeight) / (2 * this.scale), 0);
        this.image.nativeElement.style.transform = "scale(" + this.scale + ") translate(" + this.position.x + "px, " + this.position.y + "px)";
        this.container.nativeElement.style.width = realImageWidth + "px";
        this.container.nativeElement.style.height = realImageHeight + "px";
        this.scroll.x = this.centerRatio.x * realImageWidth - this.centerStart.x;
        this.scroll.y = this.centerRatio.y * realImageWidth - this.centerStart.y;
        this.setScroll();
    };
    ZoomableImage.prototype.checkScroll = function () {
        if (this.scale > 1) {
            this.disableScroll.emit({});
        }
        else {
            this.enableScroll.emit({});
        }
    };
    ZoomableImage.prototype.animateScale = function (scale) {
        this.scale += (scale - this.scale) / 5;
        if (Math.abs(this.scale - scale) <= 0.1) {
            this.scale = scale;
        }
        this.displayScale();
        if (Math.abs(this.scale - scale) > 0.1) {
            window.requestAnimationFrame(this.animateScale.bind(this, scale));
        }
        else {
            this.checkScroll();
        }
    };
    return ZoomableImage;
}());
__decorate([
    core_1.ViewChild('image'),
    __metadata("design:type", Object)
], ZoomableImage.prototype, "image", void 0);
__decorate([
    core_1.ViewChild('container'),
    __metadata("design:type", Object)
], ZoomableImage.prototype, "container", void 0);
__decorate([
    core_1.ViewChild('ionScrollContainer'),
    __metadata("design:type", ionic_angular_1.Scroll)
], ZoomableImage.prototype, "ionScrollContainer", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ZoomableImage.prototype, "src", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Subject_1.Subject)
], ZoomableImage.prototype, "parentSubject", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ZoomableImage.prototype, "disableScroll", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ZoomableImage.prototype, "enableScroll", void 0);
ZoomableImage = __decorate([
    core_1.Component({
        encapsulation: core_1.ViewEncapsulation.None,
        selector: 'zoomable-image',
        template: "<style> zoomable-image {   width: 100%;   height: 100%; }   zoomable-image ion-scroll {     width: 100%;     height: 100%;     text-align: left;     white-space: nowrap; }     zoomable-image ion-scroll .scroll-zoom-wrapper {       width: 100%;       height: 100%; }     zoomable-image ion-scroll .image {       display: inline-block;       vertical-align: top;       text-align: left;       min-width: 100%;       min-height: 100%;       transform-origin: left top;       background-repeat: no-repeat;       background-position: center center;       background-size: contain; }       zoomable-image ion-scroll .image img {         pointer-events: none;         max-width: none;         min-width: none;         transform-origin: left top; } </style> <ion-scroll #ionScrollContainer scrollX=\"true\" scrollY=\"true\" zoom=\"false\">   <div #container class=\"image\">     <img #image src=\"{{ src }}\" alt=\"\" />   </div> </ion-scroll>",
    }),
    __metadata("design:paramtypes", [])
], ZoomableImage);
exports.ZoomableImage = ZoomableImage;
//# sourceMappingURL=zoomable-image.js.map