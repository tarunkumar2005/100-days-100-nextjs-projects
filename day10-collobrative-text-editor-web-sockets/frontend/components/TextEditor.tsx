'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@/context/UserContext';
import socketClient from '@/lib/socketClient';

// Import Quill and styles
import 'quill/dist/quill.snow.css';
import type { default as QuillType, Delta as QuillDelta } from 'quill';
import type QuillCursors from 'quill-cursors';
import type { Range as QuillRange } from 'quill';
import { CursorPosition, CursorData } from '@/types/app';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

// Enhanced cursor colors with better contrast
const CURSOR_COLORS = [
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F43F5E', // Rose
  '#3B82F6', // Blue
  '#84CC16', // Lime
  '#9333EA'  // Violet
];

const TextEditor = () => {
  const { sendDocumentChanges, room, user } = useUser();
  const [quill, setQuill] = useState<QuillType | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const isQuillInitialized = useRef(false);
  const cursorsRef = useRef<Map<string, string>>(new Map());
  const colorIndexRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !editorRef.current || isQuillInitialized.current) return;

    const initQuill = async () => {
      const Quill = (await import('quill')).default;
      const QuillCursors = (await import('quill-cursors')).default;
      Quill.register('modules/cursors', QuillCursors);

      if (!isQuillInitialized.current && editorRef.current) {
        isQuillInitialized.current = true;
        const q = new Quill(editorRef.current, {
          theme: 'snow',
          modules: {
            cursors: true,
            toolbar: TOOLBAR_OPTIONS
          }
        });
        setQuill(q);
      }
    };

    initQuill();

    return () => {
      isQuillInitialized.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (!quill || !user || !room) return;
  
    const cursors = quill.getModule('cursors') as QuillCursors;

    // Create a local copy of the cursors Map at the start of the effect
    const currentCursors = cursorsRef.current;
    
    const handleSelectionChange = (range: QuillRange | null) => {
      const cursorPosition: CursorPosition = {
        id: user.id,
        user: user,
        position: range ? {
          index: range.index,
          length: range.length
        } : null
      };
      
      socketClient.sendCursorPosition(room.id, user.id, cursorPosition);
    };
  
    const handleCursorPosition = (data: CursorData) => {
      if (data.userId === user.id) return;
  
      if (!currentCursors.has(data.userId)) {
        const colorIndex = (colorIndexRef.current++) % CURSOR_COLORS.length;
        const cursorColor = CURSOR_COLORS[colorIndex];
        currentCursors.set(data.userId, cursorColor);
  
        // Create cursor with enhanced styling
        cursors.createCursor(data.userId, data.username, cursorColor);
        
        // Apply enhanced styles to cursor elements
        requestAnimationFrame(() => {
          const cursorElement = document.querySelector(`[data-user-id="${data.userId}"]`);
          if (cursorElement) {
            const flag = cursorElement.querySelector('.ql-cursor-flag') as HTMLElement;
            if (flag) {
              flag.style.backgroundColor = cursorColor;
              flag.style.borderColor = cursorColor;
              flag.style.color = '#FFFFFF';
              flag.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
              flag.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
              flag.style.transform = 'scale(1)';
              flag.style.opacity = '0.95';
              // Ensure the name is visible
              flag.style.display = 'block';
              // Add padding for better visibility
              flag.style.padding = '1px 4px';
            }
  
            // Style the caret (cursor line)
            const caret = cursorElement.querySelector('.ql-cursor-caret') as HTMLElement;
            if (caret) {
              caret.style.backgroundColor = cursorColor;
              caret.style.boxShadow = `0 0 8px ${cursorColor}`;
              caret.style.opacity = '1';
            }
  
            // Style the selection
            const selection = cursorElement.querySelector('.ql-cursor-selection-block') as HTMLElement;
            if (selection) {
              selection.style.backgroundColor = `${cursorColor}33`;
              selection.style.transition = 'all 0.1s ease';
            }
          }
        });
      }
  
      // Update cursor position with name and stored color
      if (!data.position) {
        cursors.removeCursor(data.userId);
        cursorsRef.current.delete(data.userId);
        return;
      }

      const cursorColor = currentCursors.get(data.userId);
      // Only create cursor if we have a valid color
      if (cursorColor) {
        // Ensure we pass the username when updating the cursor position
        cursors.createCursor(
          data.userId,
          data.username,
          cursorColor
        );
      }
      cursors.moveCursor(data.userId, data.position);

      // Force update of cursor name
      const cursorElement = document.querySelector(`[data-user-id="${data.userId}"]`);
      if (cursorElement) {
        const flag = cursorElement.querySelector('.ql-cursor-flag') as HTMLElement;
        if (flag) {
          flag.textContent = data.username;
          flag.style.display = 'block';
        }
      }
    };

    quill.on('selection-change', handleSelectionChange);
    socketClient.onReceiveCursorPosition(handleCursorPosition);
  
    return () => {
      quill.off('selection-change', handleSelectionChange);
      socketClient.off('receive-cursor-position', handleCursorPosition);
      // Clean up cursors
      Array.from(currentCursors.keys()).forEach(userId => {
        cursors.removeCursor(userId);
      });
      currentCursors.clear();
    };
  }, [quill, user, room]);

  useEffect(() => {
    if (!quill || !room) return;

    const handler = (delta: QuillDelta, oldDelta: QuillDelta, source: string) => {
      if (source !== 'user') return;
      sendDocumentChanges(delta);
    };

    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [quill, room, sendDocumentChanges]);

  useEffect(() => {
    if (!quill || !room) return;

    const handler = (delta: QuillDelta) => {
      quill.updateContents(delta);
    };

    socketClient.onReceiveDocumentContent(handler);

    return () => {
      socketClient.off('receive-document-content', handler);
    };
  }, [quill, room]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-auto" ref={editorRef}></div>
    </div>
  );
};

export default TextEditor;