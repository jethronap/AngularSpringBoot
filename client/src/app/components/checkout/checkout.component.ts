import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;
  checkoutFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      member: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      address: this.formBuilder.group({
        country: [''],
        city: [''],
        street: [''],
        zipCode: [''],
      }),
    });
  }

  onSubmit(){
    console.log("Handling the submit btn");
    console.log(this.checkoutFormGroup.get('member').value);
    console.log(this.checkoutFormGroup.get('address').value);
  }

}
