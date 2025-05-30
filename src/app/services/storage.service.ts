import { Injectable } from '@angular/core';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: Tag[];
  createdAt: Date;
}

interface StoredFile {
  id: string;
  name: string;
  type: string;
  data: string; // base64 encoded
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly NOTES_KEY = 'notes';
  private readonly FILES_KEY = 'files';
  private readonly TAGS_KEY = 'tags';
  private readonly DEFAULT_COLORS = [
    '#FF5733', // Coral
    '#33FF57', // Lime
    '#3357FF', // Blue
    '#FF33F5', // Pink
    '#33FFF5', // Cyan
    '#FFB533', // Orange
    '#B533FF', // Purple
    '#FF3333', // Red
    '#33FFB5', // Mint
    '#FFE033'  // Yellow
  ];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(this.NOTES_KEY)) {
      localStorage.setItem(this.NOTES_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.FILES_KEY)) {
      localStorage.setItem(this.FILES_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.TAGS_KEY)) {
      localStorage.setItem(this.TAGS_KEY, JSON.stringify([]));
    }
  }

  // Tag operations
  async getTags(): Promise<Tag[]> {
    const tags = localStorage.getItem(this.TAGS_KEY);
    return JSON.parse(tags || '[]');
  }

  async saveTag(tagName: string, color: string): Promise<Tag> {
    const tags = await this.getTags();
    const newTag: Tag = {
      id: Date.now().toString(),
      name: tagName,
      color: color
    };
    tags.push(newTag);
    localStorage.setItem(this.TAGS_KEY, JSON.stringify(tags));
    return newTag;
  }

  async deleteTag(id: string): Promise<boolean> {
    const tags = await this.getTags();
    const filtered = tags.filter(t => t.id !== id);
    localStorage.setItem(this.TAGS_KEY, JSON.stringify(filtered));
    return true;
  }

  getDefaultColors(): string[] {
    return this.DEFAULT_COLORS;
  }

  // Notes operations
  async getNotes(): Promise<Note[]> {
    const notes = localStorage.getItem(this.NOTES_KEY);
    return JSON.parse(notes || '[]');
  }

  async saveNote(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
    const notes = await this.getNotes();
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    notes.push(newNote);
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
    return newNote;
  }

  async updateNote(id: string, note: Partial<Note>): Promise<Note | null> {
    const notes = await this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;
    
    notes[index] = { ...notes[index], ...note };
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
    return notes[index];
  }

  async deleteNote(id: string): Promise<boolean> {
    const notes = await this.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(filtered));
    return true;
  }

  // Files operations
  async getFiles(): Promise<StoredFile[]> {
    const files = localStorage.getItem(this.FILES_KEY);
    return JSON.parse(files || '[]');
  }

  async saveFile(file: File): Promise<StoredFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const newFile: StoredFile = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          data: base64,
          createdAt: new Date()
        };
        
        const files = await this.getFiles();
        files.push(newFile);
        localStorage.setItem(this.FILES_KEY, JSON.stringify(files));
        resolve(newFile);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async deleteFile(id: string): Promise<boolean> {
    const files = await this.getFiles();
    const filtered = files.filter(f => f.id !== id);
    localStorage.setItem(this.FILES_KEY, JSON.stringify(filtered));
    return true;
  }
} 