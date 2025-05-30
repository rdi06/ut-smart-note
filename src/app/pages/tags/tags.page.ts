import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button>
            <ion-icon name="menu-outline"></ion-icon>
          </ion-menu-button>
        </ion-buttons>
        <ion-title>Kelola Tag</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="showCreateTag()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let tag of tags">
          <ion-chip [style.background-color]="tag.color" style="color: white;">
            {{ tag.name }}
          </ion-chip>
          <ion-buttons slot="end">
            <ion-button (click)="deleteTag(tag.id)" color="danger">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>

      <ion-modal [isOpen]="isModalOpen">
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-title>Tag Baru</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeModal()">Cancel</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <ion-item>
              <ion-label position="stacked">Nama Tag</ion-label>
              <ion-input [(ngModel)]="newTag.name" placeholder="Masukkan nama tag"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Warna</ion-label>
              <ion-grid>
                <ion-row>
                  <ion-col size="2" *ngFor="let color of defaultColors">
                    <div
                      class="color-option"
                      [style.background-color]="color"
                      [class.selected]="newTag.color === color"
                      (click)="selectColor(color)"
                    ></div>
                  </ion-col>
                  <ion-col size="2">
                    <ion-input
                      type="color"
                      [(ngModel)]="customColor"
                      (ionChange)="selectColor(customColor)"
                    ></ion-input>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>

            <ion-button
              expand="block"
              (click)="saveTag()"
              class="ion-margin-top"
              [disabled]="!newTag.name || !newTag.color"
            >
              <ion-icon slot="start" name="save-outline"></ion-icon>
              Simpan Tag
            </ion-button>
          </ion-content>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styles: [`
    .color-option {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid #ccc;
    }

    .color-option.selected {
      border: 3px solid var(--ion-color-primary);
    }

    ion-input[type="color"] {
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
    }

    ion-input[type="color"]::part(native) {
      padding: 0;
      border: none;
    }
  `]
})
export class TagsPage implements OnInit {
  tags: any[] = [];
  isModalOpen = false;
  defaultColors: string[] = [];
  customColor = '#FF5733';
  newTag = {
    name: '',
    color: ''
  };

  constructor(private storageService: StorageService) {
    this.defaultColors = this.storageService.getDefaultColors();
  }

  async ngOnInit() {
    this.loadTags();
  }

  async loadTags() {
    this.tags = await this.storageService.getTags();
  }

  showCreateTag() {
    this.newTag = {
      name: '',
      color: this.defaultColors[0]
    };
    this.isModalOpen = true;
  }

  selectColor(color: string) {
    this.newTag.color = color;
  }

  async saveTag() {
    if (!this.newTag.name || !this.newTag.color) return;

    await this.storageService.saveTag(this.newTag.name, this.newTag.color);
    this.loadTags();
    this.closeModal();
  }

  async deleteTag(id: string) {
    await this.storageService.deleteTag(id);
    this.loadTags();
  }

  closeModal() {
    this.isModalOpen = false;
  }
} 