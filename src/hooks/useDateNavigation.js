import { useState } from 'react';

/**
 * Manages date navigation with prev/next day functionality
 * Prevents navigation beyond today
 */
export function useDateNavigation(initialDate = '2025-12-16') {
  const [currentDate, setCurrentDate] = useState(initialDate);

  /**
   * Format date for display (already in YYYY-MM-DD format)
   */
  const formatDate = (dateStr) => {
    return dateStr;
  };

  /**
   * Navigate to previous day
   */
  const goToPrevDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    const newDate = date.toISOString().split('T')[0];
    setCurrentDate(newDate);
  };

  /**
   * Navigate to next day (up to today)
   */
  const goToNextDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setHours(0, 0, 0, 0);

    // Only advance if next date is not in the future
    if (nextDate <= today) {
      setCurrentDate(date.toISOString().split('T')[0]);
    }
  };

  /**
   * Check if can navigate to next day
   */
  const canGoNext = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date <= today;
  };

  /**
   * Check if can navigate to previous day (always true in this implementation)
   */
  const canGoPrev = () => {
    return true; // Could add min date check if needed
  };

  /**
   * Set specific date
   */
  const setDate = (dateStr) => {
    setCurrentDate(dateStr);
  };

  return {
    currentDate,
    formatDate,
    goToPrevDay,
    goToNextDay,
    canGoNext: canGoNext(),
    canGoPrev: canGoPrev(),
    setDate,
  };
}

export default useDateNavigation;
