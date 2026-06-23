import { Component } from '@angular/core';
import { Hero } from "../../components/hero/hero";
import { HowItWorks } from '../../components/how-it-works/how-it-works';
import { WhyFayed } from '../../components/why-fayed/why-fayed';
import { FaqSection } from "../../components/faq-section/faq-section";

@Component({
  selector: 'app-landing-page',
  imports: [Hero, HowItWorks, WhyFayed, FaqSection],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
