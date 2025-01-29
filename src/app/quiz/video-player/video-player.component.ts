// video-player.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

  safeVideoUrl: SafeResourceUrl | null = null;
  player: any;
  protected videoId: string = '';
  private isQuestionTime = false;
  private apiLoaded = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.videoUrl) {
      this.initializeVideo();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoUrl'] && !changes['videoUrl'].firstChange) {
      // Reset state
      this.isQuestionTime = false;

      // Update video
      if (this.videoUrl) {
        this.videoId = this.extractVideoId(this.videoUrl);
        console.log('New video ID:', this.videoId);

        if (this.player) {
          // If player exists, load new video
          this.player.loadVideoById(this.videoId);
        } else {
          // If no player, initialize
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

  private initializeVideo() {
    this.videoId = this.extractVideoId(this.videoUrl);
    console.log('Initializing video with ID:', this.videoId);

    if (this.videoUrl.includes('youtube.com') || this.videoUrl.includes('youtu.be')) {
      if (!window.YT && !this.apiLoaded) {
        this.loadYouTubeAPI();
      } else if (window.YT) {
        this.initializeYouTubePlayer();
      }
    }
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
          enablejsapi: 1,
          controls: 1,
          modestbranding: 1
        },
        events: {
          onStateChange: (event: any) => this.onPlayerStateChange(event),
          onReady: () => this.onPlayerReady()
        }
      });
    }
  }

  private onPlayerReady() {
    console.log('Player ready');
    this.player.playVideo();
  }

  private onPlayerStateChange(event: any) {
    if (event.data === window.YT.PlayerState.PLAYING) {
      const checkTime = setInterval(() => {
        const currentTime = this.player.getCurrentTime();
        if (!this.isQuestionTime && currentTime >= this.pauseTimeInSeconds) {
          this.isQuestionTime = true;
          this.player.pauseVideo();
          this.videoPaused.emit();
          clearInterval(checkTime);
        }
      }, 1000);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      this.videoEnded.emit();
    }
  }

  private extractVideoId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }
}
