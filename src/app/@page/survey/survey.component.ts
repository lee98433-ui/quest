import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, ReactiveFormsModule, FormsModule, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
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
  minDate: string = '';




  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private surveyService: SurveyService
  ) {}
  ngOnInit() {
    this.surveyId = Number(this.route.snapshot.params['id']);
    this.surveyData = this.surveyService.getSurveyById(this.surveyId);
    // 設定最小值為今天
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    if (!this.surveyData) {
      this.router.navigate(['/list']);
      return;
    }

    this.initForm();
    this.checkAndRestoreData(); // 檢查是否有 Session 暫存需要回填

    // 取得今天日期並格式化為 YYYY-MM-DD

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    this.minDate = `${yyyy}-${mm}-${dd}`; // 結果如 "2026-03-05"

  }//ngOnInIt

  initForm() {
    this.surveyForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^09\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      age: [''],
      answers: this.fb.array(this.surveyData.questions.map((q: any) => {
        const validators = q.required ? [Validators.required] : [];
        if (q.type === 'date') {
          validators.push(this.futureDateValidator()); // 加入日期驗證
        };
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
      alert('請檢查格式以及必填欄位（姓名、手機、Email 為必填）');
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
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 只比較日期，忽略時間

      return selectedDate < today ? { pastDate: true } : null;
    };
  }


}
