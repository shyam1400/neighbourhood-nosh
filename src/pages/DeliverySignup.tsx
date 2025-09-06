import { useState } from "react";
import { ArrowLeft, User, Lock, Eye, EyeOff, Mail, Phone, MapPin, Bike, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const DeliverySignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    vehicleType: "bike",
    licenseNumber: "",
    aadharNumber: "",
    bankAccount: "",
    ifscCode: ""
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Delivery Signup:", signupData);
    // Handle signup logic here
    // Redirect to delivery dashboard after successful signup
    window.location.href = "/delivery";
  };

  const vehicleTypes = [
    { value: "bike", label: "Bike", icon: "🏍️" },
    { value: "scooter", label: "Scooter", icon: "🛵" },
    { value: "cycle", label: "Cycle", icon: "🚲" },
    { value: "car", label: "Car", icon: "🚗" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Kiro</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join as Delivery Partner</h1>
          <p className="text-gray-600">Start earning by delivering orders from local stores</p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="signup">Delivery Partner Registration</TabsTrigger>
              </TabsList>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Basic Information
                    </h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={signupData.username}
                          onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={signupData.phone}
                          onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                        <textarea
                          placeholder="Enter your address"
                          value={signupData.address}
                          onChange={(e) => setSignupData({...signupData, address: e.target.value})}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Bike className="w-4 h-4" />
                      Vehicle Information
                    </h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {vehicleTypes.map((vehicle) => (
                          <button
                            key={vehicle.value}
                            type="button"
                            onClick={() => setSignupData({...signupData, vehicleType: vehicle.value})}
                            className={`p-3 border rounded-lg text-center transition-all ${
                              signupData.vehicleType === vehicle.value
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="text-2xl mb-1">{vehicle.icon}</div>
                            <div className="text-sm font-medium">{vehicle.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">License Number</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Enter your driving license number"
                          value={signupData.licenseNumber}
                          onChange={(e) => setSignupData({...signupData, licenseNumber: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Financial Information
                    </h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Aadhar Number</label>
                      <Input
                        type="text"
                        placeholder="Enter your Aadhar number"
                        value={signupData.aadharNumber}
                        onChange={(e) => setSignupData({...signupData, aadharNumber: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Bank Account Number</label>
                      <Input
                        type="text"
                        placeholder="Enter your bank account number"
                        value={signupData.bankAccount}
                        onChange={(e) => setSignupData({...signupData, bankAccount: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">IFSC Code</label>
                      <Input
                        type="text"
                        placeholder="Enter your bank IFSC code"
                        value={signupData.ifscCode}
                        onChange={(e) => setSignupData({...signupData, ifscCode: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" required />
                    <span className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-green-600 hover:text-green-800">Terms of Service</a>{" "}
                      and{" "}
                      <a href="#" className="text-green-600 hover:text-green-800">Privacy Policy</a>
                    </span>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                    Register as Delivery Partner
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/delivery-login" className="text-green-600 hover:text-green-800 font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliverySignup;
