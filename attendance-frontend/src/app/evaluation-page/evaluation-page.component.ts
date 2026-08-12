import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {EvaluationService} from '../services/evaluation.service';
import {Evaluation} from '../models/evaluation';
import {EvaluationContentsComponent} from './evaluation-contents/evaluation-contents.component';
import {MatButton} from '@angular/material/button';
import {MatDialog, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';

@Component({
  selector: 'app-evaluation-page',
  standalone: true,
  imports: [
    NgIf,
    EvaluationContentsComponent,
    MatButton,
    MatDialogActions,
    MatDialogTitle
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

  @ViewChild('goBackDialog') goBackDialog!: TemplateRef<any>;
  goBackDialogRef!: MatDialogRef<any>;

  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;
  confirmDeleteDialogRef!: MatDialogRef<any>;

  @ViewChild('confirmSubmitDialog') confirmSubmitDialog!: TemplateRef<any>;
  confirmSubmitDialogRef!: MatDialogRef<any>;

  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  successDialogRef!: MatDialogRef<any>;

  attemptedAction: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private evalService: EvaluationService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.evalId = Number(this.route.snapshot.paramMap.get('id'));

    this.evalService.getEvalById(this.evalId).subscribe(evaluation => {
      this.evaluation = evaluation;
      this.evalLoaded = true;
    })
  }

  cancelDialog() {
    this.dialog.closeAll();
  }

  openGoBackDialog() {
    this.goBackDialogRef = this.dialog.open(this.goBackDialog);
  }

  openDeleteConfirmationDialog() {
    this.cancelDialog();
    this.confirmDeleteDialogRef = this.dialog.open(this.confirmDeleteDialog);
  }

  openSubmitConfirmationDialog() {
    this.cancelDialog();
    this.confirmSubmitDialogRef = this.dialog.open(this.confirmSubmitDialog);
  }

  openSuccessDialog() {
    this.cancelDialog();
    this.successDialogRef = this.dialog.open(this.successDialog);
  }

  goBack() {
    this.cancelDialog();
    this.router.navigate(['/member', this.evaluation.member.memberId, 'stations'])
  }

  deleteEvaluation() {
    if (!this.evaluation) {
      return;
    }
    this.attemptedAction = 'deleted';

    this.cancelDialog();

    this.evalService.deleteEval(this.evalId).subscribe(success => {
      if (success) {
        this.openSuccessDialog();
      } else {
        this.openSnackBar("Error deleting evaluation", "Ok", 3000);
      }
    }, error => {
      console.log(error);
      this.openSnackBar("Error deleting evaluation", "Ok", 3000);
    })
  }

  save() {
    this.attemptedAction = 'saved';
    this.cancelDialog();

    this.evalService.saveEval(this.evaluation).subscribe(updatedEval => {
      this.openSuccessDialog();
    }, error => {
      console.log(error);
      this.openSnackBar("Error saving evaluation", "Ok", 3000);
    })
  }

  submit() {
    this.attemptedAction = 'submitted';
    this.cancelDialog();

    this.evalService.submitEval(this.evaluation).subscribe(updatedEval => {
      this.openSuccessDialog();
    }, error => {
      console.log(error);
      this.openSnackBar("Error submitting evaluation", "Ok", 3000);
    })
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

}
