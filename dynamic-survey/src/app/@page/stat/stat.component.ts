import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,RouterLink } from '@angular/router';
import { SurveyService } from '../survey/@service/survey.service';

import Chart from 'chart.js/auto';
@Component({
  selector: 'app-stat',
  imports: [CommonModule,RouterLink],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss'
})
export class StatComponent implements OnInit{
surveyData: any; // 原始題目定義
  processedStats: any[] = []; // 計算後的統計結果
  expandedIndex: number | null = null; // 控制哪個圖表被展開
  charts: { [key: string]: any } = {}; // 存放 Chart 實例
  // 彈窗控制
  showModal = false;
  currentStat: any = null; // 當前選中的題目統計資料
  chartInstances: any[] = []; // 改用陣列存放多個圖表實例


constructor(private route: ActivatedRoute, private surveyService: SurveyService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.surveyData = this.surveyService.getSurveyById(id);
    const submissions = this.surveyService.getSubmissionsBySurveyId(id);
    this.calculateStats(submissions);

}

// 確保組件銷毀時清理圖表，避免記憶體洩漏
  ngOnDestroy() {
    this.clearCharts();
  }
// 輔助函式：判斷是否有文字題，決定是否顯示文字區塊
hasTextQuestions() {
  return this.processedStats.some(s => s.type === 'textarea');
}
  // 將原始答案轉為統計數據
  calculateStats(submissions: any[]) {
    this.processedStats = this.surveyData.questions.map((q: any, index: number) => {
      const answers = submissions.map(s => s.answers[index]); // 取得該題所有人的答案

      if (q.type === 'radio' || q.type === 'checkbox') {
        const counts: { [key: string]: number } = {};
        // 初始化選項
        q.options.forEach((opt: string) => counts[opt] = 0);
        // 累加數值 (處理 checkbox 的分號串接)
        answers.forEach(ans => {
          if (!ans) return;
          const splitAns = ans.split(';');
          splitAns.forEach((a: string) => { if(counts[a] !== undefined) counts[a]++ });
        });
        return { title: q.title, type: q.type, data: counts, total: answers.length };
      } else {
        // 文字題
        return { title: q.title, type: q.type, feedbacks: answers.filter(a => !!a) };
      }
    });
  }
  // 打開全報表彈窗
openFullDashboard() {
  this.showModal = true;
  // 增加延遲，讓彈窗動畫 (0.5s) 先跑一半
  setTimeout(() => {
    this.renderAllCharts();
  }, 400);
}
renderAllCharts() {
    this.clearCharts(); // 先清空舊的

    this.processedStats.forEach((stat, index) => {
      // 只有選擇題需要畫圖
      if (stat.type === 'radio' || stat.type === 'checkbox') {
        const ctx = document.getElementById('modalChart-' + index) as HTMLCanvasElement;
        if (ctx) {
          const chart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: Object.keys(stat.data),
              datasets: [{
                data: Object.values(stat.data),
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043', '#26A69A', '#78909C']
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
            }
          });
          this.chartInstances.push(chart);
        }
      }
    });
  }

  clearCharts() {
    this.chartInstances.forEach(chart => chart.destroy());
    this.chartInstances = [];
  }

  closeModal() {
    this.showModal = false;
    this.clearCharts();
  }

}
