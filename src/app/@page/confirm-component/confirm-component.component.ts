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
      // 安全檢查：確保暫存資料的 ID 與網址一致
      if (this.userData.surveyId !== this.surveyId) {
        alert('資料不一致，請重新填寫');
        this.router.navigate(['/list']);
      }
    } else {
      // 若無暫存資料，導回列表
      this.router.navigate(['/list']);
    }
  }

  onModify() {
    this.router.navigate(['/fill', this.surveyId]);
  }

onSubmit() {
    if (confirm('確定要送出問卷嗎？送出後將無法修改。')) {
      // 1. 呼叫 Service 的儲存方法（這是上一段我們寫在 Service 的方法）
      this.surveyService.saveFinalSubmission(this.userData);

      // 2. 清除暫存，避免重複送出
      sessionStorage.removeItem('temp_survey_data');

      // 3. 提示成功並跳轉
      alert('問卷成功送出！');
      this.router.navigate(['/list']);
    }
  }

}
