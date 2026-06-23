import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';

interface FaqItem {
  readonly question: string;
  readonly answer: string;
  readonly isOpen: boolean;
}

@Component({
  selector: 'app-faq-section',
  imports: [NgOptimizedImage],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.css',
})
export class FaqSection {

  /* =============================================
     FAQ STATE
     ============================================= */
  readonly faqs = signal<readonly FaqItem[]>([
    {
      question: 'ما هي منصة فايض؟',
      answer: 'فايض هي سوق إلكتروني متخصص (B2B) يربط بين المصانع والشركات الصناعية المصرية لبيع وشراء فائض المواد الخام وهدر الإنتاج، بما يحوّل الهدر الصناعي إلى مصدر دخل ضمن بيئة آمنة وموثوقة قائمة على التحقق من الشركات (KYB) والضمان المالي (Escrow).',
      isOpen: false
    },
    {
      question: 'من يمكنه التسجيل في فايض؟',
      answer: 'التسجيل مخصص للمصانع والشركات الصناعية المسجلة رسمياً فقط، ويتطلب سجلاً تجارياً وبطاقة ضريبية سارية. كل شركة لها حساب واحد يديره صاحب المصنع، ويُستخدم نفس الحساب للبيع والشراء.',
      isOpen: false
    },
    {
      question: 'كيف تتم عملية التحقق من الشركة (KYB)؟',
      answer: 'بعد رفع وثائق السجل التجاري والبطاقة الضريبية، يقوم الذكاء الاصطناعي باستخراج البيانات والتحقق منها بشكل أولي، ثم تتم المراجعة النهائية والموافقة من قِبل مسؤول تحقق بشري في المنصة قبل تفعيل الحساب.',
      isOpen: false
    },
    {
      question: 'هل التسجيل مجاني؟',
      answer: 'نعم، التسجيل وإنشاء حساب الشركة في فايض مجاني تماماً، وتحصل المنصة على عمولة فقط من قيمة الصفقات المكتملة بنجاح.',
      isOpen: false
    },
    {
      question: 'كيف يعمل نظام الدفع الآمن (Escrow)؟',
      answer: 'عند إتمام الصفقة، يقوم المشتري بالدفع عبر بوابة دفع محلية (مثل Paymob أو Fawry)، وتُحجز قيمة الصفقة في حساب ضمان (Escrow) لدى المنصة. بعد شحن البضاعة وتأكيد المشتري للاستلام، يتم الإفراج عن المبلغ للبائع بعد خصم عمولة المنصة.',
      isOpen: false
    }
  ]);

  /* =============================================
     ACTIONS
     ============================================= */
  toggleFaq(index: number): void {
    this.faqs.update(items =>
      items.map((item, i) => i === index ? { ...item, isOpen: !item.isOpen } : item)
    );
  }
}