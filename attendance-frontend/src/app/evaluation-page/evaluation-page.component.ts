import {Component, inject, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {EvaluationService} from '../services/evaluation.service';
import {Evaluation} from '../models/evaluation';
import {EvaluationContentsComponent} from './evaluation-contents/evaluation-contents.component';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-evaluation-page',
  standalone: true,
  imports: [
    NgIf,
    EvaluationContentsComponent,
    MatButton
  ],
  templateUrl: './evaluation-page.component.html',
  styleUrl: './evaluation-page.component.css'
})
export class EvaluationPageComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  evalId!: number;
  evaluation!: Evaluation;

  evalLoaded: boolean = false;

  readonly: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private evalService: EvaluationService) {
  }

  ngOnInit() {
    this.evalId = Number(this.route.snapshot.paramMap.get('id'));

    this.evalService.getEvalById(this.evalId).subscribe(evaluation => {
      this.evaluation = evaluation;
      this.evalLoaded = true;
    })
  }

  submit() {
    this.evalService.submitEval(this.evaluation).subscribe(updatedEval => {
      this.router.navigate(['/member', this.evaluation.member.memberId, 'stations'])
    })
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

}
