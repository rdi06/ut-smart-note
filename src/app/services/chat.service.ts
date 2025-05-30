import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  stream: boolean;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly CHAT_HISTORY_KEY = 'chat_history';
  private readonly SYSTEM_PROMPT = 'You are a helpful assistant for Universitas Terbuka (UT) students. You can help with questions about schedules, assignments, and general academic information.';

  constructor(private http: HttpClient) {
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

  private getDeepSeekMessages(history: ChatMessage[]): DeepSeekMessage[] {
    const messages: DeepSeekMessage[] = [
      { role: 'system', content: this.SYSTEM_PROMPT }
    ];

    history.forEach(msg => {
      messages.push({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      });
    });

    return messages;
  }

  private makeDeepSeekRequest(messages: DeepSeekMessage[]): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.deepseekApiKey}`
    });

    const requestBody: DeepSeekRequest = {
      model: 'deepseek-chat',
      messages: messages,
      stream: false
    };

    return this.http.post<DeepSeekResponse>(
      environment.deepseekApiUrl,
      requestBody,
      { headers }
    ).pipe(
      map(response => response.choices[0].message.content),
      catchError(error => {
        console.error('DeepSeek API Error:', error);
        return throwError(() => new Error('Failed to get response from AI assistant'));
      })
    );
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

    try {
      // Get DeepSeek response
      const messages = this.getDeepSeekMessages(history);
      const response = await this.makeDeepSeekRequest(messages).toPromise();

      // Add bot message
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response || 'Sorry, I encountered an error processing your request.',
        isUser: false,
        timestamp: new Date()
      };
      history.push(botMessage);

      localStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify(history));
      return history;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };
      history.push(errorMessage);
      localStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify(history));
      return history;
    }
  }

  async clearHistory(): Promise<void> {
    localStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify([]));
  }
} 