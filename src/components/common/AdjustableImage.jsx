import React, { useState, useRef, useEffect } from 'react';
import { Move, Check, X } from 'lucide-react';
import { useImageSettings } from '../../context/ImageSettingsContext';
import useSupabaseSession from '../../hooks/useSupabaseSession';
import Toast from './Toast';

/**
 * AdjustableImage
 *
 * Cover-fitted image whose framing (focal point + zoom) is stored per
 * elementKey in Supabase. Renders identically for all visitors; when an
 * admin session exists, a Move button enables in-place drag + zoom editing.
 *
 * Framing model: the (focalX%, focalY%) point of the photo is pinned to the
 * same relative point of the box at any box size, and zoom magnifies around
 * it (object-position + transform-origin share the focal point).
 *
 * @param {string} elementKey - DB key: semantic slot ('hero', 'faq_torturi') or raw photo URL (products)
 * @param {string} className - classes for the box (position/size); overflow-hidden is applied
 * @param {string} imgClassName - extra classes for the img element
 * @param {boolean} editable - false = render-only (e.g. tiny thumbnails that inherit the photo's setting)
 */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const AdjustableImage = ({
  elementKey,
  src,
  alt = '',
  className = '',
  imgClassName = '',
  editable = true,
  fit = 'cover', // 'cover' (fill+crop) or 'contain' (show whole image, e.g. cut-out PNGs)
  ...imgProps
}) => {
  const objectClass = fit === 'contain' ? 'object-contain' : 'object-cover';
  const { getSetting, saveSetting } = useImageSettings();
  const { isAdmin } = useSupabaseSession();

  const boxRef = useRef(null);
  const imgRef = useRef(null);
  const dragRef = useRef(null); // { startX, startY, focalX, focalY }

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const saved = getSetting(elementKey);
  const shown = editing && draft ? draft : saved;

  // Overflow (extra hidden pixels) per axis for the current zoom — how far the
  // image can pan. Derived from the cover-fit of the natural image size.
  const getOverflow = (zoom) => {
    const box = boxRef.current?.getBoundingClientRect();
    const img = imgRef.current;
    if (!box || !img || !img.naturalWidth || !img.naturalHeight) return { x: 0, y: 0 };
    const coverScale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
    return {
      x: img.naturalWidth * coverScale * zoom - box.width,
      y: img.naturalHeight * coverScale * zoom - box.height
    };
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, focalX: shown.focalX, focalY: shown.focalY };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const { startX, startY, focalX, focalY } = dragRef.current;
    const overflow = getOverflow(shown.zoom);
    setDraft((prev) => prev && ({
      ...prev,
      // Dragging the photo by dx px moves its content 1:1; object-position
      // shifts content by overflow * focal%, hence the 100/overflow factor.
      focalX: overflow.x > 0 ? clamp(focalX - ((e.clientX - startX) * 100) / overflow.x, 0, 100) : prev.focalX,
      focalY: overflow.y > 0 ? clamp(focalY - ((e.clientY - startY) * 100) / overflow.y, 0, 100) : prev.focalY
    }));
  };

  const onPointerUp = (e) => {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  // If the shown photo changes mid-edit (e.g. carousel thumbnail click in the
  // product modal), abandon the draft so it can't be saved under the new key.
  useEffect(() => {
    setEditing(false);
    setDraft(null);
    dragRef.current = null;
  }, [elementKey]);

  // Wheel-to-zoom needs a native non-passive listener (React's onWheel is passive)
  useEffect(() => {
    if (!editing) return;
    const box = boxRef.current;
    if (!box) return;
    const onWheel = (e) => {
      e.preventDefault();
      setDraft((prev) => prev && { ...prev, zoom: clamp(prev.zoom - e.deltaY * 0.002, 1, 3) });
    };
    box.addEventListener('wheel', onWheel, { passive: false });
    return () => box.removeEventListener('wheel', onWheel);
  }, [editing]);

  const startEdit = () => {
    setDraft({ ...saved });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(null);
    dragRef.current = null;
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    const { error } = await saveSetting(elementKey, draft);
    setSaving(false);
    if (error) {
      setToast({ type: 'error', message: 'Save failed — are you logged in as admin?' });
    } else {
      setToast({ type: 'success', message: 'Image position saved' });
      setEditing(false);
      setDraft(null);
    }
  };

  return (
    <div ref={boxRef} className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        className={`w-full h-full ${objectClass} ${imgClassName}`}
        style={{
          objectPosition: `${shown.focalX}% ${shown.focalY}%`,
          transform: `scale(${shown.zoom})`,
          transformOrigin: `${shown.focalX}% ${shown.focalY}%`
        }}
        {...imgProps}
      />

      {editable && isAdmin && !editing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            startEdit();
          }}
          className="absolute top-2 right-2 z-20 bg-[#1e3a8a]/80 hover:bg-[#1e3a8a] text-white rounded-full p-2 shadow-lg transition"
          aria-label="Adjust image position"
          title="Adjust image position"
        >
          <Move size={16} />
        </button>
      )}

      {editing && (
        <>
          {/* Drag surface (click swallowed so parent onClick — open modal etc. — doesn't fire) */}
          <div
            className="absolute inset-0 z-20 cursor-move touch-none"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
          {/* Control bar */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/95 rounded-full shadow-lg px-3 py-1.5"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={shown.zoom}
              onChange={(e) => setDraft((prev) => prev && { ...prev, zoom: Number(e.target.value) })}
              className="w-20 sm:w-28 accent-[#1e3a8a]"
              aria-label="Zoom"
            />
            <button
              onClick={save}
              disabled={saving}
              className="text-green-700 hover:bg-green-50 rounded-full p-1.5 transition disabled:opacity-50"
              aria-label="Save position"
            >
              <Check size={18} />
            </button>
            <button
              onClick={cancelEdit}
              disabled={saving}
              className="text-red-600 hover:bg-red-50 rounded-full p-1.5 transition disabled:opacity-50"
              aria-label="Cancel"
            >
              <X size={18} />
            </button>
          </div>
        </>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdjustableImage;
