import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SurveyService } from '../survey/@service/survey.service';

@Component({
  selector: 'app-front-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './front-list.component.html',
  styleUrl: './front-list.component.scss'
})
export class FrontListComponent implements OnInit {
  surveys: any[] = [];
  filteredSurveys: any[] = [];

  keyword: string = '';
  startDate: string = '';
  endDate: string = '';

  pageSize: number = 10;
  currentPage: number = 1;

  constructor(private surveyService: SurveyService) {}

  ngOnInit() {
    this.surveys = this.surveyService.getAllSurveys();
    this.search();
  }

  search() {
    this.filteredSurveys = this.surveys.filter(s => {
      const matchTitle = s.title.toLowerCase().includes(this.keyword.toLowerCase());

      const sDate = new Date(s.startDate);
      const eDate = new Date(s.endDate);
      const searchStart = this.startDate ? new Date(this.startDate) : null;
      const searchEnd = this.endDate ? new Date(this.endDate) : null;

      const matchStart = searchStart ? sDate >= searchStart : true;
      const matchEnd = searchEnd ? eDate <= searchEnd : true;

      return matchTitle && matchStart && matchEnd;
    });

    this.currentPage = 1;
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
