import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  imports: [NgOptimizedImage]
})


export class Hero implements OnInit {

  //COUNTER SIGNALS
  factoriesCount = signal(0);
  materialsCount = signal(0);
  dealsCount = signal(0);
  successCount = signal(0);

    //LIFECYCLE
  ngOnInit(): void {
    this.animateCounter(500, this.factoriesCount);
    this.animateCounter(1500, this.materialsCount);
    this.animateCounter(98, this.dealsCount);
    this.animateCounter(12, this.successCount);
  }

     //COUNTER ANIMATION LOGIC
  private animateCounter(target: number, counterSignal: WritableSignal<number>): void {
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counterSignal.set(target);
        clearInterval(timer);
      } else {
        counterSignal.set(Math.floor(current));
      }
    }, stepTime);
  }
}