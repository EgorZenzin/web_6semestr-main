import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  hero$!: Observable<Hero>;
  heroForm: FormGroup;
  private destroy$ = new Subject<void>();
  private hero!: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.heroForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      power: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      level: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      birthDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.hero$ = this.heroService.getHero(id);
    this.hero$
      .pipe(takeUntil(this.destroy$))
      .subscribe(hero => {
        this.hero = hero;
        this.heroForm.patchValue(hero);
      });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.heroForm.valid && this.hero) {
      const updatedHero = { ...this.hero, ...this.heroForm.value };
      this.heroService.updateHero(updatedHero)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.goBack());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
