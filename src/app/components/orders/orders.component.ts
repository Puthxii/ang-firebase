import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../shared/orders.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  constructor(
    public ordersService: OrdersService
  ) { }
  coffees = ['Americano', 'Flat White', 'Cappuccino', 'Latte', 'Espresso', 'Machiato', 'Mocha', 'Hot Chocolate', 'Tea'];
  coffeeOrder = [];
  // tslint:disable-next-line: typedef
  ngOnInit() {
  }
  addCoffee = coffee => this.coffeeOrder.push(coffee);
  removeCoffee = coffee => {
    const index = this.coffeeOrder.indexOf(coffee);
    if (index > -1) { this.coffeeOrder.splice(index, 1); }
  }
  // tslint:disable-next-line: typedef
  onSubmit() {
    return true;
  }
}
