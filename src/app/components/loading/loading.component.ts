import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Subject, takeUntil } from 'rxjs';
import { AuthState } from '../../state/auth/auth.state';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    // Listen to auth state changes
    this.store.select((state: any) => state.auth).pipe(
      takeUntil(this.destroy$)
    ).subscribe(authState => {
      // If user is authenticated and not loading, redirect to products
      if (authState.user && !authState.loading) {
        this.router.navigate(['/products']);
      }
      // If no token and not loading, redirect to login
      else if (!authState.accessToken && !authState.loading) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
