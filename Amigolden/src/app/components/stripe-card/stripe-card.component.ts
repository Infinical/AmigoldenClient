import { Input, OnInit,
  ViewChild, AfterViewInit, OnDestroy,
  ElementRef, ChangeDetectorRef, Output, EventEmitter, Component  } from '@angular/core';
import { NgForm } from '@angular/forms';
declare var stripe: any;
declare var elements: any;

@Component({
  selector: 'stripe-card',
  templateUrl: './stripe-card.component.html',
  styleUrls: ['./stripe-card.component.scss'],
})
export class StripeCardComponent implements AfterViewInit, OnDestroy {

  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;

  @Output() cardToken = new EventEmitter<any>();
  @Input() amount: number;
  @Input() hasExistingCard = false;

  useExisting = false;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    const { token, error } = await stripe.createToken(this.card);

    if (error) {
      console.log('Something is wrong:', error);
    } else {
      this.cardToken.emit(token);
    }
  }
}
