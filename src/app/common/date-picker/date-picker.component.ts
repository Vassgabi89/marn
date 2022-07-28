import { Component, OnInit } from '@angular/core';
import { DiscountPeriodService } from 'src/app/services/discount-period.service';
import { Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {
@Output() newItemEvent = new EventEmitter<boolean>();

  selectedDate: Date
  dateIsDiscount: boolean
  
  constructor(
    private service: DiscountPeriodService
  ) {
  }
  
  ngOnInit() {
    this.selectedDate = new Date()
  }
  
  ngAfterContentInit() {
    let input = document.getElementById('date-picker') as HTMLInputElement
    input.valueAsDate = this.selectedDate
  }

  datePicked() {
    let input = document.getElementById('date-picker') as HTMLInputElement
    this.selectedDate = input.valueAsDate
    this.dateIsDiscount = this.service.selectedDateIsDicount(this.selectedDate)
    this.newItemEvent.emit(this.dateIsDiscount);
  }

}
