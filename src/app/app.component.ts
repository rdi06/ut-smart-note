import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  documentTextOutline, 
  folderOutline,
  chatbubblesOutline,
  createOutline,
  trashOutline,
  downloadOutline,
  addOutline,
  sendOutline,
  menuOutline,
  pricetagsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-split-pane contentId="main-content">
        <ion-menu contentId="main-content" type="overlay">
          <ion-header>
            <ion-toolbar>
              <ion-title>UT SmartNote</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <ion-list>
              <ion-menu-toggle auto-hide="false" *ngFor="let p of appPages">
                <ion-item [routerLink]="[p.url]" routerDirection="root" [routerLinkActive]="['selected']" detail="false">
                  <ion-icon slot="start" [name]="p.icon"></ion-icon>
                  <ion-label>{{ p.title }}</ion-label>
                </ion-item>
              </ion-menu-toggle>
            </ion-list>
          </ion-content>
        </ion-menu>
        <ion-router-outlet id="main-content"></ion-router-outlet>
      </ion-split-pane>
    </ion-app>
  `,
  styles: [`
    .selected {
      --background: var(--ion-color-light);
      font-weight: bold;
    }
  `],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class AppComponent {
  constructor() {
    addIcons({ 
      homeOutline, 
      documentTextOutline, 
      folderOutline,
      chatbubblesOutline,
      createOutline,
      trashOutline,
      downloadOutline,
      addOutline,
      sendOutline,
      menuOutline,
      pricetagsOutline
    });
  }

  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home-outline' },
    { title: 'Catatan Pribadi', url: '/notes', icon: 'document-text-outline' },
    { title: 'Penyimpanan File Tugas', url: '/storage', icon: 'folder-outline' },
    { title: 'Kelola Tag', url: '/tags', icon: 'pricetags-outline' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
}
