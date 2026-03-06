import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule,FormControl, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SurveyService } from '../survey/@service/survey.service';
import {JsonPipe} from '@angular/common';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core'; // 加入此項以支援 OnPush 模式

@Component({
  selector: 'app-front-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, JsonPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './front-list.component.html',
  styleUrl: './front-list.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class FrontListComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });



  surveys: any[] = [];
  filteredSurveys: any[] = [];

  keyword: string = '';
  startDate: string = '';
  endDate: string = '';

  pageSize: number = 10;
  currentPage: number = 1;

  constructor(
    private surveyService: SurveyService,
    private cdr: ChangeDetectorRef // 注入 CDR 以手動觸發畫面更新 (OnPush 需要)
  ) {}

  ngOnInit() {
    this.surveys = this.surveyService.getAllSurveys();
    this.search();
  }



search() {
    // 從 FormGroup 取得 Date 物件
    const { start: searchStart, end: searchEnd } = this.range.value;

    this.filteredSurveys = this.surveys.filter(s => {
      // 1. 關鍵字過濾
      const matchTitle = s.title.toLowerCase().includes(this.keyword.toLowerCase());

      // 2. 日期區間過濾邏輯
      const sDate = new Date(s.startDate);
      const eDate = new Date(s.endDate);

      // 正規化時間 (將時分秒設為 0 以精確比較日期)
      if (searchStart) searchStart.setHours(0, 0, 0, 0);
      if (searchEnd) searchEnd.setHours(0, 0, 0, 0);
      sDate.setHours(0, 0, 0, 0);
      eDate.setHours(0, 0, 0, 0);

      // 邏輯：問卷的區間必須在搜尋區間之內 (或根據需求調整為重疊)
      // 這裡採用：問卷開始日 >= 搜尋開始日 且 問卷結束日 <= 搜尋結束日
      const matchStart = searchStart ? sDate >= searchStart : true;
      const matchEnd = searchEnd ? eDate <= searchEnd : true;

      return matchTitle && matchStart && matchEnd;
    });

    this.currentPage = 1;
    this.cdr.markForCheck(); // OnPush 模式下確保列表會更新
  }

  getStatus(survey: any): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(survey.startDate);
    const end = new Date(survey.endDate);

    if (today < start) return '尚未開始';
    if (today > end) return '已結束';
    return '進行中';
  }


  get pagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredSurveys.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSurveys.length / this.pageSize) || 1;
  }

  // 修正點：提供一個乾淨的陣列供 HTML 渲染分頁按鈕
  get pageList(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
