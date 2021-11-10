import { Component, OnInit } from '@angular/core';

import { HomePage } from "../home/home.page";

import { GeneralService } from "../general.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  booking_list={};
  date: Date;
  current_date: string;

  constructor(
    public gs: GeneralService,
    public hompage: HomePage
  ) { 
    this.date = new Date();
    this.current_date=this.date.getFullYear()+'-'+(this.date.getMonth()+1)+'-'+this.date.getDate();
    console.log(this.gs.get_from_storage("bookings"))
    this.booking_list=this.gs.get_from_storage("bookings")[this.current_date];
  }

  ngOnInit() {
  }

  get_booking(date){
    this.booking_list=this.gs.get_from_storage("bookings")[date.split('T')[0]]
  }

  cancel_booking(booking_date,booking_id){
    this.hompage.cancel_bookings(booking_date,booking_id)
  }

}
