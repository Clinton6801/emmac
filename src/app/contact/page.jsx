import { Clock, MapPin, Phone } from 'lucide-react';
import { businessInfo } from '../lib/data';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Get In Touch</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <Clock className="w-6 h-6 text-orange-600 mr-3 mt-1" />
              <div>
                <p className="font-semibold">Business Hours</p>
                <p className="text-gray-600">{businessInfo.hours}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-orange-600 mr-3 mt-1" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-gray-600">{businessInfo.location}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-6 h-6 text-orange-600 mr-3 mt-1" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-600">{businessInfo.phone}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => window.open(`https://wa.me/${businessInfo.whatsapp}`, '_blank')}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
          >
            <Phone className="w-5 h-5 mr-2" />
            Message on WhatsApp
          </button>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Why Choose Us?</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">✓</span>
              <span>Fresh ingredients, made to order</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">✓</span>
              <span>Customizable options for every occasion</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">✓</span>
              <span>Professional catering services</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">✓</span>
              <span>Timely delivery and setup</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">✓</span>
              <span>Competitive pricing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}