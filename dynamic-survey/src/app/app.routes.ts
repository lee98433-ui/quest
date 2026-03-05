import { Routes } from '@angular/router';
import { SurveyComponent } from './@page/survey/survey.component';
import { FrontListComponent } from './@page/front-list/front-list.component';
import { ConfirmComponentComponent } from './@page/confirm-component/confirm-component.component';

export const routes: Routes = [
  // {path:'survey',component:SurveyComponent},
  // {path:'fl01',component:FrontListComponent},
  // {path:'cc',component:ConfirmComponentComponent},


  // 1. 問卷列表頁 (首頁)
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: FrontListComponent },

  // 2. 問卷填寫頁 (需帶入問卷編號 id)
  { path: 'fill/:id', component: SurveyComponent },

  // 3. 問卷確認頁 (需帶入問卷編號 id)
  { path: 'confirm/:id', component: ConfirmComponentComponent },

  // 4. 萬用路徑 (找不到網頁時導回列表)
  { path: '**', redirectTo: 'list' }
];
