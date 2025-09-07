# Kiro - Local Store Delivery App

A comprehensive React-based application that connects customers with local kirana stores for quick grocery delivery. Features real-time order tracking, push notifications, and Google Maps integration.

## 🚀 Features Implemented

### Customer App Features
- **User Registration and Login** - Email-based authentication with form validation
-  **Product Catalog** - 30+ items from local kirana stores with categories
-  **Add to Cart & Remove from Cart** - Full cart functionality with quantity management
-  **Checkout System** - Complete checkout flow with payment simulation (Cash, Card, UPI, Wallet)
-  **Real-time Order Tracking** - Live order status updates (Placed → Accepted → Preparing → Ready → Out for Delivery → Delivered)
-  **Google Maps Integration** - Store locations and order tracking with interactive map
-  **Push Notifications** - Real-time notifications for order updates

### Store Owner Features
-  **Order Management Dashboard** - Accept/reject orders with detailed item lists
-  **Real-time Notifications** - Instant notifications for new orders
-  **Order Status Management** - Update order status with real-time sync
-  **Store Analytics** - Revenue tracking, order counts, and customer metrics

### Technical Features
-  **Firebase Integration** - Authentication, real-time database, and push notifications
-  **Context-based State Management** - Cart and Order contexts for global state
-  **Responsive Design** - Mobile-first design with smooth animations
-  **Real-time Updates** - Live order status changes across all users
-  **Modern UI/UX** - Clean interface with hover effects and smooth transitions

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Radix UI + shadcn/ui
- **Maps**: Google Maps API
- **Backend**: Firebase (Authentication, Firestore, Cloud Messaging)
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neighbourhood-nosh-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Google Maps API Key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

   # Backend API URL (if using separate backend)
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
npm run dev
```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Cloud Messaging for push notifications
5. Add your web app and copy the configuration

### Google Maps Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create an API key
4. Restrict the key to your domain for security

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── Cart.tsx        # Shopping cart component
│   ├── Checkout.tsx    # Checkout flow
│   ├── MapView.tsx     # Google Maps integration
│   └── NotificationSystem.tsx
├── contexts/           # React contexts
│   ├── CartContext.tsx # Cart state management
│   └── OrderContext.tsx # Order state management
├── data/              # Static data
│   └── products.ts    # Product catalog
├── lib/               # Utilities
│   └── firebase.ts    # Firebase configuration
└── pages/             # Page components
    ├── CustomerApp.tsx # Main customer interface
    ├── ShopDetail.tsx  # Individual store page
    └── VendorDashboard.tsx # Store owner dashboard
```

## 🎯 Key Features in Detail

### Shopping Experience
- **Product Discovery**: Browse 30+ products across 8 categories
- **Smart Cart**: Add/remove items with quantity controls
- **Seamless Checkout**: Multiple payment options with form validation
- **Order Tracking**: Real-time status updates with notifications

### Store Management
- **Order Dashboard**: View and manage incoming orders
- **Status Updates**: Accept/reject orders with one click
- **Analytics**: Track sales, orders, and customer metrics
- **Notifications**: Get instant alerts for new orders

### Real-time Features
- **Live Updates**: Order status changes reflect instantly
- **Push Notifications**: Browser notifications for important events
- **Map Integration**: See store locations and delivery tracking

## 🎨 UI/UX Features

- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Design**: Works perfectly on mobile and desktop
- **Modern Interface**: Clean, intuitive design with consistent styling
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔒 Security Considerations

- Firebase Authentication handles user security
- API keys should be restricted to specific domains
- Input validation on all forms
- HTTPS required for production deployment

## 📈 Performance Optimizations

- Lazy loading for components
- Image optimization
- Efficient state management
- Minimal bundle size with tree shaking

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@kirana-connect.com or create an issue in the repository.

## 🔮 Future Enhancements

- [ ] Social login (Google, Facebook)
- [ ] Advanced search and filters
- [ ] Loyalty points system
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline support
- [ ] Advanced analytics dashboard
- [ ] Inventory management for stores
- [ ] Delivery partner app

---

**Built with ❤️ for local communities**
