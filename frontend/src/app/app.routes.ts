import { Routes } from '@angular/router';
import { IncidentCreate } from './features/incidents/incident-create/incident-create';
import { IncidentList } from './features/incidents/incident-list/incident-list';
import { IncidentDetail } from './features/incidents/incident-detail/incident-detail';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'incidents' },
  { path: 'incidents', component: IncidentList },
  { path: 'incidents/new', component: IncidentCreate },
  { path: 'incidents/:id', component: IncidentDetail },
  { path: '**', redirectTo: 'incidents' }
];
