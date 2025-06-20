// Utility for handling keyboard shortcuts

/**
 * Registers a global keyboard shortcut
 * @param key The key to listen for
 * @param modifiers Optional array of modifier keys (ctrl, alt, shift, meta)
 * @param callback Function to execute when shortcut is triggered
 * @returns A cleanup function to remove the event listener
 */
export function registerKeyboardShortcut(
  key: string,
  modifiers: Array<'ctrl' | 'alt' | 'shift' | 'meta'>,
  callback: () => void
): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Check if all required modifiers are pressed
    const modifiersMatch =
      (modifiers.includes('ctrl') === e.ctrlKey) &&
      (modifiers.includes('alt') === e.altKey) &&
      (modifiers.includes('shift') === e.shiftKey) &&
      (modifiers.includes('meta') === e.metaKey);

    // Check if the key matches (case insensitive)
    const keyMatches = e.key.toLowerCase() === key.toLowerCase();

    if (modifiersMatch && keyMatches) {
      e.preventDefault();
      callback();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  // Return a cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

// Keyboard shortcut for search (Ctrl+K or Cmd+K)
export function registerSearchShortcut(callback: () => void): () => void {
  return registerKeyboardShortcut('k', ['ctrl'], callback);
}

// Keyboard shortcut for escape (Esc)
export function registerEscapeShortcut(callback: () => void): () => void {
  return registerKeyboardShortcut('escape', [], callback);
}
