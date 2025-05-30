import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button (click)="toggleChat()">
        <ion-icon style="margin-right: 0px !important;" name="chatbubbles-outline"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <ion-card *ngIf="isOpen" class="chat-popup">
      <ion-card-header>
        <ion-card-title>
          <ion-icon name="chatbubbles-outline"></ion-icon>
          AI Chatbot
        </ion-card-title>
      </ion-card-header>

      <ion-content class="chat-content">
        <ion-list>
          <ion-item *ngFor="let message of chatHistory" [class.user-message]="message.isUser">
            <ion-text [color]="message.isUser ? 'primary' : 'dark'">
              {{ message.text }}
            </ion-text>
          </ion-item>
        </ion-list>
      </ion-content>

      <ion-footer>
        <ion-item>
          <ion-input
            [(ngModel)]="newMessage"
            placeholder="Tulis pesan..."
            (keyup.enter)="sendMessage()"
          ></ion-input>
          <ion-button slot="end" (click)="sendMessage()" [disabled]="!newMessage">
            <ion-icon name="send-outline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-footer>
    </ion-card>
  `,
  styles: [`
    .chat-popup {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 300px;
      height: 400px;
      margin: 0;
      z-index: 999;
    }

    .chat-content {
      height: 300px;
    }

    .user-message {
      --background: var(--ion-color-light);
      text-align: right;
    }

    ion-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
    }

    ion-icon {
      margin-right: 8px;
      vertical-align: middle;
    }
  `]
})
export class ChatWidgetComponent implements OnInit {
  isOpen = false;
  newMessage = '';
  chatHistory: any[] = [];

  constructor(private chatService: ChatService) {}

  async ngOnInit() {
    this.chatHistory = await this.chatService.getChatHistory();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatHistory = await this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
} 