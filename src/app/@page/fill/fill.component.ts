import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-fill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fill.component.html',
  styleUrls: ['./fill.component.scss']
})
export class FillComponent {
  showVideo = false;
  // 1. 定義影片 ID
  videoId = 'u3GLhKSDUIM';

  // 2. 設定開始秒數 (例如從第 60 秒開始)
  startTime = 18;
  videoSrc = `https://www.youtube.com/embed/${this.videoId}?autoplay=1&start=${this.startTime}`; // 換成你的有效 ID
  safeVideoUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  openVideo() {
    // 點擊開啟時才生成安全連結，觸發 Angular 的更新機制
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoSrc);
    this.showVideo = true;
  }

  closeVideo() {
    this.showVideo = false;
    this.safeVideoUrl = null; // 關閉時清空，下次開啟重新載入
  }
}
