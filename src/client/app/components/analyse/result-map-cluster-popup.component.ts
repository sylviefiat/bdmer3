import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { LngLatLike } from 'mapbox-gl';
import { Cluster, Supercluster } from 'supercluster';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'result-map-cluster-popup',
  template: `
      <mat-list>
        <mat-list-item
          *ngFor="let leaf of leaves">
          {{ leaf.properties['code'] }}: {{ getValue(leaf) }} {{ getUnit() }}
        </mat-list-item>
      </mat-list>
      <mat-paginator
        [length]="count"
        [pageSize]="5"
        (page)="changePage($event)">
      </mat-paginator>
    `
})
export class ClusterPopupComponent implements OnChanges {
  @Input() clusterId: GeoJSON.Feature<GeoJSON.Point>;
  @Input() supercluster: Supercluster;
  @Input() count: number;
  @Input() typeShow: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  leaves: GeoJSON.Feature<GeoJSON.Point>[];

  ngOnChanges(changes: SimpleChanges) {
    this.changePage();
    if (changes.count && !changes.count.isFirstChange()) {
      this.paginator.firstPage();
    }
  }

  changePage(pageEvent?: PageEvent) {
    let offset = 0;
    if (pageEvent) {
      offset = pageEvent.pageIndex * 5;
    }
    // Typing issue in supercluster    
    this.leaves = (<any>this.supercluster.getLeaves)(this.clusterId, 5, offset);
  }

  getValue(feature) {
    switch (this.typeShow) {
      case "B":
        return Math.round(feature.properties.biomass);
      case "A":
        return Math.round(feature.properties.abundancy);
      default:
        return 0;
    }
  }

  getUnit(){
    switch (this.typeShow) {
      case "B":
        return "Kg/ha";
      case "A":
        return "Holot./ha";
      default:
        return 0;
    }
  }
}