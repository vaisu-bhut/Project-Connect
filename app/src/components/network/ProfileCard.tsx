
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { cn } from "@/lib/utils";
import { Contact } from "@/types";

interface ProfileCardProps {
  contact: Contact;
  position: { x: number; y: number };
  onClose: () => void;
}

export const ProfileCard = ({ contact, position, onClose }: ProfileCardProps) => {
  return (
    <div 
      className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 w-64 z-10 animate-fade-in"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        maxWidth: "250px"
      }}
    >
      <button 
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 transition-colors"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-center gap-3 mb-2">
        {contact.photoUrl ? (
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={contact.photoUrl} alt={contact.name} />
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <h3 className="font-medium text-sm">{contact.name}</h3>
          {contact.category && (
            <CategoryBadge name={contact.category} className="mt-1" />
          )}
        </div>
      </div>
      
      <div className="space-y-1 text-xs">
        {contact.email && (
          <p className="flex items-center gap-1">
            <span className="font-medium">Email:</span> 
            <span className="truncate">{contact.email}</span>
          </p>
        )}
        {contact.phone && (
          <p className="flex items-center gap-1">
            <span className="font-medium">Phone:</span> 
            <span>{contact.phone}</span>
          </p>
        )}
        <p className="flex items-center gap-1">
          <span className="font-medium">Connection:</span> 
          <span className={cn(
            "px-1 rounded text-xs",
            contact.connectionStrength > 80 ? "bg-green-100 text-green-800" :
            contact.connectionStrength > 60 ? "bg-blue-100 text-blue-800" :
            contact.connectionStrength > 40 ? "bg-yellow-100 text-yellow-800" :
            contact.connectionStrength > 20 ? "bg-orange-100 text-orange-800" :
            "bg-red-100 text-red-800"
          )}>
            {contact.connectionStrength}%
          </span>
        </p>
        {contact.lastInteraction && (
          <p className="flex items-center gap-1">
            <span className="font-medium">Last Contact:</span>
            <span>{contact.lastInteraction}</span>
          </p>
        )}
      </div>
      
      {contact.tags && contact.tags.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium mb-1">Tags:</p>
          <div className="flex flex-wrap gap-1">
            {contact.tags.map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
