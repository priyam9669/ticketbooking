import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    public toastController: ToastController,
    public alertController: AlertController
  ) { }

  bookingstructure;

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      'color':'medium',
      cssClass: 'toaster',
      //color:'light'
    });
    toast.present();
  }

  async presentAlert(header,booking_id,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: booking_id,
      message: message,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


  set_to_storage(storage_key,data){
    //console.log('logged in');
    localStorage.setItem(storage_key, JSON.stringify(data));
    
    //this.storage.set(storage_key, data);
  }

  get_from_storage(storage_key){
    return JSON.parse( localStorage.getItem(storage_key));
    // storage.get('age').then((val) => {
    //   console.log('Your age is', val);
    // });
  }


}
