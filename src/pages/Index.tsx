import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Users, Clock, Star, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from "@/components/LanguageSelector";
import kiranaImage from "@/assets/hero-grocery-store.jpg";
import logoImage from "@/assets/logo.png";

const Index = () => {
  const { t } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: "🛒",
      title: t('home.freshGroceries'),
      description: t('home.freshGroceriesDesc'),
      color: "from-green-50 to-emerald-100",
      iconColor: "bg-green-100"
    },
    {
      icon: "🥩",
      title: t('home.premiumMeat'),
      description: t('home.premiumMeatDesc'),
      color: "from-red-50 to-rose-100",
      iconColor: "bg-red-100"
    },
    {
      icon: "🏪",
      title: t('home.supermarketConvenience'),
      description: t('home.supermarketConvenienceDesc'),
      color: "from-blue-50 to-indigo-100",
      iconColor: "bg-blue-100"
    }
  ];

  const stats = [
    { number: "200+", label: t('home.groceryStores') },
    { number: "50+", label: t('home.butcherShops') },
    { number: "15min", label: t('home.freshDelivery') },
    { number: "4.9★", label: t('home.customerRating') }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${kiranaImage})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="flex items-center group">
                <img 
                  src={logoImage} 
                  alt="Kiro Logo" 
                  className="w-20 h-20 rounded-lg object-cover transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                />
              </Link>
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center space-x-4">
                  <a href="#features" className="text-xs text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 relative group">
                    {t('home.features')}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a href="#how-it-works" className="text-xs text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 relative group">
                    {t('home.howItWorks')}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a href="#contact" className="text-xs text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 relative group">
                    {t('home.contact')}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <LanguageSelector />
                  <Link to="/vendor-login">
                    <Button variant="outline" size="sm" className="border-2 border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-xs">
                      🏪 {t('home.forStores')}
                    </Button>
                  </Link>
                  <Link to="/delivery-login">
                    <Button variant="outline" size="sm" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-xs">
                      🚚 {t('home.forDelivery')}
                    </Button>
                  </Link>
                  <Link to="/start-shopping">
                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg text-xs">
                      {t('home.startShopping')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-green-100 text-green-800 border-green-200 px-6 py-3 rounded-full shadow-lg animate-pulse text-lg font-semibold">
                    🚀 {t('home.title')}
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight animate-fade-in">
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">Kiro</span>
                  </h1>
                  <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-normal">
                    {t('home.subtitle')}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/start-shopping">
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg group">
                      {t('home.startShopping')}
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/vendor-login">
                    <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      🏪 {t('home.joinAsVendor')}
                    </Button>
                  </Link>
                  <Link to="/delivery-login">
                    <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      🚚 {t('home.joinAsDelivery')}
                    </Button>
                  </Link>
                  <Link to="/price-prediction">
                    <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 hover:border-purple-700 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      📊 Price Prediction Demo
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 max-w-4xl mx-auto">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="bg-white/20 rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/30">
                        <div className="text-2xl lg:text-3xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">{stat.number}</div>
                        <div className="text-sm text-gray-200 group-hover:text-white transition-colors duration-300">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t('home.whyChoose')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('home.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className={`p-8 text-center hover:shadow-2xl transition-all duration-500 cursor-pointer ${feature.color} border-0 backdrop-blur-sm bg-white/80 hover:bg-white/90 hover:scale-105 hover:-translate-y-2`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 ${feature.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-110 hover:rotate-6 shadow-lg`}>
                      <span className="text-3xl transition-transform duration-300 hover:scale-110">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 transition-colors duration-300 hover:text-green-600">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed transition-colors duration-300 hover:text-gray-800">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t('home.howItWorks')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('home.browseStoresDesc')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-6">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🛒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 transition-colors duration-300 group-hover:text-green-600">{t('home.browseStores')}</h3>
                <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-800">{t('home.browseStoresDesc')}</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-6">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🛍️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 transition-colors duration-300 group-hover:text-green-600">{t('home.addToCart')}</h3>
                <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-800">{t('home.addToCartDesc')}</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-6">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🚚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 transition-colors duration-300 group-hover:text-green-600">{t('home.freshDeliveryTitle')}</h3>
                <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-800">{t('home.freshDeliverySteps')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600/90 to-emerald-500/90 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {t('home.readyToConnect')}
            </h2>
            <p className="text-xl text-green-100 mb-8">
              {t('home.joinThousands')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/start-shopping">
                <Button size="lg" className="bg-white/90 backdrop-blur-sm text-green-600 hover:bg-white hover:shadow-2xl px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 group">
                  🛒 {t('home.startShoppingNow')}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
                <Link to="/vendor-login">
                  <Button size="lg" className="bg-white/80 backdrop-blur-sm text-green-600 hover:bg-white hover:shadow-xl px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105">
                    🏪 {t('home.joinAsVendor')}
                  </Button>
                </Link>
                <Link to="/delivery-login">
                  <Button size="lg" className="bg-white/80 backdrop-blur-sm text-blue-600 hover:bg-white hover:shadow-xl px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105">
                    🚚 {t('home.joinAsDelivery')}
                  </Button>
                </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/90 backdrop-blur-xl text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <Link to="/" className="flex items-center mb-4 group">
                  <img 
                    src={logoImage} 
                    alt="Kiro Logo" 
                    className="w-12 h-12 rounded-lg object-cover transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  />
                </Link>
                <p className="text-gray-400">{t('home.connectingStores')}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t('home.product')}</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#features" className="hover:text-white transition-colors">{t('home.features')}</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('home.howItWorks')}</a></li>
                  <li><Link to="/start-shopping" className="hover:text-white transition-colors">{t('home.startShopping')}</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t('home.forStoresTitle')}</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/vendor-login" className="hover:text-white transition-colors">{t('home.vendorDashboard')}</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t('home.howToJoin')}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t('home.support')}</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t('home.support')}</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">{t('home.helpCenter')}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t('home.contact')}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t('home.privacy')}</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>{t('home.copyright')}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;