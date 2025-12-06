let loadPages, loadCustomRanges;

//Load and Test Initialize Pages
try {
    const mod = await import('./initializePages.js');
    loadPages = mod.initializePages;
} catch (e) {
    console.error('Failed to import initializePages.js as module:', e);
    if (typeof window !== 'undefined' && typeof window.initializePages === 'function') {
        loadPages = window.initializePages;
    } else {
        throw e;
    }
}

//Load and Test Custom Ranges
try {
    const mod = await import('./customRanges.js');
    loadCustomRanges = mod.getCustomRanges;
} catch (e) {
    console.error('Failed to import customRanges.js as module:', e);
    if (typeof window !== 'undefined' && typeof window.getCustomRanges === 'function') {
        loadCustomRanges = window.getCustomRanges;
    } else {
        throw e;
    }
}

//Load and Test Dice Data
let getDiceData;
try {
    const mod = await import('./diceData.js');
    getDiceData = mod.getDiceData;
} catch (e) {
    console.error('Failed to import diceData.js as module:', e);
    if (typeof window !== 'undefined' && typeof window.getDiceData === 'function') {
        getDiceData = window.getDiceData;
    } else {
        throw e;
    }
}

// Load Status Effect Descriptions
let getStatusEffectDescriptions;
try {
    const mod = await import('./statusEffectDescriptions.js');
    getStatusEffectDescriptions = mod.getStatusEffectDescriptions;
} catch (e) {
    console.error('Failed to import statusEffectDescriptions.js as module:', e);
    if (typeof window !== 'undefined' && typeof window.getStatusEffectDescriptions === 'function') {
        getStatusEffectDescriptions = window.getStatusEffectDescriptions;
    } else {
        throw e;
    }
}
    // Character Management System
    class CharacterManager {
        constructor() {
            this.currentCharacter = null;
            this.characters = this.loadCharactersFromStorage();
            this.handMode = 'normal'; // 'normal' or 'special'
            this.lastCombatResults = null; // Store the last combat results
            // Emotion bonus to Max Light applies only during an active encounter
            this.emotionBonusLight = 0;
            this.previewCollection = []; // Track pages in the preview collection
            this.passivesArray = []; // Store passives as an array
            this.initializeEventListeners();
            
            // Initialize stats after ensuring DOM elements are available
            this.initializeStats();
            
            // Render initial passives (empty state)
            setTimeout(() => this.renderPassives(), 100);
        }

        // Apply [On Hit] effects when clicking dice in combat results
        applyOnHitEffect(pageName, dieIndex) {
            // Currently implement for: To Overcome Crisis - Dice 1: [On Hit] Gain 4 Poise Potency and 2 Count
            try {
                if (pageName === 'To Overcome Crisis' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(4, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 4;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification('To Overcome Crisis (Dice 1): Applied [On Hit] — +4 Poise Potency, +2 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Mind Strike: Dice 1-2 [On Hit] Gain 2 Charge Potency
                if (pageName === 'Mind Strike' && (dieIndex === 1 || dieIndex === 2)) {
                    if (typeof this.addChargePotencyThisScene === 'function') {
                        this.addChargePotencyThisScene(2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const cur = Number(this.encounterState.chargePotencyThisScene) || 0;
                        this.encounterState.chargePotencyThisScene = Math.max(0, Math.min(99, cur + 2));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    this.showNotification('Mind Strike: Gained 2 Charge Potency.', 'success');
                    return;
                }
                // Energy Strike
                if (pageName === 'Energy Strike' && dieIndex === 1) {
                    if (typeof this.addChargePotencyThisScene === 'function') {
                        this.addChargePotencyThisScene(2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const cur = Number(this.encounterState.chargePotencyThisScene) || 0;
                        this.encounterState.chargePotencyThisScene = Math.max(0, Math.min(99, cur + 2));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    this.showNotification('Energy Strike: Gained 2 Charge Potency.', 'success');
                    return;
                }
                // Pinpoint Shot: Dice 1-2 [On Dice] Consume 1 Bullet; [On Hit] Gain 2 Charge Potency
                if (pageName === 'Pinpoint Shot' && (dieIndex === 1 || dieIndex === 2)) {
                    // On Dice: bullet consumption is handled earlier during dice roll gating
                    // On Hit: gain 2 Charge
                    if (typeof this.addChargePotencyThisScene === 'function') {
                        this.addChargePotencyThisScene(2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const cur = Number(this.encounterState.chargePotencyThisScene) || 0;
                        this.encounterState.chargePotencyThisScene = Math.max(0, Math.min(99, cur + 2));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    this.showNotification(`Pinpoint Shot (Dice ${dieIndex}): Gained 2 Charge Potency.`, 'success');
                    return;
                }
                // Crab Bastards!:
                if (pageName === 'Crab Bastards!' && dieIndex === 1) {
                    if (typeof this.addChargePotencyThisScene === 'function') {
                        this.addChargePotencyThisScene(3);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const cur = Number(this.encounterState.chargePotencyThisScene) || 0;
                        this.encounterState.chargePotencyThisScene = Math.max(0, Math.min(99, cur + 3));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    this.showNotification('Crab Bastards! (Dice 1): Applied [On Clash Win] — +3 Charge Potency.', 'success');
                    return;
                }
                // Emotional Turbulence: Clash Dice 1 [On Clash Win] Restore 1 Light
                if (pageName === 'Emotional Turbulence' && dieIndex === 1) {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.forbidLightGainThisEncounter) {
                            // Immediate light restoration (not refund)
                            const maxLightEl = document.getElementById('maxLightValue');
                            const currentLightEl = document.getElementById('currentLightValue');
                            if (maxLightEl && currentLightEl) {
                                const maxLight = parseInt(maxLightEl.textContent) || 0;
                                const currentLight = parseInt(currentLightEl.textContent) || 0;
                                const newLight = Math.min(maxLight, currentLight + 1);
                                currentLightEl.textContent = `${newLight}/${maxLight}`;
                                this.showNotification('Emotional Turbulence (Dice 1): [On Clash Win] Restored 1 Light.', 'success');
                            }
                        } else {
                            this.showNotification('Light gain is disabled for this encounter.', 'info');
                        }
                    } catch (e) { /* non-fatal */ }
                    return;
                }
                // Overthrow: Counter Slash - On Hit effects for each die
                if (pageName === 'Overthrow: Counter Slash') {
                    let potGain = 0, cntGain = 0;
                    if (dieIndex === 1) { potGain = 2; cntGain = 1; }
                    else if (dieIndex === 2) { potGain = 3; cntGain = 2; }
                    else if (dieIndex === 3) { potGain = 4; cntGain = 3; }
                    else if (dieIndex === 4) { potGain = 5; cntGain = 4; }
                    else if (dieIndex === 5) { potGain = 6; cntGain = 5; }
                    if (potGain > 0 || cntGain > 0) {
                        if (typeof this.addPoiseThisScene === 'function') {
                            this.addPoiseThisScene(potGain, cntGain);
                        } else {
                            if (!this.encounterState) this.encounterState = {};
                            this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + potGain;
                            this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + cntGain;
                        }
                        this.showNotification(`Overthrow: Counter Slash (Dice ${dieIndex}): Applied [On Hit] — +${potGain} Poise Potency, +${cntGain} Poise Count.`, 'success');
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        return;
                    }
                }
                // Draw of the Sword: Dice 1 [On Hit] Gain 2 Poise Potency
                if (pageName === 'Draw of the Sword' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(2, 0);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                    }
                    this.showNotification('Draw of the Sword (Dice 1): Applied [On Hit] — +2 Poise Potency.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Draw of the Sword: Dice 2 [On Hit] Gain 3 Poise Potency and 3 Count
                if (pageName === 'Draw of the Sword' && dieIndex === 2) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(3, 3);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 3;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 3;
                    }
                    this.showNotification('Draw of the Sword (Dice 2): Applied [On Hit] — +3 Poise Potency, +3 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Blade Arc: Dice 1 [On Hit] Gain 8 Poise Potency and 3 Count
                if (pageName === 'Blade Arc' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(8, 3);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 8;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 3;
                    }
                    this.showNotification('Blade Arc (Dice 1): Applied [On Hit] — +8 Poise Potency, +3 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Acupuncture: Dice 1-3 [On Hit] Gain 3 Poise Potency and 2 Count
                if (pageName === 'Acupuncture' && (dieIndex === 1 || dieIndex === 2 || dieIndex === 3)) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(3, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 3;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification(`Acupuncture (Dice ${dieIndex}): Applied [On Hit] — +3 Poise Potency, +2 Poise Count.`, 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Moonlit Blade Dance: Dice 1-3 [On Hit] Gain 3 Poise Potency and 2 Count
                if (pageName === 'Moonlit Blade Dance' && (dieIndex === 1 || dieIndex === 2 || dieIndex === 3)) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(3, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 3;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification(`Moonlit Blade Dance (Dice ${dieIndex}): Applied [On Hit] — +3 Poise Potency, +2 Poise Count.`, 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Slay: Dice 1 [On Hit] Gain 3 Poise Potency and 5 Count
                if (pageName === 'Slay' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(3, 5);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 3;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 5;
                    }
                    this.showNotification('Slay (Dice 1): Applied [On Hit] — +3 Poise Potency, +5 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Slay: Dice 2 [On Hit] Gain 2 Power Up and 1 Slash DMG Up next Scene
                if (pageName === 'Slay' && dieIndex === 2) {
                    if (!this.encounterState) this.encounterState = {};
                    // Gain 2 Power Up next Scene
                    const pendingPower = (typeof this.encounterState.powerUpNextScene === 'number') ? this.encounterState.powerUpNextScene : 0;
                    this.encounterState.powerUpNextScene = Math.max(0, Math.min(10, pendingPower + 2));
                    // Gain 1 Slash DMG Up next Scene
                    const pendingSlash = Number(this.encounterState.slashDmgUpNextScene) || 0;
                    this.encounterState.slashDmgUpNextScene = Math.max(0, Math.min(10, pendingSlash + 1));
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification('Slay (Dice 2): Applied [On Hit] — Will gain +2 Power Up and +1 Slash DMG Up next Scene.', 'success');
                    return;
                }
                // To Claim Their Bones: Dice 1-3 [On Hit] Gain 5 Poise Potency and 2 Count
                if (pageName === 'To Claim Their Bones' && (dieIndex === 1 || dieIndex === 2 || dieIndex === 3)) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(5, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 5;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification(`To Claim Their Bones (Dice ${dieIndex}): Applied [On Hit] — +5 Poise Potency, +2 Poise Count.`, 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Excise Target: Dice 1 [On Hit] Gain 1 Protection this and next Scene
                if (pageName === 'Excise Target' && dieIndex === 1) {
                    if (typeof this.addProtectionThisScene === 'function') {
                        this.addProtectionThisScene(1);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const curProt = Number(this.encounterState.protectionThisScene) || 0;
                        this.encounterState.protectionThisScene = Math.min(10, curProt + 1);
                    }
                    // queue for next scene
                    if (!this.encounterState) this.encounterState = {};
                    const pendingProt = Number(this.encounterState.protectionNextScene) || 0;
                    this.encounterState.protectionNextScene = Math.min(10, pendingProt + 1);
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification('Excise Target (Dice 1): +1 Protection this and next Scene.', 'success');
                    return;
                }
                // Excise Target: Dice 2 [On Hit] Gain 3 Taunt this and next Scene
                if (pageName === 'Excise Target' && dieIndex === 2) {
                    if (typeof this.addTauntThisScene === 'function') {
                        this.addTauntThisScene(3);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const curTaunt = Number(this.encounterState.tauntThisScene) || 0;
                        this.encounterState.tauntThisScene = Math.min(10, curTaunt + 3);
                    }
                    // queue for next scene
                    if (!this.encounterState) this.encounterState = {};
                    const pendingTaunt = Number(this.encounterState.tauntNextScene) || 0;
                    this.encounterState.tauntNextScene = Math.min(10, pendingTaunt + 3);
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification('Excise Target (Dice 2): +3 Taunt this and next Scene.', 'success');
                    return;
                }
                
                // Heel Turn: Dice 1 [On Clash Win] Gain 2 Poise Potency
                if (pageName === 'Heel Turn' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(2, 0);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                    }
                    this.showNotification('Heel Turn (Dice 1): Applied [On Clash Win] — +2 Poise Potency.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Heel Turn: Dice 2 [On Hit] Gain 3 Poise Potency and 2 Count
                if (pageName === 'Heel Turn' && dieIndex === 2) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(3, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 3;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification('Heel Turn (Dice 2): Applied [On Hit] — +3 Poise Potency, +2 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Flank Thrust: Dice 1 [On Clash Win] Gain 3 Poise Potency
                if (pageName === 'Flank Thrust' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(3, 0);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 3;
                    }
                    this.showNotification('Flank Thrust (Dice 1): Applied [On Clash Win] — +3 Poise Potency.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Flank Thrust: Dice 2 [On Hit] Gain 4 Poise Potency and 2 Count
                if (pageName === 'Flank Thrust' && dieIndex === 2) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(4, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 4;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification('Flank Thrust (Dice 2): Applied [On Hit] — +4 Poise Potency, +2 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Desperate Struggle' && (dieIndex === 1 || dieIndex === 2)) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(1, 0);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 1;
                    }
                    this.showNotification(`Desperate Struggle (Dice ${dieIndex}): Applied [On Hit] — +1 Poise Potency.`, 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Steel Knuckles' && dieIndex === 3) {
                    if (typeof this.drawImmediateCards === 'function') {
                        this.drawImmediateCards(1);
                    }
                    this.showNotification('Steel Knuckles (Dice 3): Applied [On Hit] — Drew 1 Page.', 'success');
                    return;
                }
                if (pageName === 'Summary Judgement' && dieIndex === 3) {
                    if (typeof this.drawImmediateCards === 'function') {
                        this.drawImmediateCards(1);
                    }
                    this.showNotification('Summary Judgement (Dice 3): Applied [On Hit] — Drew 1 Page.', 'success');
                    return;
                }
                // Discipline
                if (pageName === 'Discipline' && dieIndex === 3) {
                    try {
                        if (window.pageManager && typeof window.pageManager.drawRandomThumbAmmunitionPage === 'function') {
                            window.pageManager.drawRandomThumbAmmunitionPage();
                            this.showNotification('Discipline (Dice 3): Applied [On Hit] — Drew 1 Thumb Ammunition.', 'success');
                        } else {
                            this.showNotification('Discipline (Dice 3): Could not draw Thumb Ammunition (function unavailable).', 'warning');
                        }
                    } catch (e) { /* non-fatal */ }
                    return;
                }
                if (pageName === 'Discipline' && dieIndex === 4) {
                    try {
                        if (Array.isArray(this.lastCombatResults)) {
                            const result = this.lastCombatResults.find(r => r && r.pageName === 'Discipline');
                            if (result && Array.isArray(result.diceResults)) {
                                const idx = 3; // zero-based for die 4
                                const rangeStr = Array.isArray(result.diceRanges) ? (result.diceRanges[idx] || '') : '';
                                let minVal = 1, maxVal = 6;
                                if (typeof rangeStr === 'string' && rangeStr.includes('-')) {
                                    const parts = rangeStr.split('-');
                                    const pMin = parseInt(parts[0], 10);
                                    const pMax = parseInt(parts[1], 10);
                                    if (Number.isFinite(pMin) && Number.isFinite(pMax)) {
                                        minVal = pMin; maxVal = pMax;
                                    }
                                }
                                const newRolls = [];
                                for (let i = 0; i < 3; i++) {
                                    const val = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
                                    result.diceResults.push(val);
                                    if (Array.isArray(result.diceRanges)) result.diceRanges.push(rangeStr || `${minVal}-${maxVal}`);
                                    if (Array.isArray(result.diceCrits)) result.diceCrits.push(false);
                                    newRolls.push(val);
                                }
                                this.showNotification(`Discipline (Dice 4): Queued 3 extra uses → rolls ${newRolls.join(', ')}.`, 'success');
                                if (typeof this.displayCombatResults === 'function') {
                                    this.displayCombatResults(this.lastCombatResults, 'Updated Combat Phase Results');
                                }
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                    return;
                }
                if (pageName === 'Endless Battle' && dieIndex === 2) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(1, 0);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 1;
                    }
                    this.showNotification('Endless Battle (Dice 2): Applied [On Hit] — +1 Poise Potency.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Endless Battle' && dieIndex === 3) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(2, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification('Endless Battle (Dice 3): Applied [On Hit] — +2 Poise Potency, +2 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Flying Sword' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(1, 0);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 1;
                    }
                    this.showNotification('Flying Sword (Dice 1): Applied [On Hit] — +1 Poise Potency.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Flying Sword' && dieIndex === 2) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(3, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 3;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification('Flying Sword (Dice 2): Applied [On Hit] — +3 Poise Potency, +2 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Flashing Strike' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(1, 1);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 1;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 1;
                    }
                    this.showNotification('Flashing Strike (Dice 1): Applied [On Hit] — +1 Poise Potency, +1 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Flashing Strike' && dieIndex === 2) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(2, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification('Flashing Strike (Dice 2): Applied [On Hit] — +2 Poise Potency, +2 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Marche' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(2, 0);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                    }
                    this.showNotification('Marche (Dice 1): Applied [On Hit] — +2 Poise Potency.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Marche' && dieIndex === 2) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(2, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification('Marche (Dice 2): Applied [On Hit] — +2 Poise Potency, +2 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Feint' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(2, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification('Feint (Dice 1): Applied [On Clash Win] — +2 Poise Potency, +2 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Feint' && dieIndex === 2) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(3, 3);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 3;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 3;
                    }
                    this.showNotification('Feint (Dice 2): Applied [On Hit] — +3 Poise Potency, +3 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Feint' && dieIndex === 3) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(2, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 2;
                    }
                    this.showNotification('Feint (Dice 3): Applied [On Clash Win] — +2 Poise Potency, +2 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Remise' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(2, 0);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                    }
                    this.showNotification('Remise (Dice 1): Applied [On Hit] — +2 Poise Potency.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Remise' && dieIndex === 2) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(2, 1);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 1;
                    }
                    this.showNotification('Remise (Dice 2): Applied [On Hit] — +2 Poise Potency, +1 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Remise' && dieIndex === 3) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(3, 1);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 3;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 1;
                    }
                    this.showNotification('Remise (Dice 3): Applied [On Hit] — +3 Poise Potency, +1 Poise Count.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Flèche' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(6, 0);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 6;
                    }
                    this.showNotification('Flèche (Dice 1): Applied [On Hit] — +6 Poise Potency.', 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                if (pageName === 'Balestra Fente' && (dieIndex === 2 || dieIndex === 3)) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(4, 4);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 4;
                        this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 4;
                    }
                    this.showNotification(`Balestra Fente (Dice ${dieIndex}): Applied [On Hit] — +4 Poise Potency, +4 Poise Count.`, 'success');
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Check if this page/die has On Clash Lose effects instead
                if (pageName === 'Yield My Flesh' && dieIndex === 1) {
                    // Yield My Flesh Dice 1 has On Clash Lose, not On Hit
                    if (typeof this.applyOnClashLoseEffect === 'function') {
                        this.applyOnClashLoseEffect(pageName, dieIndex);
                        return;
                    }
                }
                
                // Ben Graham Page Functions
                // Be Obedient, Gafs.: Dice 1 [On Hit] Gain 5 Poise Potency and 2 Count
                if (pageName === 'Be Obedient, Gafs.' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(5, 2);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const curPot = Number(this.encounterState.poisePotencyThisScene) || 0;
                        const curCnt = Number(this.encounterState.poiseCountThisScene) || 0;
                        this.encounterState.poisePotencyThisScene = Math.max(0, Math.min(99, curPot + 5));
                        this.encounterState.poiseCountThisScene = Math.max(0, Math.min(99, curCnt + 2));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    this.showNotification('Be Obedient, Gafs. (Dice 1): +5 Poise Potency and +2 Count.', 'success');
                    return;
                }

                // Return to the Family: Clash Dice 1 [On Clash Win] Gain 10 Poise Potency (treated like On-Hit click)
                if (pageName === 'Return to the Family' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(10, 0);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const curPot = Number(this.encounterState.poisePotencyThisScene) || 0;
                        this.encounterState.poisePotencyThisScene = Math.max(0, Math.min(99, curPot + 10));
                    }
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification('Return to the Family (Clash Dice 1): +10 Poise Potency.', 'success');
                    return;
                }

                // I will be your Escort: Dice 1 [On Hit] Gain 1 Jackpot
                if (pageName === 'I will be your Escort' && dieIndex === 1) {
                    if (typeof this.addJackpotThisScene === 'function') {
                        this.addJackpotThisScene(1);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const cur = Number(this.encounterState.jackpotCountThisScene) || 0;
                        const next = Math.max(0, Math.min(99, cur + 1));
                        this.encounterState.jackpotCountThisScene = next;
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    this.showNotification('I will be your Escort (Dice 1): +1 Jackpot.', 'success');
                    return;
                }

                // I will be your Escort: Dice 2 [On Clash Win] Gain 5 Poise Potency and 5 Count (treated like On-Hit click)
                if (pageName === 'I will be your Escort' && dieIndex === 2) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(5, 5);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const curPot = Number(this.encounterState.poisePotencyThisScene) || 0;
                        const curCnt = Number(this.encounterState.poiseCountThisScene) || 0;
                        this.encounterState.poisePotencyThisScene = Math.max(0, Math.min(99, curPot + 5));
                        this.encounterState.poiseCountThisScene = Math.max(0, Math.min(99, curCnt + 5));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    this.showNotification('I will be your Escort (Clash Dice 2): +5 Poise Potency and +5 Count.', 'success');
                    return;
                }

                // I must repay my Benefactor: Dice 1 [On Hit] Gain 5 Poise Potency and 3 Count
                if (pageName === 'I must repay my Benefactor' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(5, 3);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const curPot = Number(this.encounterState.poisePotencyThisScene) || 0;
                        const curCnt = Number(this.encounterState.poiseCountThisScene) || 0;
                        this.encounterState.poisePotencyThisScene = Math.max(0, Math.min(99, curPot + 5));
                        this.encounterState.poiseCountThisScene = Math.max(0, Math.min(99, curCnt + 3));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    this.showNotification('I must repay my Benefactor (Dice 1): +5 Poise Potency and +3 Count.', 'success');
                    return;
                }

                // I must repay my Benefactor: Dice 2 [On Hit] Inflict 3 Bind next Scene
                if (pageName === 'I must repay my Benefactor' && dieIndex === 2) {
                    if (!this.encounterState) this.encounterState = {};
                    const pendingBind = Number(this.encounterState.bindNextScene) || 0;
                    this.encounterState.bindNextScene = Math.max(0, Math.min(10, pendingBind + 3));
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification('I must repay my Benefactor (Dice 2): +3 Bind next Scene.', 'success');
                    return;
                }

                // Time to end this Charade.: Dice 1 [On Hit] Gain 1 Poise Count
                if (pageName === 'Time to end this Charade.' && dieIndex === 1) {
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(0, 1);
                    } else {
                        if (!this.encounterState) this.encounterState = {};
                        const curCnt = Number(this.encounterState.poiseCountThisScene) || 0;
                        this.encounterState.poiseCountThisScene = Math.max(0, Math.min(99, curCnt + 1));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    this.showNotification('Time to end this Charade. (Dice 1): +1 Poise Count.', 'success');
                    return;
                }

                // Don't Interrupt: Dice 1 [On Hit] Gain 1 Power Up next Scene
                if (pageName === 'Don\'t Interrupt' && dieIndex === 1) {
                    if (!this.encounterState) this.encounterState = {};
                    const pendingPower = (typeof this.encounterState.powerUpNextScene === 'number') ? this.encounterState.powerUpNextScene : 0;
                    this.encounterState.powerUpNextScene = Math.max(0, Math.min(10, pendingPower + 1));
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification('Don\'t Interrupt (Dice 1): [On Hit] Gain 1 Power Up next Scene.', 'success');
                    return;
                }
                
                // Default: no effect for other pages/dice yet
                this.showNotification(`[On Hit] has no configured effect for ${pageName} (Die ${dieIndex}) yet.`, 'info');
            } catch (e) {
                console.warn('applyOnHitEffect failed:', e);
            }
        }

        // Apply [On Clash Lose] effects when clicking dice in combat results
        applyOnClashLoseEffect(pageName, dieIndex) {
            // Yield My Flesh: Dice 1 [On Clash Lose] Immediately add and use "To Claim Their Bones"
            try {
                if (pageName === 'Yield My Flesh' && dieIndex === 1) {
                    // Find "To Claim Their Bones" page
                    const claimBonesPage = Object.values(window.pageManager?.pages || {}).find(p => p && p.name === 'To Claim Their Bones');
                    if (claimBonesPage) {
                        // Immediately roll "To Claim Their Bones" and add to combat results
                        // This follows the pattern from Overthrow: Counter Slash
                        try {
                            const customRangesByPage = typeof loadCustomRanges === 'function' ? loadCustomRanges() : {};
                            const diceDataAll = (typeof getDiceData === 'function') ? getDiceData() : null;
                            const claimBonesName = claimBonesPage.name;
                            const claimBonesPageId = claimBonesPage.id;
                            const claimBonesRanges = customRangesByPage[claimBonesName] || [];
                            const claimBonesRequiredDice = Array.isArray(claimBonesRanges) ? claimBonesRanges.length : parseInt(claimBonesPage.dice);
                            const claimBonesDiceResults = [];
                            const claimBonesDiceCrits = [];
                            const claimBonesDiceData = diceDataAll && diceDataAll[claimBonesName] ? diceDataAll[claimBonesName] : null;
                            
                            // Get current Poise for crit calculation (read-only, don't consume)
                            const poisePotencyForCrit = (this.encounterState && typeof this.encounterState.poisePotencyThisScene === 'number') ? this.encounterState.poisePotencyThisScene : 0;
                            const poiseCountForCrit = (this.encounterState && typeof this.encounterState.poiseCountThisScene === 'number') ? this.encounterState.poiseCountThisScene : 0;
                            const critChancePct = Math.max(0, Math.min(100, poisePotencyForCrit * 5));
                            // Use local copy for crit checks - don't modify the actual Poise values
                            let remainingPoiseCountForCrit = poiseCountForCrit;
                            
                            // Helper function to compute effective range (reuse the same logic from combat phase)
                            const computeEffectiveRange = (minValue, maxValue, currentDieIndex) => {
                                let effectiveMin = minValue;
                                let effectiveMax = maxValue;
                                // Apply Power Up/Down
                                if (this.encounterState && typeof this.encounterState.powerUpThisScene === 'number') {
                                    effectiveMax += this.encounterState.powerUpThisScene;
                                }
                                if (this.encounterState && typeof this.encounterState.powerDownThisScene === 'number') {
                                    effectiveMax = Math.max(effectiveMin, effectiveMax - this.encounterState.powerDownThisScene);
                                }
                                // Bind effect
                                const bindValue = Number(this.encounterState?.bindThisScene) || 0;
                                if (bindValue > 0) {
                                    effectiveMin = Math.max(1, effectiveMin - bindValue);
                                    effectiveMax = Math.max(1, effectiveMax - bindValue);
                                }
                                if (effectiveMax < effectiveMin) effectiveMax = effectiveMin;
                                return [effectiveMin, effectiveMax];
                            };
                            
                            for (let j = 0; j < claimBonesRequiredDice; j++) {
                                let claimBonesRoll;
                                if (claimBonesRanges && claimBonesRanges[j]) {
                                    const [minStr, maxStr] = String(claimBonesRanges[j]).split('-');
                                    let minValue = parseInt(minStr);
                                    let maxValue = parseInt(maxStr);
                                    // Handle reversed ranges
                                    if (!isNaN(minValue) && !isNaN(maxValue)) {
                                        if (maxValue < minValue) {
                                            [minValue, maxValue] = [maxValue, minValue];
                                        }
                                        if (maxValue >= minValue) {
                                            const [effMin, effMax] = computeEffectiveRange(minValue, maxValue, j + 1);
                                            claimBonesRoll = Math.floor(Math.random() * (effMax - effMin + 1)) + effMin;
                                        }
                                    }
                                }
                                if (typeof claimBonesRoll !== 'number') {
                                    claimBonesRoll = Math.floor(Math.random() * 6) + 1;
                                }
                                
                                // Apply bonuses (same as in combat phase)
                                let totalBonus = 0;
                                if (this.encounterState && typeof this.encounterState.powerUpThisScene === 'number') {
                                    totalBonus += this.encounterState.powerUpThisScene;
                                }
                                if (this.encounterState && typeof this.encounterState.powerDownThisScene === 'number') {
                                    totalBonus -= this.encounterState.powerDownThisScene;
                                }
                                // Attack Power Up
                                let isDefDie = false;
                                try {
                                    const dieMeta = Array.isArray(claimBonesDiceData) ? (claimBonesDiceData.find(d => Number(d?.dice) === (j + 1)) || null) : null;
                                    const dieTypeStr = dieMeta && dieMeta.type ? String(dieMeta.type).toLowerCase() : '';
                                    isDefDie = dieTypeStr.includes('shield') || dieTypeStr.includes('evade');
                                    // Check for [Condition] Cannot Crit in dice 0 entry
                                    if (Array.isArray(claimBonesDiceData)) {
                                        const dice0Entry = claimBonesDiceData.find(d => Number(d?.dice) === 0);
                                        if (dice0Entry && dice0Entry.special && typeof dice0Entry.special === 'string') {
                                            if (dice0Entry.special.includes('[Condition] Cannot Crit')) {
                                                isDefDie = true;
                                            }
                                        }
                                    }
                                } catch (e) { /* non-fatal */ }
                                if (!isDefDie && this.encounterState && typeof this.encounterState.attackPowerUpThisScene === 'number') {
                                    totalBonus += this.encounterState.attackPowerUpThisScene;
                                }
                                if (!isDefDie && this.encounterState && typeof this.encounterState.attackPowerDownThisScene === 'number') {
                                    totalBonus -= this.encounterState.attackPowerDownThisScene;
                                }
                                
                                claimBonesRoll = Math.max(1, claimBonesRoll + totalBonus);
                                
                                // Check for crit (read-only check, don't consume Poise)
                                const didCrit = (!isDefDie) && (critChancePct > 0) && (remainingPoiseCountForCrit > 0) && (Math.random() * 100 < critChancePct);
                                // Note: We don't consume Poise Count here - this is just a check for the On Clash Lose effect
                                claimBonesDiceResults.push(claimBonesRoll);
                                claimBonesDiceCrits.push(!!didCrit);
                            }
                            
                            // Build dice ranges for display
                            const claimBonesDiceRanges = [];
                            for (let j = 0; j < claimBonesRequiredDice; j++) {
                                if (claimBonesRanges && claimBonesRanges[j]) {
                                    const [minStr, maxStr] = String(claimBonesRanges[j]).split('-');
                                    let minValue = parseInt(minStr);
                                    let maxValue = parseInt(maxStr);
                                    if (!isNaN(minValue) && !isNaN(maxValue)) {
                                        if (maxValue < minValue) {
                                            [minValue, maxValue] = [maxValue, minValue];
                                        }
                                        if (maxValue >= minValue) {
                                            const [effMin, effMax] = computeEffectiveRange(minValue, maxValue, j + 1);
                                            claimBonesDiceRanges.push(`${effMin}-${effMax}`);
                                        } else {
                                            claimBonesDiceRanges.push(String(claimBonesRanges[j]));
                                        }
                                    } else {
                                        claimBonesDiceRanges.push('1-6');
                                    }
                                } else {
                                    claimBonesDiceRanges.push('1-6');
                                }
                            }
                            
                            // Add to combat results immediately (like Overthrow: Counter Slash)
                            if (!this.lastCombatResults) this.lastCombatResults = [];
                            const newResult = {
                                pageId: claimBonesPageId,
                                pageName: claimBonesName,
                                diceCount: claimBonesRequiredDice,
                                diceResults: claimBonesDiceResults,
                                diceCrits: claimBonesDiceCrits,
                                diceRanges: claimBonesDiceRanges,
                                message: `${claimBonesName}: Rolled ${claimBonesDiceResults.join(', ')}`
                            };
                            this.lastCombatResults.push(newResult);
                            
                            this.showNotification('Yield My Flesh (Dice 1): [On Clash Lose] Triggered "To Claim Their Bones".', 'success');
                            
                            // Append the new result directly to the existing popup if it's open
                            if (typeof this.appendCombatResult === 'function') {
                                this.appendCombatResult(newResult);
                            } else if (typeof this.displayCombatResults === 'function') {
                                // Fallback: refresh if append function doesn't exist
                                setTimeout(() => {
                                    this.displayCombatResults();
                                }, 100);
                            }
                        } catch (e) {
                            console.warn('Failed to automatically roll To Claim Their Bones:', e);
                            this.showNotification('Yield My Flesh (Dice 1): Failed to trigger "To Claim Their Bones".', 'warning');
                        }
                    } else {
                        this.showNotification('Yield My Flesh (Dice 1): [On Clash Lose] "To Claim Their Bones" not found.', 'warning');
                    }
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    return;
                }
                // Default: no effect for other pages/dice yet
                this.showNotification(`[On Clash Lose] has no configured effect for ${pageName} (Die ${dieIndex}) yet.`, 'info');
            } catch (e) {
                console.warn('applyOnClashLoseEffect failed:', e);
            }
        }

        // Initialize stats safely after ensuring DOM elements are available
        initializeStats() {
            // Use setTimeout to ensure DOM is ready
            setTimeout(() => {
                this.updateTemperanceStats();
                this.updateJusticeSpeedStats();
                this.updateHpSpFromStats();
                this.updateSwapButtonAppearance();
            }, 0);
            
            // Retry initialization if elements are not found
            setTimeout(() => {
                const temperanceInput = document.getElementById('temperance');
                const maxHandElement = document.getElementById('maxHandValue');
                const drawPerSceneElement = document.getElementById('drawPerSceneValue');
                const maxHandLimitElement = document.getElementById('maxHandLimit');
                
                if (!temperanceInput || !maxHandElement || !drawPerSceneElement || !maxHandLimitElement) {
                    console.log('Retrying stats initialization...');
                    this.initializeStats();
                }
            }, 100);
        }

        updateHpSpFromStats() {
            const fortitudeInput = document.getElementById('fortitude');
            const prudenceInput = document.getElementById('prudence');
            const currentHpElement = document.getElementById('currentHp');
            const maxHpElement = document.getElementById('maxHp');
            const currentSpElement = document.getElementById('currentSp');
            const maxSpElement = document.getElementById('maxSp');
            if (!fortitudeInput || !prudenceInput || !currentHpElement || !maxHpElement || !currentSpElement || !maxSpElement) {
                return;
            }
            const fortitude = parseInt(fortitudeInput.value, 10) || 0;
            const prudence = parseInt(prudenceInput.value, 10) || 0;
            let currentHpVal = parseInt(currentHpElement.value, 10);
            if (isNaN(currentHpVal)) currentHpVal = fortitude;
            currentHpVal = Math.max(0, Math.min(currentHpVal, fortitude));
            
            // Get shield value for display
            const shieldVal = Math.max(0, Number(this.encounterState?.tempShieldHp) || 0);
            
            // Update current HP display to show "currentHP + shield" when shield exists
            if (shieldVal > 0) {
                const totalDisplay = currentHpVal + shieldVal;
                currentHpElement.value = totalDisplay;
            } else {
                currentHpElement.value = currentHpVal;
            }
            
            maxHpElement.textContent = fortitude;
            let currentSpVal = parseInt(currentSpElement.value, 10);
            if (isNaN(currentSpVal)) currentSpVal = prudence;
            currentSpVal = Math.max(0, Math.min(currentSpVal, prudence));
            currentSpElement.value = currentSpVal;
            maxSpElement.textContent = prudence;
            // Update health bar fills
            const hpBarFill = document.getElementById('hpBarFill');
            const spBarFill = document.getElementById('spBarFill');
            if (hpBarFill) {
                const hpPercent = fortitude > 0 ? (currentHpVal / fortitude) * 100 : 0;
                hpBarFill.style.width = `${Math.max(0, Math.min(100, hpPercent))}%`;
            }
            if (spBarFill) {
                const spPercent = prudence > 0 ? (currentSpVal / prudence) * 100 : 0;
                spBarFill.style.width = `${Math.max(0, Math.min(100, spPercent))}%`;
            }

            // Update shield bar on HP bar
            const hpBarShield = document.getElementById('hpBarShield');
            if (hpBarShield) {
                const shieldVal = Math.max(0, Number(this.encounterState?.tempShieldHp) || 0);
                if (shieldVal > 0 && fortitude > 0) {
                    // Calculate shield percentage of max HP
                    const shieldPercent = (shieldVal / fortitude) * 100;
                    // Position shield bar extending left from end of HP fill
                    const hpPercent = fortitude > 0 ? (currentHpVal / fortitude) * 100 : 0;
                    // Shield bar's right edge aligns with HP fill end, extends leftward
                    const shieldLeftPercent = Math.max(0, hpPercent - shieldPercent);
                    const shieldWidthPercent = shieldPercent;
                    hpBarShield.style.left = `${shieldLeftPercent}%`;
                    hpBarShield.style.width = `${shieldWidthPercent}%`;
                    hpBarShield.style.display = 'block';
                    hpBarShield.style.opacity = '1';
                } else {
                    hpBarShield.style.width = '0%';
                    hpBarShield.style.left = '0%';
                    hpBarShield.style.display = 'none';
                }
            }

            // Update Tremor - Execution threshold markers
            this.updateTremorExecutionThresholdMarkers();
            
            // Check for Tremor - Execution threshold execution
            if (typeof this.checkTremorExecutionThreshold === 'function') this.checkTremorExecutionThreshold();

            const hpPercentEl = document.getElementById('hpPercent');
            const spPercentEl = document.getElementById('spPercent');
            if (hpPercentEl) {
                const hpPct = fortitude > 0 ? Math.round((currentHpVal / fortitude) * 100) : 0;
                const shieldVal = Math.max(0, Number(this.encounterState?.tempShieldHp) || 0);
                let text = shieldVal > 0 ? `(${hpPct}%) [${shieldVal}]` : `(${hpPct}%)`;
                hpPercentEl.textContent = text;
            }
            if (spPercentEl) {
                const spPct = prudence > 0 ? Math.round((currentSpVal / prudence) * 100) : 0;
                spPercentEl.textContent = `(${spPct}%)`;
            }

			// HP threshold warnings (90% / 70% / 50%) with auto-reset when healed above thresholds
			try {
				if (!this.encounterState) this.encounterState = {};
				const hpPctForWarn = fortitude > 0 ? Math.round((currentHpVal / fortitude) * 100) : 0;

				// 90% threshold
				if (hpPctForWarn <= 90) {
					if (this.encounterState.hpWarn90Issued !== true) {
						this.showNotification('First Warning - [Condition] Max HP must be under 90%', 'warning');
						this.encounterState.hpWarn90Issued = true;
					}
				} else if (this.encounterState.hpWarn90Issued === true) {
					this.encounterState.hpWarn90Issued = false;
				}

				// 70% threshold
				if (hpPctForWarn <= 70) {
					if (this.encounterState.hpWarn70Issued !== true) {
						this.showNotification('Second Warning - [Condition] Max HP must be under 70%', 'warning');
						this.encounterState.hpWarn70Issued = true;
					}
				} else if (this.encounterState.hpWarn70Issued === true) {
					this.encounterState.hpWarn70Issued = false;
				}

				// 50% threshold
				if (hpPctForWarn <= 50) {
					if (this.encounterState.hpWarn50Issued !== true) {
						this.showNotification('Final Warning - [Condition] Max HP must be under 50%', 'warning');
						this.encounterState.hpWarn50Issued = true;
					}
				} else if (this.encounterState.hpWarn50Issued === true) {
					this.encounterState.hpWarn50Issued = false;
				}
			} catch (e) { /* non-fatal */ }
            // Latch Staggered state for this scene when SP reaches 0
            try {
                if (this.encounterState) {
                    if (currentSpVal === 0 && this.encounterState.staggeredThisScene !== true) {
                        this.encounterState.staggeredThisScene = true;
                        if (typeof this.updateSwapButtonAppearance === 'function') this.updateSwapButtonAppearance();
                        // Stagger: cannot act this scene, but no longer takes double HP damage
                        this.showNotification('Staggered: You cannot act this scene.', 'warning');
                        try {
                            const staggerAudio = new Audio('Other Stuff/stagger-limbus-company.mp3');
                            staggerAudio.play().catch(e => console.warn('Could not play stagger audio:', e));
                        } catch (e) { /* non-fatal */ }
                        
                        // Tremor: On getting staggered, take fixed HP damage equal to Tremor Potency, then clear the status
                        try {
                            const tremorPot = Math.max(0, Number(this.encounterState?.tremorPotency) || 0);
                            if (tremorPot > 0) {
                                if (typeof this.applyHpDamage === 'function') {
                                    this.applyHpDamage(tremorPot, 'Tremor');
                                    // Clear Tremor after triggering
                                    this.encounterState.tremorPotency = 0;
                                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                                    if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                                }
                            }
                        } catch (e) { /* non-fatal */ }
                        
                    }
                }
                // Show or hide stagger overlay based on staggered state
                const staggerOverlay = document.getElementById('staggerOverlay');
                if (staggerOverlay) {
                    const isStaggered = this.encounterState && this.encounterState.staggeredThisScene === true;
                    staggerOverlay.style.display = isStaggered ? 'block' : 'none';
                }
            } catch (e) { /* non-fatal */ }
        }

        // Initialize all event listeners
        initializeEventListeners() {
            // Action buttons
            document.getElementById('save').addEventListener('click', () => this.saveCharacter());
            document.getElementById('load').addEventListener('click', () => this.loadCharacter());
            document.getElementById('delete').addEventListener('click', () => this.deleteCharacter());
            document.getElementById('update').addEventListener('click', () => this.updateCharacter());
            
            // Input fields for auto-save
            document.getElementById('name').addEventListener('input', () => this.autoSave());
            document.getElementById('grade').addEventListener('input', () => this.autoSave());
            document.getElementById('temperance').addEventListener('input', () => this.autoSave());

            // Update MAX LIGHT when grade changes
            document.getElementById('grade').addEventListener('input', () => this.updateMaxLight());
            document.getElementById('grade').addEventListener('change', () => this.updateMaxLight());
            
            // Update temperance-based stats when temperance changes
            document.getElementById('temperance').addEventListener('input', () => this.updateTemperanceStats());
            document.getElementById('temperance').addEventListener('change', () => this.updateTemperanceStats());
            
            // Bullet count input sync with encounter state
            document.getElementById('bulletCount').addEventListener('input', (e) => {
                const bullets = parseInt(e.target.value) || 0;
                if (this.encounterState) {
                    this.encounterState.bulletsRemaining = Math.max(0, bullets);
                }
                this.updateBulletStatusDisplay();
                this.autoSave && this.autoSave();
            });
            document.getElementById('bulletCount').addEventListener('change', (e) => {
                const bullets = parseInt(e.target.value) || 0;
                if (this.encounterState) {
                    this.encounterState.bulletsRemaining = Math.max(0, bullets);
                }
                this.updateBulletStatusDisplay();
                this.autoSave && this.autoSave();
            });

            // Update HP/SP when Fortitude or Prudence changes
            document.getElementById('fortitude').addEventListener('input', () => { this.updateHpSpFromStats(); this.autoSave(); });
            document.getElementById('fortitude').addEventListener('change', () => this.updateHpSpFromStats());
            document.getElementById('prudence').addEventListener('input', () => { this.updateHpSpFromStats(); this.autoSave(); });
            document.getElementById('prudence').addEventListener('change', () => this.updateHpSpFromStats());
            const currentHpInput = document.getElementById('currentHp');
            if (currentHpInput) {
                currentHpInput.addEventListener('input', () => { this.updateHpSpFromStats(); this.autoSave(); });
                currentHpInput.addEventListener('change', () => this.updateHpSpFromStats());
            }
            const currentSpInput = document.getElementById('currentSp');
            if (currentSpInput) {
                currentSpInput.addEventListener('input', () => { this.updateHpSpFromStats(); this.autoSave(); });
                currentSpInput.addEventListener('change', () => this.updateHpSpFromStats());
            }
            // HP Damage apply button and Enter key support
            const hpDmgInput = document.getElementById('hpDamageInput');
            const hpDmgBtn = document.getElementById('applyHpDamageBtn');
            const dmgTargetSel = document.getElementById('dmgTarget');
            const dmgModeSel = document.getElementById('dmgMode');
            if (hpDmgBtn && hpDmgInput) {
                hpDmgBtn.addEventListener('click', () => {
                    // Read raw value so it can be interpreted either as flat or percentage
                    const rawVal = parseFloat(hpDmgInput.value);
                    if (!Number.isFinite(rawVal) || rawVal <= 0) return;

                    const target = (dmgTargetSel && (dmgTargetSel.value === 'sp')) ? 'sp' : 'hp';
                    const mode = (dmgModeSel && dmgModeSel.value === 'percent') ? 'percent' : 'flat';

                    let dmgVal = 0;
                    if (mode === 'percent') {
                        // Percentage-based damage: nearest integer of % of MAX HP/SP
                        if (target === 'hp') {
                            const maxHpEl = document.getElementById('maxHp');
                            const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                            if (!Number.isFinite(maxHp) || maxHp <= 0) return;
                            dmgVal = Math.round(maxHp * (rawVal / 100));
                        } else {
                            const maxSpEl = document.getElementById('maxSp');
                            const maxSp = maxSpEl ? parseInt(maxSpEl.textContent, 10) : NaN;
                            if (!Number.isFinite(maxSp) || maxSp <= 0) return;
                            dmgVal = Math.round(maxSp * (rawVal / 100));
                        }
                    } else {
                        // Flat damage, rounded to nearest integer
                        dmgVal = Math.round(rawVal);
                    }

                    if (!Number.isFinite(dmgVal) || dmgVal <= 0) return;

                    if (target === 'hp') {
                        // Apply HP damage 
                        if (typeof this.applyHpDamage === 'function') {
                            this.applyHpDamage(dmgVal, 'Manual Damage');
                        } else {
                            const curHpEl = document.getElementById('currentHp');
                            const curHp = curHpEl ? parseInt(curHpEl.value, 10) : 0;
                            const newHp = Math.max(0, curHp - dmgVal);
                            curHpEl.value = newHp;
                        }
                    } else {
                        const curSpEl = document.getElementById('currentSp');
                        const curSp = curSpEl ? parseInt(curSpEl.value, 10) : 0;
                        const newSp = Math.max(0, curSp - dmgVal);
                        curSpEl.value = newSp;
                    }

                    this.updateHpSpFromStats();
                    this.autoSave?.();
                    hpDmgInput.value = '';
                });
                hpDmgInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        hpDmgBtn.click();
                    }
                });
            }
            
            // Add event listeners for encounter and scene buttons
            document.querySelector('.encounter-btn').addEventListener('click', (event) => this.rollSpeedDice(event));
            document.querySelector('.scene-btn').addEventListener('click', (event) => this.rollSpeedDice(event));
            document.querySelector('.end-encounter-btn').addEventListener('click', () => this.endEncounter());
            
            // Add event listener for swap button
            document.querySelector('.swap-btn').addEventListener('click', () => {
                if (this.encounterState && this.encounterState.staggeredThisScene === true) {
                    this.showNotification('Staggered: You cannot act this scene.', 'warning');
                    return;
                }
                this.toggleHandMode();
            });
            
            // Add event listener for combat phase button
            document.getElementById('combatPhaseBtn').addEventListener('click', () => this.handleCombatPhaseButton());

            // Emotion modifier buttons
            const plusBtn = document.getElementById('emotionPlusBtn');
            const minusBtn = document.getElementById('emotionMinusBtn');
            if (plusBtn) plusBtn.addEventListener('click', () => { this.addEmotionTyped('positive'); });
            if (minusBtn) minusBtn.addEventListener('click', () => { this.addEmotionTyped('negative'); });

            // Utility buttons
            const addLightBtn = document.getElementById('addLightBtn');
            if (addLightBtn) addLightBtn.addEventListener('click', () => this.addLightManually(1));
            const healBtn = document.getElementById('applyHpHealBtn');
            const healModeSel = document.getElementById('healMode');
            if (healBtn) healBtn.addEventListener('click', () => {
                try {
                    const target = (document.getElementById('healTarget')?.value || 'hp').toLowerCase();
                    const rawVal = parseFloat(document.getElementById('hpHealInput')?.value || '0');
                    const mode = (healModeSel && healModeSel.value === 'percent') ? 'percent' : 'flat';

                    let amt = 0;
                    if (Number.isFinite(rawVal) && rawVal > 0) {
                        if (mode === 'percent') {
                            // Percentage-based healing: nearest integer of % of MAX HP/SP
                            if (target === 'hp') {
                                const maxHpEl = document.getElementById('maxHp');
                                const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                                if (!Number.isFinite(maxHp) || maxHp <= 0) return;
                                amt = Math.round(maxHp * (rawVal / 100));
                            } else {
                                const maxSpEl = document.getElementById('maxSp');
                                const maxSp = maxSpEl ? parseInt(maxSpEl.textContent, 10) : NaN;
                                if (!Number.isFinite(maxSp) || maxSp <= 0) return;
                                amt = Math.round(maxSp * (rawVal / 100));
                            }
                        } else {
                            // Flat heal, rounded to nearest integer
                            amt = Math.round(rawVal);
                        }
                    }

                    if (amt <= 0) return;
                    if (target === 'hp') {
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp)) {
                            const newHp = Math.min(maxHp, curHp + amt);
                            curHpEl.value = newHp;
                            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                            this.showNotification(`Healed ${newHp - curHp} HP.`, 'success');
                        }
                    } else {
                        const curSpEl = document.getElementById('currentSp');
                        const maxSpEl = document.getElementById('maxSp');
                        const curSp = curSpEl ? parseInt(curSpEl.value, 10) : NaN;
                        const maxSp = maxSpEl ? parseInt(maxSpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curSp) && Number.isFinite(maxSp)) {
                            const newSp = Math.min(maxSp, curSp + amt);
                            curSpEl.value = newSp;
                            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                            this.showNotification(`Recovered ${newSp - curSp} SP.`, 'success');
                        }
                    }
                } catch (e) { /* non-fatal */ }
            });
            const drawPageBtn = document.getElementById('drawPageBtn');
            if (drawPageBtn) drawPageBtn.addEventListener('click', () => this.drawOnePageNow());
            const discardRandomBtn = document.getElementById('discardRandomBtn');
            if (discardRandomBtn) discardRandomBtn.addEventListener('click', () => this.discardRandomPageFromHand());
            const discardAllBtn = document.getElementById('discardAllBtn');
            if (discardAllBtn) discardAllBtn.addEventListener('click', () => this.discardAllPagesFromHand());
            const discardPageManuallyBtn = document.getElementById('discardPageManuallyBtn');
            if (discardPageManuallyBtn) discardPageManuallyBtn.addEventListener('click', () => this.discardPageManually());
            const addPageManuallyBtn = document.getElementById('addPageManuallyBtn');
            if (addPageManuallyBtn) addPageManuallyBtn.addEventListener('click', () => this.openManualAddPageModal());
            const addStatusEffectBtn = document.getElementById('addStatusEffectBtn');
            if (addStatusEffectBtn) addStatusEffectBtn.addEventListener('click', () => this.openStatusEffectDebugModal());
            const addDebuffEffectBtn = document.getElementById('addDebuffEffectBtn');
            if (addDebuffEffectBtn) addDebuffEffectBtn.addEventListener('click', () => this.openDebuffDebugModal());
            
            // Owned Pages menu button
            const ownedPagesMenuBtn = document.getElementById('ownedPagesMenuBtn');
            if (ownedPagesMenuBtn) ownedPagesMenuBtn.addEventListener('click', () => this.toggleOwnedPagesPopup());
            
            // Save buttons
            const saveDeckBtn = document.getElementById('saveDeckBtn');
            if (saveDeckBtn) saveDeckBtn.addEventListener('click', () => this.saveDeck());
            const viewSavedDecksBtn = document.getElementById('viewSavedDecksBtn');
            if (viewSavedDecksBtn) viewSavedDecksBtn.addEventListener('click', () => this.viewSavedDecks());
            
            // Add Passive button
            const addPassiveBtn = document.getElementById('addPassiveBtn');
            if (addPassiveBtn) addPassiveBtn.addEventListener('click', () => this.openAddPassiveModal());
            
            // Speed Settings button / dropdown (no modal)
            const speedSettingsBtn = document.getElementById('speedSettingsBtn');
            if (speedSettingsBtn) {
                speedSettingsBtn.addEventListener('click', () => {
                    const section = speedSettingsBtn.closest('.speed-settings-section');
                    if (section) {
                        section.classList.toggle('open');
                    }
                });
            }
            
            // Inline speed inputs: update stats when edited
            const minSpeedInput = document.getElementById('minSpeed');
            const maxSpeedInput = document.getElementById('maxSpeed');
            const speedDiceInput = document.getElementById('speedDice');
            const onSpeedChange = () => {
                this.updateJusticeSpeedStats();
                if (typeof this.autoSave === 'function') {
                    this.autoSave();
                }
            };
            if (minSpeedInput) {
                minSpeedInput.addEventListener('input', onSpeedChange);
                minSpeedInput.addEventListener('change', onSpeedChange);
            }
            if (maxSpeedInput) {
                maxSpeedInput.addEventListener('input', onSpeedChange);
                maxSpeedInput.addEventListener('change', onSpeedChange);
            }
            if (speedDiceInput) {
                speedDiceInput.addEventListener('input', onSpeedChange);
                speedDiceInput.addEventListener('change', onSpeedChange);
            }
        }

        // Save current character data
        saveCharacter() {
            const characterData = this.getCharacterData();
                // Persist latest bullets from encounter/UI
                try {
                    const bulletInput = document.getElementById('bulletCount');
                    const bulletsUi = bulletInput ? parseInt(bulletInput.value) || 0 : 0;
                    const bulletsState = Number(this.encounterState?.bulletsRemaining) || 0;
                    characterData.bullets = Math.max(bulletsUi, bulletsState);
                } catch (e) { /* non-fatal */ }
            
            if (!characterData.name.trim()) {
                this.showNotification('Please enter a character name', 'error');
                return;
            }

            // Check if character already exists
            const existingIndex = this.characters.findIndex(char => char.name === characterData.name);
            
            if (existingIndex !== -1) {
                // Update existing character
                this.characters[existingIndex] = characterData;
                this.showNotification(`Character "${characterData.name}" updated successfully!`, 'success');
            } else {
                // Add new character
                this.characters.push(characterData);
                this.showNotification(`Character "${characterData.name}" saved successfully!`, 'success');
            }

            this.saveCharactersToStorage();
            this.currentCharacter = characterData;
            this.updateCharacterList();
        }

        // Load character data
        loadCharacter() {
            if (this.characters.length === 0) {
                this.showNotification('No saved characters found', 'error');
                return;
            }

            // Create character selection modal
            this.showCharacterSelectionModal();
        }

        // Delete current character
        deleteCharacter() {
            if (!this.currentCharacter) {
                this.showNotification('No character selected to delete', 'error');
                return;
            }

            if (confirm(`Are you sure you want to delete "${this.currentCharacter.name}"?`)) {
                const index = this.characters.findIndex(char => char.name === this.currentCharacter.name);
                if (index !== -1) {
                    this.characters.splice(index, 1);
                    this.saveCharactersToStorage();
                    this.clearForm();
                    this.currentCharacter = null;
                    this.showNotification(`Character "${this.currentCharacter.name}" deleted successfully!`, 'success');
                    this.updateCharacterList();
                }
            }
        }

        // Update character data
        updateCharacter() {
            if (!this.currentCharacter) {
                this.showNotification('No character selected to update', 'error');
                return;
            }

            const characterData = this.getCharacterData();
                // Persist latest bullets before saving
                try {
                    const bulletInput = document.getElementById('bulletCount');
                    const bulletsUi = bulletInput ? parseInt(bulletInput.value) || 0 : 0;
                    const bulletsState = Number(this.encounterState?.bulletsRemaining) || 0;
                    characterData.bullets = Math.max(bulletsUi, bulletsState);
                } catch (e) { /* non-fatal */ }
            
            if (!characterData.name.trim()) {
                this.showNotification('Please enter a character name', 'error');
                return;
            }

            // Ensure Thumb Ammunition are not persisted in ownedPages
            this.cleanupThumbAmmoPages();

            // Update character data
            const index = this.characters.findIndex(char => char.name === this.currentCharacter.name);
            if (index !== -1) {
                this.characters[index] = characterData;
                this.saveCharactersToStorage();
                this.currentCharacter = characterData;
                this.showNotification(`Character "${characterData.name}" updated successfully!`, 'success');
                
                // Sync combat list to update faction-based page visibility
                if (window.pageManager && typeof window.pageManager.syncCombatListWithInventory === 'function') {
                    window.pageManager.syncCombatListWithInventory();
                }
            }
        }

        // Get current form data
        getCharacterData() {
            // Derive current speed settings from inline inputs (or from display as fallback)
            const minSpeedInput = document.getElementById('minSpeed');
            const maxSpeedInput = document.getElementById('maxSpeed');
            const speedDiceInput = document.getElementById('speedDice');
            const speedRangeElement = document.getElementById('speedRangeValue');
            const speedDiceElement = document.getElementById('speedDiceValue');
            
            let speedMin = 1;
            let speedMax = 3;
            let speedDice = 1;
            
            if (minSpeedInput && maxSpeedInput && speedDiceInput) {
                speedMin = parseInt(minSpeedInput.value) || 1;
                speedMax = parseInt(maxSpeedInput.value) || 3;
                speedDice = parseInt(speedDiceInput.value) || 1;
            } else if (speedRangeElement && speedDiceElement) {
                const rangeText = speedRangeElement.textContent || '1-3';
                const parts = rangeText.split('-');
                if (parts.length === 2) {
                    const min = parseInt(parts[0].trim());
                    const max = parseInt(parts[1].trim());
                    if (!Number.isNaN(min)) speedMin = min;
                    if (!Number.isNaN(max)) speedMax = max;
                }
                const diceVal = parseInt(speedDiceElement.textContent);
                if (!Number.isNaN(diceVal)) speedDice = diceVal;
            }
            
            return {
                name: document.getElementById('name').value,
                factions: document.getElementById('factions').value,
                grade: parseInt(document.getElementById('grade').value) || 0,
                fortitude: parseInt(document.getElementById('fortitude').value) || 0,
                prudence: parseInt(document.getElementById('prudence').value) || 0,
                temperance: document.getElementById('temperance').value || 'I',
                // Persist speed settings per character
                speedMin,
                speedMax,
                speedDice,
                passives: this.getPassivesArray(),
                ownedPages: this.getOwnedPagesFromInventory(),
                bullets: Number(this.encounterState?.bulletsRemaining || document.getElementById('bulletCount')?.value || 0) || 0,
                timestamp: new Date().toISOString()
            };
        }

        // Load character into form
        loadCharacterIntoForm(character) {
            document.getElementById('name').value = character.name;
            document.getElementById('factions').value = character.factions || '';
            document.getElementById('grade').value = character.grade;
            if (typeof character.fortitude === 'number') {
                document.getElementById('fortitude').value = character.fortitude;
            }
            if (typeof character.prudence === 'number') {
                document.getElementById('prudence').value = character.prudence;
            }
            document.getElementById('temperance').value = character.temperance;
            
            // Restore saved speed settings (or defaults for legacy characters)
            try {
                const minSpeedInput = document.getElementById('minSpeed');
                const maxSpeedInput = document.getElementById('maxSpeed');
                const speedDiceInput = document.getElementById('speedDice');
                const savedMin = Number.isFinite(character.speedMin) ? character.speedMin : 1;
                const savedMax = Number.isFinite(character.speedMax) ? character.speedMax : 3;
                const savedDice = Number.isFinite(character.speedDice) ? character.speedDice : 1;
                if (minSpeedInput) minSpeedInput.value = savedMin;
                if (maxSpeedInput) maxSpeedInput.value = savedMax;
                if (speedDiceInput) speedDiceInput.value = savedDice;
            } catch (e) { /* non-fatal */ }
            
            // Load passives as array
            let passivesArray = [];
            if (Array.isArray(character.passives)) {
                passivesArray = character.passives;
            } else if (typeof character.passives === 'string' && character.passives.trim()) {
                // Legacy support: convert comma-separated string to array
                passivesArray = character.passives.split(',').map(p => p.trim()).filter(p => p);
            }
            this.setPassivesArray(passivesArray);
            this.renderPassives();
            
            this.currentCharacter = character;
            // Clear any existing encounter state when loading a character (encounters don't persist)
            this.encounterState = null;
            // Restore bullets
            try {
                const bulletInput = document.getElementById('bulletCount');
                if (bulletInput) bulletInput.value = Number(character.bullets || 0);
                // Don't create encounterState just for bullets - bullets persist in character data
                if (typeof this.updateBulletStatusDisplay === 'function') this.updateBulletStatusDisplay();
            } catch (e) { /* non-fatal */ }
            
            // Enemy Only pages are now allowed; no cleanup needed
			// Clean up Trigram pages from loaded character
			this.cleanupTrigramPages();
            
            this.showNotification(`Character "${character.name}" loaded successfully!`, 'success');
            // Render Owned Pages inventory if available
            if (Array.isArray(character.ownedPages)) {
                // Ensure Thumb Ammunition are removed from saved ownership
                this.cleanupThumbAmmoPages();
                this.renderOwnedPages(character.ownedPages);
            } else {
                // If no owned pages saved, clear inventory display
                this.renderOwnedPages([]);
            }
            
            // Ensure combat list is properly synced after character is fully loaded
            // This fixes the bug where you had to open ownedPages popup for pages to work
            if (window.pageManager && typeof window.pageManager.syncCombatListWithInventory === 'function') {
                window.pageManager.syncCombatListWithInventory();
            }
            
            this.updateMaxLight();
            this.updateTemperanceStats();
            this.updateJusticeSpeedStats();
            this.updateHpSpFromStats();
        }

        // Clear form
        clearForm() {
            document.getElementById('name').value = '';
            document.getElementById('factions').value = '';
            document.getElementById('grade').value = '';
            document.getElementById('fortitude').value = '';
            document.getElementById('prudence').value = '';
            document.getElementById('temperance').value = 'I';
            // Reset speed settings to defaults
            try {
                const minSpeedInput = document.getElementById('minSpeed');
                const maxSpeedInput = document.getElementById('maxSpeed');
                const speedDiceInput = document.getElementById('speedDice');
                if (minSpeedInput) minSpeedInput.value = 1;
                if (maxSpeedInput) maxSpeedInput.value = 3;
                if (speedDiceInput) speedDiceInput.value = 1;
            } catch (e) { /* non-fatal */ }
            this.setPassivesArray([]);
            this.renderPassives();
            this.currentCharacter = null;
            this.updateMaxLight();
            this.updateTemperanceStats();
            this.updateJusticeSpeedStats();
            this.updateHpSpFromStats();
            this.renderOwnedPages([]);
        }

        // Auto-save functionality
        autoSave() {
            if (this.currentCharacter) {
                // Debounce auto-save to avoid excessive saves
                clearTimeout(this.autoSaveTimeout);
                this.autoSaveTimeout = setTimeout(() => {
                    this.updateCharacter();
                }, 1000);
            }
        }

        // Show character selection modal
        showCharacterSelectionModal() {
            const modal = document.createElement('div');
            modal.className = 'character-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Select Character to Load</h3>
                    <div class="character-list">
                        ${this.characters.map(char => `
                            <div class="character-item" data-name="${char.name}">
                                <span class="char-name">${char.name}</span>
                                <span class="char-stats">G:${char.grade} T:${char.temperance}</span>
                                <span class="char-date">${new Date(char.timestamp).toLocaleDateString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="modal-buttons">
                        <button class="modal-btn cancel-btn">Cancel</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Add event listeners
            modal.querySelector('.cancel-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            modal.querySelectorAll('.character-item').forEach(item => {
                item.addEventListener('click', () => {
                    const charName = item.dataset.name;
                    const character = this.characters.find(char => char.name === charName);
                    if (character) {
                        this.loadCharacterIntoForm(character);
                        // Ensure inventory reflects saved owned pages
                        if (Array.isArray(character.ownedPages)) {
                            this.renderOwnedPages(character.ownedPages);
                        }
                        // Additional sync to ensure combat list is updated
                        if (window.pageManager && typeof window.pageManager.syncCombatListWithInventory === 'function') {
                            window.pageManager.syncCombatListWithInventory();
                        }
                    }
                    document.body.removeChild(modal);
                });
            });
        }

        // Predefined list of passives with IDs
        getPassiveOptions() {
            return [
                { id: 'p1', name: 'Bottom Deal', description: 'Your pages will now be drawn in an ascending order of Light usage, with the final card now only uses 0 Light instead of whatever it was.' },
            ];
        }

        // Open Add Passive modal
        openAddPassiveModal() {
            const modal = document.getElementById('addPassiveModal');
            const searchInput = document.getElementById('passiveSearchInput');
            const listDisplay = document.getElementById('passiveListDisplay');
            const confirmBtn = document.getElementById('addPassiveConfirm');
            const cancelBtn = document.getElementById('addPassiveCancel');
            const closeBtn = modal.querySelector('.close-popup');

            if (!modal || !searchInput || !listDisplay || !confirmBtn || !cancelBtn) {
                console.error('Add Passive modal elements not found');
                return;
            }

            // Populate passive list
            this.populatePassiveList(listDisplay);
            
            // Clear search and show modal
            searchInput.value = '';
            modal.classList.add('show');
            searchInput.focus();

            let selectedPassiveId = null;

            const cleanup = () => {
                modal.classList.remove('show');
                confirmBtn.removeEventListener('click', handleConfirm);
                cancelBtn.removeEventListener('click', handleCancel);
                if (closeBtn) closeBtn.removeEventListener('click', handleCancel);
                modal.removeEventListener('click', handleBackgroundClick);
                document.removeEventListener('keydown', handleKeydown);
                searchInput.removeEventListener('input', handleSearch);
                selectedPassiveId = null;
            };

            const handleConfirm = () => {
                if (selectedPassiveId) {
                    const passives = this.getPassiveOptions();
                    const selectedPassive = passives.find(p => p.id === selectedPassiveId);
                    if (selectedPassive) {
                        this.addPassive(selectedPassive.name);
                    }
                }
                cleanup();
            };

            const handleCancel = () => {
                cleanup();
            };

            const handleBackgroundClick = (e) => {
                if (e.target === modal) {
                    handleCancel();
                }
            };

            const handleKeydown = (e) => {
                if (e.key === 'Escape') {
                    handleCancel();
                }
            };

            const handleSearch = (e) => {
                const query = (e.target.value || '').trim().toLowerCase();
                const items = listDisplay.querySelectorAll('.list-item');
                
                items.forEach(item => {
                    const passiveText = (item.textContent || '').toLowerCase();
                    item.style.display = passiveText.includes(query) ? '' : 'none';
                });
            };

            // Add click handlers to passive items
            listDisplay.querySelectorAll('.list-item').forEach(item => {
                item.addEventListener('click', () => {
                    // Don't allow selection of owned passives
                    if (item.classList.contains('owned')) {
                        return;
                    }
                    // Remove previous selection
                    listDisplay.querySelectorAll('.list-item').forEach(i => {
                        i.classList.remove('selected');
                        i.style.backgroundColor = '';
                    });
                    // Add selection to clicked item
                    item.classList.add('selected');
                    item.style.backgroundColor = '#444';
                    selectedPassiveId = item.getAttribute('data-passive-id');
                });
            });

            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
            if (closeBtn) closeBtn.addEventListener('click', handleCancel);
            modal.addEventListener('click', handleBackgroundClick);
            document.addEventListener('keydown', handleKeydown);
            searchInput.addEventListener('input', handleSearch);
        }

        // Populate passive list in modal
        populatePassiveList(listDisplay) {
            const passives = this.getPassiveOptions();
            const currentPassives = this.getPassivesArray();
            
            listDisplay.innerHTML = passives.map(passive => {
                const isOwned = currentPassives.includes(passive.name);
                const ownedClass = isOwned ? ' owned' : '';
                const description = passive.description || '';
                return `<div class="list-item passive-option${ownedClass}" data-passive-id="${passive.id}" data-description="${this.escapeHtml(description)}">${this.escapeHtml(passive.name)}${isOwned ? ' (owned)' : ''}</div>`;
            }).join('');
            
            // Add hover handlers for tooltips
            listDisplay.querySelectorAll('.passive-option').forEach(item => {
                item.addEventListener('mouseenter', (e) => {
                    const description = item.getAttribute('data-description');
                    if (description) {
                        this.showPassiveTooltip(e, item, description);
                    }
                });
                item.addEventListener('mouseleave', () => {
                    this.hidePassiveTooltip();
                });
                item.addEventListener('mousemove', (e) => {
                    const description = item.getAttribute('data-description');
                    if (description) {
                        this.updatePassiveTooltipPosition(e);
                    }
                });
            });
        }

        // Show passive tooltip
        showPassiveTooltip(event, element, description) {
            const tooltip = document.getElementById('passiveTooltip');
            if (!tooltip) return;
            
            const passiveName = element.textContent.replace(' (owned)', '').trim();
            tooltip.innerHTML = `<div class="passive-tooltip-title">${this.escapeHtml(passiveName)}</div><div class="passive-tooltip-description">${description}</div>`;
            tooltip.style.display = 'block';
            this.updatePassiveTooltipPosition(event);
        }

        // Update passive tooltip position
        updatePassiveTooltipPosition(event) {
            const tooltip = document.getElementById('passiveTooltip');
            if (!tooltip) return;
            
            const offset = 15;
            tooltip.style.left = (event.clientX + offset) + 'px';
            tooltip.style.top = (event.clientY + offset) + 'px';
        }

        // Hide passive tooltip
        hidePassiveTooltip() {
            const tooltip = document.getElementById('passiveTooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        }

        // Get passives as array
        getPassivesArray() {
            return this.passivesArray || [];
        }

        // Check if character has a specific passive
        hasPassive(passiveName) {
            const passives = this.getPassivesArray();
            return passives.includes(passiveName);
        }

        // Helper: Determine the last card in sorted normal hand for Bottom Deal (called once per scene)
        updateBottomDealFinalCard() {
            if (!this.hasPassive('Bottom Deal')) {
                if (this.encounterState) {
                    this.encounterState.bottomDealFinalCardId = null;
                    this.encounterState.bottomDealFinalCardHandIndex = null;
                }
                return;
            }
            
            const handNormal = Array.isArray(this.encounterState?.handNormal) ? this.encounterState.handNormal : [];
            
            // Build array with handIndex to track specific instances
            const visibleNormalPagesWithIndex = [];
            handNormal.forEach((pid, handIndex) => {
                const p = window.pageManager?.pages?.[pid];
                if (!p) return;
                const isSpecial = (typeof p.range === 'string' && p.range.includes('Special') && !p.range.includes('Single Use')) ||
                    p.range === 'Mass - Summation' ||
                    p.range === 'Mass - Individual';
                if (!isSpecial) {
                    visibleNormalPagesWithIndex.push({ pageId: pid, handIndex: handIndex });
                }
            });
            
            // Sort by light usage (ascending), then by name (same as display)
            visibleNormalPagesWithIndex.sort((a, b) => {
                const pageA = window.pageManager?.pages?.[a.pageId];
                const pageB = window.pageManager?.pages?.[b.pageId];
                const lightA = typeof pageA?.lightUsage === 'number' ? pageA.lightUsage : parseInt(pageA?.lightUsage ?? 0) || 0;
                const lightB = typeof pageB?.lightUsage === 'number' ? pageB.lightUsage : parseInt(pageB?.lightUsage ?? 0) || 0;
                if (lightA !== lightB) return lightA - lightB;
                const nameA = pageA?.name || '';
                const nameB = pageB?.name || '';
                return nameA.localeCompare(nameB);
            });
            
            // Store the last card's pageId and handIndex (determined once per scene)
            if (!this.encounterState) this.encounterState = {};
            if (visibleNormalPagesWithIndex.length > 0) {
                const finalCard = visibleNormalPagesWithIndex[visibleNormalPagesWithIndex.length - 1];
                this.encounterState.bottomDealFinalCardId = finalCard.pageId;
                this.encounterState.bottomDealFinalCardHandIndex = finalCard.handIndex;
            } else {
                this.encounterState.bottomDealFinalCardId = null;
                this.encounterState.bottomDealFinalCardHandIndex = null;
            }
        }

        // Get effective light usage for a page (accounts for Bottom Deal)
        getEffectiveLightUsage(pageId, handIndex = null, handType = null) {
            if (!pageId) return 0;
            const page = window.pageManager?.pages?.[pageId];
            if (!page) return 0;
            
            const baseLightUsage = typeof page.lightUsage === 'number' ? page.lightUsage : parseInt(page?.lightUsage ?? 0) || 0;
            
            // Bottom Deal: Last card in normal hand (excluding special pages) uses 0 light
            // Check against stored final card ID and handIndex (determined once per scene)
            if (this.hasPassive('Bottom Deal') && handType === 'normal' && handIndex !== null) {
                const finalCardId = this.encounterState?.bottomDealFinalCardId;
                const finalCardHandIndex = this.encounterState?.bottomDealFinalCardHandIndex;
                if (finalCardId && finalCardId === pageId && finalCardHandIndex !== null && finalCardHandIndex === handIndex) {
                    return 0;
                }
            }
            
            return baseLightUsage;
        }

        // Set passives array
        setPassivesArray(passives) {
            this.passivesArray = Array.isArray(passives) ? [...passives] : [];
        }

        // Render passives list
        renderPassives() {
            const listDisplay = document.getElementById('passivesListDisplay');
            if (!listDisplay) return;

            const passives = this.getPassivesArray();
            const passiveOptions = this.getPassiveOptions();
            
            if (passives.length === 0) {
                listDisplay.innerHTML = '<div style="padding: 8px; color: #888; text-align: center;"></div>';
                return;
            }

            listDisplay.innerHTML = passives.map((passive, index) => {
                // Find the passive in options to get description
                const passiveOption = passiveOptions.find(p => p.name === passive);
                const description = passiveOption ? (passiveOption.description || '') : '';
                return `<div class="list-item passive-item" data-passive-index="${index}" data-description="${this.escapeHtml(description)}">${this.escapeHtml(passive)}</div>`;
            }).join('');

            // Add click handlers to remove passives
            listDisplay.querySelectorAll('.passive-item').forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.getAttribute('data-passive-index'));
                    this.removePassive(index);
                });
            });

            // Add hover handlers for tooltips
            listDisplay.querySelectorAll('.passive-item').forEach(item => {
                item.addEventListener('mouseenter', (e) => {
                    const description = item.getAttribute('data-description');
                    if (description) {
                        this.showPassiveTooltip(e, item, description);
                    }
                });
                item.addEventListener('mouseleave', () => {
                    this.hidePassiveTooltip();
                });
                item.addEventListener('mousemove', (e) => {
                    const description = item.getAttribute('data-description');
                    if (description) {
                        this.updatePassiveTooltipPosition(e);
                    }
                });
            });
        }

        // Remove passive at index
        removePassive(index) {
            if (index >= 0 && index < this.passivesArray.length) {
                this.passivesArray.splice(index, 1);
                this.renderPassives();
                if (typeof this.autoSave === 'function') {
                    this.autoSave();
                }
            }
        }

        // Add passive
        addPassive(passiveText) {
            const trimmed = passiveText.trim();
            if (trimmed && !this.passivesArray.includes(trimmed)) {
                this.passivesArray.push(trimmed);
                this.renderPassives();
                if (typeof this.autoSave === 'function') {
                    this.autoSave();
                }
            }
        }

        // Escape HTML for safe display
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }


        // Update character list display
        updateCharacterList() {
            // This could be used to update a character list display if needed
            console.log('Characters updated:', this.characters);
        }

        // Save characters to localStorage
        saveCharactersToStorage() {
            try {
                localStorage.setItem('gameCharacters', JSON.stringify(this.characters));
            } catch (error) {
                console.error('Failed to save characters:', error);
                this.showNotification('Failed to save characters to storage', 'error');
            }
        }

        // Load characters from localStorage
        loadCharactersFromStorage() {
            try {
                const stored = localStorage.getItem('gameCharacters');
                return stored ? JSON.parse(stored) : [];
            } catch (error) {
                console.error('Failed to load characters:', error);
                return [];
            }
        }

        // Show notification
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }

        // Custom Modal Functions
        showCustomPrompt(title, message, placeholder = '', defaultValue = '') {
            return new Promise((resolve) => {
                const modal = document.getElementById('customPromptModal');
                const titleEl = document.getElementById('promptModalTitle');
                const messageEl = document.getElementById('promptModalMessage');
                const inputEl = document.getElementById('promptModalInput');
                const confirmBtn = document.getElementById('promptModalConfirm');
                const cancelBtn = document.getElementById('promptModalCancel');
                const closeBtn = modal.querySelector('.custom-modal-close');

                titleEl.textContent = title;
                messageEl.textContent = message;
                inputEl.placeholder = placeholder;
                inputEl.value = defaultValue;

                modal.classList.add('show');
                inputEl.focus();

                const cleanup = () => {
                    modal.classList.remove('show');
                    confirmBtn.removeEventListener('click', handleConfirm);
                    cancelBtn.removeEventListener('click', handleCancel);
                    closeBtn.removeEventListener('click', handleCancel);
                    modal.removeEventListener('click', handleBackgroundClick);
                    document.removeEventListener('keydown', handleKeydown);
                };

                const handleConfirm = () => {
                    const value = inputEl.value.trim();
                    cleanup();
                    resolve(value || null);
                };

                const handleCancel = () => {
                    cleanup();
                    resolve(null);
                };

                const handleBackgroundClick = (e) => {
                    if (e.target === modal) {
                        handleCancel();
                    }
                };

                const handleKeydown = (e) => {
                    if (e.key === 'Enter') {
                        handleConfirm();
                    } else if (e.key === 'Escape') {
                        handleCancel();
                    }
                };

                confirmBtn.addEventListener('click', handleConfirm);
                cancelBtn.addEventListener('click', handleCancel);
                closeBtn.addEventListener('click', handleCancel);
                modal.addEventListener('click', handleBackgroundClick);
                document.addEventListener('keydown', handleKeydown);
            });
        }

        showCustomConfirm(title, message) {
            return new Promise((resolve) => {
                const modal = document.getElementById('customConfirmModal');
                const titleEl = document.getElementById('confirmModalTitle');
                const messageEl = document.getElementById('confirmModalMessage');
                const yesBtn = document.getElementById('confirmModalYes');
                const noBtn = document.getElementById('confirmModalNo');
                const closeBtn = modal.querySelector('.custom-modal-close');

                titleEl.textContent = title;
                messageEl.textContent = message;

                modal.classList.add('show');

                const cleanup = () => {
                    modal.classList.remove('show');
                    yesBtn.removeEventListener('click', handleYes);
                    noBtn.removeEventListener('click', handleNo);
                    closeBtn.removeEventListener('click', handleNo);
                    modal.removeEventListener('click', handleBackgroundClick);
                    document.removeEventListener('keydown', handleKeydown);
                };

                const handleYes = () => {
                    cleanup();
                    resolve(true);
                };

                const handleNo = () => {
                    cleanup();
                    resolve(false);
                };

                const handleBackgroundClick = (e) => {
                    if (e.target === modal) {
                        handleNo();
                    }
                };

                const handleKeydown = (e) => {
                    if (e.key === 'Enter') {
                        handleYes();
                    } else if (e.key === 'Escape') {
                        handleNo();
                    }
                };

                yesBtn.addEventListener('click', handleYes);
                noBtn.addEventListener('click', handleNo);
                closeBtn.addEventListener('click', handleNo);
                modal.addEventListener('click', handleBackgroundClick);
                document.addEventListener('keydown', handleKeydown);
            });
        }

        showCustomAlert(title, message) {
            return new Promise((resolve) => {
                const modal = document.getElementById('customAlertModal');
                const titleEl = document.getElementById('alertModalTitle');
                const messageEl = document.getElementById('alertModalMessage');
                const okBtn = document.getElementById('alertModalOk');
                const closeBtn = modal.querySelector('.custom-modal-close');

                titleEl.textContent = title;
                messageEl.textContent = message;

                modal.classList.add('show');

                const cleanup = () => {
                    modal.classList.remove('show');
                    okBtn.removeEventListener('click', handleOk);
                    closeBtn.removeEventListener('click', handleOk);
                    modal.removeEventListener('click', handleBackgroundClick);
                    document.removeEventListener('keydown', handleKeydown);
                };

                const handleOk = () => {
                    cleanup();
                    resolve();
                };

                const handleBackgroundClick = (e) => {
                    if (e.target === modal) {
                        handleOk();
                    }
                };

                const handleKeydown = (e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                        handleOk();
                    }
                };

                okBtn.addEventListener('click', handleOk);
                closeBtn.addEventListener('click', handleOk);
                modal.addEventListener('click', handleBackgroundClick);
                document.addEventListener('keydown', handleKeydown);
            });
        }

        // Auto-save current preview collection state
        autoSavePreviewState() {
            // Save the current previewCollection array directly
            if (this.previewCollection && this.previewCollection.length > 0) {
                const characterName = this.currentCharacter ? this.currentCharacter.name : 'default';
                const previewStateKey = `previewState_${characterName}`;
                
                localStorage.setItem(previewStateKey, JSON.stringify({
                    previewCollection: [...this.previewCollection],
                    savedAt: new Date().toISOString()
                }));
                
                console.log(`Auto-saved preview state with ${this.previewCollection.length} pages for ${characterName}`);
            }
        }

        // Restore preview collection state
        restorePreviewState() {
            const characterName = this.currentCharacter ? this.currentCharacter.name : 'default';
            const previewStateKey = `previewState_${characterName}`;
            
            const savedState = localStorage.getItem(previewStateKey);
            if (savedState) {
                try {
                    const parsedState = JSON.parse(savedState);
                    this.previewCollection = parsedState.previewCollection || [];
                    console.log(`Restored preview state with ${this.previewCollection.length} pages for ${characterName}`);
                } catch (error) {
                    console.error('Error restoring preview state:', error);
                    this.previewCollection = [];
                }
            } else {
                this.previewCollection = [];
            }
        }

        // Save current deck (pages present in preview)
        async saveDeck() {
            // Get pages currently displayed in the cards grid
            const cardsGrid = document.getElementById('cardsGrid');
            if (!cardsGrid) {
                this.showNotification('Cards grid not found', 'error');
                return;
            }

            const pageCards = cardsGrid.querySelectorAll('.page-card');
            if (pageCards.length === 0) {
                this.showNotification('No pages in preview to save', 'warning');
                return;
            }

            // Extract page data from the cards in the preview
            const previewPages = Array.from(pageCards).map(card => {
                const pageId = card.dataset.page;
                const pageName = card.querySelector('.card-title').textContent;
                return { id: pageId, name: pageName };
            });

            const deckName = await this.showCustomPrompt(
                'Save Deck', 
                'Enter a name for this deck:', 
                'Deck name...'
            );
            if (!deckName) {
                this.showNotification('Save cancelled', 'info');
                return;
            }

            // Get existing saved decks or initialize empty array
            let savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
            
            // Check if name already exists
            const existingIndex = savedDecks.findIndex(deck => deck.name === deckName.trim());
            if (existingIndex !== -1) {
                const overwrite = await this.showCustomConfirm(
                    'Deck Already Exists',
                    `A deck with name "${deckName.trim()}" already exists. Do you want to overwrite it?`
                );
                if (!overwrite) {
                    return;
                }
                savedDecks[existingIndex] = {
                    name: deckName.trim(),
                    pages: [...previewPages],
                    characterName: this.currentCharacter ? this.currentCharacter.name : 'Unknown',
                    savedAt: new Date().toISOString()
                };
            } else {
                savedDecks.push({
                    name: deckName.trim(),
                    pages: [...previewPages],
                    characterName: this.currentCharacter ? this.currentCharacter.name : 'Unknown',
                    savedAt: new Date().toISOString()
                });
            }

            localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
            this.showNotification(`Saved deck "${deckName.trim()}" with ${previewPages.length} pages`, 'success');
            // Persist current preview so Start Encounter uses latest equipped deck
            this.autoSavePreviewState();
        }

        // View saved decks
        viewSavedDecks() {
            const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');

            if (savedDecks.length === 0) {
                this.showNotification('No saved decks found', 'info');
                return;
            }

            // Create and show popup
            const popup = document.createElement('div');
            popup.className = 'saved-decks-popup';
            popup.innerHTML = `
                <div class="saved-decks-popup-content">
                    <div class="popup-header">
                        <h3 class="popup-title">Saved Decks</h3>
                        <span class="close-popup">&times;</span>
                    </div>
                    <div class="popup-body">
                        <div class="saved-section">
                            <h4 class="section-title">Saved Decks</h4>
                            <div class="saved-list">
                                ${savedDecks.map(deck => `
                                    <div class="saved-item" data-type="deck" data-name="${deck.name}">
                                        <div class="saved-item-header">
                                            <span class="saved-name">${deck.name}</span>
                                            <span class="saved-count">${deck.pages.length} pages</span>
                                        </div>
                                        <div class="saved-item-details">
                                            <span class="saved-character">Character: ${deck.characterName}</span>
                                            <span class="saved-date">${new Date(deck.savedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div class="saved-item-actions">
                                            <button class="load-saved-btn" onclick="window.characterManager.loadSavedDeck('${deck.name}')">Load</button>
                                            <button class="delete-saved-btn" onclick="window.characterManager.deleteSavedDeck('${deck.name}')">Delete</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(popup);
            popup.classList.add('show');

            // Add close functionality
            const closeBtn = popup.querySelector('.close-popup');
            closeBtn.addEventListener('click', () => {
                popup.remove();
            });

            // Close on background click
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.remove();
                }
            });
        }

        // Load saved deck
        async loadSavedDeck(deckName) {
            const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
            const deck = savedDecks.find(d => d.name === deckName);
            
            if (!deck) {
                this.showNotification('Saved deck not found', 'error');
                return;
            }

            const confirmed = await this.showCustomConfirm(
                'Load Deck',
                `Load deck "${deckName}" into preview? This will replace current preview pages.`
            );
            if (confirmed) {
                // Clear current preview collection
                this.previewCollection = [];
                
                // Build owned set for fast membership check
                const ownedSet = new Set((this.currentCharacter?.ownedPages || [])
                    .map(id => parseInt(id, 10))
                    .filter(n => !isNaN(n))
                );
                
                // Add saved deck pages to preview (up to 9 pages), removing not-owned
                const pagesToLoad = deck.pages.slice(0, 9);
                let loadedCount = 0;
                let removedCount = 0;
                const removedNames = [];
                
                pagesToLoad.forEach(savedPage => {
                    const numericId = parseInt(savedPage.id, 10);
                    // Check if the page exists and is owned
                    const existsInCatalog = !!(window.pageManager && window.pageManager.pages && window.pageManager.pages[numericId]);
                    const isOwned = ownedSet.has(numericId);
                    if (existsInCatalog && isOwned) {
                        this.previewCollection.push(isNaN(numericId) ? savedPage.id : numericId);
                        loadedCount++;
                    } else {
                        removedCount++;
                        if (savedPage?.name) removedNames.push(savedPage.name);
                    }
                });
                
                // Update the cards grid to show the loaded pages
                this.updateCardsGrid();
                // Persist loaded preview so encounter generation sees it immediately
                this.autoSavePreviewState();
                
                // If any pages were not owned, remove them from the saved deck and persist
                if (removedCount > 0) {
                    deck.pages = deck.pages.filter(p => {
                        const idNum = parseInt(p.id, 10);
                        return ownedSet.has(idNum);
                    });
                    deck.savedAt = new Date().toISOString();
                    // Persist updated deck list
                    const idx = savedDecks.findIndex(d => d.name === deckName);
                    if (idx !== -1) savedDecks[idx] = deck;
                    localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
                    const removedList = removedNames.slice(0, 5).join(', ');
                    const more = removedNames.length > 5 ? `, +${removedNames.length - 5} more` : '';
                    this.showNotification(`Loaded ${loadedCount} page(s). Removed ${removedCount} not owned: ${removedList}${more}`, 'warning');
                } else {
                    this.showNotification(`Loaded ${loadedCount} pages from deck "${deckName}" into preview`, 'success');
                }
                
                // Close the saved decks popup
                const popup = document.querySelector('.saved-decks-popup');
                if (popup) popup.remove();
            }
        }


        // Delete saved deck
        async deleteSavedDeck(deckName) {
            const confirmed = await this.showCustomConfirm(
                'Delete Deck',
                `Are you sure you want to delete the saved deck "${deckName}"?`
            );
            if (confirmed) {
                let savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
                savedDecks = savedDecks.filter(deck => deck.name !== deckName);
                localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
                this.showNotification(`Deleted saved deck "${deckName}"`, 'success');
                
                // Refresh the view
                const popup = document.querySelector('.saved-decks-popup');
                if (popup) {
                    popup.remove();
                    this.viewSavedDecks();
                }
            }
        }


		// Read Owned Pages from the current character data (excluding Trigram pages)
        getOwnedPagesFromInventory() {
            const allOwnedPages = this.currentCharacter?.ownedPages || [];
			return allOwnedPages.filter(pageId => {
				const pageData = this.getPageData(pageId);
				if (!pageData) return false;
				// Exclude Trigram pages (Geon, Gon, Gam, Gi)
				if ([13, 14, 15, 16].includes(pageId)) return false;
				// Exclude Thumb Ammunition from owned pages (obtainable only via Reload)
				if ([102, 103, 104, 105].includes(pageId)) return false;
				return true;
			});
        }

        // Get pages available for drawing (equipped pages + special pages)
        // This function implements the core logic for the requested feature:
        // - Pages equipped in the Page Cards Preview are prioritized for hand management
        // - Special pages always appear regardless of equipped status
        // - Falls back to all owned pages if no pages are equipped
        // - Trigram pages (Geon, Gon, Gam, Gi) only available for Hana Association faction
        getAvailablePagesForDrawing() {
            console.log('getAvailablePagesForDrawing called');
            console.log('currentCharacter:', this.currentCharacter);
            const allOwnedPages = this.getOwnedPagesFromInventory();
            console.log('allOwnedPages:', allOwnedPages);
            const equippedPages = (this.previewCollection || []).map(id => {
                const n = parseInt(id, 10);
                return isNaN(n) ? id : n;
            });
            console.log('equippedPages:', equippedPages);
            const availablePages = [];

            // Get current character's faction
            const currentFaction = this.currentCharacter?.factions || '';
            const isHanaAssociation = currentFaction === 'Hana Association';
            
            // Define trigram page IDs that should only appear for Hana Association
            const trigramPageIds = [13, 14, 15, 16]; // Geon, Gon, Gam, Gi

            // Add all equipped pages from preview collection (Page Cards Preview)
            equippedPages.forEach(pageId => {
                if (allOwnedPages.includes(pageId)) {
                    // Check faction restriction for trigram pages
                    if (trigramPageIds.includes(pageId) && !isHanaAssociation) {
                        return; // Skip trigram pages if not Hana Association
                    }
                    availablePages.push(pageId);
                }
            });

            // Add all special pages regardless of equipped status
            // Special pages always appear in hand as requested
            allOwnedPages.forEach(pageId => {
                const page = window.pageManager?.pages[pageId];
                const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                
                if (isSpecial && !availablePages.includes(pageId)) {
                    // Check faction restriction for trigram pages
                    if (trigramPageIds.includes(pageId) && !isHanaAssociation) {
                        return; // Skip trigram pages if not Hana Association
                    }
                    availablePages.push(pageId);
                }
            });

			// If no equipped pages and no special pages, fall back to all owned pages
			if (availablePages.length === 0) {
				return allOwnedPages.filter(pageId => {
					// Apply faction restriction for trigram pages
					if (trigramPageIds.includes(pageId) && !isHanaAssociation) {
						return false;
					}
					// Exclude Thumb Ammunition (102-105) from normal availability; obtainable only via Reload Bullets
					if (pageId === 102 || pageId === 103 || pageId === 104 || pageId === 105) {
						return false;
					}
					return true;
				});
			}

			// When equipped pages exist, also exclude Thumb Ammunition from normal availability
			return availablePages.filter(pageId => !(pageId === 102 || pageId === 103 || pageId === 104 || pageId === 105));
        }

        cleanupEnemyOnlyPages() {
            return;
        }

		// Clean up Trigram pages (Geon, Gon, Gam, Gi) from character data
		cleanupTrigramPages() {
			if (!this.currentCharacter || !this.currentCharacter.ownedPages) return;
			const trigramIds = new Set([13, 14, 15, 16]);
			const before = this.currentCharacter.ownedPages.length;
			this.currentCharacter.ownedPages = this.currentCharacter.ownedPages.filter(id => !trigramIds.has(id));
			const removed = before - this.currentCharacter.ownedPages.length;
			if (removed > 0) {
				console.log(`Removed ${removed} Trigram pages from character data`);
				this.updateCharacter();
				this.updateOwnedPagesDisplay();
			}
		}

		// Clean up Thumb Ammunition pages (Shock/Incendiary/AP/Frost) from character data
		cleanupThumbAmmoPages() {
			if (!this.currentCharacter || !this.currentCharacter.ownedPages) return;
			const thumbAmmoIds = new Set([102, 103, 104, 105]);
			const before = this.currentCharacter.ownedPages.length;
			this.currentCharacter.ownedPages = this.currentCharacter.ownedPages.filter(id => !thumbAmmoIds.has(id));
			const removed = before - this.currentCharacter.ownedPages.length;
			if (removed > 0) {
				console.log(`Removed ${removed} Thumb Ammunition pages from character data`);
			}
		}

        // Render Owned Pages into the inventory DOM
        renderOwnedPages(ownedPageIds) {
            // Update the popup display
            this.updateOwnedPagesDisplay();
            
            // Ensure combat list reflects current owned pages
            if (window.pageManager && typeof window.pageManager.syncCombatListWithInventory === 'function') {
                window.pageManager.syncCombatListWithInventory();
            }
        }

        // Calculate and update MAX LIGHT based on Grade
        updateMaxLight() {
            const gradeInput = document.getElementById('grade');
            const maxLightElement = document.getElementById('maxLightValue');
            
            if (!gradeInput || !maxLightElement) return;
            
            const grade = parseInt(gradeInput.value) || 0;
            let maxLight = 'X'; // Default fallback
            
            // Calculate MAX LIGHT based on Grade ranges
            if (grade >= 8 && grade <= 9) {
                maxLight = '3';
            } else if (grade >= 3 && grade <= 7) {
                maxLight = '4';
            } else if (grade >= 1 && grade <= 2) {
                maxLight = '5';
            } else if (grade === 0) {
                // Color Grade (EX) - treated as highest tier
                maxLight = '5';
            }
            // Apply encounter Emotion bonus (+1 per Emotion level-up) if any
            const bonus = typeof this.emotionBonusLight === 'number' ? this.emotionBonusLight : 0;
            const withBonus = String(parseInt(maxLight) + bonus);
            maxLightElement.textContent = withBonus;
            
            // Keep CURRENT LIGHT in sync with new max
            if (typeof this.updateCurrentLight === 'function') {
                this.updateCurrentLight();
            }
        }
        
        // Update CURRENT LIGHT based on Max Light and assigned pages' lightUsage
        updateCurrentLight() {
            const currentLightElement = document.getElementById('currentLightValue');
            const maxLightElement = document.getElementById('maxLightValue');
            // Allow missing currentLightElement (text UI removed) but require maxLightElement
            if (!maxLightElement) return;
            
            const maxLight = parseInt(maxLightElement.textContent);
            if (Number.isNaN(maxLight)) {
                if (currentLightElement) currentLightElement.textContent = '';
                return;
            }
            
            // Sum lightUsage of currently assigned pages
            let usedLight = 0;
            if (this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.size > 0) {
                this.encounterState.diceAssignments.forEach(assignment => {
                    const handIndex = assignment.handIndex !== undefined ? assignment.handIndex : null;
                    const handType = assignment.handType || 'normal';
                    // Use explicit override when present (e.g., Bottom Deal final card uses 0 Light)
                    const usage = (typeof assignment.lightUsageOverride === 'number')
                        ? assignment.lightUsageOverride
                        : this.getEffectiveLightUsage(assignment.pageId, handIndex, handType);
                    if (!Number.isNaN(usage)) {
                        usedLight += usage;
                    }
                });
            }
            // Include light spent by [On Play] pages that removed themselves from dice (e.g., Reload Bullets)
            const onPlaySpent = (this.encounterState && typeof this.encounterState.lightSpentOnPlayThisScene === 'number')
                ? this.encounterState.lightSpentOnPlayThisScene
                : 0;
            usedLight += Math.max(0, onPlaySpent);
            
            // Apply any scene-based light refunds (e.g., on-use effects)
            const refund = (this.encounterState && typeof this.encounterState.lightRefundThisScene === 'number') ? this.encounterState.lightRefundThisScene : 0;
            const remaining = Math.max(0, Math.min(maxLight, maxLight - usedLight + refund));
            if (currentLightElement) currentLightElement.textContent = `${remaining}/${maxLight}`;
            
            // Persist remaining/max in encounter state so scene transitions don't rely on DOM
            try {
                if (!this.encounterState) this.encounterState = {};
                this.encounterState.currentLightRemaining = remaining;
                this.encounterState.currentLightMax = maxLight;
            } catch (e) { /* non-fatal */ }
            
            // Update light indicator orbs above speed dice
            this.updateLightIndicatorOrbs(remaining, maxLight, usedLight);
        }

        // Update light indicator orbs to show current light amount
        updateLightIndicatorOrbs(remaining, maxLight, usedLight = 0) {
            const orbsContainer = document.getElementById('lightIndicatorOrbs');
            if (!orbsContainer) return;
            
            // Clear existing orbs
            orbsContainer.innerHTML = '';
            
            // Create orbs based on max light
            const max = parseInt(maxLight) || 0;
            const used = parseInt(usedLight) || 0;
            
            for (let i = 0; i < max; i++) {
                const orb = document.createElement('div');
                orb.className = 'light-indicator-orb';
                
                if (i < remaining) {

                    // Available light
                    orb.classList.add('active');
                    
                } else if (i < remaining + used) {
                    
                    // Currently spending light
                    orb.classList.add('used');

                } else {

                    // Missing/spent light
                    orb.classList.add('spent');
                }
                
                orbsContainer.appendChild(orb);
            }
        }

        // Calculate and update temperance-based stats (MAX HAND and DRAW PER SCENE)
        // Level I:   MAX HAND = 10, DRAW PER SCENE = 1
        // Level II:  MAX HAND = 11, DRAW PER SCENE = 1
        // Level III: MAX HAND = 12, DRAW PER SCENE = 1
        // Level IV:  MAX HAND = 13, DRAW PER SCENE = 2
        // Level V:   MAX HAND = 14, DRAW PER SCENE = 2
        // Level EX:  MAX HAND = 15, DRAW PER SCENE = 3
        updateTemperanceStats() {
            const temperanceInput = document.getElementById('temperance');
            const maxHandElement = document.getElementById('maxHandValue');
            const drawPerSceneElement = document.getElementById('drawPerSceneValue');
            const maxHandLimitElement = document.getElementById('maxHandLimit');
            
            // Check if all required elements exist
            if (!temperanceInput) {
                console.warn('Temperance input element not found');
                return;
            }
            if (!maxHandElement) {
                console.warn('maxHandValue element not found');
                return;
            }
            if (!drawPerSceneElement) {
                console.warn('drawPerSceneValue element not found');
                return;
            }
            if (!maxHandLimitElement) {
                console.warn('maxHandLimit element not found');
                return;
            }
            
            const temperance = temperanceInput.value || 'I';
            let maxHand = 10; // Default fallback
            let drawPerScene = 1; // Default fallback
            
            // Calculate stats based on Temperance Level
            switch (temperance) {
                case 'I':
                    maxHand = 10;
                    drawPerScene = 1;
                    break;
                case 'II':
                    maxHand = 11;
                    drawPerScene = 1;
                    break;
                case 'III':
                    maxHand = 12;
                    drawPerScene = 1;
                    break;
                case 'IV':
                    maxHand = 13;
                    drawPerScene = 2;
                    break;
                case 'V':
                    maxHand = 14;
                    drawPerScene = 2;
                    break;
                case 'EX':
                    maxHand = 15;
                    drawPerScene = 3;
                    break;
                default:
                    // If invalid input, default to Level I
                    maxHand = 10;
                    drawPerScene = 1;
                    console.warn(`Invalid temperance level: ${temperance}, defaulting to I`);
                    break;
            }
            
            maxHandElement.textContent = maxHand;
            drawPerSceneElement.textContent = drawPerScene;
            maxHandLimitElement.textContent = maxHand;
            
            console.log(`Temperance Level ${temperance}: MAX HAND = ${maxHand}, DRAW PER SCENE = ${drawPerScene}`);
        }

        // Update speed stats (min/max and dice count) from the Speed modal
        updateJusticeSpeedStats() {
            const minSpeedInput = document.getElementById('minSpeed');
            const maxSpeedInput = document.getElementById('maxSpeed');
            const speedDiceInput = document.getElementById('speedDice');
            const speedRangeElement = document.getElementById('speedRangeValue');
            const speedDiceElement = document.getElementById('speedDiceValue');
            
            if (!speedRangeElement || !speedDiceElement) {
                console.warn('Speed stats display elements not found');
                return;
            }
            
            // Get values from speed modal if available, otherwise use defaults
            let minSpeed = 1;
            let maxSpeed = 3;
            let speedDice = 1;
            
            if (minSpeedInput) minSpeed = parseInt(minSpeedInput.value) || 1;
            if (maxSpeedInput) maxSpeed = parseInt(maxSpeedInput.value) || 3;
            if (speedDiceInput) speedDice = parseInt(speedDiceInput.value) || 1;
            
            speedRangeElement.textContent = `${minSpeed}-${maxSpeed}`;
            speedDiceElement.textContent = speedDice;
            
            // Update hexagon slots based on dice count
            this.updateHexagonSlots(speedDice);
            
            console.log(`SPEED RANGE = ${minSpeed}-${maxSpeed}, SPEED DICE = ${speedDice}`);
        }
        
        // Update hexagon slots visibility based on dice count
        updateHexagonSlots(diceCount, diceValues = null) {
            const hexagonContainer = document.querySelector('.hexagonal-slots');
            if (!hexagonContainer) {
                console.warn('Hexagon slots container not found');
                return;
            }
            
            const hexSlots = hexagonContainer.querySelectorAll('.hex-slot');
            
            // Show/hide slots based on dice count
            hexSlots.forEach((slot, index) => {
                if (index < diceCount) {
                    // Show slot with image
                    slot.style.display = 'block';
                    slot.classList.add('filled');
                    // Track dice index for hover mapping
                    slot.setAttribute('data-dice-index', String(index));
                    
                    // Clear existing content
                    slot.innerHTML = '';
                    
                    // Create image element with appropriate gif based on dice value
                    const img = document.createElement('img');
                    if (diceValues && diceValues[index] !== undefined) {
                        // Use specific gif based on dice value
                        img.src = this.getDiceGifFilename(diceValues[index]);
                    } else {
                        // Default gif for empty slots
                        img.src = 'DiceRollinf-unscreen.gif';
                    }
                    img.alt = 'Speed Range';
                    img.className = 'speed-range-img';
                    slot.appendChild(img);
                    
                    // Add locked overlay icon; visibility controlled below (also used for disabled dice)
                    const lockImg = document.createElement('img');
                    lockImg.src = 'LockedDice.png';
                    lockImg.alt = 'Locked Dice';
                    lockImg.className = 'locked-dice-overlay';
                    const disabled = !!(this.encounterState && this.encounterState.disabledDiceIndicesEncounter instanceof Set && this.encounterState.disabledDiceIndicesEncounter.has(index));
                    if (disabled) {
                        lockImg.style.display = 'block';
                    } else {
                        lockImg.style.display = 'none';
                    }
                    slot.appendChild(lockImg);
                    
                    // Store dice value as data attribute for dice detection
                    if (diceValues && diceValues[index] !== undefined) {
                        slot.setAttribute('data-dice-value', diceValues[index]);
                    }

                } else {
                    // Hide slot
                    slot.style.display = 'none';
                    slot.classList.remove('filled');
                }
            });
            
            // Attach hover handlers for showing assigned page in hand
            this.attachHexSlotHoverHandlers();
            
            console.log(`Updated hexagon slots: showing ${diceCount} slots`);
        }

        // Attach hover handlers to hex slots to show the assigned page name near the dice
        attachHexSlotHoverHandlers() {
            const hexSlots = document.querySelectorAll('.hexagonal-slots .hex-slot.filled');
            if (!hexSlots || hexSlots.length === 0) return;
            
            // Remove previous listeners by cloning (prevents stacking)
            hexSlots.forEach(slot => {
                const clone = slot.cloneNode(true);
                slot.parentNode.replaceChild(clone, slot);
            });
            
            const freshSlots = document.querySelectorAll('.hexagonal-slots .hex-slot.filled');
            freshSlots.forEach(slot => {
                const diceIndexAttr = slot.getAttribute('data-dice-index');
                const diceIndex = diceIndexAttr != null ? parseInt(diceIndexAttr) : null;
                if (diceIndex == null || Number.isNaN(diceIndex)) return;
                
                slot.addEventListener('mouseenter', (event) => {
                    this.onHexSlotHoverEnter(diceIndex, slot, event);
                });
                slot.addEventListener('mouseleave', () => {
                    this.onHexSlotHoverLeave(slot);
                });
                slot.addEventListener('mousemove', (event) => {
                    this.onHexSlotHoverMove(slot, event);
                });
                // Click: if occupied, open unequip popup
                slot.addEventListener('click', () => {
                    this.onHexSlotClick(diceIndex);
                });

                // Also attach events to the image inside, to be safe
                const img = slot.querySelector('img');
                if (img) {
                    img.addEventListener('mouseenter', (event) => {
                        this.onHexSlotHoverEnter(diceIndex, slot, event);
                    });
                    img.addEventListener('mouseleave', () => {
                        this.onHexSlotHoverLeave(slot);
                    });
                    img.addEventListener('mousemove', (event) => {
                        this.onHexSlotHoverMove(slot, event);
                    });
                    img.addEventListener('click', () => {
                        this.onHexSlotClick(diceIndex);
                    });
                }
            });
        }

        // Handle hover enter: show the assigned page name next to the hovered dice
        onHexSlotHoverEnter(diceIndex, slot, event) {
            // Play dice move sound when hovering over a speed die
            if (typeof this.playDiceMoveSound === 'function') {
                this.playDiceMoveSound();
            }
            
            let pageName = null;
            // Try to resolve assigned page name if encounter state exists
            if (this.encounterState && this.encounterState.diceAssignments) {
                const assignment = this.encounterState.diceAssignments.get(diceIndex);
                if (assignment && assignment.pageId) {
                    const page = window.pageManager?.pages?.[assignment.pageId];
                    if (page) pageName = page.name || null;
                }
            }
            if (!pageName) {
                pageName = 'No page assigned';
            }

            // Use global tooltip
            const tooltip = document.getElementById('diceTooltip');
            if (tooltip) {
                tooltip.textContent = pageName;
                tooltip.style.display = 'block';
                // Initialize smooth follow targets
                const rect = slot.getBoundingClientRect();
                const startX = event?.clientX ?? rect.right + 8;
                const startY = event?.clientY ?? rect.top + rect.height / 2;
                this._diceTooltipTargetX = startX + 12;
                this._diceTooltipTargetY = startY;
                if (this._diceTooltipPosX == null) this._diceTooltipPosX = this._diceTooltipTargetX;
                if (this._diceTooltipPosY == null) this._diceTooltipPosY = this._diceTooltipTargetY;
                this._diceTooltipHovering = true;
                this._startDiceTooltipLoop();
            }
        }

        // Handle hover leave: hide tooltip
        onHexSlotHoverLeave(slot) {
            const tooltip = document.getElementById('diceTooltip');
            if (tooltip) tooltip.style.display = 'none';
            this._diceTooltipHovering = false;
        }

        // Handle hover move: update target position for smooth follow
        onHexSlotHoverMove(slot, event) {
            const rect = slot.getBoundingClientRect();
            const mouseX = event?.clientX ?? rect.right + 8;
            const mouseY = event?.clientY ?? rect.top + rect.height / 2;
            this._diceTooltipTargetX = mouseX + 12;
            this._diceTooltipTargetY = mouseY;
        }

        // Handle click on hex slot
        onHexSlotClick(diceIndex) {
            if (!this.encounterState || !this.encounterState.diceAssignments) return;
            const assignment = this.encounterState.diceAssignments.get(diceIndex);
            if (!assignment) return;
            this.unequipPageFromDiceAtIndex(diceIndex);
        }

        // Unequip a page by dice index: clear its dice assignment and return to hand
        unequipPageFromDiceAtIndex(diceIndex) {
            if (!this.encounterState || !this.encounterState.diceAssignments) return;
            const assignment = this.encounterState.diceAssignments.get(diceIndex);
            if (!assignment) return;
            
            // Play cancel sound when removing a page from a die
            if (typeof this.playCardCancelSound === 'function') {
                this.playCardCancelSound();
            }
            
            const pageId = assignment.pageId;
            const handIndex = assignment.handIndex;
            
            // Clear the dice assignment
            this.encounterState.diceAssignments.delete(diceIndex);
            // Keep stance in sync if Defensive Stance was unequipped
            if (typeof this.handleZweiDefensiveStanceOnPlay === 'function') this.handleZweiDefensiveStanceOnPlay();
            
            // Update visuals for dice and hand
            this.updateDiceVisualState([]);
            
            // Get page data to determine if it's special
            const page = window.pageManager?.pages[pageId];
            const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
            
            // Clear special page tracking if needed
            if (isSpecial && this.encounterState.specialPagesAssigned) {
                this.encounterState.specialPagesAssigned.delete(pageId);
            }
            
            // Return the page to hand unless it's Craft Bullet (which remains in hand on placement)
            const pageObjForReturn = window.pageManager?.pages?.[pageId];
            const isCraftBulletReturn = !!(pageObjForReturn && pageObjForReturn.name === 'Craft Bullet');
            if (!isCraftBulletReturn) {
                // Determine which hand array to use based on page type
                const targetHand = isSpecial 
                    ? (this.encounterState.handSpecial || (this.encounterState.handSpecial = []))
                    : (this.encounterState.handNormal || (this.encounterState.handNormal = []));
                
                // Add page back to the appropriate hand array at the restored index if available
                let insertIndex = -1;
                if (handIndex !== null && handIndex !== undefined && handIndex >= 0 && handIndex <= targetHand.length) {
                    targetHand.splice(handIndex, 0, pageId);
                    insertIndex = handIndex;
                } else {
                    targetHand.push(pageId);
                    insertIndex = targetHand.length - 1;
                }
                
                // If this page is the Bottom Deal final card, update its hand index to the new position
                try {
                    if (!isSpecial &&
                        this.hasPassive('Bottom Deal') &&
                        this.encounterState &&
                        this.encounterState.bottomDealFinalCardId === pageId &&
                        insertIndex >= 0) {
                        this.encounterState.bottomDealFinalCardHandIndex = insertIndex;
                    }
                } catch (e) { /* non-fatal */ }
                
                // Rebuild combined hand array
                this.encounterState.hand = [...(this.encounterState.handNormal || []), ...(this.encounterState.handSpecial || [])];
            }
            
            this.updateHandDisplay();
            
            // Update CURRENT LIGHT after unequip
            if (typeof this.updateCurrentLight === 'function') {
                this.updateCurrentLight();
            }
            
            // Show appropriate notification
            const pageName = page ? page.name : `Page ${pageId}`;
            this.showNotification(`${pageName} removed from dice`, 'info');
            
            // Remove [On Use] Poise if this page granted it (e.g., Time to end this Charade.)
            if (this.encounterState && this.encounterState.pagesGrantedOnUsePoise && this.encounterState.pagesGrantedOnUsePoise.has(pageId)) {
                const grantedPoise = this.encounterState.pagesGrantedOnUsePoise.get(pageId);
                const potencyToRemove = grantedPoise.potency || 0;
                const countToRemove = grantedPoise.count || 0;
                
                if (potencyToRemove > 0 || countToRemove > 0) {
                    const curPot = Number(this.encounterState.poisePotencyThisScene) || 0;
                    const curCnt = Number(this.encounterState.poiseCountThisScene) || 0;
                    this.encounterState.poisePotencyThisScene = Math.max(0, curPot - potencyToRemove);
                    this.encounterState.poiseCountThisScene = Math.max(0, curCnt - countToRemove);
                    
                    // If Count reaches 0, clear Potency so the status fully disappears
                    if (this.encounterState.poiseCountThisScene === 0) {
                        this.encounterState.poisePotencyThisScene = 0;
                    }
                    
                    // Remove tracking
                    this.encounterState.pagesGrantedOnUsePoise.delete(pageId);
                    
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification(`${pageName} [On Use] removed: Lost ${potencyToRemove} Poise Potency and ${countToRemove} Count.`, 'info');
                }
            }
        }

        // Unequip a page: clear its dice assignment and return to hand
        unequipPageFromDice(pageId) {
            if (!this.encounterState || !this.encounterState.diceAssignments) return;
            let restoredHandIndex = null;
            // Get page data to determine if it's special
            const page = window.pageManager?.pages?.[pageId];
            const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
            
            // Remove by scanning for matching pageId and capture its handIndex for restoration
            for (const [idx, assignment] of this.encounterState.diceAssignments.entries()) {
                if (assignment && assignment.pageId === pageId) {
                    restoredHandIndex = assignment.handIndex ?? null;
                    this.encounterState.diceAssignments.delete(idx);
                    if (typeof this.handleZweiDefensiveStanceOnPlay === 'function') this.handleZweiDefensiveStanceOnPlay();
                    break;
                }
            }
            
            // Return page to hand unless it's Craft Bullet (which remains in hand on placement already)
            const pageObjForReturn = window.pageManager?.pages?.[pageId];
            const isCraftBulletReturn = !!(pageObjForReturn && pageObjForReturn.name === 'Craft Bullet');
            if (!isCraftBulletReturn) {
                // Determine which hand array to use based on page type
                const targetHand = isSpecial 
                    ? (this.encounterState.handSpecial || (this.encounterState.handSpecial = []))
                    : (this.encounterState.handNormal || (this.encounterState.handNormal = []));
                
                // Add page back to the appropriate hand array at the restored index if available
                if (restoredHandIndex !== null && restoredHandIndex !== undefined && restoredHandIndex >= 0 && restoredHandIndex <= targetHand.length) {
                    targetHand.splice(restoredHandIndex, 0, pageId);
                } else {
                    targetHand.push(pageId);
                }
                
                // Rebuild combined hand array
                this.encounterState.hand = [...(this.encounterState.handNormal || []), ...(this.encounterState.handSpecial || [])];
            }
            
            // Update visuals and hand display
            this.updateDiceVisualState([]);
            this.updateHandDisplay();
            
            // Update CURRENT LIGHT after unequip
            if (typeof this.updateCurrentLight === 'function') {
                this.updateCurrentLight();
            }
            
            const pageName = page ? page.name : `Page ${pageId}`;
            this.showNotification(`${pageName} removed from dice`, 'info');
            
            // Remove [On Use] Poise if this page granted it (e.g., Time to end this Charade.)
            if (this.encounterState && this.encounterState.pagesGrantedOnUsePoise && this.encounterState.pagesGrantedOnUsePoise.has(pageId)) {
                const grantedPoise = this.encounterState.pagesGrantedOnUsePoise.get(pageId);
                const potencyToRemove = grantedPoise.potency || 0;
                const countToRemove = grantedPoise.count || 0;
                
                if (potencyToRemove > 0 || countToRemove > 0) {
                    const curPot = Number(this.encounterState.poisePotencyThisScene) || 0;
                    const curCnt = Number(this.encounterState.poiseCountThisScene) || 0;
                    this.encounterState.poisePotencyThisScene = Math.max(0, curPot - potencyToRemove);
                    this.encounterState.poiseCountThisScene = Math.max(0, curCnt - countToRemove);
                    
                    // If Count reaches 0, clear Potency so the status fully disappears
                    if (this.encounterState.poiseCountThisScene === 0) {
                        this.encounterState.poisePotencyThisScene = 0;
                    }
                    
                    // Remove tracking
                    this.encounterState.pagesGrantedOnUsePoise.delete(pageId);
                    
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification(`${pageName} [On Use] removed: Lost ${potencyToRemove} Poise Potency and ${countToRemove} Count.`, 'info');
                }
            }
        }

        // Start a RAF loop to smoothly move tooltip toward target
        _startDiceTooltipLoop() {
            if (this._diceTooltipAnimating) return;
            this._diceTooltipAnimating = true;
            const step = () => {
                const tooltip = document.getElementById('diceTooltip');
                if (!tooltip) { this._diceTooltipAnimating = false; return; }
                // If not hovering, end animation
                if (!this._diceTooltipHovering) { this._diceTooltipAnimating = false; return; }
                // Lerp current toward target
                const lerpFactor = 0.25; // higher = faster follow
                this._diceTooltipPosX = this._diceTooltipPosX + (this._diceTooltipTargetX - this._diceTooltipPosX) * lerpFactor;
                this._diceTooltipPosY = this._diceTooltipPosY + (this._diceTooltipTargetY - this._diceTooltipPosY) * lerpFactor;
                tooltip.style.left = `${this._diceTooltipPosX}px`;
                tooltip.style.top = `${this._diceTooltipPosY}px`;
                requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }
        
        // Get the appropriate dice image filename based on dice value
        getDiceGifFilename(diceValue) {
            // Map dice values to PNG files
            const diceImageMap = {
                1: 'DiceRoll1.png',
                2: 'DiceRoll2.png',
                3: 'DiceRoll3.png',
                4: 'DiceRoll4.png',
                5: 'DiceRoll5.png',
                6: 'DiceRoll6.png',
                7: 'DiceRoll7.png',
                8: 'DiceRoll8.png',
                9: 'DiceRoll9.png'
            };
            
            // Return the appropriate PNG file, or default if value not in range
            return diceImageMap[diceValue] || 'DiceRollinf-unscreen.gif';
        }
        
        // Roll speed dice based on configured speed range/dice
        rollSpeedDice(event) {
            console.log('rollSpeedDice called with event:', event.target.textContent);
            // Transform back to combat phase button when starting new encounter/scene
            this.transformToCombatPhaseButton();
            
            // For NEXT SCENE, advance the scene BEFORE rolling so previous-scene statuses don't affect new rolls
            try {
                const actionText = event?.target?.textContent || '';
                if (actionText === 'NEXT SCENE' && this.encounterState) {
                    this.drawNextScene();
                }
                // Block rolling for START ENCOUNTER/scene if staggered persists incorrectly (safety)
                if (actionText !== 'START ENCOUNTER' && this.encounterState && this.encounterState.staggeredThisScene === true) {
                    this.showNotification('Staggered: You cannot act this scene.', 'warning');
                    return;
                }
            } catch (e) { /* non-fatal */ }
            
            const minSpeedInput = document.getElementById('minSpeed');
            const maxSpeedInput = document.getElementById('maxSpeed');
            const speedDiceInput = document.getElementById('speedDice');
            const speedRangeElement = document.getElementById('speedRangeValue');
            const speedDiceElement = document.getElementById('speedDiceValue');
            
            if (!speedRangeElement || !speedDiceElement) {
                console.warn('Speed stats elements not found');
                return;
            }
            
            // Get speed range and dice count from speed modal inputs or display values
            let minSpeed, maxSpeed, diceCount;
            
            if (minSpeedInput && maxSpeedInput && speedDiceInput) {
                // Use values from speed modal
                minSpeed = parseInt(minSpeedInput.value) || 1;
                maxSpeed = parseInt(maxSpeedInput.value) || 3;
                diceCount = parseInt(speedDiceInput.value) || 1;
            } else {
                // Fallback to display values
                const rangeText = speedRangeElement.textContent || '1-3';
                const [min, max] = rangeText.split('-').map(v => parseInt(v.trim()) || 1);
                minSpeed = min || 1;
                maxSpeed = max || 3;
                diceCount = parseInt(speedDiceElement.textContent) || 1;
            }
            
            // Roll the dice
            const rolls = [];
            for (let i = 0; i < diceCount; i++) {
                const roll = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
                rolls.push(roll);
                console.log(`Roll ${i + 1}: ${roll}`);
            }
            // Apply Bind: subtract value from each speed die (min 1)
            try {
                const bindVal = Number(this.encounterState?.bindThisScene) || 0;
                if (bindVal > 0) {
                    for (let i = 0; i < rolls.length; i++) {
                        rolls[i] = Math.max(1, rolls[i] - bindVal);
                    }
                }
            } catch (e) { /* non-fatal */ }
            
            // Sort rolls in descending order (highest to lowest)
            rolls.sort((a, b) => b - a);
            
            // Construct speed range from min and max
            const speedRange = `${minSpeed}-${maxSpeed}`;
            
            // Display the speed range
            speedRangeElement.textContent = speedRange;
            
            // Update hexagon slots with dice values (now in descending order)
            this.updateHexagonSlots(diceCount, rolls);
            
            // Show notification with roll details
            const action = event.target.textContent;
            this.showNotification(`${action}: Speed rolled ${rolls.join(', ')}`, 'info');
            
            console.log(`Speed rolled ${rolls.join(', ')} with range ${minSpeed}-${maxSpeed} and ${diceCount} dice`);
            
            // Generate pages for encounter if this is a Start Encounter action
            if (event.target.textContent === 'START ENCOUNTER') {
                this.generateEncounterPages();
                // Sync bullet count from UI to encounter state
                const bulletInput = document.getElementById('bulletCount');
                if (bulletInput && this.encounterState) {
                    const bullets = parseInt(bulletInput.value) || 0;
                    this.encounterState.bulletsRemaining = Math.max(0, bullets);
                    this.updateBulletStatusDisplay();
                    // Lock bullet edits during encounter
                    bulletInput.disabled = true;
                    bulletInput.setAttribute('title', 'Bullets are locked during the encounter');
                }
            }
        }
        
        // Generate pages for encounter based on equipped pages
        generateEncounterPages() {
            console.log('generateEncounterPages called');
            console.log('currentCharacter:', this.currentCharacter);
            
            // Check if character is loaded
            if (!this.currentCharacter) {
                this.showNotification('Please load a character first', 'error');
                return;
            }
            
            // Restore preview collection state before generating encounter pages
            // This ensures equipped pages are detected even if owned pages menu wasn't opened
            this.restorePreviewState();
            // Ensure placement is allowed at the start of an encounter
            this.placementLocked = false;
            // Clear staggered state at encounter start
            try {
                if (this.encounterState) this.encounterState.staggeredThisScene = false;
            } catch (e) { /* non-fatal */ }
            
            const ownedPages = this.getAvailablePagesForDrawing();
            console.log('ownedPages:', ownedPages);
            const maxHand = parseInt(document.getElementById('maxHandLimit').textContent) || 10;
            
            if (ownedPages.length === 0) {
                this.showNotification('No owned pages available for encounter', 'warning');
                return;
            }
            
            // Initialize empty special hand; special pages will be added here
            const initialHand = [];
            const usedPages = new Set();
            const singleUsePagesUsed = new Set();
            // Initialize trigram state for encounter start
            if (!this.encounterState) this.encounterState = {};
            this.encounterState.trigramUsedThisScene = false;
            if (!this.encounterState.trigramCycleUsed) this.encounterState.trigramCycleUsed = new Set();
            
            // Initialize Bottom Deal rotational pointer for ascending draws
            this.encounterState.bottomDealDrawIndex = 0;
            
            // Reset Catch Breath usage flag for this encounter
            this.encounterState.catchBreathUsed = false;
            
            // Initialize Power Up for this scene (generic power)
            this.encounterState.powerUpThisScene = 0;
            // Initialize Attack Power Up (separate from generic Power Up)
            this.encounterState.attackPowerUpThisScene = 0;
            // Initialize Attack Power Up queued for next scene
            this.encounterState.attackPowerUpNextScene = 0;
            
            // Initialize Bravery for this scene
            this.encounterState.braveryActiveThisScene = false;
            
            // Initialize Slash DMG Up for this scene
            this.encounterState.slashDmgUpThisScene = 0;
            
            // Initialize Protection for this scene
            this.encounterState.protectionThisScene = 0;
            // Initialize Bind queued value at encounter start
            this.encounterState.bindNextScene = 0;
            
            // Initialize Taunt for this scene
            this.encounterState.tauntThisScene = 0;
			// Initialize Haste and Poise for this scene
			this.encounterState.hasteThisScene = 0;
			this.encounterState.poisePotencyThisScene = 0;
			this.encounterState.poiseCountThisScene = 0;
            
            // Initialize Protection for this scene
            this.encounterState.protectionNextScene = 0;
            
            // Initialize Taunt for this scene
            this.encounterState.tauntNextScene = 0;
            
            // Clear Faith of the Promised Land page indicators at encounter start
            this.encounterState.fatesSealedIndicator = false;
            this.encounterState.fatesSealedRoll = null;
            
            // Allow Light gains at encounter start
            this.encounterState.forbidLightGainThisEncounter = false;
            // Ensure status UI reflects reset state
            if (typeof this.updateStatusEffectsDisplay === 'function') {
                this.updateStatusEffectsDisplay();
            }
            
            // Generate a deck for future draws with Single Use restrictions
            const deck = [];
            ownedPages.forEach(pageId => {
                const page = window.pageManager?.pages[pageId];
                const isSingleUse = page && page.range && page.range.includes('Single Use');
                const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                
                // Skip special pages as they're always in hand
                if (isSpecial) {
                    return;
                }
                
                // Single Use pages can only have 1 copy, others can have 1-3 copies
                const copies = isSingleUse ? 1 : Math.floor(Math.random() * 3) + 1;
                
                for (let i = 0; i < copies; i++) {
                    deck.push(pageId);
                }
            });
            
            // Ensure all owned Special pages start in hand as single copies
            ownedPages.forEach(pageId => {
                const page = window.pageManager?.pages[pageId];
                const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                if (isSpecial && !initialHand.includes(pageId)) {
                    initialHand.push(pageId);
                }
            });

            // Auto-add Trigram pages for Hana Association at encounter start
            try {
                const currentFaction = this.currentCharacter?.factions || '';
                if (currentFaction === 'Hana Association') {
                    const trigramIds = [13, 14, 15, 16]; // Geon, Gon, Gam, Gi
                    const pagesToAdd = [];
                    for (const trigramId of trigramIds) {
                        if (!initialHand.includes(trigramId)) {
                                const page = window.pageManager?.pages[trigramId];
                                // Only add if defined and is Special page type
                                const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                                // Skip Trigrams that are already used in current cycle
                                let skipDueToCycle = false;
                                try {
                                    const cycle = this.encounterState?.trigramCycleUsed;
                                    if (cycle instanceof Set && cycle.has(trigramId) && cycle.size < 4) {
                                        skipDueToCycle = true;
                                    }
                                } catch (e) { /* non-fatal */ }
                                if (isSpecial && !skipDueToCycle) pagesToAdd.push(trigramId);
                        }
                    }
                    if (pagesToAdd.length > 0) initialHand.push(...pagesToAdd);
                }
            } catch (e) {
                console.warn('Failed to auto-add trigram pages at encounter start:', e);
            }

            // Shuffle the deck
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
            
            // Get current Temperance level and calculate draw per scene
            const temperanceInput = document.getElementById('temperance');
            const temperance = temperanceInput ? temperanceInput.value || 'I' : 'I';
            let drawPerScene = 1; // Default fallback
            
            // Calculate draw per scene based on Temperance Level
            switch (temperance) {
                case 'I':
                    drawPerScene = 1;
                    break;
                case 'II':
                    drawPerScene = 1;
                    break;
                case 'III':
                    drawPerScene = 1;
                    break;
                case 'IV':
                    drawPerScene = 2;
                    break;
                case 'V':
                    drawPerScene = 2;
                    break;
                case 'EX':
                    drawPerScene = 3;
                    break;
                default:
                    drawPerScene = 1;
                    console.warn(`Invalid temperance level: ${temperance}, defaulting to 1 draw per scene`);
                    break;
            }
            
            // Store encounter state
            this.encounterState = {
                deck: deck,
                handNormal: [],
                handSpecial: initialHand,
                hand: [],
                maxHand: maxHand,
                drawPerScene: drawPerScene, // Now uses Temperance level
				// Track which scene number we're on in this encounter (1-based; encounter start is scene 1)
				sceneNumber: 1,
                // Stagger state for this scene
                staggeredThisScene: false,
                // Track how many pages have been drawn this scene (non-Special only)
                pagesDrawnThisScene: 0,
                // Track Singleton procs for Blade Unlock condition
                singletonProcCount: 0,
                singletonCountedThisScene: false,
                singleUsePagesUsed: singleUsePagesUsed, // Track Single Use pages used in this encounter
                specialPagesAssigned: new Set(), // Track Special pages currently assigned to dice
                diceAssignments: new Map(), // Track which dice are assigned to which pages
                disabledDiceIndicesEncounter: new Set(), // Dice indices disabled for the entire encounter
                // Blade Unlock state for this encounter
                bladeUnlocked: false,
                // Emotion system state (resets each encounter)
                emotionLevel: 0,
                emotionPoints: 0,
                emotionSegmentTypes: [], // 'positive' | 'negative' for each filled segment at current level
                emotionPositive: 0,
                emotionNegative: 0,
                // Thumb Ammunition per-scene tracking
                thumbAmmoTypeThisScene: null, // pageId of 102-105 once used this scene
                thumbAmmoUseCountThisScene: 0, // number of times used this scene
                // Light tracking for On Play pages that remove themselves (so cost still applies)
                lightSpentOnPlayThisScene: 0,
                // Bullet tracking (persists across scenes within encounter)
                bulletsRemaining: 0
            };

            // Set current HP/SP to Max (Fortitude/Prudence) at encounter start
            const fortitudeInputEl = document.getElementById('fortitude');
            const currentHpInputEl = document.getElementById('currentHp');
            const prudenceInputEl = document.getElementById('prudence');
            const currentSpInputEl = document.getElementById('currentSp');
            if (fortitudeInputEl && currentHpInputEl) {
                const fortitudeVal = parseInt(fortitudeInputEl.value, 10) || 0;
                currentHpInputEl.value = fortitudeVal;
            }
            if (prudenceInputEl && currentSpInputEl) {
                const prudenceVal = parseInt(prudenceInputEl.value, 10) || 0;
                currentSpInputEl.value = prudenceVal;
            }
            this.updateHpSpFromStats();
            
            // Reset hand mode to normal for new encounter
            this.handMode = 'normal';
            // Reset Emotion bonus light at encounter start and refresh UI
            this.emotionBonusLight = 0;
            this.updateEmotionDisplay();
            this.updateEmotionBar();
            this.updateEmotionCounts();
            
            // Generate 3 random copies of owned pages (excluding special pages) for combat
			this.generateCombatPages();
			// Latch Singleton status for the scene after initial hand is prepared
			if (this.encounterState) {
				this.encounterState.singletonActiveThisScene = typeof this.computeSingletonFromHand === 'function' ? this.computeSingletonFromHand() : false;
			}
            
            // Update hand display
			this.updateHandDisplay();
            this.updateSwapButtonAppearance();

            // Initialize CURRENT LIGHT at encounter start
            if (typeof this.updateCurrentLight === 'function') {
                this.updateCurrentLight();
            }
            // Ensure Max Light reflects no Emotion bonus at start
            this.updateMaxLight();

            // Lock character editing and page modifications during encounter
            this.lockDuringEncounter(true);
            // Disable Start Encounter button during active encounter
            const startEncounterBtn = document.querySelector('.encounter-btn');
            if (startEncounterBtn) {
                startEncounterBtn.disabled = true;
            }
            
            // Show notification with draw per scene info and Single Use tracking
            let notificationText = `Encounter started! Drew 3 combat pages. Deck has ${deck.length} remaining for future scenes. (Temperance ${temperance}: ${drawPerScene} per scene)`;
            
            this.showNotification(notificationText, 'info');
            
            console.log('Encounter pages generated:', {
                initialHand: initialHand,
                remainingDeck: deck,
                maxHand: maxHand,
                usedPages: Array.from(usedPages),
                singleUsePagesUsed: Array.from(singleUsePagesUsed)
            });
        }
        
        // Enable/disable character editing and related controls during encounters
        lockDuringEncounter(lock) {
            const controlIds = ['name', 'grade', 'fortitude', 'prudence', 'temperance', 'save', 'load', 'delete', 'update'];
            controlIds.forEach((controlId) => {
                const element = document.getElementById(controlId);
                if (element) {
                    element.disabled = !!lock;
                }
            });
        }
        
        enforceHandConstraints() {
            if (!this.encounterState) return;
            if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
            if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
            const maxHand = Number(this.encounterState.maxHand) || 10;
            // Cap duplicates in Normal hand to 3
            const counts = new Map();
            const normalized = [];
            for (const pid of this.encounterState.handNormal) {
                const c = counts.get(pid) || 0;
                if (c < 3) {
                    normalized.push(pid);
                    counts.set(pid, c + 1);
                }
            }
            // Enforce overall Normal hand cap
            if (normalized.length > maxHand) {
                normalized.length = maxHand;
            }
            this.encounterState.handNormal = normalized;
            // Rebuild combined
            this.encounterState.hand = [...this.encounterState.handNormal, ...this.encounterState.handSpecial];
        }
        
        // Update hand display
        updateHandDisplay() {
            const handDisplay = document.querySelector('.hand-display');
            const handLimitElement = document.querySelector('.hand-limit');
            const singletonIndicator = document.getElementById('singletonIndicator');
            const sceneNumberEl = document.getElementById('currentSceneNumber');
            
            if (!handDisplay || !handLimitElement || !this.encounterState) {
                return;
            }
            
            // Enforce constraints before rendering
            if (typeof this.enforceHandConstraints === 'function') this.enforceHandConstraints();
            
            // Keep a combined view for compatibility where needed
            try {
                const combined = [
                    ...(Array.isArray(this.encounterState.handNormal) ? this.encounterState.handNormal : []),
                    ...(Array.isArray(this.encounterState.handSpecial) ? this.encounterState.handSpecial : [])
                ];
                this.encounterState.hand = combined;
            } catch (e) { /* non-fatal */ }

            // Clear current display
            handDisplay.innerHTML = '';

			// Helper to determine if a page belongs to the Special hand (includes Special and Mass types)
			const isSpecialDisplay = (pg) => pg && (
				(typeof pg.range === 'string' && pg.range.includes('Special')) ||
				pg.range === 'Mass - Summation' ||
				pg.range === 'Mass - Individual'
			);
            
            // Pick source list based on current mode
            const sourceHand = this.handMode === 'special'
                ? (this.encounterState.handSpecial || [])
                : (this.encounterState.handNormal || []);
                // Build visible items and sort by base Light usage (ascending)
            const visibleItems = [];
            sourceHand.forEach((pageId, handIndex) => {
                if (!window.pageManager || !window.pageManager.pages || !window.pageManager.pages[pageId]) {
                    return;
                }
                const page = window.pageManager.pages[pageId];
                const isSpecialForDisplay = isSpecialDisplay(page);
                if (this.handMode === 'normal') {
                    if (isSpecialForDisplay) return;
                } else {
                    if (!isSpecialForDisplay) return;
                }
                const baseLight = (typeof page.lightUsage === 'number' ? page.lightUsage : parseInt(page?.lightUsage ?? 0) || 0);
                visibleItems.push({ pageId, handIndex, page, lightForSort: baseLight });
            });
            // Sort by effective light, then by name ONLY when Bottom Deal is active on normal hand
            const shouldSortForBottomDeal = this.handMode === 'normal'
                && typeof this.hasPassive === 'function'
                && this.hasPassive('Bottom Deal');
            if (shouldSortForBottomDeal) {
                visibleItems.sort((a, b) => {
                    if (a.lightForSort !== b.lightForSort) return a.lightForSort - b.lightForSort;
                    const an = a.page?.name || '';
                    const bn = b.page?.name || '';
                    return an.localeCompare(bn);
                });
            }
            
            // Update hand limit display to show filtered count and mode
            const totalHandSize = this.handMode === 'special'
                ? (this.encounterState.handSpecial?.length || 0)
                : (this.encounterState.handNormal?.length || 0);
            const modeText = this.handMode === 'normal' ? 'Normal' : 'Special';
            handLimitElement.textContent = `${visibleItems.length}/${totalHandSize} (${modeText})`;

            // Update scene counter if present
            if (sceneNumberEl && typeof this.encounterState.sceneNumber === 'number') {
                sceneNumberEl.textContent = String(this.encounterState.sceneNumber);
            }

            // Update singleton indicator visibility using latched per-scene flag
            if (singletonIndicator) {
                const active = !!(this.encounterState && this.encounterState.singletonActiveThisScene);
                singletonIndicator.style.display = active ? 'inline-block' : 'none';
                singletonIndicator.classList.toggle('active', active);
            }
            
            // Display sorted visible hand cards with stable hand index for duplicates
            visibleItems.forEach((item, displayIndex) => {
				const { pageId, handIndex, page } = item;
				// Build using the same card model as preview grid
				const pageData = page || this.getPageData(pageId);
				const diceCount = pageData && pageData.dice ? parseInt(pageData.dice, 10) : '-';
				const typeColor = this.getTypeColor(pageData?.category);
				const rangeLabel = pageData?.range || '—';
				const rangeIcon = this.getRangeIconPath(rangeLabel);
				const effects = this.getEffectIcons(pageData || {});
				const baseLight = (typeof pageData?.lightUsage === 'number' ? pageData.lightUsage : parseInt(pageData?.lightUsage ?? 0) || 0);
				
				// Determine status badges
				const isSingleUse = pageData && pageData.range && pageData.range.includes('Single Use');
				const isSpecial = pageData && (
					(typeof pageData.range === 'string' && pageData.range.includes('Special') && !pageData.range.includes('Single Use')) ||
					pageData.range === 'Mass - Summation' ||
					pageData.range === 'Mass - Individual'
				);
				
				// Bottom deal handling (0 light) - last card in normal hand (excluding special pages) uses 0 light
				// Check against stored final card ID and handIndex (determined once per scene)
				const currentHandType = this.handMode === 'special' ? 'special' : 'normal';
				const finalCardId = this.encounterState?.bottomDealFinalCardId;
				const finalCardHandIndex = this.encounterState?.bottomDealFinalCardHandIndex;
				const isBottomDealFinalCard = this.hasPassive('Bottom Deal') && currentHandType === 'normal' && 
					finalCardId && finalCardId === pageId && 
					finalCardHandIndex !== null && finalCardHandIndex === handIndex;
				const effectiveLightUsage = isBottomDealFinalCard ? 0 : baseLight;
				
				const cardElement = document.createElement('div');
				cardElement.className = 'page-card hand-page-card carddesign';
				cardElement.setAttribute('data-page', pageId);
				cardElement.setAttribute('data-hand-index', String(handIndex));
				const lightCostImage = this.getLightCostImage(effectiveLightUsage);
				cardElement.innerHTML = `
					<img class="range-icon" src="${rangeIcon}" alt="range" />
					<img class="card-light-usage" src="${lightCostImage}" alt="${effectiveLightUsage} Light" />
					<div class="card-title">${pageData?.name || `Page ${pageId}`}</div>
					<div class="card-illustration"></div>
					<div class="card-effects">${effects}</div>
					<div class="hand-status-badges">
						${isSpecial ? '<span class="status-badge always-available">Always</span>' : ''}
					</div>
				`;
				
				if (isBottomDealFinalCard) {
					cardElement.classList.add('bottom-deal-card');
					cardElement.setAttribute('title', 'Bottom Deal: This card uses 0 Light');
				}
				
				// Click to open dice placement
				cardElement.addEventListener('click', () => {
					this.playCardSelectSound();
					this.currentEditingHandType = (this.handMode === 'special') ? 'special' : 'normal';
					this.showDicePlacementPopupForPage(pageId, handIndex);
				});
				// Use the same tooltip-on-hover behavior as the preview cards
				cardElement.addEventListener('mouseenter', (e) => {
					this.playCardHoverSound();
					const pd = this.getPageData(pageId);
					if (pd) this.showDiceTooltip(e, pd);
				});
				cardElement.addEventListener('mouseleave', () => {
					this.hideDiceTooltip();
				});
				
				handDisplay.appendChild(cardElement);
            });
        }

        // Update the Singleton indicator explicitly (used by other flows as needed)
        updateSingletonIndicator() {
            const el = document.getElementById('singletonIndicator');
            if (!el) return;
            const active = typeof this.isSingletonActive === 'function' && this.isSingletonActive();
            el.style.display = active ? 'inline-block' : 'none';
            el.classList.toggle('active', active);
        }
        
        // Toggle between Normal and Special pages in hand display
        toggleHandMode() {
            // Don't allow hand mode toggle when no encounter is active
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first!', 'warning');
                return;
            }
            
            this.handMode = this.handMode === 'normal' ? 'special' : 'normal';
            this.updateHandDisplay();
            this.updateSwapButtonAppearance();
            
            const modeText = this.handMode === 'normal' ? 'Normal Pages' : 'Special Pages';
            this.showNotification(`Switched to ${modeText}`, 'info');
            
            console.log(`Hand mode switched to: ${this.handMode}`);
        }
        
        // Update swap button appearance based on current mode
        updateSwapButtonAppearance() {
            const swapBtn = document.querySelector('.swap-btn');
            const normalIcon = swapBtn?.querySelector('.normal-icon');
            const specialIcon = swapBtn?.querySelector('.special-icon');
            
            if (swapBtn) {
                // Disable button when no encounter is active
                if (!this.encounterState) {
                    swapBtn.disabled = true;
                    swapBtn.style.opacity = '0.5';
                    swapBtn.style.cursor = 'not-allowed';
                    // Reset to normal mode appearance when disabled
                    swapBtn.classList.remove('special-mode');
                    if (normalIcon) normalIcon.style.display = 'block';
                    if (specialIcon) specialIcon.style.display = 'none';
                } else {
                    // Enable button when encounter is active, unless staggered
                    const isStaggered = (this.encounterState && this.encounterState.staggeredThisScene === true);
                    swapBtn.disabled = !!isStaggered ? true : false;
                    swapBtn.style.opacity = isStaggered ? '0.5' : '1';
                    swapBtn.style.cursor = isStaggered ? 'not-allowed' : 'pointer';
                    
                    if (this.handMode === 'special') {
                        swapBtn.classList.add('special-mode');
                        if (normalIcon) normalIcon.style.display = 'none';
                        if (specialIcon) specialIcon.style.display = 'block';
                    } else {
                        swapBtn.classList.remove('special-mode');
                        if (normalIcon) normalIcon.style.display = 'block';
                        if (specialIcon) specialIcon.style.display = 'none';
                    }
                }
            }
        }
        
        // Show popup indicating which dice can be used for each page in hand
        showDicePlacementPopup() {
            const hasAnyInEither = (Array.isArray(this.encounterState?.handNormal) && this.encounterState.handNormal.length > 0) || (Array.isArray(this.encounterState?.handSpecial) && this.encounterState.handSpecial.length > 0);
            if (!this.encounterState || !hasAnyInEither) {
                this.showNotification('No pages in hand to show dice placement', 'warning');
                return;
            }
            // Block action while staggered
            if (this.encounterState && this.encounterState.staggeredThisScene === true) {
                this.showNotification('Staggered: You cannot act this scene.', 'warning');
                return;
            }
            
            // Get current dice values
            const hexSlots = document.querySelectorAll('.hex-slot.filled');
            const diceValues = Array.from(hexSlots).map(slot => {
                const diceValue = slot.getAttribute('data-dice-value');
                return diceValue ? parseInt(diceValue) : null;
            }).filter(value => value !== null);
            
            if (diceValues.length === 0) {
                this.showNotification('No dice rolled yet. Roll speed dice first!', 'warning');
                return;
            }
            
            // Create popup content
            let popupContent = '<div class="dice-placement-popup">';
            popupContent += '<div class="popup-header">';
            popupContent += '<h3>Dice Placement Guide</h3>';
            popupContent += '<span class="close-popup" onclick="window.characterManager.hideDicePlacementPopup()">&times;</span>';
            popupContent += '</div>';
            popupContent += '<div class="popup-content">';
            popupContent += `<div class="current-dice">Available Dice: ${diceValues.join(', ')}</div>`;
            popupContent += '<div class="page-dice-mapping">';
            
            // Filter hand cards based on current mode
            const filteredHand = this.encounterState.hand.filter(pageId => {
                if (!window.pageManager || !window.pageManager.pages || !window.pageManager.pages[pageId]) {
                    return false;
                }
                
                const page = window.pageManager.pages[pageId];
                if (this.handMode === 'normal') {
                    return page.pageCategory === 'Regular Pages';
                } else {
                    return page.pageCategory !== 'Regular Pages';
                }
            });
            
            // Show each page and its light requirements
            filteredHand.forEach((pageId, index) => {
                const page = window.pageManager?.pages[pageId];
                if (!page) return;
                
                const pageName = page.name;
				
				// Singleton bonus setup: applies only during encounter and when hand has no duplicates
				const singletonEligiblePages = new Set(['Faith', "Proselyte's Blade", 'Execute', 'Sense Quarry', 'Undertake Prescript']);
				const dicePowerBonus = (singletonEligiblePages.has(pageName) && typeof this.isSingletonActive === 'function' && this.isSingletonActive()) ? 4 : 0;
                // Apply Geon (☰) Power Up to preview text if present
                const geonPowerUp = (this.encounterState && typeof this.encounterState.powerUpThisScene === 'number') ? this.encounterState.powerUpThisScene : 0;
                const diceCount = page.dice;
                const requiredLight = parseInt(page?.lightUsage ?? 0) || 0;
                const isSingleUse = page.range && page.range.includes('Single Use');
                
                popupContent += '<div class="page-dice-item">';
                popupContent += `<div class="page-name">${index + 1}. ${pageName}`;
                if (isSingleUse) {
                    popupContent += ' <span class="single-use-badge">Single Use</span>';
                }
                popupContent += '</div>';
                
                if (requiredLight === 0) {
                    popupContent += '<div class="dice-requirements">No light required</div>';
                } else {
                    // Show which dice can be used (any of the available dice)
                    const usableDice = diceValues;
                    popupContent += `<div class="dice-requirements available">Can use dice: ${usableDice.join(', ')} (${requiredLight} light required)</div>`;
                }
                popupContent += '</div>';
            });
            
            popupContent += '</div>';
            popupContent += '</div>';
            popupContent += '</div>';
            
            // Create or update popup element
            let popup = document.getElementById('dicePlacementPopup');
            if (!popup) {
                popup = document.createElement('div');
                popup.id = 'dicePlacementPopup';
                popup.className = 'dice-placement-popup-container';
                document.body.appendChild(popup);
            }
            
            popup.innerHTML = popupContent;
            popup.classList.add('show');
        }
        
        // Hide dice placement popup
        hideDicePlacementPopup() {
            const popup = document.getElementById('dicePlacementPopup');
            if (popup) {
                popup.classList.remove('show');
            }
        }
        
        // Show dice placement popup for a specific page
        showDicePlacementPopupForPage(pageId, handIndex = null) {
            // Block placement right after starting a combat phase until next scene
            if (this.placementLocked) {
                this.showNotification('You cannot assign pages right after starting a combat phase. Proceed to the next scene first.', 'warning');
                return;
            }
            // Block action while staggered
            if (this.encounterState && this.encounterState.staggeredThisScene === true) {
                this.showNotification('Staggered: You cannot act this scene.', 'warning');
                return;
            }
            if (!this.encounterState || !this.encounterState.hand || this.encounterState.hand.length === 0) {
                this.showNotification('No pages in hand to show dice placement', 'warning');
                return;
            }
            
            // Store the current page ID being edited for better tracking
            this.currentEditingPageId = pageId;
            
            // Use the provided hand index, or find it if not provided (fallback)
            const src = (this.currentEditingHandType === 'special') ? (this.encounterState.handSpecial || []) : (this.encounterState.handNormal || []);
            if (handIndex !== null && handIndex >= 0 && handIndex < src.length) {
                this.currentEditingPageIndex = handIndex;
            } else {
                // Fallback: find the first occurrence (old behavior)
                this.currentEditingPageIndex = src.indexOf(pageId);
            }
            
            // Get current dice values
            const hexSlots = document.querySelectorAll('.hex-slot.filled');
            const diceValues = Array.from(hexSlots).map(slot => {
                const diceValue = slot.getAttribute('data-dice-value');
                return diceValue ? parseInt(diceValue) : null;
            }).filter(value => value !== null);
            
            if (diceValues.length === 0) {
                this.showNotification('No dice rolled yet. Roll speed dice first!', 'warning');
                return;
            }
            
            // Get page data
            const page = window.pageManager?.pages[pageId];
            if (!page) {
                this.showNotification('Page data not found', 'error');
                return;
            }
            
            const pageName = page.name;
            const diceCount = page.dice;
            const isSingleUse = page.range && page.range.includes('Single Use');
            
            // Calculate how many dice can be placed
            const requiredDice = diceCount === '-' || diceCount === '0' ? 0 : parseInt(diceCount);
            const availableDice = diceValues.length;
            const canPlaceDice = requiredDice <= availableDice;
            
            // Show the popup
            const popup = document.getElementById('dicePlacementPopup');
            if (popup) {
                // Update page info
                document.getElementById('dicePopupPageName').textContent = pageName;
                
                document.getElementById('dicePopupPageDetails').textContent = '';
                
                // Populate dice options - only show available (unoccupied) dice
                const diceOptionsContainer = document.getElementById('diceOptions');
                diceOptionsContainer.innerHTML = '';
                
                diceValues.forEach((diceValue, index) => {
                    // Check if this dice position/index is already assigned to another page
                    // We need to check if this specific dice position is already occupied
                    const isOccupied = this.encounterState.diceAssignments.has(index);
                    
                    // Debug logging for dice occupation check
                    if (this.encounterState.diceAssignments.size > 0) {
                        console.log(`Checking dice position ${index} (value: ${diceValue}):`, {
                            isOccupied: isOccupied,
                            currentAssignments: Array.from(this.encounterState.diceAssignments.entries()).map(([pageId, assignment]) => ({
                                pageId: pageId,
                                diceValue: assignment.value,
                                diceIndex: assignment.index
                            }))
                        });
                    }
                    
                    const diceOption = document.createElement('div');
                    diceOption.className = 'dice-option';
                    diceOption.setAttribute('data-dice-index', index);
                    diceOption.setAttribute('data-dice-value', diceValue);
                    
                    // Use DiceRoll images for visual dice representation in the placement popup
                    const diceImageSrc = this.getDiceGifFilename(diceValue);
                    diceOption.innerHTML = `
                        <div class="dice-image-wrapper">
                            <img class="dice-option-img" src="${diceImageSrc}" alt="Dice ${diceValue}">
                        </div>
                        ${isOccupied ? '<div class="occupied-label">Occupied</div>' : ''}
                    `;
                    
                    // Add occupied class if dice is already assigned (after innerHTML so label is present)
                    if (isOccupied) {
                        diceOption.classList.add('occupied');
                    }
                    
                    // Only add click event if dice is not occupied
                    if (!isOccupied) {
                        diceOption.addEventListener('click', () => {
                            if (typeof this.playDiceClickSound === 'function') {
                                this.playDiceClickSound();
                            }
                            this.toggleDiceSelection(diceOption, diceValue);
                        });
                    }
                    // Play movement sound on hover for all dice options
                    diceOption.addEventListener('mouseenter', () => {
                        if (typeof this.playDiceMoveSound === 'function') {
                            this.playDiceMoveSound();
                        }
                    });
                    
                    diceOptionsContainer.appendChild(diceOption);
                });
                
                // Update placement preview
                this.updatePlacementPreview();
                
                // Show popup
                popup.classList.add('show');
                
                // Add event listeners for popup buttons
                this.setupDicePlacementPopupEvents();
            }
        }
        
        // Toggle dice selection in the popup - only allow one die to be selected at a time
        toggleDiceSelection(diceOption, diceValue) {
            // If this die is already selected, deselect it
            if (diceOption.classList.contains('selected')) {
                diceOption.classList.remove('selected');
            } else {
                // If selecting a new die, first deselect any previously selected die
                const previouslySelected = document.querySelectorAll('.dice-option.selected');
                previouslySelected.forEach(die => die.classList.remove('selected'));
                
                // Then select the new die
                diceOption.classList.add('selected');
            }
            this.updatePlacementPreview();
        }
        
        updatePlacementPreview() {
            // The function is kept to prevent errors from existing calls
            return;
        }
        
        // Setup event listeners for the dice placement popup
        setupDicePlacementPopupEvents() {
            // Close button
            const closeBtn = document.querySelector('#dicePlacementPopup .close-popup');
            if (closeBtn) {
                // Ensure only one handler is bound
                closeBtn.onclick = null;
                closeBtn.onclick = () => {
                    this.hideDicePlacementPopup();
                };
            }
            
            // Cancel button
            const cancelBtn = document.querySelector('#dicePlacementPopup .cancel-placement-btn');
            if (cancelBtn) {
                // Ensure only one handler is bound
                cancelBtn.onclick = null;
                cancelBtn.onclick = () => {
                    this.hideDicePlacementPopup();
                };
            }
            
            // Confirm button
            const confirmBtn = document.querySelector('#dicePlacementPopup .confirm-placement-btn');
            if (confirmBtn) {
                // Ensure only one handler is bound
                confirmBtn.onclick = null;
                confirmBtn.onclick = () => {
                    if (typeof this.playCardApplySound === 'function') {
                        this.playCardApplySound();
                    }
                    this.confirmDicePlacement();
                };
            }
            
            // Click outside popup to close
            const popup = document.getElementById('dicePlacementPopup');
            if (popup) {
                popup.addEventListener('click', (event) => {
                    if (event.target === popup) {
                        this.hideDicePlacementPopup();
                    }
                });
            }
            
            // Escape key to close
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.hideDicePlacementPopup();
                }
            });
        }
        
        // Confirm dice placement
        confirmDicePlacement() {
            const selectedDice = document.querySelectorAll('.dice-option.selected');
            const pageName = document.getElementById('dicePopupPageName').textContent;
            
            if (selectedDice.length === 0) {
                this.showNotification('Please select at least one die to place', 'warning');
                return;
            }
            
            // Enforce that only one die can be placed per page
            if (selectedDice.length > 1) {
                this.showNotification('You can only place one die per page', 'warning');
                return;
            }
            
            // Get selected dice values
            const selectedDiceValues = Array.from(selectedDice).map(diceOption => 
                parseInt(diceOption.getAttribute('data-dice-value'))
            );
            
            // Record the dice assignment
            const selectedDiceValue = selectedDiceValues[0];
            const selectedDiceIndex = parseInt(selectedDice[0].getAttribute('data-dice-index'));
            const pageId = this.getCurrentPageIdFromPopup();
            
            if (pageId) {
                // Enforce Four Trigrams rule (Geon, Gon, Gam, Gi)
                try {
                    const trigramIdsSet = new Set([13, 14, 15, 16]);
                    if (trigramIdsSet.has(pageId)) {
                        // Only one Trigram can be used per Scene (blocks after actual use)
                        if (this.encounterState && this.encounterState.trigramUsedThisScene) {
                            this.showNotification('Only one of the Four Trigrams can be used per Scene.', 'warning');
                            return;
                        }
                        // Only one Trigram can be assigned at a time within a scene
                        if (this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.size > 0) {
                            const hasTrigramAssigned = Array.from(this.encounterState.diceAssignments.values()).some(a => trigramIdsSet.has(a.pageId));
                            if (hasTrigramAssigned) {
                                this.showNotification('Only one of the Four Trigrams can be used per Scene.', 'warning');
                                return;
                            }
                        }
                        // Cannot reuse the same Trigram until all four have been used in the cycle
                        const cycle = this.encounterState?.trigramCycleUsed;
                        const alreadyUsedInCycle = cycle instanceof Set
                            ? cycle.has(pageId)
                            : (Array.isArray(cycle) ? cycle.includes(pageId) : false);
                        if (alreadyUsedInCycle) {
                            this.showNotification('This Trigram cannot be re-used until all Four have been used.', 'warning');
                            return;
                        }
                    }
                } catch (e) {
                    // Fail-open if any unexpected error occurs in trigram checks
                }
                // Enforce Thumb Ammunition rules and implement Reload Bullets behavior
                const pageMeta = window.pageManager?.pages?.[pageId];
                // Restrict powerful pages to Blade Unlocked state
                const requiresBladeUnlockedIds = new Set([128, 130, 131, 132]); // Blade Unlock gated by condition too; others require Blade Unlocked
                if (requiresBladeUnlockedIds.has(pageId)) {
                    // Special gate for Blade Unlock itself: require 6+ Singleton procs
                    if (pageId === 128) {
                        const count = this.encounterState?.singletonProcCount || 0;
                        if (count < 6) {
                            this.showNotification('Blade Unlock requires 6+ Singleton procs before it can be used.', 'warning');
                            return;
                        }
                    } else {
                        if (!this.encounterState || this.encounterState.bladeUnlocked !== true) {
                            this.showNotification('You must gain Blade Unlocked before using this page.', 'warning');
                            return;
                        }
                    }
                }
                const isThumbAmmo = pageId === 102 || pageId === 103 || pageId === 104 || pageId === 105;
                const isReloadBullets = pageId === 101;
                // Prevent assigning Ground Crash if Charge < 20
                try {
                    const meta = window.pageManager?.pages?.[pageId];
                    if (meta && meta.name === 'Ground Crash') {
                        const curCharge = Math.max(0, Number(this.encounterState?.chargePotencyThisScene) || 0);
                        if (curCharge < 20) {
                            this.showNotification('Ground Crash: Requires 20+ Charge Potency. Cannot assign to a die.', 'warning');
                            return;
                        }
                    }
                } catch (e) { /* non-fatal */ }
                // Prevent assigning Fiery Dragon Slash if Emotion Level < 3
                try {
                    const meta = window.pageManager?.pages?.[pageId];
                    if (meta && meta.name === 'Fiery Dragon Slash') {
                        const emotionLevel = Math.max(0, Number(this.encounterState?.emotionLevel) || 0);
                        if (emotionLevel < 3) {
                            this.showNotification('Fiery Dragon Slash: Requires Emotion Level 3+. Cannot assign to a die.', 'warning');
                            return;
                        }
                    }
                } catch (e) { /* non-fatal */ }
                // Prevent assigning Fervid Emotions if Emotion Level < 2
                try {
                    const meta = window.pageManager?.pages?.[pageId];
                    if (meta && meta.name === 'Fervid Emotions') {
                        const emotionLevel = Math.max(0, Number(this.encounterState?.emotionLevel) || 0);
                        if (emotionLevel < 2) {
                            this.showNotification('Fervid Emotions: Requires Emotion Level 2+. Cannot assign to a die.', 'warning');
                            return;
                        }
                    }
                } catch (e) { /* non-fatal */ }
                // Prevent assigning Ignite Weaponry if cooldown is active
                try {
                    const meta = window.pageManager?.pages?.[pageId];
                    if (meta && meta.name === 'Ignite Weaponry') {
                        const currentScene = (typeof this.encounterState?.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
                        const cooldownUntil = typeof this.encounterState?.igniteWeaponryCooldownUntilScene === 'number' ? this.encounterState.igniteWeaponryCooldownUntilScene : 0;
                        if (currentScene < cooldownUntil && cooldownUntil > 0) {
                            const scenesRemaining = cooldownUntil - currentScene;
                            this.showNotification(`Ignite Weaponry: On cooldown for ${scenesRemaining} more scene(s). Cannot assign to a die.`, 'warning');
                            return;
                        }
                    }
                } catch (e) { /* non-fatal */ }
                // Ignite Weaponry: [On Play] effect - Apply effects and remove from hand, return after cooldown
                if (pageMeta && pageMeta.name === 'Ignite Weaponry') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const currentScene = (typeof this.encounterState?.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
                        const cooldownUntil = typeof this.encounterState?.igniteWeaponryCooldownUntilScene === 'number' ? this.encounterState.igniteWeaponryCooldownUntilScene : 0;
                        
                        if (currentScene < cooldownUntil && cooldownUntil > 0) {
                            // Already on cooldown, do nothing
                            return;
                        }
                        
                        // [On Use] Restore 1 Light
                        if (!this.encounterState.forbidLightGainThisEncounter) {
                            if (typeof this.encounterState.lightRefundThisScene !== 'number') {
                                this.encounterState.lightRefundThisScene = 0;
                            }
                            this.encounterState.lightRefundThisScene += 1;
                            if (typeof this.updateCurrentLight === 'function') {
                                this.updateCurrentLight();
                            }
                        }
                        
                        // [On Use] Draw 1 Page
                        if (typeof this.drawImmediateCards === 'function') {
                            this.drawImmediateCards(1);
                        }
                        
                        // [After Use] Set cooldown for 5 scenes from current scene
                        this.encounterState.igniteWeaponryCooldownUntilScene = currentScene + 5;
                        
                        // Queue this page to return when cooldown expires
                        if (!Array.isArray(this.encounterState.pagesToReturnOnCooldownExpire)) this.encounterState.pagesToReturnOnCooldownExpire = [];
                        this.encounterState.pagesToReturnOnCooldownExpire.push({
                            pageId: pageId,
                            returnAtScene: this.encounterState.igniteWeaponryCooldownUntilScene
                        });
                        
                        // Remove from appropriate hand now
                        const pm = window.pageManager?.pages?.[pageId];
                        const isSpecialPg = !!(pm && ((typeof pm.range === 'string' && pm.range.includes('Special')) || pm.range === 'Mass - Summation' || pm.range === 'Mass - Individual'));
                        const srcHand = isSpecialPg ? (this.encounterState.handSpecial || []) : (this.encounterState.handNormal || []);
                        const idx = srcHand.indexOf(pageId);
                        if (idx !== -1) {
                            srcHand.splice(idx, 1);
                            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                            if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                        }
                        
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        this.showNotification('Ignite Weaponry: Restored 1 Light, drew 1 Page. Will return after 5 scenes.', 'success');
                    } catch (e) { /* non-fatal */ }
                    // Do not assign to any dice
                    this.hideDicePlacementPopup();
                    return;
                }
                if (isThumbAmmo) {
                    if (!this.encounterState.thumbAmmoTypeThisScene) {
                        // First ammo used this scene sets the type
                        this.encounterState.thumbAmmoTypeThisScene = pageId;
                        this.encounterState.thumbAmmoUseCountThisScene = 1;
                        this.showNotification('Thumb Ammunition set for this scene.', 'info');
                    } else if (this.encounterState.thumbAmmoTypeThisScene !== pageId) {
                        // Different type attempted: block
                        this.showNotification('You can only use 1 Thumb Ammunition type per Scene.', 'warning');
                        return;
                    } else {
                        // Same type; enforce max 2 stacks per scene
                        const cur = Number(this.encounterState.thumbAmmoUseCountThisScene) || 0;
                        if (cur >= 2) {
                            this.showNotification('Thumb Ammunition: Max 2 stacks per scene reached.', 'warning');
                            return;
                        }
                        this.encounterState.thumbAmmoUseCountThisScene = cur + 1;
                    }
                }
                // If Blade Unlock is selected, use it immediately (do not place on dice)
                if (pageMeta && pageMeta.name === 'Blade Unlock') {
                    try {
                        // Apply Blade Unlock effects and set flag
                            if (this.encounterState) {
                            this.encounterState.bladeUnlocked = true;
                            if (typeof this.drawImmediateCards === 'function') {
                                this.drawImmediateCards(2);
                            }
                            if (!this.encounterState.forbidLightGainThisEncounter) {
                                if (typeof this.encounterState.lightRefundThisScene !== 'number') {
                                    this.encounterState.lightRefundThisScene = 0;
                                }
                                this.encounterState.lightRefundThisScene += 4;
                                if (typeof this.updateCurrentLight === 'function') {
                                    this.updateCurrentLight();
                                }
                            } else {
                                this.showNotification('Light gain is disabled for this encounter.', 'info');
                            }
                        }
                        // Remove the page from hand immediately
                        if (Array.isArray(this.encounterState?.hand)) {
                            let removeIndex = -1;
                            if (this.currentEditingPageIndex !== null && this.currentEditingPageIndex !== undefined && this.currentEditingPageIndex !== -1) {
                                if (this.encounterState.hand[this.currentEditingPageIndex] === pageId) {
                                    removeIndex = this.currentEditingPageIndex;
                                }
                            }
                            if (removeIndex === -1) {
                                removeIndex = this.encounterState.hand.indexOf(pageId);
                            }
                            if (removeIndex !== -1) {
                                this.encounterState.hand.splice(removeIndex, 1);
                                // Mark as used single-use
                                if (!this.encounterState.singleUsePagesUsed) this.encounterState.singleUsePagesUsed = new Set();
                                this.encounterState.singleUsePagesUsed.add(pageId);
                                this.updateHandDisplay();
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                    return; // Do not assign to any dice
                }

                // Heel Turn: [On Use] +1 dice power per 6 Poise Potency (Max 3)
                if (pageName === 'Heel Turn') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                        const poisePot = Math.max(0, Number(this.encounterState.poisePotencyThisScene) || 0);
                        const stacks = Math.max(0, Math.min(3, Math.floor(poisePot / 6)));
                        if (stacks > 0) {
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + stacks);
                            this.showNotification(`Heel Turn: +${stacks} dice power this phase (Poise ${poisePot}).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Flank Thrust: [On Use] +1 dice power per 6 Poise Potency (Max 3)
                if (pageName === 'Flank Thrust') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                        const poisePot = Math.max(0, Number(this.encounterState.poisePotencyThisScene) || 0);
                        const stacks = Math.max(0, Math.min(3, Math.floor(poisePot / 6)));
                        if (stacks > 0) {
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + stacks);
                            this.showNotification(`Flank Thrust: +${stacks} dice power this phase (Poise ${poisePot}).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Sharpened Blade: [On Use] Gain 1 Slash DMG Up next Scene
                if (pageName === 'Sharpened Blade') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const pending = (typeof this.encounterState.slashDmgUpNextScene === 'number') ? this.encounterState.slashDmgUpNextScene : 0;
                        this.encounterState.slashDmgUpNextScene = pending + 1;
                        this.showNotification('Sharpened Blade: Will gain +1 Slash DMG Up next scene.', 'success');
                    } catch (e) { /* non-fatal */ }
                }

                // Administering HP Ampule: [On Use] Gain 1 Decay Ampule. Heal 40 HP
                if (pageName === 'Administering HP Ampule') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const curDecay = Number(this.encounterState.decayAmpuleStacks) || 0;
                        this.encounterState.decayAmpuleStacks = Math.max(0, Math.min(99, curDecay + 1));
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp)) {
                            const newHp = Math.min(maxHp, curHp + 40);
                            curHpEl.value = newHp;
                            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                        }
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        this.showNotification('Administering HP Ampule: +1 Decay Ampule, Healed 40 HP.', 'success');
                    } catch (e) { /* non-fatal */ }
                }

                // Administering Resister Ampule: [On Use] Gain 1 Decay Ampule. Gain 1 Protection this Scene
                if (pageName === 'Administering Resister Ampule') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const curDecay = Number(this.encounterState.decayAmpuleStacks) || 0;
                        this.encounterState.decayAmpuleStacks = Math.max(0, Math.min(99, curDecay + 1));
                        if (typeof this.addProtectionThisScene === 'function') {
                            this.addProtectionThisScene(1);
                        } else {
                            const curProt = Number(this.encounterState.protectionThisScene) || 0;
                            this.encounterState.protectionThisScene = Math.min(10, curProt + 1);
                        }
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        this.showNotification('Administering Resister Ampule: +1 Decay Ampule, +1 Protection this Scene.', 'success');
                    } catch (e) { /* non-fatal */ }
                }

                // Discharging Decay Ampule: [On Use] Consume 1 Decay Ampule. Consume 10% Max SP
                if (pageName === 'Discharging Decay Ampule') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const curDecay = Number(this.encounterState.decayAmpuleStacks) || 0;
                        if (curDecay <= 0) {
                            this.showNotification('Discharging Decay Ampule: No Decay Ampule stacks to consume.', 'info');
                        } else {
                            this.encounterState.decayAmpuleStacks = Math.max(0, curDecay - 1);
                            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                            this.showNotification('Discharging Decay Ampule: Consumed 1 Decay Ampule.', 'success');
                        }
                        const curSpEl = document.getElementById('currentSp');
                        const maxSpEl = document.getElementById('maxSp');
                        const curSp = curSpEl ? parseInt(curSpEl.value, 10) : NaN;
                        const maxSp = maxSpEl ? parseInt(maxSpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curSp) && Number.isFinite(maxSp)) {
                            const spend = Math.ceil(maxSp * 0.10);
                            const newSp = Math.max(0, curSp - spend);
                            curSpEl.value = newSp;
                            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                            this.showNotification(`Discharging Decay Ampule: Consumed ${spend} SP (10% Max SP).`, 'warning');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Exposing weakness.: [On Use] Consume 1 Decay Ampule
                if (pageName === 'Exposing weakness.') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const curDecay = Number(this.encounterState.decayAmpuleStacks) || 0;
                        if (curDecay <= 0) {
                            this.showNotification('Exposing weakness.: No Decay Ampule stacks to consume.', 'info');
                        } else {
                            this.encounterState.decayAmpuleStacks = Math.max(0, curDecay - 1);
                            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                            this.showNotification('Exposing weakness.: Consumed 1 Decay Ampule.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // If Catch Breath is selected, trigger its On Play and do not persist on dice
                if (pageMeta && pageMeta.name === 'Catch Breath') {
                    try {
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
                            const hpPct = (curHp / maxHp) * 100;
                            const alreadyUsed = !!(this.encounterState && this.encounterState.catchBreathUsed);
                            if (hpPct <= 40 && !alreadyUsed) {
                                if (typeof this.addPoiseThisScene === 'function') {
                                    this.addPoiseThisScene(7, 3);
                                } else {
                                    if (!this.encounterState) this.encounterState = {};
                                    this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 7;
                                    this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 3;
                                }
                                if (typeof this.addHasteThisScene === 'function') {
                                    this.addHasteThisScene(3);
                                } else {
                                    if (!this.encounterState) this.encounterState = {};
                                    this.encounterState.hasteThisScene = Math.max(0, Math.min(10, (this.encounterState.hasteThisScene || 0) + 3));
                                }
                                // Mark Catch Breath as used for this encounter
                                if (!this.encounterState) this.encounterState = {};
                                this.encounterState.catchBreathUsed = true;
                                this.showNotification('Catch Breath: HP ≤ 40%. Gained 7 Poise Potency, 3 Poise Count, and 3 Haste.', 'success');
                            } else if (alreadyUsed) {
                                this.showNotification('Catch Breath: Already used this encounter.', 'warning');
                            } else {
                                this.showNotification('Catch Breath: HP is 40% or higher. No effect.', 'info');
                            }
                            if (typeof this.updateStatusEffectsDisplay === 'function') {
                                this.updateStatusEffectsDisplay();
                            }
                        }
                        // Consume Catch Breath from hand only if it successfully activated
                        if (this.encounterState && this.encounterState.catchBreathUsed && Array.isArray(this.encounterState.hand)) {
                            let removeIndex = -1;
                            if (this.currentEditingPageIndex !== null && this.currentEditingPageIndex !== undefined && this.currentEditingPageIndex !== -1) {
                                if (this.encounterState.hand[this.currentEditingPageIndex] === pageId) {
                                    removeIndex = this.currentEditingPageIndex;
                                }
                            }
                            if (removeIndex === -1) {
                                removeIndex = this.encounterState.hand.indexOf(pageId);
                            }
                            if (removeIndex !== -1) {
                                this.encounterState.hand.splice(removeIndex, 1);
                                this.updateHandDisplay();
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                    // Do not assign Catch Breath to any dice; return after applying effect
                    this.hideDicePlacementPopup();
                    return;
                }

                // Block using Modified K Corp Ampule if disabled for this encounter
                if (pageMeta && pageMeta.name === 'Modified K Corp Ampule' && this.encounterState && this.encounterState.modifiedAmpuleDisabled === true) {
                    this.showNotification('Modified K Corp Ampule cannot be used anymore this encounter.', 'warning');
                    this.hideDicePlacementPopup();
                    return;
                }

                // Modified K Corp Ampule: On Play (do not persist on dice); return page next scene
                if (pageMeta && pageMeta.name === 'Modified K Corp Ampule') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        // Apply On Play: gain 1 stack and heal 20% of missing HP
                        const prevStacks = Number(this.encounterState.modifiedAmpuleStacks) || 0;
                        this.encounterState.modifiedAmpuleStacks = Math.max(0, prevStacks + 1);
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
                            const missing = Math.max(0, maxHp - curHp);
                            if (missing > 0) {
                                const heal = Math.ceil(missing * 0.2);
                                const newHp = Math.min(maxHp, curHp + heal);
                                curHpEl.value = newHp;
                                if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                                this.showNotification(`Modified K Corp Ampule: Healed ${newHp - curHp} HP (On Play).`, 'success');
                            }
                        }
                        this.showNotification('Modified K Corp Ampule: Gained 1 stack.', 'success');
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();

                        // Queue this page to return next scene
                        if (!Array.isArray(this.encounterState.pagesToReturnNextScene)) this.encounterState.pagesToReturnNextScene = [];
                        this.encounterState.pagesToReturnNextScene.push(pageId);

                        // Remove from hand now
                        if (Array.isArray(this.encounterState.hand)) {
                            const idx = this.encounterState.hand.indexOf(pageId);
                            if (idx !== -1) {
                                this.encounterState.hand.splice(idx, 1);
                                if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                    // Do not assign to any dice
                    this.hideDicePlacementPopup();
                    return;
                }

                // Impugnatio Ultima: [Condition] Can only be used after HP below 60%
                if (pageMeta && pageMeta.name === 'Impugnatio Ultima') {
                    try {
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
                            const hpPercent = (curHp / maxHp) * 100;
                            if (hpPercent >= 60) {
                                this.showNotification('Impugnatio Ultima: Can only be used when HP is below 60%.', 'warning');
                                this.hideDicePlacementPopup();
                                return;
                            }
                        } else {
                            this.showNotification('Impugnatio Ultima: Unable to check HP condition.', 'warning');
                            this.hideDicePlacementPopup();
                            return;
                        }
                    } catch (e) {
                        console.warn('Impugnatio Ultima HP condition check failed:', e);
                        this.showNotification('Impugnatio Ultima: Error checking HP condition.', 'warning');
                        this.hideDicePlacementPopup();
                        return;
                    }
                }

                // Block placement if not enough CURRENT LIGHT for this page's lightUsage
				const pageForCost = window.pageManager?.pages?.[pageId];
				// Find handIndex for this page instance (for Bottom Deal)
				// Use currentEditingPageIndex if available, otherwise we can't determine the specific instance
				const sourceHandForLightCheck = (this.currentEditingHandType === 'special') ? (this.encounterState.handSpecial || []) : (this.encounterState.handNormal || []);
				let handIndexForLightCheck = null;
				if (this.currentEditingPageIndex !== null && this.currentEditingPageIndex !== undefined && this.currentEditingPageIndex !== -1) {
					handIndexForLightCheck = this.currentEditingPageIndex;
				} else {
					// Fallback: if we can't find the specific instance, try to match against Bottom Deal final card
					// This handles the case where the card might be the final card
					const finalCardId = this.encounterState?.bottomDealFinalCardId;
					const finalCardHandIndex = this.encounterState?.bottomDealFinalCardHandIndex;
					if (finalCardId === pageId && finalCardHandIndex !== null) {
						handIndexForLightCheck = finalCardHandIndex;
					} else {
						// Last resort: use first occurrence (may be incorrect for duplicates)
						handIndexForLightCheck = sourceHandForLightCheck.indexOf(pageId);
					}
				}
                // Get effective light usage (accounts for Bottom Deal)
				const handTypeForLightCheck = this.currentEditingHandType || 'normal';
                const requiredLight = this.getEffectiveLightUsage(pageId, handIndexForLightCheck >= 0 ? handIndexForLightCheck : null, handTypeForLightCheck);
				if (!Number.isFinite(requiredLight) || requiredLight < 0) {
					this.showNotification('This page has an invalid Light cost and cannot be placed.', 'warning');
					return;
				}

                // Compute remaining Light consistent with the UI display (includes refunds and clamping)
				let usedLightSoFar = 0;
				if (this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.size > 0) {
					this.encounterState.diceAssignments.forEach(assignment => {
						const handIndex = assignment.handIndex !== undefined ? assignment.handIndex : null;
						const handType = assignment.handType || 'normal';
                        const usage = (typeof assignment.lightUsageOverride === 'number')
                            ? assignment.lightUsageOverride
                            : this.getEffectiveLightUsage(assignment.pageId, handIndex, handType);
						if (Number.isFinite(usage)) usedLightSoFar += usage;
					});
				}
                // Also include any [On Play] light costs that have been spent this scene
                if (this.encounterState && typeof this.encounterState.lightSpentOnPlayThisScene === 'number') {
                    usedLightSoFar += Math.max(0, this.encounterState.lightSpentOnPlayThisScene);
                }
				// If replacing an existing assignment on this die, exclude its light cost from remaining calculation
				const existingForThisDie = (this.encounterState && this.encounterState.diceAssignments)
					? this.encounterState.diceAssignments.get(selectedDiceIndex)
					: null;
                if (existingForThisDie) {
					const prevHandIndex = existingForThisDie.handIndex !== undefined ? existingForThisDie.handIndex : null;
					const prevHandType = existingForThisDie.handType || 'normal';
                    const prevUsage = (typeof existingForThisDie.lightUsageOverride === 'number')
                        ? existingForThisDie.lightUsageOverride
                        : this.getEffectiveLightUsage(existingForThisDie.pageId, prevHandIndex, prevHandType);
					if (Number.isFinite(prevUsage)) usedLightSoFar = Math.max(0, usedLightSoFar - prevUsage);
				}
				// Always compute remaining using maxLight, used, and refund (do not rely on UI text)
				const maxLightParsed = parseInt((document.getElementById('maxLightValue')?.textContent ?? '').trim());
				const refund = (this.encounterState && typeof this.encounterState.lightRefundThisScene === 'number') ? this.encounterState.lightRefundThisScene : 0;
				const remainingLight = Number.isNaN(maxLightParsed) ? 0 : Math.max(0, Math.min(maxLightParsed, maxLightParsed - usedLightSoFar + refund));
				if (requiredLight > remainingLight) {
					const pageNameForMsg = pageForCost?.name ?? 'Page';
					// this.showNotification(`Not enough Light to place ${pageNameForMsg}. Needs ${requiredLight}, only ${remainingLight} remaining.`, 'warning');
					return;
				}
                // Block if this die is disabled for the encounter (Augury Infusion)
                const isDisabledDie = !!(this.encounterState && this.encounterState.disabledDiceIndicesEncounter instanceof Set && this.encounterState.disabledDiceIndicesEncounter.has(selectedDiceIndex));
                if (isDisabledDie) {
                    this.showNotification('This die is disabled for the encounter.', 'warning');
                    return;
                }
                // Determine whether the die was empty before this placement
                const wasEmptyDieBefore = !(this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.has(selectedDiceIndex));
                // If there was a previous assignment on this die, clear it and return the page to hand
                if (!wasEmptyDieBefore) {
                    if (typeof this.unequipPageFromDiceAtIndex === 'function') {
                        this.unequipPageFromDiceAtIndex(selectedDiceIndex);
                    } else if (this.encounterState && this.encounterState.diceAssignments) {
                        this.encounterState.diceAssignments.delete(selectedDiceIndex);
                    }
                }
                // Determine the specific hand index for this individual card instance (respect split hands)
                const sourceHandForEdit = (this.currentEditingHandType === 'special') ? (this.encounterState.handSpecial || []) : (this.encounterState.handNormal || []);
                const currentHandIndex = (this.currentEditingPageIndex !== null && this.currentEditingPageIndex !== undefined && this.currentEditingPageIndex !== -1)
                    ? this.currentEditingPageIndex
                    : sourceHandForEdit.indexOf(pageId);

                // Allow assigning another copy of the same page to a different die.
                // We only block if the specific dice position is already occupied (handled above).
                
                // Determine if this assignment should benefit from Bottom Deal (0 Light)
                let lightUsageOverride = undefined;
                try {
                    if (this.hasPassive('Bottom Deal') &&
                        (this.currentEditingHandType || 'normal') === 'normal' &&
                        handIndexForLightCheck !== null &&
                        this.encounterState &&
                        this.encounterState.bottomDealFinalCardId === pageId &&
                        this.encounterState.bottomDealFinalCardHandIndex === handIndexForLightCheck) {
                        lightUsageOverride = 0;
                    }
                } catch (e) { /* non-fatal */ }

                // Store assignment keyed by dice index to avoid duplicate page collisions
                this.encounterState.diceAssignments.set(selectedDiceIndex, {
                    pageId: pageId,
                    value: selectedDiceValue,
                    index: selectedDiceIndex,
                    handIndex: currentHandIndex,
                    handType: this.currentEditingHandType || 'normal',
                    // Explicit override for special cases like Bottom Deal final card
                    lightUsageOverride: lightUsageOverride
                });
                
                // Handle page removal/return based on page type
                const page = window.pageManager?.pages[pageId];
                const isSpecial = page && (
                    (typeof page.range === 'string' && page.range.includes('Special')) ||
                    page.range === 'Mass - Summation' ||
                    page.range === 'Mass - Individual'
                );
                const isSingleUse = page && page.range && page.range.includes('Single Use');
                
                {
                    let removeIndex = -1;
                    
                    // Try to use the specific index if available
                    if (this.currentEditingPageIndex !== null && this.currentEditingPageIndex !== undefined && this.currentEditingPageIndex !== -1) {
                        // Verify that the page at this index matches the expected pageId
                        if (sourceHandForEdit[this.currentEditingPageIndex] === pageId) {
                            removeIndex = this.currentEditingPageIndex;
                            console.log(`Using specific index ${removeIndex} for page removal`);
                        } else {
                            console.warn('Page index mismatch, falling back to pageId search');
                        }
                    }
                    
                    // Fallback: search for the pageId if specific index not available or doesn't match
                    if (removeIndex === -1) {
                        removeIndex = sourceHandForEdit.indexOf(pageId);
                        console.log(`Using pageId search, found at index ${removeIndex}`);
                    }
                    
					// Handle page based on type
					if (removeIndex !== -1) {
						// Allow unlimited placements for Craft Bullet, Fates Sealed, and Lowly Coward: do not remove from hand or mark as used
						const isCraftBullet = !!(page && page.name === 'Craft Bullet');
                        const isFatesSealed = !!(page && page.name === 'Fates Sealed');
                        const isLowlyCoward = !!(page && page.name === 'Lowly Coward');
						if (!isCraftBullet && !isFatesSealed && !isLowlyCoward) {
                            // Update Bottom Deal final card index if a card before it is being removed
                            // Only adjust if removing from normal hand (Bottom Deal only applies to normal hand)
                            if (!isSpecial && this.hasPassive('Bottom Deal') && this.encounterState?.bottomDealFinalCardHandIndex !== null) {
                                const finalCardHandIndex = this.encounterState.bottomDealFinalCardHandIndex;
                                const finalCardId = this.encounterState.bottomDealFinalCardId;
                                // If the removed card is before the final card, adjust the final card's index
                                if (removeIndex < finalCardHandIndex) {
                                    this.encounterState.bottomDealFinalCardHandIndex = finalCardHandIndex - 1;
                                } else if (removeIndex === finalCardHandIndex && pageId === finalCardId) {
                                    // If the exact final card is being removed, keep its ID but mark index unknown
                                    // The effect should persist on that card instance for the scene, even when not in hand
                                    this.encounterState.bottomDealFinalCardHandIndex = null;
                                }
                            }
							
							// Remove from hand when assigned to prevent duplicate assignments
							// Special pages are unique and persist; removal here is temporary until they are returned
							sourceHandForEdit.splice(removeIndex, 1);
							console.log(`Removed page from hand at index ${removeIndex}`);
							// If it's a Single Use page, mark it as used
							if (isSingleUse) {
								if (!this.encounterState.singleUsePagesUsed) {
									this.encounterState.singleUsePagesUsed = new Set();
								}
								this.encounterState.singleUsePagesUsed.add(pageId);
								console.log(`Marked Single Use page ${pageId} as used`);
							}
							// Track special pages separately so they can be returned to hand when unequipped
							if (isSpecial) {
								if (!this.encounterState.specialPagesAssigned) {
									this.encounterState.specialPagesAssigned = new Set();
								}
								this.encounterState.specialPagesAssigned.add(pageId);
								console.log(`Tracked special page ${pageId} as assigned`);
							}
						}
						this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
						this.updateHandDisplay();
					} else {
                        console.warn(`Could not find page ${pageId} in hand to remove`);
                    }
                }
                // Note: Trigram usage is recorded upon combat resolution (actual use), not on assignment
                
                console.log(`Dice ${selectedDiceValue} (index ${selectedDiceIndex}) assigned to page ${pageName} (ID: ${pageId})`);
            }
            
            // Handle On Play effects for specific pages
            
            // Öufi Association: First/Second/Final Warning — [On Play] gated by HP%, consume immediately, no Tremor
            if (pageName === 'First Warning' || pageName === 'Second Warning' || pageName === 'Final Warning') {
                try {
                    const curHpEl = document.getElementById('currentHp');
                    const maxHpEl = document.getElementById('maxHp');
                    const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                    const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                    const hpPct = (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) ? Math.round((curHp / maxHp) * 100) : 100;
                    const threshold = (pageName === 'First Warning') ? 90 : (pageName === 'Second Warning') ? 70 : 50;
                    if (hpPct > threshold) {
                        this.showNotification(`${pageName}: Condition not met — Max HP must be under ${threshold}%`, 'warning');
                        // Revert placement: free the die and return page to hand
                        if (this.encounterState && this.encounterState.diceAssignments) {
                            this.encounterState.diceAssignments.delete(selectedDiceIndex);
                            if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                        }
                        // Return to the same hand collection we removed from
                        try {
                            const pageMeta = window.pageManager?.pages?.[pageId];
                            const isSpecial = pageMeta && ((typeof pageMeta.range === 'string' && pageMeta.range.includes('Special')) || pageMeta.range === 'Mass - Summation' || pageMeta.range === 'Mass - Individual');
                            const targetHand = isSpecial ? (this.encounterState.handSpecial || (this.encounterState.handSpecial = [])) : (this.encounterState.handNormal || (this.encounterState.handNormal = []));
                            targetHand.push(pageId);
                            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                            if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                        } catch (e) { /* non-fatal */ }
                        if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                        return;
                    }
                    // Success: consume immediately and record unlock usage (no Tremor application)
                    this.showNotification(`${pageName}: Played.`, 'success');
                    // Set current Warning used level for status indicator (1/2/3)
                    try {
                        const usedLevel = (pageName === 'First Warning') ? 1 : (pageName === 'Second Warning') ? 2 : 3;
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.warningUsedLevel = usedLevel;
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    } catch (e) { /* non-fatal */ }
                    try {
                        if (!this.encounterState.unlockPagesUsedThisPhase || !(this.encounterState.unlockPagesUsedThisPhase instanceof Set)) {
                            this.encounterState.unlockPagesUsedThisPhase = new Set();
                        }
                        this.encounterState.unlockPagesUsedThisPhase.add(pageName);
                    } catch (e) { /* non-fatal */ }
                    if (this.encounterState && this.encounterState.diceAssignments) {
                        this.encounterState.diceAssignments.delete(selectedDiceIndex);
                        if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                    }
                    if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                    return;
                } catch (e) { /* non-fatal */ }
            }
            // Faith of the Promised Land: Fates Sealed — [On Play] roll 1d6 and show result in Status box (page is never lost, does not stay on a die)
            if (pageId === 467 && pageName === 'Fates Sealed') {
                try {
                    if (!this.encounterState) this.encounterState = {};
                    // Roll 1d6 for display purposes
                    const rollResult = Math.floor(Math.random() * 6) + 1; // 1-6
                    this.encounterState.fatesSealedRoll = rollResult;
                    // Mark that Fates Sealed was played so it can be shown in the Status Effects box
                    this.encounterState.fatesSealedIndicator = true;
                    // Optional notification so the roll is visible immediately
                    if (typeof this.showNotification === 'function') {
                        this.showNotification(`Fates Sealed: Rolled ${rollResult} on 1d6.`, 'info');
                    }
                    if (typeof this.updateStatusEffectsDisplay === 'function') {
                        this.updateStatusEffectsDisplay();
                    }
                    // Ensure Fates Sealed does not remain assigned to any die (On Play only)
                    if (this.encounterState && this.encounterState.diceAssignments) {
                        this.encounterState.diceAssignments.delete(selectedDiceIndex);
                        if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                    }
                } catch (e) { /* non-fatal */ }
                if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                return;
            }
            // Faith of the Promised Land: Lowly Coward — [On Play] Take 20 fixed damage and reroll the Fates Sealed 1d6 (page is never lost, does not stay on a die)
            if (pageId === 468 && pageName === 'Lowly Coward') {
                try {
                    if (!this.encounterState) this.encounterState = {};
                    // [On Play] Take 20 fixed HP damage to self
                    try {
                        const dmgVal = 20;
                        if (typeof this.applyHpDamage === 'function') {
                            this.applyHpDamage(dmgVal, 'Lowly Coward');
                        } else {
                            const curHpEl = document.getElementById('currentHp');
                            const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                            if (Number.isFinite(curHp)) {
                                const newHp = Math.max(0, curHp - dmgVal);
                                curHpEl.value = newHp;
                            }
                            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                        }
                    } catch (e) { /* non-fatal */ }
                    if (!this.encounterState.fatesSealedIndicator) {
                        // No Fates Sealed roll has been made yet; nothing to reroll
                        if (typeof this.showNotification === 'function') {
                            this.showNotification('Lowly Coward: No Fates Sealed roll to reroll yet.', 'info');
                        }
                    } else {
                        const newRoll = Math.floor(Math.random() * 6) + 1; // 1-6
                        this.encounterState.fatesSealedRoll = newRoll;
                        if (typeof this.updateStatusEffectsDisplay === 'function') {
                            this.updateStatusEffectsDisplay();
                        }
                        if (typeof this.showNotification === 'function') {
                            this.showNotification(`Lowly Coward: Rerolled Fates Sealed to ${newRoll} on 1d6.`, 'info');
                        }
                    }
                    // Ensure Lowly Coward does not remain assigned to any die (On Play only)
                    if (this.encounterState && this.encounterState.diceAssignments) {
                        this.encounterState.diceAssignments.delete(selectedDiceIndex);
                        if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                    }
                } catch (e) { /* non-fatal */ }
                if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                return;
            }
            if (pageId === 16 && pageName === 'Gi (☲)') {
                // Gi (☲) On Play effect: automatically use the page and draw 2 pages
                this.handleGiOnPlayEffect();
            }
            if (pageId === 15 && pageName === 'Gam (☵)') {
                // Gam (☵) On Play effect: restore 2 Light
                this.handleGamOnPlayEffect();
            }
            if (pageId === 13 && pageName === 'Geon (☰)') {
                // Geon (☰) On Play effect: Gain 2 Power Up this Scene
                this.handleGeonOnPlayEffect();
            }
            if (pageId === 14 && pageName === 'Gon (☷)') {
                // Gon (☷) On Play effect: Gain 2 Protection this Scene
                this.handleGonOnPlayEffect();
            }
            if (pageId === 101 && pageName === 'Reload Bullets') {
                // Draw random Thumb Ammunition
                if (typeof this.handleReloadBulletsOnPlay === 'function') {
                    this.handleReloadBulletsOnPlay();
                }
            }
            if (pageId === 102 || pageId === 103 || pageId === 104 || pageId === 105) {
                // Thumb Ammunition: make all ammo pages behave as [On Play] — disappear immediately
                if (typeof this.handleThumbAmmoOnPlay === 'function') {
                    this.handleThumbAmmoOnPlay(pageId);
                } else {
                    // Fallback: remove from dice assignment directly
                    try {
                        if (this.encounterState && this.encounterState.diceAssignments) {
                            for (let [diceIndex, assignment] of this.encounterState.diceAssignments.entries()) {
                                if (assignment && assignment.pageId === pageId) {
                                    this.encounterState.diceAssignments.delete(diceIndex);
                                    if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                                    break;
                                }
                            }
                        }
                        if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                    } catch (e) { /* non-fatal */ }
                }
            }
            if (pageId === 8 && pageName === 'Augury Infusion') {
                // Augury Infusion: toggle protection against Hana page HP penalty immediately on placement
                if (!this.encounterState) this.encounterState = {};
                const wasEnabled = !!this.encounterState.auguryInfusionProtectionEnabled;
                this.encounterState.auguryInfusionProtectionEnabled = !wasEnabled;
                this.showNotification(
                    `Augury Infusion: Protection ${this.encounterState.auguryInfusionProtectionEnabled ? 'enabled' : 'disabled'} (Hana HP penalty ${this.encounterState.auguryInfusionProtectionEnabled ? 'suppressed' : 'applies'}).`,
                    this.encounterState.auguryInfusionProtectionEnabled ? 'success' : 'info'
                );
                if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                // Gain temporary HP shield 12-24 (scene duration)
                try {
                    const gain = 12 + Math.floor(Math.random() * 13); // 12-24 inclusive
                    const prevShield = Math.max(0, Number(this.encounterState.tempShieldHp) || 0);
                    this.encounterState.tempShieldHp = prevShield + gain;
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                    this.showNotification(`Augury Infusion: Gained Shield ${gain}.`, 'success');
                } catch (e) { /* non-fatal */ }

				// Augury Infusion special placement rule:
				// - If other speed dice have pages assigned, unassign all others
				// - If no other dice were assigned, lock this speed die
				try {
					const totalAssignments = (this.encounterState && this.encounterState.diceAssignments) ? this.encounterState.diceAssignments.size : 0;
					if (totalAssignments > 1) {
						// Unassign all other dice except the one we just placed on
						const indicesToClear = [];
						this.encounterState.diceAssignments.forEach((assignment, idx) => {
							if (idx !== selectedDiceIndex) indicesToClear.push(idx);
						});
						for (const idx of indicesToClear) {
							if (typeof this.unequipPageFromDiceAtIndex === 'function') {
								this.unequipPageFromDiceAtIndex(idx);
							} else if (this.encounterState && this.encounterState.diceAssignments) {
								this.encounterState.diceAssignments.delete(idx);
							}
						}
					}
					// Disable the slowest speed die for the entire encounter (cannot be used anymore)
					if (!(this.encounterState.disabledDiceIndicesEncounter instanceof Set)) this.encounterState.disabledDiceIndicesEncounter = new Set();
					let slowestIndex = selectedDiceIndex;
					try {
						const slots = document.querySelectorAll('.hexagonal-slots .hex-slot.filled');
						let minVal = Infinity;
						slots.forEach(slot => {
							const idxAttr = slot.getAttribute('data-dice-index');
							const valAttr = slot.getAttribute('data-dice-value');
							const idx = idxAttr != null ? parseInt(idxAttr, 10) : NaN;
							const val = valAttr != null ? parseInt(valAttr, 10) : NaN;
							if (!Number.isFinite(idx) || !Number.isFinite(val)) return;
							// Prefer a die that is not already disabled
							const alreadyDisabled = this.encounterState.disabledDiceIndicesEncounter.has(idx);
							if (alreadyDisabled) return;
                        // Choose the smallest value; on ties, pick the right-most (highest index)
                        if (val < minVal || (val === minVal && (slowestIndex == null || idx > slowestIndex))) {
								minVal = val;
								slowestIndex = idx;
							}
						});
						// If all dice already disabled, fall back to selected
						if (!Number.isFinite(slowestIndex)) slowestIndex = selectedDiceIndex;
					} catch (e) { /* non-fatal */ }
					this.encounterState.disabledDiceIndicesEncounter.add(slowestIndex);
					this.showNotification(`Augury Infusion: Slowest speed die (index ${slowestIndex + 1}) disabled for the encounter.`, 'warning');
					if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
					// Consume Augury Infusion immediately (On Play): clear from this die
					if (this.encounterState && this.encounterState.diceAssignments) {
						this.encounterState.diceAssignments.delete(selectedDiceIndex);
						if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
					}
				} catch (e) { /* non-fatal */ }
                
            }
            if (pageId === 36 && pageName === 'Declared Duel') {
                // Declared Duel On Play effect: Gain 2 Haste this Scene and apply Declared Duel buff
                this.handleDeclaredDuelOnPlay();
                if (!this.encounterState) this.encounterState = {};
                // Mark Declared Duel active for this scene
                this.encounterState.declaredDuelActiveThisScene = true;
                // Global +2 Max dice power for this phase (affects ranges)
                const curGlobal = Number(this.encounterState.globalMaxPowerBonusThisPhase) || 0;
                this.encounterState.globalMaxPowerBonusThisPhase = Math.max(0, curGlobal + 2);
                this.showNotification('Declared Duel: +2 Max dice power this phase. Punition and Balestra Fente are usable.', 'success');
            }
            if (pageId === 433) {
                // Poise Exchange On Play effect: stepwise +5 Poise Potency, then +1 Bind until a die reaches 1
                if (typeof this.handlePoiseExchangeOnPlay === 'function') {
                    this.handlePoiseExchangeOnPlay();
                }
            }
            if (pageName === 'Punition') {
                // Ensure presence-based toggle runs when this page is assigned
                if (typeof this.handlePunitionPresence === 'function') this.handlePunitionPresence();
            }
            if (pageName === 'Balestra Fente') {
                // Ensure presence-based toggle runs when this page is assigned
                if (typeof this.handleBalestraFentePresence === 'function') this.handleBalestraFentePresence();
            }
            if (pageId === 445 && pageName === 'Composed Breathing') {
                // Composed Breathing: [On Play] Exchange 5 Poise Potency for Jackpot
                try {
                    if (!this.encounterState) this.encounterState = {};
                    const curPot = Math.max(0, Number(this.encounterState.poisePotencyThisScene) || 0);
                    if (curPot >= 5) {
                        this.encounterState.poisePotencyThisScene = curPot - 5;
                        // Note: Count is not spent, only Potency
                        let newJack = 0;
                        if (typeof this.addJackpotThisScene === 'function') {
                            newJack = this.addJackpotThisScene(1);
                        } else {
                            const curJack = Math.max(0, Number(this.encounterState.jackpotCountThisScene) || 0);
                            newJack = Math.max(0, Math.min(99, curJack + 1));
                            this.encounterState.jackpotCountThisScene = newJack;
                            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        }
                        this.showNotification(`Composed Breathing: Exchanged 5 Poise Potency for 1 Jackpot. Now Jackpot ${newJack}.`, 'success');
                        // Remove from dice immediately (On Play effect)
                        if (this.encounterState && this.encounterState.diceAssignments) {
                            this.encounterState.diceAssignments.delete(selectedDiceIndex);
                            if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                        }
                        // Return to hand (On Play pages return to hand after use)
                        try {
                            const pageMeta = window.pageManager?.pages?.[pageId];
                            const isSpecial = pageMeta && ((typeof pageMeta.range === 'string' && pageMeta.range.includes('Special')) || pageMeta.range === 'Mass - Summation' || pageMeta.range === 'Mass - Individual');
                            const targetHand = isSpecial ? (this.encounterState.handSpecial || (this.encounterState.handSpecial = [])) : (this.encounterState.handNormal || (this.encounterState.handNormal = []));
                            targetHand.push(pageId);
                            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                            if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                        } catch (e) { /* non-fatal */ }
                        if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                    } else {
                        this.showNotification('Composed Breathing: Not enough Poise Potency to exchange (needs 5 Potency).', 'info');
                        // Revert placement
                        if (this.encounterState && this.encounterState.diceAssignments) {
                            this.encounterState.diceAssignments.delete(selectedDiceIndex);
                            if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                        }
                        // Return to hand
                        try {
                            const pageMeta = window.pageManager?.pages?.[pageId];
                            const isSpecial = pageMeta && ((typeof pageMeta.range === 'string' && pageMeta.range.includes('Special')) || pageMeta.range === 'Mass - Summation' || pageMeta.range === 'Mass - Individual');
                            const targetHand = isSpecial ? (this.encounterState.handSpecial || (this.encounterState.handSpecial = [])) : (this.encounterState.handNormal || (this.encounterState.handNormal = []));
                            targetHand.push(pageId);
                            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                            if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                        } catch (e) { /* non-fatal */ }
                        if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                    }
                } catch (e) { /* non-fatal */ }
            }
            if (pageId === 451 && pageName === 'Mark of the Wolves') {
                // Mark of the Wolves: [On Play] Inflict Smell of Fear; Prioritize "Gafstering Luckhold"
                try {
                    if (!this.encounterState) this.encounterState = {};
                    // Set Smell of Fear flag (this would affect targeting priority)
                    this.encounterState.smellOfFearActive = true;
                    this.encounterState.prioritizeGafsteringLuckhold = true;
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification('Mark of the Wolves: Inflicted Smell of Fear; Prioritizing "Gafstering Luckhold".', 'success');
                    // Remove from dice immediately (On Play effect)
                    if (this.encounterState && this.encounterState.diceAssignments) {
                        this.encounterState.diceAssignments.delete(selectedDiceIndex);
                        if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                    }
                    if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                } catch (e) { /* non-fatal */ }
            }
            if (pageId === 456 && pageName === 'Time to end this Charade.') {
                // Time to end this Charade.: [On Use] Gain 5 Poise Potency and 2 Count (triggers when placed on dice)
                try {
                    // [On Use] Effect: Always gain Poise when placed on dice
                    // Track that this page granted Poise so we can remove it when unequipped
                    if (!this.encounterState) this.encounterState = {};
                    if (!this.encounterState.pagesGrantedOnUsePoise) {
                        this.encounterState.pagesGrantedOnUsePoise = new Map();
                    }
                    // Mark that this page granted 5 Potency and 2 Count
                    this.encounterState.pagesGrantedOnUsePoise.set(pageId, { potency: 5, count: 2 });
                    
                    if (typeof this.addPoiseThisScene === 'function') {
                        this.addPoiseThisScene(5, 2);
                    } else {
                        const curPot = Number(this.encounterState.poisePotencyThisScene) || 0;
                        const curCnt = Number(this.encounterState.poiseCountThisScene) || 0;
                        this.encounterState.poisePotencyThisScene = Math.max(0, Math.min(99, curPot + 5));
                        this.encounterState.poiseCountThisScene = Math.max(0, Math.min(99, curCnt + 2));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    this.showNotification('Time to end this Charade. [On Use]: Gained 5 Poise Potency and 2 Count.', 'success');
                } catch (e) { /* non-fatal */ }
            }
            // Modified K Corp Ampule: [On Play] Gain 1 Modified K Corp Ampule (stack) and Heal 20% of missing HP
            if (pageName === 'Modified K Corp Ampule') {
                try {
                    if (!this.encounterState) this.encounterState = {};
                    const prevStacks = Number(this.encounterState.modifiedAmpuleStacks) || 0;
                    this.encounterState.modifiedAmpuleStacks = Math.max(0, prevStacks + 1);
                    this.showNotification('Modified K Corp Ampule: Gained 1 stack.', 'success');
                    // Heal 20% of missing HP on play
                    const curHpEl = document.getElementById('currentHp');
                    const maxHpEl = document.getElementById('maxHp');
                    const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                    const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                    if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
                        const missing = Math.max(0, maxHp - curHp);
                        if (missing > 0) {
                            const heal = Math.ceil(missing * 0.2);
                            const newHp = Math.min(maxHp, curHp + heal);
                            curHpEl.value = newHp;
                            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                            this.showNotification(`Modified K Corp Ampule: Healed ${newHp - curHp} HP (On Play).`, 'success');
                        }
                    }
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                } catch (e) { /* non-fatal */ }
            }
            if (pageId === 43 && pageName === 'Focused Attack') {
                // Focused Attack: increase stacks by 1 on play
                if (typeof this.addFocusedAttackStacks === 'function') {
                    this.addFocusedAttackStacks(1);
                } else {
                    if (!this.encounterState) this.encounterState = {};
                    const cur = Number(this.encounterState.focusedAttackStacks) || 0;
                    this.encounterState.focusedAttackStacks = Math.max(0, cur + 1);
                }
                this.showNotification('Focused Attack: +1 stack applied.', 'success');
            }
            if (pageId === 97 && pageName === 'Bona Fide') {
                // Bona Fide: [On Play] Roll a 1d20, show result instantly and in Combat Phase Results
                if (!this.encounterState) this.encounterState = {};
                // Roll 1d20
                const rollResult = Math.floor(Math.random() * 20) + 1; // 1-20
                // Store the roll result for display in Combat Phase Results
                this.encounterState.bonaFideOnPlayRoll = rollResult;
                
                // Immediately display the result in a popup
                const bonaFidePage = window.pageManager?.pages?.[pageId];
                if (bonaFidePage && typeof this.displayCombatResults === 'function') {
                    const instantResults = [{
                        pageId: pageId,
                        pageName: 'Bona Fide',
                        diceCount: 1,
                        diceResults: [rollResult],
                        diceRanges: ['1-20'],
                        totalDamage: 0,
                        message: `Bona Fide: [On Play] Rolled ${rollResult} on 1d20`
                    }];
                    this.displayCombatResults(instantResults, 'Bona Fide - On Play Result');
                }
                
                this.showNotification(`Bona Fide: Rolled ${rollResult} on 1d20.`, 'success');
                // Remove Bona Fide from dice assignments immediately after use (On Play effect)
                if (this.encounterState && this.encounterState.diceAssignments) {
                    this.encounterState.diceAssignments.delete(selectedDiceIndex);
                    if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                }
                if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                return;
            }
                if (pageId === 19 && pageName === 'Defensive Stance') {
                    // Sync stance buff strictly to whether Defensive Stance is assigned
                    this.handleZweiDefensiveStanceOnPlay();
                }

                // Usage gates
                if ((pageId === 24 && pageName === 'Your Shield') || (pageId === 27 && pageName === 'Combat Preparation') || (pageName === 'Punition') || (pageName === 'Balestra Fente') || (pageName === 'Riposte') || (pageName === 'Contre Attaque') || (pageName === 'Salut')) {
                    const requiresZwei = (pageName === 'Your Shield' || pageName === 'Combat Preparation');
                    const requiresDeclared = (pageName === 'Punition' || pageName === 'Balestra Fente');
                    const needsFocused = (pageName === 'Riposte' || pageName === 'Contre Attaque' || pageName === 'Salut');

                    let shouldGate = false;
                    let gateMessage = '';

                    if (requiresZwei) {
                        const active = !!(this.encounterState && this.encounterState.zweiDefensiveStanceActive === true);
                        if (!active) {
                            shouldGate = true;
                            gateMessage = 'You can only use this page while Zwei\'s Defensive Stance is active.';
                        }
                    }

                    if (requiresDeclared) {
                        // Declared Duel must be active this scene
                        let declaredDuelOk = !!(this.encounterState && this.encounterState.declaredDuelActiveThisScene === true);
                        try {
                            if (!declaredDuelOk && this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.size > 0) {
                                for (const a of this.encounterState.diceAssignments.values()) {
                                    const p = window.pageManager?.pages?.[a.pageId];
                                    if (p && p.name === 'Declared Duel') { declaredDuelOk = true; break; }
                                }
                            }
                        } catch (e) { /* non-fatal */ }
                        if (!declaredDuelOk) {
                            shouldGate = true;
                            gateMessage = 'You can only use this page while Declared Duel is active.';
                        }
                    }

                    if (needsFocused) {
                        const hasFocused = Number(this.encounterState?.focusedAttackStacks) > 0;
                        if (!hasFocused) {
                            shouldGate = true;
                            gateMessage = 'You can only use this page while Focused Attack is active.';
                        }
                    }

                    if (shouldGate) {
                        // Remove this assignment and return the card to hand
                        if (this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.has(selectedDiceIndex)) {
                            this.encounterState.diceAssignments.delete(selectedDiceIndex);
                            const pg = window.pageManager?.pages?.[pageId];
                            const isSpecialPg = !!(pg && ((typeof pg.range === 'string' && pg.range.includes('Special')) || pg.range === 'Mass - Summation' || pg.range === 'Mass - Individual'));
                            if (isSpecialPg) {
                                if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
                                this.encounterState.handSpecial.push(pageId);
                            } else {
                                if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
                                this.encounterState.handNormal.push(pageId);
                            }
                            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                            if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                            
                            this.updateDiceVisualState(selectedDiceValues);
                            this.handleZweiDefensiveStanceOnPlay();
                            if (typeof this.handleBalestraFentePresence === 'function') this.handleBalestraFentePresence();
                        }
                        this.showNotification(gateMessage || 'Cannot use this page due to current requirements.', 'warning');
                        return;
                    }
                }

                // Gate: True Trigram Formation can only be used after all Four Trigrams have been used in the current cycle
                if (pageId === 12 && pageName === 'True Trigram Formation') {
                    let trigramCycleComplete = false;
                    try {
                        const cycle = this.encounterState?.trigramCycleUsed;
                        const required = new Set([13, 14, 15, 16]);
                        if (cycle instanceof Set) {
                            let count = 0;
                            required.forEach(id => { if (cycle.has(id)) count += 1; });
                            trigramCycleComplete = count >= 4;
                        } else if (Array.isArray(cycle)) {
                            const unique = new Set(cycle.filter(id => required.has(id)));
                            trigramCycleComplete = unique.size >= 4;
                        }
                    } catch (e) { /* non-fatal */ }
                    if (!trigramCycleComplete) {
                        // Remove this assignment and return the card to hand
                        if (this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.has(selectedDiceIndex)) {
                            this.encounterState.diceAssignments.delete(selectedDiceIndex);
                            try {
                                const pageMeta = window.pageManager?.pages?.[pageId];
                                const isSpecial = pageMeta && ((typeof pageMeta.range === 'string' && pageMeta.range.includes('Special')) || pageMeta.range === 'Mass - Summation' || pageMeta.range === 'Mass - Individual');
                                const targetHand = (this.currentEditingHandType === 'special' || isSpecial)
                                    ? (this.encounterState.handSpecial || (this.encounterState.handSpecial = []))
                                    : (this.encounterState.handNormal || (this.encounterState.handNormal = []));
                                targetHand.push(pageId);
                                this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                                if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                            } catch (e) { /* non-fatal */ }
                            this.updateDiceVisualState(selectedDiceValues);
                        }
                        this.showNotification('True Trigram Formation can only be used after using all Four Trigrams.', 'warning');
                        return;
                    }
                }
            
            // Gate: Execution Imminent can only be used while a Warning is active
            if (pageName === 'Execution Imminent') {
                const activeWarningLevel = Math.max(0, Number(this.encounterState?.warningUsedLevel) || 0);
                if (activeWarningLevel <= 0) {
                    // Remove this assignment and return the card to the correct hand (normal vs special)
                    if (this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.has(selectedDiceIndex)) {
                        this.encounterState.diceAssignments.delete(selectedDiceIndex);
                        try {
                            const pageMeta = window.pageManager?.pages?.[pageId];
                            const isSpecial = pageMeta && ((typeof pageMeta.range === 'string' && pageMeta.range.includes('Special')) || pageMeta.range === 'Mass - Summation' || pageMeta.range === 'Mass - Individual');
                            const targetHand = (this.currentEditingHandType === 'special' || isSpecial)
                                ? (this.encounterState.handSpecial || (this.encounterState.handSpecial = []))
                                : (this.encounterState.handNormal || (this.encounterState.handNormal = []));
                            targetHand.push(pageId);
                            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                            if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                        } catch (e) { /* non-fatal */ }
                        this.updateDiceVisualState(selectedDiceValues);
                    }
                    this.showNotification('Execution Imminent can only be used while Warning is active.', 'warning');
                    if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                    return;
                }
            }

                // Gate: Overthrow requires 20+ Poise Potency to be usable (lock page if not met)
                if (pageName === 'Overthrow') {
                    try {
                        const poisePot = Math.max(0, Number(this.encounterState?.poisePotencyThisScene) || 0);
                        const poiseCnt = Math.max(0, Number(this.encounterState?.poiseCountThisScene) || 0);
                        if (poisePot < 20) {
                            // Remove assignment and return card to the appropriate hand
                            if (this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.has(selectedDiceIndex)) {
                                this.encounterState.diceAssignments.delete(selectedDiceIndex);
                                try {
                                    const pageMeta = window.pageManager?.pages?.[pageId];
                                    const isSpecial = pageMeta && ((typeof pageMeta.range === 'string' && pageMeta.range.includes('Special')) || pageMeta.range === 'Mass - Summation' || pageMeta.range === 'Mass - Individual');
                                    const targetHand = (this.currentEditingHandType === 'special' || isSpecial)
                                        ? (this.encounterState.handSpecial || (this.encounterState.handSpecial = []))
                                        : (this.encounterState.handNormal || (this.encounterState.handNormal = []));
                                    targetHand.push(pageId);
                                    this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                                    if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                                } catch (e) { /* non-fatal */ }
                                if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                            }
                            this.showNotification('Overthrow: Requires 20+ Poise Potency. Page locked.', 'warning');
                            if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
                            return;
                        }
                        // If 20+ Potency and 10+ Count at placement, set a flag to guarantee nat 20 and defer spending to roll time
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.overthrowForceNat20ThisPhase = (poisePot >= 20 && poiseCnt >= 10);
                        if (this.encounterState.overthrowForceNat20ThisPhase) {
                            this.showNotification('Overthrow: Nat 20 prepared. 10 Poise Count will be spent at Start Combat.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

            // Show success notification
            this.showNotification(`Placed die ${selectedDiceValue} on ${pageName}`, 'success');
            
            // Update the visual state of the placed dice
            this.updateDiceVisualState(selectedDiceValues);
            // Re-sync stance and presence-based page effects
            this.handleZweiDefensiveStanceOnPlay();
            if (typeof this.handleBalestraFentePresence === 'function') this.handleBalestraFentePresence();
            
            // Keep CURRENT LIGHT updated after assignment
            if (typeof this.updateCurrentLight === 'function') {
                this.updateCurrentLight();
            }
            
            // Hide the popup
            this.hideDicePlacementPopup();
            
            // Log the assignment for debugging
            console.log(`Dice placement confirmed: ${selectedDiceValue} (index ${selectedDiceIndex}) on ${pageName}`);
            console.log('Current dice assignments:', Object.fromEntries(this.encounterState.diceAssignments));
            
            // Additional debugging: show which dice positions are occupied
            const occupiedPositions = Array.from(this.encounterState.diceAssignments.values()).map(assignment => assignment.index);
            console.log('Occupied dice positions:', occupiedPositions);
        }
        
        // Helper method to get the current page ID from the popup
        getCurrentPageIdFromPopup() {
            // Use the stored page ID for more reliable tracking
            if (this.currentEditingPageId) {
                return this.currentEditingPageId;
            }
            
            // Fallback to name matching if stored ID is not available
            const pageName = document.getElementById('dicePopupPageName').textContent;
            
            // Find the page ID by matching the name
            if (this.encounterState && this.encounterState.hand) {
                for (const pageId of this.encounterState.hand) {
                    const page = window.pageManager?.pages[pageId];
                    if (page && page.name === pageName) {
                        return pageId;
                    }
                }
            }
            
            return null;
        }
        
        // Update the visual state of placed dice
        updateDiceVisualState(placedDiceValues) {
            const hexSlots = document.querySelectorAll('.hex-slot.filled');
            
            hexSlots.forEach((slot, index) => {
                const diceValue = slot.getAttribute('data-dice-value');
                if (diceValue) {
                    // Check if this dice position was placed by looking at the assignments
                    const isPlaced = Array.from(this.encounterState.diceAssignments.values()).some(assignment => assignment.index === index);
                    
                    if (isPlaced) {
                        // Remove any existing placed indicator
                        const existingIndicator = slot.querySelector('.dice-placed-indicator');
                        if (existingIndicator) {
                            existingIndicator.remove();
                        }
                        
                        // Add "lights up" effect for occupied dice
                        slot.style.boxShadow = '0 0 20px #ffeb3b, 0 0 40px #ffeb3b, 0 0 60px #ffeb3b';
                        slot.style.filter = 'brightness(1.3) saturate(1.2)';
                        slot.style.transform = 'scale(1.05)';
                        slot.style.transition = 'all 0.3s ease';
                        
                        // Add a subtle glow animation
                        slot.style.animation = 'diceGlow 2s ease-in-out infinite alternate';
                        // Show locked overlay if this die is locked
                        const lockEl = slot.querySelector('.locked-dice-overlay');
                        const isDisabled = !!(this.encounterState && this.encounterState.disabledDiceIndicesEncounter instanceof Set && this.encounterState.disabledDiceIndicesEncounter.has(index));
                        if (lockEl) lockEl.style.display = isDisabled ? 'block' : 'none';
                    } else {
                        // Reset to normal state for unoccupied dice
                        slot.style.boxShadow = '';
                        slot.style.filter = '';
                        slot.style.transform = '';
                        slot.style.animation = '';
                        
                        // Remove any existing placed indicator
                        const existingIndicator = slot.querySelector('.dice-placed-indicator');
                        if (existingIndicator) {
                            existingIndicator.remove();
                        }
                        // Hide locked overlay if not placed
                        const lockEl = slot.querySelector('.locked-dice-overlay');
                        const isDisabled = !!(this.encounterState && this.encounterState.disabledDiceIndicesEncounter instanceof Set && this.encounterState.disabledDiceIndicesEncounter.has(index));
                        if (lockEl) lockEl.style.display = isDisabled ? 'block' : 'none';
                    }
                }
            });
            // After any dice visual/state change, re-evaluate presence-based effects
            if (typeof this.handleBalestraFentePresence === 'function') this.handleBalestraFentePresence();
            if (typeof this.handlePunitionPresence === 'function') this.handlePunitionPresence();
        }
        
        // Hide the dice placement popup
        hideDicePlacementPopup() {
            const popup = document.getElementById('dicePlacementPopup');
            if (popup) {
                popup.classList.remove('show');
            }
            
            // Clear all stored references when popup is hidden
            this.currentEditingPageId = null;
            this.currentEditingPageIndex = null;
        }
        
        // Toggle owned pages popup
        toggleOwnedPagesPopup() {
            const popup = document.getElementById('ownedPagesPopup');
            if (!popup) return;
            
            if (popup.classList.contains('show')) {
                this.hideOwnedPagesPopup();
            } else {
                this.showOwnedPagesPopup();
            }
        }
        
        // Show owned pages popup
        showOwnedPagesPopup() {
            const popup = document.getElementById('ownedPagesPopup');
            if (!popup) return;
            
            // Restore the previous preview state
            this.restorePreviewState();
            
            // Update the owned pages display
            this.updateOwnedPagesDisplay();
            
            // Show the popup
            popup.classList.add('show');
            
            // Add close event listeners
            const closeBtn = popup.querySelector('.close-popup');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hideOwnedPagesPopup());
            }
            
            // Set up search functionality
            const searchInput = document.getElementById('ownedPagesSearch');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.filterOwnedPages(e.target.value));
            }
            
            // Close on background click
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.hideOwnedPagesPopup();
                }
            });
        }
        
        // Hide owned pages popup
        hideOwnedPagesPopup() {
            const popup = document.getElementById('ownedPagesPopup');
            if (popup) {
                // Auto-save the current preview state before closing
                this.autoSavePreviewState();
                popup.classList.remove('show');
            }
        }
        
        // Update owned pages display in popup
        updateOwnedPagesDisplay() {
            const display = document.querySelector('.owned-pages-display');
            const cardsGrid = document.getElementById('cardsGrid');
            if (!display || !cardsGrid) return;
            
			// Get owned pages from current character and filter out Trigram pages only
            const allOwnedPages = this.currentCharacter?.ownedPages || [];
			const ownedPages = allOwnedPages.filter(pageId => {
				const pageData = this.getPageData(pageId);
				if (!pageData) return false;
				if ([13, 14, 15, 16].includes(pageId)) return false;
				return true;
			});
            
            if (ownedPages.length === 0) {
                display.innerHTML = '<div class="empty-inventory">No pages owned</div>';
                cardsGrid.innerHTML = '<div class="empty-inventory">No pages in preview</div>';
                return;
            }
            
            // Create owned pages list with enhanced styling
            let html = '';
            ownedPages.forEach(pageId => {
                const pageData = this.getPageData(pageId);
                if (pageData) {
                    const diceCount = pageData.dice && !isNaN(parseInt(pageData.dice)) ? parseInt(pageData.dice) : '-';
                    const range = pageData.range || 'Unknown';
                    const keywords = pageData.keywords ? 
                        (Array.isArray(pageData.keywords) ? pageData.keywords.join(', ') : pageData.keywords) : 
                        'None';
                    
                    const lightUsage = typeof pageData.lightUsage !== 'undefined' ? pageData.lightUsage : 0;
                    // List view
                    html += `
                        <div class="page-item" data-page="${pageId}">
                            <div class="page-name">${pageData.name}</div>
                            <div class="page-category">Type: ${pageData.category || 'Unknown'}</div>
                            <div class="page-range">Range: ${range}</div>
                            <div class="page-keywords">Keywords: ${keywords}</div>
                            <div class="page-cost">${diceCount} Dice</div>
                            <div class="page-light-cost">${lightUsage} Light</div>
                            <button class="remove-owned-page-btn" data-page="${pageId}">Remove</button>
                        </div>
                    `;
                }
            });
            
            display.innerHTML = html;
            
            // Update the cards grid with preview collection
            this.updateCardsGrid();
            
            // Add click handlers for owned pages (list view) - add to preview
            display.querySelectorAll('.page-item').forEach(item => {
                item.addEventListener('click', () => {
                    const pageId = parseInt(item.getAttribute('data-page'));
                    this.addToPreview(pageId);
                });
            });

            // Wire up remove buttons (do not trigger add-to-preview)
            display.querySelectorAll('.remove-owned-page-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const pageId = parseInt(btn.getAttribute('data-page'));
                    this.removeOwnedPage(pageId);
                });
            });
        }
        
        // Update the cards grid with preview collection
        updateCardsGrid() {
            const cardsGrid = document.getElementById('cardsGrid');
            if (!cardsGrid) return;
            
            let cardsHtml = '';
            
            // Always create 9 slots (3x3 grid)
            for (let i = 0; i < 9; i++) {
                if (i < this.previewCollection.length) {
                    // Create a card for pages in preview
                    const pageId = this.previewCollection[i];
                    const pageData = this.getPageData(pageId);
                    if (pageData) {
						const diceCount = pageData.dice && !isNaN(parseInt(pageData.dice)) ? parseInt(pageData.dice) : '-';
						const costColor = this.getCostColor(diceCount);
						const typeColor = this.getTypeColor(pageData.category);
						const rangeLabel = pageData.range || '—';
						const rangeIcon = this.getRangeIconPath(rangeLabel);
                        const effects = this.getEffectIcons(pageData);
                        
                        const lightUsage = typeof pageData.lightUsage !== 'undefined' ? pageData.lightUsage : 0;
						const lightCostImage = this.getLightCostImage(lightUsage);
						cardsHtml += `
							<div class="page-card carddesign" data-page="${pageId}">
								<img class="range-icon" src="${rangeIcon}" alt="range" />
								<img class="card-light-usage" src="${lightCostImage}" alt="${lightUsage} Light" />
                                <div class="card-title">${pageData.name}</div>
                                <div class="card-illustration">
                                </div>
                                <div class="card-effects">
                                    ${effects}
                                </div>
                            </div>
                        `;
                    }
                } else {
                    // Create empty slot
                    cardsHtml += `
                        <div class="empty-card-slot">
                            <div>Empty Slot</div>
                            <div style="font-size: 0.7em; margin-top: 4px;">Click a page to add</div>
                        </div>
                    `;
                }
            }
            
            cardsGrid.innerHTML = cardsHtml;
            
            // Add click handlers for cards - remove from preview
            cardsGrid.querySelectorAll('.page-card').forEach(card => {
                card.addEventListener('click', () => {
                    const pageId = parseInt(card.getAttribute('data-page'));
                    this.removeFromPreview(pageId);
                });
                
				// Add hover functionality for all page categories
                card.addEventListener('mouseenter', (e) => {
                    const pageId = parseInt(card.getAttribute('data-page'));
                    const pageData = this.getPageData(pageId);
					if (pageData) {
                        this.showDiceTooltip(e, pageData);
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    this.hideDiceTooltip();
                });
            });
        }
        
        showDiceTooltip(event, pageData) {
            const diceInfo = this.getDiceInfo(pageData);
            if (diceInfo.length === 0) return;
            
            let tooltipContent = `<div class="dice-tooltip-content">`;
            tooltipContent += `<div class="dice-tooltip-title">${pageData.name}</div>`;
            tooltipContent += `<div class="dice-tooltip-category">${pageData.pageCategory}</div>`;
            
				diceInfo.forEach((dice, index) => {
                tooltipContent += `<div class="dice-tooltip-dice">`;
                
                if (dice.dice === 0) {
                    // Special case for no dice
                    tooltipContent += `${dice.special.replace(/\\n/g, '<br>')}`;
                } else {
						const isClash = typeof dice.type === 'string' && dice.type.startsWith('Clash Dice -');
						const atkType = isClash ? dice.type.replace('Clash Dice - ', '') : dice.type;
						const icon = this.renderTypeIcon(atkType, isClash);
						const coloredRange = this.colorizeRange(dice.range || '', dice.damage);
						const special = dice.special ? `<span class="dice-special">${dice.special.replace(/\\n/g, ' ')}</span>` : '';
						const parts = [icon, coloredRange, special].filter(Boolean);
						tooltipContent += parts.join(' ');
                }
                tooltipContent += `</div>`;
            });
            
            tooltipContent += `</div>`;
            
            // Create or update tooltip
            let tooltip = document.getElementById('diceTooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'diceTooltip';
                document.body.appendChild(tooltip);
            }
            
            tooltip.innerHTML = tooltipContent;
            tooltip.style.display = 'block';
            
            // Position tooltip
            const rect = event.target.getBoundingClientRect();
            const tooltipWidth = 300; // max-width from CSS
            const tooltipHeight = 150; // estimated height
            
            let left = rect.right + 10;
            let top = rect.top + rect.height / 2;
            
            // Adjust if tooltip would go off screen
            if (left + tooltipWidth > window.innerWidth) {
                left = rect.left - tooltipWidth - 10;
            }
            
            if (top + tooltipHeight / 2 > window.innerHeight) {
                top = window.innerHeight - tooltipHeight - 10;
            }
            
            if (top < 10) {
                top = 10;
            }
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.style.transform = 'translateY(-50%)';
        }
        
        // Hide dice tooltip
        hideDiceTooltip() {
            const tooltip = document.getElementById('diceTooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        }

        // Get status effect description by class name
        getStatusEffectDescription(effectClass) {
            const descriptions = getStatusEffectDescriptions();
            return descriptions[effectClass] || { name: effectClass.replace('effect-', '').replace(/-/g, ' '), description: 'Status effect information not available.' };
        }

        // Show status effect tooltip
        showStatusEffectTooltip(event, effectClass, value = null, additionalInfo = null) {
            const effectInfo = this.getStatusEffectDescription(effectClass);
            
            let tooltipContent = `<div class="status-effect-tooltip-title">${effectInfo.name}</div>`;
            
            // Special handling for Warning to show level-specific message
            let descriptionText = effectInfo.description;
            if (effectClass === 'effect-warning' && value !== null && effectInfo.messages && effectInfo.messages[value]) {
                descriptionText = effectInfo.messages[value];
            }
            tooltipContent += `<div class="status-effect-tooltip-description">${descriptionText}</div>`;
            
            if (value !== null) {
                tooltipContent += `<div class="status-effect-tooltip-value">Current Value: ${value}</div>`;
            }
            
            if (additionalInfo) {
                tooltipContent += `<div class="status-effect-tooltip-value">${additionalInfo}</div>`;
            }
            
            // Create or update tooltip
            let tooltip = document.getElementById('statusEffectTooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'statusEffectTooltip';
                document.body.appendChild(tooltip);
            }
            
            tooltip.innerHTML = tooltipContent;
            tooltip.style.display = 'block';
            
            // Position tooltip
            const rect = event.target.getBoundingClientRect();
            const tooltipWidth = 300;
            const tooltipHeight = 150;
            
            let left = rect.right + 10;
            let top = rect.top + rect.height / 2;
            
            // Adjust if tooltip would go off screen
            if (left + tooltipWidth > window.innerWidth) {
                left = rect.left - tooltipWidth - 10;
            }
            if (top + tooltipHeight / 2 > window.innerHeight) {
                top = window.innerHeight - tooltipHeight - 10;
            }
            if (top < 0) {
                top = 10;
            }
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.style.transform = 'translateY(-50%)';
        }

        // Hide status effect tooltip
        hideStatusEffectTooltip() {
            const tooltip = document.getElementById('statusEffectTooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        }

        // Attach hover handlers to a status effect item
        attachStatusEffectHoverHandlers(item, effectClass, value = null, additionalInfo = null) {
            const self = this;
            item.addEventListener('mouseenter', function(e) {
                self.showStatusEffectTooltip(e, effectClass, value, additionalInfo);
            });
            item.addEventListener('mouseleave', function() {
                self.hideStatusEffectTooltip();
            });
        }

        // Add page to preview collection
        addToPreview(pageId) {
            if (this.previewCollection.length >= 9) {
                this.showNotification('Preview collection is full (9/9 slots)', 'warning');
                return;
            }
            
            if (!this.previewCollection.includes(pageId)) {
                this.previewCollection.push(pageId);
                this.updateCardsGrid();
                this.showNotification(`Added ${this.getPageData(pageId).name} to preview`, 'success');
            } else {
                this.showNotification(`${this.getPageData(pageId).name} is already in preview`, 'warning');
            }
        }
        
        // Remove page from preview collection
        removeFromPreview(pageId) {
            const index = this.previewCollection.indexOf(pageId);
            if (index > -1) {
                const pageName = this.getPageData(pageId).name;
                this.previewCollection.splice(index, 1);
				this.hideDiceTooltip();
                this.updateCardsGrid();
                this.showNotification(`Removed ${pageName} from preview`, 'success');
            }
        }
        
        // Remove a page from the character's owned pages list
        removeOwnedPage(pageId) {
            if (!this.currentCharacter || !Array.isArray(this.currentCharacter.ownedPages)) return;

            const beforeCount = this.currentCharacter.ownedPages.length;
            this.currentCharacter.ownedPages = this.currentCharacter.ownedPages.filter(id => id !== pageId);
            const afterCount = this.currentCharacter.ownedPages.length;

            // Also remove from preview if present
            const previewIndex = this.previewCollection.indexOf(pageId);
            if (previewIndex > -1) {
                this.previewCollection.splice(previewIndex, 1);
                this.updateCardsGrid();
            }

            // Persist and refresh UI
            if (typeof this.updateCharacter === 'function') {
                this.updateCharacter();
            }
            this.updateOwnedPagesDisplay();

            const pageName = (this.getPageData(pageId) || {}).name || `Page ${pageId}`;
            if (afterCount < beforeCount) {
                this.showNotification(`Removed ${pageName} from owned pages`, 'success');
            } else {
                this.showNotification(`${pageName} was not in owned pages`, 'warning');
            }
        }

        // Get page data by ID
        getPageData(pageId) {
            if (window.pageManager && window.pageManager.pages && window.pageManager.pages[pageId]) {
                return window.pageManager.pages[pageId];
            }
            return {
                name: `Page ${pageId}`,
                category: 'Unknown'
            };
        }
        
        // Get dice information
        getDiceInfo(pageData) {
            const diceData = getDiceData();
            return diceData[pageData.name] || [];
        }
        
        // Get cost color based on dice count
        getCostColor(diceCount) {
            if (diceCount === '-') return '#666666'; // Gray for unknown
            if (diceCount === 0) return '#4CAF50'; // Green
            if (diceCount === 1) return '#FF9800'; // Orange
            if (diceCount === 2) return '#9C27B0'; // Purple
            if (diceCount === 3) return '#2196F3'; // Blue
            return '#F44336'; // Red for 4+
        }
        
        // Get type color based on category
        getTypeColor(category) {
            const colors = {
                'Regular Pages': '#4CAF50',
                'Hana Association': '#FF9800',
                'Zwei Association': '#2196F3',
                'Shi Association': '#9C27B0',
                'Liu Association': '#F44336',
                'Seven Association': '#00BCD4',
                'The Thumb': '#795548',
                'The Index': '#607D8B',
                'The Middle': '#8D6E63',
                'The Ring': '#E1BEE7',
                'Kurokumo Clan': '#3F51B5',
                'Blade Lineage': '#E91E63',
                'Full Stop Office': '#FF6B35',
                'Molar Boatworks Office': '#2E7D32',
                'Dawn Office': '#FF8F00',
                'Volatile E.G.O: Waxen Pinion': '#D32F2F',
                'Gaze Office': '#7B1FA2',
                'W Corp.': '#9E9E9E',
                'T Corp.': '#FF5722',
                'N Corp.': '#673AB7',
                'K Corp.': '#4CAF50',
                'R Corp.': '#FFC107'
            };
            return colors[category] || '#4a9eff';
        }

		getDamageColor(damageType) {
			if (!damageType) return null;
			const key = String(damageType).trim().toLowerCase();
			switch (key) {
				case 'red':
					return 'red';
				case 'white':
					return '#fffee0';
				case 'black':
					return '#3a0066'; // dark purple
				case 'pale':
					return 'cyan';
				default:
					return null;
			}
		}

		// Wrap range with color span based on damage type
		colorizeRange(rangeText, damageType) {
			const color = this.getDamageColor(damageType);
			if (!rangeText) return '';
			if (!color) return `<span class="dice-range">${rangeText}</span>`;
			return `<span class="dice-range" style="color: ${color}">${rangeText}</span>`;
		}

        // Get light cost image path (0 Light = CardCostFont (10).png, 1-9 Light = CardCostFont (1-9).png)
        getLightCostImage(lightCost) {
            const cost = Math.max(0, Math.min(9, parseInt(lightCost) || 0));
            const imageNum = cost === 0 ? 10 : cost; 
            return `Other Stuff/CardDesign/LightCost/CardCostFont (${imageNum}).png`;
        }

        // Play movement sound for dice hover in placement popup
        playDiceMoveSound() {
            try {
                const audio = new Audio('Other Stuff/Dice_Move.wav');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Could not play dice move sound:', e));
            } catch (e) {
                console.log('Error creating dice move sound:', e);
            }
        }

        // Play click sound for dice selection in placement popup
        playDiceClickSound() {
            try {
                const audio = new Audio('Other Stuff/Dice_Click.wav');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Could not play dice click sound:', e));
            } catch (e) {
                console.log('Error creating dice click sound:', e);
            }
        }

        // Play apply sound when confirming page placement onto a die
        playCardApplySound() {
            try {
                const audio = new Audio('Other Stuff/Card_Apply.wav');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Could not play card apply sound:', e));
            } catch (e) {
                console.log('Error creating card apply sound:', e);
            }
        }

        // Play cancel sound when removing a page from a die
        playCardCancelSound() {
            try {
                const audio = new Audio('Other Stuff/Card_Cancel.wav');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Could not play card cancel sound:', e));
            } catch (e) {
                console.log('Error creating card cancel sound:', e);
            }
        }
        
        // Play hover sound for hand cards
        playCardHoverSound() {
            try {
                const audio = new Audio('Other Stuff/Card_Over.wav');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Could not play hover sound:', e));
            } catch (e) {
                console.log('Error creating hover sound:', e);
            }
        }

        // Play click sound for hand cards
        playCardSelectSound() {
            try {
                const audio = new Audio('Other Stuff/Card_Select.wav');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Could not play select sound:', e));
            } catch (e) {
                console.log('Error creating select sound:', e);
            }
        }

        // Get effect icons based on page data
        getEffectIcons(pageData) {
            let icons = '';
            
            // First try to get icons from dice data to maintain the same order as in diceData.js
            const diceData = getDiceData ? getDiceData() : null;
            if (diceData && pageData.name && diceData[pageData.name]) {
                const pageDiceData = diceData[pageData.name];
                
                for (const dice of pageDiceData) {
                    if (dice.type) {
                        const iconType = dice.type.toLowerCase();
                        // Map dice types to icon classes
                        if (iconType === 'blunt') {
                            icons += '<div class="effect-icon blunt"></div>';
                        } else if (iconType === 'pierce') {
                            icons += '<div class="effect-icon pierce"></div>';
                        } else if (iconType === 'slash') {
                            icons += '<div class="effect-icon slash"></div>';
                        } else if (iconType === 'shield') {
                            icons += '<div class="effect-icon shield"></div>';
                        } else if (iconType === 'evade') {
                            icons += '<div class="effect-icon evade"></div>';
                        } else if (iconType === 'counter') {
                            icons += '<div class="effect-icon counter"></div>';
                        } else if (iconType.startsWith('clash dice - ')) {
                            const clashType = iconType.replace('clash dice - ', '');
                            if (clashType === 'blunt') {
                                icons += '<div class="effect-icon clash-blunt"></div>';
                            } else if (clashType === 'pierce') {
                                icons += '<div class="effect-icon clash-pierce"></div>';
                            } else if (clashType === 'slash') {
                                icons += '<div class="effect-icon clash-slash"></div>';
                            } else if (clashType === 'shield') {
                                icons += '<div class="effect-icon clash-shield"></div>';
                            } else if (clashType === 'evade') {
                                icons += '<div class="effect-icon clash-evade"></div>';
                            }
                        }
                    }
                }
                
                // If we found icons from dice data, return them
                if (icons) {
                    return icons;
                }
            }
            
            // Fallback to keywords if dice data is not available
            if (pageData.keywords) {
                // Handle both string and array formats for keywords
                let keywords;
                if (Array.isArray(pageData.keywords)) {
                    keywords = pageData.keywords;
                } else {
                    // Split comma-separated string and trim whitespace
                    keywords = pageData.keywords.split(',').map(k => k.trim());
                }
                
                // Map keywords to specific damage type icons only
                if (keywords.includes('Blunt')) {
                    icons += '<div class="effect-icon blunt"></div>';
                }
                if (keywords.includes('Pierce')) {
                    icons += '<div class="effect-icon pierce"></div>';
                }
                if (keywords.includes('Slash')) {
                    icons += '<div class="effect-icon slash"></div>';
                }
                if (keywords.includes('Shield')) {
                    icons += '<div class="effect-icon shield"></div>';
                }
                if (keywords.includes('Evade')) {
                    icons += '<div class="effect-icon evade"></div>';
                }
                if (keywords.includes('Counter')) {
                    icons += '<div class="effect-icon counter"></div>';
                }
            }
            
            return icons;
        }

		// Map attack type to existing icon class
		getTypeIconClass(attackType) {
			if (!attackType) return 'generic';
			const t = String(attackType).trim().toLowerCase();
			if (t.includes('slash')) return 'slash';
			if (t.includes('blunt')) return 'blunt';
			if (t.includes('pierce')) return 'pierce';
			if (t.includes('shield') || t.includes('block')) return 'shield';
			if (t.includes('evade') || t.includes('dodge')) return 'evade';
			if (t.includes('counter')) return 'counter';
			return 'generic';
		}

		// Render a small icon span for the attack type; highlight if clash
		renderTypeIcon(attackType, isClash) {
			const iconClass = this.getTypeIconClass(attackType);
			const clashClass = isClash ? `clash-${iconClass}` : iconClass;
			return `<span class="effect-icon ${clashClass}" style="margin-right: 6px;"></span>`;
		}
		
		// Map page range to range icon path
		getRangeIconPath(range) {
			const r = String(range || '').toLowerCase();
			// Melee - Single Use
			if (r.includes('melee') && r.includes('single use')) {
				return 'UI_Card/UICard_range_nearIcon_color.png';
			}
			// Ranged - Single Use
			if ((r.includes('ranged') || r.includes('range')) && r.includes('single use')) {
				return 'UI_Card/UICard_range_farIcon_color.png';
			}
			// Special or Mass ranges
			if (r.includes('special') || r === 'mass - summation' || r === 'mass - individual') {
				return 'UI_Card/UICard_range_instantIcon_color.png';
			}
			// Melee / Near
			if (r.includes('melee') || r.includes('near')) {
				return 'UI_Card/UICard_range_nearIcon_noncolor.png';
			}
			// Default to Far
			return 'UI_Card/UICard_range_farIcon_noncolor.png';
		}
        
        // Filter owned pages based on search term
        filterOwnedPages(searchTerm) {
            const display = document.querySelector('.owned-pages-display');
            if (!display) return;
            
            const pageItems = display.querySelectorAll('.page-item');
            const term = searchTerm.toLowerCase().trim();
            
            if (term === '') {
                // Show all items if search is empty
                pageItems.forEach(item => {
                    item.style.display = 'block';
                });
                return;
            }
            
            // Filter items based on search term (only affects the list view)
            pageItems.forEach(item => {
                const pageId = item.getAttribute('data-page');
                const pageData = this.getPageData(pageId);
                
                const name = pageData.name.toLowerCase();
                const category = (pageData.category || '').toLowerCase();
                const range = (pageData.range || '').toLowerCase();
                const keywords = pageData.keywords ? 
                    (Array.isArray(pageData.keywords) ? pageData.keywords.join(' ') : pageData.keywords) : 
                    '';
                const keywordsLower = keywords.toLowerCase();
                
                const matches = name.includes(term) || 
                              category.includes(term) || 
                              range.includes(term) || 
                              keywordsLower.includes(term);
                
                item.style.display = matches ? 'block' : 'none';
            });
        }
        
        // Draw cards for next scene
        drawNextScene() {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            // Ensure unlock chains (e.g., First→Second Warning) progress even if no combat phase ran
            try {
                if (typeof this.processUnlockPageEffects === 'function') {
                    this.processUnlockPageEffects();
                }
            } catch (e) { /* non-fatal */ }
            // Capture stagger state from previous scene before resetting
            const wasStaggered = (this.encounterState && this.encounterState.staggeredThisScene === true);
            // Apply end-of-scene Burn tick before starting the new scene
            try {
                const burnPot = Math.max(0, Number(this.encounterState?.burnPotency) || 0);
                const burnCnt = Math.max(0, Number(this.encounterState?.burnCount) || 0);
                if (burnPot > 0 && burnCnt > 0) {
                    const curHpEl = document.getElementById('currentHp');
                    const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                    if (Number.isFinite(curHp)) {
                        const newHp = Math.max(0, curHp - burnPot);
                        curHpEl.value = newHp;
                        const nextCnt = Math.max(0, burnCnt - 1);
                        this.encounterState.burnCount = nextCnt;
                        // If count reached 0, clear potency as well
                        if (nextCnt === 0) {
                            this.encounterState.burnPotency = 0;
                        }
                        if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        //this.showNotification(`Burn: Took ${burnPot} fixed HP damage at end of scene. (${nextCnt} scenes remaining)`, 'warning');
                        if (nextCnt === 0) {
                            //this.showNotification('Burn: Status cleared.', 'info');
                        }
                    }
                }
            } catch (e) { /* non-fatal */ }
            // Unlock placement for the new scene
            this.placementLocked = false;
            this.restorePreviewState();
            // If staggered last scene, fully restore SP at the start of this scene
            try {
                if (wasStaggered) {
                    const prudenceInput = document.getElementById('prudence');
                    const currentSpElement = document.getElementById('currentSp');
                    const maxSp = parseInt(prudenceInput?.value || '0', 10) || 0;
                    if (currentSpElement) {
                        currentSpElement.value = maxSp;
                        if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                        this.showNotification('Recovered full SP at scene start (staggered last scene).', 'success');
                    }
                }
            } catch (e) { /* non-fatal */ }
            // Clear stagger at the start of the new scene
            try {
                if (this.encounterState) this.encounterState.staggeredThisScene = false;
                if (typeof this.updateSwapButtonAppearance === 'function') this.updateSwapButtonAppearance();
                // Hide stagger overlay
                const staggerOverlay = document.getElementById('staggerOverlay');
                if (staggerOverlay) staggerOverlay.style.display = 'none';
            } catch (e) { /* non-fatal */ }
            // Reset per-scene Trigram flag
            if (!this.encounterState) this.encounterState = {};
            this.encounterState.trigramUsedThisScene = false;
            // If all four Trigrams have been used in the current cycle, reset the cycle for reuse
            try {
                if (this.encounterState.trigramCycleUsed instanceof Set) {
                    if (this.encounterState.trigramCycleUsed.size >= 4) {
                        this.encounterState.trigramCycleUsed.clear();
                    }
                } else if (Array.isArray(this.encounterState.trigramCycleUsed)) {
                    const unique = new Set(this.encounterState.trigramCycleUsed.filter(id => [13,14,15,16].includes(id)));
                    if (unique.size >= 4) {
                        this.encounterState.trigramCycleUsed = new Set();
                    }
                }
            } catch (e) {
                // non-fatal
            }
            
            // Apply any pending Emotion level-ups at scene transition
            this.applyEmotionLevelUpsOnSceneChange();
            this.updateEmotionDisplay();
            this.updateEmotionBar();
            // Reset positive/negative counters for the new scene
            if (this.encounterState) {
                this.encounterState.emotionPositive = 0;
                this.encounterState.emotionNegative = 0;
                // Allow counting a new Singleton proc this scene
                this.encounterState.singletonCountedThisScene = false;
            }
            this.updateEmotionCounts();

            const drawPerScene = this.encounterState.drawPerScene;
            // Recover +1 Light at scene start based on previous remaining Light stored in state.
            (function applySceneLightRecovery(ctx) {
                try {
                    // Prefer values persisted by updateCurrentLight
                    const prevRemainingFromState = Number(ctx.encounterState?.currentLightRemaining);
                    const parsedMaxFromState = Number(ctx.encounterState?.currentLightMax);
                    const parsedMax = Number.isFinite(parsedMaxFromState)
                        ? parsedMaxFromState
                        : parseInt((document.getElementById('maxLightValue')?.textContent ?? '').trim());
                    if (!Number.isFinite(parsedMax)) {
                        if (!ctx.encounterState) ctx.encounterState = {};
                        ctx.encounterState.lightRefundThisScene = 0;
                        return;
                    }
                    
                    const prevRemaining = Number.isFinite(prevRemainingFromState)
                        ? Math.max(0, Math.min(parsedMax, prevRemainingFromState))
                        : parsedMax; // fallback to full if unknown
                    // Default +1 bonus at scene start unless forbidden
                    const bonus = ctx.encounterState?.forbidLightGainThisEncounter ? 0 : 1;
                    const targetRemaining = Math.min(parsedMax, prevRemaining + bonus);
                    // With assignments cleared (used=0), remaining becomes parsedMax + refund.
                    // Therefore, set refund so (parsedMax + refund) = targetRemaining.
                    const refund = targetRemaining - parsedMax;
                    if (!ctx.encounterState) ctx.encounterState = {};
                    ctx.encounterState.lightRefundThisScene = refund;
                } catch (e) {
                    if (!ctx.encounterState) ctx.encounterState = {};
                    ctx.encounterState.lightRefundThisScene = 0;
                }
            })(this);

            //Blade Arc: [Scene End] Restore 1 Light
            try {
                // Check pages used this scene (tracked before diceAssignments is cleared)
                const pagesUsedThisScene = this.encounterState?.pagesUsedThisScene || new Set();
                let bladeArcUsed = false;
                // Check if Blade Arc was used by checking page IDs
                for (const pageId of pagesUsedThisScene) {
                    const p = window.pageManager?.pages?.[pageId];
                    if (p && p.name === 'Blade Arc') {
                        bladeArcUsed = true;
                        break;
                    }
                }
                if (bladeArcUsed && !this.encounterState.forbidLightGainThisEncounter) {
                    if (typeof this.encounterState.lightRefundThisScene !== 'number') {
                        this.encounterState.lightRefundThisScene = 0;
                    }
                    this.encounterState.lightRefundThisScene += 1;
                    this.showNotification('Blade Arc: [Scene End] Restored 1 Light.', 'success');
                    if (typeof this.updateCurrentLight === 'function') {
                        this.updateCurrentLight();
                    }
                }
            } catch (e) { /* non-fatal */ }

            // Slay: [Scene End] Restore 2 Light
            try {
                // Check pages used this scene (tracked before diceAssignments is cleared)
                const pagesUsedThisScene = this.encounterState?.pagesUsedThisScene || new Set();
                let slayUsed = false;
                // Check if Slay was used by checking page IDs
                for (const pageId of pagesUsedThisScene) {
                    const p = window.pageManager?.pages?.[pageId];
                    if (p && p.name === 'Slay') {
                        slayUsed = true;
                        break;
                    }
                }
                if (slayUsed && !this.encounterState.forbidLightGainThisEncounter) {
                    if (typeof this.encounterState.lightRefundThisScene !== 'number') {
                        this.encounterState.lightRefundThisScene = 0;
                    }
                    this.encounterState.lightRefundThisScene += 2;
                    this.showNotification('Slay: [Scene End] Restored 2 Light.', 'success');
                    if (typeof this.updateCurrentLight === 'function') {
                        this.updateCurrentLight();
                    }
                }
            } catch (e) { /* non-fatal */ }

            // Yield My Flesh: [Scene End] Restore 1 Light
            try {
                // Check pages used this scene (tracked before diceAssignments is cleared)
                const pagesUsedThisScene = this.encounterState?.pagesUsedThisScene || new Set();
                let yieldMyFleshUsed = false;
                // Check if Yield My Flesh was used by checking page IDs
                for (const pageId of pagesUsedThisScene) {
                    const p = window.pageManager?.pages?.[pageId];
                    if (p && p.name === 'Yield My Flesh') {
                        yieldMyFleshUsed = true;
                        break;
                    }
                }
                if (yieldMyFleshUsed && !this.encounterState.forbidLightGainThisEncounter) {
                    if (typeof this.encounterState.lightRefundThisScene !== 'number') {
                        this.encounterState.lightRefundThisScene = 0;
                    }
                    this.encounterState.lightRefundThisScene += 1;
                    this.showNotification('Yield My Flesh: [Scene End] Restored 1 Light.', 'success');
                    if (typeof this.updateCurrentLight === 'function') {
                        this.updateCurrentLight();
                    }
                }
            } catch (e) { /* non-fatal */ }

            // Reset per-scene statuses each new scene
        this.encounterState.powerUpThisScene = 0;
        this.encounterState.attackPowerUpThisScene = 0;
        this.encounterState.slashDmgUpThisScene = 0;
        this.encounterState.pierceDmgUpThisScene = 0;
        this.encounterState.bluntDmgUpThisScene = 0;
        delete this.encounterState.panicLevelThisScene;
        
        // Reset calm level (lasts for 1 Scene)
        delete this.encounterState.calmLevelThisScene;
        
        // Initialize debuff statuses for this scene
        this.encounterState.slashDmgDownThisScene = 0;
        // Apply end-of-scene effects: Modified K Corp Ampule heal and kill at 5+ stacks
        try {
            const stacks = Number(this.encounterState?.modifiedAmpuleStacks) || 0;
            if (stacks > 0) {
                const maxHpEl = document.getElementById('maxHp');
                const curHpEl = document.getElementById('currentHp');
                const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                if (Number.isFinite(maxHp) && Number.isFinite(curHp)) {
                    const heal = Math.ceil((stacks * 0.05) * maxHp);
                    const newHp = Math.min(maxHp, curHp + heal);
                    curHpEl.value = newHp;
                    if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                    this.showNotification(`Modified K Corp Ampule: Healed ${newHp - curHp} HP (${stacks} x 5%).`, 'success');
                }
                if (stacks >= 5) {
                    // Kill the user
                    const curHpEl2 = document.getElementById('currentHp');
                    if (curHpEl2) {
                        curHpEl2.value = 0;
                        if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                        this.showNotification('Modified K Corp Ampule: 5+ stacks reached. The user has been killed.', 'warning');
                    }
                }
            }
        } catch (e) { /* non-fatal */ }
        // Apply end-of-scene effects: Decay Ampule damage (X x 2% of Max HP)
        try {
            const decayStacks = Number(this.encounterState?.decayAmpuleStacks) || 0;
            if (decayStacks > 0) {
                const maxHpEl = document.getElementById('maxHp');
                const curHpEl = document.getElementById('currentHp');
                const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                if (Number.isFinite(maxHp) && Number.isFinite(curHp)) {
                    const dmg = Math.ceil((decayStacks * 0.02) * maxHp);
                    if (typeof this.applyHpDamage === 'function') {
                        this.applyHpDamage(dmg, 'Decay Ampule');
                    } else {
                        const newHp = Math.max(0, curHp - dmg);
                        curHpEl.value = newHp;
                        if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                    }
                    this.showNotification(`Decay Ampule: Took ${dmg} damage at scene end (${decayStacks} x 2%).`, 'warning');
                }
            }
        } catch (e) { /* non-fatal */ }

        this.encounterState.pierceDmgDownThisScene = 0;
        this.encounterState.bluntDmgDownThisScene = 0;
        this.encounterState.powerDownThisScene = 0;
        this.encounterState.attackPowerDownThisScene = 0;
        this.encounterState.defensePowerDownThisScene = 0;
        this.encounterState.fragileThisScene = 0;
        this.encounterState.protectionThisScene = 0;
        this.encounterState.tauntThisScene = 0;
        this.encounterState.hasteThisScene = 0;
        this.encounterState.defensePowerUpThisScene = 0;
        this.encounterState.focusedAttackStacks = 0;
        this.encounterState.focusedAttackFlatDicePowerThisScene = 0;    
        this.encounterState.bindThisScene = 0;
        if (typeof this.encounterState.chargePotencyThisScene !== 'number') {
            this.encounterState.chargePotencyThisScene = 0;
        }
        
        // Bravery persists across scenes
        if (this.encounterState && this.encounterState.braveryActiveThisScene === true) {
            this.addAttackPowerUpThisScene(10);
        }
        
        // Paralysis (fixes next X dice to minimum value)
        this.encounterState.paralysisThisScene = 0;

        // Focused Attack persists across scenes: keep stacks, only re-derive per-scene effects
        const focusedStacksAtSceneStart = Number(this.encounterState?.focusedAttackStacks) || 0;
        
        // Reset scene-level flat dice power, then reapply based on stacks
        this.encounterState.focusedAttackFlatDicePowerThisScene = (focusedStacksAtSceneStart >= 3) ? 1 : 0;
        // Reapply +1 Power Up each scene while at 2+ stacks
        if (focusedStacksAtSceneStart >= 2) {
            if (typeof this.addPowerUpThisScene === 'function') {
                this.addPowerUpThisScene(1);
            } else {
                const curPU = Number(this.encounterState.powerUpThisScene) || 0;
                this.encounterState.powerUpThisScene = Math.max(0, Math.min(10, curPU + 1));
            }
        }
            // Clear scene latches for presence-based effects
            this.encounterState.balestraFenteLatchedForScene = false;
            this.encounterState.punitionLatchedForScene = false;
            // Refresh status UI immediately after reset so cleared effects disappear
            if (typeof this.updateStatusEffectsDisplay === 'function') {
                this.updateStatusEffectsDisplay();
            }
            // Clear any expired one-scene cooldowns
            if (typeof this.encounterState.defensiveStanceCooldownUntilScene === 'number') {
                const currentScene = (typeof this.encounterState.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
                if (currentScene >= this.encounterState.defensiveStanceCooldownUntilScene) {
                    delete this.encounterState.defensiveStanceCooldownUntilScene;
                }
            }
            // Clear Ignite Weaponry cooldown if expired
            if (typeof this.encounterState.igniteWeaponryCooldownUntilScene === 'number') {
                const currentScene = (typeof this.encounterState.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
                if (currentScene >= this.encounterState.igniteWeaponryCooldownUntilScene) {
                    delete this.encounterState.igniteWeaponryCooldownUntilScene;
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                }
            }
            // Return queued pages to the correct hand (generic, runs every scene)
            try {
                const currentScene = (typeof this.encounterState.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
                const sceneForReturnCheck = currentScene + 1;
                if (Array.isArray(this.encounterState.pagesToReturnOnCooldownExpire)) {
                    const toReturn = this.encounterState.pagesToReturnOnCooldownExpire.filter(item => item.returnAtScene <= sceneForReturnCheck);
                    toReturn.forEach(item => {
                        try {
                            const pg = window.pageManager?.pages?.[item.pageId];
                            const isSpecialPg = !!(pg && ((typeof pg.range === 'string' && pg.range.includes('Special')) || pg.range === 'Mass - Summation' || pg.range === 'Mass - Individual'));
                            if (isSpecialPg) {
                                if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
                                if (!this.encounterState.handSpecial.includes(item.pageId)) {
                                    this.encounterState.handSpecial.push(item.pageId);
                                }
                            } else {
                                if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
                                const count = this.encounterState.handNormal.filter(id => id === item.pageId).length;
                                if (count < 3) {
                                    this.encounterState.handNormal.push(item.pageId);
                                }
                            }
                            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                        } catch (e) { /* non-fatal */ }
                    });
                    this.encounterState.pagesToReturnOnCooldownExpire = this.encounterState.pagesToReturnOnCooldownExpire.filter(item => item.returnAtScene > sceneForReturnCheck);
                    if (toReturn.length > 0 && typeof this.updateHandDisplay === 'function') {
                        this.updateHandDisplay();
                    }
                }
            } catch (e) { /* non-fatal */ }
            // Consume any next-scene queued statuses
            if (typeof this.encounterState.slashDmgUpNextScene === 'number' && this.encounterState.slashDmgUpNextScene > 0) {
                const toApply = this.encounterState.slashDmgUpNextScene;
                if (typeof this.addSlashDmgUpThisScene === 'function') {
                    this.addSlashDmgUpThisScene(toApply);
                } else {
                    this.encounterState.slashDmgUpThisScene = Math.max(0, Math.min(10, toApply));
                }
                this.encounterState.slashDmgUpNextScene = 0;
                this.showNotification(`Gained ${toApply} Slash DMG Up for this scene.`, 'success');
            }
            if (typeof this.encounterState.protectionNextScene === 'number' && this.encounterState.protectionNextScene > 0) {
                const toApply = this.encounterState.protectionNextScene;
                if (typeof this.addProtectionThisScene === 'function') {
                    this.addProtectionThisScene(toApply);
                } else {
                    this.encounterState.protectionThisScene = Math.max(0, Math.min(10, toApply));
                }
                this.encounterState.protectionNextScene = 0;
                this.showNotification(`Gained ${toApply} Protection for this scene.`, 'success');
            }
            // Consume queued Defense Power Up for this scene
            if (typeof this.encounterState.defensePowerUpNextScene === 'number' && this.encounterState.defensePowerUpNextScene > 0) {
                const toApply = this.encounterState.defensePowerUpNextScene;
                if (typeof this.addDefensePowerUpThisScene === 'function') {
                    this.addDefensePowerUpThisScene(toApply);
                } else {
                    this.encounterState.defensePowerUpThisScene = Math.max(0, Math.min(10, toApply));
                }
                this.encounterState.defensePowerUpNextScene = 0;
                this.showNotification(`Gained ${toApply} Defense Power Up for this scene.`, 'success');
            }
            // Reset temporary HP shield each scene
            if (this.encounterState) {
                this.encounterState.tempShieldHp = 0;
                if (typeof this.updateHpSpFromStats === 'function') {
                    this.updateHpSpFromStats();
                }
            }
            
			// Consume queued Attack Power Up for this scene
			if (typeof this.encounterState.attackPowerUpNextScene === 'number' && this.encounterState.attackPowerUpNextScene > 0) {
				const toApply = this.encounterState.attackPowerUpNextScene;
				const next = Math.max(0, Math.min(10, toApply));
				this.encounterState.attackPowerUpThisScene = next;
				this.encounterState.attackPowerUpNextScene = 0;
				this.showNotification(`Gained ${toApply} Attack Power Up for this scene.`, 'success');
			}
            // Consume queued generic Power Up for this scene
            if (typeof this.encounterState.powerUpNextScene === 'number' && this.encounterState.powerUpNextScene > 0) {
                const toApply = this.encounterState.powerUpNextScene;
                if (typeof this.addPowerUpThisScene === 'function') {
                    this.addPowerUpThisScene(toApply);
                } else {
                    const cur = Number(this.encounterState.powerUpThisScene) || 0;
                    this.encounterState.powerUpThisScene = Math.max(0, Math.min(10, cur + toApply));
                }
                this.encounterState.powerUpNextScene = 0;
                this.showNotification(`Gained ${toApply} Power Up for this scene.`, 'success');
            }
            // Consume queued ally flat dice power for this scene
            if (typeof this.encounterState.allyFlatDicePowerNextScene === 'number' && this.encounterState.allyFlatDicePowerNextScene > 0) {
                const toApply = this.encounterState.allyFlatDicePowerNextScene;
                const curFlat = Number(this.encounterState.focusedAttackFlatDicePowerThisScene) || 0;
                this.encounterState.focusedAttackFlatDicePowerThisScene = Math.max(0, Math.min(10, curFlat + toApply));
                this.encounterState.allyFlatDicePowerNextScene = 0;
                this.showNotification(`Gained +${toApply} dice power to all dice for this scene.`, 'success');
            }
            if (typeof this.encounterState.tauntNextScene === 'number' && this.encounterState.tauntNextScene > 0) {
                const toApply = this.encounterState.tauntNextScene;
                if (typeof this.addTauntThisScene === 'function') {
                    this.addTauntThisScene(toApply);
                } else {
                    this.encounterState.tauntThisScene = Math.max(0, Math.min(10, toApply));
                }
                this.encounterState.tauntNextScene = 0;
                this.showNotification(`Gained ${toApply} Taunt for this scene.`, 'success');
            }
            // Consume queued Haste for this scene
            if (typeof this.encounterState.hasteNextScene === 'number' && this.encounterState.hasteNextScene > 0) {
                const toApply = this.encounterState.hasteNextScene;
                if (typeof this.addHasteThisScene === 'function') {
                    this.addHasteThisScene(toApply);
                } else {
                    this.encounterState.hasteThisScene = Math.max(0, Math.min(10, toApply));
                }
                this.encounterState.hasteNextScene = 0;
                this.showNotification(`Gained ${toApply} Haste for this scene.`, 'success');
            }
            // Consume queued Bind for this scene
            if (typeof this.encounterState.bindNextScene === 'number' && this.encounterState.bindNextScene > 0) {
                const toApply = this.encounterState.bindNextScene;
                if (typeof this.addBindThisScene === 'function') {
                    this.addBindThisScene(toApply);
                } else {
                    this.encounterState.bindThisScene = Math.max(0, Math.min(10, toApply));
                }
                this.encounterState.bindNextScene = 0;
                this.showNotification(`Gained ${toApply} Bind for this scene.`, 'success');
            }
            if (typeof this.updateStatusEffectsDisplay === 'function') {
                    this.updateStatusEffectsDisplay();
                }

				// Apply Faith's next-scene Light restoration if set
                if (this.encounterState && this.encounterState.restoreOneLightNextScene) {
					if (typeof this.encounterState.lightRefundThisScene !== 'number') {
						this.encounterState.lightRefundThisScene = 0;
					}
					// Add +1 but cap the effective remaining at max
					const maxLightTextFaith = (document.getElementById('maxLightValue')?.textContent ?? '').trim();
					const parsedMaxFaith = parseInt(maxLightTextFaith);
					const maxLightFaith = Number.isNaN(parsedMaxFaith) ? 0 : parsedMaxFaith;
					const usedLightFaith = 0; // at scene start assignments reset; display uses refund only
					const currentRefund = this.encounterState.lightRefundThisScene;
					const currentRemaining = Math.max(0, Math.min(maxLightFaith, maxLightFaith - usedLightFaith + currentRefund));
					const targetRemainingFaith = Math.min(maxLightFaith, currentRemaining + 1);
                    // Skip modifying refund when Light gain is forbidden
                    this.encounterState.lightRefundThisScene = this.encounterState.forbidLightGainThisEncounter ? this.encounterState.lightRefundThisScene : (targetRemainingFaith - maxLightFaith);
					this.encounterState.restoreOneLightNextScene = false;
				}

				const maxHand = this.encounterState.maxHand;
				// Reset per-scene draw counter at the start of the scene
				try {
					if (!this.encounterState) this.encounterState = {};
					this.encounterState.pagesDrawnThisScene = 0;
					// Clear Bottom Deal final card (will be determined after scene draws)
					this.encounterState.bottomDealFinalCardId = null;
					this.encounterState.bottomDealFinalCardHandIndex = null;
				} catch (e) { /* non-fatal */ }
                
            // Auto-add Trigram pages for Hana Association at scene start (before draws)
            try {
                const currentFaction = this.currentCharacter?.factions || '';
                if (currentFaction === 'Hana Association') {
                    const trigramIds = [13, 14, 15, 16];
                    const hand = this.encounterState.hand;
                    for (const trigramId of trigramIds) {
                        if (!hand.includes(trigramId)) {
                                const page = window.pageManager?.pages[trigramId];
                                const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                                
                                // Skip Trigrams already used in the current cycle until cycle completes
                                let skipDueToCycle = false;
                                try {
                                    const cycle = this.encounterState?.trigramCycleUsed;
                                    if (cycle instanceof Set && cycle.has(trigramId) && cycle.size < 4) {
                                        skipDueToCycle = true;
                                    }
                                } catch (e) { /* non-fatal */ }
                                if (isSpecial && !skipDueToCycle) {
                                    hand.push(trigramId);
                                }
                        }
                    }
                }
            } catch (e) {
                console.warn('Failed to auto-add trigram pages at scene start:', e);
            }

			// Grant Swift Trace if Heavy Trace was used last scene
			if (this.encounterState && this.encounterState.grantSwiftTraceNextScene) {
				const swiftTraceId = 123; // Swift Trace
				const hand = this.encounterState.hand;
				const currentHandLen = Array.isArray(hand) ? hand.length : 0;
				let availableSpaceSwift = Math.max(0, maxHand - currentHandLen);
				if (availableSpaceSwift > 0) {
					if (!hand.includes(swiftTraceId)) {
						hand.push(swiftTraceId);
						this.showNotification('Gained "Swift Trace" for this scene.', 'success');
					} else {
						this.showNotification('"Swift Trace" already in hand.', 'info');
					}
				} else {
					this.showNotification('Hand is full! Could not add "Swift Trace".', 'info');
				}
				this.encounterState.grantSwiftTraceNextScene = false;
			}

			// Grant Right in the Solar Plexus if Aim for the Solar Plexus was used last scene
			if (this.encounterState && this.encounterState.grantRightInSolarPlexusNextScene) {
				const pageIdToGrant = 416; // Right in the Solar Plexus
				const hand = this.encounterState.hand;
				const currentHandLen = Array.isArray(hand) ? hand.length : 0;
				let availableSpace = Math.max(0, maxHand - currentHandLen);
				if (availableSpace > 0) {
					if (!hand.includes(pageIdToGrant)) {
						hand.push(pageIdToGrant);
						this.showNotification('Gained "Right in the Solar Plexus" for this scene.', 'success');
					} else {
						this.showNotification('"Right in the Solar Plexus" already in hand.', 'info');
					}
				} else {
					this.showNotification('Hand is full! Could not add "Right in the Solar Plexus".', 'info');
				}
				this.encounterState.grantRightInSolarPlexusNextScene = false;
			}

			// Grant Payback with Interest if Payback was used last scene
			if (this.encounterState && this.encounterState.grantPaybackWithInterestNextScene) {
				const pageIdToGrant = 420; // Payback with Interest
				const hand = this.encounterState.hand;
				const currentHandLen = Array.isArray(hand) ? hand.length : 0;
				let availableSpace = Math.max(0, maxHand - currentHandLen);
				if (availableSpace > 0) {
					if (!hand.includes(pageIdToGrant)) {
						hand.push(pageIdToGrant);
						this.showNotification('Gained "Payback with Interest" for this scene.', 'success');
					} else {
						this.showNotification('"Payback with Interest" already in hand.', 'info');
					}
				} else {
					this.showNotification('Hand is full! Could not add "Payback with Interest".', 'info');
				}
				this.encounterState.grantPaybackWithInterestNextScene = false;
			}

			// Grant Lenticular Rend if Lenticular Swirl was used last scene
			if (this.encounterState && this.encounterState.grantLenticularRendNextScene) {
				const pageIdToGrant = 410; // Lenticular Rend
				const hand = this.encounterState.hand;
				const currentHandLen = Array.isArray(hand) ? hand.length : 0;
				let availableSpace = Math.max(0, maxHand - currentHandLen);
				if (availableSpace > 0) {
					if (!hand.includes(pageIdToGrant)) {
						hand.push(pageIdToGrant);
						this.showNotification('Gained "Lenticular Rend" for this scene.', 'success');
					} else {
						this.showNotification('"Lenticular Rend" already in hand.', 'info');
					}
				} else {
					this.showNotification('Hand is full! Could not add "Lenticular Rend".', 'info');
				}
				this.encounterState.grantLenticularRendNextScene = false;
			}

			// Grant Charge Countercurrent if Charge was used last scene
			if (this.encounterState && this.encounterState.grantChargeCountercurrentNextScene) {
				const pageIdToGrant = 251; // Charge Countercurrent
				const hand = this.encounterState.hand;
				const currentHandLen = Array.isArray(hand) ? hand.length : 0;
				let availableSpace = Math.max(0, maxHand - currentHandLen);
				if (availableSpace > 0) {
					if (!hand.includes(pageIdToGrant)) {
						hand.push(pageIdToGrant);
						this.showNotification('Gained "Charge Countercurrent" for this scene.', 'success');
					} else {
						this.showNotification('"Charge Countercurrent" already in hand.', 'info');
					}
				} else {
					this.showNotification('Hand is full! Could not add "Charge Countercurrent".', 'info');
				}
				this.encounterState.grantChargeCountercurrentNextScene = false;
			}

            const currentHandSize = (this.encounterState.handNormal?.length || 0);
            const ownedPages = this.getAvailablePagesForDrawing();
            
            if (ownedPages.length === 0) {
                this.showNotification('No owned pages available for drawing.', 'warning');
                return;
            }
            
            try {
                const toReturnEarly = Array.isArray(this.encounterState.pagesToReturnNextScene) ? this.encounterState.pagesToReturnNextScene : [];
                if (toReturnEarly.length > 0) {
                    const unique = [...new Set(toReturnEarly)].filter(pid => ![...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])].includes(pid));
                    if (unique.length > 0) {
                        unique.forEach(pid => {
                            const page = window.pageManager?.pages[pid];
                            const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                            if (isSpecial) {
                                if (!this.encounterState.handSpecial.includes(pid)) this.encounterState.handSpecial.push(pid);
                            } else {
                                if (!this.encounterState.handNormal.includes(pid)) this.encounterState.handNormal.push(pid);
                            }
                        });
                        // rebuild combined
                        this.encounterState.hand = [...this.encounterState.handNormal, ...this.encounterState.handSpecial];
                        if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                        console.log(`Early return of queued pages: ${unique.join(', ')}`);
                    }
                }
                this.encounterState.pagesToReturnNextScene = [];
            } catch (e) { /* non-fatal */ }

            // Calculate how many cards we can draw
            const availableSpace = maxHand - currentHandSize;
            const cardsToDraw = Math.min(drawPerScene, availableSpace);
            
            if (cardsToDraw <= 0) {
                // Even if we cannot draw, we must reset dice and return special pages for the new scene
                const specialPagesToReturn = [];
                this.encounterState.diceAssignments.forEach((assignment) => {
                    const pageId = assignment.pageId;
                    const page = window.pageManager?.pages[pageId];
                    const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                    const inEither = [ ...(this.encounterState.handSpecial||[]), ...(this.encounterState.handNormal||[]) ].includes(pageId);
                    if (isSpecial && !inEither) {
                        specialPagesToReturn.push(pageId);
                    }
                });
                if (specialPagesToReturn.length > 0) {
                    specialPagesToReturn.forEach(pid => { if (!this.encounterState.handSpecial.includes(pid)) this.encounterState.handSpecial.push(pid); });
                    this.encounterState.hand = [...this.encounterState.handNormal, ...this.encounterState.handSpecial];
                    if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                }
                // Also return explicitly queued pages for next scene (e.g., Modified Ampule)
                try {
                    const toReturn = Array.isArray(this.encounterState.pagesToReturnNextScene) ? this.encounterState.pagesToReturnNextScene : [];
                    if (toReturn.length > 0) {
                        const unique = [...new Set(toReturn)].filter(pid => ![...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])].includes(pid));
                        if (unique.length > 0) {
                            unique.forEach(pid => {
                                const page = window.pageManager?.pages[pid];
                                const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                                if (isSpecial) {
                                    if (!this.encounterState.handSpecial.includes(pid)) this.encounterState.handSpecial.push(pid);
                                } else {
                                    if (!this.encounterState.handNormal.includes(pid)) this.encounterState.handNormal.push(pid);
                                }
                            });
                            this.encounterState.hand = [...this.encounterState.handNormal, ...this.encounterState.handSpecial];
                            if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                        }
                    }
                    this.encounterState.pagesToReturnNextScene = [];
                } catch (e) { /* non-fatal */ }
                
                // Update Bottom Deal final card even when hand is full (hand may have changed from special pages, etc.)
                if (typeof this.updateBottomDealFinalCard === 'function') {
                    this.updateBottomDealFinalCard();
                }
                
                // Clear assignments and visuals for the new scene
                this.encounterState.diceAssignments.clear();
                if (typeof this.handleZweiDefensiveStanceOnPlay === 'function') this.handleZweiDefensiveStanceOnPlay();
                if (this.encounterState.specialPagesAssigned) {
                    this.encounterState.specialPagesAssigned.clear();
                }
                // Increment scene BEFORE updating UI so display reflects new scene
                if (this.encounterState && typeof this.encounterState.sceneNumber === 'number') {
                    this.encounterState.sceneNumber += 1;
                } else if (this.encounterState) {
                    this.encounterState.sceneNumber = 2; // default to second scene if missing
                }
                this.updateDiceVisualState([]);
                this.updateHandDisplay();
                
                // Update status effects display to reflect new scene (important for cooldowns)
                if (typeof this.updateStatusEffectsDisplay === 'function') {
                    // Ensure Thumb Ammunition status resets before rendering
                    if (this.encounterState) {
                        this.encounterState.thumbAmmoTypeThisScene = null;
                        this.encounterState.thumbAmmoUseCountThisScene = 0;
                        this.encounterState.lightSpentOnPlayThisScene = 0;
                    }
                    this.updateStatusEffectsDisplay();
                }
                
                // Update CURRENT LIGHT after scene change
                if (typeof this.updateCurrentLight === 'function') {
                    this.updateCurrentLight();
                }
                
                this.showNotification('Hand is full! No draw this scene, but dice reset and special pages returned.', 'info');
                return;
            }
            
            // Get current Temperance level for notification
            const temperanceInput = document.getElementById('temperance');
            const temperance = temperanceInput ? temperanceInput.value || 'I' : 'I';
            
            // Randomly pick owned pages with restrictions for Single Use pages
            const drawnCards = [];
            const pageCounts = new Map(); // Track how many copies of each page we've drawn
            const singleUsePagesUsed = new Set(); // Track Single Use pages that have been used in this hand
            
            // Get available pages (excluding Single Use pages that have already been used in this encounter and special pages)
            const availablePages = ownedPages.filter(pageId => {
                const page = window.pageManager?.pages[pageId];
                const isSingleUse = page && page.range && page.range.includes('Single Use');
                const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                
                // Exclude special pages as they're always in hand
                if (isSpecial) {
                    return false;
                }
                
                // If it's a Single Use page that's already been used in this encounter, exclude it
                if (isSingleUse && this.encounterState.singleUsePagesUsed && this.encounterState.singleUsePagesUsed.has(pageId)) {
                    return false;
                }
                return true;
            });
            
            if (availablePages.length === 0) {
                this.showNotification('No more available pages to draw (all Single Use pages have been used).', 'warning');
                return;
            }
            
            // Bottom Deal: Sort pages by light usage in ascending order
            const hasBottomDeal = this.hasPassive('Bottom Deal');
            let sortedAvailablePages = [...availablePages];
            
            if (hasBottomDeal) {
                sortedAvailablePages.sort((a, b) => {
                    const pageA = window.pageManager?.pages[a];
                    const pageB = window.pageManager?.pages[b];
                    const lightA = typeof pageA?.lightUsage === 'number' ? pageA.lightUsage : parseInt(pageA?.lightUsage ?? 0) || 0;
                    const lightB = typeof pageB?.lightUsage === 'number' ? pageB.lightUsage : parseInt(pageB?.lightUsage ?? 0) || 0;
                    return lightA - lightB;
                });
            }
            
            // Use a persistent pointer across scenes for Bottom Deal rotation
            let bdPtr = Number(this.encounterState?.bottomDealDrawIndex) || 0;
            
            for (let i = 0; i < cardsToDraw; i++) {
                let selectedPageId;
                
                if (hasBottomDeal && sortedAvailablePages.length > 0) {
                    // Bottom Deal: rotate through ascending list using persistent pointer
                    const len = sortedAvailablePages.length;
                    let attempts = 0;
                    while (attempts < len) {
                        const idx = ((bdPtr % len) + len) % len;
                        selectedPageId = sortedAvailablePages[idx];
                        bdPtr++;
                        // eligibility checks happen below; if ineligible, loop to next
                        const pChk = window.pageManager?.pages[selectedPageId];
                        const isSingleUseChk = pChk && pChk.range && pChk.range.includes('Single Use');
                        const maxCopiesChk = isSingleUseChk ? 1 : 3;
                        const existingInHandChk = Array.isArray(this.encounterState.handNormal)
                            ? this.encounterState.handNormal.filter(id => id === selectedPageId).length
                            : 0;
                        const alreadyUsedSingleUse = isSingleUseChk && singleUsePagesUsed.has(selectedPageId);
                        if (existingInHandChk < maxCopiesChk && !alreadyUsedSingleUse) {
                            break;
                        }
                        attempts++;
                        selectedPageId = null;
                    }
                    // Fallback to random if we couldn't find eligible after full rotation
                    if (!selectedPageId) {
                        selectedPageId = availablePages[Math.floor(Math.random() * availablePages.length)];
                    }
                } else {
                    // Normal: Randomly select from available pages
                    selectedPageId = availablePages[Math.floor(Math.random() * availablePages.length)];
                }
                
                // Get page data to check if it's a Single Use page
                const page = window.pageManager?.pages[selectedPageId];
                const isSingleUse = page && page.range && page.range.includes('Single Use');
                
                // Check if this is a Single Use page that's already been used in this hand
                if (isSingleUse && singleUsePagesUsed.has(selectedPageId)) {
                    i--; // Retry this iteration
                    continue;
                }
                
                // Check if we've already drawn the maximum copies of this page
                const currentCount = pageCounts.get(selectedPageId) || 0;
                const maxCopies = isSingleUse ? 1 : 3; // Single Use pages can only have 1 copy
                
                if (currentCount < maxCopies) {
                    drawnCards.push(selectedPageId);
                    pageCounts.set(selectedPageId, currentCount + 1);
                    
                    // If this is a Single Use page, mark it as used
                    if (isSingleUse) {
                        singleUsePagesUsed.add(selectedPageId);
                    }
                } else {
                    // If we've reached max copies, try again with a different page
                    i--; // Retry this iteration
                    continue;
                }
            }
            
            // Add drawn cards to normal hand (special hand ignores limits and is not part of random draws)
            if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
            this.encounterState.handNormal.push(...drawnCards);
            
            // Persist updated Bottom Deal pointer
            if (!this.encounterState) this.encounterState = {};
            this.encounterState.bottomDealDrawIndex = bdPtr;
            
            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
            
            // Update Bottom Deal final card (determined once per scene after draws)
            if (typeof this.updateBottomDealFinalCard === 'function') {
                this.updateBottomDealFinalCard();
            }
            
            // Store Single Use pages used in this hand for tracking
            if (!this.encounterState.singleUsePagesUsed) {
                this.encounterState.singleUsePagesUsed = new Set();
            }
            singleUsePagesUsed.forEach(pageId => {
                this.encounterState.singleUsePagesUsed.add(pageId);
            });
            
            // Return special pages to hand before clearing dice assignments
            const specialPagesToReturn = [];
            this.encounterState.diceAssignments.forEach((assignment, diceIndex) => {
                const pageId = assignment.pageId;
                const page = window.pageManager?.pages[pageId];
                const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                
                if (isSpecial) {
                    // Check if this special page is already in hand (to avoid duplicates)
                    if (!this.encounterState.hand.includes(pageId)) {
                        specialPagesToReturn.push(pageId);
                        console.log(`Returning special page ${pageId} to hand`);
                    }
                }
            });
            
            // Add special pages back to hand
            if (specialPagesToReturn.length > 0) {
                this.encounterState.hand.push(...specialPagesToReturn);
                console.log(`Returned ${specialPagesToReturn.length} special pages to hand`);
            }
            // Return any pages queued explicitly to return next scene
            try {
                const toReturn = Array.isArray(this.encounterState.pagesToReturnNextScene) ? this.encounterState.pagesToReturnNextScene : [];
                if (toReturn.length > 0) {
                    const unique = [...new Set(toReturn)].filter(pid => !this.encounterState.hand.includes(pid));
                    if (unique.length > 0) {
                        this.encounterState.hand.push(...unique);
                        console.log(`Explicitly returned pages next scene: ${unique.join(', ')}`);
                    }
                }
                this.encounterState.pagesToReturnNextScene = [];
            } catch (e) { /* non-fatal */ }
            
            // Remove [On Use] Poise from all pages before clearing dice assignments
            if (this.encounterState && this.encounterState.pagesGrantedOnUsePoise && this.encounterState.pagesGrantedOnUsePoise.size > 0) {
                let totalPotencyToRemove = 0;
                let totalCountToRemove = 0;
                for (const [pageId, grantedPoise] of this.encounterState.pagesGrantedOnUsePoise.entries()) {
                    totalPotencyToRemove += (grantedPoise.potency || 0);
                    totalCountToRemove += (grantedPoise.count || 0);
                }
                if (totalPotencyToRemove > 0 || totalCountToRemove > 0) {
                    const curPot = Number(this.encounterState.poisePotencyThisScene) || 0;
                    const curCnt = Number(this.encounterState.poiseCountThisScene) || 0;
                    this.encounterState.poisePotencyThisScene = Math.max(0, curPot - totalPotencyToRemove);
                    this.encounterState.poiseCountThisScene = Math.max(0, curCnt - totalCountToRemove);
                    
                    // If Count reaches 0, clear Potency so the status fully disappears
                    if (this.encounterState.poiseCountThisScene === 0) {
                        this.encounterState.poisePotencyThisScene = 0;
                    }
                    
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                }
                // Clear tracking
                this.encounterState.pagesGrantedOnUsePoise.clear();
            }
            
            // Clear dice assignments for new scene (dice are re-rolled each scene)
            this.encounterState.diceAssignments.clear();
            // Clear pages used tracking for the new scene
            if (this.encounterState.pagesUsedThisScene) {
                this.encounterState.pagesUsedThisScene.clear();
            }
            // (Locked dice removed)
            // Do NOT clear disabledDiceIndicesEncounter here; it persists across the encounter
            if (typeof this.handleZweiDefensiveStanceOnPlay === 'function') this.handleZweiDefensiveStanceOnPlay();
            console.log('Dice assignments cleared for new scene');
            
            // Clear special pages tracking for new scene
            if (this.encounterState.specialPagesAssigned) {
                this.encounterState.specialPagesAssigned.clear();
                console.log('Special pages tracking cleared for new scene');
            }
            // Reset dice visuals so no dice remain lit after scene change
            this.updateDiceVisualState([]);
            
            // Latch Singleton for this new scene based on the updated hand
            if (this.encounterState) {
                this.encounterState.singletonActiveThisScene = typeof this.computeSingletonFromHand === 'function' ? this.computeSingletonFromHand() : false;
                // If Singleton is active and not yet counted this scene, count a proc
                try {
                    if (this.encounterState.singletonActiveThisScene && !this.encounterState.singletonCountedThisScene) {
                        this.encounterState.singletonProcCount = (this.encounterState.singletonProcCount || 0) + 1;
                        this.encounterState.singletonCountedThisScene = true;
                    }
                } catch (e) { /* non-fatal */ }
            }
            // Increment scene BEFORE updating UI so display reflects new scene
            if (this.encounterState && typeof this.encounterState.sceneNumber === 'number') {
                this.encounterState.sceneNumber += 1;
            } else if (this.encounterState) {
                this.encounterState.sceneNumber = 2; // default to second scene if missing
            }
            // Reset Thumb Ammunition per-scene tracking BEFORE any status UI updates for the new scene
            if (this.encounterState) {
                this.encounterState.thumbAmmoTypeThisScene = null;
                this.encounterState.thumbAmmoUseCountThisScene = 0;
                this.encounterState.lightSpentOnPlayThisScene = 0;
            }
            
            // Expire Tremor - Execution threshold if duration is over (check AFTER scene increment)
            try {
                const currentScene2 = (typeof this.encounterState?.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
                const expireAt2 = Number(this.encounterState?.tremorExecutionThresholdExpiresScene) || 0;
                if (expireAt2 > 0 && currentScene2 >= expireAt2) {
                    delete this.encounterState.tremorExecutionThresholdPercent;
                    delete this.encounterState.tremorExecutionThresholdExpiresScene;
                    delete this.encounterState.tremorExecutionTriggered; // Clear execution flag when threshold expires
                    if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    if (typeof this.updateTremorExecutionThresholdMarkers === 'function') this.updateTremorExecutionThresholdMarkers();
                }
            } catch (e) { /* non-fatal */ }
            
            // Enforce and update hand display
            if (typeof this.enforceHandConstraints === 'function') this.enforceHandConstraints();
            this.updateHandDisplay();
            
            // Update status effects display to reflect new scene (important for cooldowns)
            if (typeof this.updateStatusEffectsDisplay === 'function') {
                this.updateStatusEffectsDisplay();
            }
            
            // Keep CURRENT LIGHT synced after scene change
            if (typeof this.updateCurrentLight === 'function') {
                this.updateCurrentLight();
            }
            
            
            // Show notification with draw per scene info and Single Use tracking
            let notificationText = `Next scene! Drew ${drawnCards.length} cards (Temperance ${temperance}: ${drawPerScene} per scene). Hand now has ${this.encounterState.hand.length} cards. Dice assignments reset.`;
            
            if (specialPagesToReturn.length > 0) {
                const specialPageNames = specialPagesToReturn.map(pageId => {
                    const page = window.pageManager?.pages[pageId];
                    return page ? page.name : `Page ${pageId}`;
                });
                notificationText += ` Special pages returned to hand: ${specialPageNames.join(', ')}.`;
            }
            
            if (this.encounterState.singleUsePagesUsed && this.encounterState.singleUsePagesUsed.size > 0) {
                const usedSingleUseNames = Array.from(this.encounterState.singleUsePagesUsed).map(pageId => {
                    const page = window.pageManager?.pages[pageId];
                    return page ? page.name : `Page ${pageId}`;
                });
                notificationText += ` Used Single Use pages: ${usedSingleUseNames.join(', ')}`;
            }
            
            this.showNotification(notificationText, 'info');
            
            console.log('Next scene drawn:', {
                drawnCards: drawnCards,
                newHandSize: this.encounterState.hand.length,
                pageCounts: Object.fromEntries(pageCounts),
                singleUsePagesUsed: Array.from(singleUsePagesUsed),
                totalSingleUseUsed: this.encounterState.singleUsePagesUsed.size,
                diceAssignmentsCleared: true
            });
        }
        
        // End encounter and reset state
        endEncounter() {
            if (!this.encounterState) {
                this.showNotification('No active encounter to end.', 'warning');
                return;
            }
            // Ensure placement is unlocked when encounter ends
            this.placementLocked = false;
            
            // Clear Emotion bonus and UI first (while encounterState still exists)
            this.emotionBonusLight = 0;
            this.updateEmotionDisplay();
            this.updateEmotionBar();
            this.updateEmotionCounts();
            
            // Transform back to combat phase button when ending encounter
            this.transformToCombatPhaseButton();
            
            // Reset hand mode to normal
            this.handMode = 'normal';
            
            // Clear hand display and update swap button appearance while encounterState exists
            const handDisplay = document.querySelector('.hand-display');
            const handLimitElement = document.querySelector('.hand-limit');
            
            if (handDisplay) {
                handDisplay.innerHTML = '';
            }
            if (handLimitElement) {
                handLimitElement.innerHTML = 'HAND LIMIT: <span id="currentHandLimit">0</span>/<span id="maxHandLimit">10</span>';
            }
            
            // Update swap button appearance
            this.updateSwapButtonAppearance();
            
            // Reset dice visuals so no dice remain lit after encounter ends
            this.updateDiceVisualState([]);
            
            // Persist remaining bullets to character before clearing encounter state
            try {
                const bulletsState = Number(this.encounterState?.bulletsRemaining) || 0;
                // Update currentCharacter's bullets field
                if (this.currentCharacter) {
                    this.currentCharacter.bullets = bulletsState;
                    // Also sync UI input
                    const bulletInput = document.getElementById('bulletCount');
                    if (bulletInput) bulletInput.value = bulletsState;
                    if (typeof this.updateBulletStatusDisplay === 'function') this.updateBulletStatusDisplay();
                    // Save to storage
                    // Replace/insert the character in this.characters then persist
                    const idx = this.characters.findIndex(c => c.name === this.currentCharacter.name);
                    const updated = this.getCharacterData();
                    updated.bullets = bulletsState;
                    if (idx !== -1) {
                        this.characters[idx] = updated;
                    } else {
                        this.characters.push(updated);
                    }
                    this.saveCharactersToStorage();
                }
            } catch (e) { /* non-fatal */ }

            // Clear encounter state AFTER all UI updates that depend on it
            this.encounterState = null;
            
            // Hide stagger overlay when encounter ends
            const staggerOverlay = document.getElementById('staggerOverlay');
            if (staggerOverlay) staggerOverlay.style.display = 'none';
            
            // Unlock character editing and page modifications after encounter
            this.lockDuringEncounter(false);
            // Re-enable Start Encounter button when encounter ends
            const startEncounterBtn = document.querySelector('.encounter-btn');
            if (startEncounterBtn) {
                startEncounterBtn.disabled = false;
            }
            
            // Reset CURRENT LIGHT display when encounter ends
            if (typeof this.updateCurrentLight === 'function') {
                this.updateCurrentLight();
            }
            // Recompute Max Light without Emotion bonus
            this.updateMaxLight();

            // Re-enable bullet input after encounter ends
            const bulletInput = document.getElementById('bulletCount');
            if (bulletInput) {
                bulletInput.disabled = false;
                bulletInput.removeAttribute('title');
            }
            
            this.showNotification('Encounter ended. Hand cleared and dice assignments reset.', 'info');
            console.log('Encounter ended - dice assignments cleared');
        }

        // ===== Emotion System =====
        updateEmotionDisplay() {
            const el = document.getElementById('emotionLvValue');
            if (!el) return;
            const level = this.encounterState ? (this.encounterState.emotionLevel || 0) : 0;
            el.textContent = String(level);

            // Also update the visible emotion level title icons
            const iconsContainer = document.querySelector('.emotion-level-icons');
            if (iconsContainer) {
                const icons = iconsContainer.querySelectorAll('.emotion-level-icon');
                icons.forEach((icon, index) => {
                    // Show only the current level's banner, all at the same spot
                    if (level > 0 && index === (level - 1)) {
                        icon.style.opacity = '1';
                    } else {
                        icon.style.opacity = '0';
                    }
                });
            }
        }

        // Entry point for +/- clicks: records segment type coloring per segment
        addEmotionTyped(kind) {
            if (!this.encounterState) return;
            const threshold = this.getCurrentEmotionThreshold();
            // Initialize tracking array for current level
            if (!Array.isArray(this.encounterState.emotionSegmentTypes)) {
                this.encounterState.emotionSegmentTypes = [];
            }
            const current = this.encounterState.emotionPoints || 0;
            
            // Allow adding emotion even if at threshold to enable automatic level-ups
            // Add one point (capped); record type only if actually added
            let added = 0;
            if (kind === 'positive') {
                added = this.addEmotion(1);
                if (added > 0) this.encounterState.emotionPositive = (this.encounterState.emotionPositive || 0) + 1;
            } else if (kind === 'negative') {
                added = this.addEmotion(1);
                if (added > 0) this.encounterState.emotionNegative = (this.encounterState.emotionNegative || 0) + 1;
            }
            
            // Only record segment type if we're still at the same level and added a point
            if (added > 0 && this.encounterState.emotionPoints <= threshold) {
                const filled = Math.min(this.encounterState.emotionPoints, threshold);
                if (this.encounterState.emotionSegmentTypes.length < filled) {
                    this.encounterState.emotionSegmentTypes.push(kind);
                }
            }
            
            this.updateEmotionBar();
            this.updateEmotionCounts();
        }

        // Add Emotion points; with automatic level-ups when bar reaches max
        addEmotion(points = 1) {
            if (!this.encounterState) return;
            if (typeof points !== 'number' || !Number.isFinite(points) || points <= 0) return;
            const thresholds = [3, 3, 5, 7, 9];
            const threshold = thresholds[this.encounterState.emotionLevel] ?? thresholds[thresholds.length - 1];
            const current = this.encounterState.emotionPoints || 0;
            
            // Allow adding points even when at threshold to enable automatic level-ups
            // Only cap if we're at max level (5) and at threshold
            const canAdd = (this.encounterState.emotionLevel >= 5 && current >= threshold) ? 0 : points;
            const toAdd = canAdd;
            this.encounterState.emotionPoints = current + toAdd;
            
            // Check for automatic level-up when emotion bar reaches maximum
            this.checkAndApplyEmotionLevelUp();
            
            this.updateEmotionDisplay();
            this.updateEmotionBar();
            this.updateEmotionCounts();
            return toAdd;
        }

        // Remove Emotion points; handles level-down if points go below 0 (clamped at 0)
        removeEmotion(points = 1) {
            if (!this.encounterState) return;
            if (typeof points !== 'number' || !Number.isFinite(points) || points <= 0) return;
            const thresholds = [3, 3, 5, 7, 9];
            this.encounterState.emotionPoints = Math.max(0, (this.encounterState.emotionPoints || 0) - points);
            // No automatic level down unless explicitly desired; keep simple decrement bar only
            // If you want level down behavior, uncomment below:
            // while (this.encounterState.emotionLevel > 0 && this.encounterState.emotionPoints < 0) { ... }
            this.updateEmotionDisplay();
            this.updateEmotionBar();
        }

        getCurrentEmotionThreshold() {
            const thresholds = [3, 3, 5, 7, 9];
            const levelIndex = this.encounterState ? this.encounterState.emotionLevel : 0;
            return thresholds[Math.min(levelIndex, thresholds.length - 1)];
        }

        // Check and apply automatic emotion level-ups when bar reaches maximum
        checkAndApplyEmotionLevelUp() {
            if (!this.encounterState) return;
            const thresholds = [3, 3, 5, 7, 9];
            let leveledUpTimes = 0;
            
            // Check for level-ups while we have enough points
            while (
                this.encounterState.emotionLevel < 5 &&
                this.encounterState.emotionPoints >= thresholds[this.encounterState.emotionLevel]
            ) {
                this.encounterState.emotionPoints -= thresholds[this.encounterState.emotionLevel];
                this.encounterState.emotionLevel += 1;
                leveledUpTimes += 1;
                // Reset segment types for new level
                this.encounterState.emotionSegmentTypes = [];
                // On level up: Increase Max Light by +1 and Recover all Light
                this.emotionBonusLight += 1;
            }
            
            // Apply level-up effects if any level-ups occurred
            if (leveledUpTimes > 0) {
                this.updateMaxLight();
                const maxLightElement = document.getElementById('maxLightValue');
                const currentLightElement = document.getElementById('currentLightValue');
                const parsedMax = parseInt(maxLightElement?.textContent ?? '');
                if (currentLightElement && !Number.isNaN(parsedMax)) {
                    currentLightElement.textContent = `${parsedMax}/${parsedMax}`;
                }
                this.showNotification(`Emotion Level increased to ${this.encounterState.emotionLevel}! Max Light +${leveledUpTimes} and Light recovered.`, 'success');
            }
        }

        updateEmotionBar() {
            const segmentsContainer = document.getElementById('emotionSegments');
            const bar = document.getElementById('emotionBar');
            if (!segmentsContainer || !bar) return;
            const level = this.encounterState ? (this.encounterState.emotionLevel || 0) : 0;
            const points = this.encounterState ? (this.encounterState.emotionPoints || 0) : 0;
            const threshold = this.getCurrentEmotionThreshold();
            // Neutral bar (no level color)
            bar.style.setProperty('--emotion-color', '#ffffff');

            // Rebuild segments to exactly match current threshold
            // If threshold changed since last render, recreate children
            if (segmentsContainer.childElementCount !== threshold) {
                segmentsContainer.innerHTML = '';
                for (let i = 0; i < threshold; i++) {
                    const seg = document.createElement('div');
                    seg.className = 'emotion-segment';
                    segmentsContainer.appendChild(seg);
                }
            }
            // Fill as many segments as current points
            const segments = segmentsContainer.children;
            const types = Array.isArray(this.encounterState?.emotionSegmentTypes) ? this.encounterState.emotionSegmentTypes : [];
            for (let i = 0; i < segments.length; i++) {
                const seg = segments[i];
                if (i < points) {
                    seg.classList.add('filled');
                    const kind = types[i];
                    // Tag kind for CSS-based visual differences while keeping backgroundColor as a fallback
                    seg.dataset.kind = kind || '';
                    if (kind === 'positive') {
                        seg.style.backgroundColor = '#10b981'; // green
                    } else if (kind === 'negative') {
                        seg.style.backgroundColor = '#ef4444'; // red
                    } else {
                        seg.style.backgroundColor = '#888';
                    }
                } else {
                    seg.classList.remove('filled');
                    seg.dataset.kind = '';
                    seg.style.backgroundColor = '#555';
                }
            }
        }

        updateEmotionCounts() {
            const el = document.getElementById('emotionCounts');
            if (!el) return;
            const pos = this.encounterState ? (this.encounterState.emotionPositive || 0) : 0;
            const neg = this.encounterState ? (this.encounterState.emotionNegative || 0) : 0;
            el.textContent = `+${pos} / -${neg}`;
        }

        // Only at scene change: convert accumulated points into levels, with level-up effects
        // Note: This function is now mainly for backwards compatibility since automatic leveling
        // is handled in checkAndApplyEmotionLevelUp() when emotion points are added
        applyEmotionLevelUpsOnSceneChange() {
            if (!this.encounterState) return;
            // Since automatic leveling now happens immediately when emotion points are added,
            // this function mainly serves as a safety check for any remaining points
            this.checkAndApplyEmotionLevelUp();
        }

        // Process unlock page effects for sequential unlock system
        processUnlockPageEffects() {
            // Early return with proper error checking
            if (!this.encounterState || !this.encounterState.diceAssignments) return;
            if (!window.pageManager || !this.currentCharacter) {
                console.warn('processUnlockPageEffects: Missing required dependencies');
                return;
            }

            // Track which unlock pages were used this combat phase (using Set to avoid duplicates)
            const usedUnlockPages = new Set();
            
            this.encounterState.diceAssignments.forEach((assignment) => {
                const usedPageId = assignment.pageId;
                const usedPage = window.pageManager.pages[usedPageId];
                
                if (usedPage && usedPage.name) {
                    const name = usedPage.name.trim();
                    const isStandardUnlock = name.startsWith('Unlock -');
                    const isOufiWarning = name === 'First Warning' || name === 'Second Warning' || name === 'Final Warning';
                    if (isStandardUnlock || isOufiWarning) {
                        usedUnlockPages.add(name);
                    }
                }
            });

			// Also include unlock pages that were used without dice (e.g., Special pages with no dice)
			try {
				if (this.encounterState && this.encounterState.unlockPagesUsedThisPhase instanceof Set) {
					this.encounterState.unlockPagesUsedThisPhase.forEach(name => usedUnlockPages.add(name));
					// Clear after consuming so they don't re-trigger next phase
					this.encounterState.unlockPagesUsedThisPhase.clear();
				}
			} catch (e) { /* non-fatal */ }

            // Unlock page functionality
            usedUnlockPages.forEach(unlockPageName => {
                let nextUnlockPageId = null;
                switch (unlockPageName) {
                    case 'Unlock - I':
                        nextUnlockPageId = 125; // Unlock - II
                        break;
                    case 'Unlock - II':
                        nextUnlockPageId = 126; // Unlock - III
                        break;
                    case 'Unlock - III':
                        nextUnlockPageId = 127; // Unlock - IV
                        break;
                    case 'Unlock - IV':
                        nextUnlockPageId = 128; // Blade Unlock
                        break;

                    // Öufi Association - First Warning, Second Warning, Final Warning
                    case 'First Warning':
                        nextUnlockPageId = 95; // Second Warning
                        break;
                    case 'Second Warning':
                        nextUnlockPageId = 96; // Final Warning
                        break;
                    case 'Final Warning':
						nextUnlockPageId = 100; // Unrelenting Execution 
						break;
                    default:
                        console.warn(`Unknown unlock page: ${unlockPageName}`);
                        return;
                }

                // Add the next unlock page to the deck if it exists and isn't already owned
                if (nextUnlockPageId) {
                    const nextPage = window.pageManager.pages[nextUnlockPageId];
                    if (!nextPage) {
                        console.warn(`Next unlock page not found: ${nextUnlockPageId}`);
                        return;
                    }

                    // Check if already owned using Set for better performance
                    const ownedPagesSet = new Set(this.currentCharacter.ownedPages);
                    if (!ownedPagesSet.has(nextUnlockPageId)) {
                        // Add to character's owned pages
                        this.currentCharacter.ownedPages.push(nextUnlockPageId);
                        // Add to hand: special pages go to handSpecial without normal hand limit
                        const isSpecial = nextPage && (
                            (typeof nextPage.range === 'string' && nextPage.range.includes('Special')) ||
                            nextPage.range === 'Mass - Summation' ||
                            nextPage.range === 'Mass - Individual'
                        );
                        if (isSpecial) {
                            if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
                            if (!this.encounterState.handSpecial.includes(nextUnlockPageId)) {
                                this.encounterState.handSpecial.push(nextUnlockPageId);
                            }
                            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                            if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                        } else {
                            // Normal pages respect hand limit
                            const maxHand = this.encounterState.maxHand;
                            const currentHandSize = (this.encounterState.handNormal?.length || 0);
                            const inNormal = (this.encounterState.handNormal||[]).includes(nextUnlockPageId);
                            if (currentHandSize < maxHand && !inNormal) {
                                if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
                                this.encounterState.handNormal.push(nextUnlockPageId);
                                this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                                if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                            }
                        }
                        
                        // Show notification
                        this.showNotification(`Unlocked: ${nextPage.name}`, 'success');
                        
                        console.log(`Sequential unlock: ${unlockPageName} used, unlocked ${nextPage.name}`);
                    } else {
                        // Already owned. Ensure it's in hand if there's space
                        const isSpecial = nextPage && (
                            (typeof nextPage.range === 'string' && nextPage.range.includes('Special')) ||
                            nextPage.range === 'Mass - Summation' ||
                            nextPage.range === 'Mass - Individual'
                        );
                        if (isSpecial) {
                            if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
                            if (!this.encounterState.handSpecial.includes(nextUnlockPageId)) {
                                this.encounterState.handSpecial.push(nextUnlockPageId);
                                this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                                if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                                this.showNotification(`Added to special hand: ${nextPage.name}`, 'info');
                            }
                        } else {
                            const maxHand = this.encounterState.maxHand;
                            const currentHandSize = (this.encounterState.handNormal?.length || 0);
                            const inNormal = (this.encounterState.handNormal||[]).includes(nextUnlockPageId);
                            if (currentHandSize < maxHand && !inNormal) {
                                if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
                                this.encounterState.handNormal.push(nextUnlockPageId);
                                this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
                                if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                                this.showNotification(`Added to hand: ${nextPage.name}`, 'info');
                            }
                        }
                        console.log(`Sequential unlock: ${unlockPageName} used; ${nextPage.name} already owned`);
                    }
                }
            });
        }
        
        // Generate 3 random copies of equipped pages (including special pages) for combat
        generateCombatPages() {
            this.restorePreviewState();
            
            const ownedPages = this.getAvailablePagesForDrawing();
            const maxHand = this.encounterState.maxHand;
            const currentHandSize = (this.encounterState.handNormal?.length || 0);
            
            if (ownedPages.length === 0) {
                console.log('No owned pages available for combat generation');
                return;
            }
            
            // Calculate how many pages we can add (up to 3, but respect hand limit)
            const availableSpace = maxHand - currentHandSize;
            const pagesToAdd = Math.min(3, availableSpace);
            
            if (pagesToAdd <= 0) {
                this.showNotification('Hand is full! Cannot add more pages for combat.', 'warning');
                return;
            }
            
            // Get available pages (excluding special pages and Single Use pages that have already been used)
            // Trigram pages only available for Hana Association faction
            const availablePages = ownedPages.filter(pageId => {
                const page = window.pageManager?.pages[pageId];
                const isSpecial = page && ((typeof page.range === 'string' && page.range.includes('Special')) || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                const isSingleUse = page && page.range && page.range.includes('Single Use');
                
                // Check faction restriction for trigram pages
                const trigramPageIds = [13, 14, 15, 16]; // Geon, Gon, Gam, Gi
                const currentFaction = this.currentCharacter?.factions || '';
                const isHanaAssociation = currentFaction === 'Hana Association';
                
                if (trigramPageIds.includes(pageId) && !isHanaAssociation) {
                    return false; // Skip trigram pages if not Hana Association
                }
                
                // Exclude special pages as they're always in hand
                if (isSpecial) {
                    return false;
                }
                
                // If it's a Single Use page that's already been used in this encounter, exclude it
                if (isSingleUse && this.encounterState.singleUsePagesUsed && this.encounterState.singleUsePagesUsed.has(pageId)) {
                    return false;
                }
                return true;
            });
            
            if (availablePages.length === 0) {
                this.showNotification('No more available pages to add for combat (all Single Use pages have been used).', 'warning');
                return;
            }
            
            // Bottom Deal: Sort pages by light usage in ascending order
            const hasBottomDeal = this.hasPassive('Bottom Deal');
            let sortedAvailablePages = [...availablePages];
            
            if (hasBottomDeal) {
                sortedAvailablePages.sort((a, b) => {
                    const pageA = window.pageManager?.pages[a];
                    const pageB = window.pageManager?.pages[b];
                    const lightA = typeof pageA?.lightUsage === 'number' ? pageA.lightUsage : parseInt(pageA?.lightUsage ?? 0) || 0;
                    const lightB = typeof pageB?.lightUsage === 'number' ? pageB.lightUsage : parseInt(pageB?.lightUsage ?? 0) || 0;
                    return lightA - lightB;
                });
            }
            
            // Use a persistent pointer across encounter for Bottom Deal rotation
            let bdPtr = Number(this.encounterState?.bottomDealDrawIndex) || 0;
            
            // Add random pages to hand
            const addedPages = [];
            const pageCounts = new Map(); // Track how many copies of each page we've added
            const singleUsePagesUsed = new Set(); // Track Single Use pages that have been used in this combat
            
            for (let i = 0; i < pagesToAdd; i++) {
                let retryCount = 0;
                const maxRetries = 50; // Prevent infinite loops
                let pageAdded = false;
                
                while (!pageAdded && retryCount < maxRetries) {
                    retryCount++;
                    
                    // Select page based on Bottom Deal or random
                    let selectedPageId;
                    if (hasBottomDeal && sortedAvailablePages.length > 0) {
                        const len = sortedAvailablePages.length;
                        let attempts = 0;
                        while (attempts < len) {
                            const idx = ((bdPtr % len) + len) % len;
                            selectedPageId = sortedAvailablePages[idx];
                            bdPtr++;
                            // Quick eligibility preview (more checks below)
                            const pChk = window.pageManager?.pages[selectedPageId];
                            const isSingleUseChk = pChk && pChk.range && pChk.range.includes('Single Use');
                            const maxCopiesChk = isSingleUseChk ? 1 : 3;
                            const existingInHandChk = Array.isArray(this.encounterState.handNormal)
                                ? this.encounterState.handNormal.filter(id => id === selectedPageId).length
                                : 0;
                            const alreadyUsedSingleUse = isSingleUseChk && this.encounterState.singleUsePagesUsed && this.encounterState.singleUsePagesUsed.has(selectedPageId);
                            if (existingInHandChk < maxCopiesChk && !alreadyUsedSingleUse) {
                                break;
                            }
                            attempts++;
                            selectedPageId = null;
                        }
                        if (!selectedPageId) {
                            selectedPageId = availablePages[Math.floor(Math.random() * availablePages.length)];
                        }
                    } else {
                        // Normal: Randomly select from available pages
                        selectedPageId = availablePages[Math.floor(Math.random() * availablePages.length)];
                    }
                    
                    const randomPageId = selectedPageId;
                    
                    // Get page data to check if it's a Single Use page
                    const page = window.pageManager?.pages[randomPageId];
                    const isSingleUse = page && page.range && page.range.includes('Single Use');
                    
                    // Check if this is a Single Use page that's already been used in this combat
                    if (isSingleUse && singleUsePagesUsed.has(randomPageId)) {
                        continue; // Try another/next
                    }
                    
                    // Check if we've already added the maximum copies of this page (consider existing in handNormal)
                    const currentCount = pageCounts.get(randomPageId) || 0;
                    const maxCopies = isSingleUse ? 1 : 3; // Single Use pages can only have 1 copy
                    const existingInHand = Array.isArray(this.encounterState.handNormal)
                        ? this.encounterState.handNormal.filter(id => id === randomPageId).length
                        : 0;
                    if (existingInHand + currentCount < maxCopies) {
                        if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
                        this.encounterState.handNormal.push(randomPageId);
                        addedPages.push(randomPageId);
                        pageCounts.set(randomPageId, currentCount + 1);
                        pageAdded = true;
                        
                        // If this is a Single Use page, mark it as used
                        if (isSingleUse) {
                            singleUsePagesUsed.add(randomPageId);
                        }
                    } else {
                        // If we've reached max copies, try again
                        continue;
                    }
                }
                
                // If we couldn't add a page after max retries, break the loop
                if (!pageAdded) {
                    console.warn(`Could not add page ${i + 1} after ${maxRetries} retries. Stopping combat page generation.`);
                    break;
                }
            }
            
            // Persist updated Bottom Deal pointer
            if (!this.encounterState) this.encounterState = {};
            this.encounterState.bottomDealDrawIndex = bdPtr;
            
            // Update Bottom Deal final card (determined once per scene after draws)
            if (typeof this.updateBottomDealFinalCard === 'function') {
                this.updateBottomDealFinalCard();
            }
            
            // Store Single Use pages used in this combat for tracking
            if (!this.encounterState.singleUsePagesUsed) {
                this.encounterState.singleUsePagesUsed = new Set();
            }
            singleUsePagesUsed.forEach(pageId => {
                this.encounterState.singleUsePagesUsed.add(pageId);
            });
            
            // Update hand display
            if (typeof this.enforceHandConstraints === 'function') this.enforceHandConstraints();
            this.updateHandDisplay();
            
            // Show notification
            let notificationText = `Combat pages generated! Added ${addedPages.length} pages to hand.`;
            if (singleUsePagesUsed.size > 0) {
                const usedSingleUseNames = Array.from(singleUsePagesUsed).map(pageId => {
                    const page = window.pageManager?.pages[pageId];
                    return page ? page.name : `Page ${pageId}`;
                });
                notificationText += ` Single Use pages added: ${usedSingleUseNames.join(', ')}.`;
            }
            
            this.showNotification(notificationText, 'info');
            
            console.log('Combat pages generated:', {
                addedPages: addedPages,
                newHandSize: (this.encounterState.handNormal?.length || 0),
                pageCounts: Object.fromEntries(pageCounts),
                singleUsePagesUsed: Array.from(singleUsePagesUsed)
            });
        }
        
        // Start combat phase - roll dice for each page and display results
        startCombatPhase() {
            if (!this.encounterState || !this.encounterState.diceAssignments || this.encounterState.diceAssignments.size === 0) {
                this.showNotification('No pages assigned to dice. Assign pages to dice first!', 'warning');
                return;
            }
            // Block starting combat if staggered this scene
            if (this.encounterState && this.encounterState.staggeredThisScene === true) {
                this.showNotification('Staggered: You cannot start combat this scene.', 'warning');
                return;
            }
            // Spend any queued Charge at the start of the combat phase (from prior uses)
            try {
                const queuedSpend = Number(this.encounterState?.chargeSpendNextScene) || 0;
                if (queuedSpend > 0) {
                    const curCharge = Math.max(0, Number(this.encounterState?.chargePotencyThisScene) || 0);
                    const newCharge = Math.max(0, curCharge - queuedSpend);
                    this.encounterState.chargePotencyThisScene = newCharge;
                    this.encounterState.chargeSpendNextScene = 0;
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification(`Start Combat: Spent ${queuedSpend} Charge queued from last scene. Remaining Charge: ${newCharge}.`, 'info');
                }
            } catch (e) { /* non-fatal */ }
            // Lock further placements until the next scene begins
            this.placementLocked = true;
            
            // Get all assigned pages
            const assignedPages = Array.from(this.encounterState.diceAssignments.values());
            // Reset per-page temporary dice power bonuses for this phase
            if (!this.encounterState) this.encounterState = {};
            this.encounterState.pageMaxPowerBonusThisPhase = {};
            this.encounterState.pageFlatPowerBonusThisPhase = {};
            this.encounterState.pageMinPowerBonusThisPhase = {};
            // Reset global phase max bonus (re-applied by buffs like Declared Duel on-play)
            this.encounterState.globalMaxPowerBonusThisPhase = 0;
            // Latch presence of Balestra Fente for the remainder of this scene's combat
            try {
                const balestraPresent = assignedPages.some(a => {
                    const p = window.pageManager?.pages?.[a.pageId];
                    return p && p.name === 'Balestra Fente';
                });
                this.encounterState.balestraFenteLatchedForScene = !!balestraPresent;
                const punitionPresent = assignedPages.some(a => {
                    const p = window.pageManager?.pages?.[a.pageId];
                    return p && p.name === 'Punition';
                });
                this.encounterState.punitionLatchedForScene = !!punitionPresent;
            } catch (e) { /* non-fatal */ }
            // Re-apply presence-based effects that depend on assignments (e.g., Balestra Fente)
            if (typeof this.handleBalestraFentePresence === 'function') this.handleBalestraFentePresence();
            if (typeof this.handlePunitionPresence === 'function') this.handlePunitionPresence();
            
            if (assignedPages.length === 0) {
                this.showNotification('No pages assigned to dice. Assign pages to dice first!', 'warning');
                return;
            }
            
            // Roll dice for each assigned page and collect results
            const combatResults = [];
            // Poise-based critical hit parameters (Potency -> crit chance, Count -> crit uses)
            let poisePotencyForCrit = (this.encounterState && typeof this.encounterState.poisePotencyThisScene === 'number') ? this.encounterState.poisePotencyThisScene : 0;
            let remainingPoiseCountForCrit = (this.encounterState && typeof this.encounterState.poiseCountThisScene === 'number') ? this.encounterState.poiseCountThisScene : 0;
            let critChancePct = Math.max(0, Math.min(100, poisePotencyForCrit * 5));
            let poiseParamsRefreshed = false;
            
            // Overthrow: Consume 10 Poise Count at Start Combat Phase if flagged (before any dice rolling)
            try {
                const hasOverthrow = assignedPages.some(a => {
                    const p = window.pageManager?.pages[a.pageId];
                    return p && p.name === 'Overthrow';
                });
                if (hasOverthrow && this.encounterState && this.encounterState.overthrowForceNat20ThisPhase === true) {
                    const poisePotNow = Math.max(0, Number(this.encounterState.poisePotencyThisScene) || 0);
                    const poiseCntNow = Math.max(0, Number(this.encounterState.poiseCountThisScene) || 0);
                    if (poisePotNow >= 20 && poiseCntNow >= 10) {
                        // Spend 10 Count now, before any dice rolling
                        const newCount = Math.max(0, poiseCntNow - 10);
                        this.encounterState.poiseCountThisScene = newCount;
                        remainingPoiseCountForCrit = newCount; // Update local variable to keep in sync
                        // If Count reaches 0, clear Potency so the status fully disappears
                        if (newCount === 0) {
                            this.encounterState.poisePotencyThisScene = 0;
                            poisePotencyForCrit = 0;
                            critChancePct = 0;
                        }
                        // Force update status display immediately
                        if (typeof this.updateStatusEffectsDisplay === 'function') {
                            this.updateStatusEffectsDisplay();
                        }
                        this.showNotification(`Overthrow: Consumed 10 Poise Count (${poiseCntNow} → ${newCount}). Guaranteed nat 20.`, 'success');
                    } else {
                        // Not enough resources anymore; cancel guarantee
                        this.encounterState.overthrowForceNat20ThisPhase = false;
                        this.showNotification(`Overthrow: Conditions not met at Start Combat (Potency: ${poisePotNow}, Count: ${poiseCntNow}). Nat 20 canceled.`, 'info');
                    }
                }
            } catch (e) {
                console.error('Overthrow consumption error:', e);
            }

			// Determine if Proselyte's Blade is used this phase (affects other pages' dice)
			const proselytesBladeUsedThisPhase = assignedPages.some(a => {
				const p = window.pageManager?.pages[a.pageId];
				return p && p.name === "Proselyte's Blade";
			});

            // [Before Use] Coordinated Assault: If Emotion Level 3+, use this page twice on the same target
            try {
                if (this.encounterState) {
                    const emotionLevel = Math.max(0, Number(this.encounterState.emotionLevel) || 0);
                    const coordinatedAssaultAssignments = assignedPages.filter(a => {
                        const p = window.pageManager?.pages[a.pageId];
                        return p && p.name === 'Coordinated Assault';
                    });
                    if (coordinatedAssaultAssignments.length > 0 && emotionLevel >= 3) {
                        // Duplicate each Coordinated Assault assignment
                        const duplicates = [];
                        coordinatedAssaultAssignments.forEach(assignment => {
                            duplicates.push({ ...assignment });
                        });
                        assignedPages.push(...duplicates);
                        this.showNotification(`Coordinated Assault: Page used twice (Emotion Level ${emotionLevel}).`, 'success');
                    }
                }
            } catch (e) { /* non-fatal */ }

            // Apply on-play effects that should trigger on combat start, not on placement
            assignedPages.forEach(assignment => {
                const pageId = assignment.pageId;
                const page = window.pageManager?.pages[pageId];
                
                if (!page) {
                    console.warn(`Page ${pageId} not found in pageManager`);
                    return;
                }
                
				const diceCount = page.dice;
				const pageName = page.name;
                // Apply 5% Max HP penalty when using specified Hana Association pages without Augury Infusion protection
                try {
                    const penalizedHanaPageIds = new Set([9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
                    const protectionEnabled = !!(this.encounterState && this.encounterState.auguryInfusionProtectionEnabled);
                    if (penalizedHanaPageIds.has(pageId) && !protectionEnabled) {
                        const maxHpEl = document.getElementById('maxHp');
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(maxHp) && maxHp > 0) {
                            const loss = Math.max(1, Math.floor(maxHp * 0.05));
                            if (typeof this.applyHpDamage === 'function') {
                                this.applyHpDamage(loss, 'Hana Page Penalty');
                            } else {
                                const curHpEl = document.getElementById('currentHp');
                                const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                                if (Number.isFinite(curHp)) curHpEl.value = Math.max(0, curHp - loss);
                                if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                            }
                            this.showNotification(`Hana page used without Augury Infusion: Lost ${loss} HP (5% of Max).`, 'warning');
                        }
                    }
                } catch (e) { /* non-fatal */ }
				
				// Singleton bonus setup for eligible pages
				const singletonEligiblePages = new Set(['Faith', "Proselyte's Blade", 'Execute', 'Sense Quarry', 'Undertake Prescript']);
				const dicePowerBonus = (singletonEligiblePages.has(pageName) && typeof this.isSingletonActive === 'function' && this.isSingletonActive()) ? 4 : 0;
				// Additional page-specific bonus: Sense Quarry gets +2 if deck has 7+ pages
				let pageSpecificBonus = 0;
				if (pageName === 'Sense Quarry') {
					try {
						const deckLen = Array.isArray(this.encounterState?.deck) ? this.encounterState.deck.length : 0;
						if (deckLen >= 7) pageSpecificBonus += 2;
					} catch (e) { /* non-fatal */ }
				}
                
                // Ignite Weaponry is now [On Play] - effects apply on assignment, not in combat phase
                if (false && pageName === 'Ignite Weaponry') {
                    // [After Use] Check cooldown - can only use again after 5 scenes
                    if (!this.encounterState) { this.encounterState = {}; }
                    const currentScene = (typeof this.encounterState.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
                    const cooldownUntil = typeof this.encounterState.igniteWeaponryCooldownUntilScene === 'number' ? this.encounterState.igniteWeaponryCooldownUntilScene : 0;
                    
                    if (currentScene < cooldownUntil) {
                        this.showNotification(`Ignite Weaponry: On cooldown. Available again at Scene ${cooldownUntil}.`, 'warning');
                        return; // Block use if on cooldown
                    }
                    
                    // [On Use] Restore 1 Light
                    if (!this.encounterState.forbidLightGainThisEncounter) {
                        if (typeof this.encounterState.lightRefundThisScene !== 'number') {
                            this.encounterState.lightRefundThisScene = 0;
                        }
                        this.encounterState.lightRefundThisScene += 1;
                        // Update CURRENT LIGHT to reflect refund
                        if (typeof this.updateCurrentLight === 'function') {
                            this.updateCurrentLight();
                        }
                    } else {
                        this.showNotification('Light gain is disabled for this encounter.', 'info');
                    }
                    // [On Use] Draw 1 Page
                    if (typeof this.drawImmediateCards === 'function') {
                        this.drawImmediateCards(1);
                    }
                    
                    // [After Use] Set cooldown for 5 scenes from current scene
                    this.encounterState.igniteWeaponryCooldownUntilScene = currentScene + 5;
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification('Ignite Weaponry: Restored 1 Light, drew 1 Page. Cannot be used again for 5 scenes.', 'success');
                }
                if (pageName === 'Unyielding Strike') {
                    if (!this.encounterState) { this.encounterState = {}; }
                    if (!this.encounterState.forbidLightGainThisEncounter) {
                        if (typeof this.encounterState.lightRefundThisScene !== 'number') {
                            this.encounterState.lightRefundThisScene = 0;
                        }
                        this.encounterState.lightRefundThisScene += 1;
                        if (typeof this.updateCurrentLight === 'function') {
                            this.updateCurrentLight();
                        }
                    } else {
                        this.showNotification('Light gain is disabled for this encounter.', 'info');
                    }
                }
               if (pageName === 'Reload Bullets') {
                   // Delegate to centralized On Play handler
                   if (typeof this.handleReloadBulletsOnPlay === 'function') {
                       this.handleReloadBulletsOnPlay();
                   }
               }
				// Activate HP Bullets
				if (pageName === 'Activate HP Bullets') {
					try {
						const curHpEl = document.getElementById('currentHp');
						const maxHpEl = document.getElementById('maxHp');
						const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
						const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
						if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
							const missing = Math.max(0, maxHp - curHp);
							if (missing > 0) {
								const heal = 40;
								const newHp = Math.min(maxHp, curHp + heal);
								curHpEl.value = newHp;
								if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
								this.showNotification(`Activate HP Bullets: Healed ${newHp - curHp} HP.`, 'success');
							} else {
								this.showNotification('Activate HP Bullets: HP is already full. No effect.', 'info');
							}
						}
					} catch (e) { /* non-fatal */ }
				}
				// No Entry
				if (pageName === 'No Entry') {
					try {
						const curHpEl = document.getElementById('currentHp');
						const maxHpEl = document.getElementById('maxHp');
						const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
						const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
						if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
							const missing = Math.max(0, maxHp - curHp);
							if (missing > 0) {
								const heal = 20;
								const newHp = Math.min(maxHp, curHp + heal);
								curHpEl.value = newHp;
								if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
								this.showNotification(`No Entry: Healed ${newHp - curHp} HP.`, 'success');
							} else {
								this.showNotification('No Entry: HP is already full. No effect.', 'info');
							}
						}
					} catch (e) { /* non-fatal */ }
				}

                // Mind Strike: [On Use] +1 dice power per 5 Charge Potency (Max 3); [On Use] Take 10 Fixed SP damage
                if (pageName === 'Mind Strike') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                        const chargePot = Math.max(0, Number(this.encounterState.chargePotencyThisScene) || 0);
                        const stacks = Math.max(0, Math.min(3, Math.floor(chargePot / 5)));
                        if (stacks > 0) {
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + stacks);
                            this.showNotification(`Mind Strike: +${stacks} dice power this phase (Charge ${chargePot}).`, 'success');
                        }
                        // Take 10 Fixed SP damage
                        const currentSpEl = document.getElementById('currentSp');
                        const maxSpEl = document.getElementById('maxSp');
                        const curSp = currentSpEl ? parseInt(currentSpEl.value, 10) : NaN;
                        const maxSp = maxSpEl ? parseInt(maxSpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curSp) && Number.isFinite(maxSp)) {
                            const newSp = Math.max(0, curSp - 10);
                            currentSpEl.value = newSp;
                            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                            this.showNotification('Mind Strike: Took 10 Fixed SP damage.', 'warning');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Ground Crash
                if (pageName === 'Ground Crash') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const curCharge = Math.max(0, Number(this.encounterState.chargePotencyThisScene) || 0);
                        if (curCharge < 20) {
                            this.showNotification('Ground Crash: Requires 20+ Charge Potency. Page unusable this phase.', 'warning');
                            return;
                        }
                        // Calculate bonuses from current charge BEFORE consuming
                        let addFlat = Math.min(3, Math.floor(curCharge / 4));
                        const protection = Math.max(0, Number(this.encounterState.protectionThisScene) || 0);
                        if (protection > 0) addFlat += 2;
                        if (addFlat > 0) {
                            if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + addFlat);
                            this.showNotification(`Ground Crash: +${addFlat} dice power this phase (Charge ${curCharge}).`, 'success');
                        } else {
                            this.showNotification('Ground Crash: No additional dice power gained.', 'info');
                        }
                        // Consume 20 Charge after calculating bonuses
                        this.encounterState.chargePotencyThisScene = Math.max(0, curCharge - 20);
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        this.showNotification('Ground Crash: Consumed 20 Charge Potency.', 'info');
                    } catch (e) { /* non-fatal */ }
                }

                // Energy Strike: [On Use] +1 dice power per 5 Charge Potency (Max 3); [On Use] Take 10 Fixed SP damage
                if (pageName === 'Energy Strike') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                        const chargePot = Math.max(0, Number(this.encounterState.chargePotencyThisScene) || 0);
                        const stacks = Math.max(0, Math.min(3, Math.floor(chargePot / 5)));
                        if (stacks > 0) {
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + stacks);
                            this.showNotification(`Energy Strike: +${stacks} dice power this phase (Charge ${chargePot}).`, 'success');
                        }
                        // Take 10 Fixed SP damage
                        const currentSpEl = document.getElementById('currentSp');
                        const maxSpEl = document.getElementById('maxSp');
                        const curSp = currentSpEl ? parseInt(currentSpEl.value, 10) : NaN;
                        const maxSp = maxSpEl ? parseInt(maxSpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curSp) && Number.isFinite(maxSp)) {
                            const newSp = Math.max(0, curSp - 10);
                            currentSpEl.value = newSp;
                            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                            this.showNotification('Energy Strike: Took 10 Fixed SP damage.', 'warning');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Blade Arc: [On Use] +1 dice power per 6 Poise Potency (Max 4)
                if (pageName === 'Blade Arc') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                        const poisePot = Math.max(0, Number(this.encounterState.poisePotencyThisScene) || 0);
                        const stacks = Math.max(0, Math.min(4, Math.floor(poisePot / 6)));
                        if (stacks > 0) {
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + stacks);
                            this.showNotification(`Blade Arc: +${stacks} dice power this phase (Poise ${poisePot}).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // To Claim Their Bones: [On Use] For every 6 Poise Potency the User has, Gain +1 dice Power Up (Max. 5) - Only applies to this page
                if (pageName === 'To Claim Their Bones') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                        const poisePot = Math.max(0, Number(this.encounterState.poisePotencyThisScene) || 0);
                        const stacks = Math.max(0, Math.min(5, Math.floor(poisePot / 6)));
                        if (stacks > 0) {
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + stacks);
                            this.showNotification(`To Claim Their Bones: +${stacks} dice power this phase (Poise ${poisePot}).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Yield My Flesh: [On Use] For every 1 Poise Potency the User has, Gain +1 dice Power Down (Max. 20) - Only applies to this page
                if (pageName === 'Yield My Flesh') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const poisePot = Math.max(0, Number(this.encounterState.poisePotencyThisScene) || 0);
                        const powerDownAmount = Math.max(0, Math.min(20, poisePot));
                        if (powerDownAmount > 0) {
                            // Use page-specific power down (negative flat bonus) instead of global
                            if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            // Store as negative value to represent power down
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = prev - powerDownAmount;
                            this.showNotification(`Yield My Flesh: All dice on this page gain -${powerDownAmount} dice Power this phase (Poise ${poisePot}).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Perfected Death Fist: [On Use] If Emotion Level 2+ gain dice power +2 on offense dice
                if (pageName === 'Perfected Death Fist') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const emotionLevel = Math.max(0, Number(this.encounterState.emotionLevel) || 0);
                        if (emotionLevel >= 2) {
                            if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + 2);
                            this.showNotification(`Perfected Death Fist: +2 dice power this phase (Emotion Level ${emotionLevel}).`, 'success');
                        } else {
                            this.showNotification(`Perfected Death Fist: No bonus (Emotion Level ${emotionLevel}, requires 2+).`, 'info');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Red Kick, Fiery Knife Hand, Single-Point Stab: [On Use] If Emotion Level 2+ gain Max dice power +1 on attack dice
                const martialArtsPages = new Set(['Red Kick', 'Fiery Knife Hand', 'Single-Point Stab']);
                if (martialArtsPages.has(pageName)) {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const emotionLevel = Math.max(0, Number(this.encounterState.emotionLevel) || 0);
                        if (emotionLevel >= 2) {
                            if (!this.encounterState.pageMaxPowerBonusThisPhase) this.encounterState.pageMaxPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageMaxPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageMaxPowerBonusThisPhase[pageName] = Math.max(0, prev + 1);
                            this.showNotification(`${pageName}: +1 Max dice power this phase (Emotion Level ${emotionLevel}).`, 'success');
                        } else {
                            this.showNotification(`${pageName}: No bonus (Emotion Level ${emotionLevel}, requires 2+).`, 'info');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Pinpoint Blitz, Frontal Assault, Fiery Waltz: [On Use] If Emotion Level 2+ gain dice power +2 on attack dice
                const offensivePages = new Set(['Pinpoint Blitz', 'Frontal Assault', 'Fiery Waltz']);
                if (offensivePages.has(pageName)) {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const emotionLevel = Math.max(0, Number(this.encounterState.emotionLevel) || 0);
                        if (emotionLevel >= 2) {
                            if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + 2);
                            this.showNotification(`${pageName}: +2 dice power this phase (Emotion Level ${emotionLevel}).`, 'success');
                        } else {
                            this.showNotification(`${pageName}: No bonus (Emotion Level ${emotionLevel}, requires 2+).`, 'info');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Coordinated Assault: [On Use] If Emotion Level 2+ gain dice power +2 on attack dice
                if (pageName === 'Coordinated Assault') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const emotionLevel = Math.max(0, Number(this.encounterState.emotionLevel) || 0);
                        if (emotionLevel >= 2) {
                            if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + 2);
                            this.showNotification(`${pageName}: +2 dice power this phase (Emotion Level ${emotionLevel}).`, 'success');
                        } else {
                            this.showNotification(`${pageName}: No bonus (Emotion Level ${emotionLevel}, requires 2+).`, 'info');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Emotional Turbulence: [On Use] Gain 2 Positive Emotion Point
                if (pageName === 'Emotional Turbulence') {
                    try {
                        if (typeof this.addEmotionTyped === 'function') {
                            this.addEmotionTyped('positive');
                            this.addEmotionTyped('positive');
                            this.showNotification('Emotional Turbulence: Gained 2 Positive Emotion.', 'success');
                        } else if (typeof this.addEmotion === 'function') {
                            this.addEmotion(2);
                            this.encounterState.emotionPositive = (this.encounterState.emotionPositive || 0) + 2;
                            this.showNotification('Emotional Turbulence: Gained 2 Positive Emotion.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Inner Ardor: [On Use] Gain 1 Positive Emotion Point
                if (pageName === 'Inner Ardor') {
                    try {
                        if (typeof this.addEmotionTyped === 'function') {
                            this.addEmotionTyped('positive');
                            this.showNotification('Inner Ardor: Gained 1 Positive Emotion.', 'success');
                        } else if (typeof this.addEmotion === 'function') {
                            this.addEmotion(1);
                            if (!this.encounterState.emotionPositive) this.encounterState.emotionPositive = 0;
                            this.encounterState.emotionPositive = (this.encounterState.emotionPositive || 0) + 1;
                            this.showNotification('Inner Ardor: Gained 1 Positive Emotion.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }
                // Flowing Flame: [On Use] Gain 1 Positive Emotion Point
                if (pageName === 'Flowing Flame') {
                    try {
                        if (typeof this.addEmotionTyped === 'function') {
                            this.addEmotionTyped('positive');
                            this.showNotification('Flowing Flame: Gained 1 Positive Emotion.', 'success');
                        } else if (typeof this.addEmotion === 'function') {
                            this.addEmotion(1);
                            if (!this.encounterState.emotionPositive) this.encounterState.emotionPositive = 0;
                            this.encounterState.emotionPositive = (this.encounterState.emotionPositive || 0) + 1;
                            this.showNotification('Flowing Flame: Gained 1 Positive Emotion.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // All-out War: [On Use] Give every ally 1 Power Up, 1 Protection next scene; All dice on this page gain +1 Power for every 2 Emotion Levels
                if (pageName === 'All-out War') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        // Give 1 Power Up and 1 Protection next scene
                        const pendingPower = (typeof this.encounterState.powerUpNextScene === 'number') ? this.encounterState.powerUpNextScene : 0;
                        const pendingProt = (typeof this.encounterState.protectionNextScene === 'number') ? this.encounterState.protectionNextScene : 0;
                        this.encounterState.powerUpNextScene = Math.min(10, pendingPower + 1);
                        this.encounterState.protectionNextScene = Math.min(10, pendingProt + 1);
                        this.showNotification('All-out War: Will gain 1 Power Up and 1 Protection next scene.', 'success');
                        // All dice on this page gain +1 Power for every 2 Emotion Levels
                        const emotionLevel = Math.max(0, Number(this.encounterState.emotionLevel) || 0);
                        const powerBonus = Math.floor(emotionLevel / 2);
                        if (powerBonus > 0) {
                            if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + powerBonus);
                            this.showNotification(`All-out War: All dice gain +${powerBonus} Power (Emotion Level ${emotionLevel}).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Fiery Dragon Slash: Can only be used when Emotion Level 3+; All dice on this page gain +3 Power for every 1 Emotion Level
                if (pageName === 'Fiery Dragon Slash') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const emotionLevel = Math.max(0, Number(this.encounterState.emotionLevel) || 0);
                        if (emotionLevel < 3) {
                            this.showNotification(`Fiery Dragon Slash: Requires Emotion Level 3+ (current: ${emotionLevel}).`, 'warning');
                            return;
                        }
                        // All dice on this page gain +3 Power for every 1 Emotion Level
                        const powerBonus = emotionLevel * 3;
                        if (powerBonus > 0) {
                            if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + powerBonus);
                            this.showNotification(`Fiery Dragon Slash: All dice gain +${powerBonus} Power (Emotion Level ${emotionLevel} × 3).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Fervid Emotions: Can only be used when Emotion Level 2+; All dice on this page gain +1 Power for every 2 Emotion Levels
                if (pageName === 'Fervid Emotions') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const emotionLevel = Math.max(0, Number(this.encounterState.emotionLevel) || 0);
                        if (emotionLevel < 2) {
                            this.showNotification(`Fervid Emotions: Requires Emotion Level 2+ (current: ${emotionLevel}).`, 'warning');
                            return;
                        }
                        // All dice on this page gain +1 Power for every 2 Emotion Levels
                        const powerBonus = Math.floor(emotionLevel / 2);
                        if (powerBonus > 0) {
                            if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + powerBonus);
                            this.showNotification(`Fervid Emotions: All dice gain +${powerBonus} Power (Emotion Level ${emotionLevel}).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Pinpoint Shot: [On Use] +1 dice power per 5 Charge (Max 3); +2 if 7+ Speed
                if (pageName === 'Pinpoint Shot') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                        const chargePot = Math.max(0, Number(this.encounterState.chargePotencyThisScene) || 0);
                        const stacks = Math.max(0, Math.min(3, Math.floor(chargePot / 5)));
                        let totalBonus = stacks;
                        const speedVal = Number(assignment?.value);
                        if (Number.isFinite(speedVal) && speedVal >= 7) {
                            totalBonus += 2;
                            this.showNotification(`Pinpoint Shot: +2 dice power for 7+ Speed (Speed ${speedVal}).`, 'success');
                        }
                        if (totalBonus > 0) {
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + totalBonus);
                            this.showNotification(`Pinpoint Shot: +${totalBonus} dice power this phase (Charge ${chargePot}${(Number.isFinite(speedVal) && speedVal >= 7) ? `, Speed ${speedVal}` : ''}).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Excise Target: After Use effects handled after rolling (queue here)
                if (pageName === 'Excise Target') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState._exciseTargetUsedThisPhase = true;
                    } catch (e) { /* non-fatal */ }
                }

                // Flaying Surge: [On Use] +1 dice power per 5 Charge Potency (Max 3); [On Use] Consume 8 Charge Potency, Deal 30 Fixed SP damage
                if (pageName === 'Flaying Surge') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                        const chargePot = Math.max(0, Number(this.encounterState.chargePotencyThisScene) || 0);
                        const stacks = Math.max(0, Math.min(3, Math.floor(chargePot / 5)));
                        if (stacks > 0) {
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + stacks);
                            this.showNotification(`Flaying Surge: +${stacks} dice power this phase (Charge ${chargePot}).`, 'success');
                        }
                        // Consume 8 Charge Potency
                        if (chargePot >= 8) {
                            this.encounterState.chargePotencyThisScene = Math.max(0, chargePot - 8);
                            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                            this.showNotification('Flaying Surge: Consumed 8 Charge Potency.', 'info');
                        } else {
                            this.showNotification('Flaying Surge: Insufficient Charge Potency (requires 8).', 'warning');
                        }
                        // Deal 30 Fixed SP damage
                        const currentSpEl = document.getElementById('currentSp');
                        const maxSpEl = document.getElementById('maxSp');
                        const curSp = currentSpEl ? parseInt(currentSpEl.value, 10) : NaN;
                        const maxSp = maxSpEl ? parseInt(maxSpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curSp) && Number.isFinite(maxSp)) {
                            const newSp = Math.max(0, curSp - 30);
                            currentSpEl.value = newSp;
                            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                            this.showNotification('Flaying Surge: Dealt 30 Fixed SP damage.', 'warning');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Heel Turn: [On Use] +1 dice power per 6 Poise Potency (Max 3)
                if (pageName === 'Heel Turn') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                        const poisePot = Math.max(0, Number(this.encounterState.poisePotencyThisScene) || 0);
                        const stacks = Math.max(0, Math.min(3, Math.floor(poisePot / 6)));
                        if (stacks > 0) {
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + stacks);
                            this.showNotification(`Heel Turn: +${stacks} dice power this phase (Poise ${poisePot}).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Thumb: Suppressing Shot / Focus Fire / Steel Knuckles / Class and Respect / Summary Judgement / Le Regole
                // [On Use] All dice on this page gain +1 dice Power for every 1 Page Drawn this Scene (Max.3)
                if (
                    pageName === 'Suppressing Shot' ||
                    pageName === 'Focus Fire' ||
                    pageName === 'Steel Knuckles' ||
                    pageName === 'Class and Respect' ||
                    pageName === 'Summary Judgement' ||
                    pageName === 'Le Regole'
                ) {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                        const drawn = Math.max(0, Number(this.encounterState.pagesDrawnThisScene) || 0);
                        const addFlat = Math.min(3, drawn);
                        if (addFlat > 0) {
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + addFlat);
                            this.showNotification(`${pageName}: +${addFlat} dice power this phase (Pages drawn this scene: ${drawn}).`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Class and Respect additional On Use effects:
                // [On Use] All ally dices receive +2 dice Power for next Scene
                // [On Use] All allies receive +2 Power Up for next Scene
                if (pageName === 'Class and Respect') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const prevFlatNext = Number(this.encounterState.allyFlatDicePowerNextScene) || 0;
                        const prevPowerNext = Number(this.encounterState.powerUpNextScene) || 0;
                        this.encounterState.allyFlatDicePowerNextScene = Math.max(0, Math.min(10, prevFlatNext + 2));
                        this.encounterState.powerUpNextScene = Math.max(0, Math.min(10, prevPowerNext + 2));
                        this.showNotification('Class and Respect: Allies will gain +2 dice power and +2 Power Up next scene.', 'success');
                    } catch (e) { /* non-fatal */ }
                }

                // To Overcome Crisis: [On Use] If HP under 40%, Gain 2 Poise Potency and 1 Poise Count
                if (pageName === 'To Overcome Crisis') {
                    try {
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
                            const hpPct = (curHp / maxHp) * 100;
                            if (hpPct < 40) {
                                if (typeof this.addPoiseThisScene === 'function') {
                                    this.addPoiseThisScene(2, 1);
                                } else {
                                    if (!this.encounterState) this.encounterState = {};
                                    this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                                    this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 1;
                                }
                                this.showNotification('To Overcome Crisis: HP under 40%. Gained 2 Poise Potency and 1 Poise Count.', 'success');
                                if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                                // Refresh Poise crit parameters to include on-use effects before rolling
                                if (!poiseParamsRefreshed) {
                                    poisePotencyForCrit = (this.encounterState && typeof this.encounterState.poisePotencyThisScene === 'number') ? this.encounterState.poisePotencyThisScene : 0;
                                    remainingPoiseCountForCrit = (this.encounterState && typeof this.encounterState.poiseCountThisScene === 'number') ? this.encounterState.poiseCountThisScene : 0;
                                    critChancePct = Math.max(0, Math.min(100, poisePotencyForCrit * 5));
                                    poiseParamsRefreshed = true;
                                }
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Extreme Edge: [On Use] If HP under 40%, Gain 2 Poise Potency
                if (pageName === 'Extreme Edge') {
                    try {
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
                            const hpPct = (curHp / maxHp) * 100;
                            if (hpPct < 40) {
                                if (typeof this.addPoiseThisScene === 'function') {
                                    // No Count increase for Extreme Edge
                                    this.addPoiseThisScene(2, 0);
                                } else {
                                    if (!this.encounterState) this.encounterState = {};
                                    this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 2;
                                }
                                this.showNotification('Extreme Edge: HP under 40%. Gained 2 Poise Potency.', 'success');
                                if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                                // Refresh Poise crit parameters to include on-use effects before rolling
                                if (!poiseParamsRefreshed) {
                                    poisePotencyForCrit = (this.encounterState && typeof this.encounterState.poisePotencyThisScene === 'number') ? this.encounterState.poisePotencyThisScene : 0;
                                    remainingPoiseCountForCrit = (this.encounterState && typeof this.encounterState.poiseCountThisScene === 'number') ? this.encounterState.poiseCountThisScene : 0;
                                    critChancePct = Math.max(0, Math.min(100, poisePotencyForCrit * 5));
                                    poiseParamsRefreshed = true;
                                }
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Boundary of Death: [On Use] If HP under 40%, Gain 4 Poise Potency and 4 Poise Count
                if (pageName === 'Boundary of Death') {
                    try {
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
                            const hpPct = (curHp / maxHp) * 100;
                            if (hpPct < 40) {
                                if (typeof this.addPoiseThisScene === 'function') {
                                    this.addPoiseThisScene(4, 4);
                                } else {
                                    if (!this.encounterState) this.encounterState = {};
                                    this.encounterState.poisePotencyThisScene = (this.encounterState.poisePotencyThisScene || 0) + 4;
                                    this.encounterState.poiseCountThisScene = (this.encounterState.poiseCountThisScene || 0) + 4;
                                }
                                this.showNotification('Boundary of Death: HP under 40%. Gained 4 Poise Potency and 4 Poise Count.', 'success');
                                if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                                // Refresh Poise crit parameters to include on-use effects before rolling
                                if (!poiseParamsRefreshed) {
                                    poisePotencyForCrit = (this.encounterState && typeof this.encounterState.poisePotencyThisScene === 'number') ? this.encounterState.poisePotencyThisScene : 0;
                                    remainingPoiseCountForCrit = (this.encounterState && typeof this.encounterState.poiseCountThisScene === 'number') ? this.encounterState.poiseCountThisScene : 0;
                                    critChancePct = Math.max(0, Math.min(100, poisePotencyForCrit * 5));
                                    poiseParamsRefreshed = true;
                                }
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Endless Battle: [On Use] If HP under 40%, gain +3 Max dice power for this Page this phase
                if (pageName === 'Endless Battle') {
                    try {
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
                            const hpPct = (curHp / maxHp) * 100;
                            if (hpPct < 40) {
                                if (!this.encounterState) this.encounterState = {};
                                if (!this.encounterState.pageMaxPowerBonusThisPhase) this.encounterState.pageMaxPowerBonusThisPhase = {};
                                const prev = Number(this.encounterState.pageMaxPowerBonusThisPhase[pageName]) || 0;
                                this.encounterState.pageMaxPowerBonusThisPhase[pageName] = Math.max(0, prev + 3);
                                this.showNotification('Endless Battle: HP under 40%. This page gains +3 Max dice power this phase.', 'success');
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Flashing Strike: [On Use] Gain +4 dice power in this Page if the assigned speed die is 6+
                if (pageName === 'Flashing Strike') {
                    try {
                        const speedVal = Number(assignment?.value);
                        if (Number.isFinite(speedVal) && speedVal >= 6) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.pageFlatPowerBonusThisPhase) this.encounterState.pageFlatPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageFlatPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageFlatPowerBonusThisPhase[pageName] = Math.max(0, prev + 4);
                            this.showNotification('Flashing Strike: Speed ≥ 6. This page gains +4 dice power this phase.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Remise: [On Use] Gain +3 Max dice power in this Page if the assigned speed die is 6+
                if (pageName === 'Remise') {
                    try {
                        const speedVal = Number(assignment?.value);
                        if (Number.isFinite(speedVal) && speedVal >= 6) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.pageMaxPowerBonusThisPhase) this.encounterState.pageMaxPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageMaxPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageMaxPowerBonusThisPhase[pageName] = Math.max(0, prev + 3);
                            this.showNotification('Remise: Speed ≥ 6. This page gains +3 Max dice power this phase.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Marche: [On Use] Gain +3 Max dice power in this Page if have 6+ Speed
                if (pageName === 'Marche') {
                    try {
                        const speedVal = Number(assignment?.value);
                        if (Number.isFinite(speedVal) && speedVal >= 6) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.pageMaxPowerBonusThisPhase) this.encounterState.pageMaxPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageMaxPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageMaxPowerBonusThisPhase[pageName] = Math.max(0, prev + 3);
                            this.showNotification('Marche: Speed ≥ 6. This page gains +3 Max dice power this phase.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Feint: [On Use] Gain +4 Max dice power in this Page if have 6+ Speed
                if (pageName === 'Feint') {
                    try {
                        const speedVal = Number(assignment?.value);
                        if (Number.isFinite(speedVal) && speedVal >= 6) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.pageMaxPowerBonusThisPhase) this.encounterState.pageMaxPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageMaxPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageMaxPowerBonusThisPhase[pageName] = Math.max(0, prev + 4);
                            this.showNotification('Feint: Speed ≥ 6. This page gains +4 Max dice power this phase.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Flèche: [On Use] Gain +6 Min dice power if speed ≥ 6; +3 Min per 5 Poise Potency (Max 3 stacks)
                if (pageName === 'Flèche') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        if (!this.encounterState.pageMinPowerBonusThisPhase) this.encounterState.pageMinPowerBonusThisPhase = {};
                        let addMin = 0;
                        // Speed condition: +6 min power if assigned die is 6+
                        const speedVal = Number(assignment?.value);
                        if (Number.isFinite(speedVal) && speedVal >= 6) {
                            addMin += 6;
                        }
                        // Poise scaling: +3 min per 5 Poise Potency (Max 3 stacks)
                        const currentPoisePot = Number(this.encounterState?.poisePotencyThisScene) || 0;
                        if (currentPoisePot > 0) {
                            const stacks = Math.max(0, Math.min(3, Math.floor(currentPoisePot / 5)));
                            addMin += stacks * 3;
                        }
                        if (addMin > 0) {
                            const prev = Number(this.encounterState.pageMinPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageMinPowerBonusThisPhase[pageName] = Math.max(0, prev + addMin);
                            this.showNotification(`Flèche: Min dice power +${addMin} this phase.`, 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Cinq Western Association conditional min-power bonuses if target has 3+ Focused Attack
                // We treat Focused Attack stacks (focusedAttackStacks) as the condition source
                const targetHasFocused3Plus = (Number(this.encounterState?.focusedAttackStacks) || 0) >= 3;

                // Riposte: +3 Min dice power
                if (pageName === 'Riposte') {
                    try {
                        if (targetHasFocused3Plus) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.pageMinPowerBonusThisPhase) this.encounterState.pageMinPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageMinPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageMinPowerBonusThisPhase[pageName] = Math.max(0, prev + 3);
                            this.showNotification('Riposte: Target has 3+ Focused Attack. Min dice power +3 this phase.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }
                // Coup Droit: +3 Min dice power
                if (pageName === 'Coup Droit') {
                    try {
                        if (targetHasFocused3Plus) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.pageMinPowerBonusThisPhase) this.encounterState.pageMinPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageMinPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageMinPowerBonusThisPhase[pageName] = Math.max(0, prev + 3);
                            this.showNotification('Coup Droit: Target has 3+ Focused Attack. Min dice power +3 this phase.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }
                // Contre Attaque: +3 Min dice power
                if (pageName === 'Contre Attaque') {
                    try {
                        if (targetHasFocused3Plus) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.pageMinPowerBonusThisPhase) this.encounterState.pageMinPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageMinPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageMinPowerBonusThisPhase[pageName] = Math.max(0, prev + 3);
                            this.showNotification('Contre Attaque: Target has 3+ Focused Attack. Min dice power +3 this phase.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }
                // Fente: +6 Min dice power
                if (pageName === 'Fente') {
                    try {
                        if (targetHasFocused3Plus) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.pageMinPowerBonusThisPhase) this.encounterState.pageMinPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageMinPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageMinPowerBonusThisPhase[pageName] = Math.max(0, prev + 6);
                            this.showNotification('Fente: Target has 3+ Focused Attack. Min dice power +6 this phase.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }
                // Salut: +5 Min dice power
                if (pageName === 'Salut') {
                    try {
                        if (targetHasFocused3Plus) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.pageMinPowerBonusThisPhase) this.encounterState.pageMinPowerBonusThisPhase = {};
                            const prev = Number(this.encounterState.pageMinPowerBonusThisPhase[pageName]) || 0;
                            this.encounterState.pageMinPowerBonusThisPhase[pageName] = Math.max(0, prev + 5);
                            this.showNotification('Salut: Target has 3+ Focused Attack. Min dice power +5 this phase.', 'success');
                        }
                    } catch (e) { /* non-fatal */ }
                }

				// Desperate Struggle: [On Use] If HP under 40%, Gain 1 Attack Power Up next scene
                if (pageName === 'Desperate Struggle') {
                    try {
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
                            const hpPct = (curHp / maxHp) * 100;
                            if (hpPct < 40) {
                                if (!this.encounterState) this.encounterState = {};
                                const currentQueued = (typeof this.encounterState.attackPowerUpNextScene === 'number') ? this.encounterState.attackPowerUpNextScene : 0;
                                this.encounterState.attackPowerUpNextScene = Math.max(0, Math.min(10, currentQueued + 1));
                                this.showNotification('Desperate Struggle: HP under 40%. Will gain 1 Attack Power Up next scene.', 'success');
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                }

                // Impugnatio Ultima: [On Use] Discard all pages on hand; Receive X Slash DMG Up (X = Pages Discarded)
                if (pageName === 'Impugnatio Ultima') {
                    try {
                        if (!this.encounterState) this.encounterState = {};
                        const handNormal = Array.isArray(this.encounterState.handNormal) ? this.encounterState.handNormal : [];
                        const handSpecial = Array.isArray(this.encounterState.handSpecial) ? this.encounterState.handSpecial : [];
                        const allPages = [...handNormal, ...handSpecial];
                        if (allPages.length > 0) {
                            // Identify discardable pages (exclude Special pages)
                            const pagesToDiscard = [];
                            for (let i = 0; i < allPages.length; i++) {
                                const pid = allPages[i];
                                const p = window.pageManager?.pages?.[pid];
                                const isSpecial = !!(p && typeof p.range === 'string' && p.range === 'Special');
                                if (!isSpecial) pagesToDiscard.push(pid);
                            }
                            // Discard from handNormal and handSpecial
                            if (pagesToDiscard.length > 0) {
                                const discardSet = new Set(pagesToDiscard);
                                // Remove from handNormal
                                const newHandNormal = handNormal.filter(pid => !discardSet.has(pid));
                                // Remove from handSpecial (though Special pages shouldn't be in discardSet, this is safe)
                                const newHandSpecial = handSpecial.filter(pid => !discardSet.has(pid));
                                // Count actual discarded pages (from both arrays)
                                const discardedCount = (handNormal.length - newHandNormal.length) + (handSpecial.length - newHandSpecial.length);
                                // Update both arrays
                                this.encounterState.handNormal = newHandNormal;
                                this.encounterState.handSpecial = newHandSpecial;
                                // Reconstruct combined hand
                                this.encounterState.hand = [...newHandNormal, ...newHandSpecial];
                                // Update hand UI
                                if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
                                // Apply Slash DMG Up immediately (X = Pages Discarded)
                                if (typeof this.addSlashDmgUpThisScene === 'function') {
                                    this.addSlashDmgUpThisScene(discardedCount);
                                } else {
                                    const current = (typeof this.encounterState.slashDmgUpThisScene === 'number') ? this.encounterState.slashDmgUpThisScene : 0;
                                    this.encounterState.slashDmgUpThisScene = Math.max(0, Math.min(10, current + discardedCount));
                                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                                }
                                this.showNotification(`Impugnatio Ultima: Discarded ${discardedCount} page(s). Gained ${discardedCount} Slash DMG Up.`, 'success');
                                // After Use: forbid gaining Light for the rest of this encounter
                                this.encounterState.forbidLightGainThisEncounter = true;
                            } else {
                                this.showNotification('Impugnatio Ultima: No eligible pages to discard (Special pages are kept).', 'info');
                            }
                        } else {
                            this.showNotification('Impugnatio Ultima: Hand is empty. Nothing to discard.', 'info');
                        }
                    } catch (e) {
                        console.warn('Impugnatio Ultima on-use handling failed:', e);
                    }
                }
                // Defensive Stance immediate hand addition handled at placement
                // Your Shield: [On Use] Gain 1 Taunt next Scene, Gain 1 Protection next Scene
                if (pageName === 'Your Shield') {
                    if (!this.encounterState) this.encounterState = {};
                    const pendingProt = (typeof this.encounterState.protectionNextScene === 'number') ? this.encounterState.protectionNextScene : 0;
                    const pendingTaunt = (typeof this.encounterState.tauntNextScene === 'number') ? this.encounterState.tauntNextScene : 0;
                    this.encounterState.protectionNextScene = Math.min(10, pendingProt + 1);
                    this.encounterState.tauntNextScene = Math.min(10, pendingTaunt + 1);
                    this.showNotification('Your Shield: Will gain 1 Taunt and 1 Protection next scene.', 'success');
                }

                // Combat Preparation: [On Use] Gain 2 Protection next Scene; Gain 1 Defense Power Up next Scene
                if (pageName === 'Combat Preparation') {
                    if (!this.encounterState) this.encounterState = {};
                    const pendingProt = (typeof this.encounterState.protectionNextScene === 'number') ? this.encounterState.protectionNextScene : 0;
                    const pendingDefUp = (typeof this.encounterState.defensePowerUpNextScene === 'number') ? this.encounterState.defensePowerUpNextScene : 0;
                    this.encounterState.protectionNextScene = Math.min(10, pendingProt + 2);
                    this.encounterState.defensePowerUpNextScene = Math.min(10, pendingDefUp + 1);
                    this.showNotification('Combat Preparation: Will gain 2 Protection and 1 Defense Power Up next scene.', 'success');
                }

                // Fence: [On Use] Give 1 Protection next Scene
                if (pageName === 'Fence') {
                    if (!this.encounterState) this.encounterState = {};
                    const pendingProt = (typeof this.encounterState.protectionNextScene === 'number') ? this.encounterState.protectionNextScene : 0;
                    this.encounterState.protectionNextScene = Math.min(10, pendingProt + 1);
                    this.showNotification('Fence: Will gain 1 Protection next scene.', 'success');
                }

                // Flying Sword: [On Use] If HP under 40%, Gain 2 Haste next Scene
                if (pageName === 'Flying Sword') {
                    try {
                        const curHpEl = document.getElementById('currentHp');
                        const maxHpEl = document.getElementById('maxHp');
                        const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                        if (Number.isFinite(curHp) && Number.isFinite(maxHp) && maxHp > 0) {
                            const hpPct = (curHp / maxHp) * 100;
                            if (hpPct < 40) {
                                if (!this.encounterState) this.encounterState = {};
                                const pending = (typeof this.encounterState.hasteNextScene === 'number') ? this.encounterState.hasteNextScene : 0;
                                this.encounterState.hasteNextScene = Math.min(10, pending + 2);
                                this.showNotification('Flying Sword: HP under 40%. Will gain 2 Haste next scene.', 'success');
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                }

				// The Index: Unlock - I -> If Singleton, Draw 1 Page
				if (pageName === 'Unlock - I') {
					try {
						const isSingleton = (typeof this.isSingletonActive === 'function') && this.isSingletonActive();
						if (isSingleton && typeof this.drawImmediateCards === 'function') {
							this.drawImmediateCards(1);
						}
					} catch (e) { /* non-fatal */ }
				}

				// The Index: Unlock - II -> If Singleton, Draw 1 Page and Restore 1 Light
				if (pageName === 'Unlock - II') {
                    try {
						const isSingleton = (typeof this.isSingletonActive === 'function') && this.isSingletonActive();
						if (isSingleton) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.forbidLightGainThisEncounter) {
                                if (typeof this.encounterState.lightRefundThisScene !== 'number') {
                                    this.encounterState.lightRefundThisScene = 0;
                                }
                                this.encounterState.lightRefundThisScene += 1;
                                if (typeof this.updateCurrentLight === 'function') {
                                    this.updateCurrentLight();
                                }
                            } else {
                                this.showNotification('Light gain is disabled for this encounter.', 'info');
                            }
							if (typeof this.drawImmediateCards === 'function') {
								this.drawImmediateCards(1);
							}
						}
					} catch (e) { /* non-fatal */ }
				}

				// The Index: Unlock - III -> If Singleton, Draw 1 Page and Restore 2 Light
				if (pageName === 'Unlock - III') {
                    try {
						const isSingleton = (typeof this.isSingletonActive === 'function') && this.isSingletonActive();
						if (isSingleton) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.forbidLightGainThisEncounter) {
                                if (typeof this.encounterState.lightRefundThisScene !== 'number') {
                                    this.encounterState.lightRefundThisScene = 0;
                                }
                                this.encounterState.lightRefundThisScene += 2;
                                if (typeof this.updateCurrentLight === 'function') {
                                    this.updateCurrentLight();
                                }
                            } else {
                                this.showNotification('Light gain is disabled for this encounter.', 'info');
                            }
							if (typeof this.drawImmediateCards === 'function') {
								this.drawImmediateCards(1);
							}
						}
					} catch (e) { /* non-fatal */ }
				}

				// The Index: Unlock - IV -> If Singleton, Draw 2 Pages and Restore 2 Light
				if (pageName === 'Unlock - IV') {
                    try {
						const isSingleton = (typeof this.isSingletonActive === 'function') && this.isSingletonActive();
						if (isSingleton) {
                            if (!this.encounterState) this.encounterState = {};
                            if (!this.encounterState.forbidLightGainThisEncounter) {
                                if (typeof this.encounterState.lightRefundThisScene !== 'number') {
                                    this.encounterState.lightRefundThisScene = 0;
                                }
                                this.encounterState.lightRefundThisScene += 2;
                                if (typeof this.updateCurrentLight === 'function') {
                                    this.updateCurrentLight();
                                }
                            } else {
                                this.showNotification('Light gain is disabled for this encounter.', 'info');
                            }
							if (typeof this.drawImmediateCards === 'function') {
								this.drawImmediateCards(2);
							}
						}
					} catch (e) { /* non-fatal */ }
				}

				// The Index: Multislash -> If Singleton, Restore 2 Light; Draw 2 Pages
				if (pageName === 'Multislash') {
					try {
						const isSingleton = (typeof this.isSingletonActive === 'function') && this.isSingletonActive();
						if (isSingleton) {
							if (!this.encounterState) this.encounterState = {};
							if (typeof this.encounterState.lightRefundThisScene !== 'number') {
								this.encounterState.lightRefundThisScene = 0;
							}
							this.encounterState.lightRefundThisScene += 2;
							if (typeof this.updateCurrentLight === 'function') {
								this.updateCurrentLight();
							}
						}
						if (typeof this.drawImmediateCards === 'function') {
							this.drawImmediateCards(2);
						}
					} catch (e) { /* non-fatal */ }
				}

				// The Index: Will of the Prescript -> If Singleton, Draw 3 Pages
				if (pageName === 'Will of the Prescript') {
					try {
						const isSingleton = (typeof this.isSingletonActive === 'function') && this.isSingletonActive();
						if (isSingleton && typeof this.drawImmediateCards === 'function') {
							this.drawImmediateCards(3);
						}
					} catch (e) { /* non-fatal */ }
				}

				// The Index: Heavy Trace -> grant Swift Trace next scene
				if (pageName === 'Heavy Trace') {
					if (!this.encounterState) this.encounterState = {};
					this.encounterState.grantSwiftTraceNextScene = true;
				}

				// The Middle: Aim for the Solar Plexus -> grant Right in the Solar Plexus next scene
				if (pageName === 'Aim for the Solar Plexus') {
					if (!this.encounterState) this.encounterState = {};
					this.encounterState.grantRightInSolarPlexusNextScene = true;
				}

				// The Middle: Payback -> grant Payback with Interest next scene
				if (pageName === 'Payback') {
					if (!this.encounterState) this.encounterState = {};
					this.encounterState.grantPaybackWithInterestNextScene = true;
				}

				// Kurokumo Clan: Lenticular Swirl -> grant Lenticular Rend next scene
				if (pageName === 'Lenticular Swirl') {
					if (!this.encounterState) this.encounterState = {};
					this.encounterState.grantLenticularRendNextScene = true;
				}

				// Multicrack Office: Charge -> grant Charge Countercurrent next scene
				if (pageName === 'Charge') {
					if (!this.encounterState) this.encounterState = {};
					this.encounterState.grantChargeCountercurrentNextScene = true;
				}

				// The Index: Faith -> restore 1 Light next scene
				if (pageName === 'Faith') {
					if (!this.encounterState) this.encounterState = {};
					this.encounterState.restoreOneLightNextScene = true;
				}

				// The Index: Proselyte's Blade effect handled globally via proselytesBladeUsedThisPhase

				// Öufi Association: Sentence -> First Warning  logic
				if (pageName === 'Unrelenting Execution') {
					// Reset the ability to gain First Warning again
					if (!this.encounterState) this.encounterState = {};
					this.encounterState.canGrantFirstWarning = true;
					// Also allow using First Warning again this encounter by clearing its single-use mark
					if (this.encounterState.singleUsePagesUsed instanceof Set) {
						this.encounterState.singleUsePagesUsed.delete(94); // First Warning pageId
					}
				}
				if (pageName === 'Sentence') {
					if (!this.encounterState) this.encounterState = {};
					if (typeof this.encounterState.canGrantFirstWarning !== 'boolean') {
						this.encounterState.canGrantFirstWarning = true;
					}
				if (this.encounterState.canGrantFirstWarning) {
					// Queue First Warning to be added at the start of the next scene
					if (!Array.isArray(this.encounterState.pagesToReturnNextScene)) this.encounterState.pagesToReturnNextScene = [];
					if (!this.encounterState.pagesToReturnNextScene.includes(94)) {
						this.encounterState.pagesToReturnNextScene.push(94);
					}
					this.showNotification('Sentence: Will gain "First Warning" next scene.', 'success');
					// Consume the grant until Unrelenting Execution is used
					this.encounterState.canGrantFirstWarning = false;
				}
				}

                // Skip pages that don't require dice
                if (diceCount === '-' || diceCount === '0' || diceCount === 0) {
                    combatResults.push({
                        pageId: pageId,
                        pageName: pageName,
                        diceCount: 0,
                        diceResults: [],
                        totalDamage: 0,
                        message: `${pageName}: No dice required`
                    });
                    return;
                }
                
                // Parse dice count
                const requiredDice = parseInt(diceCount);
                if (isNaN(requiredDice) || requiredDice <= 0) {
                    console.warn(`Invalid dice count for page ${pageName}: ${diceCount}`);
                    return;
                }
                
                
                // Roll dice for this page based on details or custom overrides
                const diceResults = [];
                const diceCrits = [];
                let totalDamage = 0;
                const overthrowForceNat20 = (pageName === 'Overthrow' && this.encounterState && this.encounterState.overthrowForceNat20ThisPhase === true);
                // Jackpot: track whether we've already reused a crit die for this page
                let jackpotTriggeredForThisPage = false;
                
                // Parse the page details to get specific dice ranges
                const pageDetails = '';

                // Custom combat-range overrides by page name
                const customRangesByPage = loadCustomRanges();
                const customRanges = customRangesByPage[pageName];
                // Dice metadata by page (for per-die type like Shield/Evade)
                const diceDataAll = (typeof getDiceData === 'function') ? getDiceData() : null;
                const diceInfoForPage = diceDataAll && pageName ? (diceDataAll[pageName] || null) : null;
                // Helper: apply +Min and +Max dice power to the range bounds
                const computeEffectiveRange = (minValue, maxValue, currentDieIndex) => {
                    // Discipline: Dice power modifiers to min/max should not apply
                    if (pageName === 'Discipline') {
                        return [minValue, maxValue];
                    }
                    let effectiveMin = minValue;
                    let effectiveMax = maxValue;
                    try {
                        const minMap = this.encounterState?.pageMinPowerBonusThisPhase || {};
                        const minBonus = Number(minMap?.[pageName]) || 0;
                        if (minBonus > 0) effectiveMin = Math.max(0, minValue + minBonus);
                    } catch (e) { /* non-fatal */ }
                    try {
                        const bonusMap = this.encounterState?.pageMaxPowerBonusThisPhase || {};
                        const pageBonus = Number(bonusMap?.[pageName]) || 0;
                        if (pageBonus > 0) effectiveMax = maxValue + pageBonus;
                    } catch (e) { /* non-fatal */ }
                    // Apply global +Max bonus this phase (e.g., Declared Duel)
                    try {
                        const globalMax = Number(this.encounterState?.globalMaxPowerBonusThisPhase) || 0;
                        if (globalMax > 0) effectiveMax = effectiveMax + globalMax;
                    } catch (e) { /* non-fatal */ }

                    // Bind - Dice speed decreases by the effect's Count
                    try {
                        const bindValue = Number(this.encounterState?.bindThisScene) || 0;
                        if (bindValue > 0) {
                            effectiveMin = Math.max(1, effectiveMin - bindValue);
                            effectiveMax = Math.max(1, effectiveMax - bindValue);
                        }
                    } catch (e) { /* non-fatal */ }

                    // Paralysis handled per die (random selection) below using paralyzeDieIndexSet
                    
                    if (effectiveMax < effectiveMin) effectiveMax = effectiveMin;
                    return [effectiveMin, effectiveMax];
                };
                
                // Preselect which dice are affected by Paralysis this page
                let paralyzeDieIndexSet = null;
                try {
                    const availableParalysis = Math.max(0, Number(this.encounterState?.paralysisThisScene) || 0);
                    const toAffect = Math.min(requiredDice, availableParalysis);
                    if (toAffect > 0) {
                        paralyzeDieIndexSet = new Set();
                        const candidates = Array.from({ length: requiredDice }, (_, idx) => idx + 1);
                        for (let k = 0; k < toAffect; k++) {
                            if (candidates.length === 0) break;
                            const pickIdx = Math.floor(Math.random() * candidates.length);
                            const picked = candidates.splice(pickIdx, 1)[0];
                            paralyzeDieIndexSet.add(picked);
                        }
                    }
                } catch (e) { /* non-fatal */ }

                for (let i = 0; i < requiredDice; i++) {
                    // Per-die bullet gating for specific pages
                    const dieIndex = i + 1;
                    let dieConsumesBullet = false;
                    if (pageName === 'Suppressing Shot' && (dieIndex === 1 || dieIndex === 2)) dieConsumesBullet = true;
                    if (pageName === 'Focus Fire' && (dieIndex >= 1 && dieIndex <= 3)) dieConsumesBullet = true;
                    if (pageName === 'Class and Respect' && (dieIndex >= 1 && dieIndex <= 3)) dieConsumesBullet = true;
                    if (pageName === 'Le Regole' && (dieIndex === 1 || dieIndex === 2)) dieConsumesBullet = true;
                    if (pageName === 'Pinpoint Shot' && (dieIndex === 1 || dieIndex === 2)) dieConsumesBullet = true;

                    if (dieConsumesBullet) {
                        const bulletsRemainingNow = Number(this.encounterState?.bulletsRemaining) || 0;
                        if (bulletsRemainingNow <= 0) {
                            // No bullet for this die → die is lost (0)
                            diceResults.push(0);
                            diceCrits.push(false);
                            continue; // next die
                        }
                        // Consume one bullet for this die and sync UI
                        this.encounterState.bulletsRemaining = Math.max(0, bulletsRemainingNow - 1);
                        const bulletInputEl = document.getElementById('bulletCount');
                        if (bulletInputEl) bulletInputEl.value = this.encounterState.bulletsRemaining;
                        if (typeof this.updateBulletStatusDisplay === 'function') this.updateBulletStatusDisplay();
                    }
                    let rollResult;
                    // If custom ranges exist for this page, use them first
                    if (customRanges && customRanges[i]) {
                        const [minStr, maxStr] = customRanges[i].split('-');
                        let minValue = parseInt(minStr);
                        let maxValue = parseInt(maxStr);
                        // Handle reversed ranges like "20-0" (where max < min)
                        if (!isNaN(minValue) && !isNaN(maxValue)) {
                            if (maxValue < minValue) {
                                // Swap values for reversed ranges
                                [minValue, maxValue] = [maxValue, minValue];
                            }
                            if (maxValue >= minValue) {
                                let [effectiveMin, effectiveMax] = computeEffectiveRange(minValue, maxValue, dieIndex);
                                // If this die is selected for Paralysis, force min roll
                                if (paralyzeDieIndexSet && paralyzeDieIndexSet.has(dieIndex)) {
                                    effectiveMax = effectiveMin;
                                }
                                // Overthrow nat 20 guarantee: set die 1 to 20 for 1d20 version
                                if (pageName === 'Overthrow' && overthrowForceNat20 && dieIndex === 1) {
                                    rollResult = 20;
                                } else {
                                    rollResult = Math.floor(Math.random() * (effectiveMax - effectiveMin + 1)) + effectiveMin;
                                }
                            }
                        }
                    }
                    if (rollResult !== undefined) {
                        // Craft Bullet: per-die success based on this page's die roll vs threshold
                        if (pageName === 'Craft Bullet' && typeof rollResult === 'number') {
                            try {
                                // Use default fixed success threshold for Craft Bullet
                                const threshold = 16;
                                if (rollResult > threshold) {
                                    if (!this.encounterState) this.encounterState = {};
                                    const prev = Number(this.encounterState.bulletsRemaining) || 0;
                                    this.encounterState.bulletsRemaining = prev + 1;
                                    const bulletInputEl = document.getElementById('bulletCount');
                                    if (bulletInputEl) bulletInputEl.value = this.encounterState.bulletsRemaining;
                                    if (typeof this.updateBulletStatusDisplay === 'function') this.updateBulletStatusDisplay();
                                }
                            } catch (e) { /* non-fatal */ }
                        }
                        let totalBonus = 0;
                        // Global flat dice power from statuses (e.g., Focused Attack tier 3)
                        if (pageName !== 'Discipline') {
                            try {
                                const focusedFlat = Number(this.encounterState?.focusedAttackFlatDicePowerThisScene) || 0;
                                if (focusedFlat > 0) totalBonus += focusedFlat;
                            } catch (e) { /* non-fatal */ }
                            if (typeof dicePowerBonus === 'number') totalBonus += dicePowerBonus;
                            if (typeof pageSpecificBonus === 'number') totalBonus += pageSpecificBonus;
                            try {
                                const flatMap = this.encounterState?.pageFlatPowerBonusThisPhase || {};
                                const flatBonus = Number(flatMap?.[pageName]) || 0;
                                if (flatBonus !== 0) totalBonus += flatBonus; // Handles both positive (power up) and negative (power down)
                            } catch (e) { /* non-fatal */ }
                            // Generic Power Up applies to all dice (offense and defense)
                            if (this.encounterState && typeof this.encounterState.powerUpThisScene === 'number') {
                                totalBonus += this.encounterState.powerUpThisScene;
                            }
                            // Generic Power Down applies to all dice (offense and defense)
                            if (this.encounterState && typeof this.encounterState.powerDownThisScene === 'number') {
                                totalBonus -= this.encounterState.powerDownThisScene;
                            }
                            // Determine die type for conditional power ups
                            let isDefensiveDie = false;
                            try {
                                const dieMeta = Array.isArray(diceInfoForPage) ? (diceInfoForPage.find(d => Number(d?.dice) === (i + 1)) || null) : null;
                                const dieTypeStr = dieMeta && dieMeta.type ? String(dieMeta.type).toLowerCase() : '';
                                isDefensiveDie = dieTypeStr.includes('shield') || dieTypeStr.includes('evade');
                            } catch (e) { /* non-fatal */ }
                            // Attack Power Up applies to offensive dice (one-scene effect)
                            if (!isDefensiveDie && this.encounterState && typeof this.encounterState.attackPowerUpThisScene === 'number') {
                                totalBonus += this.encounterState.attackPowerUpThisScene;
                            }
                            // Smell of Fear: Ben Graham gains +2 dice power while this status is active
                            if (!isDefensiveDie && this.encounterState && this.encounterState.smellOfFearActive === true) {
                                const ch = this.currentCharacter;
                                if (ch && ch.name === 'Ben Graham') {
                                    totalBonus += 2;
                                }
                            }
                            // Zwei Defensive Stance: offensive dice lose 2 dice power
                            if (!isDefensiveDie && this.encounterState && this.encounterState.zweiDefensiveStanceActive === true) {
                                totalBonus -= 2;
                            }
                            // Defense Power Up applies only to defensive dice (Shield/Evade)
                            if (isDefensiveDie && this.encounterState && typeof this.encounterState.defensePowerUpThisScene === 'number') {
                                totalBonus += this.encounterState.defensePowerUpThisScene;
                            }
                            // Apply debuff effects
                            if (!isDefensiveDie && this.encounterState && typeof this.encounterState.attackPowerDownThisScene === 'number') {
                                totalBonus -= this.encounterState.attackPowerDownThisScene;
                            }
                            if (isDefensiveDie && this.encounterState && typeof this.encounterState.defensePowerDownThisScene === 'number') {
                                totalBonus -= this.encounterState.defensePowerDownThisScene;
                            }
                        }
                        let finalResult = (typeof rollResult === 'number' && totalBonus) ? rollResult + totalBonus : rollResult;
                        // If this die is selected for Paralysis, consume 1 stack now
                        if (paralyzeDieIndexSet && paralyzeDieIndexSet.has(dieIndex)) {
                            const curPar = Number(this.encounterState?.paralysisThisScene) || 0;
                            const nextPar = Math.max(0, curPar - 1);
                            if (!this.encounterState) this.encounterState = {};
                            this.encounterState.paralysisThisScene = nextPar;
                            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        }
                        // Determine critical hit based on Poise (Potency and Count) — offensive dice only
                        let isDefensiveForCrit = false;
                        try {
                            const dieMetaCrit = Array.isArray(diceInfoForPage) ? (diceInfoForPage.find(d => Number(d?.dice) === (i + 1)) || null) : null;
                            const dieTypeCrit = dieMetaCrit && dieMetaCrit.type ? String(dieMetaCrit.type).toLowerCase() : '';
                            isDefensiveForCrit =
                                dieTypeCrit.includes('shield') ||
                                dieTypeCrit.includes('evade') ||
                                dieTypeCrit.includes('counter') ||
                                dieTypeCrit.includes('clash dice - shield') ||
                                dieTypeCrit.includes('clash dice - evade');
                            // Page-level override: any "Counter" page (including Overthrow) cannot crit regardless of die type
                            if (pageName && typeof pageName === 'string') {
                                const pageNameLower = pageName.toLowerCase();
                                if ((pageNameLower.includes('counter') || pageNameLower === 'overthrow') && pageNameLower !== 'overthrow: counter slash') {
                                    isDefensiveForCrit = true;
                                }
                            }
                            // Check for [Condition] Cannot Crit in dice 0 entry
                            if (Array.isArray(diceInfoForPage)) {
                                const dice0Entry = diceInfoForPage.find(d => Number(d?.dice) === 0);
                                if (dice0Entry && dice0Entry.special && typeof dice0Entry.special === 'string') {
                                    if (dice0Entry.special.includes('[Condition] Cannot Crit')) {
                                        isDefensiveForCrit = true;
                                    }
                                }
                            }
                        } catch (e) { /* non-fatal */ }
                        const didCrit = (!isDefensiveForCrit) && (critChancePct > 0) && (remainingPoiseCountForCrit > 0) && (Math.random() * 100 < critChancePct);
                        if (didCrit) {
                            remainingPoiseCountForCrit = Math.max(0, remainingPoiseCountForCrit - 1);
                            // Sync back to encounter state and refresh UI so Poise updates/disappears when Count reaches 0
                            if (!this.encounterState) this.encounterState = {};
                            this.encounterState.poiseCountThisScene = remainingPoiseCountForCrit;
                            // If Count is 0, clear Potency so the status fully disappears
                            if (remainingPoiseCountForCrit === 0) {
                                this.encounterState.poisePotencyThisScene = 0;
                            }
                            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                            
                            // Jackpot: reuse the first crit die for each Jackpot stack
                            try {
                                const jackpotCount = Math.max(0, Number(this.encounterState?.jackpotCountThisScene) || 0);
                                if (jackpotCount > 0 && jackpotTriggeredForThisPage === false) {
                                    let jackpotRemaining = jackpotCount;
                                    let usedReuses = 0;
                                    // Chain: stop immediately if a reuse does not crit
                                    while (jackpotRemaining > 0) {
                                        const reuseCrit = (!isDefensiveForCrit) && (critChancePct > 0) && (remainingPoiseCountForCrit > 0) && (Math.random() * 100 < critChancePct);
                                        if (reuseCrit) {
                                            remainingPoiseCountForCrit = Math.max(0, remainingPoiseCountForCrit - 1);
                                            if (!this.encounterState) this.encounterState = {};
                                            this.encounterState.poiseCountThisScene = remainingPoiseCountForCrit;
                                            if (remainingPoiseCountForCrit === 0) this.encounterState.poisePotencyThisScene = 0;
                                        }
                                        diceResults.push(finalResult);
                                        diceCrits.push(!!reuseCrit);
                                        totalDamage += finalResult;
                                        usedReuses++;
                                        jackpotRemaining--;
                                        if (!reuseCrit) break; // stop chain if reuse didn't crit
                                    }
                                    // Persist unused stacks
                                    this.encounterState.jackpotCountThisScene = jackpotRemaining;
                                    jackpotTriggeredForThisPage = true;
                                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                                    this.showNotification(`Jackpot: Re-used die ${usedReuses} time(s).`, 'success');
                                }
                            } catch (e) { /* non-fatal */ }
                        }
                        // Bleed: For every individual offensive attack die, take fixed damage equal to Bleed Potency and reduce Count by 1
                        try {
                            const bleedPot = Math.max(0, Number(this.encounterState?.bleedPotency) || 0);
                            let bleedCnt = Math.max(0, Number(this.encounterState?.bleedCount) || 0);
                            if (bleedPot > 0 && bleedCnt > 0 && !isDefensiveForCrit) {
                                if (typeof this.applyHpDamage === 'function') {
                                    this.applyHpDamage(bleedPot, 'Bleed');
                                    bleedCnt = Math.max(0, bleedCnt - 1);
                                    this.encounterState.bleedCount = bleedCnt;
                                    if (bleedCnt === 0) this.encounterState.bleedPotency = 0;
                                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                                }
                            }
                        } catch (e) { /* non-fatal */ }
						// Apply Proselyte's Blade penalty: other pages' dice -3
						if (proselytesBladeUsedThisPhase && pageName !== "Proselyte's Blade" && pageName !== 'Discipline') {
							finalResult = Math.max(0, (typeof finalResult === 'number' ? finalResult - 3 : finalResult));
						}
                        diceResults.push(finalResult);
                        diceCrits.push(!!didCrit);
						totalDamage += finalResult;
						continue;
					}
                    
                    //Keep this for uhh idk
                    const dicePattern = new RegExp(`Dice ${dieIndex}:\\s*(?:\\w+\\s+)?(\\d+)-(\\d+)`, 'i');
                    const match = pageDetails.match(dicePattern);
                    
                    if (match) {
                        // Use the specific range from the page details
                        let minValue = parseInt(match[1]);
                        let maxValue = parseInt(match[2]);
                        
                        // Handle reversed ranges like "20-0" (where max < min)
                        if (!isNaN(minValue) && !isNaN(maxValue)) {
                            if (maxValue < minValue) {
                                // Swap values for reversed ranges
                                [minValue, maxValue] = [maxValue, minValue];
                            }
                            if (maxValue >= minValue) {
                                let [effectiveMin, effectiveMax] = computeEffectiveRange(minValue, maxValue, dieIndex);
                                // If this die is selected for Paralysis, force min roll
                                if (paralyzeDieIndexSet && paralyzeDieIndexSet.has(dieIndex)) {
                                    effectiveMax = effectiveMin;
                                }
                                rollResult = Math.floor(Math.random() * (effectiveMax - effectiveMin + 1)) + effectiveMin;
                            } else {
                                // Fallback to default range if parsing fails
                                rollResult = Math.floor(Math.random() * 6) + 1;
                            }
                        } else {
                            // Fallback to default range if parsing fails
                            rollResult = Math.floor(Math.random() * 6) + 1;
                        }
                    } else {
                        // Fallback: try to find any dice range in the details
                        const fallbackPattern = /(\d+)-(\d+)/;
                        const fallbackMatch = pageDetails.match(fallbackPattern);
                        
                        if (fallbackMatch) {
                            let minValue = parseInt(fallbackMatch[1]);
                            let maxValue = parseInt(fallbackMatch[2]);
                            
                            // Handle reversed ranges like "20-0" (where max < min)
                            if (!isNaN(minValue) && !isNaN(maxValue)) {
                                if (maxValue < minValue) {
                                    // Swap values for reversed ranges
                                    [minValue, maxValue] = [maxValue, minValue];
                                }
                                if (maxValue >= minValue) {
                                    const [effectiveMin, effectiveMax] = computeEffectiveRange(minValue, maxValue);
                                    rollResult = Math.floor(Math.random() * (effectiveMax - effectiveMin + 1)) + effectiveMin;
                                } else {
                                    rollResult = Math.floor(Math.random() * 6) + 1;
                                }
                            } else {
                                rollResult = Math.floor(Math.random() * 6) + 1;
                            }
                        } 
                    }
                    
                    let totalBonus = 0;
                    // Global flat dice power from statuses (e.g., Focused Attack tier 3)
                    try {
                        const focusedFlat = Number(this.encounterState?.focusedAttackFlatDicePowerThisScene) || 0;
                        if (focusedFlat > 0) totalBonus += focusedFlat;
                    } catch (e) { /* non-fatal */ }
                    if (typeof dicePowerBonus === 'number') totalBonus += dicePowerBonus;
                    if (typeof pageSpecificBonus === 'number') totalBonus += pageSpecificBonus;
                    // Per-page flat bonus for Endless Battle applies to all dice on that page
                    try {
                        const flatMap = this.encounterState?.pageFlatPowerBonusThisPhase || {};
                        const flatBonus = Number(flatMap?.[pageName]) || 0;
                        if (flatBonus > 0) totalBonus += flatBonus;
                    } catch (e) { /* non-fatal */ }
                    // Generic Power Up applies to all dice (offense and defense)
                    if (this.encounterState && typeof this.encounterState.powerUpThisScene === 'number') {
                        totalBonus += this.encounterState.powerUpThisScene;
                    }
                    // Determine die type for conditional power ups
                    let isDefensiveDie = false;
                    try {
                        const dieMeta = Array.isArray(diceInfoForPage) ? (diceInfoForPage.find(d => Number(d?.dice) === (i + 1)) || null) : null;
                        const dieTypeStr = dieMeta && dieMeta.type ? String(dieMeta.type).toLowerCase() : '';
                        isDefensiveDie = dieTypeStr.includes('shield') || dieTypeStr.includes('evade');
                        // Page-level override: any "Counter" page cannot crit regardless of die type
                        if (pageName && typeof pageName === 'string' && pageName.toLowerCase().includes('counter')) {
                            isDefensiveDie = true;
                        }
                    } catch (e) { /* non-fatal */ }
                    // Attack Power Up applies to offensive dice (one-scene effect)
                    if (!isDefensiveDie && this.encounterState && typeof this.encounterState.attackPowerUpThisScene === 'number') {
                        totalBonus += this.encounterState.attackPowerUpThisScene;
                    }
                    // Smell of Fear: Ben Graham gains +2 dice power while this status is active
                    if (!isDefensiveDie && this.encounterState && this.encounterState.smellOfFearActive === true) {
                        const ch = this.currentCharacter;
                        if (ch && ch.name === 'Ben Graham') {
                            totalBonus += 2;
                        }
                    }
                    // Zwei Defensive Stance: offensive dice lose 2 dice power
                    if (!isDefensiveDie && this.encounterState && this.encounterState.zweiDefensiveStanceActive === true) {
                        totalBonus -= 2;
                    }
                    // Defense Power Up applies only to defensive dice (Shield/Evade)
                    if (isDefensiveDie && this.encounterState && typeof this.encounterState.defensePowerUpThisScene === 'number') {
                        totalBonus += this.encounterState.defensePowerUpThisScene;
                    }
                    let finalResult = (typeof rollResult === 'number' && totalBonus) ? rollResult + totalBonus : rollResult;
                    // If this die is selected for Paralysis, consume 1 stack now
                    if (paralyzeDieIndexSet && paralyzeDieIndexSet.has(dieIndex)) {
                        const curPar = Number(this.encounterState?.paralysisThisScene) || 0;
                        const nextPar = Math.max(0, curPar - 1);
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.paralysisThisScene = nextPar;
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    // Determine critical hit based on Poise (Potency and Count) — offensive dice only
                    let isDefensiveForCrit2 = false;
                    try {
                        const dieMetaCrit2 = Array.isArray(diceInfoForPage) ? (diceInfoForPage.find(d => Number(d?.dice) === (i + 1)) || null) : null;
                        const dieTypeCrit2 = dieMetaCrit2 && dieMetaCrit2.type ? String(dieMetaCrit2.type).toLowerCase() : '';
                        isDefensiveForCrit2 =
                            dieTypeCrit2.includes('shield') ||
                            dieTypeCrit2.includes('evade') ||
                            dieTypeCrit2.includes('counter') ||
                            dieTypeCrit2.includes('clash dice - shield') ||
                            dieTypeCrit2.includes('clash dice - evade');
                        // Page-level override: any "Counter" page (including Overthrow) cannot crit regardless of die type
                        // Exception: "Overthrow: Counter Slash" can crit
                        if (pageName && typeof pageName === 'string') {
                            const pageNameLower = pageName.toLowerCase();
                            if ((pageNameLower.includes('counter') || pageNameLower === 'overthrow') && pageNameLower !== 'overthrow: counter slash') {
                                isDefensiveForCrit2 = true;
                            }
                        }
                        // Check for [Condition] Cannot Crit in dice 0 entry
                        if (Array.isArray(diceInfoForPage)) {
                            const dice0Entry = diceInfoForPage.find(d => Number(d?.dice) === 0);
                            if (dice0Entry && dice0Entry.special && typeof dice0Entry.special === 'string') {
                                if (dice0Entry.special.includes('[Condition] Cannot Crit')) {
                                    isDefensiveForCrit2 = true;
                                }
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                    const didCrit = (!isDefensiveForCrit2) && (critChancePct > 0) && (remainingPoiseCountForCrit > 0) && (Math.random() * 100 < critChancePct);
                    if (didCrit) {
                        remainingPoiseCountForCrit = Math.max(0, remainingPoiseCountForCrit - 1);
                        // Sync back to encounter state and refresh UI so Poise updates/disappears when Count reaches 0
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.poiseCountThisScene = remainingPoiseCountForCrit;
                        if (remainingPoiseCountForCrit === 0) {
                            this.encounterState.poisePotencyThisScene = 0;
                        }
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        
                        // Jackpot: reuse the first crit die for each Jackpot stack
                        try {
                            const jackpotCount = Math.max(0, Number(this.encounterState?.jackpotCountThisScene) || 0);
                            if (jackpotCount > 0 && jackpotTriggeredForThisPage === false) {
                                let jackpotRemaining = jackpotCount;
                                let usedReuses = 0;
                                // Chain: stop immediately if a reuse does not crit
                                while (jackpotRemaining > 0) {
                                    const reuseCrit = (!isDefensiveForCrit2) && (critChancePct > 0) && (remainingPoiseCountForCrit > 0) && (Math.random() * 100 < critChancePct);
                                    if (reuseCrit) {
                                        remainingPoiseCountForCrit = Math.max(0, remainingPoiseCountForCrit - 1);
                                        if (!this.encounterState) this.encounterState = {};
                                        this.encounterState.poiseCountThisScene = remainingPoiseCountForCrit;
                                        if (remainingPoiseCountForCrit === 0) this.encounterState.poisePotencyThisScene = 0;
                                    }
                                    diceResults.push(finalResult);
                                    diceCrits.push(!!reuseCrit);
                                    totalDamage += finalResult;
                                    usedReuses++;
                                    jackpotRemaining--;
                                    if (!reuseCrit) break; // stop chain if reuse didn't crit
                                }
                                // Persist unused stacks
                                this.encounterState.jackpotCountThisScene = jackpotRemaining;
                                jackpotTriggeredForThisPage = true;
                                if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                                this.showNotification(`Jackpot: Re-used die ${usedReuses} time(s).`, 'success');
                            }
                        } catch (e) { /* non-fatal */ }
                    }
					// Apply Proselyte's Blade penalty: other pages' dice -3
					if (proselytesBladeUsedThisPhase && pageName !== "Proselyte's Blade") {
						finalResult = Math.max(0, (typeof finalResult === 'number' ? finalResult - 3 : finalResult));
					}
                    diceResults.push(finalResult);
                    diceCrits.push(!!didCrit);
					totalDamage += finalResult;
                }
                
                // Parse dice ranges for display (respect custom overrides if present)
                const diceRanges = [];
                for (let i = 0; i < requiredDice; i++) {
                    if (customRanges && customRanges[i]) {
                        const [minStr, maxStr] = String(customRanges[i]).split('-');
                        const minValue = parseInt(minStr);
                        const maxValue = parseInt(maxStr);
                        if (!isNaN(minValue) && !isNaN(maxValue) && maxValue >= minValue) {
                            const [effMin, effMax] = computeEffectiveRange(minValue, maxValue);
                            diceRanges.push(`${effMin}-${effMax}`);
                        } else {
                            diceRanges.push(String(customRanges[i]));
                        }
                        continue;
                    }
                    const dieIndex = i + 1;
                    const dicePattern = new RegExp(`Dice ${dieIndex}:\\s*(?:\\w+\\s+)?(\\d+)-(\\d+)`, 'i');
                    const match = pageDetails.match(dicePattern);
                    if (match) {
                        const minValue = parseInt(match[1]);
                        const maxValue = parseInt(match[2]);
                        if (!isNaN(minValue) && !isNaN(maxValue)) {
                            const [effMin, effMax] = computeEffectiveRange(minValue, maxValue);
                            diceRanges.push(`${effMin}-${effMax}`);
                        } else {
                            diceRanges.push('1-6');
                        }
                    } else {
                        diceRanges.push('1-6');
                    }
                }
                
                // Add to combat results
                combatResults.push({
                    pageId: pageId,
                    pageName: pageName,
                    diceCount: requiredDice,
                    diceResults: diceResults,
                    diceCrits: diceCrits,
                    diceRanges: diceRanges,
                    message: `${pageName}: Rolled ${diceResults.join(', ')}`
                });
                // Clear Overthrow flag after use
                if (pageName === 'Overthrow' && this.encounterState && this.encounterState.overthrowForceNat20ThisPhase) {
                    this.encounterState.overthrowForceNat20ThisPhase = false;
                }

                // Overthrow follow-up: If rolled above 10 or rolled a nat 20, immediately use "Overthrow: Counter Slash"
                if (pageName === 'Overthrow') {
                    try {
                        const anyAboveTen = diceResults.some(v => typeof v === 'number' && v > 10);
                        const anyNatTwenty = diceResults.some(v => v === 20);
                        if (anyAboveTen || anyNatTwenty) {
                            // Roll "Overthrow: Counter Slash" immediately and append to results
                            const csPage = Object.values(window.pageManager?.pages || {}).find(p => p && p.name === 'Overthrow: Counter Slash');
                            if (csPage) {
                                const csName = csPage.name;
                                const csRanges = customRangesByPage[csName] || [];
                                const csRequiredDice = Array.isArray(csRanges) ? csRanges.length : parseInt(csPage.dice);
                                const csDiceResults = [];
                                const csDiceCrits = [];
                                const csDiceData = diceDataAll && diceDataAll[csName] ? diceDataAll[csName] : null;
                                for (let j = 0; j < csRequiredDice; j++) {
                                    let csRoll;
                                    if (csRanges && csRanges[j]) {
                                        const [minStr, maxStr] = String(csRanges[j]).split('-');
                                        const minValue = parseInt(minStr);
                                        const maxValue = parseInt(maxStr);
                                        if (!isNaN(minValue) && !isNaN(maxValue) && maxValue >= minValue) {
                                            const [effMin, effMax] = computeEffectiveRange(minValue, maxValue, j + 1);
                                            csRoll = Math.floor(Math.random() * (effMax - effMin + 1)) + effMin;
                                        }
                                    }
                                    if (typeof csRoll !== 'number') {
                                        csRoll = Math.floor(Math.random() * 6) + 1;
                                    }
                                    // Basic crit calculation reusing current critChancePct/remainingPoiseCountForCrit context
                                    let isDefDie = false;
                                    try {
                                        const dieMeta = Array.isArray(csDiceData) ? (csDiceData.find(d => Number(d?.dice) === (j + 1)) || null) : null;
                                        const dieTypeStr = dieMeta && dieMeta.type ? String(dieMeta.type).toLowerCase() : '';
                                        isDefDie = dieTypeStr.includes('shield') || dieTypeStr.includes('evade') || dieTypeStr.includes('counter') || dieTypeStr.includes('clash dice - shield') || dieTypeStr.includes('clash dice - evade');
                                        if (csName && typeof csName === 'string') {
                                            const csNameLower = csName.toLowerCase();
                                            if (csNameLower.includes('counter') && csNameLower !== 'overthrow: counter slash') {
                                                isDefDie = true;
                                            }
                                        }
                                        // Check for [Condition] Cannot Crit in dice 0 entry
                                        if (Array.isArray(csDiceData)) {
                                            const dice0Entry = csDiceData.find(d => Number(d?.dice) === 0);
                                            if (dice0Entry && dice0Entry.special && typeof dice0Entry.special === 'string') {
                                                if (dice0Entry.special.includes('[Condition] Cannot Crit')) {
                                                    isDefDie = true;
                                                }
                                            }
                                        }
                                    } catch (e) { /* non-fatal */ }
                                    const didCritCS = (!isDefDie) && (critChancePct > 0) && (remainingPoiseCountForCrit > 0) && (Math.random() * 100 < critChancePct);
                                    if (didCritCS) {
                                        remainingPoiseCountForCrit = Math.max(0, remainingPoiseCountForCrit - 1);
                                        if (!this.encounterState) this.encounterState = {};
                                        this.encounterState.poiseCountThisScene = remainingPoiseCountForCrit;
                                        if (remainingPoiseCountForCrit === 0) this.encounterState.poisePotencyThisScene = 0;
                                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                                    }
                                    csDiceResults.push(csRoll);
                                    csDiceCrits.push(!!didCritCS);
                                }
                                const csDiceRanges = [];
                                for (let j = 0; j < csRequiredDice; j++) {
                                    if (csRanges && csRanges[j]) {
                                        const [minStr, maxStr] = String(csRanges[j]).split('-');
                                        const minValue = parseInt(minStr);
                                        const maxValue = parseInt(maxStr);
                                        if (!isNaN(minValue) && !isNaN(maxValue)) {
                                            const [effMin, effMax] = computeEffectiveRange(minValue, maxValue, j + 1);
                                            csDiceRanges.push(`${effMin}-${effMax}`);
                                        } else {
                                            csDiceRanges.push(String(csRanges[j]));
                                        }
                                    } else {
                                        csDiceRanges.push('1-6');
                                    }
                                }
                                combatResults.push({
                                    pageId: csPage.id,
                                    pageName: csName,
                                    diceCount: csRequiredDice,
                                    diceResults: csDiceResults,
                                    diceCrits: csDiceCrits,
                                    diceRanges: csDiceRanges,
                                    message: `${csName}: Rolled ${csDiceResults.join(', ')}`
                                });
                                this.showNotification('Overthrow: Counter Slash triggered and resolved immediately.', 'success');
                            }
                        }
                    } catch (e) { /* non-fatal */ }
                }
            });

            // After rolling all dice: persist remaining Poise Count; if none left, clear Poise entirely
            if (this.encounterState) {
                if (remainingPoiseCountForCrit <= 0) {
                    this.encounterState.poiseCountThisScene = 0;
                } else {
                    this.encounterState.poiseCountThisScene = remainingPoiseCountForCrit;
                }
                if (typeof this.updateStatusEffectsDisplay === 'function') {
                    this.updateStatusEffectsDisplay();
                }
            }
            
            // After combat resolution, ensure Special pages return to hand (persist as single copies)
            const specialsUsedThisPhase = new Set();
            if (this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.size > 0) {
                this.encounterState.diceAssignments.forEach((assignment) => {
                    const usedPageId = assignment.pageId;
                    const usedPage = window.pageManager?.pages[usedPageId];
                    const isSpecial = usedPage && ((typeof usedPage.range === 'string' && usedPage.range.includes('Special')) || usedPage.range === 'Mass - Summation' || usedPage.range === 'Mass - Individual');
                    if (isSpecial) {
                        specialsUsedThisPhase.add(usedPageId);
                    }
                });
            }
            // Record Trigram usage at use-time 
            try {
                const trigramIdsSet = new Set([13, 14, 15, 16]);
                if (this.encounterState && this.encounterState.diceAssignments && this.encounterState.diceAssignments.size > 0) {
                    const trigramUsed = Array.from(this.encounterState.diceAssignments.values()).find(a => trigramIdsSet.has(a.pageId));
                    if (trigramUsed) {
                        if (!this.encounterState.trigramCycleUsed) this.encounterState.trigramCycleUsed = new Set();
                        if (this.encounterState.trigramCycleUsed instanceof Set) {
                            this.encounterState.trigramCycleUsed.add(trigramUsed.pageId);
                        }
                        this.encounterState.trigramUsedThisScene = true;
                    }
                }
            } catch (e) {
                // non-fatal
            }
            if (this.encounterState && specialsUsedThisPhase.size > 0) {
                specialsUsedThisPhase.forEach((pageId) => {
                    // Do not return used Trigrams to hand until the full cycle completes
                    const trigramIdsSet = new Set([13, 14, 15, 16]);
                    const isTrigram = trigramIdsSet.has(pageId);
                    let isLockedTrigram = false;
                    try {
                        const cycle = this.encounterState?.trigramCycleUsed;
                        if (isTrigram && cycle instanceof Set && cycle.has(pageId)) {
                            // If the cycle is not yet complete (less than 4 used), keep it out of the hand
                            isLockedTrigram = cycle.size < 4;
                        }
                    } catch (e) { /* non-fatal */ }
                    if (isLockedTrigram) return;
                    if (!this.encounterState.hand.includes(pageId)) {
                        this.encounterState.hand.push(pageId);
                    }
                });
                this.updateHandDisplay();
            }

            // Handle sequential unlock page effects
            this.processUnlockPageEffects();

            // Check for Bona Fide On Play roll result (it's removed from assignments on play, so check separately)
            if (this.encounterState && this.encounterState.bonaFideOnPlayRoll != null) {
                const rollResult = this.encounterState.bonaFideOnPlayRoll;
                const bonaFidePage = Object.values(window.pageManager?.pages || {}).find(p => p.name === 'Bona Fide');
                if (bonaFidePage) {
                    combatResults.push({
                        pageId: bonaFidePage.id,
                        pageName: 'Bona Fide',
                        diceCount: 1,
                        diceResults: [rollResult],
                        diceRanges: ['1-20'],
                        totalDamage: 0,
                        message: `Bona Fide: [On Play] Rolled ${rollResult} on 1d20`
                    });
                }
                // Clear the stored roll after adding to results
                delete this.encounterState.bonaFideOnPlayRoll;
            }

            // Store combat results for later access
            this.lastCombatResults = combatResults;
            
            // Display combat results
            this.displayCombatResults(combatResults);
            
            // Transform button to Result button
            this.transformToResultButton();

            // Track which pages were used in this combat phase for Scene End effects
            if (this.encounterState && this.encounterState.diceAssignments) {
                if (!this.encounterState.pagesUsedThisScene) {
                    this.encounterState.pagesUsedThisScene = new Set();
                }
                // Store page IDs that were used before clearing
                this.encounterState.diceAssignments.forEach((assignment) => {
                    if (assignment && assignment.pageId) {
                        this.encounterState.pagesUsedThisScene.add(assignment.pageId);
                    }
                });
            }
            
            // Clear dice assignments immediately after combat so no pages remain on dice
            if (this.encounterState) {
                if (this.encounterState.diceAssignments) {
                    this.encounterState.diceAssignments.clear();
                }
                if (this.encounterState.specialPagesAssigned) {
                    this.encounterState.specialPagesAssigned.clear();
                }
                // (Locked dice removed)
                if (this.encounterState.disabledDiceIndicesEncounter) {
                    this.encounterState.disabledDiceIndicesEncounter.clear();
                }
                    if (typeof this.handleZweiDefensiveStanceOnPlay === 'function') this.handleZweiDefensiveStanceOnPlay();
                // Keep lightRefundThisScene for this scene's display; it resets on next scene draw
            }

            // Handle Excise Target After Use effects
            try {
                if (this.encounterState && this.encounterState._exciseTargetUsedThisPhase === true) {
                    const stacks = Number(this.encounterState.modifiedAmpuleStacks) || 0;
                    if (stacks > 0) {
                        const prevPowerNext = Number(this.encounterState.powerUpNextScene) || 0;
                        this.encounterState.powerUpNextScene = Math.max(0, Math.min(10, prevPowerNext + stacks));
                        this.showNotification(`Excise Target: Will gain +${stacks} Power Up next scene.`, 'success');
                    }
                    // Consume all Modified K Corp Ampule stacks and disable further use this encounter
                    this.encounterState.modifiedAmpuleStacks = 0;
                    this.encounterState.modifiedAmpuleDisabled = true;
                    // Also clear any queued returns of the Ampule page this scene
                    if (Array.isArray(this.encounterState.pagesToReturnNextScene)) {
                        this.encounterState.pagesToReturnNextScene = this.encounterState.pagesToReturnNextScene.filter(pid => {
                            const p = window.pageManager?.pages?.[pid];
                            return !(p && p.name === 'Modified K Corp Ampule');
                        });
                    }
                    delete this.encounterState._exciseTargetUsedThisPhase;
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                }
            } catch (e) { /* non-fatal */ }

            // Reset dice visuals since assignments are cleared
            this.updateDiceVisualState([]);
            
            // Removed summary notification per request
            
            console.log('Combat phase results:', combatResults);
        }
        
        // Display combat results in a popup
        displayCombatResults(combatResults, customTitle = null) {
            // Preload dice data so we can show icons next to each die roll
            const allDiceData = (typeof getDiceData === 'function') ? getDiceData() : null;

            // Snapshot dice placement so we can label results by Speed Die instead of list index
            const placementEntries = [];
            try {
                const assignments = this.encounterState && this.encounterState.diceAssignments;
                if (assignments && typeof assignments.forEach === 'function') {
                    assignments.forEach((assignment, dieIndex) => {
                        if (assignment && typeof assignment.pageId !== 'undefined') {
                            placementEntries.push({
                                dieIndex: dieIndex,
                                pageId: assignment.pageId
                            });
                        }
                    });
                }
            } catch (e) { /* non-fatal */ }
            // Create or find the combat results popup
            let popup = document.getElementById('combatResultsPopup');
            if (!popup) {
                popup = document.createElement('div');
                popup.id = 'combatResultsPopup';
                popup.className = 'combat-results-popup';
                document.body.appendChild(popup);
            }
            
            // Use custom title if provided, otherwise default to "Combat Phase Results"
            const title = customTitle || 'Combat Phase Results';
            
            // Create popup content
            let popupContent = `
                <div class="combat-results-content">
                    <div class="popup-header">
                        <h3>${title}</h3>
                        <div class="header-actions">
                            <span class="close-popup" onclick="this.closest('.combat-results-popup').classList.remove('show')">&times;</span>
                        </div>
                    </div>
                    <div class="combat-results-body">
                        <div class="results-details">
                            <h4>Page Results</h4>
            `;
            
            // Add each page's results
            combatResults.forEach((result, index) => {
                // Try to find dice metadata for this page so we can render icons
                const pageDiceData = allDiceData && result.pageName && allDiceData[result.pageName]
                    ? allDiceData[result.pageName]
                    : null;

                // Resolve which Speed Die this page was placed on (if any)
                let speedDieLabel = '';
                try {
                    if (placementEntries.length > 0 && typeof result.pageId !== 'undefined') {
                        const placementIdx = placementEntries.findIndex(p => p.pageId === result.pageId);
                        if (placementIdx !== -1) {
                            const placement = placementEntries.splice(placementIdx, 1)[0];
                            // diceAssignments keys are 0-based; display as 1-based for users
                            const displayIndex = (typeof placement.dieIndex === 'number') ? (placement.dieIndex + 1) : placement.dieIndex;
                            speedDieLabel = `Speed Die ${displayIndex}`;
                        }
                    }
                } catch (e) { /* non-fatal */ }

                const headerText = speedDieLabel
                    ? `${speedDieLabel} - ${result.pageName}`
                    : `${index + 1}. ${result.pageName}`;

                popupContent += `
                    <div class="page-result">
                        <div class="page-result-header">
                            <span class="page-name">${headerText}</span>
                            <span class="page-dice-count">(${result.diceCount} dice)</span>
                        </div>
                        <div class="page-result-details">
                `;
                
                if (result.diceCount === 0) {
                    popupContent += `<span class="no-dice">${result.message}</span>`;
                } else {
                    popupContent += `
                        <div class="dice-rolls">
                            <span class="dice-label">Rolls:</span>
                            ${result.diceResults.map((roll, index) => {
                                const dieNumber = index + 1;
                                const range = result.diceRanges && result.diceRanges[index] ? result.diceRanges[index] : '1-6';
                                const isCrit = Array.isArray(result.diceCrits) && result.diceCrits[index] === true;
                                const cls = isCrit ? 'dice-roll crit' : 'dice-roll';

                                // Look up this die's type so we can show the same icon used on the page card
                                let iconHTML = '';
                                if (pageDiceData && typeof this.renderTypeIcon === 'function') {
                                    let dieMeta = pageDiceData.find(d => Number(d?.dice) === dieNumber);
                                    // Fallback: some entries may not have explicit dice numbers; use positional index
                                    if (!dieMeta && pageDiceData[dieNumber - 1]) {
                                        dieMeta = pageDiceData[dieNumber - 1];
                                    }
                                    if (dieMeta && dieMeta.type) {
                                        const typeStr = String(dieMeta.type);
                                        const typeLower = typeStr.toLowerCase();
                                        const isClashType = typeLower.includes('clash dice -');
                                        iconHTML = this.renderTypeIcon(typeStr, isClashType);
                                    }
                                }

                                // Add data attributes for page and die index to wire click handlers
                                return `<span class="${cls} dice-roll-clickable" data-page-name="${result.pageName}" data-die-index="${dieNumber}" title="Range: ${range} (Click to apply [On Hit] if available)">${iconHTML}<span class="dice-roll-value">${roll}</span></span>`;
                            }).join(' ')}
                        </div>
                        <div class="dice-ranges">
                            <span class="range-label">Ranges:</span>
                            ${result.diceRanges ? result.diceRanges.map(range => `<span class="dice-range">${range}</span>`).join(' ') : '1-6'}
                        </div>
                        
                    `;
                }
                
                popupContent += `
                        </div>
                    </div>
                `;
            });
            
            popupContent += `
                        </div>
                    </div>
                    <div class="popup-actions">
                        <button class="copy-results-btn" onclick="window.characterManager.copyCombatResults()" title="Copy all dice rolls to clipboard">
                            <span class="copy-icon">📋</span> Copy
                        </button>
                    </div>
                </div>
            `;
            
            // Set popup content and show it
            popup.innerHTML = popupContent;
            popup.classList.add('show');
            
            // Add click outside to close functionality
            popup.addEventListener('click', (event) => {
                if (event.target === popup) {
                    popup.classList.remove('show');
                }
            });
            
            // Add escape key to close functionality
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && popup.classList.contains('show')) {
                    popup.classList.remove('show');
                }
            });

            // Wire click handlers for on-hit effects on dice rolls
            try {
                const clickableDice = popup.querySelectorAll('.dice-roll-clickable');
                clickableDice.forEach((el) => {
                    el.addEventListener('click', (e) => {
                        const pageName = e.currentTarget.getAttribute('data-page-name');
                        const dieIndexStr = e.currentTarget.getAttribute('data-die-index');
                        const dieIndex = parseInt(dieIndexStr, 10) || 0;
                        if (!pageName || dieIndex <= 0) return;
                        if (typeof this.applyOnHitEffect === 'function') {
                            this.applyOnHitEffect(pageName, dieIndex);
                        }
                    });
                });
            } catch (e) { /* non-fatal */ }
            
            // Wire click handlers for on-clash-lose effects on dice rolls
            try {
                const clickableClashLoseDice = popup.querySelectorAll('.dice-roll-clash-lose-clickable');
                clickableClashLoseDice.forEach((el) => {
                    el.addEventListener('click', (e) => {
                        const pageName = e.currentTarget.getAttribute('data-page-name');
                        const dieIndexStr = e.currentTarget.getAttribute('data-die-index');
                        const dieIndex = parseInt(dieIndexStr, 10) || 0;
                        if (!pageName || dieIndex <= 0) return;
                        if (typeof this.applyOnClashLoseEffect === 'function') {
                            this.applyOnClashLoseEffect(pageName, dieIndex);
                        }
                    });
                });
            } catch (e) { /* non-fatal */ }
        }
        
        // Append a new combat result to the existing popup without reloading
        appendCombatResult(newResult) {
            const popup = document.getElementById('combatResultsPopup');
            if (!popup || !popup.classList.contains('show')) {
                // Popup not open, use full display instead
                if (typeof this.displayCombatResults === 'function') {
                    this.displayCombatResults();
                }
                return;
            }
            
            // Find the results-details container
            const resultsDetails = popup.querySelector('.results-details');
            if (!resultsDetails) {
                // Fallback: refresh if structure not found
                if (typeof this.displayCombatResults === 'function') {
                    this.displayCombatResults();
                }
                return;
            }

            // Preload dice data for this page so appended results match the main popup styling
            const allDiceData = (typeof getDiceData === 'function') ? getDiceData() : null;
            const pageDiceData = allDiceData && newResult.pageName && allDiceData[newResult.pageName]
                ? allDiceData[newResult.pageName]
                : null;
            
            // Get current result count for numbering
            const existingResults = resultsDetails.querySelectorAll('.page-result');
            const resultIndex = existingResults.length + 1;
            
            // Build the HTML for the new result
            let resultHTML = `
                <div class="page-result">
                    <div class="page-result-header">
                        <span class="page-name">${resultIndex}. ${newResult.pageName}</span>
                        <span class="page-dice-count">(${newResult.diceCount} dice)</span>
                    </div>
                    <div class="page-result-details">
            `;
            
            if (newResult.diceCount === 0) {
                resultHTML += `<span class="no-dice">${newResult.message}</span>`;
            } else {
                resultHTML += `
                    <div class="dice-rolls">
                        <span class="dice-label">Rolls:</span>
                        ${newResult.diceResults.map((roll, index) => {
                            const dieNumber = index + 1;
                            const range = newResult.diceRanges && newResult.diceRanges[index] ? newResult.diceRanges[index] : '1-6';
                            const isCrit = Array.isArray(newResult.diceCrits) && newResult.diceCrits[index] === true;
                            const cls = isCrit ? 'dice-roll crit' : 'dice-roll';

                            // Look up die metadata for icon rendering
                            let iconHTML = '';
                            if (pageDiceData && typeof this.renderTypeIcon === 'function') {
                                let dieMeta = pageDiceData.find(d => Number(d?.dice) === dieNumber);
                                if (!dieMeta && pageDiceData[dieNumber - 1]) {
                                    dieMeta = pageDiceData[dieNumber - 1];
                                }
                                if (dieMeta && dieMeta.type) {
                                    const typeStr = String(dieMeta.type);
                                    const typeLower = typeStr.toLowerCase();
                                    const isClashType = typeLower.includes('clash dice -');
                                    iconHTML = this.renderTypeIcon(typeStr, isClashType);
                                }
                            }

                            return `<span class="${cls} dice-roll-clickable" data-page-name="${newResult.pageName}" data-die-index="${dieNumber}" title="Range: ${range} (Click to apply [On Hit] if available)">${iconHTML}<span class="dice-roll-value">${roll}</span></span>`;
                        }).join(' ')}
                    </div>
                    <div class="dice-ranges">
                        <span class="range-label">Ranges:</span>
                        ${newResult.diceRanges ? newResult.diceRanges.map(range => `<span class="dice-range">${range}</span>`).join(' ') : '1-6'}
                    </div>
                `;
            }
            
            resultHTML += `
                    </div>
                </div>
            `;
            
            // Append to results container
            resultsDetails.insertAdjacentHTML('beforeend', resultHTML);
            
            // Wire up click handlers for the new dice
            const newClickableDice = resultsDetails.querySelectorAll('.page-result:last-child .dice-roll-clickable');
            newClickableDice.forEach((el) => {
                el.addEventListener('click', (e) => {
                    const pageName = e.currentTarget.getAttribute('data-page-name');
                    const dieIndexStr = e.currentTarget.getAttribute('data-die-index');
                    const dieIndex = parseInt(dieIndexStr, 10) || 0;
                    if (!pageName || dieIndex <= 0) return;
                    if (typeof this.applyOnHitEffect === 'function') {
                        this.applyOnHitEffect(pageName, dieIndex);
                    }
                });
            });
        }
        
        // Copy combat results to clipboard
        copyCombatResults() {
            if (!this.lastCombatResults || this.lastCombatResults.length === 0) {
                this.showNotification('No combat results available to copy!', 'warning');
                return;
            }
            
            let copyText = 'Combat Results:\n\n';
            
            this.lastCombatResults.forEach((result, index) => {
                copyText += `${index + 1}. ${result.pageName} (${result.diceCount} dice)\n`;
                
                if (result.diceCount === 0) {
                    copyText += `   ${result.message}\n`;
                } else {
                    copyText += `   Rolls: ${result.diceResults.join(', ')}\n`;
                    if (result.diceRanges && result.diceRanges.length > 0) {
                        copyText += `   Ranges: ${result.diceRanges.join(', ')}\n`;
                    }
                }
                copyText += '\n';
            });
            
            // Copy to clipboard
            navigator.clipboard.writeText(copyText).then(() => {
                this.showNotification('Combat results copied to clipboard!', 'success');
            }).catch(err => {
                console.error('Failed to copy to clipboard:', err);
                this.showNotification('Failed to copy to clipboard', 'error');
            });
        }
        
        // Handle combat phase button click - either start combat or show results
        handleCombatPhaseButton() {
            const button = document.getElementById('combatPhaseBtn');
            if (button.textContent === 'START COMBAT PHASE') {
                this.startCombatPhase();
            } else if (button.textContent === 'RESULT') {
                this.showLastCombatResults();
            }
        }
        
        // Transform combat phase button to Result button
        transformToResultButton() {
            const button = document.getElementById('combatPhaseBtn');
            if (button) {
                button.textContent = 'RESULT';
                button.classList.add('result-btn');
                button.classList.remove('combat-phase-btn');
            }
        }
        
        // Transform Result button back to combat phase button
        transformToCombatPhaseButton() {
            const button = document.getElementById('combatPhaseBtn');
            if (button) {
                button.textContent = 'START COMBAT PHASE';
                button.classList.add('combat-phase-btn');
                button.classList.remove('result-btn');
            }
        }
        
        
        // Display stored combat results when Result button is clicked
        showLastCombatResults() {
            if (!this.lastCombatResults || this.lastCombatResults.length === 0) {
                this.showNotification('No combat results available. Start a combat phase first!', 'warning');
                return;
            }
            
            this.displayCombatResults(this.lastCombatResults);
        }

        // Manually add light up to Max Light during an active encounter
        addLightManually(amount = 1) {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            
            // Ensure encounterState is initialized
            if (!this.encounterState) this.encounterState = {};
            
            // Get max light from DOM or encounterState
            const maxLightElement = document.getElementById('maxLightValue');
            const maxLightText = maxLightElement ? (maxLightElement.textContent ?? '').trim() : '';
            const parsedMax = parseInt(maxLightText) || this.encounterState.currentLightMax;
            
            if (Number.isNaN(parsedMax) || parsedMax <= 0) {
                this.showNotification('Unable to determine max light. Please start an encounter first.', 'warning');
                return; 
            }
            
            // Update current light calculation first to get accurate baseline
            if (typeof this.updateCurrentLight === 'function') {
                this.updateCurrentLight();
            }
            
            // Get current remaining from encounterState (set by updateCurrentLight)
            const currentRemaining = (typeof this.encounterState.currentLightRemaining === 'number')
                ? this.encounterState.currentLightRemaining
                : parsedMax;
            
            // Calculate new remaining (add amount, but cap at max)
            const addAmount = Math.max(1, amount);
            const newRemaining = Math.max(0, Math.min(parsedMax, currentRemaining + addAmount));
            
            // Track the manual light addition via lightRefundThisScene
            // This ensures it persists through scene transitions and is included in calculations
            const existingRefund = (typeof this.encounterState.lightRefundThisScene === 'number')
                ? this.encounterState.lightRefundThisScene
                : 0;
            const additionalRefund = newRemaining - currentRemaining;
            this.encounterState.lightRefundThisScene = existingRefund + additionalRefund;
            
            // Update the display
            if (typeof this.updateCurrentLight === 'function') {
                this.updateCurrentLight();
            }
            
            this.showNotification(`Light increased by ${additionalRefund}. Current: ${newRemaining}/${parsedMax}`, 'info');
        }

        // Draw exactly one non-special page now (respects max hand and single-use)
        drawOnePageNow() {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            this.drawImmediateCards(1);
        }

        // Discard a random page from hand (returns to pool; not for special pages assigned)
        discardRandomPageFromHand() {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            // Ensure hand arrays exist
            if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
            if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
            const hand = [...(this.encounterState.handNormal || []), ...(this.encounterState.handSpecial || [])];
            if (hand.length === 0) {
                this.showNotification('Hand is empty. Nothing to discard.', 'info');
                return;
            }
            // Build list of eligible indices to discard (exclude Single-Use, Mass types, and Special)
            const eligibleIndices = [];
            for (let i = 0; i < hand.length; i++) {
                const pageId = hand[i];
                const page = window.pageManager?.pages?.[pageId];
                if (page && typeof page.range === 'string') {
                    const isSingleUse = page.range.includes('Single Use');
                    const isMassSummation = page.range === 'Mass - Summation';
                    const isMassIndividual = page.range === 'Mass - Individual';
                    const isSpecial = page.range === 'Special';
                    if (isSingleUse || isMassSummation || isMassIndividual || isSpecial) continue;
                }
                eligibleIndices.push(i);
            }
            if (eligibleIndices.length === 0) {
                this.showNotification('No eligible pages to discard.', 'info');
                return;
            }
            const randomPick = eligibleIndices[Math.floor(Math.random() * eligibleIndices.length)];
            const discardedPageId = hand[randomPick];
            
            // Determine which array contains this page and remove it
            const page = window.pageManager?.pages?.[discardedPageId];
            const isSpecial = page && typeof page.range === 'string' && 
                (page.range === 'Special' || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
            
            if (isSpecial) {
                const specialIndex = this.encounterState.handSpecial.indexOf(discardedPageId);
                if (specialIndex !== -1) {
                    this.encounterState.handSpecial.splice(specialIndex, 1);
                }
            } else {
                const normalIndex = this.encounterState.handNormal.indexOf(discardedPageId);
                if (normalIndex !== -1) {
                    this.encounterState.handNormal.splice(normalIndex, 1);
                }
            }
            
            // Reconstruct combined hand
            this.encounterState.hand = [...(this.encounterState.handNormal || []), ...(this.encounterState.handSpecial || [])];
            this.updateHandDisplay();
            const pageName = window.pageManager?.pages?.[discardedPageId]?.name ?? 'a page';
            this.showNotification(`Discarded ${pageName}.`, 'info');
        }

        // Discard all eligible pages from hand (keeps Single-Use, Mass types, and Special)
        // Shows a modal to let user choose which page to keep
        discardAllPagesFromHand() {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            // Ensure hand arrays exist
            if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
            if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
            const hand = [...(this.encounterState.handNormal || []), ...(this.encounterState.handSpecial || [])];
            if (hand.length === 0) {
                this.showNotification('Hand is empty. Nothing to discard.', 'info');
                return;
            }
            const toKeep = [];
            const toDiscard = [];
            for (let i = 0; i < hand.length; i++) {
                const pageId = hand[i];
                const page = window.pageManager?.pages?.[pageId];
                let discardable = true;
                if (page && typeof page.range === 'string') {
                    const isSingleUse = page.range.includes('Single Use');
                    const isMassSummation = page.range === 'Mass - Summation';
                    const isMassIndividual = page.range === 'Mass - Individual';
                    const isSpecial = page.range === 'Special';
                    if (isSingleUse || isMassSummation || isMassIndividual || isSpecial) discardable = false;
                }
                if (discardable) toDiscard.push(pageId); else toKeep.push(pageId);
            }
            if (toDiscard.length === 0) {
                this.showNotification('No eligible pages to discard.', 'info');
                return;
            }
            
            // If only one page to discard, just discard it
            if (toDiscard.length === 1) {
                const pageId = toDiscard[0];
                const page = window.pageManager?.pages?.[pageId];
                const isSpecial = page && typeof page.range === 'string' && 
                    (page.range === 'Special' || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                
                if (isSpecial) {
                    const specialIndex = this.encounterState.handSpecial.indexOf(pageId);
                    if (specialIndex !== -1) {
                        this.encounterState.handSpecial.splice(specialIndex, 1);
                    }
                } else {
                    const normalIndex = this.encounterState.handNormal.indexOf(pageId);
                    if (normalIndex !== -1) {
                        this.encounterState.handNormal.splice(normalIndex, 1);
                    }
                }
                
                // Reconstruct combined hand
                this.encounterState.hand = [...(this.encounterState.handNormal || []), ...(this.encounterState.handSpecial || [])];
                this.updateHandDisplay();
                const pageName = window.pageManager?.pages?.[pageId]?.name ?? 'a page';
                this.showNotification(`Discarded ${pageName}.`, 'info');
                return;
            }
            
            // Show modal to choose which page to keep
            this.showDiscardAllModal(toKeep, toDiscard);
        }

        // Discard a specific page manually selected by the user
        discardPageManually() {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            const hand = this.encounterState.hand;
            if (!Array.isArray(hand) || hand.length === 0) {
                this.showNotification('Hand is empty. Nothing to discard.', 'info');
                return;
            }
            
            // Show modal to choose which page to discard
            this.showManualDiscardModal(hand);
        }

        // Show modal for manually selecting which page to discard
        showManualDiscardModal(handPages) {
            const modal = document.createElement('div');
            modal.className = 'add-page-modal';
            
            modal.innerHTML = `
                <div class="add-page-modal-content">
                    <div class="popup-header">
                        <h3>Discard Page</h3>
                        <span class="close-popup">&times;</span>
                    </div>
                    <div class="add-page-modal-body">
                        <div class="page-info">
                            <h4>Select Page to Discard</h4>
                            <p>Choose a page from your hand to discard</p>
                        </div>
                        <div class="search-section">
                            <h4>Search Pages:</h4>
                            <input type="text" id="discardPageSearchInput" class="search-input" placeholder="Search by name, category, or keywords...">
                        </div>
                        <div class="page-selection">
                            <h4>Pages in Hand:</h4>
                            <div id="discardPageList" class="page-list">
                                <!-- Pages will be populated here -->
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <button class="confirm-add-page-btn">Discard Selected Page</button>
                        <button class="cancel-add-page-btn">Cancel</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            
            // Populate page list with hand pages
            this.populateDiscardPageList(handPages, modal);
            
            // Add search functionality
            const searchInput = modal.querySelector('#discardPageSearchInput');
            searchInput.addEventListener('input', (e) => {
                this.filterDiscardPageList(e.target.value, handPages, modal);
            });
            
            const cleanup = () => { try { document.body.removeChild(modal); } catch (_) {} };
            
            // Event listeners
            modal.querySelector('.close-popup')?.addEventListener('click', cleanup);
            modal.querySelector('.cancel-add-page-btn')?.addEventListener('click', cleanup);
            modal.querySelector('.confirm-add-page-btn')?.addEventListener('click', () => {
                const selectedPage = modal.querySelector('.page-item.selected');
                if (selectedPage) {
                    const pageId = parseInt(selectedPage.getAttribute('data-page-id'));
                    this.confirmManualDiscardPage(pageId);
                    cleanup();
                } else {
                    this.showNotification('Please select a page first.', 'warning');
                }
            });
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                }
            });
        }

        // Populate the discard page list in the modal
        populateDiscardPageList(handPages, modal) {
            const pageList = modal.querySelector('#discardPageList');
            
            pageList.innerHTML = handPages.map(pageId => {
                const page = window.pageManager?.pages?.[pageId];
                if (!page) return '';
                
                const pageName = page?.name ?? 'Unknown';
                const pageCategory = page?.category ?? 'Unknown';
                const pageRange = page?.range ?? 'Unknown';
                const pageKeywords = page?.keywords ?? 'None';
                const pageDice = page?.dice ?? '0';
                
                return `
                    <div class="page-item" data-page-id="${pageId}">
                        <div class="page-item-header">
                            <span class="page-name">${pageName}</span>
                            <span class="page-dice-count">${pageDice} dice</span>
                        </div>
                        <div class="page-item-details">
                            <span class="page-category">${pageCategory}</span>
                            <span class="page-range">Range: ${pageRange}</span>
                            <span class="page-keywords">Keywords: ${pageKeywords}</span>
							<span class="page-light">Light Usage: ${typeof page?.lightUsage !== 'undefined' ? page.lightUsage : '-'}</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add click handlers to page items
            pageList.querySelectorAll('.page-item').forEach(item => {
                item.addEventListener('click', () => {
                    // Remove previous selection
                    pageList.querySelectorAll('.page-item').forEach(i => i.classList.remove('selected'));
                    // Add selection to clicked item
                    item.classList.add('selected');
                });
            });
        }

        // Filter discard page list based on search input
        filterDiscardPageList(searchTerm, handPages, modal) {
            const pageList = modal.querySelector('#discardPageList');
            const pageItems = pageList.querySelectorAll('.page-item');
            const searchLower = searchTerm.toLowerCase();
            
            pageItems.forEach(item => {
                const pageId = item.getAttribute('data-page-id');
                const page = window.pageManager?.pages?.[pageId];
                if (!page) return;
                
                const pageName = (page?.name ?? '').toLowerCase();
                const pageCategory = (page?.category ?? '').toLowerCase();
                const pageKeywords = (page?.keywords ?? '').toLowerCase();
                const pageRange = (page?.range ?? '').toLowerCase();
                
                const matches = pageName.includes(searchLower) || 
                              pageCategory.includes(searchLower) || 
                              pageKeywords.includes(searchLower) || 
                              pageRange.includes(searchLower);
                
                item.style.display = matches ? 'block' : 'none';
            });
        }

        // Confirm discarding selected page from hand
        confirmManualDiscardPage(pageId) {
            if (!this.encounterState || Number.isNaN(pageId)) return;
            
            // Ensure hand arrays exist
            if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
            if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
            
            // Determine which array contains this page and remove it
            const page = window.pageManager?.pages?.[pageId];
            const isSpecial = page && typeof page.range === 'string' && 
                (page.range === 'Special' || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
            
            let removed = false;
            if (isSpecial) {
                const specialIndex = this.encounterState.handSpecial.indexOf(pageId);
                if (specialIndex !== -1) {
                    this.encounterState.handSpecial.splice(specialIndex, 1);
                    removed = true;
                }
            } else {
                const normalIndex = this.encounterState.handNormal.indexOf(pageId);
                if (normalIndex !== -1) {
                    this.encounterState.handNormal.splice(normalIndex, 1);
                    removed = true;
                }
            }
            
            if (removed) {
                // Reconstruct combined hand
                this.encounterState.hand = [...(this.encounterState.handNormal || []), ...(this.encounterState.handSpecial || [])];
                this.updateHandDisplay();
                
                const pageName = window.pageManager?.pages?.[pageId]?.name ?? 'a page';
                this.showNotification(`Discarded ${pageName}.`, 'info');
            }
        }
        
        // Show modal for choosing which page to keep when discarding all
        showDiscardAllModal(protectedPages, discardablePages) {
            const modal = document.createElement('div');
            modal.className = 'character-modal discard-all-modal';
            
            // Create options for discardable pages
            const options = discardablePages.map(pageId => {
                const page = window.pageManager?.pages?.[pageId];
                const pageName = page?.name ?? 'Unknown Page';
                const pageRange = page?.range ? ` [${page.range}]` : '';
                return `<option value="${pageId}">${pageName}${pageRange}</option>`;
            }).join('');
            
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>🗑️ Discard All Pages</h3>
                    <p>Choose which page to keep from the discardable pages. All other discardable pages will be removed from your hand.</p>
                    <div class="input-group">
                        <label for="keepPageSelect">📋 Page to Keep:</label>
                        <select id="keepPageSelect" class="stat-input">${options}</select>
                    </div>
                    <div class="modal-buttons">
                        <button class="modal-btn confirm-btn">🗑️ Discard All (Keep Selected)</button>
                        <button class="modal-btn cancel-btn">❌ Cancel</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const cleanup = () => { 
                try { 
                    document.body.removeChild(modal); 
                } catch (_) {} 
            };
            
            modal.querySelector('.cancel-btn')?.addEventListener('click', cleanup);
            modal.querySelector('.confirm-btn')?.addEventListener('click', () => {
                const select = modal.querySelector('#keepPageSelect');
                const keepPageId = select ? parseInt(select.value) : null;
                
                if (keepPageId && !isNaN(keepPageId)) {
                    // Ensure hand arrays exist
                    if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
                    if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
                    
                    // Remove all discardable pages except the one to keep
                    const pagesToRemove = discardablePages.filter(pid => pid !== keepPageId);
                    
                    // Remove pages from appropriate arrays
                    pagesToRemove.forEach(pageId => {
                        const page = window.pageManager?.pages?.[pageId];
                        const isSpecial = page && typeof page.range === 'string' && 
                            (page.range === 'Special' || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
                        
                        if (isSpecial) {
                            const specialIndex = this.encounterState.handSpecial.indexOf(pageId);
                            if (specialIndex !== -1) {
                                this.encounterState.handSpecial.splice(specialIndex, 1);
                            }
                        } else {
                            const normalIndex = this.encounterState.handNormal.indexOf(pageId);
                            if (normalIndex !== -1) {
                                this.encounterState.handNormal.splice(normalIndex, 1);
                            }
                        }
                    });
                    
                    // Reconstruct combined hand from protected pages and kept page
                    // Protected pages should already be in the correct arrays, just need to ensure kept page is there
                    const keptPage = window.pageManager?.pages?.[keepPageId];
                    const keptIsSpecial = keptPage && typeof keptPage.range === 'string' && 
                        (keptPage.range === 'Special' || keptPage.range === 'Mass - Summation' || keptPage.range === 'Mass - Individual');
                    
                    // Ensure kept page is in the correct array (it should already be, but verify)
                    if (keptIsSpecial) {
                        if (!this.encounterState.handSpecial.includes(keepPageId)) {
                            this.encounterState.handSpecial.push(keepPageId);
                        }
                    } else {
                        if (!this.encounterState.handNormal.includes(keepPageId)) {
                            this.encounterState.handNormal.push(keepPageId);
                        }
                    }
                    
                    // Reconstruct combined hand
                    this.encounterState.hand = [...(this.encounterState.handNormal || []), ...(this.encounterState.handSpecial || [])];
                    this.updateHandDisplay();
                    
                    const discardedCount = discardablePages.length - 1; // -1 because we kept one
                    const keptPageName = window.pageManager?.pages?.[keepPageId]?.name ?? 'a page';
                    this.showNotification(`Discarded ${discardedCount} page(s). Kept ${keptPageName}.`, 'info');
                }
                
                cleanup();
            });
        }

        // Open modal to manually add any page to hand
        openManualAddPageModal() {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            // Ensure hand arrays exist
            if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
            if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
            const maxHand = this.encounterState.maxHand;
            const currentHandSize = (this.encounterState.handNormal?.length || 0) + (this.encounterState.handSpecial?.length || 0);
            if (currentHandSize >= maxHand) {
                this.showNotification('Hand is full! Cannot add more pages.', 'info');
                return;
            }
            const allPages = window.pageManager?.pages || {};
            const modal = document.createElement('div');
            modal.className = 'add-page-modal';
            modal.innerHTML = `
                <div class="add-page-modal-content">
                    <div class="popup-header">
                        <h3>Add Page</h3>
                        <span class="close-popup">&times;</span>
                    </div>
                    <div class="add-page-modal-body">
                        <div class="page-info">
                            <h4>Select Page to Add</h4>
                            <p>Choose a page from the list below to add to your hand</p>
                        </div>
                        <div class="search-section">
                            <h4>Search Pages:</h4>
                            <input type="text" id="pageSearchInput" class="search-input" placeholder="Search by name, category, or keywords...">
                        </div>
                        <div class="page-selection">
                            <h4>Available Pages:</h4>
                            <div id="pageList" class="page-list">
                                <!-- Pages will be populated here -->
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <button class="confirm-add-page-btn">Add Selected Page</button>
                        <button class="cancel-add-page-btn">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Populate page list
            this.populatePageList(allPages, modal);
            
            // Add search functionality
            const searchInput = modal.querySelector('#pageSearchInput');
            searchInput.addEventListener('input', (e) => {
                this.filterPageList(e.target.value, allPages, modal);
            });
            
            const cleanup = () => { try { document.body.removeChild(modal); } catch (_) {} };
            
            // Event listeners
            modal.querySelector('.close-popup')?.addEventListener('click', cleanup);
            modal.querySelector('.cancel-add-page-btn')?.addEventListener('click', cleanup);
            modal.querySelector('.confirm-add-page-btn')?.addEventListener('click', () => {
                const selectedPage = modal.querySelector('.page-item.selected');
                if (selectedPage) {
                    const pageId = parseInt(selectedPage.getAttribute('data-page-id'));
                    this.confirmManualAddPage(pageId);
                    cleanup();
                } else {
                    this.showNotification('Please select a page first.', 'warning');
                }
            });
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                }
            });
        }
        
        // Populate the page list in the modal
        populatePageList(allPages, modal) {
            const pageList = modal.querySelector('#pageList');
            const pageEntries = Object.entries(allPages);
            
            pageList.innerHTML = pageEntries.map(([id, page]) => {
                const pageName = page?.name ?? 'Unknown';
                const pageCategory = page?.category ?? 'Unknown';
                const pageRange = page?.range ?? 'Unknown';
                const pageKeywords = page?.keywords ?? 'None';
                const pageDice = page?.dice ?? '0';
                
                return `
                    <div class="page-item" data-page-id="${id}">
                        <div class="page-item-header">
                            <span class="page-name">${pageName}</span>
                            <span class="page-dice-count">${pageDice} dice</span>
                        </div>
                        <div class="page-item-details">
                            <span class="page-category">${pageCategory}</span>
                            <span class="page-range">Range: ${pageRange}</span>
                            <span class="page-keywords">Keywords: ${pageKeywords}</span>
							<span class="page-light">Light Usage: ${typeof page?.lightUsage !== 'undefined' ? page.lightUsage : '-'}</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add click handlers to page items
            pageList.querySelectorAll('.page-item').forEach(item => {
                item.addEventListener('click', () => {
                    // Remove previous selection
                    pageList.querySelectorAll('.page-item').forEach(i => i.classList.remove('selected'));
                    // Add selection to clicked item
                    item.classList.add('selected');
                });
            });
        }
        
        // Filter page list based on search input
        filterPageList(searchTerm, allPages, modal) {
            const pageList = modal.querySelector('#pageList');
            const pageItems = pageList.querySelectorAll('.page-item');
            const searchLower = searchTerm.toLowerCase();
            
            pageItems.forEach(item => {
                const pageId = item.getAttribute('data-page-id');
                const page = allPages[pageId];
                if (!page) return;
                
                const pageName = (page?.name ?? '').toLowerCase();
                const pageCategory = (page?.category ?? '').toLowerCase();
                const pageKeywords = (page?.keywords ?? '').toLowerCase();
                const pageRange = (page?.range ?? '').toLowerCase();
                
                const matches = pageName.includes(searchLower) || 
                              pageCategory.includes(searchLower) || 
                              pageKeywords.includes(searchLower) || 
                              pageRange.includes(searchLower);
                
                item.style.display = matches ? 'block' : 'none';
            });
        }

        // Confirm adding selected page into the hand (respects max hand and single-use uniqueness in-hand)
        confirmManualAddPage(pageId) {
            if (!this.encounterState || Number.isNaN(pageId)) return;
            
            // Ensure hand arrays exist
            if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
            if (!Array.isArray(this.encounterState.handSpecial)) this.encounterState.handSpecial = [];
            
            const maxHand = this.encounterState.maxHand;
            const currentHandSize = (this.encounterState.handNormal?.length || 0) + (this.encounterState.handSpecial?.length || 0);
            if (currentHandSize >= maxHand) {
                this.showNotification('Hand is full! Cannot add more pages.', 'info');
                return;
            }
            
            const page = window.pageManager?.pages?.[pageId];
            if (!page) {
                this.showNotification('Invalid page selected.', 'error');
                return;
            }
            
            // Determine if page is Special
            const isSpecial = page && typeof page.range === 'string' && 
                (page.range === 'Special' || page.range === 'Mass - Summation' || page.range === 'Mass - Individual');
            
            // If Single Use, ensure we don't already have it in hand or used this encounter
            const isSingleUse = !!(page.range && page.range.includes('Single Use'));
            if (isSingleUse) {
                if (this.encounterState.singleUsePagesUsed && this.encounterState.singleUsePagesUsed.has(pageId)) {
                    this.showNotification('This Single Use page has already been used this encounter.', 'warning');
                    return;
                }
                // Check in the appropriate array
                const checkArray = isSpecial ? this.encounterState.handSpecial : this.encounterState.handNormal;
                if (checkArray && checkArray.includes(pageId)) {
                    this.showNotification('Single Use page already in hand.', 'info');
                    return;
                }
            }
            
            // Add page to the appropriate array
            if (isSpecial) {
                this.encounterState.handSpecial.push(pageId);
            } else {
                this.encounterState.handNormal.push(pageId);
            }
            
            // Reconstruct combined hand
            this.encounterState.hand = [...(this.encounterState.handNormal || []), ...(this.encounterState.handSpecial || [])];
            this.updateHandDisplay();
            this.showNotification(`Added "${page.name}" to hand.`, 'success');
        }

        // Open modal to manually add status effects (debug function)
        openStatusEffectDebugModal() {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            
            // Define all status effects with their properties
            const statusEffects = [
                { id: 'powerUp', name: 'Power Up', type: 'simple', max: 10, default: 1 },
                { id: 'attackPowerUp', name: 'Attack Power Up', type: 'simple', max: 10, default: 1 },
                { id: 'defensePowerUp', name: 'Defense Power Up', type: 'simple', max: 10, default: 1 },
                { id: 'slashDmgUp', name: 'Slash Damage Up', type: 'simple', max: 10, default: 1 },
                { id: 'pierceDmgUp', name: 'Pierce DMG Up', type: 'simple', max: 10, default: 1 },
                { id: 'bluntDmgUp', name: 'Blunt DMG Up', type: 'simple', max: 10, default: 1 },
                { id: 'protection', name: 'Protection', type: 'simple', max: 10, default: 1 },
                { id: 'taunt', name: 'Taunt', type: 'simple', max: 10, default: 1 },
                { id: 'bind', name: 'Bind', type: 'simple', max: 10, default: 1 },
                { id: 'haste', name: 'Haste', type: 'simple', max: 10, default: 1 },
                { id: 'poise', name: 'Poise', type: 'potencyCount', max: 99, default: 1 },
                { id: 'burn', name: 'Burn', type: 'potencyCount', max: 99, default: 1 },
                { id: 'declaredDuel', name: 'Declared Duel', type: 'boolean' },
                { id: 'bravery', name: 'Bravery', type: 'boolean' },
                { id: 'tremor', name: 'Tremor', type: 'simple', max: 999999, default: 1 },
                { id: 'tremorExecution', name: 'Tremor - Execution', type: 'simple', max: 999, default: 1 },
                { id: 'bleed', name: 'Bleed', type: 'potencyCount', max: 99, default: 1 },
                { id: 'rupture', name: 'Rupture', type: 'potencyCount', max: 99, default: 1 },
                { id: 'focusedAttack', name: 'Focused Attack', type: 'simple', max: 10, default: 1 },
                { id: 'sinking', name: 'Sinking', type: 'potencyCount', max: 99, default: 1 },
                { id: 'charge', name: 'Charge', type: 'simple', max: 99, default: 1 },
                { id: 'modifiedAmpule', name: 'Modified K Corp Ampule', type: 'simple', max: 99, default: 1 },
                { id: 'jackpot', name: 'Jackpot', type: 'simple', max: 99, default: 1 },
                { id: 'calmLevel', name: 'Calm Level', type: 'special' }
            ];
            
            const modal = document.createElement('div');
            modal.className = 'add-page-modal';
            modal.innerHTML = `
                <div class="add-page-modal-content">
                    <div class="popup-header">
                        <h3>Add Status Effects (Debug)</h3>
                        <span class="close-popup">&times;</span>
                    </div>
                    <div class="add-page-modal-body">
                        <div class="search-section">
                            <h4>Search Status Effects:</h4>
                            <input type="text" id="statusEffectSearchInput" class="search-input" placeholder="Search by name, category, or keywords...">
                        </div>
                        <div class="page-selection">
                            <h4>Available Status Effects:</h4>
                            <div id="statusEffectList" class="page-list">
                                <!-- Status effects will be populated here -->
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <button class="confirm-add-status-btn">Add Status Effects</button>
                        <button class="cancel-add-status-btn">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.classList.add('show');
            
            // Populate status effect list
            this.populateStatusEffectList(statusEffects, modal);
            
            // Add search functionality
            const searchInput = modal.querySelector('#statusEffectSearchInput');
            searchInput.addEventListener('input', (e) => {
                this.filterStatusEffectList(e.target.value, statusEffects, modal);
            });
            
            // Add event listeners
            const closeBtn = modal.querySelector('.close-popup');
            const cancelBtn = modal.querySelector('.cancel-add-status-btn');
            const confirmBtn = modal.querySelector('.confirm-add-status-btn');

            const cleanup = () => {
                document.body.removeChild(modal);
            };

            closeBtn.addEventListener('click', cleanup);
            cancelBtn.addEventListener('click', cleanup);
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                }
            });

            confirmBtn.addEventListener('click', () => {
                this.confirmAddStatusEffects(modal, statusEffects);
                cleanup();
            });
        }
        
        // Get icon class name for status effect
        getStatusEffectIconClass(effectId) {
            const iconMap = {
                'powerUp': 'effect-powerup',
                'attackPowerUp': 'effect-attackpowerup',
                'defensePowerUp': 'effect-defensepowerup',
                'slashDmgUp': 'effect-slashdmgup',
                'pierceDmgUp': 'effect-piercedmgup',
                'bluntDmgUp': 'effect-bluntdmgup',
                'protection': 'effect-protection',
                'taunt': 'effect-taunt',
                'bind': 'effect-bind',
                'bindDebuff': 'effect-bind',
                'haste': 'effect-haste',
                'poise': 'effect-poise',
                'burn': 'effect-burn',
                'declaredDuel': 'effect-declaredduel',
                'bravery': 'effect-bravery',
                'tremor': 'effect-tremor',
                'tremorExecution': 'effect-tremor-execution',
                'bleed': 'effect-bleed',
                'rupture': 'effect-rupture',
                'focusedAttack': 'effect-focusedattack',
                'sinking': 'effect-sinking',
                'charge': 'effect-charge',
                'modifiedAmpule': 'effect-modified-ampule',
                'jackpot': 'effect-jackpot',
                'calmLevel': 'effect-calm',
                
                // Debuff effects
                'slashDmgDown': 'effect-slashdmgdown',
                'pierceDmgDown': 'effect-piercedmgdown',
                'bluntDmgDown': 'effect-bluntdmgdown',
                'powerDown': 'effect-powerdown',
                'attackPowerDown': 'effect-attackpowerdown',
                'defensePowerDown': 'effect-defensepowerdown',
                'fragile': 'effect-fragile',
                'paralysis': 'effect-paralysis',
                'decayAmpule': 'effect-decay-ampule',
                'panicLevel': 'effect-nervous'
            };
            return iconMap[effectId] || '';
        }
        
        // Populate the status effect list in the modal
        populateStatusEffectList(statusEffects, modal) {
            const statusList = modal.querySelector('#statusEffectList');
            
            statusList.innerHTML = statusEffects.map(effect => {
                let inputHtml = '';
                let checkboxHtml = '';
                const iconClass = this.getStatusEffectIconClass(effect.id);
                const iconHtml = iconClass ? `<span class="status-icon ${iconClass}" style="margin-right: 8px;"></span>` : '';
                
                if (effect.type === 'simple') {
                    inputHtml = `<input type="number" id="${effect.id}Amount" min="0" max="${effect.max}" value="${effect.default}" class="status-input" style="width: 80px;">`;
                    checkboxHtml = `<input type="checkbox" id="${effect.id}Check" class="status-checkbox" style="margin-right: 8px;">`;
                } else if (effect.type === 'potencyCount') {
                    inputHtml = `
                        <div class="poise-inputs" style="display: flex; gap: 8px;">
                            <div class="poise-input-group">
                                <label class="poise-label">Potency:</label>
                                <input type="number" id="${effect.id}PotencyAmount" min="0" max="${effect.max}" value="${effect.default}" class="status-input" style="width: 60px;">
                            </div>
                            <div class="poise-input-group">
                                <label class="poise-label">Count:</label>
                                <input type="number" id="${effect.id}CountAmount" min="0" max="${effect.max}" value="${effect.default}" class="status-input" style="width: 60px;">
                            </div>
                        </div>
                    `;
                    checkboxHtml = `<input type="checkbox" id="${effect.id}Check" class="status-checkbox" style="margin-right: 8px;">`;
                } else if (effect.type === 'boolean') {
                    checkboxHtml = `<input type="checkbox" id="${effect.id}Check" class="status-checkbox" style="margin-right: 8px;">`;
                } else if (effect.type === 'special' && effect.id === 'calmLevel') {
                    // No checkbox for calm level, it's a special button
                }
                
                return `
                    <div class="page-item status-effect-item" data-effect-id="${effect.id}">
                        <div class="page-item-header">
                            <span class="page-name">
                                ${checkboxHtml}
                                ${iconHtml}
                                ${effect.name}
                            </span>
                            ${inputHtml ? `<div class="status-input-container">${inputHtml}</div>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add click handlers to status effect items (for selection highlighting)
            statusList.querySelectorAll('.status-effect-item').forEach((item, index) => {
                const effect = statusEffects[index];
                const checkbox = item.querySelector('.status-checkbox');
                
                // Special handling for calm level
                if (effect && effect.id === 'calmLevel') {
                    item.style.cursor = 'pointer';
                    item.addEventListener('click', () => {
                        // Open calm level modal
                        if (typeof this.openCalmLevelModal === 'function') {
                            this.openCalmLevelModal();
                        }
                    });
                    return;
                }
                
                item.addEventListener('click', (e) => {
                    // Don't toggle checkbox if clicking on the checkbox itself or input fields
                    if (e.target !== checkbox && !checkbox.contains(e.target) && 
                        e.target.tagName !== 'INPUT' && !e.target.closest('.status-input-container')) {
                        checkbox.checked = !checkbox.checked;
                    }
                    // Update selection highlighting
                    statusList.querySelectorAll('.status-effect-item').forEach(i => i.classList.remove('selected'));
                    if (checkbox.checked) {
                        item.classList.add('selected');
                    }
                });
                
                // Update selection highlighting when checkbox changes
                checkbox.addEventListener('change', () => {
                    statusList.querySelectorAll('.status-effect-item').forEach(i => i.classList.remove('selected'));
                    if (checkbox.checked) {
                        item.classList.add('selected');
                    }
                });
            });
        }
        
        // Filter status effect list based on search input
        filterStatusEffectList(searchTerm, statusEffects, modal) {
            const statusList = modal.querySelector('#statusEffectList');
            const statusItems = statusList.querySelectorAll('.status-effect-item');
            const searchLower = searchTerm.toLowerCase();
            
            statusItems.forEach((item, index) => {
                const effect = statusEffects[index];
                if (!effect) return;
                
                const effectName = (effect.name ?? '').toLowerCase();
                const matches = effectName.includes(searchLower);
                
                item.style.display = matches ? 'block' : 'none';
            });
        }
        
        // Confirm adding selected status effects
        confirmAddStatusEffects(modal, statusEffects) {
            // Process each status effect
            statusEffects.forEach(effect => {
                // Skip calm level as it's handled separately
                if (effect.id === 'calmLevel') return;
                
                const checkbox = modal.querySelector(`#${effect.id}Check`);
                if (!checkbox || !checkbox.checked) return;
                
                if (effect.type === 'simple') {
                    const amount = parseInt(modal.querySelector(`#${effect.id}Amount`)?.value || 0);
                    if (amount > 0) {
                        this.applyStatusEffect(effect.id, amount);
                    }
                } else if (effect.type === 'potencyCount') {
                    const potency = parseInt(modal.querySelector(`#${effect.id}PotencyAmount`)?.value || 0);
                    const count = parseInt(modal.querySelector(`#${effect.id}CountAmount`)?.value || 0);
                    if (potency > 0 || count > 0) {
                        this.applyStatusEffect(effect.id, potency, count);
                    }
                } else if (effect.type === 'boolean') {
                    this.applyStatusEffect(effect.id);
                } else if (effect.type === 'special' && effect.id === 'calmLevel') {
                    // Handle calm level separately
                    if (typeof this.openCalmLevelModal === 'function') {
                        this.openCalmLevelModal();
                    }
                }
            });
            
            this.showNotification('Status effects added successfully!', 'success');
        }
        
        // Apply a status effect based on its ID
        applyStatusEffect(effectId, amount, count) {
            switch(effectId) {
                case 'powerUp':
                    if (amount > 0) this.addPowerUpThisScene(amount);
                    break;
                case 'attackPowerUp':
                    if (amount > 0) this.addAttackPowerUpThisScene(amount);
                    break;
                case 'defensePowerUp':
                    if (amount > 0) this.addDefensePowerUpThisScene(amount);
                    break;
                case 'slashDmgUp':
                    if (amount > 0) this.addSlashDmgUpThisScene(amount);
                    break;
                case 'pierceDmgUp':
                    if (amount > 0) this.addPierceDmgUpThisScene(amount);
                    break;
                case 'bluntDmgUp':
                    if (amount > 0) this.addBluntDmgUpThisScene(amount);
                    break;
                case 'protection':
                    if (amount > 0) this.addProtectionThisScene(amount);
                    break;
                case 'taunt':
                    if (amount > 0) this.addTauntThisScene(amount);
                    break;
                case 'bind':
                    if (amount > 0) this.addBindThisScene(amount);
                    break;
                case 'haste':
                    if (amount > 0) this.addHasteThisScene(amount);
                    break;
                case 'poise':
                    if (amount > 0 || count > 0) {
                        this.addPoiseThisScene(amount || 0, count || 0);
                    }
                    break;
                case 'burn':
                    if (amount > 0 || count > 0) {
                        const result = this.addBurn(amount || 0, count || 0);
                        this.showNotification(`Burn: +${amount || 0} potency, +${count || 0} count. Now Potency ${result.potency}, Count ${result.count}.`, 'success');
                    }
                    break;
                case 'declaredDuel':
                    this.addDeclaredDuelThisScene();
                    break;
                case 'bravery':
                    this.addBraveryThisScene();
                    break;
                case 'tremor':
                    if (amount > 0) {
                        const newPot = this.addTremor(amount);
                        this.showNotification(`Tremor: +${amount}. Now ${newPot}.`, 'success');
                    }
                    break;
                case 'tremorExecution':
                    if (amount > 0) {
                        const newExec = this.addTremorExecution(amount);
                        this.showNotification(`Tremor - Execution: +${amount}. Now ${newExec}.`, 'success');
                    }
                    break;
                case 'bleed':
                    if (amount > 0 || count > 0) {
                        const result = this.addBleed(amount || 0, count || 0);
                        this.showNotification(`Bleed: +${amount || 0} potency, +${count || 0} count. Now Potency ${result.potency}, Count ${result.count}.`, 'success');
                    }
                    break;
                case 'rupture':
                    if (amount > 0 || count > 0) {
                        const result = this.addRupture(amount || 0, count || 0);
                        this.showNotification(`Rupture: +${amount || 0} potency, +${count || 0} count. Now Potency ${result.potency}, Count ${result.count}.`, 'success');
                    }
                    break;
                case 'focusedAttack':
                    if (amount > 0) {
                        if (typeof this.addFocusedAttackStacks === 'function') {
                            const newStacks = this.addFocusedAttackStacks(amount);
                            this.showNotification(`Focused Attack: +${amount} stack(s). Now ${newStacks}.`, 'success');
                        }
                    }
                    break;
                case 'sinking':
                    if (amount > 0 || count > 0) {
                        const result = this.addSinking(amount || 0, count || 0);
                        this.showNotification(`Sinking: +${amount || 0} potency, +${count || 0} count. Now Potency ${result.potency}, Count ${result.count}.`, 'success');
                    }
                    break;
                case 'charge':
                    if (amount > 0) {
                        if (typeof this.addChargePotencyThisScene === 'function') {
                            const newCharge = this.addChargePotencyThisScene(amount);
                            this.showNotification(`Charge: +${amount}. Now ${newCharge}.`, 'success');
                        } else {
                            if (!this.encounterState) this.encounterState = {};
                            const cur = Number(this.encounterState.chargePotencyThisScene) || 0;
                            const next = Math.max(0, cur + amount);
                            this.encounterState.chargePotencyThisScene = next;
                            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                            this.showNotification(`Charge: +${amount}. Now ${next}.`, 'success');
                        }
                    }
                    break;
                case 'modifiedAmpule':
                    if (amount > 0) {
                        if (!this.encounterState) this.encounterState = {};
                        const curAmp = Number(this.encounterState.modifiedAmpuleStacks) || 0;
                        this.encounterState.modifiedAmpuleStacks = Math.max(0, Math.min(99, curAmp + amount));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        this.showNotification(`Modified K Corp Ampule: +${amount} stack(s). Now ${this.encounterState.modifiedAmpuleStacks}.`, 'success');
                    }
                    break;
                case 'jackpot':
                    if (amount > 0) {
                        const newJackpot = (typeof this.addJackpotThisScene === 'function') ? this.addJackpotThisScene(amount) : (function(ctx){
                            if (!ctx.encounterState) ctx.encounterState = {};
                            const cur = Number(ctx.encounterState.jackpotCountThisScene) || 0;
                            const next = Math.max(0, Math.min(99, cur + amount));
                            ctx.encounterState.jackpotCountThisScene = next;
                            if (typeof ctx.updateStatusEffectsDisplay === 'function') ctx.updateStatusEffectsDisplay();
                            return next;
                        })(this);
                        this.showNotification(`Jackpot: +${amount}. Now ${newJackpot}.`, 'success');
                    }
                    break;
            }
        }

        // Open modal to manually add debuff status effects (debug function)
        openDebuffDebugModal() {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            
            // Define all debuff status effects with their properties
            const debuffEffects = [
                { id: 'slashDmgDown', name: 'Slash DMG Down', type: 'simple', max: 10, default: 1 },
                { id: 'pierceDmgDown', name: 'Pierce DMG Down', type: 'simple', max: 10, default: 1 },
                { id: 'bluntDmgDown', name: 'Blunt DMG Down', type: 'simple', max: 10, default: 1 },
                { id: 'powerDown', name: 'Power Down', type: 'simple', max: 10, default: 1 },
                { id: 'attackPowerDown', name: 'Attack Power Down', type: 'simple', max: 10, default: 1 },
                { id: 'defensePowerDown', name: 'Defense Power Down', type: 'simple', max: 10, default: 1 },
                { id: 'fragile', name: 'Fragile', type: 'simple', max: 10, default: 1 },
                { id: 'bindDebuff', name: 'Bind', type: 'bind', max: 10, default: 1 },
                { id: 'paralysis', name: 'Paralysis', type: 'simple', max: 99, default: 1 },
                { id: 'decayAmpule', name: 'Decay Ampule', type: 'simple', max: 99, default: 1 },
                { id: 'panicLevel', name: 'Panic Level', type: 'special' }
            ];
            
            const modal = document.createElement('div');
            modal.className = 'add-page-modal';
            modal.innerHTML = `
                <div class="add-page-modal-content">
                    <div class="popup-header">
                        <h3>Add Debuff Status Effects (Debug)</h3>
                        <span class="close-popup">&times;</span>
                    </div>
                    <div class="add-page-modal-body">
                        <div class="search-section">
                            <h4>Search Debuff Status Effects:</h4>
                            <input type="text" id="debuffEffectSearchInput" class="search-input" placeholder="Search by name, category, or keywords...">
                        </div>
                        <div class="page-selection">
                            <h4>Available Debuff Status Effects:</h4>
                            <div id="debuffEffectList" class="page-list">
                                <!-- Debuff effects will be populated here -->
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <button class="confirm-add-debuff-btn">Add Debuff Status Effects</button>
                        <button class="cancel-add-debuff-btn">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.classList.add('show');
            
            // Populate debuff effect list
            this.populateDebuffEffectList(debuffEffects, modal);
            
            // Add search functionality
            const searchInput = modal.querySelector('#debuffEffectSearchInput');
            searchInput.addEventListener('input', (e) => {
                this.filterDebuffEffectList(e.target.value, debuffEffects, modal);
            });
            
            // Add event listeners
            const closeBtn = modal.querySelector('.close-popup');
            const cancelBtn = modal.querySelector('.cancel-add-debuff-btn');
            const confirmBtn = modal.querySelector('.confirm-add-debuff-btn');

            const cleanup = () => {
                document.body.removeChild(modal);
            };

            closeBtn.addEventListener('click', cleanup);
            cancelBtn.addEventListener('click', cleanup);
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                }
            });

            confirmBtn.addEventListener('click', () => {
                this.confirmAddDebuffEffects(modal, debuffEffects);
                cleanup();
            });
        }
        
        // Populate the debuff effect list in the modal
        populateDebuffEffectList(debuffEffects, modal) {
            const debuffList = modal.querySelector('#debuffEffectList');
            
            debuffList.innerHTML = debuffEffects.map(effect => {
                let inputHtml = '';
                let checkboxHtml = '';
                const iconClass = this.getStatusEffectIconClass(effect.id);
                const iconHtml = iconClass ? `<span class="status-icon ${iconClass}" style="margin-right: 8px;"></span>` : '';
                
                if (effect.type === 'simple') {
                    inputHtml = `<input type="number" id="${effect.id}Amount" min="0" max="${effect.max}" value="${effect.default}" class="status-input" style="width: 80px;">`;
                    checkboxHtml = `<input type="checkbox" id="${effect.id}Check" class="status-checkbox" style="margin-right: 8px;">`;
                } else if (effect.type === 'bind') {
                    // Special handling for Bind with "Next Scene" checkbox
                    inputHtml = `
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="number" id="${effect.id}Amount" min="0" max="${effect.max}" value="${effect.default}" class="status-input" style="width: 80px;">
                            <label class="next-scene-label" style="margin: 0; font-size: 12px; color: #ccc;">
                                <input type="checkbox" id="${effect.id}NextSceneCheck" class="next-scene-checkbox">
                                Next Scene
                            </label>
                        </div>
                    `;
                    checkboxHtml = `<input type="checkbox" id="${effect.id}Check" class="status-checkbox" style="margin-right: 8px;">`;
                } else if (effect.type === 'special' && effect.id === 'panicLevel') {
                    // No checkbox for panic level, it's a special button
                }
                
                return `
                    <div class="page-item status-effect-item" data-effect-id="${effect.id}">
                        <div class="page-item-header">
                            <span class="page-name">
                                ${checkboxHtml}
                                ${iconHtml}
                                ${effect.name}
                            </span>
                            ${inputHtml ? `<div class="status-input-container">${inputHtml}</div>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add click handlers to debuff effect items (for selection highlighting)
            debuffList.querySelectorAll('.status-effect-item').forEach((item, index) => {
                const effect = debuffEffects[index];
                const checkbox = item.querySelector('.status-checkbox');
                
                // Special handling for panic level
                if (effect && effect.id === 'panicLevel') {
                    item.style.cursor = 'pointer';
                    item.addEventListener('click', () => {
                        // Open panic level modal
                        if (typeof this.openPanicLevelModal === 'function') {
                            this.openPanicLevelModal();
                        }
                    });
                    return;
                }
                
                item.addEventListener('click', (e) => {
                    // Don't toggle checkbox if clicking on the checkbox itself or input fields
                    if (e.target !== checkbox && !checkbox.contains(e.target) && 
                        e.target.tagName !== 'INPUT' && !e.target.closest('.status-input-container')) {
                        checkbox.checked = !checkbox.checked;
                    }
                    // Update selection highlighting
                    debuffList.querySelectorAll('.status-effect-item').forEach(i => i.classList.remove('selected'));
                    if (checkbox.checked) {
                        item.classList.add('selected');
                    }
                });
                
                // Update selection highlighting when checkbox changes
                if (checkbox) {
                    checkbox.addEventListener('change', () => {
                        debuffList.querySelectorAll('.status-effect-item').forEach(i => i.classList.remove('selected'));
                        if (checkbox.checked) {
                            item.classList.add('selected');
                        }
                    });
                }
            });
        }
        
        // Filter debuff effect list based on search input
        filterDebuffEffectList(searchTerm, debuffEffects, modal) {
            const debuffList = modal.querySelector('#debuffEffectList');
            const debuffItems = debuffList.querySelectorAll('.status-effect-item');
            const searchLower = searchTerm.toLowerCase();
            
            debuffItems.forEach((item, index) => {
                const effect = debuffEffects[index];
                if (!effect) return;
                
                const effectName = (effect.name ?? '').toLowerCase();
                const matches = effectName.includes(searchLower);
                
                item.style.display = matches ? 'block' : 'none';
            });
        }
        
        // Confirm adding selected debuff effects
        confirmAddDebuffEffects(modal, debuffEffects) {
            // Process each debuff effect
            debuffEffects.forEach(effect => {
                // Skip panic level as it's handled separately
                if (effect.id === 'panicLevel') return;
                
                const checkbox = modal.querySelector(`#${effect.id}Check`);
                if (!checkbox || !checkbox.checked) return;
                
                if (effect.type === 'simple') {
                    const amount = parseInt(modal.querySelector(`#${effect.id}Amount`)?.value || 0);
                    if (amount > 0) {
                        this.applyDebuffEffect(effect.id, amount);
                    }
                } else if (effect.type === 'bind') {
                    const amount = parseInt(modal.querySelector(`#${effect.id}Amount`)?.value || 0);
                    const nextSceneChecked = modal.querySelector(`#${effect.id}NextSceneCheck`)?.checked || false;
                    
                    if (nextSceneChecked) {
                        // If "Next Scene" is checked, queue for next scene only
                        if (amount > 0) {
                            if (!this.encounterState) this.encounterState = {};
                            this.encounterState.bindNextScene = Math.max(0, Math.min(10, amount));
                        }
                    } else {
                        // If "Next Scene" is NOT checked, apply to current scene and clear any queued Bind
                        if (amount > 0) this.addBindThisScene(amount);
                        if (!this.encounterState) this.encounterState = {};
                        this.encounterState.bindNextScene = 0;
                    }
                }
            });
            
            this.showNotification('Debuff status effects added successfully!', 'success');
        }
        
        // Apply a debuff effect based on its ID
        applyDebuffEffect(effectId, amount) {
            switch(effectId) {
                case 'slashDmgDown':
                    if (amount > 0) this.addSlashDmgDownThisScene(amount);
                    break;
                case 'pierceDmgDown':
                    if (amount > 0) this.addPierceDmgDownThisScene(amount);
                    break;
                case 'bluntDmgDown':
                    if (amount > 0) this.addBluntDmgDownThisScene(amount);
                    break;
                case 'powerDown':
                    if (amount > 0) this.addPowerDownThisScene(amount);
                    break;
                case 'attackPowerDown':
                    if (amount > 0) this.addAttackPowerDownThisScene(amount);
                    break;
                case 'defensePowerDown':
                    if (amount > 0) this.addDefensePowerDownThisScene(amount);
                    break;
                case 'fragile':
                    if (amount > 0) this.addFragileThisScene(amount);
                    break;
                case 'paralysis':
                    if (amount > 0) this.addParalysisThisScene(amount);
                    break;
                case 'decayAmpule':
                    if (amount > 0) {
                        if (!this.encounterState) this.encounterState = {};
                        const curDecay = Number(this.encounterState.decayAmpuleStacks) || 0;
                        this.encounterState.decayAmpuleStacks = Math.max(0, Math.min(99, curDecay + amount));
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    }
                    break;
            }
        }

        // Open modal to select panic level status effect
        openPanicLevelModal() {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            
            // Get current panic level to pre-select it
            const currentPanicLevel = this.encounterState?.panicLevelThisScene || null;
            
            // Define panic level options
            const panicLevels = [
                { id: 'nervous', name: 'Nervous',  iconClass: 'effect-nervous' },
                { id: 'intimidated', name: 'Intimidated',  iconClass: 'effect-intimidated' },
                { id: 'terrified', name: 'Terrified',  iconClass: 'effect-terrified' },
                { id: 'hopeless', name: 'Hopeless',  iconClass: 'effect-hopeless' },
                { id: 'overwhelmed', name: 'Overwhelmed',  iconClass: 'effect-overwhelmed' }
            ];
            
            const modal = document.createElement('div');
            modal.className = 'add-page-modal';
            modal.innerHTML = `
                <div class="add-page-modal-content">
                    <div class="popup-header">
                        <h3>Select Panic Level</h3>
                        <span class="close-popup">&times;</span>
                    </div>
                    <div class="add-page-modal-body">
                        <div class="search-section">
                            <h4>Search Panic Levels:</h4>
                            <input type="text" id="panicLevelSearchInput" class="search-input" placeholder="Search by name...">
                        </div>
                        <div class="page-selection">
                            <h4>Available Panic Levels:</h4>
                            <div id="panicLevelList" class="page-list">
                                <!-- Panic levels will be populated here -->
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <button class="confirm-panic-level-btn">Apply Panic Level</button>
                        <button class="cancel-panic-level-btn">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Populate panic level list
            this.populatePanicLevelList(panicLevels, modal, currentPanicLevel);
            
            // Add search functionality
            const searchInput = modal.querySelector('#panicLevelSearchInput');
            searchInput.addEventListener('input', (e) => {
                this.filterPanicLevelList(e.target.value, panicLevels, modal);
            });
            
            // Add event listeners
            const closeBtn = modal.querySelector('.close-popup');
            const cancelBtn = modal.querySelector('.cancel-panic-level-btn');
            const confirmBtn = modal.querySelector('.confirm-panic-level-btn');

            const cleanup = () => {
                document.body.removeChild(modal);
            };

            closeBtn.addEventListener('click', cleanup);
            cancelBtn.addEventListener('click', cleanup);
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                }
            });

            confirmBtn.addEventListener('click', () => {
                // Get selected panic level
                const panicLevelRadio = modal.querySelector('input[name="panicLevel"]:checked');
                const panicLevel = panicLevelRadio ? panicLevelRadio.value : null;

                // Apply panic level status effect
                if (panicLevel && typeof this.setPanicLevelThisScene === 'function') {
                    this.setPanicLevelThisScene(panicLevel);
                    const panicLevelNames = {
                        'nervous': 'Nervous',
                        'intimidated': 'Intimidated',
                        'terrified': 'Terrified',
                        'hopeless': 'Hopeless',
                        'overwhelmed': 'Overwhelmed'
                    };
                    this.showNotification(`Panic Level: ${panicLevelNames[panicLevel]} applied.`, 'success');
                }
                cleanup();
            });
        }
        
        // Populate the panic level list in the modal
        populatePanicLevelList(panicLevels, modal, currentPanicLevel) {
            const panicList = modal.querySelector('#panicLevelList');
            
            panicList.innerHTML = panicLevels.map(level => {
                const isChecked = currentPanicLevel === level.id || (!currentPanicLevel && level.id === 'nervous');
                const iconHtml = `<span class="status-icon ${level.iconClass}" style="margin-right: 8px;"></span>`;
                
                return `
                    <div class="page-item status-effect-item" data-panic-id="${level.id}">
                        <div class="page-item-header">
                            <span class="page-name">
                                <input type="radio" name="panicLevel" id="panic${level.id.charAt(0).toUpperCase() + level.id.slice(1)}" value="${level.id}" ${isChecked ? 'checked' : ''} style="margin-right: 8px;">
                                ${iconHtml}
                                ${level.name}
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add click handlers to panic level items
            panicList.querySelectorAll('.status-effect-item').forEach(item => {
                const radio = item.querySelector('input[type="radio"]');
                item.addEventListener('click', (e) => {
                    // Don't toggle radio if clicking on the radio itself
                    if (e.target !== radio && !radio.contains(e.target)) {
                        radio.checked = true;
                    }
                    // Update selection highlighting
                    panicList.querySelectorAll('.status-effect-item').forEach(i => i.classList.remove('selected'));
                    if (radio.checked) {
                        item.classList.add('selected');
                    }
                });
                
                // Update selection highlighting when radio changes
                radio.addEventListener('change', () => {
                    panicList.querySelectorAll('.status-effect-item').forEach(i => i.classList.remove('selected'));
                    if (radio.checked) {
                        item.classList.add('selected');
                    }
                });
            });
        }
        
        // Filter panic level list based on search input
        filterPanicLevelList(searchTerm, panicLevels, modal) {
            const panicList = modal.querySelector('#panicLevelList');
            const panicItems = panicList.querySelectorAll('.status-effect-item');
            const searchLower = searchTerm.toLowerCase();
            
            panicItems.forEach((item, index) => {
                const level = panicLevels[index];
                if (!level) return;
                
                const levelName = (level.name ?? '').toLowerCase();
                const matches = levelName.includes(searchLower);
                
                item.style.display = matches ? 'block' : 'none';
            });
        }

        // Open modal to select calm level status effect
        openCalmLevelModal() {
            if (!this.encounterState) {
                this.showNotification('No active encounter. Start an encounter first.', 'warning');
                return;
            }
            
            // Get current calm level to pre-select it
            const currentCalmLevel = this.encounterState?.calmLevelThisScene || null;
            
            // Define calm level options
            const calmLevels = [
                { id: 'calm', name: 'Calm',  iconClass: 'effect-calm' },
                { id: 'relaxed', name: 'Relaxed',  iconClass: 'effect-relaxed' },
                { id: 'resolved', name: 'Resolved',  iconClass: 'effect-resolved' },
                { id: 'optimistic', name: 'Optimistic',  iconClass: 'effect-optimistic' },
                { id: 'persevere', name: 'Persevere',  iconClass: 'effect-persevere' }
            ];
            
            const modal = document.createElement('div');
            modal.className = 'add-page-modal';
            modal.innerHTML = `
                <div class="add-page-modal-content">
                    <div class="popup-header">
                        <h3>Select Calm Level</h3>
                        <span class="close-popup">&times;</span>
                    </div>
                    <div class="add-page-modal-body">
                        <div class="search-section">
                            <h4>Search Calm Levels:</h4>
                            <input type="text" id="calmLevelSearchInput" class="search-input" placeholder="Search by name...">
                        </div>
                        <div class="page-selection">
                            <h4>Available Calm Levels:</h4>
                            <div id="calmLevelList" class="page-list">
                                <!-- Calm levels will be populated here -->
                            </div>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <button class="confirm-calm-level-btn">Apply Calm Level</button>
                        <button class="cancel-calm-level-btn">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Populate calm level list
            this.populateCalmLevelList(calmLevels, modal, currentCalmLevel);
            
            // Add search functionality
            const searchInput = modal.querySelector('#calmLevelSearchInput');
            searchInput.addEventListener('input', (e) => {
                this.filterCalmLevelList(e.target.value, calmLevels, modal);
            });
            
            // Add event listeners
            const closeBtn = modal.querySelector('.close-popup');
            const cancelBtn = modal.querySelector('.cancel-calm-level-btn');
            const confirmBtn = modal.querySelector('.confirm-calm-level-btn');

            const cleanup = () => {
                document.body.removeChild(modal);
            };

            closeBtn.addEventListener('click', cleanup);
            cancelBtn.addEventListener('click', cleanup);
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                }
            });

            confirmBtn.addEventListener('click', () => {
                // Get selected calm level
                const calmLevelRadio = modal.querySelector('input[name="calmLevel"]:checked');
                const calmLevel = calmLevelRadio ? calmLevelRadio.value : null;

                // Apply calm level status effect
                if (calmLevel && typeof this.setCalmLevelThisScene === 'function') {
                    this.setCalmLevelThisScene(calmLevel);
                    const calmLevelNames = {
                        'calm': 'Calm',
                        'relaxed': 'Relaxed',
                        'resolved': 'Resolved',
                        'optimistic': 'Optimistic',
                        'persevere': 'Persevere'
                    };
                    this.showNotification(`Calm Level: ${calmLevelNames[calmLevel]} applied.`, 'success');
                }

                cleanup();
            });
        }
        
        // Populate the calm level list in the modal
        populateCalmLevelList(calmLevels, modal, currentCalmLevel) {
            const calmList = modal.querySelector('#calmLevelList');
            
            calmList.innerHTML = calmLevels.map(level => {
                const isChecked = currentCalmLevel === level.id || (!currentCalmLevel && level.id === 'calm');
                const iconHtml = `<span class="status-icon ${level.iconClass}" style="margin-right: 8px;"></span>`;
                
                return `
                    <div class="page-item status-effect-item" data-calm-id="${level.id}">
                        <div class="page-item-header">
                            <span class="page-name">
                                <input type="radio" name="calmLevel" id="calm${level.id.charAt(0).toUpperCase() + level.id.slice(1)}" value="${level.id}" ${isChecked ? 'checked' : ''} style="margin-right: 8px;">
                                ${iconHtml}
                                ${level.name}
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add click handlers to calm level items
            calmList.querySelectorAll('.status-effect-item').forEach(item => {
                const radio = item.querySelector('input[type="radio"]');
                item.addEventListener('click', (e) => {
                    // Don't toggle radio if clicking on the radio itself
                    if (e.target !== radio && !radio.contains(e.target)) {
                        radio.checked = true;
                    }
                    // Update selection highlighting
                    calmList.querySelectorAll('.status-effect-item').forEach(i => i.classList.remove('selected'));
                    if (radio.checked) {
                        item.classList.add('selected');
                    }
                });
                
                // Update selection highlighting when radio changes
                radio.addEventListener('change', () => {
                    calmList.querySelectorAll('.status-effect-item').forEach(i => i.classList.remove('selected'));
                    if (radio.checked) {
                        item.classList.add('selected');
                    }
                });
            });
        }
        
        // Filter calm level list based on search input
        filterCalmLevelList(searchTerm, calmLevels, modal) {
            const calmList = modal.querySelector('#calmLevelList');
            const calmItems = calmList.querySelectorAll('.status-effect-item');
            const searchLower = searchTerm.toLowerCase();
            
            calmItems.forEach((item, index) => {
                const level = calmLevels[index];
                if (!level) return;
                
                const levelName = (level.name ?? '').toLowerCase();
                const matches = levelName.includes(searchLower);
                
                item.style.display = matches ? 'block' : 'none';
            });
        }
    }

    // Helper: Draw cards immediately during combat (ignores scene transition)
    // Respects max hand, Single Use restrictions, and excludes Special pages
    CharacterManager.prototype.drawImmediateCards = function(cardsToDraw) {
        if (!this.encounterState || typeof cardsToDraw !== 'number' || cardsToDraw <= 0) return;
        const maxHand = this.encounterState.maxHand;
        const currentHandSize = (this.encounterState.handNormal?.length || 0);
        const availableSpace = Math.max(0, maxHand - currentHandSize);
        const count = Math.min(cardsToDraw, availableSpace);
        if (count <= 0) {
            this.showNotification('Hand is full! Cannot draw more pages.', 'info');
            return;
        }
        const ownedPages = this.getAvailablePagesForDrawing();
        if (!ownedPages || ownedPages.length === 0) return;

        const drawnCards = [];
        const pageCounts = new Map();

        // Available pages from equipped collection; exclude single-use already used in encounter
        // Exclude Special and Special - Single-Use pages to prevent duplicates
        // Trigram pages only available for Hana Association faction
        const availablePages = ownedPages.filter(pageId => {
            const page = window.pageManager?.pages[pageId];
            const isSingleUse = page && page.range && page.range.includes('Single Use');
            const isSpecial = page && (page.range === 'Special' || page.range === 'Mass - Summation' || page.range === 'Mass - Individual') && !page.range.includes('Single Use');
            const isSpecialSingleUse = page && page.range && page.range.includes('Special') && page.range.includes('Single Use');
            const isThumbAmmo = pageId === 102 || pageId === 103 || pageId === 104 || pageId === 105;
            
            // Check faction restriction for trigram pages
            const trigramPageIds = [13, 14, 15, 16]; // Geon, Gon, Gam, Gi
            const currentFaction = this.currentCharacter?.factions || '';
            const isHanaAssociation = currentFaction === 'Hana Association';
            
            if (trigramPageIds.includes(pageId) && !isHanaAssociation) {
                return false; // Skip trigram pages if not Hana Association
            }
            
            // Exclude Special pages and Special - Single-Use pages from random draws to avoid duplicates
            if (isSpecial || isSpecialSingleUse) return false;
            
            // Check single-use restrictions for non-special pages
            if (isSingleUse && this.encounterState.singleUsePagesUsed && this.encounterState.singleUsePagesUsed.has(pageId)) return false;
            return true;
        });
        if (availablePages.length === 0) return;

        // Bottom Deal: Sort pages by light usage in ascending order
        const hasBottomDeal = typeof this.hasPassive === 'function' && this.hasPassive('Bottom Deal');
        let sortedAvailablePages = [...availablePages];
        
        if (hasBottomDeal) {
            sortedAvailablePages.sort((a, b) => {
                const pageA = window.pageManager?.pages[a];
                const pageB = window.pageManager?.pages[b];
                const lightA = typeof pageA?.lightUsage === 'number' ? pageA.lightUsage : parseInt(pageA?.lightUsage ?? 0) || 0;
                const lightB = typeof pageB?.lightUsage === 'number' ? pageB.lightUsage : parseInt(pageB?.lightUsage ?? 0) || 0;
                return lightA - lightB;
            });
        }
        
        // Use a persistent pointer across draws for Bottom Deal rotation
        let bdPtr = Number(this.encounterState?.bottomDealDrawIndex) || 0;

        for (let i = 0; i < count; i++) {
            let selectedPageId;
            
            if (hasBottomDeal && sortedAvailablePages.length > 0) {
                // Bottom Deal: rotate through ascending list using persistent pointer
                const len = sortedAvailablePages.length;
                let attempts = 0;
                while (attempts < len) {
                    const idx = ((bdPtr % len) + len) % len;
                    selectedPageId = sortedAvailablePages[idx];
                    bdPtr++;
                    const pChk = window.pageManager?.pages[selectedPageId];
                    const isSingleUseChk = pChk && pChk.range && pChk.range.includes('Single Use');
                    const maxCopiesChk = isSingleUseChk ? 1 : 3;
                    const existingInHandChk = Array.isArray(this.encounterState.handNormal)
                        ? this.encounterState.handNormal.filter(id => id === selectedPageId).length
                        : 0;
                    const currentCountChk = pageCounts.get(selectedPageId) || 0;
                    const alreadyUsedSingleUse = isSingleUseChk && this.encounterState.singleUsePagesUsed && this.encounterState.singleUsePagesUsed.has(selectedPageId);
                    if (existingInHandChk + currentCountChk < maxCopiesChk && !alreadyUsedSingleUse) {
                        break;
                    }
                    attempts++;
                    selectedPageId = null;
                }
                if (!selectedPageId) {
                    selectedPageId = availablePages[Math.floor(Math.random() * availablePages.length)];
                }
            } else {
                // Normal: Randomly select from available pages
                selectedPageId = availablePages[Math.floor(Math.random() * availablePages.length)];
            }
            
            const page = window.pageManager?.pages[selectedPageId];
            const isSingleUse = page && page.range && page.range.includes('Single Use');
            const currentCount = pageCounts.get(selectedPageId) || 0;
            const maxCopies = isSingleUse ? 1 : 3;
            const existingInHand = Array.isArray(this.encounterState.handNormal)
                ? this.encounterState.handNormal.filter(id => id === selectedPageId).length
                : 0;
            if (existingInHand + currentCount < maxCopies) {
                drawnCards.push(selectedPageId);
                pageCounts.set(selectedPageId, currentCount + 1);
            } else {
                // If we've reached max copies, try again
                i--; // retry this iteration
            }
        }
        if (drawnCards.length > 0) {
            if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
            this.encounterState.handNormal.push(...drawnCards);
            
            // Persist updated Bottom Deal pointer
            if (!this.encounterState) this.encounterState = {};
            this.encounterState.bottomDealDrawIndex = bdPtr;
            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
            
            // Update Bottom Deal final card (determined once per scene after draws)
            if (typeof this.updateBottomDealFinalCard === 'function') {
                this.updateBottomDealFinalCard();
            }
            
            this.updateHandDisplay();
            this.showNotification(`Drew ${drawnCards.length} page(s).`, 'info');
            try {
                // Increment per-scene draw counter by number of pages actually drawn now
                if (!this.encounterState) this.encounterState = {};
                const prev = Number(this.encounterState.pagesDrawnThisScene) || 0;
                this.encounterState.pagesDrawnThisScene = prev + drawnCards.length;
            } catch (e) { /* non-fatal */ }
        }
    };

    // Remove Declared Duel buff mid-scene
    CharacterManager.prototype.removeDeclaredDuelThisScene = function() {
        if (!this.encounterState) this.encounterState = {};
        // Clear flag and remove global max bonus for the remainder of the phase
        this.encounterState.declaredDuelActiveThisScene = false;
        this.encounterState.globalMaxPowerBonusThisPhase = 0;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        this.showNotification('Declared Duel: Removed for this scene.', 'info');
    };

    // Helper: Draw cards immediately during combat, excluding Special and Special - Single-Use pages
    // Used specifically for Gi (☲) On Play effect to prevent duplicates
    CharacterManager.prototype.drawImmediateCardsExcludingSpecial = function(cardsToDraw) {
        if (!this.encounterState || typeof cardsToDraw !== 'number' || cardsToDraw <= 0) return;
        const maxHand = this.encounterState.maxHand;
        const currentHandSize = (this.encounterState.handNormal?.length || 0);
        const availableSpace = Math.max(0, maxHand - currentHandSize);
        const count = Math.min(cardsToDraw, availableSpace);
        if (count <= 0) {
            this.showNotification('Hand is full! Cannot draw more pages.', 'info');
            return;
        }
        const ownedPages = this.getAvailablePagesForDrawing();
        if (!ownedPages || ownedPages.length === 0) return;

        const drawnCards = [];
        const pageCounts = new Map();

        // Filter out Special and Special - Single-Use pages to prevent duplicates
        const availablePages = ownedPages.filter(pageId => {
            const page = window.pageManager?.pages[pageId];
            const isSingleUse = page && page.range && page.range.includes('Single Use');
            const isSpecial = page && (page.range === 'Special' || page.range === 'Mass - Summation' || page.range === 'Mass - Individual') && !page.range.includes('Single Use');
            const isSpecialSingleUse = page && page.range && page.range.includes('Special') && page.range.includes('Single Use');
            const isThumbAmmo = pageId === 102 || pageId === 103 || pageId === 104 || pageId === 105;
            
            // Check faction restriction for trigram pages
            const trigramPageIds = [13, 14, 15, 16]; // Geon, Gon, Gam, Gi
            const currentFaction = this.currentCharacter?.factions || '';
            const isHanaAssociation = currentFaction === 'Hana Association';
            
            if (trigramPageIds.includes(pageId) && !isHanaAssociation) {
                return false; // Skip trigram pages if not Hana Association
            }
            
            // Exclude Special pages and Special - Single-Use pages to prevent duplicates
            if (isSpecial || isSpecialSingleUse) {
                return false;
            }
            
            // Check single-use restrictions for non-special pages
            if (isSingleUse && this.encounterState.singleUsePagesUsed && this.encounterState.singleUsePagesUsed.has(pageId)) return false;
            return true;
        });
        
        if (availablePages.length === 0) {
            this.showNotification('No non-Special pages available to draw.', 'info');
            return;
        }

        for (let i = 0; i < count; i++) {
            const randomPageId = availablePages[Math.floor(Math.random() * availablePages.length)];
            const page = window.pageManager?.pages[randomPageId];
            const isSingleUse = page && page.range && page.range.includes('Single Use');
            const currentCount = pageCounts.get(randomPageId) || 0;
            const maxCopies = isSingleUse ? 1 : 3;
            const existingInHand = Array.isArray(this.encounterState.handNormal)
                ? this.encounterState.handNormal.filter(id => id === randomPageId).length
                : 0;
            if (existingInHand + currentCount < maxCopies) {
                drawnCards.push(randomPageId);
                pageCounts.set(randomPageId, currentCount + 1);
            } else {
                i--; // retry with a different page
            }
        }
        if (drawnCards.length > 0) {
            if (!Array.isArray(this.encounterState.handNormal)) this.encounterState.handNormal = [];
            this.encounterState.handNormal.push(...drawnCards);
            this.encounterState.hand = [...(this.encounterState.handNormal||[]), ...(this.encounterState.handSpecial||[])];
            if (typeof this.enforceHandConstraints === 'function') this.enforceHandConstraints();
            this.updateHandDisplay();
            this.showNotification(`Drew ${drawnCards.length} page(s) (excluding Special pages).`, 'info');
            try {
                if (!this.encounterState) this.encounterState = {};
                const prev = Number(this.encounterState.pagesDrawnThisScene) || 0;
                this.encounterState.pagesDrawnThisScene = prev + drawnCards.length;
            } catch (e) { /* non-fatal */ }
        }
    };

    // Handle Gi (☲) On Play effect: automatically use the page and draw 2 pages
    CharacterManager.prototype.handleGiOnPlayEffect = function() {
        console.log('Gi (☲) On Play effect triggered');
        
        // Automatically use the page (it's already placed on dice, so it's considered "used")
        // Mark the trigram as used this scene
        if (!this.encounterState.trigramUsedThisScene) {
            this.encounterState.trigramUsedThisScene = true;
        }
        
        // Track trigram usage in the cycle
        if (!this.encounterState.trigramCycleUsed) {
            this.encounterState.trigramCycleUsed = new Set();
        }
        this.encounterState.trigramCycleUsed.add(16); // Gi (☲) page ID
        
        // Draw 2 pages (excluding Special and Special - Single-Use pages)
        this.drawImmediateCardsExcludingSpecial(2);
        
        // Remove Gi (☲) from dice assignments immediately after use
        if (this.encounterState && this.encounterState.diceAssignments) {
            // Find and remove the Gi (☲) assignment
            for (let [diceIndex, assignment] of this.encounterState.diceAssignments.entries()) {
                if (assignment.pageId === 16) { // Gi (☲) page ID
                    this.encounterState.diceAssignments.delete(diceIndex);
                    console.log(`Removed Gi (☲) from dice slot ${diceIndex}`);
                    
                    // Update visual state to show the dice slot as empty
                    this.updateDiceVisualState([]);
                    break;
                }
            }
        }
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
    };

    // Handle Zwei Defensive Stance On Play: toggle stance and grant/remove effects
    CharacterManager.prototype.handleZweiDefensiveStanceOnPlay = function() {
        // New behavior: stance is active only while the page is currently assigned to any dice.
        if (!this.encounterState) this.encounterState = {};
        const assigned = this.isDefensiveStanceAssigned();
        const wasActive = !!this.encounterState.zweiDefensiveStanceActive;
            if (assigned && !wasActive) {
            if (typeof this.addProtectionThisScene === 'function') this.addProtectionThisScene(1); else {
                const curProt = (typeof this.encounterState.protectionThisScene === 'number') ? this.encounterState.protectionThisScene : 0;
                this.encounterState.protectionThisScene = Math.min(10, curProt + 1);
            }
            if (typeof this.addTauntThisScene === 'function') this.addTauntThisScene(1); else {
                const curTaunt = (typeof this.encounterState.tauntThisScene === 'number') ? this.encounterState.tauntThisScene : 0;
                this.encounterState.tauntThisScene = Math.min(10, curTaunt + 1);
            }
            if (typeof this.addBindThisScene === 'function') this.addBindThisScene(1); else {
                const curBind = (typeof this.encounterState.bindThisScene === 'number') ? this.encounterState.bindThisScene : 0;
                this.encounterState.bindThisScene = Math.min(10, curBind + 1);
            }
            this.encounterState.zweiDefensiveStanceActive = true;
            this.showNotification("Defensive Stance: Gained Zwei's Defensive Stance (+1 Protection, +1 Taunt, +1 Bind).", 'success');
        } else if (!assigned && wasActive) {
            const curProt = (typeof this.encounterState.protectionThisScene === 'number') ? this.encounterState.protectionThisScene : 0;
            const curTaunt = (typeof this.encounterState.tauntThisScene === 'number') ? this.encounterState.tauntThisScene : 0;
            const curBind = (typeof this.encounterState.bindThisScene === 'number') ? this.encounterState.bindThisScene : 0;
            this.encounterState.protectionThisScene = Math.max(0, curProt - 1);
            this.encounterState.tauntThisScene = Math.max(0, curTaunt - 1);
            this.encounterState.bindThisScene = Math.max(0, curBind - 1);
            this.encounterState.zweiDefensiveStanceActive = false;
            this.showNotification("Defensive Stance: Removed Zwei's Defensive Stance.", 'info');
        }
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
    };

    // Returns true if any die currently has Defensive Stance (pageId 19) assigned
    CharacterManager.prototype.isDefensiveStanceAssigned = function() {
        try {
            if (!this.encounterState || !this.encounterState.diceAssignments) return false;
            for (const assignment of this.encounterState.diceAssignments.values()) {
                if (assignment && assignment.pageId === 19) return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    // Presence-based effect: While Balestra Fente is assigned to any die, grant +3 Haste and +1 Power Up this scene.
    // When it is no longer assigned anywhere, remove exactly that amount (without underflowing).
    CharacterManager.prototype.handleBalestraFentePresence = function() {
        if (!this.encounterState) this.encounterState = {};
        const latched = !!this.encounterState.balestraFenteLatchedForScene;
        const isAssigned = (() => {
            try {
                if (!this.encounterState.diceAssignments) return false;
                for (const a of this.encounterState.diceAssignments.values()) {
                    const p = window.pageManager?.pages?.[a.pageId];
                    if (p && p.name === 'Balestra Fente') return true;
                }
            } catch (e) { /* non-fatal */ }
            return false;
        })();

        const appliedFlag = '__balestraPresenceApplied';
        const alreadyApplied = !!this.encounterState[appliedFlag];
        if ((isAssigned || latched) && !alreadyApplied) {
            // Apply the buffs once while present
            if (typeof this.addHasteThisScene === 'function') {
                this.addHasteThisScene(3);
            } else {
                const cur = Number(this.encounterState.hasteThisScene) || 0;
                this.encounterState.hasteThisScene = Math.max(0, Math.min(10, cur + 3));
            }
            if (typeof this.addPowerUpThisScene === 'function') {
                this.addPowerUpThisScene(1);
            } else {
                const cur = Number(this.encounterState.powerUpThisScene) || 0;
                this.encounterState.powerUpThisScene = Math.max(0, Math.min(10, cur + 1));
            }
            this.encounterState[appliedFlag] = true;
            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
            this.showNotification('Balestra Fente: Active on dice — +3 Haste, +1 Power Up.', 'success');
            return;
        }
        if (!isAssigned && !latched && alreadyApplied) {
            // Remove the buffs when no longer present
            const curH = Number(this.encounterState.hasteThisScene) || 0;
            const curP = Number(this.encounterState.powerUpThisScene) || 0;
            this.encounterState.hasteThisScene = Math.max(0, curH - 3);
            this.encounterState.powerUpThisScene = Math.max(0, curP - 1);
            this.encounterState[appliedFlag] = false;
            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
            this.showNotification('Balestra Fente: Removed from dice — Haste and Power Up reverted.', 'info');
        }
    };

    // Presence-based effect: While Punition is assigned to any die, grant +4 Haste this scene.
    // Latches through combat like Balestra; cleared at scene reset.
    CharacterManager.prototype.handlePunitionPresence = function() {
        if (!this.encounterState) this.encounterState = {};
        const latched = !!this.encounterState.punitionLatchedForScene;
        const isAssigned = (() => {
            try {
                if (!this.encounterState.diceAssignments) return false;
                for (const a of this.encounterState.diceAssignments.values()) {
                    const p = window.pageManager?.pages?.[a.pageId];
                    if (p && p.name === 'Punition') return true;
                }
            } catch (e) { /* non-fatal */ }
            return false;
        })();
        const appliedFlag = '__punitionPresenceApplied';
        const alreadyApplied = !!this.encounterState[appliedFlag];
        if ((isAssigned || latched) && !alreadyApplied) {
            if (typeof this.addHasteThisScene === 'function') {
                this.addHasteThisScene(4);
            } else {
                const cur = Number(this.encounterState.hasteThisScene) || 0;
                this.encounterState.hasteThisScene = Math.max(0, Math.min(10, cur + 4));
            }
            this.encounterState[appliedFlag] = true;
            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
            this.showNotification('Punition: Active on dice — +4 Haste.', 'success');
            return;
        }
        if (!isAssigned && !latched && alreadyApplied) {
            const curH = Number(this.encounterState.hasteThisScene) || 0;
            this.encounterState.hasteThisScene = Math.max(0, curH - 4);
            this.encounterState[appliedFlag] = false;
            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
            this.showNotification('Punition: Removed from dice — Haste reverted.', 'info');
        }
    };

    // Handle Gam (☵) On Play effect: restore 2 Light
    CharacterManager.prototype.handleGamOnPlayEffect = function() {
        console.log('Gam (☵) On Play effect triggered');
        
        // Mark the trigram as used this scene
        if (!this.encounterState.trigramUsedThisScene) {
            this.encounterState.trigramUsedThisScene = true;
        }
        
        // Track trigram usage in the cycle
        if (!this.encounterState.trigramCycleUsed) {
            this.encounterState.trigramCycleUsed = new Set();
        }
        this.encounterState.trigramCycleUsed.add(15); // Gam (☵) page ID
        
        // Restore 2 Light
        if (!this.encounterState.lightRefundThisScene) {
            this.encounterState.lightRefundThisScene = 0;
        }
        this.encounterState.lightRefundThisScene += 2;
        
        // Update CURRENT LIGHT to reflect the refund
        if (typeof this.updateCurrentLight === 'function') {
            this.updateCurrentLight();
        }
        
        // Remove Gam (☵) from dice assignments immediately after use
        if (this.encounterState && this.encounterState.diceAssignments) {
            // Find and remove the Gam (☵) assignment
            for (let [diceIndex, assignment] of this.encounterState.diceAssignments.entries()) {
                if (assignment.pageId === 15) { // Gam (☵) page ID
                    this.encounterState.diceAssignments.delete(diceIndex);
                    console.log(`Removed Gam (☵) from dice slot ${diceIndex}`);
                    
                    // Update visual state to show the dice slot as empty
                    this.updateDiceVisualState([]);
                    break;
                }
            }
        }
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
    };

    // Render current status effects into the Status Effects box
    CharacterManager.prototype.updateStatusEffectsDisplay = function() {
        try {
            const listEl = document.getElementById('statusEffectsList');
            if (!listEl) return;
            listEl.innerHTML = '';
            // Warning used level indicator (1/2/3) using Warning.png
            try {
                const lvl = Math.max(0, Number(this.encounterState?.warningUsedLevel) || 0);
                if (lvl > 0) {
                    const item = document.createElement('div');
                    item.className = 'status-effect-item';
                    const icon = document.createElement('span');
                    icon.className = 'status-icon effect-warning';
                    item.appendChild(icon);
                    const text = document.createElement('span');
                    text.className = 'status-value';
                    text.textContent = `${lvl}`;
                    text.style.transform = 'translate(-38px, 10px)';
                    text.style.display = 'inline-block';
                    item.appendChild(text);
                    this.attachStatusEffectHoverHandlers(item, 'effect-warning', lvl, `Level ${lvl}/3`);
                    listEl.appendChild(item);
                }
            } catch (e) { /* non-fatal */ }
            // (Temp Shield display moved to HP bar)
            // Burn (Potency and Count)
            try {
                const burnPot = Math.max(0, Number(this.encounterState?.burnPotency) || 0);
                const burnCnt = Math.max(0, Number(this.encounterState?.burnCount) || 0);
                if (burnPot > 0 && burnCnt > 0) {
                    const item = document.createElement('div');
                    item.className = 'status-effect-item';
                    const icon = document.createElement('span');
                    icon.className = 'status-icon effect-burn';
                    item.appendChild(icon);
                    if (burnPot > 0) {
                        const potSpan = document.createElement('span');
                        potSpan.className = 'status-value';
                        potSpan.textContent = String(burnPot);
                        item.appendChild(potSpan);
                    }
                    if (burnCnt > 0) {
                        const cntSpan = document.createElement('span');
                        cntSpan.className = 'status-value';
                        cntSpan.textContent = String(burnCnt);
                        cntSpan.style.transform = 'translate(-30px, 10px)';
                        cntSpan.style.display = 'inline-block';
                        item.appendChild(cntSpan);
                    }
                    this.attachStatusEffectHoverHandlers(item, 'effect-burn', null, `Potency: ${burnPot}, Count: ${burnCnt}`);
                    listEl.appendChild(item);
                }
            } catch (e) { /* non-fatal */ }
            // Tremor 
            try {
                const tremorPot = Math.max(0, Number(this.encounterState?.tremorPotency) || 0);
                if (tremorPot > 0) {
                    const item = document.createElement('div');
                    item.className = 'status-effect-item';
                    const icon = document.createElement('span');
                    icon.className = 'status-icon effect-tremor';
                    //Clickable to trigger Tremor Burst 
                    icon.style.cursor = 'pointer';
                    icon.addEventListener('click', () => {
                        if (typeof this.triggerTremorBurstOnUse === 'function') this.triggerTremorBurstOnUse();
                    });
                    item.appendChild(icon);
                    const potSpan = document.createElement('span');
                    potSpan.className = 'status-value';
                    potSpan.textContent = String(tremorPot);
                    item.appendChild(potSpan);
                    this.attachStatusEffectHoverHandlers(item, 'effect-tremor', tremorPot);
                    listEl.appendChild(item);
                }
            } catch (e) { /* non-fatal */ }
            // Tremor - Execution (Potency only) - clickable to trigger Tremor Burst threshold effect
            try {
                const execPot = Math.max(0, Number(this.encounterState?.tremorExecutionPotency) || 0);
                if (execPot > 0) {
                    const item = document.createElement('div');
                    item.className = 'status-effect-item';
                    const icon = document.createElement('span');
                    icon.className = 'status-icon effect-tremor-execution';
                    icon.style.cursor = 'pointer';
                    icon.title = 'Trigger Tremor Burst (Execution)';
                    icon.addEventListener('click', () => {
                        if (typeof this.triggerTremorBurst === 'function') this.triggerTremorBurst();
                    });
                    item.appendChild(icon);
                    const potSpan = document.createElement('span');
                    potSpan.className = 'status-value';
                    potSpan.textContent = String(execPot);
                    item.appendChild(potSpan);
                    
                    // Add scene count if Tremor Burst threshold is active
                    const currentScene = (typeof this.encounterState?.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
                    const expireAt = Number(this.encounterState?.tremorExecutionThresholdExpiresScene) || 0;
                    const thresholdPercent = Number(this.encounterState?.tremorExecutionThresholdPercent) || 0;
                    
                    // Check if threshold has expired and clear it if so
                    if (expireAt > 0 && currentScene >= expireAt) {
                        delete this.encounterState.tremorExecutionThresholdPercent;
                        delete this.encounterState.tremorExecutionThresholdExpiresScene;
                        delete this.encounterState.tremorExecutionTriggered;
                    }
                    
                    if (expireAt > 0 && currentScene < expireAt && thresholdPercent > 0) {
                        const scenesRemaining = expireAt - currentScene;
                        const cntSpan = document.createElement('span');
                        cntSpan.className = 'status-value';
                        cntSpan.textContent = String(scenesRemaining);
                        cntSpan.style.transform = 'translate(-30px, 10px)';
                        cntSpan.style.display = 'inline-block';
                        item.appendChild(cntSpan);
                        this.attachStatusEffectHoverHandlers(item, 'effect-tremor-execution', execPot, `Potency: ${execPot}, Scenes remaining: ${scenesRemaining}`);
                    } else {
                        this.attachStatusEffectHoverHandlers(item, 'effect-tremor-execution', execPot);
                    }
                    listEl.appendChild(item);
                }
            } catch (e) { /* non-fatal */ }
            // Bleed (Potency and Count)
            try {
                const bleedPot = Math.max(0, Number(this.encounterState?.bleedPotency) || 0);
                const bleedCnt = Math.max(0, Number(this.encounterState?.bleedCount) || 0);
                if (bleedPot > 0 && bleedCnt > 0) {
                    const item = document.createElement('div');
                    item.className = 'status-effect-item';
                    const icon = document.createElement('span');
                    icon.className = 'status-icon effect-bleed';
                    item.appendChild(icon);
                    const potSpan = document.createElement('span');
                    potSpan.className = 'status-value';
                    potSpan.textContent = String(bleedPot);
                    item.appendChild(potSpan);
                    const cntSpan = document.createElement('span');
                    cntSpan.className = 'status-value';
                    cntSpan.textContent = String(bleedCnt);
                    cntSpan.style.transform = 'translate(-30px, 10px)';
                    cntSpan.style.display = 'inline-block';
                    item.appendChild(cntSpan);
                    this.attachStatusEffectHoverHandlers(item, 'effect-bleed', null, `Potency: ${bleedPot}, Count: ${bleedCnt}`);
                    listEl.appendChild(item);
                }
            } catch (e) { /* non-fatal */ }
            // Rupture (Potency and Count) - clickable
            try {
                const rupturePot = Math.max(0, Number(this.encounterState?.rupturePotency) || 0);
                const ruptureCnt = Math.max(0, Number(this.encounterState?.ruptureCount) || 0);
                if (rupturePot > 0 && ruptureCnt > 0) {
                    const item = document.createElement('div');
                    item.className = 'status-effect-item';
                    const icon = document.createElement('span');
                    icon.className = 'status-icon effect-rupture';
                    icon.style.cursor = 'pointer';
                    icon.addEventListener('click', () => {
                        if (typeof this.triggerRupture === 'function') this.triggerRupture();
                    });
                    item.appendChild(icon);
                    const potSpan = document.createElement('span');
                    potSpan.className = 'status-value';
                    potSpan.textContent = String(rupturePot);
                    item.appendChild(potSpan);
                    const cntSpan = document.createElement('span');
                    cntSpan.className = 'status-value';
                    cntSpan.textContent = String(ruptureCnt);
                    cntSpan.style.transform = 'translate(-30px, 10px)';
                    cntSpan.style.display = 'inline-block';
                    item.appendChild(cntSpan);
                    this.attachStatusEffectHoverHandlers(item, 'effect-rupture', null, `Potency: ${rupturePot}, Count: ${ruptureCnt}`);
                    listEl.appendChild(item);
                }
            } catch (e) { /* non-fatal */ }
            // Sinking (Potency and Count) - clickable
            try {
                const sinkingPot = Math.max(0, Number(this.encounterState?.sinkingPotency) || 0);
                const sinkingCnt = Math.max(0, Number(this.encounterState?.sinkingCount) || 0);
                if (sinkingPot > 0 && sinkingCnt > 0) {
                    const item = document.createElement('div');
                    item.className = 'status-effect-item';
                    const icon = document.createElement('span');
                    icon.className = 'status-icon effect-sinking';
                    icon.style.cursor = 'pointer';
                    icon.addEventListener('click', () => {
                        if (typeof this.triggerSinking === 'function') this.triggerSinking();
                    });
                    item.appendChild(icon);
                    const potSpan = document.createElement('span');
                    potSpan.className = 'status-value';
                    potSpan.textContent = String(sinkingPot);
                    item.appendChild(potSpan);
                    const cntSpan = document.createElement('span');
                    cntSpan.className = 'status-value';
                    cntSpan.textContent = String(sinkingCnt);
                    cntSpan.style.transform = 'translate(-30px, 10px)';
                    cntSpan.style.display = 'inline-block';
                    item.appendChild(cntSpan);
                    this.attachStatusEffectHoverHandlers(item, 'effect-sinking', null, `Potency: ${sinkingPot}, Count: ${sinkingCnt}`);
                    listEl.appendChild(item);
                }
            } catch (e) { /* non-fatal */ }
            // Ignite Weaponry Cooldown
            try {
                const currentScene = (typeof this.encounterState?.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
                const cooldownUntil = typeof this.encounterState?.igniteWeaponryCooldownUntilScene === 'number' ? this.encounterState.igniteWeaponryCooldownUntilScene : 0;
                if (currentScene < cooldownUntil && cooldownUntil > 0) {
                    const item = document.createElement('div');
                    item.className = 'status-effect-item';
                    const icon = document.createElement('span');
                    icon.className = 'status-icon effect-ignite-weaponry';
                    item.appendChild(icon);
                    const cooldownSpan = document.createElement('span');
                    cooldownSpan.className = 'status-value';
                    const scenesRemaining = cooldownUntil - currentScene;
                    cooldownSpan.textContent = String(scenesRemaining);
                    item.appendChild(cooldownSpan);
                    this.attachStatusEffectHoverHandlers(item, 'effect-ignite-weaponry', scenesRemaining, `Scenes remaining: ${scenesRemaining}`);
                    listEl.appendChild(item);
                }
            } catch (e) { /* non-fatal */ }
            // Ammo/Bullets
            const bulletsRemaining = Number(this.encounterState?.bulletsRemaining) || 0;
            if (bulletsRemaining > 0) {
                const ammoItem = document.createElement('div');
                ammoItem.className = 'status-effect-item';
                const ammoIcon = document.createElement('span');
                ammoIcon.className = 'status-icon effect-ammo';
                const ammoVal = document.createElement('span');
                ammoVal.className = 'status-value';
                ammoVal.textContent = String(bulletsRemaining);
                ammoItem.appendChild(ammoIcon);
                ammoItem.appendChild(ammoVal);
                this.attachStatusEffectHoverHandlers(ammoItem, 'effect-ammo', bulletsRemaining);
                listEl.appendChild(ammoItem);
            }
            // Thumb Ammunition indicator (prepared type for this scene)
            try {
                const ammoId = Number(this.encounterState?.thumbAmmoTypeThisScene) || 0;
                const ammoCount = Number(this.encounterState?.thumbAmmoUseCountThisScene) || 0;
                if (ammoId === 102 || ammoId === 103 || ammoId === 104 || ammoId === 105) {
                    const item = document.createElement('div');
                    item.className = 'status-effect-item';
                    let effectClassForTooltip = 'effect-thumb-ammo';
                    if (ammoId === 102) {
                        // Shock: Paralysis bg + Ammo front
                        const bg = document.createElement('span');
                        bg.className = 'status-icon thumb-ammo-shock-bg';
                        const fg = document.createElement('span');
                        fg.className = 'status-icon thumb-ammo-shock-fg';
                        item.appendChild(bg);
                        item.appendChild(fg);
                        effectClassForTooltip = 'effect-thumb-ammo-shock';
                    } else if (ammoId === 105) {
                        // Frost: Ice bg + BlueAmmo front
                        const bg = document.createElement('span');
                        bg.className = 'status-icon thumb-ammo-frost-bg';
                        const fg = document.createElement('span');
                        fg.className = 'status-icon thumb-ammo-frost-fg';
                        item.appendChild(bg);
                        item.appendChild(fg);
                        effectClassForTooltip = 'effect-thumb-ammo-frost';
                    } else if (ammoId === 104) {
                        // Armor-Piercing: AimBG bg + PulverisationRound front
                        const bg = document.createElement('span');
                        bg.className = 'status-icon thumb-ammo-ap-bg';
                        const fg = document.createElement('span');
                        fg.className = 'status-icon thumb-ammo-ap-fg';
                        item.appendChild(bg);
                        item.appendChild(fg);
                        effectClassForTooltip = 'effect-thumb-ammo-ap';
                    } else if (ammoId === 103) {
                        // Incendiary: single icon
                        const icon = document.createElement('span');
                        icon.className = 'status-icon thumb-ammo-incendiary';
                        item.appendChild(icon);
                        effectClassForTooltip = 'effect-thumb-ammo-incendiary';
                    }
                    if (ammoCount > 0) {
                        const cnt = document.createElement('span');
                        cnt.className = 'status-value';
                        cnt.textContent = String(ammoCount);
                        cnt.style.transform = 'translate(-30px, 10px)';
                        cnt.style.display = 'inline-block';
                        item.appendChild(cnt);
                    }
                    this.attachStatusEffectHoverHandlers(item, effectClassForTooltip, ammoCount);
                    listEl.appendChild(item);
                }
            } catch (e) { /* non-fatal */ }
            // Zwei Defensive Stance indicator (no numeric value)
            if (this.encounterState && this.encounterState.zweiDefensiveStanceActive === true) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-zwei-defensive';
                item.appendChild(icon);
                this.attachStatusEffectHoverHandlers(item, 'effect-zwei-defensive');
                listEl.appendChild(item);
            }
            // Augury Infusion protection indicator (no numeric value)
            if (this.encounterState && this.encounterState.auguryInfusionProtectionEnabled === true) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-augury-infusion';
                item.appendChild(icon);
                this.attachStatusEffectHoverHandlers(item, 'effect-augury-infusion');
                listEl.appendChild(item);
            }
            // Faith of the Promised Land indicators
            if (this.encounterState && this.encounterState.fatesSealedIndicator === true) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-fates-sealed';
                item.appendChild(icon);
                // Show the last 1d6 roll as a numeric value on the status
                const rollVal = Number(this.encounterState.fatesSealedRoll);
                if (Number.isFinite(rollVal)) {
                    const valSpan = document.createElement('span');
                    valSpan.className = 'status-value';
                    valSpan.textContent = String(rollVal);
                    valSpan.style.transform = 'translate(-30px, 10px)';
                    valSpan.style.display = 'inline-block';
                    item.appendChild(valSpan);
                }
                this.attachStatusEffectHoverHandlers(item, 'effect-fates-sealed', rollVal);
                listEl.appendChild(item);
            }
            // Smell of Fear indicator (no numeric value)
            if (this.encounterState && this.encounterState.smellOfFearActive === true) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-smelloffear';
                item.appendChild(icon);
                this.attachStatusEffectHoverHandlers(item, 'effect-smelloffear');
                listEl.appendChild(item);
            }
            // Trigram usage indicators 
            try {
                const cycle = this.encounterState?.trigramCycleUsed;
                const used = new Set();
                if (cycle instanceof Set) {
                    cycle.forEach(id => used.add(id));
                } else if (Array.isArray(cycle)) {
                    cycle.forEach(id => used.add(id));
                }
                const trigramEntries = [
                    { id: 13, cls: 'effect-trigram-geon' },
                    { id: 14, cls: 'effect-trigram-gon' },
                    { id: 15, cls: 'effect-trigram-gam' },
                    { id: 16, cls: 'effect-trigram-gi' }
                ];
                trigramEntries.forEach(t => {
                    if (used.has(t.id)) {
                        const item = document.createElement('div');
                        item.className = 'status-effect-item';
                        const icon = document.createElement('span');
                        icon.className = `status-icon ${t.cls}`;
                        item.appendChild(icon);
                        this.attachStatusEffectHoverHandlers(item, t.cls);
                        listEl.appendChild(item);
                    }
                });
            } catch (e) { /* non-fatal */ }
            const power = (this.encounterState && typeof this.encounterState.powerUpThisScene === 'number') ? this.encounterState.powerUpThisScene : 0;
            if (power > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-powerup';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(power);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-powerup', power);
                listEl.appendChild(item);
            }
            // Attack Power Up (separate buff)
            const atkPower = (this.encounterState && typeof this.encounterState.attackPowerUpThisScene === 'number') ? this.encounterState.attackPowerUpThisScene : 0;
            if (atkPower > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-attackpowerup';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(atkPower);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-attackpowerup', atkPower);
                listEl.appendChild(item);
            }
            // Bravery (grants 10 Attack Power Up)
            const bravery = (this.encounterState && this.encounterState.braveryActiveThisScene === true) ? true : false;
            if (bravery) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-bravery';
                item.appendChild(icon);
                this.attachStatusEffectHoverHandlers(item, 'effect-bravery', null);
                listEl.appendChild(item);
            }
            // Charge (Potency)
            const chargePot = (this.encounterState && typeof this.encounterState.chargePotencyThisScene === 'number') ? this.encounterState.chargePotencyThisScene : 0;
            if (chargePot > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-charge';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(chargePot);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-charge', chargePot);
                listEl.appendChild(item);
            }
            // Defense Power Up
            const defPower = (this.encounterState && typeof this.encounterState.defensePowerUpThisScene === 'number') ? this.encounterState.defensePowerUpThisScene : 0;
            if (defPower > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-defensepowerup';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(defPower);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-defensepowerup', defPower);
                listEl.appendChild(item);
            }
            const slashUp = (this.encounterState && typeof this.encounterState.slashDmgUpThisScene === 'number') ? this.encounterState.slashDmgUpThisScene : 0;
            if (slashUp > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-slashdmgup';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(slashUp);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-slashdmgup', slashUp);
                listEl.appendChild(item);
            }
            const pierceUp = (this.encounterState && typeof this.encounterState.pierceDmgUpThisScene === 'number') ? this.encounterState.pierceDmgUpThisScene : 0;
            if (pierceUp > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-piercedmgup';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(pierceUp);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-piercedmgup', pierceUp);
                listEl.appendChild(item);
            }
            const bluntUp = (this.encounterState && typeof this.encounterState.bluntDmgUpThisScene === 'number') ? this.encounterState.bluntDmgUpThisScene : 0;
            if (bluntUp > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-bluntdmgup';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(bluntUp);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-bluntdmgup', bluntUp);
                listEl.appendChild(item);
            }
            // Modified K Corp Ampule stacks
            const ampStacks = Number(this.encounterState?.modifiedAmpuleStacks) || 0;
            if (ampStacks > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-modified-ampule';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(ampStacks);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-modified-ampule', ampStacks);
                listEl.appendChild(item);
            }
            
            // Debuff statuses
            // Slash DMG Down
            const slashDown = (this.encounterState && typeof this.encounterState.slashDmgDownThisScene === 'number') ? this.encounterState.slashDmgDownThisScene : 0;
            if (slashDown > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-slashdmgdown';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(slashDown);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-slashdmgdown', slashDown);
                listEl.appendChild(item);
            }
            // Pierce DMG Down
            const pierceDown = (this.encounterState && typeof this.encounterState.pierceDmgDownThisScene === 'number') ? this.encounterState.pierceDmgDownThisScene : 0;
            if (pierceDown > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-piercedmgdown';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(pierceDown);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-piercedmgdown', pierceDown);
                listEl.appendChild(item);
            }
            // Blunt DMG Down
            const bluntDown = (this.encounterState && typeof this.encounterState.bluntDmgDownThisScene === 'number') ? this.encounterState.bluntDmgDownThisScene : 0;
            if (bluntDown > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-bluntdmgdown';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(bluntDown);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-bluntdmgdown', bluntDown);
                listEl.appendChild(item);
            }
            // Power Down
            const powerDown = (this.encounterState && typeof this.encounterState.powerDownThisScene === 'number') ? this.encounterState.powerDownThisScene : 0;
            if (powerDown > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-powerdown';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(powerDown);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-powerdown', powerDown);
                listEl.appendChild(item);
            }
            // Attack Power Down
            const attackPowerDown = (this.encounterState && typeof this.encounterState.attackPowerDownThisScene === 'number') ? this.encounterState.attackPowerDownThisScene : 0;
            if (attackPowerDown > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-attackpowerdown';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(attackPowerDown);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-attackpowerdown', attackPowerDown);
                listEl.appendChild(item);
            }
            // Defense Power Down
            const defensePowerDown = (this.encounterState && typeof this.encounterState.defensePowerDownThisScene === 'number') ? this.encounterState.defensePowerDownThisScene : 0;
            if (defensePowerDown > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-defensepowerdown';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(defensePowerDown);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-defensepowerdown', defensePowerDown);
                listEl.appendChild(item);
            }
            // Fragile
            const fragile = (this.encounterState && typeof this.encounterState.fragileThisScene === 'number') ? this.encounterState.fragileThisScene : 0;
            if (fragile > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-fragile';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(fragile);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-fragile', fragile);
                listEl.appendChild(item);
            }
            // Protection 
            const protection = (this.encounterState && typeof this.encounterState.protectionThisScene === 'number') ? this.encounterState.protectionThisScene : 0;
            if (protection > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-protection';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(protection);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-protection', protection);
                listEl.appendChild(item);
            }
            // Declared Duel indicator (no numeric value)
            if (this.encounterState && this.encounterState.declaredDuelActiveThisScene === true) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-declaredduel';
                icon.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    if (typeof this.removeDeclaredDuelThisScene === 'function') {
                        this.removeDeclaredDuelThisScene();
                    }
                });
                item.appendChild(icon);
                this.attachStatusEffectHoverHandlers(item, 'effect-declaredduel');
                listEl.appendChild(item);
            }
            // Focused Attack stacks and tier icon/value
            const focusedStacks = (this.encounterState && typeof this.encounterState.focusedAttackStacks === 'number') ? this.encounterState.focusedAttackStacks : 0;
            if (focusedStacks > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-focusedattack';
                icon.style.cursor = 'pointer';
                icon.addEventListener('click', () => {
                    if (typeof this.removeFocusedAttackThisScene === 'function') this.removeFocusedAttackThisScene();
                });
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(focusedStacks);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-focusedattack', focusedStacks);
                listEl.appendChild(item);
            }
            // Haste
            const haste = (this.encounterState && typeof this.encounterState.hasteThisScene === 'number') ? this.encounterState.hasteThisScene : 0;
            if (haste > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-haste';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(haste);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-haste', haste);
                listEl.appendChild(item);
            }
            // Poise (Potency and Count)
            const poisePot = (this.encounterState && typeof this.encounterState.poisePotencyThisScene === 'number') ? this.encounterState.poisePotencyThisScene : 0;
            const poiseCnt = (this.encounterState && typeof this.encounterState.poiseCountThisScene === 'number') ? this.encounterState.poiseCountThisScene : 0;
            if (poisePot > 0 || poiseCnt > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-poise';
                item.appendChild(icon);
                if (poiseCnt > 0) {
                    const potSpan = document.createElement('span');
                    potSpan.className = 'status-value';
                    potSpan.textContent = String(poisePot);
                    const cntSpan = document.createElement('span');
                    cntSpan.className = 'status-value';
                    cntSpan.textContent = String(poiseCnt);
                    // Shift count left
                    cntSpan.style.transform = 'translate(-30px, 10px)';
                    cntSpan.style.display = 'inline-block';
                    item.appendChild(potSpan);
                    item.appendChild(cntSpan);
                    this.attachStatusEffectHoverHandlers(item, 'effect-poise', null, `Potency: ${poisePot}, Count: ${poiseCnt}`);
                } else {
                    const val = document.createElement('span');
                    val.className = 'status-value';
                    val.textContent = String(poisePot);
                    item.appendChild(val);
                    this.attachStatusEffectHoverHandlers(item, 'effect-poise', poisePot);
                }
                listEl.appendChild(item);
            }
            // Taunt 
            const taunt = (this.encounterState && typeof this.encounterState.tauntThisScene === 'number') ? this.encounterState.tauntThisScene : 0;
            if (taunt > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-taunt';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(taunt);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-taunt', taunt);
                listEl.appendChild(item);
            }
            // Jackpot Count
            try {
                const jackpotCnt = Math.max(0, Number(this.encounterState?.jackpotCountThisScene) || 0);
                if (jackpotCnt > 0) {
                    const item = document.createElement('div');
                    item.className = 'status-effect-item';
                    const icon = document.createElement('span');
                    icon.className = 'status-icon effect-jackpot';
                    const val = document.createElement('span');
                    val.className = 'status-value';
                    val.textContent = String(jackpotCnt);
                    item.appendChild(icon);
                    item.appendChild(val);
                    this.attachStatusEffectHoverHandlers(item, 'effect-jackpot', jackpotCnt);
                    listEl.appendChild(item);
                }
            } catch (e) { /* non-fatal */ }
            // Decay Ampule stacks
            const decayStacks = Number(this.encounterState?.decayAmpuleStacks) || 0;
            if (decayStacks > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-decay-ampule';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(decayStacks);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-decay-ampule', decayStacks);
                listEl.appendChild(item);
            }
            // Panic Level status effects (Nervous, Intimidated, Terrified, Hopeless, Overwhelmed)
            const panicLevel = this.encounterState?.panicLevelThisScene;
            if (panicLevel && ['nervous', 'intimidated', 'terrified', 'hopeless', 'overwhelmed'].includes(panicLevel)) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = `status-icon effect-${panicLevel}`;
                item.appendChild(icon);
                const panicLevelNames = {
                    'nervous': 'Nervous',
                    'intimidated': 'Intimidated',
                    'terrified': 'Terrified',
                    'hopeless': 'Hopeless',
                    'overwhelmed': 'Overwhelmed'
                };
                this.attachStatusEffectHoverHandlers(item, `effect-${panicLevel}`, null, panicLevelNames[panicLevel]);
                listEl.appendChild(item);
            }
            // Calm Level status effects (Calm, Relaxed, Resolved, Optimistic, Persevere)
            const calmLevel = this.encounterState?.calmLevelThisScene;
            if (calmLevel && ['calm', 'relaxed', 'resolved', 'optimistic', 'persevere'].includes(calmLevel)) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = `status-icon effect-${calmLevel}`;
                item.appendChild(icon);
                const calmLevelNames = {
                    'calm': 'Calm',
                    'relaxed': 'Relaxed',
                    'resolved': 'Resolved',
                    'optimistic': 'Optimistic',
                    'persevere': 'Persevere'
                };
                this.attachStatusEffectHoverHandlers(item, `effect-${calmLevel}`, null, calmLevelNames[calmLevel]);
                listEl.appendChild(item);
            }
            // Bind
            const bind = (this.encounterState && typeof this.encounterState.bindThisScene === 'number') ? this.encounterState.bindThisScene : 0;
            if (bind > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-bind';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(bind);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-bind', bind);
                listEl.appendChild(item);
            }
            // Paralysis
            const paralysis = (this.encounterState && typeof this.encounterState.paralysisThisScene === 'number') ? this.encounterState.paralysisThisScene : 0;
            if (paralysis > 0) {
                const item = document.createElement('div');
                item.className = 'status-effect-item';
                const icon = document.createElement('span');
                icon.className = 'status-icon effect-paralysis';
                const val = document.createElement('span');
                val.className = 'status-value';
                val.textContent = String(paralysis);
                item.appendChild(icon);
                item.appendChild(val);
                this.attachStatusEffectHoverHandlers(item, 'effect-paralysis', paralysis);
                listEl.appendChild(item);
            }
        } catch (e) {
            console.warn('updateStatusEffectsDisplay failed:', e);
        }
    };

    // Apply HP damage with Temp Shield absorption
    CharacterManager.prototype.applyHpDamage = function(amount, reason = '') {
        try {
            if (!Number.isFinite(amount) || amount <= 0) return 0;
            if (!this.encounterState) this.encounterState = {};
            let remaining = Math.max(0, Math.floor(amount));
            let absorbed = 0;
            // Consume shield first
            const curShield = Math.max(0, Number(this.encounterState.tempShieldHp) || 0);
            if (curShield > 0) {
                absorbed = Math.min(curShield, remaining);
                this.encounterState.tempShieldHp = Math.max(0, curShield - absorbed);
                remaining -= absorbed;
            }
            if (absorbed > 0) {
                this.showNotification(`Shield absorbed ${absorbed} damage${reason ? ` (${reason})` : ''}.`, 'info');
            }
            if (remaining > 0) {
                const curHpEl = document.getElementById('currentHp');
                const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                if (Number.isFinite(curHp)) {
                    const newHp = Math.max(0, curHp - remaining);
                    curHpEl.value = newHp;
                }
            }
            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
            // Check for Tremor - Execution threshold execution
            if (typeof this.checkTremorExecutionThreshold === 'function') this.checkTremorExecutionThreshold();
            return absorbed;
        } catch (e) { /* non-fatal */ return 0; }
    };

    // Update bullet count by re-rendering status effects (includes ammo tile)
    CharacterManager.prototype.updateBulletStatusDisplay = function() {
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
    };

    // Add Burn stacks (potency and count). Potency is the fixed damage dealt at end of scene.
    // Count is the number of scene-end ticks remaining.
    CharacterManager.prototype.addBurn = function(potencyDelta = 0, countDelta = 0) {
        if (!this.encounterState) this.encounterState = {};
        const curPot = Math.max(0, Number(this.encounterState.burnPotency) || 0);
        const curCnt = Math.max(0, Number(this.encounterState.burnCount) || 0);
        const nextPot = Math.max(0, curPot + (Number.isFinite(potencyDelta) ? potencyDelta : 0));
        const nextCnt = Math.max(0, curCnt + (Number.isFinite(countDelta) ? countDelta : 0));
        this.encounterState.burnPotency = nextPot;
        this.encounterState.burnCount = nextCnt;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return { potency: nextPot, count: nextCnt };
    };

    // Add Tremor (potency only). On getting staggered, deal fixed HP damage equal to potency.
    // If Tremor - Execution is already present, any new Tremor Potency is converted into Execution Potency instead.
    CharacterManager.prototype.addTremor = function(potencyDelta = 0) {
        if (!this.encounterState) this.encounterState = {};
        const hasExec = Math.max(0, Number(this.encounterState.tremorExecutionPotency) || 0) > 0;
        if (hasExec && Number.isFinite(potencyDelta) && potencyDelta > 0) {
            return this.addTremorExecution(potencyDelta);
        }
        const curPot = Math.max(0, Number(this.encounterState.tremorPotency) || 0);
        const nextPot = Math.max(0, curPot + (Number.isFinite(potencyDelta) ? potencyDelta : 0));
        this.encounterState.tremorPotency = nextPot;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return nextPot;
    };

    // Add Tremor - Execution (potency only). When inflicted, convert existing Tremor Potency into Execution Potency.
    // If there's an active Tremor Burst threshold, new stacks will increase the threshold.
    CharacterManager.prototype.addTremorExecution = function(potencyDelta = 0) {
        if (!this.encounterState) this.encounterState = {};
        const curExec = Math.max(0, Number(this.encounterState.tremorExecutionPotency) || 0);
        const add = Number.isFinite(potencyDelta) ? potencyDelta : 0;
        const curTremor = Math.max(0, Number(this.encounterState.tremorPotency) || 0);
        // Convert all current Tremor into Execution upon infliction
        let nextExec = curExec + add + curTremor;
        nextExec = Math.max(0, nextExec); 
        this.encounterState.tremorExecutionPotency = nextExec;
        // Clear Tremor after conversion
        this.encounterState.tremorPotency = 0;
        
        // Check if there's an active Tremor Burst threshold and update it
        const currentScene = (typeof this.encounterState?.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
        const expireAt = Number(this.encounterState?.tremorExecutionThresholdExpiresScene) || 0;
        const hasActiveThreshold = expireAt > 0 && currentScene < expireAt;
        
        if (hasActiveThreshold && nextExec > 0) {
            // Recalculate threshold based on new total potency
            const percent = Math.min(100, Math.max(0, nextExec * 0.25));
            this.encounterState.tremorExecutionThresholdPercent = percent;
            
            // Update displays
            if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
            if (typeof this.updateTremorExecutionThresholdMarkers === 'function') this.updateTremorExecutionThresholdMarkers();
            
            // Show notification if potency was actually added
            if (add > 0 || curTremor > 0) {
                const maxHpEl = document.getElementById('maxHp');
                const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                const hpThreshold = Number.isFinite(maxHp) && maxHp > 0 ? Math.ceil((percent / 100) * maxHp) : null;
                let notificationMsg = `Tremor - Execution: Threshold updated to ${percent.toFixed(2)}%`;
                if (hpThreshold !== null) {
                    notificationMsg += ` (${hpThreshold} HP)`;
                }
                this.showNotification(notificationMsg, 'info');
            }
        }
        
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return nextExec;
    };

    // Trigger Tremor Burst: For Tremor - Execution, create an HP threshold equal to Potency x 0.25% of Max HP for 3 scenes.
    CharacterManager.prototype.triggerTremorBurst = function() {
        if (!this.encounterState) return;
        const execPot = Math.max(0, Number(this.encounterState.tremorExecutionPotency) || 0);
        if (execPot <= 0) {
            this.showNotification('Tremor Burst: No Tremor - Execution potency to trigger.', 'info');
            return;
        }
        const currentScene = (typeof this.encounterState.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
        // Each 1 potency = 0.25% max HP
        const percent = Math.min(100, Math.max(0, execPot * 0.25));
        
        // Calculate actual HP threshold value for display
        const maxHpEl = document.getElementById('maxHp');
        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
        const hpThreshold = Number.isFinite(maxHp) && maxHp > 0 ? Math.ceil((percent / 100) * maxHp) : null;
        
        this.encounterState.tremorExecutionThresholdPercent = percent;
        this.encounterState.tremorExecutionThresholdExpiresScene = currentScene + 3;
        // Reset execution flag when setting a new threshold
        this.encounterState.tremorExecutionTriggered = false;
        
        // haha funny Tremor Burst 
        try {
            const tremorBurstAudio = new Audio('Other Stuff/tremor burst sound.mp3');
            tremorBurstAudio.play().catch(e => console.warn('Could not play Tremor Burst audio:', e));
        } catch (e) {
            console.warn('Could not create Tremor Burst audio:', e);
        }
        
        if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        if (typeof this.updateTremorExecutionThresholdMarkers === 'function') this.updateTremorExecutionThresholdMarkers();
        
        // Show detailed notification with potency used and threshold info
        let notificationMsg = `Tremor Burst: Used ${execPot} Tremor - Execution Potency. Execution threshold set at ${percent.toFixed(2)}%`;
        if (hpThreshold !== null) {
            notificationMsg += ` (${hpThreshold} HP)`;
        }
        notificationMsg += ` for 3 scenes.`;
        this.showNotification(notificationMsg, 'success');
    };

    // Update Tremor - Execution threshold marker on HP bar
    CharacterManager.prototype.updateTremorExecutionThresholdMarkers = function() {
        try {
            const redMarker = document.getElementById('tremorThresholdRed');
            
            if (!redMarker) return;

            // Check if threshold is active
            const currentScene = (typeof this.encounterState?.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
            const expireAt = Number(this.encounterState?.tremorExecutionThresholdExpiresScene) || 0;
            const thresholdPercent = Number(this.encounterState?.tremorExecutionThresholdPercent) || 0;
            
            // Check if threshold has expired and clear it if so
            if (expireAt > 0 && currentScene >= expireAt) {
                delete this.encounterState.tremorExecutionThresholdPercent;
                delete this.encounterState.tremorExecutionThresholdExpiresScene;
                delete this.encounterState.tremorExecutionTriggered;
                redMarker.style.display = 'none';
                return;
            }
            
            const isActive = thresholdPercent > 0 && expireAt > 0 && currentScene < expireAt;
            
            if (isActive && thresholdPercent > 0) {
                // Get Max HP to calculate actual HP threshold value
                const maxHpEl = document.getElementById('maxHp');
                const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
                
                // Position red marker at the threshold percentage (from left)
                const redPosition = Math.max(0, Math.min(100, thresholdPercent));
                redMarker.style.left = `${redPosition}%`;
                redMarker.style.display = 'flex';
                
                // Update red marker label to show HP value instead of percentage
                const redLabel = redMarker.querySelector('.threshold-label');
                if (redLabel) {
                    if (Number.isFinite(maxHp) && maxHp > 0) {
                        // Calculate actual HP value at threshold
                        const hpThreshold = (thresholdPercent / 100) * maxHp;
                        redLabel.textContent = hpThreshold.toFixed(1);
                    } else {
                        // Fallback to percentage if Max HP not available
                        redLabel.textContent = thresholdPercent.toFixed(1);
                    }
                }
            } else {
                // Hide marker if threshold is not active
                redMarker.style.display = 'none';
            }
        } catch (e) {
            console.warn('updateTremorExecutionThresholdMarkers failed:', e);
        }
    };

    // Check if Tremor - Execution threshold has been reached and execute target if so (once)
    CharacterManager.prototype.checkTremorExecutionThreshold = function() {
        try {
            if (!this.encounterState) return;
            
            // Check if threshold is active and execution hasn't already occurred
            const currentScene = (typeof this.encounterState?.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
            const expireAt = Number(this.encounterState?.tremorExecutionThresholdExpiresScene) || 0;
            const thresholdPercent = Number(this.encounterState?.tremorExecutionThresholdPercent) || 0;
            const executionTriggered = this.encounterState?.tremorExecutionTriggered === true;
            
            const isActive = thresholdPercent > 0 && expireAt > 0 && currentScene < expireAt;
            
            // Only check if threshold is active and execution hasn't been triggered yet
            if (!isActive || executionTriggered) return;
            
            // Get current HP and Max HP
            const maxHpEl = document.getElementById('maxHp');
            const currentHpEl = document.getElementById('currentHp');
            const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
            const currentHp = currentHpEl ? parseInt(currentHpEl.value, 10) : NaN;
            
            if (!Number.isFinite(maxHp) || !Number.isFinite(currentHp) || maxHp <= 0) return;
            
            // Calculate current HP percentage
            const currentHpPercent = (currentHp / maxHp) * 100;
            
            // Check if current HP has reached or fallen below the threshold
            if (currentHpPercent <= thresholdPercent) {
                // Execute the target: set HP to 0
                currentHpEl.value = 0;
                
                // Mark execution as triggered (once)
                this.encounterState.tremorExecutionTriggered = true;
                
                // Clear the threshold (execution has occurred)
                delete this.encounterState.tremorExecutionThresholdPercent;
                delete this.encounterState.tremorExecutionThresholdExpiresScene;
                
                // Update displays
                if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                if (typeof this.updateTremorExecutionThresholdMarkers === 'function') this.updateTremorExecutionThresholdMarkers();
                
                // Show execution notification
                this.showNotification(`Tremor - Execution: Target executed! HP reached threshold (${thresholdPercent.toFixed(1)}%).`, 'warning');
            }
        } catch (e) {
            console.warn('checkTremorExecutionThreshold failed:', e);
        }
    };

    // Trigger Tremor Burst [On Use]: Use up all Tremor Potency, dealing damage to target's Max SP first, then excess to Max HP
    CharacterManager.prototype.triggerTremorBurstOnUse = function() {
        if (!this.encounterState) return;
        const tremorPot = Math.max(0, Number(this.encounterState.tremorPotency) || 0);
        if (tremorPot <= 0) {
            this.showNotification('Tremor Burst: No Tremor Potency to trigger.', 'info');
            return;
        }

         // haha funny Tremor Burst 
        try {
            const tremorBurstAudio = new Audio('Other Stuff/tremor burst sound.mp3');
            tremorBurstAudio.play().catch(e => console.warn('Could not play Tremor Burst audio:', e));
        } catch (e) {
            console.warn('Could not create Tremor Burst audio:', e);
        }

        // Get target's Max SP and Max HP
        const maxSpEl = document.getElementById('maxSp');
        const maxHpEl = document.getElementById('maxHp');
        const currentSpEl = document.getElementById('currentSp');
        const currentHpEl = document.getElementById('currentHp');

        const maxSp = maxSpEl ? parseInt(maxSpEl.textContent, 10) : NaN;
        const maxHp = maxHpEl ? parseInt(maxHpEl.textContent, 10) : NaN;
        const currentSp = currentSpEl ? parseInt(currentSpEl.value, 10) : NaN;
        const currentHp = currentHpEl ? parseInt(currentHpEl.value, 10) : NaN;

        if (!Number.isFinite(maxSp) || !Number.isFinite(maxHp) || !Number.isFinite(currentSp) || !Number.isFinite(currentHp)) {
            this.showNotification('Tremor Burst: Cannot access target stats.', 'warning');
            return;
        }

        // Calculate damage distribution: deal damage to SP first (up to Max SP), then excess to HP
        let spDamageDealt = 0;
        let hpDamageDealt = 0;
        let remainingDamage = tremorPot;

        // Apply damage to SP first (up to Max SP worth, or current SP if less)
        const maxSpDamage = Math.min(tremorPot, maxSp);
        if (remainingDamage > 0 && maxSpDamage > 0 && currentSp > 0) {
            spDamageDealt = Math.min(maxSpDamage, currentSp);
            const newSp = Math.max(0, currentSp - spDamageDealt);
            currentSpEl.value = newSp;
            remainingDamage -= spDamageDealt;
        } else {
            // If no SP damage can be dealt (e.g., Tremor Potency exceeds Max SP), skip SP and go to HP
            remainingDamage = tremorPot;
        }

        // Apply excess damage to HP
        if (remainingDamage > 0) {
            hpDamageDealt = remainingDamage;
            if (typeof this.applyHpDamage === 'function') {
                this.applyHpDamage(hpDamageDealt, 'Tremor Burst');
            } else {
                const newHp = Math.max(0, currentHp - hpDamageDealt);
                currentHpEl.value = newHp;
            }
        }

        // Clear all Tremor Potency
        this.encounterState.tremorPotency = 0;

        // Update displays
        if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();

        // Show notification
        let damageMsg = '';
        if (spDamageDealt > 0 && hpDamageDealt > 0) {
            damageMsg = `Dealt ${spDamageDealt} SP damage and ${hpDamageDealt} HP damage.`;
        } else if (spDamageDealt > 0) {
            damageMsg = `Dealt ${spDamageDealt} SP damage.`;
        } else if (hpDamageDealt > 0) {
            damageMsg = `Dealt ${hpDamageDealt} HP damage.`;
        } else {
            damageMsg = 'No damage dealt (target stats already at minimum).';
        }
        this.showNotification(`Tremor Burst [On Use]: Used ${tremorPot} Tremor Potency. ${damageMsg}`, 'success');
    };

    // Add Bleed stacks (potency and count). Each offensive die causes HP damage equal to potency and decrements count.
    CharacterManager.prototype.addBleed = function(potencyDelta = 0, countDelta = 0) {
        if (!this.encounterState) this.encounterState = {};
        const curPot = Math.max(0, Number(this.encounterState.bleedPotency) || 0);
        const curCnt = Math.max(0, Number(this.encounterState.bleedCount) || 0);
        const nextPot = Math.max(0, curPot + (Number.isFinite(potencyDelta) ? potencyDelta : 0));
        const nextCnt = Math.max(0, Math.min(99, curCnt + (Number.isFinite(countDelta) ? countDelta : 0)));
        this.encounterState.bleedPotency = nextPot;
        this.encounterState.bleedCount = nextCnt;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return { potency: nextPot, count: nextCnt };
    };

    // Add Rupture stacks (potency and count). When clicked, take HP damage equal to potency and decrement count.
    CharacterManager.prototype.addRupture = function(potencyDelta = 0, countDelta = 0) {
        if (!this.encounterState) this.encounterState = {};
        const curPot = Math.max(0, Number(this.encounterState.rupturePotency) || 0);
        const curCnt = Math.max(0, Number(this.encounterState.ruptureCount) || 0);
        const nextPot = Math.max(0, curPot + (Number.isFinite(potencyDelta) ? potencyDelta : 0));
        const nextCnt = Math.max(0, Math.min(99, curCnt + (Number.isFinite(countDelta) ? countDelta : 0)));
        this.encounterState.rupturePotency = nextPot;
        this.encounterState.ruptureCount = nextCnt;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return { potency: nextPot, count: nextCnt };
    };

    // Trigger Rupture on click: take damage equal to ninety and decrement count
    CharacterManager.prototype.triggerRupture = function() {
        if (!this.encounterState) return;
        const rupturePot = Math.max(0, Number(this.encounterState.rupturePotency) || 0);
        let ruptureCnt = Math.max(0, Number(this.encounterState.ruptureCount) || 0);
        if (rupturePot > 0 && ruptureCnt > 0) {
            const curHpEl = document.getElementById('currentHp');
            const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
            if (Number.isFinite(curHp)) {
                if (typeof this.applyHpDamage === 'function') {
                    this.applyHpDamage(rupturePot, 'Rupture');
                } else {
                    const newHp = Math.max(0, curHp - rupturePot);
                    curHpEl.value = newHp;
                }
                ruptureCnt = Math.max(0, ruptureCnt - 1);
                this.encounterState.ruptureCount = ruptureCnt;
                if (ruptureCnt === 0) this.encounterState.rupturePotency = 0;
                if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                this.showNotification(`Rupture: Took ${rupturePot} fixed HP damage. (${ruptureCnt} remaining)`, 'warning');
            }
        }
    };

    // Add Sinking stacks (potency and count). When clicked, take SP damage (or fixed HP if SP is 0) and decrement count.
    CharacterManager.prototype.addSinking = function(potencyDelta = 0, countDelta = 0) {
        if (!this.encounterState) this.encounterState = {};
        const curPot = Math.max(0, Number(this.encounterState.sinkingPotency) || 0);
        const curCnt = Math.max(0, Number(this.encounterState.sinkingCount) || 0);
        const nextPot = Math.max(0, curPot + (Number.isFinite(potencyDelta) ? potencyDelta : 0));
        const nextCnt = Math.max(0, Math.min(99, curCnt + (Number.isFinite(countDelta) ? countDelta : 0)));
        this.encounterState.sinkingPotency = nextPot;
        this.encounterState.sinkingCount = nextCnt;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return { potency: nextPot, count: nextCnt };
    };

    // Trigger Sinking on click: take SP damage equal to potency, or fixed HP if SP is 0, and decrement count
    CharacterManager.prototype.triggerSinking = function() {
        if (!this.encounterState) return;
        const sinkingPot = Math.max(0, Number(this.encounterState.sinkingPotency) || 0);
        let sinkingCnt = Math.max(0, Number(this.encounterState.sinkingCount) || 0);
        if (sinkingPot > 0 && sinkingCnt > 0) {
            const curSpEl = document.getElementById('currentSp');
            const curSp = curSpEl ? parseInt(curSpEl.value, 10) : NaN;
            if (Number.isFinite(curSp)) {
                if (curSp > 0) {
                    // Take SP damage
                    const newSp = Math.max(0, curSp - sinkingPot);
                    curSpEl.value = newSp;
                    sinkingCnt = Math.max(0, sinkingCnt - 1);
                    this.encounterState.sinkingCount = sinkingCnt;
                    if (sinkingCnt === 0) this.encounterState.sinkingPotency = 0;
                    if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                    if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                    this.showNotification(`Sinking: Took ${sinkingPot} SP damage. (${sinkingCnt} remaining)`, 'warning');
                } else {
                    // No SP - take fixed HP damage instead
                    const curHpEl = document.getElementById('currentHp');
                    const curHp = curHpEl ? parseInt(curHpEl.value, 10) : NaN;
                    if (Number.isFinite(curHp)) {
                        if (typeof this.applyHpDamage === 'function') {
                            this.applyHpDamage(sinkingPot, 'Sinking');
                        } else {
                            const newHp = Math.max(0, curHp - sinkingPot);
                            curHpEl.value = newHp;
                        }
                        sinkingCnt = Math.max(0, sinkingCnt - 1);
                        this.encounterState.sinkingCount = sinkingCnt;
                        if (sinkingCnt === 0) this.encounterState.sinkingPotency = 0;
                        if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
                        this.showNotification(`Sinking: No SP - took ${sinkingPot} fixed HP damage instead. (${sinkingCnt} remaining)`, 'warning');
                    }
                }
            }
        }
    };

    // Add Power Up for this scene and clamp between 0 and 10
    // This ensures the status effect "Power Up" never exceeds its defined maximum
    CharacterManager.prototype.addPowerUpThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.powerUpThisScene === 'number') ? this.encounterState.powerUpThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.powerUpThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return next;
    };

    // Add Slash DMG Up for this scene and clamp between 0 and 10
    // Only visual/status tracking for now; damage application intentionally omitted per instruction
    CharacterManager.prototype.addSlashDmgUpThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.slashDmgUpThisScene === 'number') ? this.encounterState.slashDmgUpThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.slashDmgUpThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return next;
    };

    // Add Pierce DMG Up for this scene (0-10)
    CharacterManager.prototype.addPierceDmgUpThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.pierceDmgUpThisScene === 'number') ? this.encounterState.pierceDmgUpThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.pierceDmgUpThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Add Blunt DMG Up for this scene (0-10)
    CharacterManager.prototype.addBluntDmgUpThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.bluntDmgUpThisScene === 'number') ? this.encounterState.bluntDmgUpThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.bluntDmgUpThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Add Slash DMG Down for this scene (0-10)
    CharacterManager.prototype.addSlashDmgDownThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.slashDmgDownThisScene === 'number') ? this.encounterState.slashDmgDownThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.slashDmgDownThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Add Pierce DMG Down for this scene (0-10)
    CharacterManager.prototype.addPierceDmgDownThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.pierceDmgDownThisScene === 'number') ? this.encounterState.pierceDmgDownThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.pierceDmgDownThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Add Blunt DMG Down for this scene (0-10)
    CharacterManager.prototype.addBluntDmgDownThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.bluntDmgDownThisScene === 'number') ? this.encounterState.bluntDmgDownThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.bluntDmgDownThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Add Power Down for this scene (0-10)
    CharacterManager.prototype.addPowerDownThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.powerDownThisScene === 'number') ? this.encounterState.powerDownThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.powerDownThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Add Attack Power Down for this scene (0-10)
    CharacterManager.prototype.addAttackPowerDownThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.attackPowerDownThisScene === 'number') ? this.encounterState.attackPowerDownThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.attackPowerDownThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Add Defense Power Down for this scene (0-10)
    CharacterManager.prototype.addDefensePowerDownThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.defensePowerDownThisScene === 'number') ? this.encounterState.defensePowerDownThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.defensePowerDownThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Add Fragile for this scene (0-10)
    CharacterManager.prototype.addFragileThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.fragileThisScene === 'number') ? this.encounterState.fragileThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.fragileThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Add Protection for this scene and clamp between 0 and 10
    // Visual/status tracking for now; application to damage mitigation is out of scope here
    CharacterManager.prototype.addProtectionThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.protectionThisScene === 'number') ? this.encounterState.protectionThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.protectionThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return next;
    };

    // Add Taunt for this scene and clamp between 0 and 10
    CharacterManager.prototype.addTauntThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.tauntThisScene === 'number') ? this.encounterState.tauntThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.tauntThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return next;
    };

    // Add Bind for this scene and clamp between 0 and 10
    CharacterManager.prototype.addBindThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.bindThisScene === 'number') ? this.encounterState.bindThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.bindThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        // Apply immediately to current displayed speed dice by subtracting the newly added Bind amount
        try {
            const effectiveDelta = Math.max(0, next - current);
            if (effectiveDelta > 0) {
                const hexSlots = document.querySelectorAll('.hexagonal-slots .hex-slot.filled');
                hexSlots.forEach((slot) => {
                    const valAttr = slot.getAttribute('data-dice-value');
                    const curVal = valAttr ? parseInt(valAttr, 10) : NaN;
                    if (!Number.isNaN(curVal) && curVal > 0) {
                        const newVal = Math.max(1, curVal - effectiveDelta);
                        slot.setAttribute('data-dice-value', String(newVal));
                        const img = slot.querySelector('img');
                        if (img && typeof this.getDiceGifFilename === 'function') {
                            img.src = this.getDiceGifFilename(newVal);
                        }
                    }
                });
            }
        } catch (e) { /* non-fatal */ }
        return next;
    };

    // Add Paralysis for this scene and clamp between 0 and 99
    // Paralysis fixes the next X dice to the minimum value before bonuses are applied
    CharacterManager.prototype.addParalysisThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.paralysisThisScene === 'number') ? this.encounterState.paralysisThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(99, current + delta));
        this.encounterState.paralysisThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return next;
    };

    // Set Panic Level for this scene (nervous, intimidated, terrified, hopeless, overwhelmed, or null to clear)
    // Panic levels deal SP damage: Nervous 10%, Intimidated 20%, Terrified 30%, Hopeless 60%, Overwhelmed 100% of Max SP
    CharacterManager.prototype.setPanicLevelThisScene = function(panicLevel) {
        if (!this.encounterState) this.encounterState = {};
        const validLevels = ['nervous', 'intimidated', 'terrified', 'hopeless', 'overwhelmed'];
        
        // Deal SP damage when panic level is applied
        if (panicLevel && validLevels.includes(panicLevel)) {
            const damagePercent = {
                'nervous': 0.10,
                'intimidated': 0.20,
                'terrified': 0.30,
                'hopeless': 0.60,
                'overwhelmed': 1.00
            }[panicLevel];
            
            try {
                const currentSpEl = document.getElementById('currentSp');
                const maxSpEl = document.getElementById('maxSp');
                const curSp = currentSpEl ? parseInt(currentSpEl.value, 10) : NaN;
                const maxSp = maxSpEl ? parseInt(maxSpEl.textContent, 10) : NaN;
                
                if (Number.isFinite(curSp) && Number.isFinite(maxSp) && maxSp > 0) {
                    const damage = Math.ceil(maxSp * damagePercent);
                    const newSp = Math.max(0, curSp - damage);
                    currentSpEl.value = newSp;
                    if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                    
                    const panicLevelNames = {
                        'nervous': 'Nervous',
                        'intimidated': 'Intimidated',
                        'terrified': 'Terrified',
                        'hopeless': 'Hopeless',
                        'overwhelmed': 'Overwhelmed'
                    };
                    this.showNotification(`${panicLevelNames[panicLevel]}: Dealt ${damage} SP damage (${Math.round(damagePercent * 100)}% of Max SP).`, 'warning');
                }
            } catch (e) { /* non-fatal */ }
            
            this.encounterState.panicLevelThisScene = panicLevel;
        } else if (panicLevel === null || panicLevel === undefined) {
            delete this.encounterState.panicLevelThisScene;
        } else {
            console.warn('Invalid panic level:', panicLevel);
            return null;
        }
        
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return this.encounterState.panicLevelThisScene || null;
    };

    // Set Calm Level for this scene (calm, relaxed, resolved, optimistic, persevere, or null to clear)
    // Calm levels grant Shield: Calm 5%, Relaxed 10%, Resolved 15%, Optimistic 20%, Persevere 25% of Max SP
    CharacterManager.prototype.setCalmLevelThisScene = function(calmLevel) {
        if (!this.encounterState) this.encounterState = {};
        const validLevels = ['calm', 'relaxed', 'resolved', 'optimistic', 'persevere'];
        
        // Grant Shield when calm level is applied
        if (calmLevel && validLevels.includes(calmLevel)) {
            const shieldPercent = {
                'calm': 0.05,
                'relaxed': 0.10,
                'resolved': 0.15,
                'optimistic': 0.20,
                'persevere': 0.25
            }[calmLevel];
            
            try {
                const maxSpEl = document.getElementById('maxSp');
                const maxSp = maxSpEl ? parseInt(maxSpEl.textContent, 10) : NaN;
                
                if (Number.isFinite(maxSp) && maxSp > 0) {
                    const shieldGain = Math.ceil(maxSp * shieldPercent);
                    const prevShield = Math.max(0, Number(this.encounterState.tempShieldHp) || 0);
                    this.encounterState.tempShieldHp = prevShield + shieldGain;
                    
                    if (typeof this.updateHpSpFromStats === 'function') this.updateHpSpFromStats();
                    
                    const calmLevelNames = {
                        'calm': 'Calm',
                        'relaxed': 'Relaxed',
                        'resolved': 'Resolved',
                        'optimistic': 'Optimistic',
                        'persevere': 'Persevere'
                    };
                    this.showNotification(`${calmLevelNames[calmLevel]}: Gained ${shieldGain} Shield (${Math.round(shieldPercent * 100)}% of Max SP).`, 'success');
                }
            } catch (e) { /* non-fatal */ }
            
            this.encounterState.calmLevelThisScene = calmLevel;
        } else if (calmLevel === null || calmLevel === undefined) {
            delete this.encounterState.calmLevelThisScene;
        } else {
            console.warn('Invalid calm level:', calmLevel);
            return null;
        }
        
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return this.encounterState.calmLevelThisScene || null;
    };

    // Add Defense Power Up for this scene and clamp between 0 and 10
    CharacterManager.prototype.addDefensePowerUpThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.defensePowerUpThisScene === 'number') ? this.encounterState.defensePowerUpThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.defensePowerUpThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return next;
    };

    // Add Haste for this scene and clamp between 0 and 10
    CharacterManager.prototype.addHasteThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.hasteThisScene === 'number') ? this.encounterState.hasteThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.hasteThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return next;
    };

    // Add Charge Potency for this scene
    CharacterManager.prototype.addChargePotencyThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.chargePotencyThisScene === 'number') ? this.encounterState.chargePotencyThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, current + delta);
        this.encounterState.chargePotencyThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return next;
    };

    // Add Poise Potency and Count for this scene with simple non-negative clamps
    CharacterManager.prototype.addPoiseThisScene = function(potencyDelta, countDelta) {
        if (!this.encounterState) this.encounterState = {};
        const currentPot = (typeof this.encounterState.poisePotencyThisScene === 'number') ? this.encounterState.poisePotencyThisScene : 0;
        const currentCnt = (typeof this.encounterState.poiseCountThisScene === 'number') ? this.encounterState.poiseCountThisScene : 0;
        const potDelta = Number.isFinite(potencyDelta) ? potencyDelta : 0;
        let cntDelta = Number.isFinite(countDelta) ? countDelta : 0;
        // Auto-grant 1 Poise Count if this is the first Poise application and only Potency is given
        if (cntDelta === 0 && potDelta > 0 && currentPot === 0 && currentCnt === 0) {
            cntDelta = 1;
        }
        const nextPot = Math.max(0, currentPot + potDelta);
        const nextCnt = Math.max(0, Math.min(99, currentCnt + cntDelta));
        this.encounterState.poisePotencyThisScene = nextPot;
        this.encounterState.poiseCountThisScene = nextCnt;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return { potency: nextPot, count: nextCnt };
    };

    // Add Jackpot Count for this scene (0-99)
    CharacterManager.prototype.addJackpotThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.jackpotCountThisScene === 'number') ? this.encounterState.jackpotCountThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(99, current + delta));
        this.encounterState.jackpotCountThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Add stacks of Focused Attack; apply tiered bonuses:
    // 2 stacks: +1 Power Up (generic) this scene
    // 3+ stacks: +1 flat dice power to all dice this scene (focusedAttackFlatDicePowerThisScene = 1)
    CharacterManager.prototype.addFocusedAttackStacks = function(delta) {
        if (!this.encounterState) this.encounterState = {};
        const cur = Number(this.encounterState.focusedAttackStacks) || 0;
        const add = Number.isFinite(delta) ? delta : 0;
        const next = Math.max(0, Math.min(3, cur + add));
        this.encounterState.focusedAttackStacks = next;
        // Apply tier effects
        if (next >= 2) {
            if (typeof this.addPowerUpThisScene === 'function') {
                // Ensure at least +1 generic power at the 2-stack threshold (apply only once per crossing)
                const already = Number(this.encounterState.__focusedTier2Applied) || 0;
                if (!already) {
                    this.addPowerUpThisScene(1);
                    this.encounterState.__focusedTier2Applied = 1;
                }
            } else {
                const p = Number(this.encounterState.powerUpThisScene) || 0;
                this.encounterState.powerUpThisScene = Math.max(0, Math.min(10, p + 1));
                this.encounterState.__focusedTier2Applied = 1;
            }
        }
        if (next >= 3) {
            this.encounterState.focusedAttackFlatDicePowerThisScene = 1;
        }
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        return next;
    };

    // Remove Focused Attack for this scene
    CharacterManager.prototype.removeFocusedAttackThisScene = function() {
        if (!this.encounterState) this.encounterState = {};
        this.encounterState.focusedAttackStacks = 0;
        this.encounterState.focusedAttackFlatDicePowerThisScene = 0;
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        this.showNotification('Focused Attack: Removed for this scene.', 'info');
        return true;
    };

    // Add Attack Power Up for this scene and clamp between 0 and 10
    CharacterManager.prototype.addAttackPowerUpThisScene = function(amount) {
        if (!this.encounterState) this.encounterState = {};
        const current = (typeof this.encounterState.attackPowerUpThisScene === 'number') ? this.encounterState.attackPowerUpThisScene : 0;
        const delta = Number.isFinite(amount) ? amount : 0;
        const next = Math.max(0, Math.min(10, current + delta));
        this.encounterState.attackPowerUpThisScene = next;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return next;
    };

    // Add Bravery for this scene - grants 10 Attack Power Up
    CharacterManager.prototype.addBraveryThisScene = function() {
        if (!this.encounterState) this.encounterState = {};
        this.encounterState.braveryActiveThisScene = true;
        // Grant 10 Attack Power Up (clamped to max 10)
        this.addAttackPowerUpThisScene(10);
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        this.showNotification('Bravery: Gained 10 Attack Power Up for this scene.', 'success');
        return true;
    };

    // Add Declared Duel for this scene
    CharacterManager.prototype.addDeclaredDuelThisScene = function() {
        if (!this.encounterState) this.encounterState = {};
        this.encounterState.declaredDuelActiveThisScene = true;
        if (typeof this.updateStatusEffectsDisplay === 'function') {
            this.updateStatusEffectsDisplay();
        }
        return true;
    };

    // Handle Geon (☰) On Play effect: Gain 2 Power Up this Scene
    CharacterManager.prototype.handleGeonOnPlayEffect = function() {
        console.log('Geon (☰) On Play effect triggered');
        if (!this.encounterState) this.encounterState = {};
        // Mark the trigram as used this scene
        if (!this.encounterState.trigramUsedThisScene) {
            this.encounterState.trigramUsedThisScene = true;
        }
        // Track trigram usage in the cycle
        if (!this.encounterState.trigramCycleUsed) {
            this.encounterState.trigramCycleUsed = new Set();
        }
        this.encounterState.trigramCycleUsed.add(13); // Geon (☰) page ID

        // Apply +2 Power Up this scene (clamped to max 10)
        const newPower = this.addPowerUpThisScene(2);

        // Remove Geon (☰) from dice assignments immediately after use
        if (this.encounterState && this.encounterState.diceAssignments) {
            for (let [diceIndex, assignment] of this.encounterState.diceAssignments.entries()) {
                if (assignment.pageId === 13) { // Geon (☰)
                    this.encounterState.diceAssignments.delete(diceIndex);
                    this.updateDiceVisualState([]);
                    break;
                }
            }
        }
        // Inform user
        this.showNotification(`Geon (☰): Gained +2 Power Up this scene (Now ${newPower}/10).`, 'success');
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
    };

    // Handle Gon (☷) On Play effect: Gain 2 Protection this Scene
    CharacterManager.prototype.handleGonOnPlayEffect = function() {
        console.log('Gon (☷) On Play effect triggered');
        if (!this.encounterState) this.encounterState = {};
        // Mark the trigram as used this scene
        if (!this.encounterState.trigramUsedThisScene) {
            this.encounterState.trigramUsedThisScene = true;
        }
        // Track trigram usage in the cycle
        if (!this.encounterState.trigramCycleUsed) {
            this.encounterState.trigramCycleUsed = new Set();
        }
        this.encounterState.trigramCycleUsed.add(14); // Gon (☷) page ID

        // Apply +2 Protection this scene (clamped to max 10)
        const newProt = this.addProtectionThisScene(2);

        // Remove Gon (☷) from dice assignments immediately after use
        if (this.encounterState && this.encounterState.diceAssignments) {
            for (let [diceIndex, assignment] of this.encounterState.diceAssignments.entries()) {
                if (assignment.pageId === 14) { // Gon (☷)
                    this.encounterState.diceAssignments.delete(diceIndex);
                    this.updateDiceVisualState([]);
                    break;
                }
            }
        }
        // Inform user
        this.showNotification(`Gon (☷): Gained +2 Protection this scene (Now ${newProt}/10).`, 'success');
        if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
    };

    // Handle Reload Bullets On Play: vanish from die, then draw random Thumb Ammunition
    CharacterManager.prototype.handleReloadBulletsOnPlay = function() {
        try {
            // Spend Light equal to Reload Bullets' lightUsage (since it will be removed immediately)
            try {
                const cost = Number(window.pageManager?.pages?.[101]?.lightUsage) || 0;
                if (cost > 0) {
                    if (!this.encounterState) this.encounterState = {};
                    if (typeof this.encounterState.lightSpentOnPlayThisScene !== 'number') {
                        this.encounterState.lightSpentOnPlayThisScene = 0;
                    }
                    this.encounterState.lightSpentOnPlayThisScene = Math.max(0, this.encounterState.lightSpentOnPlayThisScene + cost);
                    if (typeof this.updateCurrentLight === 'function') this.updateCurrentLight();
                }
            } catch (e) { /* non-fatal */ }
            // Remove from dice assignment by searching for the pageId 101
            if (this.encounterState && this.encounterState.diceAssignments) {
                for (let [diceIndex, assignment] of this.encounterState.diceAssignments.entries()) {
                    if (assignment && assignment.pageId === 101) { // Reload Bullets
                        this.encounterState.diceAssignments.delete(diceIndex);
                        if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                        break;
                    }
                }
            }
            // Queue Reload Bullets to return next scene
            try {
                if (!this.encounterState) this.encounterState = {};
                const currentScene = (typeof this.encounterState?.sceneNumber === 'number') ? this.encounterState.sceneNumber : 1;
                if (!Array.isArray(this.encounterState.pagesToReturnOnCooldownExpire)) {
                    this.encounterState.pagesToReturnOnCooldownExpire = [];
                }
                // Avoid duplicate queue entry for the same scene
                const alreadyQueued = this.encounterState.pagesToReturnOnCooldownExpire.some(
                    item => item.pageId === 101 && item.returnAtScene === currentScene + 1
                );
                if (!alreadyQueued) {
                    this.encounterState.pagesToReturnOnCooldownExpire.push({
                        pageId: 101,
                        returnAtScene: currentScene + 1
                    });
                }
            } catch (e) { /* non-fatal */ }
            // Draw one random Thumb Ammunition page (IDs 102-105)
            if (window.pageManager && typeof window.pageManager.drawRandomThumbAmmunitionPage === 'function') {
                window.pageManager.drawRandomThumbAmmunitionPage();
            }
            // Optionally hide the placement popup if present
            if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
        } catch (e) { /* non-fatal */ }
    };

    // Handle Thumb Ammunition On Play: remove from die immediately
    CharacterManager.prototype.handleThumbAmmoOnPlay = function(pageId) {
        try {
            // Remove the placed ammo from the dice immediately
            if (this.encounterState && this.encounterState.diceAssignments) {
                for (let [diceIndex, assignment] of this.encounterState.diceAssignments.entries()) {
                    if (assignment && assignment.pageId === pageId) {
                        this.encounterState.diceAssignments.delete(diceIndex);
                        if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                        break;
                    }
                }
            }
            try {
                const name = window.pageManager?.pages?.[pageId]?.name || 'Thumb Ammunition';
                this.showNotification(`${name}: Prepared (On Play).`, 'success');
            } catch (e) { /* non-fatal */ }
            // Close placement UI if open
            if (typeof this.hideDicePlacementPopup === 'function') this.hideDicePlacementPopup();
        } catch (e) { /* non-fatal */ }
    };
    // Handle Declared Duel On Play: Gain 2 Haste this Scene
    CharacterManager.prototype.handleDeclaredDuelOnPlay = function() {
        if (!this.encounterState) this.encounterState = {};
        if (typeof this.addHasteThisScene === 'function') {
            this.addHasteThisScene(2);
        } else {
            const current = (typeof this.encounterState.hasteThisScene === 'number') ? this.encounterState.hasteThisScene : 0;
            const next = Math.max(0, Math.min(10, current + 2));
            this.encounterState.hasteThisScene = next;
            if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
        }
        this.showNotification('Declared Duel: Gained +2 Haste this scene.', 'success');
    };

    // Handle Poise Exchange On Play: single-step exchange per use
    // One step only: apply +5 Poise Potency (auto-grants +1 Count on first-ever Poise via addPoiseThisScene), then +1 Bind.
    CharacterManager.prototype.handlePoiseExchangeOnPlay = function() {
        // Re-entrancy guard: prevent multiple resolutions in the same tick/click
        if (this.encounterState && this.encounterState._poiseExchangeResolving) {
            this.showNotification('Poise Exchange is already resolving.', 'info');
            return;
        }
        try {
            if (!this.encounterState) this.encounterState = {};
            this.encounterState._poiseExchangeResolving = true;

            // 1) +5 Poise Potency (count auto-grants if first Poise via addPoiseThisScene)
            if (typeof this.addPoiseThisScene === 'function') {
                this.addPoiseThisScene(5, 0);
            } else {
                const curPot = Number(this.encounterState.poisePotencyThisScene) || 0;
                this.encounterState.poisePotencyThisScene = Math.max(0, Math.min(99, curPot + 5));
                if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
            }

            // 2) +1 Bind (applies immediately to speed dice visually as in addBindThisScene)
            if (typeof this.addBindThisScene === 'function') {
                this.addBindThisScene(1);
            } else {
                const curBind = Number(this.encounterState.bindThisScene) || 0;
                const nextBind = Math.max(0, Math.min(10, curBind + 1));
                this.encounterState.bindThisScene = nextBind;
                if (typeof this.updateStatusEffectsDisplay === 'function') this.updateStatusEffectsDisplay();
            }

            // Determine whether to return the page to hand (only if no Speed die is at 1)
            let minAfter = Infinity;
            try {
                const hexSlots = document.querySelectorAll('.hexagonal-slots .hex-slot.filled');
                hexSlots.forEach((slot) => {
                    const valAttr = slot.getAttribute('data-dice-value');
                    const curVal = valAttr ? parseInt(valAttr, 10) : NaN;
                    if (!Number.isNaN(curVal) && curVal > 0) {
                        if (curVal < minAfter) minAfter = curVal;
                    }
                });
            } catch (e) { /* non-fatal */ }
            const shouldReturnToHand = !(minAfter <= 1);

            // Remove Poise Exchange from dice assignments immediately after use
            if (this.encounterState && this.encounterState.diceAssignments) {
                for (let [diceIndex, assignment] of this.encounterState.diceAssignments.entries()) {
                    if (assignment && assignment.pageId === 433) {
                        this.encounterState.diceAssignments.delete(diceIndex);
                        if (typeof this.updateDiceVisualState === 'function') this.updateDiceVisualState([]);
                        break;
                    }
                }
            }

            // Return to hand if no die reached 1; otherwise, consume
            if (shouldReturnToHand) {
				try {
					const pageId = 433;
					const pageMeta = window.pageManager?.pages?.[pageId];
					const isSpecialPg = !!(pageMeta && ((typeof pageMeta.range === 'string' && pageMeta.range.includes('Special')) || pageMeta.range === 'Mass - Summation' || pageMeta.range === 'Mass - Individual'));
					const targetHand = isSpecialPg
						? (this.encounterState.handSpecial || (this.encounterState.handSpecial = []))
						: (this.encounterState.handNormal || (this.encounterState.handNormal = []));
					targetHand.push(pageId);
					this.encounterState.hand = [...(this.encounterState.handNormal || []), ...(this.encounterState.handSpecial || [])];
					if (typeof this.updateHandDisplay === 'function') this.updateHandDisplay();
				} catch (e) { /* non-fatal */ }
                this.showNotification('Poise Exchange returned to hand (no Speed die at 1 yet).', 'info');
            } else {
				try {
					const pageId = 433;
					if (!Array.isArray(this.encounterState.pagesToReturnNextScene)) {
						this.encounterState.pagesToReturnNextScene = [];
					}
					if (!this.encounterState.pagesToReturnNextScene.includes(pageId)) {
						this.encounterState.pagesToReturnNextScene.push(pageId);
					}
				} catch (e) { /* non-fatal */ }
                this.showNotification('Poise Exchange consumed (a Speed die reached 1).', 'success');
            }
        } catch (err) {
            console.error('handlePoiseExchangeOnPlay failed:', err);
            this.showNotification('Poise Exchange failed to resolve.', 'error');
        } finally {
            if (this.encounterState) this.encounterState._poiseExchangeResolving = false;
        }
    };

    // Determine if Singleton is active for the current encounter
    // Singleton is active when the encounter is ongoing and the hand contains no duplicate page IDs
    CharacterManager.prototype.isSingletonActive = function() {
        if (!this.encounterState) return false;
        return !!this.encounterState.singletonActiveThisScene;
    };

    // Compute Singleton based on current hand (no duplicates)
    CharacterManager.prototype.computeSingletonFromHand = function() {
        if (!this.encounterState || !Array.isArray(this.encounterState.hand)) return false;
        const seenPageIds = new Set();
        for (const pageId of this.encounterState.hand) {
            if (seenPageIds.has(pageId)) return false;
            seenPageIds.add(pageId);
        }
        return true;
    };

    // Page Management System
    class PageManager {
        constructor() {
            console.log('PageManager constructor called'); // Debug log
            this.pages = loadPages();
            console.log('Pages initialized:', this.pages); // Debug log
            
            // Test that pages are loaded correctly
            console.log('Page 1 data:', this.pages[1]);
            console.log('Page 1 name should be "Evade":', this.pages[1].name);
            console.log('Page 89 data:', this.pages[89]);
            console.log('Page 89 name should be "Sentence":', this.pages[89].name);
            console.log('Total pages loaded:', Object.keys(this.pages).length);
            console.log('Expected: 387 pages (1-387)');
            
            this.initializePageEventListeners();
            
            // Validate that all expected pages are loaded
            this.validatePageData();
        }

        // Sanity-check page data loaded from initializePages
        validatePageData() {
            try {
                if (!this.pages || typeof this.pages !== 'object') {
                    throw new Error('Pages not loaded or invalid');
                }
                const keys = Object.keys(this.pages);
                if (keys.length === 0) {
                    console.warn('PageManager: No pages found.');
                    return;
                }
                // Spot-check a few required fields if present
                let missingNameCount = 0;
                for (const key of keys) {
                    const p = this.pages[key];
                    if (!p || typeof p !== 'object') continue;
                    if (p.name == null) missingNameCount++;
                }
                if (missingNameCount > 0) {
                    console.warn(`PageManager: ${missingNameCount} pages missing name fields.`);
                }
            } catch (err) {
                console.error('validatePageData failed:', err);
            }
        }

        // Decorate a list or inventory item according to its page range
        decorateItemByRange(item, pageData) {
            try {
                if (!item || !pageData) return;
                const rangeString = String(pageData.range || '');
                if (!rangeString) return;
                // Avoid duplicate icon
                if (item.querySelector('.range-icon')) return;
                const lower = rangeString.toLowerCase();
                // Determine border color by range
                let borderColor = '';
                if (lower.includes('mass') && lower.includes('summation')) {
                    borderColor = '#a42616';
                } else if (lower.includes('mass') && lower.includes('individual')) {
                    borderColor = '#a42616';
                } else if (lower.includes('ranged') && lower.includes('single use')) {
                    borderColor = '#948464';
                } else if (lower.includes('ranged')) {
                    borderColor = '#fbe6a8';
                } else if (lower.includes('special') && lower.includes('single use')) {
                    borderColor = '#3162b3';
                } else if (lower.includes('special')) {
                    borderColor = '#c5e0f4';
                } else if (lower.includes('melee') && lower.includes('single use')) {
                    borderColor = '#73431b';
                } else if (lower.includes('melee')) {
                    borderColor = '#f7caae';
                }
                if (borderColor) {
                    item.style.border = `0.9px solid ${borderColor}`;
                    item.style.borderRadius = '6px';
                    item.style.marginBottom = '6px';
                    item.style.padding = '10px 8px';
                    // Text/glow overrides
                    if (lower.includes('mass') && lower.includes('individual')) {
                        item.style.color = '#f7d1ca';
                        item.style.boxShadow = `0 0 8px #a82c1f40`;
                    } else if (lower.includes('special') && lower.includes('single use')) {
                        item.style.color = '#c3e3f3';
                        item.style.boxShadow = `0 0 8px ${borderColor}40`;
                    } else {
                        item.style.color = borderColor;
                        item.style.boxShadow = `0 0 8px ${borderColor}40`;
                    }
                }
                // Append icon
                const img = document.createElement('img');
                img.className = 'range-icon';
                if (lower.includes('mass') && lower.includes('summation')) {
                    img.src = 'UI_Card/UICard_range_FarAreaIcon_color.png';
                    img.alt = 'Mass - Summation';
                } else if (lower.includes('mass') && lower.includes('individual')) {
                    img.src = 'UI_Card/UICard_range_FarAreaIcon_color.png';
                    img.alt = 'Mass - Individual';
                } else if (lower.includes('ranged') && lower.includes('single use')) {
                    img.src = 'UI_Card/UICard_range_farIcon_color.png';
                    img.alt = 'Ranged - Single Use';
                } else if (lower.includes('ranged')) {
                    img.src = 'UI_Card/UICard_range_farIcon_noncolor.png';
                    img.alt = 'Ranged';
                } else if (lower.includes('melee') && lower.includes('single use')) {
                    img.src = 'UI_Card/UICard_range_nearIcon_color.png';
                    img.alt = 'Melee - Single Use';
                } else if (lower.includes('melee')) {
                    img.src = 'UI_Card/UICard_range_nearIcon_noncolor.png';
                    img.alt = 'Melee';
                } else if (lower.includes('special')) {
                    img.src = 'UI_Card/UICard_range_instantIcon_color.png';
                    img.alt = 'Special';
                } else {
                    return; // nothing to add
                }
                item.appendChild(img);
            } catch (err) {
                console.error('decorateItemByRange failed:', err);
            }
        }
        
       
        // Removed inline pages; using initializePages.js instead
        initializePages() {
            return loadPages();
        }

        // Initialize page event listeners
        initializePageEventListeners() {
            console.log('Initializing page event listeners...'); // Debug log
            
            // Add click events to all page items
            const listItems = document.querySelectorAll('.list-item');
            console.log('Found list items:', listItems.length); // Debug log
            
            listItems.forEach((item) => {
                item.addEventListener('click', () => {
                    const pageId = parseInt(item.dataset.page);
                    console.log(`Page clicked, ID: ${pageId}`); // Debug log
                    this.showPagePopup(pageId);
                });
            });

            // Decorate list items with range icon/colors
            try {
                listItems.forEach((item) => {
                    const pageId = parseInt(item.dataset.page);
                    if (Number.isNaN(pageId)) return;
                    const pageData = this.pages[pageId];
                    if (!pageData) return;
                    this.decorateItemByRange(item, pageData);
                });
            } catch (e) {
                console.error('Failed to decorate range icons:', e);
            }

            // Close popup when clicking close button
            document.querySelector('.close-popup').addEventListener('click', () => {
                this.hidePagePopup();
            });

            // Close popup when clicking outside
            document.getElementById('pagePopup').addEventListener('click', (e) => {
                if (e.target.id === 'pagePopup') {
                    this.hidePagePopup();
                }
            });

            // Close popup with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hidePagePopup();
                }
            });

            // Combat Pages search functionality
            const combatPagesSection = document.querySelector('.combat-pages-section');
            if (combatPagesSection) {
                const searchInputElement = combatPagesSection.querySelector('.search-input');
                const pageItemElements = combatPagesSection.querySelectorAll('.list-item');
                const filterCombatPagesByQuery = () => {
                    if (!searchInputElement) return;
                    const searchQuery = (searchInputElement.value || '').trim().toLowerCase();
                    if (!searchQuery) {
                        pageItemElements.forEach((element) => {
                            element.style.display = '';
                        });
                        return;
                    }
                    pageItemElements.forEach((element) => {
                        const pageName = (element.textContent || '').toLowerCase();
                        const pageId = parseInt(element.dataset.page);
                        const pageData = window.pageManager?.pages?.[pageId];
                        const pageCategory = (pageData?.pageCategory || '').toLowerCase();
                        
                        // Search in both page name and pageCategory
                        const matchesName = pageName.includes(searchQuery);
                        const matchesCategory = pageCategory.includes(searchQuery);
                        
                        element.style.display = (matchesName || matchesCategory) ? '' : 'none';
                    });
                };

                if (searchInputElement) {
                    searchInputElement.addEventListener('input', filterCombatPagesByQuery);
                    searchInputElement.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter') {
                            filterCombatPagesByQuery();
                        }
                        if (event.key === 'Escape') {
                            searchInputElement.value = '';
                            filterCombatPagesByQuery();
                        }
                    });
                }
            }

            // Popup primary button: Add or Remove page from Owned Pages based on state
            const addButton = document.querySelector('.add-page-btn');
            if (addButton) {
                addButton.addEventListener('click', () => {
                    // Block adding/removing pages during an active encounter
                        // Check for actual encounter state (deck property indicates active encounter)
                    if (window.characterManager && window.characterManager.encounterState && window.characterManager.encounterState.deck) {
                        window.characterManager.showNotification('Cannot modify Owned Pages during an encounter.', 'warning');
                        return;
                    }
                    const popup = document.getElementById('pagePopup');
                    const currentIdString = popup.getAttribute('data-current-page-id');
                    const currentPageId = currentIdString ? parseInt(currentIdString) : NaN;
                    if (Number.isNaN(currentPageId)) {
                        console.error('No current page selected');
                        return;
                    }
                    const page = this.pages[currentPageId];
                    if (!page) {
                        console.error('Page data missing for id', currentPageId);
                        return;
                    }
                    const action = addButton.getAttribute('data-action');
                    // Update the character's owned pages directly
                    if (action === 'remove') {
                        // Remove from character's owned pages
                        if (this.currentCharacter && this.currentCharacter.ownedPages) {
                            const index = this.currentCharacter.ownedPages.indexOf(currentPageId);
                            if (index > -1) {
                                this.currentCharacter.ownedPages.splice(index, 1);
                            }
                        }
                        if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
                            window.characterManager.showNotification('Page removed from Owned Pages', 'success');
                        }
                        // Persist change if a character is selected
                        if (window.characterManager && window.characterManager.currentCharacter) {
                            window.characterManager.updateCharacter();
                        }
                        // Show the page back in the combat list
                        if (typeof this.syncCombatListWithInventory === 'function') {
                            this.syncCombatListWithInventory();
                        }
                        this.hidePagePopup();
                        return;
                    }
			// If action is add, add to character's owned pages
                    if (action === 'add') {
                        // Check if page is Enemy Only and prevent adding
                        const page = this.pages[currentPageId];
                        if (page && page.category === 'Enemy Only') {
                            if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
                                window.characterManager.showNotification('Cannot add Enemy Only pages to inventory', 'error');
                            }
                            this.hidePagePopup();
                            return;
                        }

				// Prevent adding Trigram pages (Geon, Gon, Gam, Gi) to Owned Pages
				if ([13, 14, 15, 16].includes(currentPageId)) {
					if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
						window.characterManager.showNotification('Trigram pages cannot be added to Owned Pages', 'error');
					}
					this.hidePagePopup();
					return;
				}
                        
                        // Check if a character is selected
                        if (!window.characterManager || !window.characterManager.currentCharacter) {
                            if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
                                window.characterManager.showNotification('Please select a character first', 'error');
                            }
                            this.hidePagePopup();
                            return;
                        }
                        
                        if (!window.characterManager.currentCharacter.ownedPages) {
                            window.characterManager.currentCharacter.ownedPages = [];
                        }
                        if (!window.characterManager.currentCharacter.ownedPages.includes(currentPageId)) {
                            window.characterManager.currentCharacter.ownedPages.push(currentPageId);
                        }
                        if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
                            window.characterManager.showNotification('Page added to Owned Pages', 'success');
                        }
                        // Persist change if a character is selected
                        if (window.characterManager && window.characterManager.currentCharacter) {
                            window.characterManager.updateCharacter();
                        }
                        // Hide the page from the combat list
                        if (typeof this.syncCombatListWithInventory === 'function') {
                            this.syncCombatListWithInventory();
                        }
                        this.hidePagePopup();
                        return;
                    }
                    // No-op cases (already added or already removed)
                    this.hidePagePopup();
                });
            }

            // Event delegation is now handled in the popup display
            // No need for inventory display event listeners since we use the popup
            // Initial sync so owned pages are hidden on load
            // This ensures the combat list is properly synced even if a character is already loaded
            if (typeof this.syncCombatListWithInventory === 'function') {
                this.syncCombatListWithInventory();
            }
        }

        // Draw exactly 1 random Thumb Ammunition page (IDs: 102-105) into handSpecial (not limited by normal hand size)
        drawRandomThumbAmmunitionPage() {
            try {
                const cm = window.characterManager;
                if (!cm || !cm.encounterState) return;
                // Randomly select from the four Thumb Ammunition pages
                const thumbAmmunitionIds = [
                    102, // Shock Ammunition
                    103, // Incendiary Ammunition
                    104, // Armor-Piercing Ammunition
                    105  // Frost Ammunition
                ];
                const picked = thumbAmmunitionIds[Math.floor(Math.random() * thumbAmmunitionIds.length)];
                
                // Add to handSpecial because Thumb Ammunition are Special - Single Use
                if (!Array.isArray(cm.encounterState.handSpecial)) {
                    cm.encounterState.handSpecial = [];
                }
                cm.encounterState.handSpecial.push(picked);
                
                // Reconstruct combined hand
                cm.encounterState.hand = [...(cm.encounterState.handNormal || []), ...(cm.encounterState.handSpecial || [])];
                
                cm.updateHandDisplay();
                const p = this.pages?.[picked];
                cm.showNotification(`Drew Thumb Ammunition: ${p?.name || `Page ${picked}`}`, 'success');
            } catch (err) {
                console.error('drawRandomThumbAmmunitionPage failed:', err);
            }
        }

        // Hide combat list items for pages that are already owned; show those not owned
        syncCombatListWithInventory() {
            try {
                // Get owned pages from character data instead of DOM
                const ownedIds = new Set(
                    window.characterManager?.currentCharacter?.ownedPages || []
                );
                const listItems = document.querySelectorAll('.combat-pages-section .list-item[data-page]');
                listItems.forEach((el) => {
                    const id = parseInt(el.getAttribute('data-page'));
                    if (!Number.isNaN(id)) {
                        el.style.display = ownedIds.has(id) ? 'none' : '';
                    }
                });
            } catch (error) {
                console.error('Failed to sync combat list with inventory:', error);
            }
        }

        // Show page popup with stats
        showPagePopup(pageId) {
            console.log('showPagePopup called with pageId:', pageId);
            console.log('Available pages:', Object.keys(this.pages));
            console.log('Looking for page:', pageId);
            
            const page = this.pages[pageId];
            if (!page) {
                console.error('Page not found for ID:', pageId);
                console.error('Available page IDs:', Object.keys(this.pages));
                console.error('This might indicate a mismatch between HTML data-page attributes and JavaScript page data');
                return;
            }

                        console.log('Showing popup for page:', page); // Debug log
                console.log('Page category:', page.pageCategory);

            try {
                // Force clear any old data first
                document.getElementById('popupPageName').textContent = '';
                document.getElementById('popupPageCategory').textContent = '';
                document.getElementById('popupCategory').textContent = '';
                document.getElementById('popupRanking').textContent = '';
                document.getElementById('popupDice').textContent = '';
                document.getElementById('popupKeywords').textContent = '';
                document.getElementById('popupRange').textContent = '';
                document.getElementById('popupDamageType').textContent = '';
                document.getElementById('popupLightUsage').textContent = '';

                // Now populate with new data
                document.getElementById('popupPageName').textContent = page.name;
                document.getElementById('popupPageCategory').textContent = page.pageCategory;
                document.getElementById('popupCategory').textContent = page.category;
                document.getElementById('popupRanking').textContent = page.ranking;
                document.getElementById('popupDice').textContent = page.dice;
                document.getElementById('popupKeywords').textContent = page.keywords;
                document.getElementById('popupRange').textContent = page.range;
                document.getElementById('popupDamageType').textContent = page.damageType;
                document.getElementById('popupLightUsage').textContent = page.lightUsage;

                console.log('All popup fields updated with new data');

                // Show popup
                const popup = document.getElementById('pagePopup');
                if (popup) {
                    popup.classList.add('show');
                    console.log('Popup shown successfully');
                } else {
                    console.error('Popup element not found');
                }
            } catch (error) {
                console.error('Error showing popup:', error);
            }

            // Store current pageId on popup for later actions (e.g., Add)
            const popupElement = document.getElementById('pagePopup');
            if (popupElement) {
                popupElement.setAttribute('data-current-page-id', String(pageId));
                // Update popup primary button label depending on ownership
                const primaryButton = document.querySelector('.add-page-btn');
                if (primaryButton) {
                    const isOwned = window.characterManager?.currentCharacter?.ownedPages?.includes(pageId) || false;
                    primaryButton.textContent = isOwned ? 'Remove' : 'Add';
                    primaryButton.setAttribute('data-action', isOwned ? 'remove' : 'add');
                }
            }
        }

        // Hide page popup
        hidePagePopup() {
            const popup = document.getElementById('pagePopup');
            popup.classList.remove('show');
            popup.removeAttribute('data-current-page-id');
        }
    }

    // Initialize the character manager when the page loads
    let characterManagerRetryCount = 0;
    const MAX_CHARACTER_MANAGER_RETRIES = 10;
    
    function initializeCharacterManager() {
        try {
            // Check if all required elements exist
            const requiredElements = ['save', 'load', 'delete', 'update', 'name', 'factions', 'grade', 'fortitude', 'prudence', 'temperance'];
            const missingElements = requiredElements.filter(id => !document.getElementById(id));
            
            if (missingElements.length > 0) {
                console.error('Missing elements:', missingElements);
                
                if (characterManagerRetryCount < MAX_CHARACTER_MANAGER_RETRIES) {
                    characterManagerRetryCount++;
                    console.log(`Retrying character manager initialization (${characterManagerRetryCount}/${MAX_CHARACTER_MANAGER_RETRIES})`);
                    setTimeout(initializeCharacterManager, 100);
                } else {
                    console.error('Failed to initialize Character Manager after maximum retries');
                }
                return;
            }
            
            window.characterManager = new CharacterManager();
            console.log('Character Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Character Manager:', error);
            
            if (characterManagerRetryCount < MAX_CHARACTER_MANAGER_RETRIES) {
                characterManagerRetryCount++;
                console.log(`Retrying character manager initialization after error (${characterManagerRetryCount}/${MAX_CHARACTER_MANAGER_RETRIES})`);
                setTimeout(initializeCharacterManager, 100);
            } else {
                console.error('Failed to initialize Character Manager after maximum retries');
            }
        }
    }

    // Try to initialize immediately, then on DOMContentLoaded, then on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeCharacterManager();
            initializePageManager();
            initializeDebugListeners();
        });
    } else {
        initializeCharacterManager();
        initializePageManager();
        initializeDebugListeners();
    }

    // Fallback initialization
    window.addEventListener('load', () => {
        if (!window.characterManager) {
            initializeCharacterManager();
        }
        if (!window.pageManager) {
            initializePageManager();
        }
        // Initialize debug listeners as fallback
        initializeDebugListeners();
    });

    // Debug function to add all pages from a specific category
    function addAllPagesFromCategory(category) {
        if (!category || !window.pageManager || !window.pageManager.pages) {
            console.error('Invalid category or page manager not initialized');
            return;
        }

	        const pagesInCategory = [];
        
        // Find all pages in the specified category
        Object.keys(window.pageManager.pages).forEach(pageId => {
            const page = window.pageManager.pages[pageId];
            if (page && page.pageCategory === category) {
                pagesInCategory.push({
                    id: pageId,
                    name: page.name,
                    pageCategory: page.pageCategory
                });
            }
        });

	        // Intersect with pages explicitly listed in the debug section (only give "these pages")
	        const debugListItems = document.querySelectorAll('.combat-pages-section .list-display .list-item[data-page]');
	        const allowedPageIds = new Set(Array.from(debugListItems).map(el => String(el.getAttribute('data-page'))));
	        const filteredPagesInCategory = pagesInCategory.filter(p => allowedPageIds.has(String(p.id)));

	        if (filteredPagesInCategory.length === 0) {
            console.log(`No pages found for category: ${category}`);
            if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
	                window.characterManager.showNotification(`No pages found for category: ${category}`, 'warning');
            }
            return;
        }

	        console.log(`Found ${filteredPagesInCategory.length} pages in category (limited to debug list): ${category}`);
	        console.log('Pages:', filteredPagesInCategory);

        // Add each page to owned pages
        if (!window.characterManager || !window.characterManager.currentCharacter) {
            console.error('No character selected');
            if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
                window.characterManager.showNotification('Please select a character first', 'error');
            }
            return;
        }

        let addedCount = 0;
	        filteredPagesInCategory.forEach(page => {
            // Check if page is already owned
            const isAlreadyOwned = window.characterManager.currentCharacter.ownedPages?.includes(parseInt(page.id)) || false;
            if (!isAlreadyOwned) {
                // Add to character's owned pages
                if (!window.characterManager.currentCharacter.ownedPages) {
                    window.characterManager.currentCharacter.ownedPages = [];
                }
                window.characterManager.currentCharacter.ownedPages.push(parseInt(page.id));
                addedCount++;
            }
        });

        // Update character data if a character is selected
        if (window.characterManager && window.characterManager.currentCharacter) {
            window.characterManager.updateCharacter();
            // Refresh owned pages display to reflect newly added pages
            if (typeof window.characterManager.updateOwnedPagesDisplay === 'function') {
                window.characterManager.updateOwnedPagesDisplay();
            }
        }

        // Sync combat list with inventory
        if (window.pageManager && typeof window.pageManager.syncCombatListWithInventory === 'function') {
            window.pageManager.syncCombatListWithInventory();
        }

        // Show notification
	        if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
	            window.characterManager.showNotification(`Added ${addedCount} pages from ${category} (limited to debug list)`, 'success');
	        }

	        console.log(`Successfully added ${addedCount} pages from category (limited to debug list): ${category}`);
    }

	    // Debug function to roll all pages from a specific category with custom ranges
    function rollAllPagesFromCategory(category) {
        if (!category || !window.pageManager || !window.pageManager.pages) {
            console.error('Invalid category or page manager not initialized');
            return;
        }

	        const pagesInCategory = [];
        
        // Find all pages in the specified category
        Object.keys(window.pageManager.pages).forEach(pageId => {
            const page = window.pageManager.pages[pageId];
            if (page && page.pageCategory === category) {
                pagesInCategory.push({
                    id: pageId,
                    name: page.name,
                    pageCategory: page.pageCategory
                });
            }
        });

	        // Intersect with pages explicitly listed in the debug section (only give "these pages")
	        const debugListItems = document.querySelectorAll('.combat-pages-section .list-display .list-item[data-page]');
	        const allowedPageIds = new Set(Array.from(debugListItems).map(el => String(el.getAttribute('data-page'))));
	        const filteredPagesInCategory = pagesInCategory.filter(p => allowedPageIds.has(String(p.id)));

	        if (filteredPagesInCategory.length === 0) {
            console.log(`No pages found for category: ${category}`);
            if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
	                window.characterManager.showNotification(`No pages found for category: ${category}`, 'warning');
            }
            return;
        }

	        console.log(`Rolling dice for ${filteredPagesInCategory.length} pages in category (limited to debug list): ${category}`);
        
        // Get custom ranges
        const customRangesByPage = loadCustomRanges();
        
        // Create combat results array in the same format as Combat Phase Results
        const combatResults = [];
        
	        // Roll dice for each page
	        filteredPagesInCategory.forEach(page => {
            const customRanges = customRangesByPage[page.name];
            
            if (customRanges && customRanges.length > 0) {
                const diceResults = [];
                const diceRanges = [];
                
                customRanges.forEach((range, index) => {
                    const [minStr, maxStr] = range.split('-');
                    const minValue = parseInt(minStr);
                    const maxValue = parseInt(maxStr);
                    
                    if (!isNaN(minValue) && !isNaN(maxValue) && maxValue >= minValue) {
                        const rollResult = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
                        diceResults.push(rollResult);
                        diceRanges.push(range);
                    }
                });
                
                // Add to combat results in the same format as Combat Phase Results
                combatResults.push({
                    pageId: page.id,
                    pageName: page.name,
                    diceCount: diceResults.length,
                    diceResults: diceResults,
                    diceRanges: diceRanges,
                    message: `${page.name}: Rolled ${diceResults.join(', ')}`
                });
            } else {
                // Add page with no dice (same format as Combat Phase Results)
                combatResults.push({
                    pageId: page.id,
                    pageName: page.name,
                    diceCount: 0,
                    diceResults: [],
                    diceRanges: [],
                    message: `${page.name}: No custom ranges found`
                });
            }
        });
        
        // Store results for copy functionality
        if (window.characterManager) {
            window.characterManager.lastCombatResults = combatResults;
        }
        
        // Display results using the same popup as Combat Phase Results
	        if (window.characterManager && typeof window.characterManager.displayCombatResults === 'function') {
	            window.characterManager.displayCombatResults(combatResults, `Debug Roll Results - ${category} (limited to debug list)`);
        } else {
            console.error('Character manager or displayCombatResults function not available');
        }
        
	        if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
	            window.characterManager.showNotification(`Rolled dice for ${filteredPagesInCategory.length} pages from ${category} (limited to debug list)`, 'success');
	        }
    }

    // Initialize debug event listeners
    function initializeDebugListeners() {
        const debugAddAllBtn = document.getElementById('debugAddAll');
        if (debugAddAllBtn) {
            debugAddAllBtn.addEventListener('click', () => {
                const categorySelect = document.getElementById('debugCategory');
                if (categorySelect && categorySelect.value) {
                    addAllPagesFromCategory(categorySelect.value);
                } else {
                    if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
                        window.characterManager.showNotification('Please select a page category first', 'warning');
                    }
                }
            });
        }

        const debugRollAllBtn = document.getElementById('debugRollAll');
        if (debugRollAllBtn) {
            debugRollAllBtn.addEventListener('click', () => {
                const categorySelect = document.getElementById('debugCategory');
                if (categorySelect && categorySelect.value) {
                    rollAllPagesFromCategory(categorySelect.value);
                } else {
                    if (window.characterManager && typeof window.characterManager.showNotification === 'function') {
                        window.characterManager.showNotification('Please select a page category first', 'warning');
                    }
                }
            });
        }
    }

    // Initialize page manager
    let pageManagerRetryCount = 0;
    const MAX_PAGE_MANAGER_RETRIES = 10;
    
    function initializePageManager() {
        try {
            // Check if required elements exist
            const requiredElements = ['pagePopup'];
            const missingElements = requiredElements.filter(id => !document.getElementById(id));
            
            if (missingElements.length > 0) {
                console.error('Missing page elements:', missingElements);
                
                if (pageManagerRetryCount < MAX_PAGE_MANAGER_RETRIES) {
                    pageManagerRetryCount++;
                    console.log(`Retrying page manager initialization (${pageManagerRetryCount}/${MAX_PAGE_MANAGER_RETRIES})`);
                    setTimeout(initializePageManager, 100);
                } else {
                    console.error('Failed to initialize Page Manager after maximum retries');
                }
                return;
            }
            
            window.pageManager = new PageManager();
            console.log('Page Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Page Manager:', error);
            
            if (pageManagerRetryCount < MAX_PAGE_MANAGER_RETRIES) {
                pageManagerRetryCount++;
                console.log(`Retrying page manager initialization after error (${pageManagerRetryCount}/${MAX_PAGE_MANAGER_RETRIES})`);
                setTimeout(initializePageManager, 100);
            } else {
                console.error('Failed to initialize Page Manager after maximum retries');
            }
        }
    }

