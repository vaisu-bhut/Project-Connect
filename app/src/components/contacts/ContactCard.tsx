import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Calendar, MessageSquare, X, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Contact } from "@/types";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { TagBadge } from "@/components/shared/TagBadge";
import { HealthScore } from "@/components/shared/HealthScore";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ContactCardProps {
  contact: Contact;
  className?: string;
  onViewProfile?: () => void;
}

export const ContactCard = ({
  contact,
  className,
  onViewProfile
}: ContactCardProps) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const hasNotes = contact.notes && contact.notes.trim() !== '';
  const hasContactInfo = contact.email || contact.phone;
  const hasTags = contact.tags && contact.tags.length > 0;

  return (
    <>
      <Card
        className={cn(
          "h-full transition-all hover:scale-105 animate-fade-in relative flex flex-col cursor-pointer", 
          className
        )}
        onClick={onViewProfile}
      >
        <CardContent className="p-3 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="hover:opacity-80 transition-opacity relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageExpanded(true);
                }}
              >
                {contact.photoUrl ? (
                  <img
                    src={contact.photoUrl}
                    alt={contact.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-lg font-bold text-gray-600 border-2 border-white shadow-md">
                    {contact.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-sm" />
              </div>
              <div>
                <h3 className="font-medium text-base">{contact.name}</h3>
                {contact.category && (
                  <CategoryBadge name={contact.category} className="mt-0.5" />
                )}
              </div>
            </div>
            <HealthScore score={contact.connectionStrength} />
          </div>

          <div className="flex-1 space-y-1.5">
            {hasContactInfo && (
              <div className="space-y-1 text-sm text-gray-500">
                {contact.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-nexus-purple-dark" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-nexus-purple-dark" />
                    <span className="truncate">{contact.phone}</span>
                  </div>
                )}
              </div>
            )}

            {contact.lastInteraction && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5 text-nexus-purple-dark" />
                <span className="truncate">Last Contact: {contact.lastInteraction}</span>
              </div>
            )}

            {hasNotes && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <StickyNote className="h-3.5 w-3.5 text-nexus-purple-dark" />
                      <span className="truncate">{contact.notes}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{contact.notes}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {hasTags && (
              <div className="flex flex-wrap gap-1">
                {contact.tags.map((tag) => (
                  <TagBadge key={tag} name={tag} />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
        <DialogContent className="sm:max-w-md">
          <div className="relative">
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-1 shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            {contact.photoUrl ? (
              <img
                src={contact.photoUrl}
                alt={contact.name}
                className="w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 text-4xl font-bold text-gray-600">
                {contact.name.charAt(0)}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
