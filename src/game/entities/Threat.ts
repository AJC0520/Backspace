export class Threat {
  x: number;
  y: number;
  readonly width: number;
  readonly height: number;
  readonly color: number;

  constructor(x: number, y: number, width: number, height: number, color: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
}
