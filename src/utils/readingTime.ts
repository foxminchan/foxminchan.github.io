export interface ReadingTimeResult {
  minutes: number;
  seconds: number;
  words: number;
  text: string;
}

/**
 * Calculates estimated reading time based on word count.
 * Uses the standard reading speed of 200 words per minute (WPM).
 *
 * @param text The text content to analyze
 * @param wpm Reading speed in words per minute (default: 200)
 */
export function calculateReadingTime(text: string, wpm = 200): ReadingTimeResult {
  if (!text || !text.trim()) {
    return {
      minutes: 0,
      seconds: 0,
      words: 0,
      text: '1 min read',
    };
  }

  // Count words separated by whitespace
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const exactMinutes = words / wpm;
  const seconds = Math.max(5, Math.round(exactMinutes * 60));
  const minutes = Math.max(1, Math.ceil(exactMinutes));

  const textDisplay = minutes === 1 ? '1 min read' : `${minutes} min read`;

  return {
    minutes,
    seconds,
    words,
    text: textDisplay,
  };
}
