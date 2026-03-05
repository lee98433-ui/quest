export interface SurveyQuestion {
  id: string;
  label: string;
  type: 'text' | 'radio' | 'checkbox';
  required?: boolean;
  options?: { label: string; value: string }[];
}
