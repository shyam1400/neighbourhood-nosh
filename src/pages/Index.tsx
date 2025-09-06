import { useState } from "react";
import { ArrowRight, ShoppingBag, Store, Truck, Star, Clock, MapPin, CheckCircle, Zap, Heart, TrendingUp, Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import kiranaImage from "@/assets/hero-grocery-store.jpg";

const Index = () => {
  const { t } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: <Store className="w-8 h-8 text-blue-600" />,
      title: t('home.localKiranaStores'),
      description: t('home.localStoresDesc'),
      color: "from-blue-50 to-blue-100",
      iconColor: "bg-blue-100"
    },
    {
      icon: <Bell className="w-8 h-8 text-green-600" />,
      title: t('home.realTimeNotifications'),
      description: t('home.notificationsDesc'),
      color: "from-green-50 to-green-100",
      iconColor: "bg-green-100"
    },
    {
      icon: <Truck className="w-8 h-8 text-purple-600" />,
      title: t('home.fastDeliveryTitle'),
      description: t('home.fastDeliveryDesc'),
      color: "from-purple-50 to-purple-100",
      iconColor: "bg-purple-100"
    }
  ];

  const stats = [
    { number: "500+", label: t('home.localStores') },
    { number: "10K+", label: t('home.happyCustomers') },
    { number: "15min", label: t('home.avgDelivery') },
    { number: "4.8★", label: t('home.rating') }
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
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Kiro</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">{t('home.features')}</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">{t('home.howItWorks')}</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">{t('home.contact')}</a>
              </div>
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <Link to="/vendor-login">
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 font-semibold">
                    {t('home.joinAsVendor')}
                  </Button>
                </Link>
                <Link to="/delivery-login">
                  <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 font-semibold">
                    {t('home.joinAsDelivery')}
                  </Button>
                </Link>
                <Link to="/customer-login">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full">
                    {t('home.startShopping')}
                  </Button>
                </Link>
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
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 rounded-full">
                    🚀 New Way to Shop Local
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Kiro</span>
                  </h1>
                  <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-normal">
                    {t('home.title')}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/customer-login">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold">
                      {t('home.startShopping')}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/vendor-login">
                    <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 px-8 py-4 rounded-full text-lg font-bold">
                      {t('home.joinAsVendor')}
                    </Button>
                  </Link>
                  <Link to="/delivery-login">
                    <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 px-8 py-4 rounded-full text-lg font-bold">
                      {t('home.joinAsDelivery')}
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 max-w-4xl mx-auto">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white">{stat.number}</div>
                      <div className="text-sm text-gray-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white/95 backdrop-blur-sm">
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
                  className={`p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer ${feature.color} border-0`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 ${feature.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50/95 to-purple-50/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t('home.howItWorks')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('home.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.browseStores')}</h3>
                <p className="text-gray-600">{t('home.browseStoresDesc')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.placeOrder')}</h3>
                <p className="text-gray-600">{t('home.placeOrderDesc')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.getDelivered')}</h3>
                <p className="text-gray-600">{t('home.getDeliveredDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {t('home.readyToConnect')}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('home.joinThousands')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/customer-login">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold">
                  {t('home.startShoppingNow')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
                <Link to="/vendor-login">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold">
                    {t('home.joinAsVendor')}
                  </Button>
                </Link>
                <Link to="/delivery-login">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold">
                    {t('home.joinAsDelivery')}
                  </Button>
                </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/95 backdrop-blur-sm text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <Link to="/" className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Kiro</span>
                </Link>
                <p className="text-gray-400">{t('home.connectingStores')}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t('home.product')}</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#features" className="hover:text-white transition-colors">{t('home.features')}</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('home.howItWorks')}</a></li>
                  <li><Link to="/customer-login" className="hover:text-white transition-colors">{t('home.startShopping')}</Link></li>
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