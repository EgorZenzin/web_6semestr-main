import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
  heroForm: FormGroup;

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
    this.heroService.getHero(id)
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
        .subscribe(() => this.goBack());
    }
  }
}
