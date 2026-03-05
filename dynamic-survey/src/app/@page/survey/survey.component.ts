import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SurveyService } from '../survey/@service/survey.service';
@Component({
  selector: 'app-survey',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss'
})
export class SurveyComponent implements OnInit {
surveyForm!: FormGroup;
  surveyId!: number;
  surveyData: any;





  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private surveyService: SurveyService
  ) {}
  ngOnInit() {
    this.surveyId = Number(this.route.snapshot.params['id']);
    this.surveyData = this.surveyService.getSurveyById(this.surveyId);

    if (!this.surveyData) {
      this.router.navigate(['/list']);
      return;
    }

    this.initForm();
    this.checkAndRestoreData(); // 檢查是否有 Session 暫存需要回填
  }

  initForm() {
    this.surveyForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^09\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      age: [''],
      answers: this.fb.array(this.surveyData.questions.map((q: any) => {
        if (q.type === 'checkbox') return this.fb.array([]);
        return new FormControl(q.required ? '' : null, q.required ? Validators.required : null);
      }))
    });
  }

  // 從 Session 恢復先前填過的資料 (回上一頁修改時觸發)
  checkAndRestoreData() {
    const saved = sessionStorage.getItem('temp_survey_data');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.surveyId === this.surveyId) {
        // 回填基本資料
        this.surveyForm.patchValue({
          name: data.name, phone: data.phone, email: data.email, age: data.age
        });
        // 注意：動態問題回填需視資料結構處理，這裡先處理基本欄位
      }
    }
  }

  get answersArray() { return this.surveyForm.get('answers') as FormArray; }
  getControl(i: number) { return this.answersArray.at(i) as FormControl; }

  onCheckboxChange(e: any, qIndex: number, option: string) {
    const checkArray = this.answersArray.at(qIndex) as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(option));
    } else {
      const i = checkArray.controls.findIndex(x => x.value === option);
      if (i !== -1) checkArray.removeAt(i);
    }
  }

  submitToSession() {
    if (this.surveyForm.invalid) {
      alert('請檢查格式（姓名、手機、Email 為必填）');
      return;
    }

    const rawValue = this.surveyForm.value;
    const processedAnswers = rawValue.answers.map((ans: any) =>
      Array.isArray(ans) ? ans.join(';') : ans
    );

    const finalData = { ...rawValue, answers: processedAnswers, surveyId: this.surveyId };
    sessionStorage.setItem('temp_survey_data', JSON.stringify(finalData));
    this.router.navigate(['/confirm', this.surveyId]);
  }
  goBack() {
    this.router.navigate(['/list']);
  }

//   getControl(index: number): FormControl {
//   return this.answersArray.at(index) as FormControl;
// }
// ngOnInit() {
//     this.surveyId = this.route.snapshot.params['id'];
//     this.initForm();
//     // 1. 取得網址 ID
//     this.surveyId = Number(this.route.snapshot.params['id']);

//     // 2. 向 Service 索取該 ID 的問卷資料
//     this.surveyData = this.SurveyService.getSurveyById(this.surveyId);

//     // 3. 如果找不到資料，導回列表頁
//     if (!this.surveyData) {
//       alert('找不到該問卷！');
//       this.router.navigate(['/list']);
//       return;
//     }

//     // 4. 資料拿到後，才初始化表單
//     this.initForm();
//   }

//   initForm() {
//     this.surveyForm = this.fb.group({
//       // 固定欄位
//       name: ['', Validators.required],
//       phone: ['', [Validators.required, Validators.pattern(/^09\d{8}$/)]],
//       email: ['', [Validators.required, Validators.email]],
//       age: [''],
//       // 動態問題答案
//       answers: this.fb.array(this.surveyData.questions.map((q: { type: string; required: any; }) => {
//         if (q.type === 'checkbox') {
//           return this.fb.array([]); // 多選題用陣列處理
//         }
//         return new FormControl(q.required ? '' : null, q.required ? Validators.required : null);
//       }))
//     });
//   }

//   // 處理 Checkbox 多選
//   onCheckboxChange(e: any, qIndex: number, option: string) {
//     const checkArray: FormArray = (this.surveyForm.get('answers') as FormArray).at(qIndex) as FormArray;
//     if (e.target.checked) {
//       checkArray.push(new FormControl(option));
//     } else {
//       let i: number = 0;
//       checkArray.controls.forEach((item) => {
//         if (item.value == option) {
//           checkArray.removeAt(i);
//           return;
//         }
//         i++;
//       });
//     }
//   }

//   submitToSession() {
//     if (this.surveyForm.invalid) {
//       alert('請檢查必填欄位與格式是否正確！');
//       return;
//     }

//     const rawValue = this.surveyForm.value;

//     // 處理多選題：用分號 (;) 串接
//     const processedAnswers = rawValue.answers.map((ans: any) =>
//       Array.isArray(ans) ? ans.join(';') : ans
//     );

//     const finalData = { ...rawValue, answers: processedAnswers, surveyId: this.surveyId };

//     // 存入 SessionStorage
//     sessionStorage.setItem('temp_survey_data', JSON.stringify(finalData));

//    // 從填寫頁跳轉到確認頁 (這會觸發路由中的 :id)
//     this.router.navigate(['/confirm', this.surveyId]);
//   }




//   }
}
