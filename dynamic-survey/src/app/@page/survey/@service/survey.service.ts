import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  // 模擬資料庫中的多張問卷
  private allSurveys = [
    {
      id: 101,
      title: '理論投票A',
      description: '活著好難',
      startDate: '2025/08/12',
      endDate: '2026/12/31',
      questions: [
        { id: 1, title: '頭痛的話會怎麼做', type: 'radio', options: ['敲看看腳', '敲看看頭', '把頭摘下來放進洗衣機轉'], required: true },
        { id: 2, title: '有其他更好的方法嗎', type: 'textarea', required: false }
      ]
    },
    {
      id: 102,
      title: '沒有意義的票選',
      description: '總而言之言而總之，因為如此所以如此，那就票選吧各位啊!',
      startDate: '2025/08/01',
      endDate: '2026/10/12',
      questions: [
        { id: 1, title: '請選擇想要切開的東西', type: 'radio', options: ['衣服', '水果', '意識'], required: true },
        { id: 2, title: '請說明理由', type: 'textarea', required: false },
        { id: 3, title: '何者是昆蟲', type: 'checkbox', options: ['螞蟻', '蝴蝶', '蜈蚣', '石頭'], required: true }
      ]
    }
  ];


  constructor() {}


  // 確保方法名稱完全正確
  getAllSurveys(): any[] {
    return this.allSurveys;
  }

  getSurveyById(id: number): any {
    return this.allSurveys.find(s => s.id === id);
  }

}
