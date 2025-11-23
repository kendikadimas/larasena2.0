import React, { useEffect, useState, useCallback } from 'react';

export default function FloatingTour({ steps = [], visible = false, startIndex = 0, onClose = () => {} }) {
    const [index, setIndex] = useState(startIndex);
    const [pos, setPos] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });

    const updatePosition = useCallback(() => {
        const step = steps[index];
        if (!step || !step.target) {
            setPos({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
            return;
        }

        const el = document.querySelector(step.target);
        if (!el) {
            setPos({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
            return;
        }

        const rect = el.getBoundingClientRect();

        // If the step requests to float on the spotlight, center the tooltip
        // over the target (so it appears on top of the spotlight area).
        if (step.floatOnSpotlight) {
            const left = rect.left + rect.width / 2;
            const top = rect.top + rect.height / 2;
            setPos({ top: top + 'px', left: left + 'px', transform: 'translate(-50%, -50%)' });
            return;
        }

        // Preferred placement: right
        const left = Math.min(window.innerWidth - 340 - 12, rect.right + 12);
        const top = rect.top + rect.height / 2;
        setPos({ top: top + 'px', left: left + 'px', transform: 'translateY(-50%)' });
    }, [index, steps]);

    useEffect(() => {
        if (!visible) return;
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [visible, updatePosition]);

    useEffect(() => setIndex(startIndex), [startIndex, visible]);

    if (!visible || !steps || steps.length === 0) return null;

    const step = steps[index];

    const handleNext = () => {
        if (index < steps.length - 1) setIndex(i => i + 1);
        else onClose();
    };

    const handleBack = () => {
        if (index > 0) setIndex(i => i - 1);
    };

    const containerStyle = {
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        transform: pos.transform,
        width: 340,
        zIndex: 20000,
        pointerEvents: 'auto'
    };

    const tooltipStyle = {
        borderRadius: 14,
        padding: 16,
        background: '#FBF3EA',
        color: '#3B2B1B',
        boxShadow: '0 12px 28px rgba(22,18,16,0.08)',
        border: '1px solid rgba(186,104,42,0.10)'
    };

    const footerStyle = { marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

    return (
        <div style={containerStyle} aria-live="polite">
            <div style={tooltipStyle}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#5A3818' }}>{step.title || ''}</div>
                <div style={{ fontSize: 13, color: '#4A3629', lineHeight: 1.45 }}>{step.content}</div>
                <div style={footerStyle}>
                    <div>
                        <button onClick={onClose} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(90,56,24,0.10)', background: 'transparent', color: '#5A3818', fontWeight: 600 }}>Skip</button>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button onClick={handleBack} disabled={index === 0} style={{ padding: '8px 12px', borderRadius: 10, background: '#5A3818', color: '#fff', border: 'none' }}>Back</button>
                        <button onClick={handleNext} style={{ padding: '9px 14px', borderRadius: 10, background: '#BA682A', color: '#fff', border: 'none' }}>{index < steps.length - 1 ? `Next (${index + 1} / ${steps.length})` : 'Finish'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
