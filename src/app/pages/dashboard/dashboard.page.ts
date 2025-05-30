import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatWidgetComponent } from '../../components/chat-widget/chat-widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ChatWidgetComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button>
            <ion-icon name="menu-outline"></ion-icon>
          </ion-menu-button>
        </ion-buttons>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>Selamat datang di UT SmartNote</h1>
      <p>Pilih menu yang tersedia untuk mulai:</p>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card routerLink="/notes" class="ion-activatable ripple-parent">
              <ion-ripple-effect></ion-ripple-effect>
              <ion-card-header>
                <ion-card-title>
                  <ion-icon name="document-text-outline"></ion-icon>
                  Catatan Pribadi
                </ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Buat dan kelola catatan pribadi Anda
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="6">
            <ion-card routerLink="/storage" class="ion-activatable ripple-parent">
              <ion-ripple-effect></ion-ripple-effect>
              <ion-card-header>
                <ion-card-title>
                  <ion-icon name="folder-outline"></ion-icon>
                  Penyimpanan File Tugas
                </ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Upload dan kelola file tugas Anda
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <app-chat-widget></app-chat-widget>
  `,
  styles: [`
    ion-card {
      cursor: pointer;
      transition: transform 0.2s;
    }

    ion-card:hover {
      transform: translateY(-5px);
    }

    ion-icon {
      margin-right: 8px;
      font-size: 24px;
      vertical-align: middle;
    }

    h1 {
      font-size: 24px;
      font-weight: bold;
      color: var(--ion-color-dark);
      margin-bottom: 16px;
    }

    p {
      color: var(--ion-color-medium);
      margin-bottom: 24px;
    }
  `]
})
export class DashboardPage {
  constructor() {}
} 