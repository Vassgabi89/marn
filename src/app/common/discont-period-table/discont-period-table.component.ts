import { Component, OnInit } from '@angular/core';
import { DiscountPeriodService } from 'src/app/services/discount-period.service';

@Component({
  selector: 'app-discont-period-table',
  templateUrl: './discont-period-table.component.html',
  styleUrls: ['./discont-period-table.component.css']
})
export class DiscontPeriodTableComponent implements OnInit {

  discount_periods=this.service.getDiscountPeriods()

  constructor(
    private service: DiscountPeriodService
  ) { }

  ngOnInit() {
    //console.log(this.discount_periods)
  }


}
