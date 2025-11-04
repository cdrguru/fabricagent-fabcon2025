import { useEffect, useMemo, useRef, useState } from 'react';
import { Suggestion, SuggestIndex, getSuggestions, recordRecentQuery } from '../utils/suggest';

export interface UseSuggestionsOptions {
  limit?: number;
}

export interface UseSuggestionsResult {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  items: Suggestion[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  acceptActive: () => void;
  accept: (s: Suggestion) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useSuggestions(
  query: string,
  index: SuggestIndex | undefined,
  onAccept: (text: string) => void,
  opts: UseSuggestionsOptions = {}
): UseSuggestionsResult {
  const limit = opts.limit ?? 8;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    if (!index) return [];
    return getSuggestions(query || '', index, limit);
  }, [index, query, limit]);

  useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  const accept = (s: Suggestion) => {
    const text = s.value;
    onAccept(text);
    recordRecentQuery(text);
    setOpen(false);
  };

  const acceptActive = () => {
    if (activeIndex >= 0 && activeIndex < items.length) {
      accept(items[activeIndex]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(items.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(-1, i - 1));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (activeIndex >= 0) {
        e.preventDefault();
        acceptActive();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return {
    isOpen: open && items.length > 0,
    setOpen,
    items,
    activeIndex,
    setActiveIndex,
    onKeyDown,
    acceptActive,
    accept,
    containerRef,
  };
}

