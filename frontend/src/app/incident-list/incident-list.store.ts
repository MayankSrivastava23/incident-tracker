import { Injectable } from '@angular/core';
import { ListQuery } from '../core/api/incidents.api';
import { Incident } from '../core/models/incident.model';
import { PageResponse } from '../core/models/page-response.model';


@Injectable({ providedIn: 'root' })
export class IncidentListStore {
  private cachedQueryKey?: string;
  private cachedResponse?: PageResponse<Incident>;
  private cachedAt = 0;
  private readonly TTL_MS = 60_000; 

  private makeKey(q: ListQuery): string {
    return JSON.stringify({
      q: q.q ?? '',
      service: q.service ?? '',
      status: q.status ?? '',
      severity: q.severity ?? '',
      page: q.page ?? 1,
      size: q.size ?? 10,
      sortBy: q.sortBy ?? 'createdAt',
      sortDir: q.sortDir ?? 'desc',
    });
  }

  save(query: ListQuery, res: PageResponse<Incident>): void {
    this.cachedQueryKey = this.makeKey(query);
    this.cachedResponse = res;
    this.cachedAt = Date.now();
  }

  loadIfFresh(query: ListQuery): PageResponse<Incident> | null {
    if (!this.cachedResponse || !this.cachedQueryKey) return null;

    const isFresh = Date.now() - this.cachedAt <= this.TTL_MS;
    const sameQuery = this.cachedQueryKey === this.makeKey(query);

    return isFresh && sameQuery ? this.cachedResponse : null;
  }

  clear(): void {
    this.cachedQueryKey = undefined;
    this.cachedResponse = undefined;
    this.cachedAt = 0;
  }
}
