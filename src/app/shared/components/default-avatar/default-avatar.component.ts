import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-default-avatar',
  imports: [],
  templateUrl: './default-avatar.component.html',
  styleUrl: './default-avatar.component.css',
})
export class DefaultAvatarComponent {
  public randomColor: string = this.generateRandomColor();
  @Input() public Letter: string = this.generateRandomLetter();

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  generateRandomLetter(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters.charAt(Math.floor(Math.random() * letters.length));
  }
}
