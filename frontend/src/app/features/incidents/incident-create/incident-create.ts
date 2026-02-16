import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule, MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { finalize, timeout } from 'rxjs/operators';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { IncidentsApi } from '../../../core/api/incidents.api';

@Component({
  selector: 'app-incident-create',
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
    MatRadioModule ,
    MatIconModule
  ],
  templateUrl: './incident-create.html',
  styleUrl: './incident-create.css',
})
export class IncidentCreate {
  private fb = inject(FormBuilder);
  private api = inject(IncidentsApi);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  loading = false;

  services = ['Payments', 'Auth', 'Search', 'Orders', 'Notifications', 'Billing'];
  severities = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
  statuses = ['OPEN', 'MITIGATED', 'RESOLVED'];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    service: ['', [Validators.required]],
    severity: ['', [Validators.required]],
    status: ['OPEN', [Validators.required]],
    owner: [''],
    summary: ['']
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snack.open('Please fill required fields correctly.', 'OK', {
        duration: 2500,
        verticalPosition: 'top',
      });
      return;
    }

    this.loading = true;

    this.api.create(this.form.getRawValue() as any).pipe(
      timeout(15000),
      finalize(() => (this.loading = false))
    ).subscribe({
      next: () => {
        this.snack.open('✅ Incident created successfully', 'OK', {
          duration: 2500,
          verticalPosition: 'top',
        });
        this.router.navigateByUrl('/incidents');
      },
      error: (err: any) => {
        this.snack.open(err?.error?.message ?? '❌ Failed to create incident', 'Close', {
          duration: 3500,
          verticalPosition: 'top',
        });
      }
    });
  }
}
