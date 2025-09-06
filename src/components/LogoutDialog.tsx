import React from 'react';
import { LogOut, ShoppingCart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onContinueShopping: () => void;
  userType: 'customer' | 'vendor' | 'delivery';
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({
  isOpen,
  onClose,
  onLogout,
  onContinueShopping,
  userType
}) => {
  const getUserTypeLabel = () => {
    switch (userType) {
      case 'customer':
        return 'shopping';
      case 'vendor':
        return 'managing your store';
      case 'delivery':
        return 'delivering orders';
      default:
        return 'using the app';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5 text-orange-500" />
            Leave {userType === 'customer' ? 'Shopping' : userType === 'vendor' ? 'Store Management' : 'Delivery'}?
          </DialogTitle>
          <DialogDescription>
            You're currently {getUserTypeLabel()}. What would you like to do?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={onContinueShopping}
            className="w-full justify-start gap-3 h-12"
            variant="outline"
          >
            <ShoppingCart className="w-5 h-5" />
            Continue {userType === 'customer' ? 'Shopping' : userType === 'vendor' ? 'Managing Store' : 'Delivering'}
          </Button>
          
          <Button
            onClick={onLogout}
            className="w-full justify-start gap-3 h-12"
            variant="destructive"
          >
            <LogOut className="w-5 h-5" />
            Logout & Go to Home
          </Button>
          
          <Button
            onClick={onClose}
            className="w-full justify-start gap-3 h-12"
            variant="ghost"
          >
            <Home className="w-5 h-5" />
            Stay Here
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
