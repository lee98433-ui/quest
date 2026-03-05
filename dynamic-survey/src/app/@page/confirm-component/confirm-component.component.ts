import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SurveyService } from '../survey/@service/survey.service';
@Component({
  selector: 'app-confirm-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './confirm-component.component.html',
  styleUrl: './confirm-component.component.scss'
})
export class ConfirmComponentComponent implements OnInit {
surveyId!: number;
  surveyData: any; // 原始問卷題目資訊
  userData: any;   // 使用者填寫的答案

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private surveyService: SurveyService
  ) {}

  ngOnInit() {
    this.surveyId = Number(this.route.snapshot.params['id']);
    this.surveyData = this.surveyService.getSurveyById(this.surveyId);

    const saved = sessionStorage.getItem('temp_survey_data');
    if (saved) {
      this.userData = JSON.parse(saved);
    } else {
      this.router.navigate(['/list']);
    }
  }

  onModify() {
    this.router.navigate(['/fill', this.surveyId]);
  }

  onSubmit() {
    if (confirm('確定要送出嗎？')) {
      // 這裡執行 API POST 送往資料庫
      console.log('Final Data to DB:', this.userData);

      sessionStorage.removeItem('temp_survey_data'); // 清空 Session
      alert('問卷已成功送出！');
      this.router.navigate(['/list']);
    }
  }

}
