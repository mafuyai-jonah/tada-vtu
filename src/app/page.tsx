import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Wifi, Zap, Shield, Clock, Globe, Star, TrendingUp, Award, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { LogoInline } from "@/components/logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LogoInline size="sm" />
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#services" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Services</Link>
              <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Features</Link>
              <Link href="#about" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">About</Link>
              <Link href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Contact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="hover:text-green-600">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-green-950">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-4 py-2 rounded-full mb-6 animate-pulse">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Nigeria's Most Trusted VTU Platform</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Instant <span className="text-green-600 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Airtime & Data</span>
                <br />At Your Fingertips
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Experience lightning-fast VTU services with unbeatable rates. Recharge airtime, buy data bundles, 
                and pay bills securely in seconds. Trusted by 50,000+ satisfied customers nationwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all group" asChild>
                  <Link href="/buy-airtime">
                    <Phone className="mr-2 h-5 w-5" />
                    Buy Airtime
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg group" asChild>
                  <Link href="/buy-data">
                    <Wifi className="mr-2 h-5 w-5" />
                    Buy Data
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Instant Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Secure Payments</span>
                </div>
              </div>
            </div>

            {/* Enhanced Stats with Animation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:text-green-700 transition-colors">50K+</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Happy Customers</div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:text-green-700 transition-colors">1M+</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Transactions</div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:text-green-700 transition-colors">99.9%</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Success Rate</div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:text-green-700 transition-colors">4.8/5</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From airtime to bill payments, we've got you covered with the most comprehensive VTU services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Airtime Recharge</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                  Instant airtime for all networks. Get bonus airtime on select networks and amounts.
                </CardDescription>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>All networks supported</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Bonus on select recharges</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Competitive rates</span>
                  </div>
                </div>
                <Button asChild className="mt-6 w-full bg-green-600 hover:bg-green-700">
                  <Link href="/buy-airtime">Buy Airtime</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Wifi className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Data Bundles</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                  Affordable data plans for all networks. Stay connected with our competitive rates.
                </CardDescription>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>All data plans available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Social media bundles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Night and weekend plans</span>
                  </div>
                </div>
                <Button asChild className="mt-6 w-full bg-green-600 hover:bg-green-700">
                  <Link href="/buy-data">Buy Data</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Utility Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                  Pay electricity, cable TV, and other utility bills instantly from your phone.
                </CardDescription>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Electricity bills</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Cable TV subscriptions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Internet subscriptions</span>
                  </div>
                </div>
                <Button asChild className="mt-6 w-full bg-green-600 hover:bg-green-700">
                  <Link href="/pay-bills">Pay Bills</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why 50,000+ Customers Choose Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're committed to providing the best VTU experience with unmatched reliability and customer service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">Get your airtime and data instantly without any delays</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bank-Level Security</h3>
              <p className="text-gray-600 dark:text-gray-300">Your transactions are protected with enterprise-grade encryption</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-300">Round-the-clock customer support via WhatsApp, phone, and email</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">All Networks</h3>
              <p className="text-gray-600 dark:text-gray-300">Complete support for MTN, Airtel, Glo, and 9mobile</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of satisfied customers across Nigeria
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Chinedu O.",
                location: "Lagos",
                rating: 5,
                text: "TADA VTU has never failed me. The speed is incredible and their customer service is top-notch!"
              },
              {
                name: "Amina S.",
                location: "Abuja",
                rating: 5,
                text: "Best VTU platform I've used. The rates are competitive and delivery is always instant."
              },
              {
                name: "Emeka K.",
                location: "Port Harcourt",
                rating: 5,
                text: "Reliable and trustworthy. I've been using them for over a year now without any issues."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Experience the Best VTU Service?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of satisfied customers who trust TADA VTU for their mobile needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg" asChild>
                <Link href="/register">Get Started Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600 px-8 py-6 text-lg" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <LogoInline size="sm" />
              </div>
              <p className="text-gray-400 mb-4">
                Nigeria's most trusted VTU platform for airtime, data, and bill payments.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Award className="h-4 w-4" />
                <span>Licensed VTU Provider</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/buy-airtime" className="hover:text-white">Buy Airtime</Link></li>
                <li><Link href="/buy-data" className="hover:text-white">Buy Data</Link></li>
                <li><Link href="/pay-bills" className="hover:text-white">Pay Bills</Link></li>
                <li><Link href="/convert-airtime" className="hover:text-white">Convert Airtime</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/status" className="hover:text-white">Service Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/refund" className="hover:text-white">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TADA VTU. All rights reserved. | RC: 123456 | Licensed by NCC</p>
          </div>
        </div>
      </footer>
    </div>
  )
}