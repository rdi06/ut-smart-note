import { Injectable } from '@angular/core';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly CHAT_HISTORY_KEY = 'chat_history';
  private readonly dummyResponses = [
    'Jadwal UAS 2025 akan dilaksanakan pada 23 Juli - 15 Agustus.',
    'Untuk informasi lebih lanjut, silakan kunjungi website UT.',
    'Saya dapat membantu Anda dengan pertanyaan seputar jadwal kuliah dan tugas.',
    'Mohon maaf, saya tidak dapat membantu dengan pertanyaan tersebut.',
    'Apakah ada hal lain yang dapat saya bantu?'
  ];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(this.CHAT_HISTORY_KEY)) {
      localStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify([]));
    }
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    const history = localStorage.getItem(this.CHAT_HISTORY_KEY);
    return JSON.parse(history || '[]');
  }

  async sendMessage(text: string): Promise<ChatMessage[]> {
    const history = await this.getChatHistory();
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };
    history.push(userMessage);

    // Generate dummy response
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: this.getRandomResponse(),
      isUser: false,
      timestamp: new Date()
    };
    history.push(botMessage);

    localStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify(history));
    return history;
  }

  private getRandomResponse(): string {
    const index = Math.floor(Math.random() * this.dummyResponses.length);
    return this.dummyResponses[index];
  }

  async clearHistory(): Promise<void> {
    localStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify([]));
  }
} 