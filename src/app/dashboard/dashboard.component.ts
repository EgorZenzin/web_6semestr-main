import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  heroes$: Observable<Hero[]>;

  constructor(private heroService: HeroService) {
    this.heroes$ = this.heroService.getHeroes()
      .pipe(
        map(heroes => heroes.slice(1, 5))
      );
  }

  ngOnInit(): void {}
}
