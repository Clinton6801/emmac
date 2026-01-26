'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    category: "Orders",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our products, add items to your cart, fill in your details, and complete the order via WhatsApp. Our team will confirm your order and provide payment details."
      },
      {
        q: "Can I cancel or modify my order?",
        a: "Yes! Contact us immediately via WhatsApp or phone. Orders can be modified up to 24 hours before the delivery date for cakes, and up to 48 hours for catering services."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept bank transfers, cash on delivery (for select locations), and mobile money transfers. Payment details will be shared after order confirmation."
      }
    ]
  },
  {
    category: "Delivery",
    questions: [
      {
        q: "Do you deliver?",
        a: "Yes! We deliver within Abuja and surrounding areas. Delivery fees vary based on location and will be confirmed when you place your order."
      },
      {
        q: "What is the minimum lead time for orders?",
        a: "Custom cakes require at least 3 days notice. Catering services need 14 days advance booking. Meat pies and catfish can be ordered with 24 hours notice."
      },
      {
        q: "Can I pick up my order?",
        a: "Absolutely! You can pick up your order from our location. Address will be provided upon order confirmation."
      }
    ]
  },
  {
    category: "Products",
    questions: [
      {
        q: "Can I customize my cake?",
        a: "Yes! We offer full customization including size, flavor, design, colors, and inscriptions. Share your vision with us and we'll bring it to life."
      },
      {
        q: "Do you accommodate dietary restrictions?",
        a: "Yes! We can prepare sugar-free, gluten-free, and vegan options. Please specify your requirements when ordering."
      },
      {
        q: "What flavors do you offer?",
        a: "We offer Vanilla, Chocolate, Red Velvet, Fruit Cake, Coconut, and more. Custom flavors available upon request."
      }
    ]
  },
  {
    category: "Catering",
    questions: [
      {
        q: "What is the minimum guest count for catering?",
        a: "Our minimum is 50 guests for full catering services. Contact us for smaller events and we'll try to accommodate."
      },
      {
        q: "Do you provide serving staff?",
        a: "Yes! We can provide professional serving staff, equipment, and setup services for an additional fee."
      },
      {
        q: "Can I see sample menus?",
        a: "Yes! Contact us via WhatsApp and we'll share our catering menu packages tailored to your event type and budget."
      }
    ]
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left hover:text-orange-600 transition"
      >
        <span className="font-semibold pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 flex-shrink-0 text-orange-600" />
        ) : (
          <ChevronDown className="w-5 h-5 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 text-gray-600 animate-fadeIn">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600">
          Find answers to common questions about our products and services
        </p>
      </div>

      {faqs.map((section, idx) => (
        <div key={idx} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-orange-600">
            {section.category}
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {section.questions.map((item, qIdx) => (
              <FAQItem key={qIdx} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12 bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
        <p className="text-gray-700 mb-6">
          Our team is here to help! Reach out via WhatsApp or call us directly.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href={`https://wa.me/2348012345678`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            WhatsApp Us
          </a>
          
          <a
            href="/contact"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Contact Page
          </a>
        </div>
      </div>
    </div>
  );
}