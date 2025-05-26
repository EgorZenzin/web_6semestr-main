import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroesComponent implements OnInit, OnDestroy {
  private heroesSubject = new BehaviorSubject<Hero[]>([]);
  heroes$ = this.heroesSubject.asObservable();
  private destroy$ = new Subject<void>();

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(heroes => this.heroesSubject.next(heroes));
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .pipe(takeUntil(this.destroy$))
      .subscribe(hero => {
        const currentHeroes = this.heroesSubject.value;
        this.heroesSubject.next([...currentHeroes, hero]);
      });
  }

  delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const currentHeroes = this.heroesSubject.value;
        this.heroesSubject.next(currentHeroes.filter(h => h.id !== hero.id));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
