import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-option-card',
  templateUrl: './option-card.component.html',
  styleUrls: ['./option-card.component.css']
})
export class OptionCardComponent implements OnInit {

  @Input() cardText: string;
  @Input() isCorrectAnswer: boolean;
  @Output() selectedCardEmitter = new EventEmitter<string>();
  submittedCard: boolean;
  selectedCard: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  emitSelection(): void {
    this.selectedCardEmitter.emit(this.cardText);
  }

  isSubmittedAndCorrect(): boolean {
    return this.selectedCard && this.submittedCard;
  }

  isSubmittedAndFalse(): boolean {
    return this.selectedCard && !this.submittedCard;
  }
}
