import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { ChatWidgetComponent } from '../../components/chat-widget/chat-widget.component';

interface Tag {
  id: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ChatWidgetComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button>
            <ion-icon name="menu-outline"></ion-icon>
          </ion-menu-button>
        </ion-buttons>
        <ion-title>Catatan Pribadi</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="showCreateNote()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item *ngFor="let note of notes">
          <ion-label>
            <h2>{{ note.title }}</h2>
            <p>
              <ion-chip
                *ngFor="let tag of note.tags"
                [style.background-color]="tag.color"
                style="color: white;"
              >
                {{ tag.name }}
              </ion-chip>
            </p>
          </ion-label>
          <ion-buttons slot="end">
            <ion-button (click)="editNote(note)">
              <ion-icon slot="icon-only" name="create-outline"></ion-icon>
            </ion-button>
            <ion-button (click)="deleteNote(note.id)">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>

      <ion-modal [isOpen]="isModalOpen">
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-title>{{ isEditing ? 'Edit Catatan' : 'Catatan Baru' }}</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeModal()">Cancel</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <ion-item>
              <ion-label position="stacked">Judul</ion-label>
              <ion-input [(ngModel)]="currentNote.title"></ion-input>
            </ion-item>
            
            <ion-item>
              <ion-label position="stacked">Tags</ion-label>
              <div class="selected-tags">
                <ion-chip
                  *ngFor="let tag of selectedTags"
                  [style.background-color]="tag.color"
                  style="color: white;"
                  (click)="removeTag(tag)"
                >
                  {{ tag.name }}
                  <ion-icon name="close-circle"></ion-icon>
                </ion-chip>
              </div>
              <ion-select
                [(ngModel)]="selectedTagId"
                (ionChange)="onTagSelect($event)"
                placeholder="Pilih tag"
              >
                <ion-select-option
                  *ngFor="let tag of availableTags"
                  [value]="tag.id"
                >
                  {{ tag.name }}
                </ion-select-option>
              </ion-select>
              <ion-button slot="end" routerLink="/tags" size="small">
                <ion-icon slot="icon-only" name="pricetags-outline"></ion-icon>
              </ion-button>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Isi Catatan</ion-label>
              <ion-textarea
                [(ngModel)]="currentNote.content"
                rows="6"
              ></ion-textarea>
            </ion-item>

            <ion-button expand="block" (click)="saveNote()" class="ion-margin-top">
              <ion-icon slot="start" name="save-outline"></ion-icon>
              Save
            </ion-button>
          </ion-content>
        </ng-template>
      </ion-modal>
    </ion-content>

    <app-chat-widget></app-chat-widget>
  `,
  styles: [`
    .selected-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 8px 0;
    }

    ion-select {
      width: 100%;
      max-width: none;
    }
  `]
})
export class NotesPage implements OnInit {
  notes: any[] = [];
  isModalOpen = false;
  isEditing = false;
  currentNote: any = {
    title: '',
    content: '',
    tags: []
  };

  // Tag management
  availableTags: Tag[] = [];
  selectedTags: Tag[] = [];
  selectedTagId: string = '';

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    this.loadNotes();
  }

  async loadNotes() {
    this.notes = await this.storageService.getNotes();
  }

  async loadTags() {
    this.availableTags = await this.storageService.getTags();
    // Filter out already selected tags
    this.updateAvailableTags();
  }

  updateAvailableTags() {
    const selectedIds = this.selectedTags.map(tag => tag.id);
    this.availableTags = this.availableTags.filter(tag => !selectedIds.includes(tag.id));
  }

  showCreateNote() {
    this.isEditing = false;
    this.currentNote = {
      title: '',
      content: '',
      tags: []
    };
    this.selectedTags = [];
    this.selectedTagId = '';
    this.loadTags();
    this.isModalOpen = true;
  }

  editNote(note: any) {
    this.isEditing = true;
    this.currentNote = { ...note };
    this.selectedTags = [...note.tags];
    this.selectedTagId = '';
    this.loadTags();
    this.isModalOpen = true;
  }

  onTagSelect(event: any) {
    const selectedId = event.detail.value;
    if (selectedId) {
      const tag = this.availableTags.find(t => t.id === selectedId);
      if (tag) {
        this.selectedTags.push(tag);
        this.selectedTagId = '';
        this.updateAvailableTags();
      }
    }
  }

  removeTag(tag: Tag) {
    this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
    this.availableTags.push(tag);
    this.updateAvailableTags();
  }

  async saveNote() {
    const noteData = {
      title: this.currentNote.title,
      content: this.currentNote.content,
      tags: this.selectedTags
    };

    if (this.isEditing) {
      await this.storageService.updateNote(this.currentNote.id, noteData);
    } else {
      await this.storageService.saveNote(noteData);
    }

    this.loadNotes();
    this.closeModal();
  }

  async deleteNote(id: string) {
    await this.storageService.deleteNote(id);
    this.loadNotes();
  }

  closeModal() {
    this.isModalOpen = false;
  }
} 