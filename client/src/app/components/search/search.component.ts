import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) { }

  doSearch(value: String) {
    console.log(`value=${value}`);
    // route data to search "route", it's handled by ProductListComponent
    this.router.navigateByUrl(`/search/${value}`);
  }

  ngOnInit(): void {
  }

}
