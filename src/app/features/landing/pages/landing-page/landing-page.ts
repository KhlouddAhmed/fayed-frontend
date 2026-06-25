import { Component } from '@angular/core';
import { Hero } from "../../components/hero/hero";
import { HowItWorks } from '../../components/how-it-works/how-it-works';
import { WhyFayed } from '../../components/why-fayed/why-fayed';
import { FaqSection } from "../../components/faq-section/faq-section";
import { NavbarComponent } from "../../../../layout/navbar/navbar";
import { Footer } from "../../../../layout/footer/footer";
import { ChatbotWidget } from "../../../ai/components/chatbot-widget/chatbot-widget";
import { ScrollToTop } from "../../../../shared/components/scroll-to-top/scroll-to-top";

@Component({
  selector: 'app-landing-page',
  imports: [Hero, HowItWorks, WhyFayed, FaqSection, NavbarComponent, Footer, ChatbotWidget, ScrollToTop],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
