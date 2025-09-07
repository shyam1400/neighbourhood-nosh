import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const StartShopping = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Start Shopping</h1>
        <p className="text-xl text-gray-600 mb-8">Welcome to the shopping page!</p>
        <Link to="/">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default StartShopping;