
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NetworkGraph, NetworkGraphRef } from "@/components/network/NetworkGraph";
import { ZoomIn, ZoomOut, RefreshCw, Search, Filter } from "lucide-react";

const Network = () => {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    minStrength: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const networkRef = useRef<NetworkGraphRef>(null);

  const availableCategories = [
    { id: "cat1", name: "Friends" },
    { id: "cat2", name: "Family" },
    { id: "cat3", name: "Work" },
    { id: "cat4", name: "School" },
    { id: "cat5", name: "Community" },
    { id: "cat6", name: "Professional" },
  ];

  const handleCategoryChange = (categoryId: string) => {
    setFilters((prev) => {
      const isSelected = prev.categories.includes(categoryId);
      if (isSelected) {
        return {
          ...prev,
          categories: prev.categories.filter((id) => id !== categoryId),
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, categoryId],
        };
      }
    });
  };

  const handleStrengthChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minStrength: value[0],
    }));
  };

  const handleZoomIn = () => {
    networkRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    networkRef.current?.zoomOut();
  };

  const handleResetZoom = () => {
    networkRef.current?.resetZoom();
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Network Map</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToggleFilters}>
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {showFilters && (
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Filter Network</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-medium">Search</h3>
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button size="sm" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Categories</h3>
                <div className="space-y-2">
                  {availableCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                      />
                      <Label htmlFor={category.id}>{category.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <h3 className="mb-2 text-sm font-medium">Connection Strength</h3>
                  <span className="text-sm">{filters.minStrength}%</span>
                </div>
                <Slider
                  defaultValue={[0]}
                  max={100}
                  step={5}
                  value={[filters.minStrength]}
                  onValueChange={handleStrengthChange}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
          <NetworkGraph filters={filters} ref={networkRef} />
        </div>
      </div>
    </div>
  );
};

export default Network;
