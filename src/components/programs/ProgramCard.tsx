'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Program } from '@/types';
import { useCompareStore } from '@/store/compareStore';
import { useShortlistStore } from '@/store/shortlistStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDuration, createProgramUrl } from '@/lib/utils';
import analytics from '@/lib/analytics';
import {
  MapPin,
  Clock,
  DollarSign,
  Award,
  Heart,
  GitCompare,
  Calendar,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProgramCardProps {
  program: Program;
  compact?: boolean;
  showUniversity?: boolean;
}

export default function ProgramCard({
  program,
  compact = false,
  showUniversity = true
}: ProgramCardProps) {
  const { addToCompare, removeFromCompare, isProgramInCompare, canAddMore } = useCompareStore();
  const { addToShortlist, removeFromShortlist, isProgramInShortlist } = useShortlistStore();
  const { isAuthenticated } = useAuthStore();

  const isInCompare = isProgramInCompare(program.id);
  const isInShortlist = isProgramInShortlist(program.id);
  const programUrl = createProgramUrl(program);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCompare) {
      removeFromCompare(program.id);
      toast.success('Removed from comparison');
      analytics.compareAdded(program.id, program.title);
    } else {
      if (!canAddMore()) {
        toast.error('You can compare up to 4 programs');
        return;
      }
      addToCompare(program);
      toast.success('Added to comparison');
      analytics.compareAdded(program.id, program.title);
    }
  };

  const handleShortlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInShortlist) {
      // For shortlist, we need to find the item by program ID
      const shortlistStore = useShortlistStore.getState();
      const item = shortlistStore.items.find(item => item.program.id === program.id);
      if (item) {
        removeFromShortlist(item.id);
        toast.success('Removed from shortlist');
        analytics.shortlistRemoved(program.id, program.title);
      }
    } else {
      addToShortlist(program);
      toast.success('Added to shortlist');
      analytics.shortlistAdded(program.id, program.title);
    }
  };

  const handleCardClick = () => {
    analytics.programViewed(program.id, program.title, program.university.name);
  };

  const getDegreeLevelBadge = (level: string) => {
    const colors = {
      bachelor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      master: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      phd: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      diploma: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      certificate: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };

    return colors[level as keyof typeof colors] || colors.certificate;
  };

  if (compact) {
    return (
      <Link href={programUrl} onClick={handleCardClick}>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {program.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {program.university.name}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {formatCurrency(program.tuition_usd)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(program.duration_months)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Badge className={getDegreeLevelBadge(program.degree_level)}>
                  {program.degree_level.toUpperCase()}
                </Badge>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCompareToggle}
                    className={`p-1 h-6 w-6 ${isInCompare ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    <GitCompare className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShortlistToggle}
                    className={`p-1 h-6 w-6 ${isInShortlist ? 'text-red-500' : 'text-muted-foreground'}`}
                  >
                    <Heart className={`h-3 w-3 ${isInShortlist ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={programUrl} onClick={handleCardClick}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* University Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={program.university.images[0] || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop'}
            alt={`${program.university.name} campus`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCompareToggle}
              className={`bg-white/90 backdrop-blur-sm ${isInCompare ? 'text-primary' : 'text-muted-foreground'}`}
              aria-label={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleShortlistToggle}
              className={`bg-white/90 backdrop-blur-sm ${isInShortlist ? 'text-red-500' : 'text-muted-foreground'}`}
              aria-label={isInShortlist ? 'Remove from shortlist' : 'Add to shortlist'}
            >
              <Heart className={`h-4 w-4 ${isInShortlist ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute bottom-4 left-4">
            <div className="flex flex-wrap gap-2">
              <Badge className={getDegreeLevelBadge(program.degree_level)}>
                {program.degree_level.toUpperCase()}
              </Badge>
              {program.scholarships_available && (
                <Badge variant="success">
                  Scholarships Available
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Program Title */}
          <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
            {program.title}
          </h3>

          {/* University Info */}
          {showUniversity && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex-shrink-0">
                {program.university.logo ? (
                  <Image
                    src={program.university.logo}
                    alt={`${program.university.name} logo`}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                ) : (
                  <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {program.university.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground truncate">
                  {program.university.name}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {program.location.city}, {program.location.country}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Program Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              <span>{formatCurrency(program.tuition_usd)}/year</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>{formatDuration(program.duration_months)}</span>
            </div>
            {program.application_deadline && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span>Due {new Date(program.application_deadline).toLocaleDateString()}</span>
              </div>
            )}
            {program.university.ranking?.world && (
              <div className="flex items-center text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                <span>Rank #{program.university.ranking.world}</span>
              </div>
            )}
          </div>

          {/* Program Highlights */}
          {program.highlights?.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-1">
                {program.highlights.slice(0, 3).map((highlight, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-secondary/50 text-xs text-secondary-foreground rounded"
                  >
                    {highlight}
                  </span>
                ))}
                {program.highlights.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-secondary/50 text-xs text-secondary-foreground rounded">
                    +{program.highlights.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 py-4 bg-secondary/10 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {program.intakes.join(', ')} intake
            </div>
            <Button size="sm" className="group-hover:bg-primary/90">
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}