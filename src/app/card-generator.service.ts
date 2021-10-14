import { Injectable } from '@angular/core';

declare var createjs: any;

@Injectable({
  providedIn: 'root',
})
export class CardGeneratorService {
  private script?: any;
  private canvas?: HTMLCanvasElement;
  private stage?: any;
  private image?: any;
  private frame?: any;
  private logo?: any;

  constructor() {}

  setCanvas(element: HTMLCanvasElement): void {
    this.canvas = element;
    if (!this.script) {
      this.script = document.createElement('script');
      this.script.onload = () => {
        this.stage = new createjs.Stage(this.canvas);
        createjs.Touch.enable(this.stage);
        this.stage.enableMouseOver(10);
      };
      this.script.src = 'https://code.createjs.com/1.0.0/createjs.min.js';
      document.body.appendChild(this.script);
    } else {
      this.stage = new createjs.Stage(this.canvas);
      createjs.Touch.enable(this.stage);
      this.stage.enableMouseOver(10);
    }
  }

  async loadImage(file: File): Promise<void> {
    const base64: string = (await this.getBase64(file)) as string;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = base64;
      image.onload = (event) => {
        const target = event.target;
        if (!this.image) {
          this.image = new createjs.Bitmap(target);
          this.stage.addChild(this.image);
          this.stage.setChildIndex(this.image, 0);
          let offset: any;
          this.image.on('mousedown', (evt: any) => {
            this.image.parent.addChild(this.image);
            offset = {
              x: this.image.x - evt.stageX,
              y: this.image.y - evt.stageY,
            };
          });
          this.image.on('pressmove', (evt: any) => {
            this.image.x = evt.stageX + offset.x;
            this.image.y = evt.stageY + offset.y;
            if (this.logo) {
              this.stage.setChildIndex(this.logo, 2);
            }
            if (this.frame) {
              this.stage.setChildIndex(this.frame, 1);
            }
            this.stage.setChildIndex(this.image, 0);
            this.stage.update();
          });
        } else {
          this.image.image = target;
        }
        const xratio = this.canvas.width / this.image.image.width;
        const yratio = this.canvas.height / this.image.image.height;
        const scale = Math.min(xratio, yratio);
        this.image.scaleX = this.image.scaleY = scale;
        this.stage.update();
        resolve();
      };
    });
  }

  zoomInImage(): void {
    this.image.scaleX = this.image.scaleY = this.image.scaleX + 0.05;
    this.stage.update();
  }

  zoomOutImage(): void {
    if (this.image.scaleX > 0.05) {
      this.image.scaleX = this.image.scaleY = this.image.scaleX - 0.05;
      this.stage.update();
    }
  }

  rotateLeft(): void {
    this.image.rotation = this.image.rotation - 5;
    this.stage.update();
  }

  rotateRight(): void {
    this.image.rotation = this.image.rotation + 5;
    this.stage.update();
  }

  async loadFrame(file: File): Promise<void> {
    const base64: string = (await this.getBase64(file)) as string;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = base64;
      image.onload = (event) => {
        const target = event.target;
        if (!this.frame) {
          this.frame = new createjs.Bitmap(target);
          this.stage.addChild(this.frame);
          this.stage.setChildIndex(this.frame, 1);
        } else {
          this.frame.image = target;
        }
        const xratio = this.canvas.width / this.frame.image.width;
        const yratio = this.canvas.height / this.frame.image.height;
        this.frame.scaleX = xratio;
        this.frame.scaleY = yratio;
        this.stage.update();
        resolve();
      };
    });
  }

  async loadLogo(file: File): Promise<void> {
    const base64: string = (await this.getBase64(file)) as string;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = base64;
      image.onload = (event) => {
        const target = event.target;
        if (!this.logo) {
          this.logo = new createjs.Bitmap(target);
          this.stage.addChild(this.logo);
          this.stage.setChildIndex(this.logo, 2);
        } else {
          this.logo.image = target;
        }
        const xratio = 75 / this.logo.image.width;
        const yratio = 75 / this.logo.image.height;
        const scale = Math.min(xratio, yratio);
        this.logo.scaleX = this.logo.scaleY = scale;
        this.logo.x = this.canvas.width - 90;
        this.logo.y = this.canvas.height - 90;
        this.stage.update();
        resolve();
      };
    });
  }

  private async getBase64(file: File): Promise<ArrayBuffer | string> {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  }
}
