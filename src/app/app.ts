import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./layout/navbar/navbar";
import { ChatbotWidget } from "./features/ai/components/chatbot-widget/chatbot-widget";
import { ScrollToTop } from "./shared/components/scroll-to-top/scroll-to-top";
import { Footer } from "./layout/footer/footer";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ChatbotWidget, ScrollToTop, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fayed-frontend');
}
