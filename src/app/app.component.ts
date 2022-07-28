import { Component } from '@angular/core';
import { LoggerService } from './services/logger.service';
import { Product } from './model/product';
import { CikkService } from './services/cikk.service';
import { Observable, fromEvent, Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoggerService]
})

export class AppComponent {
  // Title of the application.
  title: string = 'ifsz-erp application';
  count: number = 0;
  date: Date = new Date();
  dateFormatter: string = 'yyyy-MM-dd hh:mm:ss';
  phrase: string = "";

  columns: {key: string, title: string}[] = [
    {key: "id", title: "#"},
    {key: "price", title: "Price"},
    // {key: "itemCode", title: "Code"},
    {key: "description", title: "Desc."},
    {key: "name", title: "Name"},
    {key: "manufacturer", title: "Gyártó"},
  ];

  filterKey: string = this.columns[0].key;
  
  currentWith: number = window.innerWidth;
  watcher: Subscription = fromEvent(window, 'resize').subscribe(
    ev => this.currentWith = window.innerWidth
  );
  

  list: Product[] = [
    {
      id: 1,
      name: "V",
      price: 9900,
      description: "Jó vasaló",
      itemCode: "sdjflsdjf42342lfj",
      manufacturer: ""
    },
    {
      id: 2,
      name: "Fűnyíró",
      price: 25000,
      description: "Jó vasaló",
      itemCode: "sdjflsdjf42342lfj",
      manufacturer: ""
    },
    {
      id: 3,
      name: "Lombszívó",
      price: 14000,
      description: "Lomb valami",
      itemCode: "ertdfgxdfg",
      manufacturer: ""
    },
    {
      id: 4,
      name: "Mikro sütő",
      price: 9900,
      description: "Samsung",
      itemCode: "ysfsdsdf",
      manufacturer: ""
    },
    {
      id: 5,
      name: "Porszívó",
      price: 11000,
      description: "BOSH porszívó",
      itemCode: "asfdv",
      manufacturer: "fztrdgsf"
    },
  ];

  list$: Observable<Product[]>=this.cikkService.getAll();

  one$: Observable<Product[]>=this.cikkService.getID(22);

  constructor(
    private logger: LoggerService,
    private cikkService: CikkService
  ) {
    setInterval(() => {
      this.count++;
      this.date = new Date();
      //this.logger.critical("Isn't critical");
    }, 1000);
  }

  /**
   * Give a title.
   * @param show {boolean} if true get the title, otherwise get a string.
   */
  getTitle(show: boolean): string {
    return show ? `${this.title} - ${this.count}` : '';
  }
}
