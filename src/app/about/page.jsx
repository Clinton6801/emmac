import { Heart, Award, Users, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl">
            Bringing sweetness and joy to celebrations since 2020
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            Delish Catering began with a simple passion: creating memorable moments through exceptional food. 
            What started in a small kitchen with a love for baking has grown into Abuja's trusted name for 
            custom cakes, premium catering, and delicious treats.
          </p>
          
          <p className="text-lg leading-relaxed mb-6">
            Every cake we bake, every dish we prepare, and every event we cater tells a story. We believe 
            that food is more than sustenance—it's an experience, a memory, and sometimes, pure magic. Our 
            team of skilled bakers and chefs work tirelessly to ensure that each creation exceeds expectations.
          </p>

          <p className="text-lg leading-relaxed">
            From intimate birthday celebrations to grand weddings, we've had the honor of being part of 
            countless special moments. Our commitment to quality ingredients, innovative designs, and 
            personalized service has made us a favorite among families and businesses across Abuja.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Passion</h3>
              <p className="text-gray-600 text-sm">
                We pour love into every creation, treating each order as if it were for our own family
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">
                Only the finest ingredients make it into our kitchen. No compromises
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community</h3>
              <p className="text-gray-600 text-sm">
                We're part of this community, and we take pride in serving our neighbors
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Reliability</h3>
              <p className="text-gray-600 text-sm">
                On time, every time. Your special moment deserves nothing less
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto mb-4">
              {/* Add team member photo */}
            </div>
            <h3 className="font-semibold text-xl mb-2">Chef Emmanuel</h3>
            <p className="text-orange-600 mb-2">Head Baker</p>
            <p className="text-gray-600 text-sm">
              15+ years of creating edible masterpieces
            </p>
          </div>

          <div className="text-center">
            <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto mb-4">
              {/* Add team member photo */}
            </div>
            <h3 className="font-semibold text-xl mb-2">Sarah Okafor</h3>
            <p className="text-orange-600 mb-2">Catering Manager</p>
            <p className="text-gray-600 text-sm">
              Expert in turning events into unforgettable experiences
            </p>
          </div>

          <div className="text-center">
            <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto mb-4">
              {/* Add team member photo */}
            </div>
            <h3 className="font-semibold text-xl mb-2">David Adewale</h3>
            <p className="text-orange-600 mb-2">Pastry Chef</p>
            <p className="text-gray-600 text-sm">
              Specializes in custom designs and creative flavors
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Something Amazing?</h2>
          <p className="text-lg mb-8">
            Let's make your next celebration unforgettable
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition text-lg"
          >
            Start Your Order
          </a>
        </div>
      </div>
    </div>
  );
}