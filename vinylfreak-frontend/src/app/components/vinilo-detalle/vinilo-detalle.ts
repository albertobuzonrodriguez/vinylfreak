import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DiscogsService } from '../../services/discogs';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-vinilo-detalle',
  templateUrl: './vinilo-detalle.html',
  styleUrls: ['./vinilo-detalle.css'],
  standalone: false,
})
export class ViniloDetalle implements OnInit, OnDestroy {
  vinilo: any = null;
  cargando: boolean = true;
  portadaSegura: string | null = null;
  videoUrl: SafeResourceUrl | null = null;
  private routerSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private discogsService: DiscogsService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.obtenerIdYNavegar();
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.obtenerIdYNavegar());
  }

  private obtenerIdYNavegar() {
    const id = this.route.snapshot.paramMap.get('id');
    this.portadaSegura = this.route.snapshot.queryParamMap.get('portada');
    if (id) {
      this.cargarInformacion(id);
    }
  }

  cargarInformacion(id: string) {
    this.cargando = true;
    this.videoUrl = null;
    this.discogsService.obtenerDetalle(id).subscribe({
      next: (res) => {
        this.vinilo = res;

        if (this.vinilo?.videos && this.vinilo.videos.length > 0) {
          const videoYouTube = this.vinilo.videos.find(
            (v: any) => v.uri && (v.uri.includes('youtube.com') || v.uri.includes('youtu.be'))
          );

          if (videoYouTube) {
            const videoId = this.extractVideoId(videoYouTube.uri);
            if (videoId) {
              const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
              this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
            }
          }
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  private extractVideoId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match: any = url.match(regExp);
    if (match && match && match.length === 11) {
      return match as string;
    }
    return null;
  }

  volver() {
    window.history.back();
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
  }
}
