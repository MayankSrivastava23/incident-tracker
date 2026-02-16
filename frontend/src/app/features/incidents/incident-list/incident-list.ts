import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  takeUntil,
  catchError,
  of,
} from 'rxjs';

import { IncidentsApi } from '../../../core/api/incidents.api';
import { Incident } from '../../../core/models/incident.model';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './incident-list.html',
  styleUrl: './incident-list.css',
})
export class IncidentList implements OnInit, OnDestroy {
  private api = inject(IncidentsApi);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  private destroy$ = new Subject<void>();
  private refresh$ = new Subject<void>();

  displayedColumns = ['title', 'service', 'severity', 'status', 'createdAt', 'owner'];

  data: Incident[] = [];

  page = 1;
  size = 10;
  totalItems = 0;

  sortBy = 'createdAt';
  sortDir: 'asc' | 'desc' = 'desc';

  search = new FormControl<string>('', { nonNullable: true });
  service = new FormControl<string>('', { nonNullable: true });
  status = new FormControl<string>('', { nonNullable: true });
  severity = new FormControl<string>('', { nonNullable: true });

  services = ['Payments', 'Auth', 'Search', 'Orders', 'Notifications', 'Billing'];
  statuses = ['OPEN', 'MITIGATED', 'RESOLVED'];
  severities: Array<'SEV1' | 'SEV2' | 'SEV3' | 'SEV4'> = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];

  get safePageIndex(): number {
    return Math.max(0, (this.page ?? 1) - 1);
  }

  get safeTotalItems(): number {
    return Math.max(0, this.totalItems ?? 0);
  }

  ngOnInit(): void {
    this.search.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 1;
        this.refresh$.next();
      });
    this.refresh$
      .pipe(
        startWith(void 0),
        switchMap(() => {
          const query = {
            q: this.search.value.trim() || undefined,
            service: this.service.value || undefined,
            status: this.status.value || undefined,
            severity: this.severity.value || undefined,
            page: Math.max(1, this.page),
            size: Math.max(1, this.size),
            sortBy: this.sortBy,
            sortDir: this.sortDir,
          };

          return this.api.list(query).pipe(
            catchError((err: any) => {
              this.snack.open(err?.error?.message ?? 'Failed to load incidents', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
              });
              return of({ items: [], page: query.page, size: query.size, totalItems: 0 } as any);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res: any) => {
        this.data = [...(res.items ?? [])];
        const p = Number(res.page);
        const s = Number(res.size);
        const t = Number(res.totalItems);

        this.page = Number.isFinite(p) && p >= 1 ? p : 1;
        this.size = Number.isFinite(s) && s >= 1 ? s : 10;
        this.totalItems = Number.isFinite(t) && t >= 0 ? t : 0;
      });
  }

  apply(): void {
    this.page = 1;
    this.refresh$.next();
  }

  resetFilters(): void {
    this.search.setValue('');
    this.service.setValue('');
    this.status.setValue('');
    this.severity.setValue('');

    this.sortBy = 'createdAt';
    this.sortDir = 'desc';
    this.page = 1;
    this.size = 10;

    this.refresh$.next();
  }

  onPage(e: PageEvent): void {
    this.size = Math.max(1, e.pageSize);
    this.page = Math.max(1, e.pageIndex + 1);
    this.refresh$.next();
  }

  onSort(s: Sort): void {
    if (!s.active) return;
    this.sortBy = s.active;
    this.sortDir = (s.direction || 'asc') as 'asc' | 'desc';
    this.page = 1;
    this.refresh$.next();
  }

  openRow(row: Incident): void {
    this.router.navigate(['/incidents', row.id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refresh$.complete();
  }

  statusClass(s: string): string {
    const x = (s || '').toUpperCase();
    if (x === 'OPEN') return 'pill open';
    if (x === 'MITIGATED') return 'pill mitigated';
    if (x === 'RESOLVED') return 'pill resolved';
    return 'pill';
  }
}
