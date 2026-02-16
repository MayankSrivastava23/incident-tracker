import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil, take, timeout } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { IncidentsApi } from '../../../core/api/incidents.api';
import { Incident } from '../../../core/models/incident.model';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './incident-detail.html',
  styleUrls: ['./incident-detail.css'],
})
export class IncidentDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(IncidentsApi);
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private destroy$ = new Subject<void>();

  loading = false;
  saving = false;
  incident?: Incident;

  statuses = ['OPEN', 'MITIGATED', 'RESOLVED'];
  status = new FormControl<string>('', { nonNullable: true });
  owner = new FormControl<string>('', { nonNullable: true });

  formChanged = false;
  private initialStatus = '';
  private initialOwner = '';

  ngOnInit(): void {
    this.status.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.computeChanged());
    this.owner.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.computeChanged());
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((pm) => {
        const id = pm.get('id');
        if (!id || id === 'undefined') {
          this.snack.open('Invalid incident id', 'OK', { duration: 2500, verticalPosition: 'top' });
          this.router.navigateByUrl('/incidents');
          return;
        }
        this.load(id);
      });
  }

  private computeChanged() {
    const s = (this.status.value || '').trim();
    const o = (this.owner.value || '').trim();
    this.formChanged = s !== this.initialStatus || o !== this.initialOwner;
  }

  private applyToForm(res: Incident) {
    this.status.setValue(res.status, { emitEvent: false });
    this.owner.setValue(res.owner ?? '', { emitEvent: false });
    this.initialStatus = (res.status || '').trim();
    this.initialOwner = (res.owner ?? '').trim();
    this.formChanged = false;
  }

  load(id: string) {
    this.loading = true;
    this.incident = undefined;
    this.cdr.detectChanges();

    this.api.getById(id).pipe(
      take(1),
      timeout(15000),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.incident = res;
          this.applyToForm(res);
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        this.zone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
          this.snack.open(err?.error?.message ?? 'Failed to load incident', 'Close', {
            duration: 3500,
            verticalPosition: 'top',
          });
          this.router.navigateByUrl('/incidents');
        });
      },
    });
  }
save() {
  if (!this.incident) return;
  if (!this.formChanged) {
    this.snack.open('No changes to save', 'OK', { duration: 1500, verticalPosition: 'top' })
      .afterDismissed()
      .pipe(take(1))
      .subscribe(() => this.router.navigateByUrl('/incidents'));
    return;
  }

  this.saving = true;
  this.api.patch(this.incident.id, {
    status: this.status.value,
    owner: this.owner.value?.trim() ? this.owner.value.trim() : undefined,
  }).pipe(
    take(1),
    timeout(15000),
    takeUntil(this.destroy$)
  ).subscribe({
    next: (updated) => {
      this.zone.run(() => {
        this.incident = updated;
        this.applyToForm(updated);
        this.saving = false;
        this.cdr.detectChanges();

        this.snack.open('✅ Changes saved', 'OK', { duration: 1800, verticalPosition: 'top' })
          .afterDismissed()
          .pipe(take(1))
          .subscribe(() => this.router.navigateByUrl('/incidents'));
      });
    },
    error: (err: any) => {
      this.zone.run(() => {
        this.saving = false;
        this.cdr.detectChanges();
        this.snack.open(err?.error?.message ?? '❌ Failed to save changes', 'Close', {
          duration: 3500,
          verticalPosition: 'top',
        });
      });
    }
  });
}

cancel() {
  if (this.formChanged) {
    const ok = confirm('You have unsaved changes. Discard them and go back?');
    if (!ok) return;
  }

  this.snack.open('Cancelled', 'OK', { duration: 1200, verticalPosition: 'top' })
    .afterDismissed()
    .pipe(take(1))
    .subscribe(() => this.router.navigateByUrl('/incidents'));
}

  statusClass(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'OPEN') return 'pill open';
    if (s === 'MITIGATED') return 'pill mitigated';
    if (s === 'RESOLVED') return 'pill resolved';
    return 'pill';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
