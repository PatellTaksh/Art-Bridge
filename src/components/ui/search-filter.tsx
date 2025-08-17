import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export interface FilterOptions {
  search: string;
  category: string;
  priceRange: string;
  status: string;
  sortBy: string;
}

interface SearchFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== 'all').length;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Search Artworks</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, artist, or description..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Category</label>
        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Accessible">Accessible</SelectItem>
            <SelectItem value="Digital">Digital Art</SelectItem>
            <SelectItem value="Traditional">Traditional</SelectItem>
            <SelectItem value="Photography">Photography</SelectItem>
            <SelectItem value="Sculpture">Sculpture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Price Range (ETH)</label>
        <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-1">0 - 1 ETH</SelectItem>
            <SelectItem value="1-5">1 - 5 ETH</SelectItem>
            <SelectItem value="5-10">5 - 10 ETH</SelectItem>
            <SelectItem value="10-50">10 - 50 ETH</SelectItem>
            <SelectItem value="50+">50+ ETH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Availability</label>
        <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Sort By</label>
        <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Recently Added" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Recently Added</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {getActiveFiltersCount() > 0 && (
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters ({getActiveFiltersCount()})
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Mobile Filter Sheet */}
      <div className="flex items-center gap-4 md:hidden">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artworks..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <SlidersHorizontal className="h-4 w-4" />
              {getActiveFiltersCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Artworks</SheetTitle>
              <SheetDescription>
                Narrow down your search with these filters
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artworks..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category */}
        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Accessible">Accessible</SelectItem>
            <SelectItem value="Digital">Digital Art</SelectItem>
            <SelectItem value="Traditional">Traditional</SelectItem>
            <SelectItem value="Photography">Photography</SelectItem>
            <SelectItem value="Sculpture">Sculpture</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range */}
        <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-1">0 - 1 ETH</SelectItem>
            <SelectItem value="1-5">1 - 5 ETH</SelectItem>
            <SelectItem value="5-10">5 - 10 ETH</SelectItem>
            <SelectItem value="10-50">10 - 50 ETH</SelectItem>
            <SelectItem value="50+">50+ ETH</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Recently Added</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('search', '')}
              />
            </Badge>
          )}
          {filters.category && filters.category !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('category', 'all')}
              />
            </Badge>
          )}
          {filters.priceRange && filters.priceRange !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.priceRange} ETH
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('priceRange', 'all')}
              />
            </Badge>
          )}
          {filters.status && filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('status', 'all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};