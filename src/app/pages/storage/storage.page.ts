import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { ChatWidgetComponent } from '../../components/chat-widget/chat-widget.component';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [IonicModule, CommonModule, ChatWidgetComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button>
            <ion-icon name="menu-outline"></ion-icon>
          </ion-menu-button>
        </ion-buttons>
        <ion-title>Penyimpanan File Tugas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            <ion-icon name="cloud-upload-outline"></ion-icon>
            Upload File
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-input
              type="file"
              (ionChange)="onFileSelected($event)"
              label="Pilih File"
              labelPlacement="stacked"
            ></ion-input>
          </ion-item>
          <ion-button
            expand="block"
            (click)="uploadFile()"
            [disabled]="!selectedFile"
            class="ion-margin-top"
          >
            <ion-icon slot="start" name="cloud-upload-outline"></ion-icon>
            Upload
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-list>
        <ion-item *ngFor="let file of files">
          <ion-label>
            <h2>{{ file.name }}</h2>
            <p>{{ formatDate(file.createdAt) }}</p>
          </ion-label>
          <ion-buttons slot="end">
            <ion-button (click)="downloadFile(file)">
              <ion-icon slot="icon-only" name="download-outline"></ion-icon>
            </ion-button>
            <ion-button (click)="deleteFile(file.id)">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>
    </ion-content>

    <app-chat-widget></app-chat-widget>
  `,
  styles: [`
    ion-icon {
      margin-right: 8px;
      vertical-align: middle;
    }
  `]
})
export class StoragePage implements OnInit {
  files: any[] = [];
  selectedFile: File | null = null;

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    this.loadFiles();
  }

  async loadFiles() {
    this.files = await this.storageService.getFiles();
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async uploadFile() {
    if (!this.selectedFile) return;

    await this.storageService.saveFile(this.selectedFile);
    this.selectedFile = null;
    this.loadFiles();
  }

  downloadFile(file: any) {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  }

  async deleteFile(id: string) {
    await this.storageService.deleteFile(id);
    this.loadFiles();
  }

  formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
} 