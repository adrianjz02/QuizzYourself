// video-player.component.ts
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class VideoPlayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() videoUrl: string = '';
  @Input() pauseTimeInSeconds: number = 0;
  @Output() videoPaused = new EventEmitter<void>();
  @Output() videoEnded = new EventEmitter<void>();

  player: any;
  protected videoId: string = '';
  private isQuestionTime = false;
  private apiLoaded = false;
  private videoStarted = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.videoUrl) {
      this.initializeVideo();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoUrl'] && !changes['videoUrl'].firstChange) {
      this.isQuestionTime = false;
      this.videoStarted = false;

      if (this.videoUrl) {
        this.videoId = this.extractVideoId(this.videoUrl);
        console.log('New video ID:', this.videoId);

        if (this.player) {
          this.player.loadVideoById({
            videoId: this.videoId,
            playerVars: this.getPlayerConfig()
          });
        } else {
          this.initializeVideo();
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }

  private getPlayerConfig() {
    return {
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      enablejsapi: 1
    };
  }

  private initializeVideo() {
    this.videoId = this.extractVideoId(this.videoUrl);
    console.log('Initializing video with ID:', this.videoId);

    if (this.isYouTubeUrl(this.videoUrl)) {
      if (!window.YT && !this.apiLoaded) {
        this.loadYouTubeAPI();
      } else if (window.YT) {
        this.initializeYouTubePlayer();
      }
    }
  }

  private isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('youtube.com/shorts');
  }

  private extractVideoId(url: string): string {
    // Handle YouTube Shorts URLs
    if (url.includes('/shorts/')) {
      const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      if (shortsMatch && shortsMatch[1]) {
        return shortsMatch[1];
      }
    }

    // Handle standard YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  private loadYouTubeAPI() {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        this.initializeYouTubePlayer();
      };

      this.apiLoaded = true;
    }
  }

  private initializeYouTubePlayer() {
    console.log('Initializing YouTube player with video ID:', this.videoId);
    if (window.YT && this.videoId) {
      if (this.player) {
        this.player.destroy();
      }

      this.player = new window.YT.Player('youtube-player', {
        videoId: this.videoId,
        playerVars: {
          ...this.getPlayerConfig(),
          // Add specific settings for Shorts
          height: '100%',
          width: '100%'
        },
        events: {
          onStateChange: (event: any) => this.onPlayerStateChange(event),
          onReady: () => this.onPlayerReady(),
          onError: (event: any) => this.onPlayerError(event)
        }
      });

      const iframe = document.querySelector('#youtube-player') as HTMLIFrameElement;
      if (iframe) {
        iframe.style.pointerEvents = 'none';
      }
    }
  }

  private onPlayerReady() {
    console.log('Player ready');
    if (!this.videoStarted) {
      this.videoStarted = true;
      this.player.playVideo();
    }
  }

  private onPlayerStateChange(event: any) {
    if (event.data === window.YT.PlayerState.PAUSED && !this.isQuestionTime) {
      this.player.playVideo();
      return;
    }

    if (event.data === window.YT.PlayerState.PLAYING) {
      const checkTime = setInterval(() => {
        const currentTime = this.player.getCurrentTime();
        if (!this.isQuestionTime && currentTime >= this.pauseTimeInSeconds) {
          this.isQuestionTime = true;
          this.player.pauseVideo();
          this.videoPaused.emit();
          clearInterval(checkTime);
        }
      }, 100);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      this.videoEnded.emit();
    }
  }

  private onPlayerError(event: any) {
    console.error('YouTube player error:', event);
  }
}
