import { AbstractControl } from "@angular/forms";

export class CustomValidators {
    static passwordMatchValidator(control: AbstractControl) {
        const actualPassword = control.get('postedCurrentPassword')?.value;
        const newPassword = control.get('postedNewPassword1')?.value;
        const newPasswordConfirmation = control.get('postedNewPassword2')?.value;

        if(actualPassword !== '' || newPassword !== '' || newPasswordConfirmation !== '') {
            if(actualPassword == '') {
                control.get('postedCurrentPassword')?.setErrors({noActualPassword: true});
            }
            if(newPassword == '') {
                control.get('postedNewPassword1')?.setErrors({noNewPassword: true});
            }
            if(newPasswordConfirmation == '') {
                control.get('postedNewPassword2')?.setErrors({noNewPasswordConfirmation: true});
            }
            if(newPassword !== newPasswordConfirmation) {
                //console.log('déclenché');
                //console.log(control.get('postedNewPassword2')?.hasError('noNewPasswordConfirmation'));
                //console.log(control.get('postedNewPassword2')?.hasError('pattern'));
                if(!control.get('postedNewPassword2')?.errors) {
                    control.get('postedNewPassword2')?.setErrors({newPasswordMismatch: true});
                }
            }
        }
    }
}
