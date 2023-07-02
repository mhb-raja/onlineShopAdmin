import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private titleService:Title, private router:Router){}
  ngOnInit(): void {
    //console.log("init app");


    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route: ActivatedRoute = this.router.routerState.root;
        //console.log(route)
        let routeTitle = ''; let temp=''; let temp2='';
        while (route!.firstChild) {
          if (route.snapshot.data['title']) temp += route.snapshot.data['title'] + '-';
          //console.log('LOOP',temp , route.firstChild)
          route = route.firstChild;
          if (route.snapshot.data['title']) temp2 += route.snapshot.data['title'] + '-';
        }
        if (route.snapshot.data['title']) {
          routeTitle = route!.snapshot.data['title'];
          temp +=  route!.snapshot.data['title'];
          //temp2 +=  route!.snapshot.data['title'];
          //console.log(temp,'\r\n',temp2)
        }
        return temp;// routeTitle;
      })
    )
    .subscribe((title: string) => {
      if (title) {
        this.titleService.setTitle(`MHBR - ${title}`);
      }
    });


  }


  //title = 'sampleAdmin';
}
