// survey.model.ts
export interface Question {
  id: number;
  title: string;
  type: 'text' | 'radio' | 'checkbox' | 'textarea';
  options?: string[]; // 供單選/多選使用
  required: boolean;
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  questions: Question[];
}
