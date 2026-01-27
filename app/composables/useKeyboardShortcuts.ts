/**
 * Keyboard Shortcuts composable
 * 
 * Provides global keyboard shortcut management
 */

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  handler: () => void;
}

export const useKeyboardShortcuts = () => {
  const shortcuts = ref<KeyboardShortcut[]>([]);
  const isEnabled = ref(true);

  /**
   * Register a keyboard shortcut
   */
  const register = (shortcut: KeyboardShortcut) => {
    shortcuts.value.push(shortcut);
  };

  /**
   * Unregister a keyboard shortcut
   */
  const unregister = (key: string) => {
    shortcuts.value = shortcuts.value.filter(s => s.key !== key);
  };

  /**
   * Handle keyboard event
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isEnabled.value) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      // Allow Escape key to work in inputs
      if (event.key !== 'Escape') {
        return;
      }
    }

    // Find matching shortcut
    const shortcut = shortcuts.value.find(s => {
      return (
        s.key.toLowerCase() === event.key.toLowerCase() &&
        !!s.ctrl === event.ctrlKey &&
        !!s.alt === event.altKey &&
        !!s.shift === event.shiftKey &&
        !!s.meta === event.metaKey
      );
    });

    if (shortcut) {
      event.preventDefault();
      shortcut.handler();
    }
  };

  /**
   * Enable shortcuts
   */
  const enable = () => {
    isEnabled.value = true;
  };

  /**
   * Disable shortcuts
   */
  const disable = () => {
    isEnabled.value = false;
  };

  /**
   * Get shortcut display string
   */
  const getShortcutDisplay = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];
    
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.meta) parts.push('⌘');
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  };

  // Setup event listener
  onMounted(() => {
    if (process.client) {
      window.addEventListener('keydown', handleKeyDown);
    }
  });

  // Cleanup
  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('keydown', handleKeyDown);
    }
  });

  return {
    shortcuts: readonly(shortcuts),
    isEnabled: readonly(isEnabled),
    register,
    unregister,
    enable,
    disable,
    getShortcutDisplay,
  };
};

/**
 * Common keyboard shortcuts
 */
export const useCommonShortcuts = () => {
  const router = useRouter();
  const { register } = useKeyboardShortcuts();

  /**
   * Setup common application shortcuts
   */
  const setupCommonShortcuts = (callbacks?: {
    onSearch?: () => void;
    onEscape?: () => void;
    onFavorites?: () => void;
    onHistory?: () => void;
  }) => {
    // Search (/ or Ctrl+K)
    if (callbacks?.onSearch) {
      register({
        key: '/',
        description: 'Focus search',
        handler: callbacks.onSearch,
      });

      register({
        key: 'k',
        ctrl: true,
        description: 'Focus search',
        handler: callbacks.onSearch,
      });
    }

    // Escape
    if (callbacks?.onEscape) {
      register({
        key: 'Escape',
        description: 'Close modal/Clear search',
        handler: callbacks.onEscape,
      });
    }

    // Favorites (F)
    if (callbacks?.onFavorites) {
      register({
        key: 'f',
        shift: true,
        description: 'View favorites',
        handler: callbacks.onFavorites,
      });
    }

    // History (H)
    if (callbacks?.onHistory) {
      register({
        key: 'h',
        shift: true,
        description: 'View history',
        handler: callbacks.onHistory,
      });
    }

    // Home (Alt+H)
    register({
      key: 'h',
      alt: true,
      description: 'Go to home',
      handler: () => router.push('/'),
    });

    // Dashboard (Alt+D)
    register({
      key: 'd',
      alt: true,
      description: 'Go to dashboard',
      handler: () => router.push('/dashboard'),
    });
  };

  return {
    setupCommonShortcuts,
  };
};

/**
 * Video player keyboard shortcuts
 */
export const usePlayerShortcuts = (callbacks: {
  onPlayPause?: () => void;
  onSeekForward?: () => void;
  onSeekBackward?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  onMute?: () => void;
  onFullscreen?: () => void;
  onPictureInPicture?: () => void;
}) => {
  const { register } = useKeyboardShortcuts();

  /**
   * Setup player shortcuts
   */
  const setupPlayerShortcuts = () => {
    // Play/Pause (Space or K)
    if (callbacks.onPlayPause) {
      register({
        key: ' ',
        description: 'Play/Pause',
        handler: callbacks.onPlayPause,
      });

      register({
        key: 'k',
        description: 'Play/Pause',
        handler: callbacks.onPlayPause,
      });
    }

    // Seek forward (Arrow Right or L)
    if (callbacks.onSeekForward) {
      register({
        key: 'ArrowRight',
        description: 'Seek forward 10s',
        handler: callbacks.onSeekForward,
      });

      register({
        key: 'l',
        description: 'Seek forward 10s',
        handler: callbacks.onSeekForward,
      });
    }

    // Seek backward (Arrow Left or J)
    if (callbacks.onSeekBackward) {
      register({
        key: 'ArrowLeft',
        description: 'Seek backward 10s',
        handler: callbacks.onSeekBackward,
      });

      register({
        key: 'j',
        description: 'Seek backward 10s',
        handler: callbacks.onSeekBackward,
      });
    }

    // Volume up (Arrow Up)
    if (callbacks.onVolumeUp) {
      register({
        key: 'ArrowUp',
        description: 'Volume up',
        handler: callbacks.onVolumeUp,
      });
    }

    // Volume down (Arrow Down)
    if (callbacks.onVolumeDown) {
      register({
        key: 'ArrowDown',
        description: 'Volume down',
        handler: callbacks.onVolumeDown,
      });
    }

    // Mute (M)
    if (callbacks.onMute) {
      register({
        key: 'm',
        description: 'Toggle mute',
        handler: callbacks.onMute,
      });
    }

    // Fullscreen (F)
    if (callbacks.onFullscreen) {
      register({
        key: 'f',
        description: 'Toggle fullscreen',
        handler: callbacks.onFullscreen,
      });
    }

    // Picture-in-Picture (P)
    if (callbacks.onPictureInPicture) {
      register({
        key: 'p',
        description: 'Toggle Picture-in-Picture',
        handler: callbacks.onPictureInPicture,
      });
    }
  };

  onMounted(() => {
    setupPlayerShortcuts();
  });

  return {
    setupPlayerShortcuts,
  };
};
