import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message:string, title:string, options?:object){
    this.toastr.success(message, title, options)
  }

  showError(message: string, title: string, options?:object){
      this.toastr.error(message, title, options)
  }

  showInfo(message: string, title:string, options?:object){
      this.toastr.info(message, title, options)
  }

  showWarning(message:string, title:string, options?:object){
      this.toastr.warning(message, title, options)
  }
}
