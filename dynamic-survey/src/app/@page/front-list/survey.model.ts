export interface Survey {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  results?: SurveyResult[];
}

export interface SurveyResult {
  option: string;
  count: number;
}
