import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { GeneralService } from "../general.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit  {

  seat_array={};
  seat_no: string;
  @ViewChild('content') private content: any;
  booking_date: any;
  booking_mobile: any;
  booking_array={};
  date: Date;
  current_date: string;
  selected_date: any;
  booking_id: any;
  edit_flag: boolean=false;


  constructor(
    public gs: GeneralService,
    public alertController: AlertController,
    public route:ActivatedRoute
  ) {
    this.date = new Date();
    this.current_date=this.date.getFullYear()+'-'+(this.date.getMonth()+1)+'-'+this.date.getDate();
    this.selected_date=this.current_date;
    //console.log([].constructor(6));
    //this.gs.set_to_storage('seats','');
    //this.gs.set_to_storage('bookings','');
    console.log('seats',this.gs.get_from_storage("seats"))
    console.log('bookings',this.gs.get_from_storage("bookings"))
    let seat_structure=this.gs.get_from_storage("seats");
    if((seat_structure==undefined || seat_structure=="")|| !seat_structure.hasOwnProperty(this.current_date)){
      this.create_seat_format(this.current_date);
    }else{
      this.seat_array=seat_structure;
    }

    
  }

  ngOnInit() {
    if(this.route.snapshot.params['booking_id']!=0){
      this.booking_id=this.route.snapshot.params['booking_id'];
      console.log(this.route.snapshot.params['booking_id'])
      this.get_specific_bookings();
      this.edit_flag=true;
    }
  }

  create_seat_format(date){
    this.seat_array={};
    let booking_date=date;
    this.seat_array[date]=[];
    this.selected_date=date;
    let seat_structure
    for(let i=1;i<=60;i++){
      seat_structure={
        "id":i,
        "booked_staus":false,
        "booking_id":"",
        "seat_no":`a${i}`
      }
      this.seat_array[date].push(seat_structure);
    }
    //console.log('this.seat_array',this.seat_array)
  }


  select_seat(id){
    let booking_date=this.current_date;
    this.seat_array[booking_date][id-1].booked_staus="booking";
    console.log('this.seat_array',this.seat_array)
  }

  unselect_seat(id){
    this.seat_array[id-1].booked_staus=false;
  }

  validate_seat(input){
    console.log(input.target.value);
    if(parseInt(input.target.value)>6){
      //alert(1)
      input.target.value="";
      this.gs.presentToast("Maximum Seat Booked can be 6")
    }else if(parseInt(input.target.value)<0){
      //alert(2)
      input.target.value="";
      this.gs.presentToast("Minimum Seat Booked can be 1")
    }else{
      //alert(3)
    }
  }

  confirmBooking(){
    // var result           = '';
    // var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // var charactersLength = characters.length;
    // for ( var i = 0; i < length; i++ ) {
    //   result += characters.charAt(Math.floor(Math.random() * charactersLength));
    // }
    this.booking_date
    this.booking_mobile
    this.seat_no
    if(this.booking_date=='' || this.booking_date==undefined){
      this.gs.presentToast("Please Select the Booking Date")
    }else if(this.booking_mobile==''  || this.booking_mobile==undefined){
      this.gs.presentToast("Enter Mobile Number")
    }else if(this.seat_no=='' || this.seat_no==undefined){
      this.gs.presentToast("Select No. of Seats")
    }else{
      // console.log(this.booking_date);
      // console.log(this.booking_mobile);
       console.log('this.seat_array',this.seat_array);

       
       
      let booking_date=this.booking_date.split('T')[0];
      this.booking_array[booking_date]=[];
      if(this.gs.get_from_storage("bookings")!=undefined || this.gs.get_from_storage("bookings")!=[]){
        //this.create_seat_format();
        this.booking_array[booking_date]=this.gs.get_from_storage("bookings")[booking_date];
      }
      console.log('booking_date',booking_date);
      console.log('this.seat_array[booking_date]',this.seat_array[booking_date]);
      let booking_details={};
      let booking_id=Date.now();
      let empty_seats=this.seat_array[booking_date].filter(seat=> seat.booked_staus!=true)
      
      booking_details={
        'booking_date':booking_date,
        'mobile':this.booking_mobile,
        'booking_id':booking_id,
        'seatNo':{}
        //'seatNo':this.seat_array[booking_date][(empty_seats.length)-i].seat_no
      }
      let j=0;
      booking_details['seatNo']=[]
      for(let i=parseInt(this.seat_no);i > 0; i--){
        //console.log('(empty_seats.length)-i',(empty_seats.length)-i);
        
        console.log(j)
        
        booking_details['seatNo'][j]={};
        booking_details['seatNo'][j]['seatNo']=this.seat_array[booking_date][(empty_seats.length)-i].seat_no
        //console.log('(this.seat_array.length-1)-i',(empty_seats.length-1)-i)
        this.seat_array[(booking_date).toString()][(empty_seats.length)-i].booking_id=booking_id;
        this.seat_array[booking_date.toString()][(empty_seats.length)-i].booked_staus=true;
        j++;
      }
      this.booking_array[booking_date].push(booking_details);
      console.log('result', this.booking_array);
      console.log('this.seat_array', this.seat_array);
      this.gs.set_to_storage('bookings',this.booking_array)
      this.gs.set_to_storage('seats',this.seat_array);
      console.log(this.gs.get_from_storage("seats"))
      this.booking_date=""
      this.booking_mobile=""
      this.seat_no=""
      this.gs.presentAlert('Booking Confirmed!',booking_id,`Booking date: <strong>${this.booking_date.split('T')[0]}</strong><br>Mobile No.: ${this.booking_mobile}`)
    }
    
    //this.booking_date
  }

  get_booking(value){
    this.selected_date=value.split('T')[0];
    console.log(value.split('T')[0]);
    if(this.gs.get_from_storage("seats")[value.split('T')[0]]==undefined || this.gs.get_from_storage("seats")[value.split('T')[0]]==""){
      this.create_seat_format(value.split('T')[0]);
    }else{
      this.seat_array[this.selected_date]=this.gs.get_from_storage("seats")[value.split('T')[0]];
    }
    
  }

  get_specific_bookings(){
    this.booking_id=this.route.snapshot.params['booking_id'];
    var booking_date=this.route.snapshot.params['booking_date'];
    var booking_list=this.gs.get_from_storage("bookings");
    console.log('bookings',booking_list[booking_date])
    console.log('bookings',booking_list[booking_date].findIndex((element) => element.booking_id ==this.route.snapshot.params['booking_id']))
    let booking_index=booking_list[booking_date].findIndex((element) => element.booking_id ==this.route.snapshot.params['booking_id'])
    let booking_details =booking_list[booking_date][booking_index];
    this.booking_date=booking_details.booking_date
    this.booking_mobile=booking_details.mobile
    this.seat_no=(booking_details.seatNo).length
    console.log('booking_details[booking_date][booking_index]).length',(booking_details.seatNo).length)
    this.get_booking(booking_date)
    //this.cancel_bookings(this.booking_date,this.booking_id)
  }


  async cancel_bookings(booking_date,booking_id){
    //this.booking_id=booking_id
    //var booking_date=booking_date
    var booking_list=this.gs.get_from_storage("bookings");
    //console.log('bookings',booking_list[booking_date])
    //console.log('bookings',booking_list[booking_date].findIndex((element) => element.booking_id ==this.route.snapshot.params['booking_id']))
    let booking_index=booking_list[booking_date].findIndex((element) => element.booking_id ==booking_id)
    let booking_details =booking_list[booking_date][booking_index];
    console.log('booking_details',booking_details.seatNo)
    await this.cancel_seat_bookings(booking_details);
    let bookings=booking_list[booking_date].splice(booking_index, 1);
    this.gs.set_to_storage('bookings',bookings)
  }

  cancel_seat_bookings(booking_details){
    booking_details.seatNo.forEach((seatNo) => {
      console.log(seatNo.seatNo);
    
      //let booking_id=this.booking_id
      let seat_array=this.gs.get_from_storage("seats");
      var booking_date=this.route.snapshot.params['booking_date'];
      console.log('seat_array_index',seat_array[booking_date].findIndex((element) => element.seat_no ==seatNo.seatNo))
      let seat_array_index=seat_array[booking_date].findIndex((element) => element.seat_no ==seatNo.seatNo);
      if(seat_array_index!=-1){
        //this.empty_seats(seat_array_index);
        this.seat_array[(this.booking_date).toString()][seat_array_index].booking_id="";
        this.seat_array[this.booking_date.toString()][seat_array_index].booked_staus=false;
        this.gs.set_to_storage('seats',this.seat_array);
        console.log('227::: seat_array',this.seat_array);
      }
    });
  }

  // empty_seats(seat_index){
  //   //this.booking_date
  //   this.seat_array[(this.booking_date).toString()][seat_index].booking_id="";
  //   this.seat_array[this.booking_date.toString()][seat_index].booked_staus=false;
  //   this.gs.set_to_storage('seats',this.seat_array);
  //   console.log('227::: seat_array',this.seat_array);
  //   //this.cancel_seat_bookings()
  // }

  editBooking(){

  }

}
