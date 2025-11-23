import React, { useEffect, useState, useMemo } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

export default function Onboarding({ storageKey = 'larasena_onboarding_shown', forceShow = false, steps: propSteps = null, waitForTargets = true, maxWait = 5000, disableFlip = false, onClose = null, hideTooltipTargets = [], onStepChange = null }) {
    // If parent passes steps via prop use them, otherwise use defaults
    const defaultSteps = useMemo(() => [
        {
            target: '#profile-menu-button',
            content: 'Klik profil Anda di sini untuk mengakses pengaturan akun dan informasi profil.',
            placement: 'bottom'
        },
        {
            target: '#create-batik-btn',
            content: 'Gunakan tombol ini untuk membuat batik/desain baru.',
            placement: 'left'
        },
        {
            target: '#sidebar-produksi',
            content: 'Di sini Anda bisa mengakses halaman Produksi untuk membuat/memantau pesanan.',
            placement: 'right'
        }
    ], []);

    const steps = propSteps && Array.isArray(propSteps) && propSteps.length ? propSteps : defaultSteps;

    const [run, setRun] = useState(false);

    useEffect(() => {
        let shown = null;
        try {
            shown = localStorage.getItem(storageKey);
        } catch (e) {
            shown = null;
        }

        const shouldShow = forceShow || !shown;
        if (!shouldShow) return;

        // If caller doesn't want waiting behavior, start immediately
        if (!waitForTargets) {
            setRun(true);
            return;
        }

        // Wait until targets exist in DOM (useful when elements mount asynchronously)
        const targets = (steps || []).map(s => s.target).filter(Boolean);
        if (targets.length === 0) {
            setRun(true);
            return;
        }

        let elapsed = 0;
        const intervalMs = 200;
        const timer = setInterval(() => {
            const allFound = targets.every(t => !!document.querySelector(t));
            if (allFound) {
                clearInterval(timer);
                setRun(true);
                return;
            }

            elapsed += intervalMs;
            if (elapsed >= maxWait) {
                // Timeout reached — start anyway to avoid never showing
                clearInterval(timer);
                setRun(true);
            }
        }, intervalMs);

        return () => clearInterval(timer);
    }, [forceShow, storageKey, steps, waitForTargets, maxWait]);

    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [hideTooltip, setHideTooltip] = useState(false);

    function handleJoyrideCallback(data) {
        const { status, type, action } = data;
        const stepIndex = data.index ?? (data.step && data.step.index) ?? -1;

        // update current step index and notify parent
        setCurrentStepIndex(stepIndex);
        try {
            if (typeof onStepChange === 'function') onStepChange(stepIndex);
        } catch (e) {}

        // determine whether to hide the tooltip for this step
        const currentTarget = (steps && steps[stepIndex] && steps[stepIndex].target) || null;
        const shouldHide = hideTooltipTargets && currentTarget && hideTooltipTargets.includes(currentTarget);
        setHideTooltip(Boolean(shouldHide));

        // Mark onboarding as shown when the tour finishes, is skipped, the tour ends,
        // or the user explicitly closes the tooltip (ACTIONS.CLOSE). This prevents
        // the onboarding from appearing repeatedly for the same user in this browser.
        if (
            [STATUS.FINISHED, STATUS.SKIPPED].includes(status) ||
            type === EVENTS.TOUR_END ||
            action === ACTIONS.CLOSE
        ) {
            try {
                localStorage.setItem(storageKey, '1');
            } catch (e) {}
            setRun(false);
            // Notify parent that the tour closed/finished so it can reset forceShow
            try {
                if (typeof onClose === 'function') onClose();
            } catch (e) {}
        }
    }

    if (!run) return null;

    // Configure popper: allow disabling flip, but provide a sensible
    // fallback placement order so tooltips stay usable on small screens.
    // If `disableFlip` is true the flip modifier is disabled; otherwise
    // we enable flip and provide fallbackPlacements.
    const popperOptions = {
        modifiers: [
            {
                name: 'flip',
                enabled: !disableFlip,
                options: {
                    fallbackPlacements: ['right', 'top', 'bottom']
                }
            }
        ]
    };

    // If hideTooltip is true we hide the Joyride tooltip container so a
    // custom overlay (e.g., FloatingTour) can render centered on the
    // spotlight. Otherwise show normal tooltip styles.
    const tooltipStyles = {
        borderRadius: '14px',
        padding: '16px',
        background: '#FBF3EA',
        color: '#3B2B1B',
        boxShadow: '0 12px 28px rgba(22,18,16,0.08)',
        border: '1px solid rgba(186,104,42,0.10)',
        maxWidth: '340px',
        width: 'auto',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        display: hideTooltip ? 'none' : undefined
    };

    return (
        <Joyride
            steps={steps}
            continuous={true}
            scrollToFirstStep={true}
            showProgress={true}
            showSkipButton={true}
            run={run}
            callback={handleJoyrideCallback}
            spotlightPadding={8}
            disableOverlayClose={true}
            popperOptions={popperOptions}
            styles={{
                options: {
                    zIndex: 20000,
                    primaryColor: '#BA682A',
                    overlayColor: 'rgba(0,0,0,0.6)'
                },
                tooltipContainer: tooltipStyles,
                tooltipTitle: {
                    fontSize: '15px',
                    fontWeight: 700,
                    marginBottom: '6px',
                    color: '#5A3818'
                },
                tooltipContent: {
                    fontSize: '13px',
                    color: '#4A3629',
                    lineHeight: '1.45'
                },
                buttonNext: {
                    backgroundColor: 'rgba(186,104,42,0.98)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    padding: '9px 14px',
                    boxShadow: '0 8px 22px rgba(186,104,42,0.18)',
                    border: 'none',
                    transition: 'transform 120ms ease, box-shadow 120ms ease'
                },
                buttonBack: {
                    backgroundColor: '#5A3818',
                    color: '#ffffff',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    transition: 'background-color 120ms ease, transform 120ms ease'
                },
                buttonSkip: {
                    color: '#5A3818',
                    fontWeight: 600,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(90,56,24,0.10)',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 120ms ease, transform 120ms ease'
                },
                buttonClose: {
                    background: 'transparent',
                    color: '#5A3818',
                    cursor: 'pointer',
                    fontSize: '10px',
                    padding: '0',
                    paddingTop: '6px',
                    paddingRight: '6px',
                    width: '18px',
                    height: '18px',
                    lineHeight: '1',
                    borderRadius: '50%',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                tooltipFooter: {
                    marginTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                spotlight: {
                    boxShadow: '0 0 0 6px rgba(186,104,42,0.12), 0 8px 30px rgba(0,0,0,0.35)'
                },
                beacon: {
                    inner: { background: '#FFF7EF' },
                    outer: { background: 'rgba(186,104,42,0.18)' }
                }
            }}
        />
    );
}
