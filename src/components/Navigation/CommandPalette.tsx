import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Home, Clock, MapPin, Calendar, Search, 
  Mic, MicOff, Sparkles, ArrowRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getMonuments } from "@/lib/supabase-queries";
import { Monument } from "@/types/monument";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const { data: monuments = [] } = useQuery({
    queryKey: ["monuments"],
    queryFn: getMonuments,
  });

  // Voice search functionality
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };
      
      recognition.start();
    }
  };

  const filteredMonuments = monuments.filter(monument =>
    monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    monument.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    monument.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigationItems = [
    {
      name: "Home",
      description: "Back to homepage",
      href: "/",
      icon: Home,
      shortcut: "H"
    },
    {
      name: "Timeline",
      description: "Explore historical timeline",
      href: "/timeline",
      icon: Clock,
      shortcut: "T"
    },
  ];

  const handleSelect = (href: string) => {
    setOpen(false);
    navigate(href);
    setSearchQuery("");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput
          placeholder="Search monuments, locations, or type..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="border-0 focus:ring-0"
        />
        <div className="flex items-center gap-2 ml-auto">
          {/* Voice Search */}
          {'webkitSpeechRecognition' in window && (
            <button
              onClick={startVoiceSearch}
              className={`p-2 rounded-md transition-colors ${
                isListening 
                  ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" 
                  : "hover:bg-muted"
              }`}
              title="Voice search"
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          )}
          
          {/* Keyboard shortcut hint */}
          <Badge variant="outline" className="text-xs hidden sm:flex">
            ⌘K
          </Badge>
        </div>
      </div>
      
      <CommandList>
        <CommandEmpty className="py-6 text-center text-sm">
          <div className="flex flex-col items-center gap-2">
            <Search className="h-8 w-8 opacity-50" />
            <p>No results found.</p>
            <p className="text-xs text-muted-foreground">
              Try searching for monument names, locations, or types.
            </p>
          </div>
        </CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                onSelect={() => handleSelect(item.href)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Icon className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.shortcut}
                </Badge>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Monuments */}
        {filteredMonuments.length > 0 && (
          <CommandGroup heading={`Monuments (${filteredMonuments.length})`}>
            {filteredMonuments.slice(0, 10).map((monument) => (
              <CommandItem
                key={monument.id}
                onSelect={() => handleSelect(`/monument/${monument.slug}`)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-muted">
                  {monument.cover_image ? (
                    <img
                      src={monument.cover_image}
                      alt={monument.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{monument.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {monument.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{monument.location}</span>
                      </div>
                    )}
                    {monument.build_year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{monument.build_year}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CommandItem>
            ))}
            
            {filteredMonuments.length > 10 && (
              <CommandItem disabled className="text-center text-xs text-muted-foreground">
                ... and {filteredMonuments.length - 10} more results
              </CommandItem>
            )}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}