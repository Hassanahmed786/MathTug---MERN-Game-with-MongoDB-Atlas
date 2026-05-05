import { useEffect, useRef } from 'react';

export function useBot(gameId, phase, currentQuestion, submitP2, difficulty = 'medium') {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (phase !== 'active' || !currentQuestion || !gameId) return;

    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // AI logic: simulate thinking time and correctness based on difficulty
    let baseDelay = 3000;
    let accuracy = 0.6; // 60% chance to be correct

    if (difficulty === 'easy') {
      baseDelay = 5000;
      accuracy = 0.5;
    } else if (difficulty === 'medium') {
      baseDelay = 3500;
      accuracy = 0.75;
    } else if (difficulty === 'hard') {
      baseDelay = 1800; // Fast!
      accuracy = 0.9;
    } else if (difficulty === 'insane') {
      baseDelay = 1000; // Very fast!
      accuracy = 0.98;
    }

    // Add some random human variance (-500ms to +500ms)
    const variance = (Math.random() * 1000) - 500;
    const finalDelay = Math.max(800, baseDelay + variance);

    timeoutRef.current = setTimeout(() => {
      const isCorrect = Math.random() < accuracy;
      let botAnswer;
      
      if (isCorrect) {
        botAnswer = currentQuestion.answer.toString();
      } else {
        // Generate a plausible wrong answer (e.g. off by 1-5)
        const offset = Math.floor(Math.random() * 5) + 1;
        const sign = Math.random() > 0.5 ? 1 : -1;
        botAnswer = (currentQuestion.answer + (offset * sign)).toString();
      }

      submitP2(botAnswer);
    }, finalDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, currentQuestion, submitP2, difficulty]);
}
