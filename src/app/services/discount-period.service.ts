import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiscountPeriodService {

  constructor() { }

  //periods = [{startDate: Date, endDate: Date}]

  test_periods = [
    {
      startDate: new Date(2022, 7, 1),
      endDate: new Date(2022, 7, 5)
    },
    {
      startDate: new Date(2022, 7, 11),
      endDate: new Date(2022, 7, 15)
    },
    {
      startDate: new Date(2022, 7, 21),
      endDate: new Date(2022, 7, 25)
    },
  ]

  getDiscountPeriods(): any {
    //ITT KELL MAJD MEGVALÓSÍTANI A VALÓS LEKÉRÉST
    return this.test_periods
  }

  selectedDateIsDicount(date: Date): boolean {
    date.setHours(0) //enélkül GMT+2-ben van
    let dateIsDiscount = false
    let discountPeriods = this.getDiscountPeriods()
    discountPeriods.forEach(period => {
      if (date >= period.startDate && date <= period.endDate) {
        dateIsDiscount = true
        return
      }
    });
    return dateIsDiscount
  }

}