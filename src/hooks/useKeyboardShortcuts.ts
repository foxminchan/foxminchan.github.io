import { useEffect, useCallback } from 'react';

export interface ShortcutHandlers {
  onToggleTheme: () => void;
  onOpenShare: () => void;
  onToggleShortcutsModal: () => void;
  onCloseModals: () => void;
  onRefreshData?: () => void;
  onScrollToTop?: () => void;
  onNavigateSection?: (sectionId: string, label: string) => void;
  showToast?: (message: string, keyHint?: string) => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled: boolean = true) {
  const {
    onToggleTheme,
    onOpenShare,
    onToggleShortcutsModal,
    onCloseModals,
    onRefreshData,
    onScrollToTop,
    onNavigateSection,
    showToast,
  } = handlers;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Do NOT trigger shortcuts when typing inside form inputs or editable content
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        const isEditable =
          target.isContentEditable ||
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select';

        if (isEditable) {
          // Allow Escape to blur inputs
          if (e.key === 'Escape') {
            target.blur();
          }
          return;
        }
      }

      // Do not hijack browser combinations with Ctrl / Meta / Alt (e.g. Cmd+R, Cmd+S, Ctrl+T)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const key = e.key;

      switch (key) {
        // Theme toggle: 't' or 'T'
        case 't':
        case 'T': {
          e.preventDefault();
          onToggleTheme();
          showToast?.('Toggled theme', 'T');
          break;
        }

        // Share modal: 's' or 'S'
        case 's':
        case 'S': {
          e.preventDefault();
          onOpenShare();
          showToast?.('Opened share modal', 'S');
          break;
        }

        // Shortcuts modal: '?' or '/' or 'h'
        case '?':
        case '/':
        case 'h':
        case 'H': {
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            return;
          }
          e.preventDefault();
          onToggleShortcutsModal();
          showToast?.('Keyboard shortcuts', '?');
          break;
        }

        // Close modals: 'Escape'
        case 'Escape': {
          e.preventDefault();
          onCloseModals();
          break;
        }

        // Scroll to top: 'g' or 'G'
        case 'g':
        case 'G': {
          e.preventDefault();
          if (onScrollToTop) {
            onScrollToTop();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          showToast?.('Scrolled to top', 'G');
          break;
        }

        // Refresh live data: 'r' or 'R'
        case 'r':
        case 'R': {
          e.preventDefault();
          if (onRefreshData) {
            onRefreshData();
            showToast?.('Refreshing GitHub data...', 'R');
          }
          break;
        }

        // Section Jump: '1' or 'a' -> About
        case '1': {
          e.preventDefault();
          onNavigateSection?.('about', 'About');
          showToast?.('Jumped to About', '1');
          break;
        }

        // Section Jump: '2' or 'e' -> Experience
        case '2': {
          e.preventDefault();
          onNavigateSection?.('experience', 'Experience');
          showToast?.('Jumped to Experience', '2');
          break;
        }

        // Section Jump: '3' or 'p' -> Projects
        case '3': {
          e.preventDefault();
          onNavigateSection?.('projects', 'Projects');
          showToast?.('Jumped to Projects', '3');
          break;
        }

        // Section Jump: '4' or 'k' -> Skills
        case '4': {
          e.preventDefault();
          onNavigateSection?.('skills', 'Skills');
          showToast?.('Jumped to Skills', '4');
          break;
        }

        // Section Jump: '5' or 'c' -> Certifications
        case '5': {
          e.preventDefault();
          onNavigateSection?.('certifications', 'Certifications');
          showToast?.('Jumped to Certifications', '5');
          break;
        }

        // Section Jump: '6' or 'm' -> Contact
        case '6': {
          e.preventDefault();
          onNavigateSection?.('contact', 'Contact');
          showToast?.('Jumped to Contact', '6');
          break;
        }

        default:
          break;
      }
    },
    [
      enabled,
      onToggleTheme,
      onOpenShare,
      onToggleShortcutsModal,
      onCloseModals,
      onRefreshData,
      onScrollToTop,
      onNavigateSection,
      showToast,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
