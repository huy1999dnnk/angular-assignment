import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Subject, takeUntil } from 'rxjs';
import { AuthState } from '../../state/auth.state';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  template: `
    <div class="loading-container">
      <mat-card class="loading-card">
        <mat-card-content>
          <div class="loading-content">
            <mat-spinner diameter="50"></mat-spinner>
            <h2>Loading...</h2>
            <p>Please wait while we verify your authentication.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .loading-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 20px;
    }

    .loading-content h2 {
      margin: 20px 0 10px 0;
      color: #333;
    }

    .loading-content p {
      margin: 0;
      color: #666;
    }
  `]
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
