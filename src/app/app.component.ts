import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CardGeneratorService } from './card-generator.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;

  constructor(private cardService: CardGeneratorService) {}

  ngAfterViewInit(): void {
    this.cardService.setCanvas(this.canvas.nativeElement);
  }

  async uploadFile(event: any): Promise<void> {
    await this.cardService.loadImage(event.target.files[0]);
  }

  async uploadFrame(event: any): Promise<void> {
    await this.cardService.loadFrame(event.target.files[0]);
  }

  async uploadLogo(event: any): Promise<void> {
    await this.cardService.loadLogo(event.target.files[0]);
  }

  zoomIn(): void {
    this.cardService.zoomInImage();
  }

  zoomOut(): void {
    this.cardService.zoomOutImage();
  }

  rotateLeft(): void {
    this.cardService.rotateLeft();
  }

  rotateRight(): void {
    this.cardService.rotateRight();
  }
}
