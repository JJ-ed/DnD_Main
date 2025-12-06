export function getDiceData() {
    return {
        // Regular Pages
        'Evade': [
            { dice: 1, range: '1-4', type: 'Evade', damage: '-' }
        ],
        'Light Attack': [
            { dice: 1, range: '2-3', type: 'Pierce', damage: 'Red' },
            { dice: 2, range: '1-4', type: 'Blunt', damage: 'Red' }
        ],
        'Light Defense': [
            { dice: 1, range: '1-5', type: 'Evade', damage: '-' },
            { dice: 2, range: '2-3', type: 'Shield', damage: '-' },
            { dice: 3, range: '1-2', type: 'Slash', damage: 'Red' }
        ],
        'Charge and Cover': [
            { dice: 1, range: '3-6', type: 'Pierce', damage: 'Red' },
            { dice: 2, range: '2-6', type: 'Shield', damage: '-' }
        ],
        'Thrust': [
            { dice: 1, range: '1-4', type: 'Pierce', damage: 'Red' },
            { dice: 2, range: '1-4', type: 'Pierce', damage: 'Red' }
        ],
        'Focused Strikes': [
            { dice: 1, range: '3-5', type: 'Slash', damage: 'Red' },
            { dice: 2, range: '3-5', type: 'Slash', damage: 'Red' },
            { dice: 3, range: '3-5', type: 'Pierce', damage: 'Red' }
        ],
        'Alleyway Counter': [
            { dice: 1, range: '1-20', type: 'Counter', damage: 'Special', special: 'Go into a Counter Stance' }
        ],
        
        // Hana Association
        'Augury Infusion': [
            { dice: 0, range: '12-24', type: 'Shield', damage: 'Special', special: '[On Play] Allow you to use other Hana Association Pages without backlash within this Encounter. <br>Every attack after this will deal additional Black damage according to Temperance: 1 - 6 (1 each level)<br>Every attack after this will gain Trigram <br>Each attack will now also apply 2 Tremor Potency <br>Gain: Shield 12-24  ' }
        ],
        'Celestial Insight': [
            { dice: 0, range: 'No dice', type: 'Counter Stance', damage: 'Special', special: 'Reflect all the damage back (If not Critical Page). After a successful parry: Gain Power Up X(Damage reflected/20) (1-5) to self' }
        ],
        'Augury Kick': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 5 Tremor Potency on Target (Max.3)' },
            { dice: 1, range: '18-23', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 4 Tremor Potency' },
            { dice: 2, range: '17-24', type: 'Pierce', damage: 'Black', special: '[On Hit] Inflict Tremor Burst' }
        ],
        'Augury Crusher': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 5 Tremor Potency on Target (Max.3)' },
            { dice: 1, range: '19-23', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 6 Tremor Potency' }
        ],
        'True Trigram Formation': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 5 Tremor Potency on Target (Max.3)' },
            { dice: 1, range: '15-20', type: 'Slash', damage: 'Black', special: '[On Hit] Inflict 6 Tremor Potency' },
            { dice: 2, range: '20-25', type: 'Pierce', damage: 'Black', special: '[On Hit] Inflict 6 Tremor Potency' },
            { dice: 3, range: '25-30', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 6 Tremor Potency' }
        ],
        'Geon (☰)': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Only one of the Four Trigrams can be used per Scene. Once used, it cannot be re-used until all of the Four Trigrams have been used.<br>[On Play] Gain 2 Power Up this Scene' }
        ],
        'Gon (☷)': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Only one of the Four Trigrams can be used per Scene. Once used, it cannot be re-used until all of the Four Trigrams have been used.<br>[On Play] Gain 2 Protection this Scene' }
        ],
        'Gam (☵)': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Only one of the Four Trigrams can be used per Scene. Once used, it cannot be re-used until all of the Four Trigrams have been used.<br>[On Play] Restore 2 Light' }
        ],
        'Gi (☲)': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Only one of the Four Trigrams can be used per Scene. Once used, it cannot be re-used until all of the Four Trigrams have been used.<br>[On Play] Draw 2 Page' }
        ],
        'Unyielding Strike': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Restore 1 Light' },
            { dice: 1, range: '17-20', type: 'Slash', damage: 'Black', special: 'Inflict 4 Tremor Potency' },
            { dice: 2, range: '17-20', type: 'Blunt', damage: 'Black', special: 'Inflict 4 Tremor Potency' },
            { dice: 3, range: '12-30', type: 'Shield', damage: '-' }
        ],
        'Impugnatio Ultima': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only be used after HP below 60% <br>[On Play] If self flat HP lower than enemy, destroy all of the dices that\'s clashing with this Page <br>[On Use] Discard all pages on hand; Recieve X Slash DMG Up (X = Pages Discarded)' },
            { dice: 1, range: '14-24', type: 'Slash', damage: 'Pale', special: '[On Hit] Inflict 5 Tremor Potency' },
            { dice: 2, range: '18-28', type: 'Slash', damage: 'Pale', special: '[On Hit] Inflict 5 Tremor Potency' },
            { dice: 3, range: '22-32', type: 'Slash', damage: 'Pale', special: '[On Hit] Inflict 5 Tremor Potency' },
            { dice: 4, range: '26-36', type: 'Clash Dice - Slash', damage: 'Pale', special: '[On Hit] Inflict 5 Tremor Potency' },
            { dice: 5, range: '30-40', type: 'Clash Dice - Slash', damage: 'Pale', special: '[On Hit] Inflict 5 Tremor Potency' }
        ],
        
        // Zwei Association
        'Defensive Stance': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Scene Start] Draw this page.<br>[On Play] If Unit has Zwei\'s Defensive Stance then remove it.<br>If Unit does not have Zwei\'s Defensive Stance then gain it.<br>[Scene End] Discard this page.' },
            { dice: 1, range: '6-8', type: 'Clash Dice - Shield'}
        ],
        'Sharp Swipe': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 3 Tremor Potency on Target (Max.3)' },
            { dice: 1, range: '4-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Tremor Potency' }
        ],
        'Avert': [
            { dice: 1, range: '1-12', type: 'Evade', damage: '-', special: '[On Clash Win] Boosts next die\'s Max value by +3' },
            { dice: 2, range: '2-4', type: 'Shield', damage: '-' },
            { dice: 3, range: '3-5', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 1 Bind next Scene' }
        ],
        'Retaliate': [
            { dice: 1, range: '1-12', type: 'Evade', damage: '-', special: '[On Clash Win] boost next die\'s Max value by +3' },
            { dice: 2, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Tremor Potency' },
            { dice: 3, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Tremor Potency' }
        ],
        'Law and Order': [
            { dice: 1, range: '2-6', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Tremor Potency, [On Clash Win] deal 5 dmg' }
        ],
        'Your Shield': [
            { dice: 1, range: '2-14', type: 'Clash Dice - Shield', damage: '-', special: '[On Use] Gain 1 Taunt next Scene<br>Gain 1 Protection next Scene' }
        ],
        'Fence': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Give 1 Protection to all allies next Scene' },
            { dice: 1, range: '1-14', type: 'Evade', damage: '-' },
            { dice: 2, range: '4-9', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 4 Tremor Potency' },
            { dice: 3, range: '5-10', type: 'Shield', damage: '-' }
        ],
        'Handling Work': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 3 Tremor Potency on Target (Max.3)' },
            { dice: 1, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 4 Tremor Potency' },
            { dice: 2, range: '5-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 4 Tremor Potency' },
            { dice: 3, range: '10-16', type: 'Shield', damage: '-' }
        ],
        'Combat Preparation': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 2 Protection next Scene<br>Gain 1 Defense Power Up next Scene' },
            { dice: 1, range: '3-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Tremor Potency' },
            { dice: 2, range: '14-20', type: 'Shield', damage: '-' },
            { dice: 3, range: '8-15', type: 'Evade', damage: '-' }
        ],
        
        // Shi Association
        'Catch Breath': [
            { dice: 0, range: 'No dice', type: 'Buff Only', damage: 'Special', special: '[On Play] If HP under 40%, Gain 7 Poise Potency, 3 Poise Count and 3 Haste.' }
        ],
        'To Overcome Crisis': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If HP under 40%, Gain 2 Poise Potency and 1 Poise Count.' },
            { dice: 1, range: '2-7', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency and 2 Count' }
        ],
        'Extreme Edge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If HP under 40%, Gain 2 Poise Potency' },
            { dice: 1, range: '2-12', type: 'Slash', damage: 'Red', special: '[On Crit] Inflict 1 Immobilized' }
        ],
        'Desperate Struggle': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If HP under 40%, Gain 1 Attack Power Up' },
            { dice: 1, range: '3-5', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 1 Poise Potency' },
            { dice: 2, range: '3-5', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 1 Poise Potency' }
        ],
        'Endless Battle': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If HP under 40%, Gain +3 Max dice power in this Page.' },
            { dice: 1, range: '4-5', type: 'Evade', damage: '-' },
            { dice: 2, range: '3-5', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 1 Poise Potency' },
            { dice: 3, range: '3-5', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency and Count' }
        ],
        'Flying Sword': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If HP under 40%, Gain 2 Haste next Scene.' },
            { dice: 1, range: '5-7', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 1 Poise Potency' },
            { dice: 2, range: '5-7', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' }
        ],
        'Flashing Strike': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain +4 dice power in this Page if have 6+ Speed.' },
            { dice: 1, range: '5-8', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 1 Poise Potency and Count' },
            { dice: 2, range: '5-8', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency and Count' },
            { dice: 3, range: '6-9', type: 'Evade', damage: '-' }
        ],
        'Boundary of Death': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If HP under 40%, Gain 4 Poise Potency and 4 Poise Count.' },
            { dice: 1, range: '14-24', type: 'Slash', damage: 'Red', special: 'if dice roll a natural 20 then +144 damage' }
        ],
        
        // Cinq Southern Association
        'Declared Duel': [
            { dice: 0, range: 'No dice', type: 'Special Effect', damage: 'Special', special: '[On Play] Choose 1 enemy that has slower speed than you, Inflict them with Declared Duel. <br>Gain 2 Haste this Scene. <br>Every attack after this will deal 5 additional White damage if you have higher speed than the target.' }
        ],
        'Remise': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain +3 Max dice power in this Page if have 6+ Speed.' },
            { dice: 1, range: '4-8', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency' },
            { dice: 2, range: '5-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency and 1 Count' },
            { dice: 3, range: '6-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 1 Count' }
        ],
        'Flèche': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain +6 Min dice power in this Page if have 6+ Speed.<br>[On Use] Gain +3 Min dice power for each 5 Poise Potency (Max. 3)' },
            { dice: 1, range: '5-25', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 6 Poise Potency' }
        ],
        'Marche': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain +3 Max dice power in this Page if have 6+ Speed.' },
            { dice: 1, range: '5-18', type: 'Pierce', damage: 'White', special: '[On Hit] Gain 2 Poise Potency' },
            { dice: 2, range: '10-14', type: 'Pierce', damage: 'White', special: '[On Hit] Gain 2 Poise Potency and Count' }
        ],
        'Punition': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Gain 4 Haste this Scene.' },
            { dice: 1, range: '8-16', type: 'Evade', damage: '-', special: '[On Clash Win] next die gains +10 power' },
            { dice: 2, range: '12-22', type: 'Pierce', damage: 'Red', special: '[On Crit] deal +100% SP damage' }
        ],
        'Feint': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain +4 Max dice power in this Page if have 6+ Speed.' },
            { dice: 1, range: '8-19', type: 'Evade', damage: '-', special: '[On Clash Win] Gain 2 Poise Potency and Count' },
            { dice: 2, range: '14-20', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and Count' },
            { dice: 3, range: '9-17', type: 'Evade', damage: '-', special: '[On Clash Win] Gain 2 Poise Potency and Count' }
        ],
        'Balestra Fente': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Gain 3 Haste this Scene.<br>[On Use] Gain 1 Power Up this Scene.' },
            { dice: 1, range: '14-22', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Fragile (this and next Scene)' },
            { dice: 2, range: '12-18', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency and Count' },
            { dice: 3, range: '16-22', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency and Count' }
        ],
        
        // Cinq Western Association
        'Focused Attack': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Choose 1 enemy that has slower speed than you, Inflict them with Focused Attack. Every Scene you Attack the same weak point, Inflict more Focused Attack.' }
        ],
        'Allez': [
            { dice: 1, range: '5-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Count' },
            { dice: 2, range: '6-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 4 Rupture Potency and 1 Count' }
        ],
        'Riposte': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 3 Min dice power if target has 3+ Focused Attack.' },
            { dice: 1, range: '1-20', type: 'Counter', damage: 'Special', special: '15+ → Take 0.5× dmg & hit back 1× dmg, 20+ → Take 0 dmg & hit back 2× dmg, [On Clash Win] → Inflict 2 Rupture Count' },
            { dice: 2, range: '12-15', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' }
        ],
        'Coup Droit': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 3 Min dice power if target has 3+ Focused Attack.' },
            { dice: 1, range: '7-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 1 Count' },
            { dice: 2, range: '2-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' }
        ],
        'Fente': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 6 Min dice power if target has 3+ Focused Attack.' },
            { dice: 1, range: '8-16', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 5 Rupture Potency' }
        ],
        'Contre Attaque': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 3 Min dice power if target has 3+ Focused Attack.' },
            { dice: 1, range: '1-20', type: 'Counter', damage: 'Special', special: '15+ → Take 0.5× dmg & hit back 1× dmg, 20+ → Take 0 dmg & hit back 2× dmg, [On Clash Win] → Inflict 2 Rupture Count' },
            { dice: 2, range: '8-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' },
            { dice: 3, range: '3-18', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 4 Rupture Potency' }
        ],
        'Salut': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 5 dice power if target has 3+ Focused Attack.' },
            { dice: 1, range: '12-18', type: 'Pierce', damage: 'Red', special: '[On Clash Win] Inflict 3 Fragile this Scene' },
            { dice: 2, range: '9-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 3, range: '10-17', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 1 Count' },
            { dice: 4, range: '12-20', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 4 Rupture Potency and 2 Count' }
        ],
        
        // Liu Association
        'Ignite Weaponry': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Each attack dice will now also apply 1 additional Burn Potency for 5 Scenes<br>[On Use] Restore 1 Light<br>[On Use] Draw 1 Page<br>[After Use] Can only use again after the effects of "Ignite Weaponry" have worn out' }
        ],
        'Flowing Flame': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 1 Postive Emotion Point' },
            { dice: 1, range: '2-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Burn Potency' },
            { dice: 2, range: '2-4', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Burn Potency' }
        ],
        'Red Kick': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Emotion Level 2+ gain Max dice power +1 on attack dices' },
            { dice: 1, range: '3-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Burn Potency' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Burn Count' }
        ],
        'Fiery Knife Hand': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Emotion Level 2+ gain Max dice power +1 on attack dices' },
            { dice: 1, range: '3-7', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 2 Burn Potency' },
            { dice: 2, range: '2-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Burn Potency' },
            { dice: 3, range: '4-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Burn Count' }
        ],
        'Perfected Death Fist': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Emotion Level 2+ gain dice power +2 on attack dices' },
            { dice: 1, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Burn Potency' },
            { dice: 2, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Burn Count' },
            { dice: 3, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Burn Potency' },
            { dice: 4, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Burn Count' }
        ],
        'Pinpoint Blitz': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Emotion Level 2+ gain dice power +2 on attack dices' },
            { dice: 1, range: '2-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Burn Potency' },
            { dice: 2, range: '3-7', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 1 Burn Count' },
            { dice: 3, range: '4-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Burn Potency' }
        ],
        'Inner Gate Elbow Strike': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Emotion Level 2+ Inflict 2 additional Burn Potency per attack dice' },
            { dice: 1, range: '5-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 2, range: '6-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 3, range: '6-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 4, range: '7-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Burn Count' }
        ],
        'Frontal Assault': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Emotion Level 2+ gain dice power +2 on attack dices' },
            { dice: 1, range: '6-9', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 2, range: '5-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Burn Count' },
            { dice: 3, range: '6-10', type: 'Slash', damage: 'White', special: '[On Hit] Inflict 2 Burn Potency' }
        ],
        'Fiery Waltz': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Emotion Level 2+ gain dice power +2 on attack dices' },
            { dice: 1, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 2, range: '7-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Burn Count' }
        ],
        'Single-Point Stab': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Emotion Level 2+ gain Max dice power +1 on attack dices' },
            { dice: 1, range: '5-10', type: 'Evade', damage: '-', special: '[On Clash Win] Inflict 2 Burn Potency' },
            { dice: 2, range: '7-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Burn Potency' }
        ],
        'Emotional Turbulence': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 2 Positive Emotion Point' },
            { dice: 1, range: '7-10', type: 'Clash Dice - Shield', damage: '-', special: '[On Clash Win] Restore 1 Light' },
            { dice: 2, range: '7-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 3, range: '7-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 4, range: '7-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' }
        ],
        'Coordinated Assault': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Before Use] If Emotion Level 3+, Use this Page Twice on the same target<br>[On Use] If Emotion Level 2+ gain dice power +2 on attack dices' },
            { dice: 1, range: '6-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 2, range: '7-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Burn Count' },
            { dice: 3, range: '4-15', type: 'Slash', damage: 'White', special: '[On Hit] Inflict 3 Burn Potency' }
        ],
        'Inner Ardor': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 1 Positive Emotion Point' },
            { dice: 1, range: '9-13', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Burn Potency' },
            { dice: 2, range: '7-16', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' }
        ],
        'Fervid Emotions': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 Power for every 2 Emotion Levels' },
            { dice: 1, range: '6-16', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 2, range: '7-16', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Burn Potency' },
            { dice: 3, range: '7-16', type: 'Slash', damage: 'Red', special: 'Clash Dice - [On Hit] Inflict 3 Burn Potency' }
        ],
        'All-out War': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Give every ally 1 Power Up, 1 Protection<br>[On Use] All dice on this page gain +1 Power for every 2 Emotion Levels' },
            { dice: 1, range: '10-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Burn Potency' },
            { dice: 2, range: '9-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' }
        ],
        'Fiery Dragon Slash': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +3 dice Power for every 1 Emotion Levels' },
            { dice: 1, range: '22-30', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 2, range: '18-26', type: 'Slash', damage: 'Black', special: '[On Hit] Inflict 8 Burn Potency' }
        ],
        
        // Seven Association
        'Investigation': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: 'On Encounter] Each Insight work will now apply Weakness Analyzed for 1 Current Scene.<br>[On Play] Act as an Insight Work' },
        ],
        'Prodding': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Acts like an Insight work.' },
            { dice: 1, range: '8-12', type: 'Clash Dice - Slash', damage: 'Red', special: '[On Hit] guarantee a nat 20 Insight work this Page' },
            { dice: 0, range: 'No dice', type: 'Special', damage: '-', special: '[After Use] If rolled a nat 20 Insight work, Apply Weakness Exposed for 1 next Scene' }
        ],
        'Swash': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If "Investigation" is Active on the target, +1 Rupture Potency for each attack dice' },
            { dice: 1, range: '3-7', type: 'Slash', damage: 'Red', special: '[On Clash Win] Inflict 2 Rupture Count' },
            { dice: 2, range: '4-8', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency' }
        ],
        'Upwards Slash': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If "Investigation" is Active on the target, +1 dice power for every dice in this Page' },
            { dice: 1, range: '4-9', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 1 Rupture Count' },
            { dice: 2, range: '5-9', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency' }
        ],
        'Slash': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If "Investigation" is Active on the target, +1 dice power for every dice in this Page' },
            { dice: 1, range: '4-7', type: 'Slash', damage: 'Red', special: '[On Clash Win] Inflict 2 Rupture Count' },
            { dice: 2, range: '4-7', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 1 Rupture Potency' }
        ],
        'Predictive Analysis': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If "Investigation" is Active on the target, roll an Insight work; If rolled a nat 15 over then randomly destroy 1 dice in the target\'s Page' },
            { dice: 1, range: '6-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 1 Fragile this Scene' },
            { dice: 2, range: '5-11', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 1 Rupture Potency and Count' },
            { dice: 3, range: '7-9', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' }
        ],
        'Profiling': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Deal additional +5 damage each attack dice to enemy with Weakness Analyzed.' },
            { dice: 1, range: '5-11', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 1 Fragile this Scene' },
            { dice: 2, range: '4-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 3, range: '5-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 4, range: '6-11', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' }
        ],
        'Forensics': [
            { dice: 1, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Clash Win] Inflict 2 Rupture Count' },
            { dice: 2, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 3, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 4, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' }
        ],
        'Exploit The Gap': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If target has both Weakness Analyzed and Weakness Exposed then destroy all dices in the target\'s "Clashing" Page' },
            { dice: 1, range: '16-20', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Fragile this Scene' },
            { dice: 2, range: '12-18', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and Count' },
            { dice: 3, range: '12-20', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and Count' }
        ],
        
        // Devyat Association
        'Courier Support & Control Sequence': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Page Passive: Always Active] Gain 3 Courier Trunk<br>[On Use] Gain a Shield (Courier Trunk X2%Max HP) (Max 30%)<br>[On Use] Restore 1 Light<br>[On Use] If user have 25+ Courier Trunk; Retreat (Once per Encounter) and after 2 Scenes, Return and halve the Courier Trunk Stacks<br>[After Use] Gain 5 Courier Trunk' }
        ],
        'Courier Trunk - Decay Knife': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Courier Trunk on self, gain 1 dice Power<br>[On Use] At 10+ Courier Trunk, Gain 1 Haste next Scene for every 10 Courier Trunk (Max 2)' },
            { dice: 1, range: '6-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 2, range: '7-9', type: 'Slash', damage: 'White', special: '[On Hit] Inflict 3 Rupture Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Gain 1 Courier Trunk, if Courier Trunk less than 15 Stacks gain 1 additional Courier Trunk' }
        ],
        'Courier Trunk - Decay Hammer': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Courier Trunk on self, gain 1 dice Power<br>[On Use] At 10+ Courier Trunk, Gain Shield this Scene (Courier Trunk X0.5%Max HP) (Max 10%)' },
            { dice: 1, range: '6-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 2, range: '7-9', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 3 Rupture Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Gain 1 Courier Trunk, if Courier Trunk less than 15 Stacks gain 1 additional Courier Trunk' }
        ],
        'Courier Trunk - Gadget Reveal': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Courier Trunk on self, gain 1 dice Power<br>[On Use] At 10+ Courier Trunk, Gain 1 Protection this Scene for every 10 Courier Trunk (Max 2)' },
            { dice: 1, range: '10-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 2, range: '10-12', type: 'Slash', damage: 'White', special: '[On Hit] Inflict 4 Rupture Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Gain 2 Courier Trunk, if Courier Trunk less than 15 Stacks gain 1 additional Courier Trunk' }
        ],
        'Courier Trunk - Demolition Gadget': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Courier Trunk on self, gain 1 dice Power<br>[On Use] At 10+ Courier Trunk, Gain 1 Protection this Scene for every 10 Courier Trunk (Max 2)' },
            { dice: 1, range: '10-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 2, range: '10-12', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 4 Rupture Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Gain 2 Courier Trunk, if Courier Trunk less than 15 Stacks gain 1 additional Courier Trunk' }
        ],
        'Courier Trunk - Assistance & Crisis Control System': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If at 20+ Courier Trunk, Heal for (Courier Trunk/2)% Max HP<br>[On Use] Restore 1 Light<br>[On Use] Draw 1 Page<br>[On Use] Gain 1 Haste next Scene' }
        ],
        'Courier Trunk - Poludnitsa': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Before Use] Deal +(Courier Trunk)% damage with this Page.<br>[On Use] If 20+ Courier Trunk, Target 1 additional random enemy or part for 50% Final damage (If there is only 1 enemy or part left, target that)' },
            { dice: 1, range: '15-22', type: 'Clash Dice - Slash', damage: 'Pale', special: 'Clash Dice - [On Hit] Inflict 5 Rupture Potency and Count' },
            { dice: 2, range: '15-22', type: 'Clash Dice - Blunt', damage: 'Pale', special: 'Clash Dice - [On Hit] Inflict 5 Rupture Potency and Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Gain 4 Courier Trunk, if Courier Trunk less than 15 Stacks gain 1 additional Courier Trunk' }
        ],
        
        // Dieci Association
        'Holy Insight': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Act as an Insight work, Gain 2 Taunt next Scene<br>[On Use] When you do Insight work on a Target, Gain 1 Insight and 2 Taunt next Scene<br>[On Use] Draw 3 Pages<br>[After Use] Increase 1 Light for each Usage' }
        ],
        'Expend Knowledge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] If Discarded, Gain 1 Insight<br>[On Play] Discard 1 Chosen Page<br>[On Use] Gain 1 Erudition for each attack dice hit; If didn\'t take HP damage this Scene, Gain 2 additional Erudition<br>[On Use] Gain (Erudition X2) Shield for this Scene' },
            { dice: 1, range: '10-11', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and Count' }
        ],
        'Unveil': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] If Discarded, Restore 1 Light<br>[On Play] Discard 1 Chosen Page<br>[On Use] Gain 1 Erudition for each attack dice hit; If didn\'t take HP damage this Scene, Gain 2 additional Erudition'},
            { dice: 1, range: '8-10', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Count' },
            { dice: 2, range: '12-12', type: 'Shield', damage: '-', special: 'Gain +Shield Value for Insight' },
            { dice: 3, range: '8-12', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 3 Sinking Potency and 1 Count' }
        ],
        'Studious Dedication': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] If Discarded, Draw 1 Page<br>[On Play] Discard 1 Chosen Page<br>[On Use] Gain 1 Erudition for each attack dice hit; If didn\'t take HP damage this Scene, Gain 2 additional Erudition<br>[On Use] All dice on this page gain +1 dice Power for every 2 Insight (Max.3)'},
            { dice: 1, range: '10-14', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency Count' },
            { dice: 2, range: '12-15', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 3 Sinking Potency and 2 Count' }
        ],
        'Guiding Steps': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] If Discarded, Shield an ally for +(Insight X4)% Max HP (Max 20%)<br>[On Play] Discard 1 Chosen Page<br>[On Use] Gain 1 Erudition for each attack dice hit; If didn\'t take HP damage this Scene, Gain 2 additional Erudition'},
            { dice: 1, range: '12-17', type: 'Shield', damage: '-', special: 'If HP not damage taken, Inflict 2 Sinking Potency and Count; Gain 1 Erudition' },
            { dice: 2, range: 'No dice', type: 'Special', damage: 'Special', special: 'Do Insight work; if roll lower than 10, fail and do not gain Insight' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Shield an ally for +(Insight X2)% Max HP (Max 10%)' }
        ],
        'Excruciating Study': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] If Discarded, Draw 1 Page<br>[On Play] Discard 1 Chosen Page<br>[On Use] Gain 1 Erudition for each attack dice hit; If didn\'t take HP damage this Scene, Gain 2 additional Erudition<br>[On Use] All dice on this page gain +1 dice Power for every 2 Insight (Max.3)<br>[On Use] Deal +(Insight X10)% damage with this Page (Max 50%)'},
            { dice: 1, range: '10-14', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 2 Sinking Potency Count' },
            { dice: 2, range: '12-15', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 3 Sinking Potency and 2 Count' },
            { dice: 3, range: '13-14', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 3 Sinking Potency and 2 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Remove 2 Insight onself'},
        ],
        'Weight of Knowledge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Only one of the 3 Knowledge Pages can be used per Scene. Everytime you use one the Light Usage of all other Knowledge Pages increases by 1<br>[Condition] Draw all Knowledge Pages when used up current on Deck<br>[On Play] Select 1 ally and give them: 2 Power Up this and next Scene; If user has 5+ Insight, Gain 1 additional Power Up<br>[On Play] 2 Haste this and next Scene; If user has 5+ Insight, Gain 1 additional Haste' }
        ],
        'Missionary of Knowledge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Only one of the 3 Knowledge Pages can be used per Scene. Everytime you use one the Light Usage of all other Knowledge Pages increases by 1<br>[Condition] Draw all Knowledge Pages when used up current on Deck<br>[On Play] Select 1 ally and give them: 2 Protection this and next Scene; If user has 5+ Insight, Gain 1 additional Protection<br>[On Play] 2 Bind this and next Scene; If user has 5+ Insight, Remove 1 Bind' }
        ],
        'Grace of Knowledge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Only one of the 3 Knowledge Pages can be used per Scene. Everytime you use one the Light Usage of all other Knowledge Pages increases by 1<br>[Condition] Draw all Knowledge Pages when used up current on Deck<br>[On Play] Select 1 ally and give them: 2 Healing Up this and next Scene; If user has 5+ Insight, Gain 1 additional Healing Up<br>[On Play] 2 SP Healing Up this and next Scene; If user has 5+ Insight, Gain 1 additional SP Healing Up' }
        ],
        'Scorched Knowledge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] If Discarded, Restore 2 Light<br>[On Play] Discard all Pages on Deck<br>[On Use] Gain 1 Erudition for each attack dice hit; If didn\'t take HP damage this Scene, Gain 2 additional Erudition<br>[On Use] All dice on this page gain +1 dice Power for every 2 Insight (Max.5)<br>[On Use] Deal +(Insight X10)% damage with this Page'},
            { dice: 1, range: '8-10', type: 'Blunt', damage: 'Pale', special: '[On Hit] Inflict 4 Sinking Potency and Count' },
            { dice: 2, range: '7-12', type: 'Blunt', damage: 'Pale', special: '[On Hit] Inflict 4 Sinking Potency' },
            { dice: 3, range: '7-13', type: 'Blunt', damage: 'Pale', special: '[On Hit] Inflict 4 Sinking Potency' },
            { dice: 4, range: '8-11', type: 'Blunt', damage: 'Pale', special: '[On Hit] Inflict 4 Sinking Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Heal 2 allies for 20% damage dealt in with this Page<br>[After Use] Clear all Insight on self' }
        ],
        
        // Öufi Association
        'Sentence': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only be used on one Target at a time, but can\'t be used unless the current Target is gone<br>[On Play] Mark a Target, They become more vulnerable to Tremor. When they have:<br></br>20+ Tremor Potency, Gain 1 additional Tremor Potency<br>40+ Tremor Potency, Gain 2 additional Tremor Potency<br>75+ Tremor Potency, Gain 3 additional Tremor Potency' },
            { dice: 1, range: '10-16', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Tremor - Execution Potency' }
        ],
        'Execution Advised': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 5 Tremor Potency on Target (Max.4)' },
            { dice: 1, range: '6-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Tremor Potency' },
            { dice: 2, range: '8-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Tremor Potency' }
        ],
        'Execution Sentencing': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 5 Tremor Potency on Target (Max.4)' },
            { dice: 1, range: '9-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Tremor Potency' },
            { dice: 2, range: '8-13', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Tremor Potency' }
        ],
        'Do Not Obstruct': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 5 Tremor Potency on Target (Max.4)' },
            { dice: 1, range: '9-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Tremor Potency' },
            { dice: 2, range: '8-13', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Tremor Potency' },
            { dice: 3, range: '9-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Tremor Potency and Tremor Conversion into Tremor - Execution' }
        ],
        'Grave Attendance': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Count and compare the number of allies and enemies, If more allies than enemies Inflict Intimidation on all enemies. If more enemies than allies Gain Resolved on all allies.<br>[On Use] All dice on this page gain +1 dice Power for every 5 Tremor Potency on Target (Max.4)<br>[On Use] All dice on this page Inflict +1 Tremor Potency per Ally ' },
            { dice: 1, range: '12-18', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Tremor Potency' },
            { dice: 2, range: '14-18', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 6 Tremor Potency' }
        ],
        'First Warning': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Max HP must be under 90%<br>[On Play] Add +5 Tremor Potency (Cannot receive additional numbers)' }
        ],
        'Second Warning': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Max HP must be under 70%<br>[On Play] Add +10 Tremor Potency (Cannot receive additional numbers)' }
        ],
        'Final Warning': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Max HP must be under 50%<br>[On Play] Add +20 Tremor Potency (Cannot receive additional numbers)' }
        ],
        'Bona Fide': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only use if enemy has 60+ Tremor Potency<br>[On Play] Roll a 1d20, Inflict Tremor Potency as dice result' }
        ],
        'Execution Imminent': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 5 Tremor Potency on Target (Max.4)' },
            { dice: 1, range: '17-20', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 6 Tremor Potency' },
            { dice: 2, range: '17-20', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 6 Tremor Potency' },
            { dice: 3, range: '17-20', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 6 Tremor Potency and Tremor Conversion into Tremor - Execution' }
        ],
        'Obligation Fulfillment': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 5 Tremor Potency on Target (Max.4)' },
            { dice: 1, range: '14-19', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 6 Tremor Potency' },
            { dice: 2, range: '14-19', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 6 Tremor Potency' },
            { dice: 3, range: '14-19', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 6 Tremor Potency and apply Amplitude Conversion into Tremor - Execution' }
        ],
        'Unrelenting Execution': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 5 Tremor Potency on Target (Max.4)' },
            { dice: 1, range: '13-20', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 7 Tremor Potency' },
            { dice: 2, range: '12-22', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 7 Tremor Potency' },
            { dice: 3, range: '13-22', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 7 Tremor Potency' },
            { dice: 4, range: '13-23', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 7 Tremor Potency' },
            { dice: 5, range: '13-24', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict Tremor Burst' }
        ],
        
        // The Thumb 
        'Reload Bullets': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Must have a Ranged Weapon equipped<br>[On Play] Randomly Draw 1 Thumb Ammunition Page' }
        ],
        'Shock Ammunition': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only use 1 Thumb Ammunition type per Scene<br>[On Play] If first time using this Page in this Scene, Every attack dice will have a 50% chance to [On Hit] Inflict 1 Paralyze for 1 Scene(roll 1d2)<br>[On Play] If second time using this Page in this Scene, Every attack dice will have a 100% chance to [On Hit] Inflict 1 Paralyze for 1 Scene' }
        ],
        'Incendiary Ammunition': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only use 1 Thumb Ammunition type per Scene<br>[On Play] If first time using this Page in this Scene, Every attack dice will [On Hit] Inflict 3 Burn Potency for 1 Scene<br>[On Play] If second time using this Page in this Scene, Every attack dice will [On Hit] Inflict 6 Burn Potency for 1 Scene' }
        ],
        'Armor-Piercing Ammunition': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only use 1 Thumb Ammunition type per Scene<br>[On Play] If first time using this Page in this Scene, Weaken every dice Power that is clashing with yours by 2 for 1 Scene<br>[On Play] If second time using this Page in this Scene, Weaken every dice Power that is clashing with yours by 4 for 1 Scene' }
        ],
        'Frost Ammunition': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only use 1 Thumb Ammunition type per Scene<br>[On Play] If first time using this Page in this Scene, Every attack dice will [On Hit] Inflict 1 Bind for 1 next Scene (Applies next Scene) (Max. 2)<br>[On Play] If second time using this Page in this Scene, Every attack dice will [On Hit] Inflict Immobilized for 1 next Scene (Applies next Scene) (Max.1)' }
        ],
        'Suppressing Shot': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 1  Page Drawn this Scene (Max.3)' },
            { dice: 1, range: '9-12', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet' },
            { dice: 2, range: '8-13', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet' }
        ],
        'Focus Fire': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 1  Page Drawn this Scene (Max.3)' },
            { dice: 1, range: '10-13', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet' },
            { dice: 2, range: '8-14', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet' },
            { dice: 3, range: '10-13', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet' }
        ],
        'Steel Knuckles': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 1  Page Drawn this Scene (Max.3)' },
            { dice: 1, range: '10-15', type: 'Shield', damage: '-' },
            { dice: 2, range: '10-13', type: 'Blunt', damage: 'Red' },
            { dice: 3, range: '10-13', type: 'Blunt', damage: 'Red', special: '[On Hit] Draw 1 Page' }
        ],
        'Class and Respect': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 1  Page Drawn this Scene (Max.3)<br>[On Use] All ally dices receives 2 dice Power for 1 next Scene<br>[On Use] All allies receives 2 Power Up for 1 next Scene' },
            { dice: 1, range: '11-14', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet' },
            { dice: 2, range: '11-14', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet' },
            { dice: 3, range: '11-14', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet' }
        ],
        'Summary Judgement': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 1  Page Drawn this Scene (Max.3)<br>[On Use] Reduce Target dice Power by 2 on every dice this Scene' },
            { dice: 1, range: '10-17', type: 'Shield', damage: '-' },
            { dice: 2, range: '10-16', type: 'Blunt', damage: 'Red' },
            { dice: 3, range: '10-16', type: 'Blunt', damage: 'Red', special: '[On Hit] Draw 1 Page' }
        ],
        'Discipline': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Dices on this Page and Clashing with this Page is not and will not be affected by Dice Power gain or reduce.' },
            { dice: 1, range: '13-17', type: 'Shield', damage: '-' },
            { dice: 2, range: '13-17', type: 'Blunt', damage: 'Red' },
            { dice: 3, range: '12-19', type: 'Blunt', damage: 'Red', special: '[On Hit] Draw 1 Thumb Ammunition' },
            { dice: 4, range: '13-20', type: 'Blunt', damage: 'Red', special: '[On Hit] re-use this dice 3 times' }
        ],
        'Le Regole': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 1  Page Drawn this Scene (Max.3)<br>[On Use] All ally dices deal 4 additional base damage' },
            { dice: 1, range: '12-20', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet' },
            { dice: 2, range: '12-21', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet' },
            { dice: 3, range: '12-19', type: 'Shield', damage: '-' }
        ],
        
        // The Index 
        'To Where the Prescript Points': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Randomly choose a Target (Bodypart) and Inflict it with 1 Fragile while all other enemies gain 1 Protection until the chosen Target dies or breaks. While targeting the chosen Target, Allies in the Index will gain 1 Attack Power Up<br>[On Use] Draw 3 Pages' }
        ],
        'Faith': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Gain +4 dice Power<br>[On Use] Restore 1 Light' },
            { dice: 1, range: '4-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count' },
            { dice: 2, range: '5-9', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' }
        ],
        'Proselyte\'s Blade': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Gain +4 dice Power<br>[On Use] All dices other than this Page get reduced by 3' },
            { dice: 1, range: '5-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count' },
            { dice: 2, range: '5-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' }
        ],
        'Execute': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Gain +4 dice Power' },
            { dice: 1, range: '6-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '6-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' }
        ],
        'Sense Quarry': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Gain +4 dice Power<br>[On Use] If there are 7 or more Pages on Deck, Gain +2 dice Power' },
            { dice: 1, range: '5-8', type: 'Shield', damage: '-' },
            { dice: 2, range: '5-8', type: 'Shield', damage: '-' },
            { dice: 3, range: '5-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bind next Scene' }
        ],
        'Will of the Prescript': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Draw 3 Pages' },
            { dice: 1, range: '2-12', type: 'Evade', damage: '-' },
            { dice: 2, range: '5-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 3, range: '5-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count' }
        ],
        'Undertake Prescript': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Gain +4 dice Power' },
            { dice: 1, range: '5-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count' },
            { dice: 2, range: '5-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 3, range: '5-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count' }
        ],
        'Multislash': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Restore 2 Light<br>[On Use] Draw 2 Pages' },
            { dice: 1, range: '5-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and 2 Count' },
            { dice: 2, range: '5-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' }
        ],
        'Binding Chains': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Reduce all Target\'s dice Power by 2' },
            { dice: 1, range: '5-12', type: 'Slash', damage: 'Red', special: '[On Clash Win] If Singleton reduce Target\'s next dice dice Power by 3' },
            { dice: 2, range: '5-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count' }        ],
        'Heavy Trace': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Dices on this Pages and Clashing with it are unaffected by dice Power gain or loss' },
            { dice: 1, range: '6-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '6-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Add "Swift Trace" to Deck' },
        ],
        'Swift Trace': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Dices on this Pages and Clashing with it are unaffected by dice Power gain or loss' },
            { dice: 1, range: '6-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '6-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count' },
            { dice: 3, range: '7-13', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bind next Scene' }
        ],
        'Unlock - I': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Draw 1 Page' },
            { dice: 1, range: '4-10', type: 'Slash', damage: 'Red' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Add "Unlock - II" to Deck' },
        ],
        'Unlock - II': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Draw 1 Page and Restore 1 Light' },
            { dice: 1, range: '5-12', type: 'Slash', damage: 'Red' },
            { dice: 2, range: '5-12', type: 'Slash', damage: 'Red' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Add "Unlock - III" to Deck' },
        ],
        'Unlock - III': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Draw 1 Page and Restore 2 Light' },
            { dice: 1, range: '6-12', type: 'Slash', damage: 'Red' },
            { dice: 2, range: '6-12', type: 'Slash', damage: 'Red' },
            { dice: 3, range: '6-12', type: 'Slash', damage: 'Red' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Add "Unlock - IV" to Deck' },
        ],
        'Unlock - IV': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Draw 2 Page and Restore 2 Light' },
            { dice: 1, range: '6-14', type: 'Slash', damage: 'Red' },
            { dice: 2, range: '6-14', type: 'Slash', damage: 'Red' },
            { dice: 3, range: '6-14', type: 'Slash', damage: 'Red' },
            { dice: 4, range: '6-14', type: 'Slash', damage: 'Red' }
        ],
        'Blade Unlock': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only be used after proccing Singleton 10+ times<br>[On Play] Gain Blade Unlocked<br>[On Play] Draw 2 Pages, Restore 4 Light, Heal 30 HP' }
        ],
        'Eliminate': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Singleton, Give 2 Power Up to all allies this Scene' },
            { dice: 1, range: '6-15', type: 'Slash', damage: 'Red', special: '[On Clash Win] If Target has 50% or less Max HP Deal additional 5 Dmg' },
            { dice: 2, range: '6-15', type: 'Slash', damage: 'Red', special: '[On Clash Win] If Target has 50% or less Max HP Deal additional 5 Dmg' }
        ],
        'Eradication': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only be used after Gaining Blade Unlocked<br>[On Use] If user have 6+ Pages on Deck, Gain +20 Clash dice Power' },
            { dice: 1, range: '23-45', type: 'Blunt', damage: 'Red', special: '[On Clash Win] Inflict 2 Fragile next Scene' }
        ],
        'Decapitation': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only be used after Gaining Blade Unlocked' },
            { dice: 1, range: '17-28', type: 'Slash', damage: 'Red', special: '[On Clash Win] Inflict 3 Fragile next Scene and 10 Bleed Potency and 3 Count' }
        ],
        'Castigation': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only be used after Gaining Blade Unlocked<br>[On Use] Reduce all enemy dice Power by 12' },
            { dice: 1, range: '7-21', type: 'Pierce', damage: 'Pale', special: '[On Clash Win] Inflict 7x times SP damage as the natural roll (attack dice roll), If cannot deal SP damage then deal x2 Pale Damage instead' },
            { dice: 2, range: '7-25', type: 'Clash Dice - Pierce', damage: 'Red'}
        ],
        
        // The Middle 
        'Checking the Book': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Encounter] Instead of Repression Work in an Encounter, now change it to Checking the Book.<br>[On Encounter] Gain Book of Vengeance. <br>[When Max Hp under 20%] Change it back to Repression Work.' },
            { dice: 1, range: '10-15', type: 'Shield', damage: '-' }
        ],
        'Punching': [
            { dice: 1, range: '5-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '6-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'Kicking': [
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '5-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count' },
            { dice: 3, range: '6-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'Aim for the Solar Plexus': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain X Blunt DMG Up for each dice hit within the last Scene<br>[After Use] Add "Right in the Solar Plexus" to Deck' }
        ],
        'Right in the Solar Plexus': [
            { dice: 1, range: '4-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '5-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count' },
            { dice: 3, range: '6-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'Proof of Loyalty': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If target has X Vengeance Mark, Gain +X dice Power (Max. 3)' },
            { dice: 1, range: '5-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '5-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count' },
            { dice: 3, range: '6-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'Chains of Loyalty': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If target has X Vengeance Mark, Gain +X dice Power (Max. 3)' },
            { dice: 1, range: '5-11', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bind next Scene' },
            { dice: 2, range: '6-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'Payback': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain X Blunt DMG Up for each dice hit with in the last Scene.' },
            { dice: 1, range: '12-19', type: 'Shield', damage: '-', special: 'If shield breaks; the next "Payback with Interest" deals +1x the Damage received by this Page' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Add "Payback with Interest" to Deck' },
        ],
        'Payback with Interest': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If target has X Vengeance Mark, Gain +X dice Power (Max. 3)' },
            { dice: 1, range: '8-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count' },
            { dice: 2, range: 'Variable', type: 'Blunt', damage: 'Red', special: 'Deal Red Damage equally to the damage taken in last Scene, [On Hit] Inflict 1 Paralyze' }
        ],
        'Write em\' All Down': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] If the target is already in the Book, refund the Light used<br>[Condition] Target must have 10 Vengeance Mark<br>[On Play] The target gets written down in the book, even if they run away. The Middle Remembers.' }
        ],
        'Vengeance Awaits You All': [
            { dice: 1, range: '8-13', type: 'Blunt', damage: 'Red' }
        ],
        'Promised Suffering': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If target has X Vengeance Mark, Restore +X Light (Max. 5)' },
            { dice: 1, range: '7-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and 2 Count' },
            { dice: 2, range: '8-15', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'ENOUGH GAMES!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If target has X Vengeance Mark, Gain +X dice Power (Max. 3)' },
            { dice: 1, range: '12-20', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Paralyze' }
        ],
        'A Just Vengeance': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If target has X Vengeance Mark, Gain +X dice Power (Max. 3)' },
            { dice: 1, range: '9-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '9-13', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count' },
            { dice: 3, range: '9-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Paralyze' },
            { dice: 4, range: '10-15', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Paralyze' }
        ],
        'MY HAIR COUPONS!!!!!': [
            { dice: 1, range: '25-50', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Paralyze' }
        ],
        'COMPLETE AND TOTAL EXTERMINATION!!!': [
            { dice: 1, range: '8-11', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Paralyze' },
            { dice: 2, range: '8-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Paralyze' },
            { dice: 3, range: '9-13', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Bleed Potency' },
            { dice: 4, range: '9-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Bleed Potency and Count' },
            { dice: 5, range: '10-16', type: 'Blunt', damage: 'Red', special: '[On Hit] Deal Y (each target) additional Red Damage (Y=Xx5)' }
        ],
        
        // The Ring 
        'The Canvas': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can be re-used how much ever you want<br>[On Play] Each Work Type will now change into:<br>Instinct = Red<br>Insight = White<br>Attachment = Black<br>Repression = Pale<br>When you perform a Work Type: The Ring Pages will now Change the Damage Type Corresponding to the Work Type done if rolled a nat 20.<br>Always start with Red Damage.' }
        ],
        'Paint': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, Inflict x2 the Bleed Potency or Count in this Page' },
            { dice: 1, range: '5-8', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 4 Bleed Potency' },
            { dice: 2, range: '4-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target doesn\'t have Colored, Inflict it on them. If they do then clear the Colored status' }
        ],
        'Splatter': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, This Page is repeated on another Target (If there are no other Target, then hit the current Target with this Page again)' },
            { dice: 1, range: '5-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '5-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target doesn\'t have Colored, Inflict it on them. If they do then clear the Colored status' }
        ],
        'Coloring': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, This Page is repeated on another Target (If there are no other Target, then hit the current Target with this Page again)' },
            { dice: 1, range: '5-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '5-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target doesn\'t have Colored, Inflict it on them. If they do then clear the Colored status' }
        ],
        'Brushstroke': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, Inflict 1 Fragile next Scene' },
            { dice: 1, range: '6-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 4 Bleed Potency' },
            { dice: 2, range: '6-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target doesn\'t have Colored, Inflict it on them. If they do then clear the Colored status' }
        ],
        'Dotting': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, Inflict Colored on all enemies next Scene' },
            { dice: 1, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '5-13', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count' },
            { dice: 3, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target doesn\'t have Colored, Inflict it on them' }
        ],
        'Natural Style': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, Max dice power +3' },
            { dice: 1, range: '4-13', type: 'Evade', damage: '-', special: 'On Evade Gain 2 Power Up next Scene' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored then clear it' }
        ],
        'A Single Point of Art': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, Inflict 1 Fragile on all enemies next Scene' },
            { dice: 1, range: '10-16', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Fragile next Scene' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target doesn\'t have Colored, Inflict it on them' }
        ],
        'Beat the Brush': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, Inflict 5 Bleed Potency and 3 Count to every Target' },
            { dice: 1, range: '8-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '8-15', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target doesn\'t have Colored, Inflict it on them. If they do then clear the Colored status' }
        ],
        'Artwork Inspection': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, Max dice power +5' },
            { dice: 1, range: '7-19', type: 'Evade', damage: '-', special: 'On Evade Inflict Colored on all Targets' }
        ],
        'Hematic Coloring': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, Max dice power +5' },
            { dice: 1, range: '9-16', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '9-16', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target doesn\'t have Colored, Inflict it on them. If they do then clear the Colored status' }
        ],
        'Pointillism': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, Add "Sanguine Pointillism" to Deck' },
            { dice: 1, range: '10-18', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '10-18', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 3, range: '10-18', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 4, range: '10-18', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target doesn\'t have Colored, Inflict it on them. If they do then clear the Colored status' }
        ],
        'Sanguine Pointillism': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If enemy is Colored, x2 the Target\'s current Bleed Potency<br>[On Use] For every 10 Bleed Potency on Target, Re-use Dice 1 on the Target (Max. 4)' },
            { dice: 1, range: '11-20', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 4 Bleed Potency' }
        ],
        'Blood of the Valley': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If every target is Colored,Turn into a Mass Individual Page' },
            { dice: 1, range: '10-18', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '10-18', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 3, range: '10-18', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 4, range: '10-18', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 5, range: '10-18', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target doesn\'t have Colored, Inflict it on them. If they do then clear the Colored status' }
        ],
        
        // Kurokumo Clan
        'Rules of the Backstreets': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Before Use] If user has Darkcloud Blade, this Page automatically rolls a nat 20<br>Go into a Counter Stance, roll 1d20<br>If rolled a nat 20, Counter the damage twice onto the same target' }
        ],
        'Focus Strike': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-7', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Potency' }
        ],
        'Downward Slash': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-6', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Potency' },
            { dice: 2, range: '3-5', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' }
        ],
        'Clean Up': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '3-7', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '4-6', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Count' }
        ],
        'Cleave': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-9', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' }
        ],
        'Lenticular Swirl': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 4)' },
            { dice: 1, range: '4-8', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '5-7', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Add Page "Lenticular Rend" to Deck' }
        ],
        'Lenticular Rend': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 4)' },
            { dice: 1, range: '1-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '10-16', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Scene End] Gain 1 Darkcloud Blade' }
        ],
        'Stormcloud': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 4)' },
            { dice: 1, range: '5-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and 2 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Scene End] Gain 1 Darkcloud Blade' }
        ],
        'Cloudburst': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 4)<br>[On Use] If user has Darkcloud Blade, Re-use Dice 2 twice' },
            { dice: 1, range: '7-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '6-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and 2 Count' }
        ],
        'Sharpened Blade': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If user has Darkcloud Blade, Gain 2 Slash DMG Up next Scene<br>[On Use] Gain 1 Slash DMG Up next Scene' }
        ],
        'Thundercleave': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 5)' },
            { dice: 1, range: '7-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '6-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and 2 Count' },
            { dice: 3, range: '4-15', type: 'Clash Dice - Shield', damage: '-'}
        ],
        'Ink Over': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 5)' },
            { dice: 1, range: '7-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '6-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 4 Bleed Potency and 2 Count' },
            { dice: 3, range: '5-15', type: 'Slash', damage: 'Red', special: 'Clash Dice - [On Hit] Inflict 5 Bleed Potency and 3 Count' },
            { dice: 4, range: '10-15', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 1 Inked next Scene' }
        ],
        
        // Blade Lineage
        'Overthrow': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] User must have 20+ Poise Potency<br>[On Use] If user has 20+ Poise Potency and 10+ Poise Count, Consume 10 Poise Count to guarantee a nat 20 on this Page.<br>If rolled a nat 20 and took damage while using this Page Immediately add and use "Overthrow: Counter Slash" unopposed.<br>If user took over 50+ HP Dmg, Double the damage of "Overthrow: Counter Slash".' }
        ],
        'Overthrow: Counter Slash': [
            { dice: 1, range: '10-12', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency and 1 Count' },
            { dice: 2, range: '12-14', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' },
            { dice: 3, range: '14-16', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency and 3 Count' },
            { dice: 4, range: '16-18', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 5 Poise Potency and 4 Count' },
            { dice: 5, range: '18-20', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 6 Poise Potency and 5 Count' }
        ],
        'Draw of the Sword': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Poise Potency the User has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '5-12', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency' },
            { dice: 2, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 3 Count' }
        ],
        'Heel Turn': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Poise Potency the User has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-15', type: 'Shield', damage: '-', special: '[On Clash Win] Gain 2 Poise Potency' },
            { dice: 2, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' }
        ],
        'Flank Thrust': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Poise Potency the User has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-20', type: 'Evade', damage: '-', special: '[On Clash Win] Gain 3 Poise Potency' },
            { dice: 2, range: '8-15', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency and 2 Count' }
        ],
        'Moonlit Blade Dance': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Poise Potency the User has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '6-14', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' },
            { dice: 2, range: '6-14', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' },
            { dice: 3, range: '6-14', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' }
        ],
        'Blade Arc': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Poise Potency the User has, Gain +1 dice Power Up (Max. 4)' },
            { dice: 1, range: '7-23', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 8 Poise Potency and 3 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Scene End] Restore 1 Light' },
        ],
        'Acupuncture': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Poise Potency the User has, Gain +1 dice Power Up (Max. 4)' },
            { dice: 1, range: '9-15', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' },
            { dice: 2, range: '8-16', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' },
            { dice: 3, range: '7-17', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' }
        ],
        'Slay': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Poise Potency the User has, Gain +1 dice Power Up (Max. 4)' },
            { dice: 1, range: '5-17', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 5 Count' },
            { dice: 2, range: '4-18', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 2 Power Up and 1 Slash DMG Up next Scene' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Scene End] Restore 2 Light' },
        ],
        'Yield My Flesh': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 1 Poise Potency the User has, Gain +1 dice Power Down (Max. 20)' },
            { dice: 1, range: '20-0', type: 'Slash', damage: 'Red', special: '[On Clash Lose] Immediately add and use "To Claim Their Bones"<br>[On Clash Lose] Inflict 2 Fragile this Scene' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: 'If user took over 50+ HP DMG, Double the damage of "To Claim Their Bones"<br>[Scene End] Restore 1 Light' }
        ],
        'To Claim Their Bones': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 1 Poise Potency the User has, Gain +1 dice Power Down (Max. 20)<br>[On Use] If this Page targets only 1 Target, Deal +100% Final Damage' },
            { dice: 1, range: '15-18', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 5 Poise Potency and 2 Count' },
            { dice: 2, range: '18-20', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 5 Poise Potency and 2 Count' },
            { dice: 3, range: '20-22', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 5 Poise Potency and 2 Count' },
            { dice: 4, range: '21-23', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 15 Bleed Potency' },
            { dice: 5, range: '23-25', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 5 Paralyze' }
        ],
        
        // Full Stop Office
        'Take the Shot': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: 'Choose a Target, from this Scene onwards: if an ally hits this Target with a Page, use Page "Melee Support" unopposed' }
        ],
        'Melee Support': [
            { dice: 1, range: '3-7', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency' }
        ],
        'Taking Cover': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Use 1 Bullet' },
            { dice: 1, range: '3-15', type: 'Clash Dice - Evade', damage: '-', special: '[On Clash Win] Gain 2 Poise Potency' }
        ],
        'Target Marked': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Before Use] If no Bullet left then use Page "Combo:Target Marked"' },
            { dice: 1, range: '2-9', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 3 Poise Potency' },
            { dice: 2, range: '2-9', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 2 Poise Count' }
        ],
        'Combo:Target Marked': [
            { dice: 1, range: '2-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency' },
            { dice: 2, range: '2-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency and Count' },
            { dice: 3, range: '3-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Poise Count' }
        ],
        'Return Fire': [
            { dice: 1, range: '4-11', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 2 Poise Potency' },
            { dice: 2, range: '4-11', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 3 Poise Potency and 2 Count' },
            { dice: 3, range: '4-11', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 2 Poise Count' }
        ],
        'Headshot': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Poise Potency the User has, Gain +1 dice Power Up (Max. 4)' },
            { dice: 1, range: '5-20', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 10 Poise Potency and 1 Count' }
        ],
        'Beyond the Shadow': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Replenish Bullets if have more in Inventory' },
            { dice: 1, range: '3-12', type: 'Evade', damage: '-', special: '[On Clash Win] Gain 2 Poise Potency' },
            { dice: 2, range: '2-11', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency and Count' }
        ],
        'Full-Stop to Life': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Before Use] If no Bullet left then use Page "Combo:Full-Stop to Life"' },
            { dice: 1, range: '5-12', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 4 Poise Potency' },
            { dice: 2, range: '5-12', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 4 Poise Potency and 2 Count' },
            { dice: 3, range: '4-17', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 2 Poise Count' }
        ],
        'Combo:Full-Stop to Life': [
            { dice: 1, range: '5-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Fragile this Scene' },
            { dice: 2, range: '5-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency' },
            { dice: 3, range: '4-17', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency and 2 Count' },
            { dice: 4, range: '6-16', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 3 Poise Count' }
        ],
        'Goin\' for the Bullseye': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Before Use] If first time using this Page in an encounter then use Page "AL-HV Pulverisation Round" instead.' },
            { dice: 1, range: '12-25', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 5 Poise Potency and Count' }
        ],
        'AL-HV Pulverisation Round': [
            { dice: 1, range: '18-39', type: 'Pierce', damage: 'Pale', special: '[On Dice] Consume 1 Bullet, [On Hit] Inflict 3 Paralyze' }
        ],

        // Molar Boatworks Office
        'Unstable Power Output': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only use 1 "Unstable Power Output" per Scene<br>[On Use] Gain a 2-4 Charge Potency<br>Gain 1 Fragile this Scene' }
        ],
        'Fierce Assault': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Sinking Potency the Target has, Gain +1 dice Power Up (Max.2)' },
            { dice: 1, range: '2-4', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 1 Charge Potency, [On Hit] Inflict 2 Sinking Potency' }
        ],
        'Steady...': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Sinking Potency the Target has, Gain +1 dice Power Up (Max.2)' },
            { dice: 1, range: '2-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 1 Charge Potency, [On Hit] Inflict 2 Sinking Potency' },
            { dice: 2, range: '1-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 1 Charge Potency, [On Hit] Inflict 3 Sinking Potency and 2 Count' }
        ],
        'Crab Bastards!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 3 Sinking Potency the Target has, Gain +1 dice Power Up (Max.3)' },
            { dice: 1, range: '2-10', type: 'Shield', damage: '-', special: '[On Clash Win] Gain 3 Charge Potency' }
        ],
        'Here to get your Boats Fixed?': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 3 Sinking Potency the Target has, Gain +1 dice Power Up (Max.3)' },
            { dice: 1, range: '2-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict, 4 Sinking Potency' },
            { dice: 2, range: '2-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict, 4 Sinking Potency and 2 Count' }
        ],
        'Ready to Crush': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 3 Sinking Potency the Target has, Gain +1 dice Power Up (Max.3)' },
            { dice: 1, range: '3-7', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Charge Potency, [On Hit] Inflict 3 Sinking Potency' },
            { dice: 2, range: '4-8', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Charge Potency, [On Hit] Inflict 4 Sinking Potency and 3 Count' }
        ],
        'Explosive Blast': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 3 Sinking Potency the Target has, Gain +1 dice Power Up (Max.3)' },
            { dice: 1, range: '3-8', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Charge Potency, [On Hit] Inflict 3 Sinking Potency' },
            { dice: 2, range: '4-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Charge Potency, [On Hit] Inflict 4 Sinking Potency and 3 Count' },
            { dice: 3, range: '5-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Charge Potency' }
        ],
        'Risky Judgement': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 3 Sinking Potency the Target has, Gain +1 dice Power Up (Max.4)<br>[On Use] Consume 15 Charge Potency to Gain +2 dice Power Up and inflict 2 Fragile this Scene to current target' },
            { dice: 1, range: '5-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 4 Sinking Potency' },
            { dice: 2, range: '5-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 4 Sinking Potency and 3 Count' },
            { dice: 3, range: '5-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 4 Sinking Potency and 3 Count' },
            { dice: 4, range: '5-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 5 Sinking Potency and 3 Count' }
        ],
        
        // Dawn Office
        'Searing Blade': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] If has Passive: Volatile E.G.O: Waxen Pinion then remove Self Stagger from this Page with Gain 1 SP Healing Up<br>[On Use] Gain 1 Protection this Scene then Self Stagger This and next Scene, Inflict +1 Burn Potency on each Dice' },
        ],
        'Sunset Blade': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 1 Positive Emotion Point' },
            { dice: 1, range: '2-5', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Burn Potency' },
            { dice: 2, range: '3-6', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Burn Potency and Count' }
        ],
        'Flash of Sunup': [
            { dice: 1, range: '4-5', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 2, range: '3-6', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency and Count' }
        ],
        'Crack of Dawn': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 2 Positive Emotion Point' },
            { dice: 1, range: '2-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 5 Burn Potency' }
        ],
        'Rue': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 2 Negative Emotion Point' },
            { dice: 1, range: '2-5', type: 'Shield', damage: '-', special: '[On Clash Lose] Gain 1 Positive Emotion Point' },
            { dice: 2, range: '2-5', type: 'Shield', damage: '-', special: '[On Clash Lose] Gain 1 Positive Emotion Point' }
        ],
        'Stigmatize': [
            { dice: 1, range: '4-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 2, range: '4-9', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 5 Burn Potency and Count' }
        ],
        
        // Volatile E.G.O: Waxen Pinion
        'Searing Sword': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] If has Passive: Volatile E.G.O: Waxen Pinion then remove Self Stagger from this Page with Gain 1 SP Healing Up<br>[On Use] Gain 1 Protection this Scene then Self Stagger<br>This and next Scene, Inflict +2 Burn Potency on each Dice' }
        ],
        'Flaring Brand': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 1 Power Up for every 5 Burn Potency on the Target (Max.3)' },
            { dice: 1, range: '3-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 2, range: '4-9', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' }
        ],
        'Fierce Charge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 1 Dice Power Up for each time Re-Use Dice within Page' },
            { dice: 1, range: '5-12', type: 'Pierce', damage: 'Red', special: '[On Clash Win] Re-Use this Dice (Max.2)<br>[On Hit] Inflict 2 Burn Potency' }
        ],
        'Feather Shield': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Target has 10+ Burn Potency then Gain 1 Defense Power Up this Scene' },
            { dice: 1, range: '2-14', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 3 Burn Potency and 2 Count' },
            { dice: 2, range: '2-14', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 3 Burn Potency and 2 Count' },
            { dice: 3, range: '1-15', type: 'Evade', damage: '-', special: '[On Clash Win] Inflict 1 Fragile next Scene' }
        ],
        'Rueful Eventide': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 1 Power Up for every 4 Burn Potency on the Target (Max.4)' },
            { dice: 1, range: '6-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' },
            { dice: 2, range: '5-13', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Burn Potency' }
        ],
        'Blazing Strike': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If HP less than 60% Max HP, Gain +25 Dice Power Up' },
            { dice: 1, range: '18-25', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 10 Burn Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If this Page killed, Re-Use it randomly' }
        ],
        
        // Gaze Office
        'Observe': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain X Power Up this Scene for each 1 Paralyze on Target. (Max.3) (Once per Scene)<br>[On Play] Gain 2 Energy' }
        ],
        'Unavoidable Gaze': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Target has Paralyze, Gain +1 Dice Power Up<br>[On Use] If User has 0 Energy, Remove all Paralyze on this Page'},
            { dice: 1, range: '4-6', type: 'Blunt', damage: 'White' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'Structural Analysis': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Target has Paralyze, Gain +1 Dice Power Up<br>[On Use] If User has 0 Energy, Remove all Paralyze on this Page'},
            { dice: 1, range: '1-5', type: 'Shield', damage: '-' },
            { dice: 2, range: '2-5', type: 'Blunt', damage: 'White' },
            { dice: 3, range: '2-6', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'You\'re a Hindrance': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Target has Paralyze, Gain +1 Dice Power Up<br>[On Use] If User has 0 Energy, Remove all Paralyze on this Page'},
            { dice: 1, range: '2-8', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' },
            { dice: 2, range: '2-8', type: 'Blunt', damage: 'White' },
            { dice: 3, range: '1-8', type: 'Evade', damage: '-' }
        ],
        'Electric Shock': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Target has Paralyze, Gain +1 Dice Power Up<br>[On Use] If User has 0 Energy, Remove all Paralyze on this Page'},
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' },
            { dice: 2, range: '4-8', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'Opportunity Spotted': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Target has Paralyze, Gain +1 Dice Power Up<br>[On Use] If User has 0 Energy, Remove all Paralyze on this Page'},
            { dice: 1, range: '4-10', type: 'Shield', damage: '-' },
            { dice: 2, range: '4-9', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' },
            { dice: 3, range: '4-9', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' },
            { dice: 4, range: '4-9', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'Zzzzzap': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Target has Paralyze, Gain +1 Dice Power Up<br>[On Use] If User has 0 Energy, Remove all Paralyze on this Page'},
            { dice: 1, range: '5-10', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' },
            { dice: 2, range: '5-10', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'Binding Arms': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Target has Paralyze, Gain +1 Dice Power Up<br>[On Use] Lower this Page\'s Light by 1 Each time used (Max.3)<br>[On Use] If User has 0 Energy, Remove all Paralyze on this Page'},
            { dice: 1, range: '7-18', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        'Singularity Seeker': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If Target has a Singularity, Steal it for this Scene and can use it as a Special Page for 0 Light. If not then Gain a random Prototype Singularity for this Scene.<br>[On Use] If User has 0 Energy, Remove all Paralyze on this Page'},
            { dice: 1, range: '7-22', type: 'Clash Dice - Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze' }
        ],
        
        
        // Twin Hook Pirates
        'Unjust Enrichment': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Toss a Coin<br>[If Heads], Gain 3 Poise Potency and 2 Count<br>Gain 1 Power Up this Scene<br>Gain 1 Unjust Enrichment<br>[If Tails], Gain 1 Poise Potency and Count<br>Gain 1 Power Down this Scene' }
        ],
        'Looting': [
            { dice: 1, range: '2-5', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency, [On Crit] Inflict 2 Bleed Potency' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Target is at 5% Max HP or lower Execute them<br>[Condition] If this Page successfully Executes then Add this Page to Deck.<br>If this Page successfully Executes then Gain 5 Unjust Enrichment' }
        ],
        'Tear the Flesh': [
            { dice: 1, range: '2-6', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency and Count, [On Crit] Inflict 2 Bleed Potency and Count' }
        ],
        'Hook Slice': [
            { dice: 1, range: '2-4', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 1 Poise Potency and Count, [On Crit] Inflict 1 Bleed Potency' },
            { dice: 2, range: '3-4', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 1 Poise Potency and Count, [On Crit] Inflict 2 Bleed Count' }
        ],
        'Tear the Gap': [
            { dice: 1, range: '2-7', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 2 Poise Potency and Count, [On Crit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '3-8', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 2 Poise Potency and Count, [On Crit] Inflict 3 Bleed Potency and 2 Count' }
        ],
        'Easy Breathing': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Consume all Unjust Enrichment (Max.10), then Gain X Pierce DMG Up next Scene. (Max.10)' }
        ],
        'Two Sides of a Coin': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Used 4 "Unjust Enrichment" Pages<br>[On Play] Use an "Unjust Enrichment" Page costing 0 Light and guarentee that Page will roll a Heads Coin.<br>[After Play] Reset the "Unjust Enrichment" Page counter.' }
        ],
        'Negotiation Start': [
            { dice: 1, range: '5-12', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 3 Poise Potency and Count, [On Crit] Inflict 3 Bleed Potency and 2 Count' },
            { dice: 2, range: '6-12', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 3 Poise Potency and Count, [On Crit] Inflict 3 Bleed Potency and 2 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Gain 1 Unjust Enrichment' }
        ],
        'Unilateral Business': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Bleed Potency on Target, Gain +1 Dice Power Up. (Max.3)' },
            { dice: 1, range: '5-10', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 3 Poise Potency and 2 Count, [On Crit] Inflict 3 Bleed Potency and 2 Count' },
            { dice: 2, range: '5-10', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 3 Poise Potency and 2 Count, [On Crit] Inflict 3 Bleed Potency and 2 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Gain 2 Unjust Enrichment' }
        ],
        'Foregone Conclusion': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Consume all Unjust Enrichment, Deal +Y (25+Xx5)% additional Damage with this Page. (X is Unjust Enrichment)' },
            { dice: 1, range: '7-18', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 4 Poise Potency and 2 Count, [On Crit] Inflict 4 Bleed Potency and 2 Count' },
            { dice: 2, range: '7-18', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 4 Poise Potency and 2 Count, [On Crit] Inflict 4 Bleed Potency and 2 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Gain Y (10+5xX) Ahn' }
        ],
        
        // Ting Tang Gang
        'Gamble on Life': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only use this Page once per Scene<br>[On Play] Toss a Coin<br>[If Heads] Gain 2 Power Up this Scene<br>Gain 1 Luck Power<br>[If Tails] Gain 1 Power Down this Scene' }
        ],
        'Carve': [
            { dice: 1, range: '2-4', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count' }
        ],
        'Heavy Swing': [
            { dice: 1, range: '2-5', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Potency' },
            { dice: 2, range: '2-5', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count' }
        ],
        'Sneaky Bash': [
            { dice: 1, range: '2-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and 2 Count' },
            { dice: 2, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and 2 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Hit all dices, Gain 1 Luck Power' }
        ],
        'Cunning Stab': [
            { dice: 1, range: '3-6', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency' },
            { dice: 2, range: '3-7', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' }
        ],
        'Glinting Wish': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only use this Page once per Encounter<br>[On Play] Toss a Coin<br>[If Heads] Double your current Luck Power<br>[If Tails] Lose all of your current Luck Power' }
        ],
        'Throat Slit': [
            { dice: 1, range: '3-8', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '3-8', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Hit all dices, Gain 1 Luck Power' }
        ],
        'Shank': [
            { dice: 1, range: '4-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency' },
            { dice: 2, range: '4-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count' },
            { dice: 3, range: '4-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] If Hit all dices, Gain 1 Luck Power' }
        ],
        'Mutilate': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Re-Use if Rolled a nat 20<br>[On Use] Re-Use if Target has 10+ Bleed Potency<br>[On Use] Re-Use if you have 5+ Luck Power' },
            { dice: 1, range: '8-25', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and 2 Count' }
        ],
        
        // Los Mariachis
        'Baile Y Rola': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Once per Scene<br>[On Use] Gain 1 Rhythm' }
        ],
        '¡Rápidamente!': [
            { dice: 1, range: '2-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and 1 Count' },
            { dice: 2, range: '2-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Defense Power Down next Scene' }
        ],
        'Bailemos~': [
            { dice: 1, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and 1 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 1 Rhythm' }
        ],
        '¡Olé!': [
            { dice: 1, range: '3-8', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 1 Attack Power Down next Scene' },
            { dice: 2, range: '4-8', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 2 Rupture Potency and 2 Count' }
        ],
        '¿Eso es todo?': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only be used if user has 5+ Rhythm' },
            { dice: 1, range: '4-12', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 1 Power Down next Scene' },
            { dice: 2, range: '4-12', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 2 Fragile next Scene' },
            { dice: 3, range: '4-12', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' }
        ],
        'Duelo de Baile': [
            { dice: 1, range: '4-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' },
            { dice: 2, range: '4-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' }
        ],
        'Joviales': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only be used if user has 1+ Rhythm<br>[On Use] A Chosen Target Gains 1 Healing Up this Scene, then Heal 20HP<br>[After Use] Consume 1 Rhythm' }
        ],
        'Emocionado': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only be used if user has 1+ Rhythm<br>[On Use] A Chosen Target Gains 1 SP Healing Up this Scene, then Heal 10SP<br>[After Use] Consume 1 Rhythm' }
        ],
        'Pañata Party~!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only be used if user has 1+ Rhythm<br>[On Use] A Chosen Target Gains 1 Protecion this Scene, then gain Shield 10-17<br>[After Use] Consume 1 Rhythm' }
        ],
        'Se Acabó la Fiesta': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 1 Rhythm, Deal 2 Additional Damage on the last dice of this Page.<br>[On Use] For every 2 Rhythm, Gain +1 dice Power. (Max. 4)' },
            { dice: 1, range: '4-16', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict Immobilized next Scene' },
            { dice: 2, range: '5-18', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 2 Rupture Potency and 2 Count' }
        ],
        
        // Wuthering Heights
        'Echoes of the Manor': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Consume 5 Sinking Potency on Target to Inflict Echoes of the Manor onto them' }
        ],
        'Confiscation': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 3 Sinking Potency on Target (Max.2)' },
            { dice: 1, range: '3-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Sinking Potency and 1 Count' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Sinking Potency and 1 Count' }
        ],
        'Interloper Reception': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 3 Sinking Potency on Target (Max.3)' },
            { dice: 1, range: '4-8', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Sinking Potency and 1 Count' }
        ],
        'Knocking': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 3 Sinking Potency on Target (Max.3)' },
            { dice: 1, range: '4-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Sinking Potency' },
            { dice: 2, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Sinking Potency and 3 Count' }
        ],
        'Hunting Plans': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 3 Sinking Potency on Target (Max.3)' },
            { dice: 1, range: '2-10', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 3 Sinking Potency' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Sinking Potency and 2 Count' }
        ],
        'Dusting': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 3 Sinking Potency on Target (Max.3)' },
            { dice: 1, range: '4-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Sinking Potency' },
            { dice: 2, range: '4-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Sinking Potency and 2 Count' },
            { dice: 3, range: '4-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Sinking Potency and 2 Count' }
        ],
        'Heartseal': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 3 Sinking Potency on Target (Max.4)' },
            { dice: 1, range: '5-11', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 2 Sinking Potency and 1 Count' },
            { dice: 2, range: '5-11', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 2 Sinking Potency and 2 Count' },
            { dice: 3, range: '5-12', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 3 Sinking Potency and 2 Count' },
            { dice: 4, range: '5-12', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 4 Sinking Potency and 2 Count' }
        ],
        'As Mistress Commands': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 3 Sinking Potency on Target (Max.4)<br>[On Use] Inflict Terrified' },
            { dice: 1, range: '5-14', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 3 Sinking Potency and 1 Count' },
            { dice: 2, range: '5-16', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 3 Sinking Potency and 2 Count' },
            { dice: 3, range: '5-16', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 3 Sinking Potency and 2 Count' },
            { dice: 4, range: '5-18', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 4 Sinking Potency and 2 Count' }
        ],
        
        // The Wild Hunt
        'Oh Dullahan...': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 4 Sinking Potency on Target (Max.4)' },
            { dice: 1, range: '5-15', type: 'Slash', damage: 'Black', special: '[On Clash Win] Gain 1 Coffin, [On Hit] Inflict 5 Sinking Potency and 2 Count' },
            { dice: 2, range: '6-15', type: 'Slash', damage: 'Black', special: '[On Hit] Inflict 5 Sinking Potency and 2 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Scene End] Change Form: [If Wild Hunt] then change to [Dullahan]. [If Dullahan] then change to [Wild Hunt]' },
        ],
        'Beheading': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 4 Sinking Potency on Target (Max.5)<br>[On Use] Gain 1 Protection this Scene for every 5 Coffin the user has' },
            { dice: 1, range: '7-18', type: 'Slash', damage: 'Black', special: '[On Clash Win] Gain 1 Coffin, [On Hit] Inflict 5 Sinking Potency and 2 Count' },
            { dice: 2, range: '7-19', type: 'Slash', damage: 'Black', special: '[On Hit] Inflict 5 Sinking Potency and 2 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use]: [If Wild Hunt] Heal 10% Max SP. [If Dullahan] Consume 20% Max SP' },
        ],
        'Memorial Procession': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] All dice on this page gain +1 dice Power for every 4 Sinking Potency on Target (Max.5)<br>[On Use] Gain 1 Power Up this Scene for every 2 Coffin the user has' },
            { dice: 1, range: '7-16', type: 'Slash', damage: 'Black', special: '[On Hit] Inflict 5 Sinking Potency and 2 Count' },
            { dice: 2, range: '7-19', type: 'Slash', damage: 'Black', special: '[On Hit] Inflict 5 Sinking Potency and 2 Count' },
            { dice: 3, range: '7-22', type: 'Slash', damage: 'Black', special: '[On Hit] Inflict 5 Sinking Potency and 2 Count, [On Hit] Inflict 2 Fragile next Scene' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use]: [If Wild Hunt] Deal +50% Damage. [If Dullahan] Use this Page on 2 other Targets Unopposed<br>[After Use] Consume 30% Max SP' },
        ],
        'Requiem': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only use this in Wild Hunt<br>[On Use] All dice on this page gain +1 dice Power for every 4 Sinking Potency on Target (Max.5)<br>[On Use] Gain 1 Protection this Scene for every 5 Coffin the user has' },
            { dice: 1, range: '8-20', type: 'Blunt', damage: 'Pale', special: '[On Clash Win] Gain 1 Coffin, [On Hit] Inflict 10 Sinking Potency and 2 Count' },
            { dice: 2, range: '16-32', type: 'Blunt', damage: 'Pale', special: '[On Hit] Inflict 10 Sinking Potency and 2 Count. Deal additional 100% Base Damage if user has 8+ Coffin. Inflict 10 Bind next Scene. Inflict Impending Ruin' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Consume 50% Max SP' },
        ],
        'Lament, Mourn, and Despair': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only use this in Dullahan<br>[On Use] All dice on this page gain +1 dice Power for every 4 Sinking Potency on Target (Max.5)<br>[On Use] Gain 1 Protection this Scene for every 5 Coffin the user has<br>[On Use] This Page\'s Dice is determined by the amount of Stagger the User has, the lower the SP, the Higher the Dice roll' },
            { dice: 1, range: '16-26', type: 'Blunt', damage: 'Pale', special: '[On Clash Win] Gain 1 Coffin, [On Hit] Inflict 10 Sinking Potency and 2 Count' },
            { dice: 2, range: '26-40', type: 'Blunt', damage: 'Pale', special: '[On Hit] Inflict 10 Sinking Potency and 2 Count. Deal additional 100% Base Damage if user has 8+ Coffin. Inflict 10 Bind next Scene. Inflict Impending Ruin' }
        ],
        
        // Dead Rabbits Gang
        'Smackdown': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Gain +2 Dice Power<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.3)' },
            { dice: 1, range: '2-15', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' }
        ],
        'Hurt': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Gain +1 Dice Power<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.2)' },
            { dice: 1, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' }
        ],
        'Break': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Gain +1 Dice Power<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.2)' },
            { dice: 1, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency' },
            { dice: 2, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Defense Power Down' }
        ],
        'Remove': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Gain +1 Dice Power<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.2)' },
            { dice: 1, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Fragile next Scene' }
        ],
        'Get Out of My Sight': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Gain +1 Dice Power<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.2)' },
            { dice: 1, range: '4-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 1 Count' },
            { dice: 2, range: '4-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Counter Break' }
        ],
        'Hold Them Back': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Gain +1 Dice Power<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.2)' },
            { dice: 1, range: '4-7', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 4 Rupture Potency and 2 Count' },
            { dice: 2, range: '3-9', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 1 Defense Power Down next Scene' }
        ],
        'Counter': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Gain +1 Dice Power<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.2)' },
            { dice: 1, range: '1-20', type: 'Counter', damage: 'Special', special: '15+ will take 0.5x dmg and hit back 0.5x dmg, 20+ will take 0x dmg and hit back 1x dmg. <br>[On Clash Win] Inflict 2 Rupture Potency and Count' }
        ],
        'Breakthrough': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Destroy it<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.3)' },
            { dice: 1, range: '5-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and Count' },
            { dice: 2, range: '5-11', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' }
        ],
        'Bat Bash': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Gain +2 Dice Power<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.3)' },
            { dice: 1, range: '7-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' },
            { dice: 2, range: '6-11', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Power Down next Scene' }
        ],
        'Upheaval': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Gain +2 Dice Power<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.3)' },
            { dice: 1, range: '4-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' },
            { dice: 2, range: '4-15', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Rupture Potency and Count' },
            { dice: 3, range: '4-16', type: 'Blunt', damage: 'Red', special: '[On Hit] Restore 2 Light' }
        ],
        'Relentless': [
            { dice: 0, range: 'No dice', type: 'Blunt', damage: 'Special', special: '[On Use] If Target is using a Defense dice, Destroy it<br>[On Use] For every 4 Rupture Potency the Target has, Gain +1 dice Power (Max.4)' },
            { dice: 1, range: '4-13', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and 2 Count' },
            { dice: 2, range: '4-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' },
            { dice: 3, range: '5-15', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Rupture Potency and 2 Count' },
            { dice: 4, range: '5-16', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Rupture Potency and 2 Count' }
        ],
        
        // Rosespanner Workshop
        'Synchronization': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Tremor Potency on Target, Gain 1 Charge Potency<br>[On Use] Gain 3 Bind this Scene' }
        ],
        'I\'ll Grind You Up': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Tremor Potency the Target has, Gain +1 dice Power (Max.2)' },
            { dice: 1, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 1 Charge Potency, Inflict 3 Tremor Potency' }
        ],
        'Rev Up': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Tremor Potency the Target has, Gain +1 dice Power (Max.2)' },
            { dice: 1, range: '3-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 1 Charge Potency, Inflict 2 Tremor Potency' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 1 Charge Potency, Inflict 3 Tremor Potency' }
        ],
        'Vibration Amplification': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Tremor Potency the Target has, Gain +1 dice Power (Max.3)<br>[On Use] Consume 5 Charge Potency to Re-Use Dice 1' },
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Tremor Potency' }
        ],
        'Stand Back!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Tremor Potency the Target has, Gain +1 dice Power (Max.3)' },
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 2 Charge Potency, Inflict 3 Tremor Potency' },
            { dice: 2, range: '2-10', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 4 Tremor Potency' }
        ],
        'Trembling Conversion': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Tremor Potency the Target has, Gain +1 dice Power (Max.3)' },
            { dice: 1, range: '3-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 2 Charge Potency, Inflict 2 Tremor Potency' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 2 Charge Potency, Inflict Tremor Burst' }
        ],
        'Vibration Compression': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Tremor Potency the Target has, Gain +1 dice Power (Max.3)<br>[On Use] Consume 10 Charge Potency to Re-Use Dice 1-2 times' },
            { dice: 1, range: '4-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Tremor Potency, Gain 2 Bind this and next Scene' }
        ],
        'Final Warmup': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Tremor Potency the Target has, Gain +1 dice Power (Max.3)' },
            { dice: 1, range: '4-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 5 Charge Potency, Inflict 4 Tremor Potency' },
            { dice: 2, range: '2-16', type: 'Clash Dice - Shield', damage: '-', special: '[On Clash Win] Inflict 5 Tremor Potency' }
        ],
        'Let\'s Rack Up Some Scores': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Tremor Potency the Target has, Gain +1 dice Power (Max.4)<br>[On Use] Consume 20 Charge Potency to Re-Use Dice 1 3 times' },
            { dice: 1, range: '10-20', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Tremor Potency, Gain 2 Bind this Scene, Inflict 1 Fragile' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Inflict Tremor Burst' },
        ],
        
        // Multicrack Office
        'Activate Prosthesis': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every Prosthetic you have on you, Gain 1 Power Up this Encounter<br>[On Use] For every Prosthetic you have on you, Consume 1 Charge Potency each Scene' }
        ],
        '40S-2 Activation': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Charge Potency the User has, Gain +1 dice Power (Max.6)' },
            { dice: 1, range: '4-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 3 Charge Potency' },
            { dice: 2, range: '4-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 4 Charge Potency' }
        ],
        'Photoelectric Mark': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Charge Potency the User has, Gain +1 dice Power (Max.6)' },
            { dice: 1, range: '4-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 3 Charge Potency' },
            { dice: 2, range: '4-11', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Photoelectric Potency' }
        ],
        'Photoelectric Harpoon': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Charge Potency the User has, Gain +1 dice Power (Max.6)' },
            { dice: 1, range: '4-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 3 Charge Potency' },
            { dice: 2, range: '4-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 3 Charge Potency' },
            { dice: 3, range: '4-15', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Photoelectric Potency' }
        ],
        '40Y-3 Activation': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Charge Potency the User has, Gain +1 dice Power (Max.7)' },
            { dice: 1, range: '5-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 3 Charge Potency' },
            { dice: 2, range: '6-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 4 Charge Potency' }
        ],
        '40Y-3 Charge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 6 Charge Potency the User has, Gain +1 dice Power (Max.7)' },
            { dice: 1, range: '5-15', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 3 Charge Potency' },
            { dice: 2, range: '5-16', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 3 Charge Potency' },
            { dice: 3, range: '5-16', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 4 Charge Potency' },
            { dice: 4, range: '5-18', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Photoelectric Potency' }
        ],
        'Charge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Gain 20 Charge Potency<br>[On Play] Gain 2 Protection this and next Scene<br>[After Play] For every 20 Charge Potency you have, Inflict 1 Photoelectric on the Target<br>[After Play] Add Page "Charge Counter Current" to Deck' }
        ],
        'Charge Countercurrent': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Before Use] If less than 40 Charge Potency, Lose 10% Max HP<br>[On Use] For every 6 Charge Potency the User has, Gain +1 dice Power (Max.8)<br>[On Use] Inflict 2 Fragile this Scene' },
            { dice: 1, range: '4-18', type: 'Blunt', damage: 'Red'},
            { dice: 2, range: '16-26', type: 'Blunt', damage: 'Red'},
            { dice: 3, range: '22-30', type: 'Blunt', damage: 'Red'}
        ],
        
        // Fang Hunt Office
        'Blood Lure': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If there is a Bloodfiend in this Encounter, Gain 2 Power Up this and next Scene<br>[On Use] Consume All Bleed Potency and Count on self' }
        ],
        'Slam': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If the Target is a Bloodfiend, Gain +4 dice Power' },
            { dice: 1, range: '2-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency' },
            { dice: 2, range: '3-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and 2 Potency' }
        ],
        'Crush Wounds': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If the Target is a Bloodfiend, Gain +4 dice Power' },
            { dice: 1, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and 2 Potency' },
            { dice: 2, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Healing Down this Scene' }
        ],
        'Wild Swinging': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If the Target is a Bloodfiend, Gain +4 dice Power' },
            { dice: 1, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency' },
            { dice: 2, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and 2 Potency' },
            { dice: 3, range: '4-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Potency' }
        ],
        'Styptics': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If the Target is a Bloodfiend, Gain +4 dice Power' },
            { dice: 1, range: '4-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Potency' },
            { dice: 2, range: '5-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Healing Down this Scene' }
        ],
        'Hemostasis': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Before Use] If the Target is a Bloodfiend, Re-Use this Page<br>[On Use] Inflict 2 Healing Down this Scene<br>[On Use] Inflict 2 Fragile this Scene' }
        ],
        'Anti-Bloodfiend Crush': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] If the Target is a Bloodfiend, Gain +4 dice Power' },
            { dice: 1, range: '4-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency' },
            { dice: 2, range: '4-11', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Potency' },
            { dice: 3, range: '4-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Potency' }
        ],
        
        // Firefist Office
        'Overheated Fuel': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Must have 0 District 12 Fuel left' },
            { dice: 1, range: '4-16', type: 'Clash Dice - Blunt', damage: 'Red', special: '[On Hit] Deal fixed Burn damage equal to (Burn Potency x Burn Count/2) and then consume all Burn Potency and Count' }
        ],
        'Fire Punch': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Consume 10 District 12 Fuel, if not enough Fuel left then destroy this Page<br>[On Use] If this Page consumes Overheated Fuel, Gain +5 dice Power<br>[On Use] If this Page consumes Overheated Fuel, Gain +3 Burn Potency per dice' },
            { dice: 1, range: '4-11', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Burn Potency' }
        ],
        'Flamethrow': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Consume 10 District 12 Fuel, if not enough Fuel left then destroy this Page<br>[On Use] If this Page consumes Overheated Fuel, Gain +5 dice Power<br>[On Use] If this Page consumes Overheated Fuel, Gain +3 Burn Potency per dice' },
            { dice: 1, range: '4-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Burn Potency and 2 Count' },
            { dice: 2, range: '5-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Burn Potency and 3 Count' }
        ],
        'I\'ll burn away every last drop of your filthy blood': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Consume 20 District 12 Fuel, if not enough Fuel left then destroy this Page<br>[On Use] If this Page consumes Overheated Fuel, Gain +5 dice Power<br>[On Use] If this Page consumes Overheated Fuel, Gain +3 Burn Potency per dice' },
            { dice: 1, range: '4-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Burn Potency and 2 Count' },
            { dice: 2, range: '5-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Burn Potency and 3 Count' },
            { dice: 3, range: '5-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Burn Potency and 3 Count' }
        ],
        'I have to keep going for Big Sis': [
            { dice: 1, range: '4-16', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 6 Burn Potency' },
            { dice: 2, range: '5-17', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 8 Burn Potency and 2 Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Gain 100 District 12 Fuel' },
        ],
        'Firefist': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Consume 40 District 12 Fuel, if not enough Fuel left then destroy this Page<br>[On Use] For every 10 District 12 Fuel used, Gain +1 Burn Potency per Dice<br>[On Use] If this Page consumes Overheated Fuel, Gain +8 dice Power<br>[On Use] If this Page consumes Overheated Fuel, Gain +5 Burn Potency per dice' },
            { dice: 1, range: '5-16', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 10 Burn Potency and 3 Count' },
            { dice: 2, range: '6-18', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 10 Burn Potency and 3 Count' },
            { dice: 3, range: '7-20', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 10 Burn Potency and 3 Count' }
        ],
        
        // N Corp.
        'Inquisition': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Once per Target<br>[On Use] Inflict Intimidated on Target, If Target has lower %SP than you, Gain 1 Fanatic' },
        ],
        'Nail Pin': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-4', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Potency and Count' },
            { dice: 2, range: '2-4', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count' }
        ],
        'Hammer': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count' },
        ],
        'Knock': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-5', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Potency and Count' },
            { dice: 2, range: '2-5', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count' }
        ],
        'Plunge in': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '3-6', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count' },
            { dice: 2, range: '3-6', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count' }
        ],
        'Pu...rify': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-6', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count' },
            { dice: 2, range: '2-6', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count' },
            { dice: 3, range: '2-6', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count' }
        ],
        'Retribution': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)<br>[On Use] Gain 1 Fanatic' },
            { dice: 1, range: '2-6', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count' },
            { dice: 2, range: '3-7', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count' },
            { dice: 3, range: '4-8', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Nail Count' }
        ],
        'Rough Nailing': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Potency and Count' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count' }
        ],
        'YOU DARE!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Potency and Count' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Potency and Count' }
        ],
        'Vigorous Hammering': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '3-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Potency and Count' },
            { dice: 2, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Bleed Potency and Count' }
        ],
        'Oppressive Preaching': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '4-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Bleed Count' },
            { dice: 2, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Nail Count' }
        ],
        /*'Assertive Inquisition': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Act as an Attachment Work. After that -(1d20x2)% Max SP of a Target' }
        ],*/
        'Zealous Purge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count' },
            { dice: 3, range: '4-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Nail Count' }
        ],
        'Ironclad Retribution': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '3-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count' },
            { dice: 2, range: '4-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count' },
            { dice: 3, range: '4-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Nail Count' },
            { dice: 4, range: '5-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Nail Count' }
        ],
        'Thrusting Nail': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '3-4', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency and Count, Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '2-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Nail Count, Inflict 1 Burn Potency and Count' }
        ],
        'Ruling Hammer': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '4-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 1 Burn Potency and Count' }
        ],
        'Unite': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Once per Encounter [Condition] User must have lower than 40% HP [On Use] Give all allies 1 Fanatic' }
        ],
        'Rightful Purge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count [On Hit] Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 1 Burn Potency and Count' },
        ],
        'Congregate': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count, Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count, Inflict 1 Burn Potency and Count' },
            { dice: 3, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count, Inflict 1 Burn Potency and Count' }
        ],
        'Ponderous Inquisition': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count, Inflict 2 Burn Potency and Count' },
            { dice: 2, range: '4-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Nail Count, Inflict 2 Burn Potency and Count' }
        ],
        'Enactment!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] User must have over 40% HP<br>[On Use] Gain 30 Shield' }
        ],
        'Fanatical Judgement': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Count, Inflict 2 Burn Potency and Count' },
            { dice: 2, range: '5-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 2 Burn Potency and Count' },
            { dice: 3, range: '5-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 2 Burn Potency and Count' }
        ],
        'Spike Drive': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '3-8', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Count, Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '3-8', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 1 Burn Potency and Count' }
        ],
        'Drive': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '3-8', type: 'Pierce', damage: 'Red', special: '[On Use] Inflict 1 Fragile this Scene, Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '3-8', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 1 Burn Potency and Count' }
        ],
        'Foolishness...!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '3-12', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict Intimidated on Target, Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '3-8', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 1 Burn Potency and Count' }
        ],
        'Hammers, Head Me...!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] User must be over 5% HP <br>[On Use] Summon 4 N Corp. MittelHammer [On Use] Shield 3-12, On Clash Win Destroy Target\'s next dice [On Hit] Inflict 1 Burn Potency and Count [On Hit] Inflict 2 Nail Count' }
        ],
        'You Are Cleansed of Sin': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3) [On Use] Inflict 2 Fragile this Scene' },
            { dice: 1, range: '3-15', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Nail Count [After Use] End Scene' }
        ],
        'Annihilate Heretics': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '4-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 4 Bleed Count, Inflict 2 Burn Potency and Count' },
            { dice: 2, range: '6-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 2 Burn Potency and Count' },
            { dice: 3, range: '8-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 2 Burn Potency and Count' },
            { dice: 4, range: '10-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count [On Hit] Inflict 2 Burn Potency and Count' }
        ],
        'Deep Thrust': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3) <br>[On Use] Inflict 1 Fragile this Scene [After Use] Lose 10% Max SP' },
            { dice: 1, range: '4-10', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 10 Bleed Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Lose 10% Max SP' },
        ],
        'The Gripping': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '3-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count [On Hit] Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '3-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count [On Hit] Inflict 1 Burn Potency and Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Lose 10% Max SP' }
        ],
        'Coerced Judgement': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3<br>[On Use] This Page\'s Dice is determined by the amount of SP the User has, the lower the SP, the Higher the Dice roll' },
            { dice: 1, range: '3-15', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count, Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '3-15', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 1 Burn Potency and Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Lose 10% Max SP' }
        ],
        'Cackle': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '5-13', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count, Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '5-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 2 Burn Potency and Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Lose 20% Max SP' }
        ],
        /*'Sin-skewering Nail': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '5-13', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count' },
            { dice: 2, range: '5-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count' },
            { dice: 3, range: '5-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Fragile next Scene' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Lose 20% Max SP' }
        ],*/
        'Amoral Enactment': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)<br>[On Use] This Page\'s Dice is determined by the amount of SP the User has, the lower the SP, the Higher the Dice roll' },
            { dice: 1, range: '5-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count, Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '5-15', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 2 Burn Potency and Count' },
            { dice: 3, range: '5-23', type: 'Pierce', damage: 'Red', special: '[On Highest Value] Inflict Immobilized this and next Scene' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Lose 20% Max SP' }
        ],
        'Purify': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Consume 50% Max SP, Gain 2 Fanatic [On Use] Gain 50 Shield' }
        ],
        'Execution': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)' },
            { dice: 1, range: '5-13', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 1 Nail Count, Inflict 1 Burn Potency and Count' },
            { dice: 2, range: '5-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 2 Burn Potency and Count' },
            { dice: 3, range: '5-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 2 Burn Potency and Count' },
            { dice: 4, range: '5-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 2 Nail Count, Inflict 2 Burn Potency and Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Lose 20% Max SP' }
        ],
        'Self-destructive Purge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Bleed Potency the Target has, Gain +1 dice Power Up (Max. 3)<br>[On Use] This Page\'s Dice is determined by the amount of SP the User has, the lower the SP, the Higher the Dice roll' },
            { dice: 1, range: '5-13', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 5 Nail Count, Inflict 5 Burn Potency and Count' },
            { dice: 2, range: '24-40', type: 'Pierce', damage: 'Pale', special: '[On Hit] Inflict 5 Nail Count, Inflict 5 Burn Potency and Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Lose 30% Max SP' }
        ],
        'Enough...': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Must be Staggered 2 times before within this Encounter [On Use] Heal 40% Max HP' }
        ],
        
        // W Corp.
        'Dimensional Rift': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Consume 3 Potency, Slash the space and open up a Dimensional Rift. Gain 1 Dimensional Rift. After exiting the Rift, the next Page will deal Pale damage.' }
        ],
        'Rip': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] At 10+ Charge Potency, Dices from this Page also inflict +2 Rupture Count' },
            { dice: 1, range: '4-10', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 2 Charge Potency, Inflict 2 Rupture Potency' },
            { dice: 2, range: '4-11', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Charge Potency, Inflict 2 Rupture Potency' }
        ],
        'Rewind': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] User must have over 20 Potency. <br>[On Use] Consume 20 Potency and Revert the User\'s HP and SP to the amount of the last Scene. <br>[On Use] Gain 2 Bind next Scene.' }
        ],
        'Energy Cycle': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] At 10+ Charge Potency, Dices from this Page also inflict +2 Rupture Count' },
            { dice: 1, range: '4-11', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 4 Charge Potency' },
            { dice: 2, range: '4-12', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 4 Charge Potency' }
        ],
        'Overcharged': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 12 Charge Potency' },
            { dice: 1, range: '5-13', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 2, range: '4-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 3, range: '5-15', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 4, range: '2-15', type: 'Clash Dice - Evade'},
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Gain Immobilized next Scene' }
        ],
        'Ripple': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] Consume 4 Charge Potency to gain +4 dice Power on the last Dice of this Page' },
            { dice: 1, range: '4-16', type: 'Evade', damage: '-', special: '[On Clash Lose] Gain +3 next dice Power' },
            { dice: 2, range: '5-20', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 4 Rupture Potency and 2 Count' }
        ],
        'Leap': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] At 15+ Charge Potency, this Page changes to "Charged Leap"<br>[On Use] Consume 4 Charge Potency to Draw 2 Pages' },
            { dice: 1, range: '4-14', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 1 Haste next Scene, Inflict 2 Rupture Potency and 1 Count' },
            { dice: 2, range: '5-16', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and 1 Count' }
        ],
        'Charged Leap': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] Consume 10 Charge Potency to Draw 2 Pages and Restore 2 Light' },
            { dice: 1, range: '4-20', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Haste next Scene, Inflict 2 Rupture Potency and 1 Count' },
            { dice: 2, range: '5-22', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and 1 Count' }
        ],
        'Rip Space': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.4)<br>[On Use] At 20+ Charge Potency, this Page changes to "Rip Dimension"' },
            { dice: 1, range: '5-10', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 2, range: '8-16', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 3, range: '12-22', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 4, range: '16-26', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 5, range: '20-32', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' }
        ],
        'Rip Dimension': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Charge Potency the User has, Gain +1 dice Power (Max.5)' },
            { dice: 1, range: '8-16', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and Count' },
            { dice: 2, range: '12-20', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and Count' },
            { dice: 3, range: '16-26', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and Count' },
            { dice: 4, range: '20-30', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and Count' },
            { dice: 5, range: '26-36', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and Count' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] Lose 20 Charge Potency, Gain 2 Bind next Scene' }
        ],
        
        // T Corp.
        'Time Moratorium': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Inflict 3 Tremor - Time Moratorium Count.' }
        ],
        'Prepare to Collect': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Tremor Potency the Target has, Gain +1 dice Power (Max.3)' },
            { dice: 1, range: '4-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Tremor Potency, Gain 2 Taunt next Scene' }
        ],
        'T Corp. Martial Suppression': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Tremor Potency the Target has, Gain +1 dice Power (Max.3)' },
            { dice: 1, range: '4-9', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Tremor Potency, Gain 3 Taunt next Scene' },
            { dice: 2, range: '4-10', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Tremor Potency, Gain 2 Protection next Scene' }
        ],
        'Execute Collections': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Tremor Potency the Target has, Gain +1 dice Power (Max.5)' },
            { dice: 1, range: '4-11', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Tremor Potency, Gain 3 Taunt next Scene' },
            { dice: 2, range: '4-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Tremor Potency' }
        ],
        'Borrow Time': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Target must have Tremor - Time Moratorium on them. <br>[On Use] Exchange the amount of Tremor - Time Moratorium the Target into Time on self (Max. 200) (Rounds Down).' }
        ],
        'Let Us Prepare to Collect': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Tremor Potency the Target has, Gain +1 dice Power (Max.3)<br>[On Use] For every 3 Speed higher than the Target, deal 1 additional Tremor Potency on each dice of this Page' },
            { dice: 1, range: '5-13', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Tremor Potency, Gain 2 Taunt and 1 Protection next Scene' }
        ],
        'T Corp. Accelerated Amputator': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Tremor Potency the Target has, Gain +1 dice Power (Max.3)<br>[On Use] For every 3 Speed higher than the Target, deal 1 additional Tremor Potency on each dice of this Page' },
            { dice: 1, range: '4-11', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Tremor Potency, [On Hit] Gain 2 Taunt next Scene' },
            { dice: 2, range: '4-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Tremor Potency' },
            { dice: 3, range: '5-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Tremor Potency' }
        ],
        'I Shall Summon the Time': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Must have Accelerated Time on self. <br>[On Use] For every 5 Accelerated Time (Borrow Time x 20), Gain 1 Shield for 3 Scenes, 2 Protection next Scene and Stagger next Scene.' }
        ],
        'I Command. Halt!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Tremor Potency the Target has, Gain +1 dice Power (Max.5)<br>[On Use] For every 2 Speed higher than the Target, deal 2 additional Tremor Potency on each dice of this Page and Inflict 1 Dice Power Down on Target' },
            { dice: 1, range: '4-16', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Tremor Potency, [On Hit] Gain 2 Taunt next Scene' },
            { dice: 2, range: '4-18', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 4 Tremor Potency' },
            { dice: 3, range: '5-19', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Tremor Potency' },
            { dice: 4, range: '6-22', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 5 Tremor Potency, Inflict Tremor Burst' }
        ],
        
        // K Corp.
        'Modified K Corp Ampule': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Gain 1 Modified K Corp Ampule <br>[On Use] Heal 20% of missing HP' }
        ],
        'Takedown': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '2-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Rupture Potency' }
        ],
        'Raid': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '2-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Rupture Potency and Count' },
            { dice: 2, range: '2-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Rupture Potency and Count' }
        ],
        'Activate HP Bullets': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can be used on any ally or on self <br>[On Use] Heal 40 HP' }
        ],
        'Neutralize Target': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 2, range: '2-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Bind next Scene' }
        ],
        'Blockade': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '2-8', type: 'Clash Dice - Shield', damage: '-', special: '[On Clash Win] Inflict 3 Rupture Potency and Count' }
        ],
        'Shelter': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '2-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Rupture Potency and Count' },
            { dice: 2, range: '3-8', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 1 Power Down next Scene' }
        ],
        'Pause! Halt!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '3-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Rupture Potency and Count' }
        ],
        'Stop There, Please!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' }
        ],
        'Arresting!': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '3-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Rupture Potency and Count' },
            { dice: 2, range: '3-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bind next Scene' }
        ],
        'Stop the Intruder': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Rupture Potency and Count' },
            { dice: 2, range: '3-8', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 1 Power Down next Scene' },
            { dice: 3, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' }
        ],
        'No Entry': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Inflict 2 dice Power Down to Target <br>[On Use] Heal 20 HP' }
        ],
        'Forbid Entry': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Rupture Potency and Count' },
            { dice: 2, range: '3-9', type: 'Blunt', damage: 'Red', special: '[On Clash Win] Inflict 1 Fragile next Scene' }
        ],
        'Proximity Shooting': [
            { dice: 1, range: '3-7', type: 'Blunt', damage: 'White' }
        ],
        'Flash; Flash;': [
            { dice: 1, range: '3-5', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Bind next Scene' }
        ],
        'Scanning for weakness.': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Inflict 2 Fragile this Scene' }
        ],
        'Impeding movement.': [
            { dice: 1, range: '3-6', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Bind next Scene' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Bind next Scene' }
        ],
        'Arresting.': [
            { dice: 1, range: '3-6', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze next Scene' },
            { dice: 2, range: '3-7', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 1 Paralyze next Scene' }
        ],
        'Administering HP Ampule': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only Target "Human" Allies <br>[On Use] Gain 1 HP Ampule' }
        ],
        'Administering Resister Ampule': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only Target "Human" Allies <br>[On Use] Gain 1 Protection this Scene' }
        ],
        'Discharging Decay Ampule': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only Target "Human" Allies <br>[On Use] Consume 1 Decay Ampule Consume 10% Max SP' }
        ],
        'Exposing weakness.': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only Target "Human" Allies <br>[On Use] Inflict 1 Fragile this Scene' }
        ],
        'Continue engaging.': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only Target "Human" Allies <br>[On Use] Inflict 1 Haste next Scene' }
        ],
        'Do not reserve your strength.': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Can only Target "Human" Allies <br>[On Use] Inflict 1 Power Up next Scene' }
        ],
        'Suspicious Individuals': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '4-8', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' }
        ],
        'Restrain': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Inflict 3 Bind next Scene on a Target, Gain 3 Taunt this and next Scene' }
        ],
        'No Trespassing': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '4-9', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' },
            { dice: 2, range: '4-9', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 1 Taunt next Scene [On Hit] Gain 1 Protection next Scene' }
        ],
        'Impede the Intruder': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '8-16', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 5 Rupture Potency' }
        ],
        'Decay Blade': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '4-9', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count' },
            { dice: 2, range: '5-11', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 1 Decay Ampule' }
        ],
        'Excise Target': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 4 Rupture Potency the Target has, Gain +1 Dice Power (Max.3)' },
            { dice: 1, range: '5-12', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count, Gain 1 Protection this and next Scene' },
            { dice: 2, range: '6-15', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and 2 Count, Gain 3 Taunt this and next Scene' },
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[After Use] For every 1 Modified K Corp. Ampule on self, Gain 1 Power Up next Scene.<br>Consume all Modified K Corp. Ampule and cannot use Page "Modified K Corp. Ampule" anymore within this Encounter' }
        ],
        
        // R Corp.
        'Graze the Grass': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] This Page can only be used once per Scene <br>[On Use] Restore 1 Light <br>[On Use] Gain 4 Charge Potency' },
            { dice: 1, range: '2-13', type: 'Evade'},
            { dice: 2, range: '5-10', type: 'Pierce', damage: 'Red'}
        ],
        'Energy Strike': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] At 10+ Charge Potency, Deal 10 Fixed SP damage<br>[On Use] Take 10 Fixed SP damage' },
            { dice: 1, range: '4-11', type: 'Blunt', damage: 'White', special: '[On Hit] Gain 2 Charge Potency, Inflict 2 Sinking Potency and 1 Count' },
            { dice: 2, range: '4-11', type: 'Blunt', damage: 'White', special: '[On Hit] Deal 7 Fixed SP damage' }
        ],
        'Mind Strike': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] At 10+ Charge Potency, Deal 10 Fixed SP damage<br>[On Use] Take 10 Fixed SP damage' },
            { dice: 1, range: '4-13', type: 'Blunt', damage: 'White', special: '[On Hit] Gain 2 Charge Potency, Inflict 2 Sinking Potency and 1 Count' },
            { dice: 2, range: '4-14', type: 'Blunt', damage: 'White', special: '[On Hit] Gain 2 Charge Potency, Inflict 3 Sinking Potency and 2 Count' }
        ],
        'Flaying Surge': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] Consume 8 Charge Potency, Deal 30 Fixed SP damage' },
            { dice: 1, range: '5-11', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and 1 Count' },
            { dice: 2, range: '5-12', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and 1 Count' }
        ],
        'Concentration': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] Consume 8 Charge Potency<br>[On Use] Take 20 Fixed SP damage' },
            { dice: 1, range: '3-14', type: 'Shield', damage: '-', special: '[On Clash Win] Inflict 3 Sinking Potency and 1 Count' },
            { dice: 2, range: '5-12', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 3 Sinking Potency and 1 Count' },
            { dice: 3, range: '5-12', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 3 Sinking Potency and 1 Count' }
        ],
        'Mind Whip': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.4)<br>[On Use] If Lower than -30 Sanity, 50% to Target Ally instead of designated Target<br>[On Use] Consume 10 Charge Potency, Deal +8 Fixed SP damage each dice in this Page' },
            { dice: 1, range: '5-11', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and 1 Count' },
            { dice: 2, range: '5-12', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and 1 Count' },
            { dice: 3, range: '5-12', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and 1 Count' },
            { dice: 4, range: '6-12', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and 1 Count' }
        ],
        'Mind Crush': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] User must have +20 Charge Potency<br>[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.4)<br>[On Use] Consume 20 Charge Potency' },
            { dice: 1, range: '5-11', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and 2 Count' },
            { dice: 2, range: '6-12', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and 2 Count' },
            { dice: 3, range: '5-14', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and 2 Count' },
            { dice: 4, range: '5-17', type: 'Blunt', damage: 'White', special: '[On Hit] Inflict 2 Sinking Potency and 2 Count' }
        ],
        'Pinpoint Shot': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] If the User has 7+ Speed, Gain +2 dice Power' },
            { dice: 1, range: '4-12', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Inflict 3 Bleed Potency, Gain 2 Charge Potency' },
            { dice: 2, range: '4-12', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Inflict 3 Bleed Potency, Gain 2 Charge Potency' }
        ],
        'Concentrated Fire': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] User must have +6 Charge Potency<br>[On Use] Consume 6 Charge Potency<br>[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)' },
            { dice: 1, range: '3-15', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 1 Haste next Scene, Inflict 2 Bleed Potency' },
            { dice: 2, range: '3-15', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 1 Haste next Scene, Inflict 2 Bleed Potency and Count' },
            { dice: 3, range: '3-15', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Gain 1 Haste next Scene, Inflict 3 Bleed Potency and Count' }
        ],
        'Battle Command': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] If the User has 7+ Speed, Gain +2 dice Power' },
            { dice: 1, range: '5-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency, [On Hit] Gain 2 Charge Potency' },
            { dice: 2, range: '5-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency, [On Hit] Gain 2 Charge Potency' },
            { dice: 3, range: '5-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bleed Potency, [On Hit] Gain 2 Charge Potency' }
        ],
        'Rapid Gashes': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] User must have +4 Charge Potency<br>[On Use] Consume 4 Charge Potency<br>[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] Everytime the Player uses this Page, the Light lowers by 1' },
            { dice: 1, range: '7-12', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency, Gain 1 Haste next Scene' },
            { dice: 2, range: '6-13', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency, Gain 1 Haste next Scene' },
            { dice: 3, range: '5-14', type: 'Pierce', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency, Gain 1 Haste next Scene' }
        ],
        'Quick Suppression': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] If the User has 7+ Speed, Gain +2 dice Power<br>[On Use] If no Bullet then -4 dice Power' },
            { dice: 1, range: '6-16', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Inflict 2 Bleed Potency and Count, Gain 2 Charge Potency' },
            { dice: 2, range: '6-16', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Inflict 2 Bleed Potency and Count, Gain 2 Charge Potency' },
            { dice: 3, range: '6-16', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Inflict 2 Bleed Potency and Count, Gain 2 Charge Potency' },
            { dice: 4, range: '6-16', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Inflict 2 Bleed Potency and Count, Gain 2 Charge Potency' },
            { dice: 5, range: '6-16', type: 'Pierce', damage: 'Red', special: '[On Dice] Consume 1 Bullet, [On Hit] Inflict 2 Bleed Potency and Count, Gain 2 Charge Potency' }
        ],
        'Savage Mode': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] User must have +20 Charge Potency<br>[On Use] Consume 20 Charge Potency<br>[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.4)<br>[On Use] If the User has 7+ Speed, Gain +3 dice Power' },
            { dice: 1, range: '7-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and Count' },
            { dice: 2, range: '7-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and Count' },
            { dice: 3, range: '7-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and Count' },
            { dice: 4, range: '7-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and Count' },
            { dice: 5, range: '7-14', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 3 Bleed Potency and Count' }
        ],
        'Bulky Impact': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] If the User has Protection, Gain +2 dice Power' },
            { dice: 1, range: '5-13', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count, [On Hit] Gain 2 Charge Potency' }
        ],
        'Weighty Bash': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] If the User has Protection, Gain +2 dice Power' },
            { dice: 1, range: '10-10', type: 'Shield', damage: '-', special: '[On Clash Win] Gain 2 Protection this and next Scene' },
            { dice: 2, range: '6-13', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count, [On Hit] Gain 2 Charge Potency' }
        ],
        'Demolish': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] If the User has Protection, Gain +2 dice Power' },
            { dice: 1, range: '7-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and Count, [On Hit] Gain 2 Charge Potency' },
            { dice: 2, range: '7-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Fragile next Scene, [On Hit] Gain 2 Charge Potency' }
        ],
        'Bioelectricity Induction': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Gain 2 Protection this Scene <br>[On Play] Exchange for every Protection, Gain Blunt DMG UP next Scene' }
        ],
        'Rhino Ram': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] User must have +10 Charge Potency<br>[On Use] For every 5 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] If the User has Protection, Gain +2 dice Power' },
            { dice: 1, range: '5-15', type: 'Shield', damage: '-', special: '[On Clash Win] Gain 1 Protection this Scene' },
            { dice: 2, range: '7-12', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Rupture Potency and Count' },
            { dice: 3, range: '7-13', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Rupture Potency and Count' },
            { dice: 4, range: '7-14', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Rupture Potency and Count' }
        ],
        'Ground Crash': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] User must have +20 Charge Potency<br>[On Use] Consume 20 Charge Potency<br>[On Use] For every 4 Charge Potency the User has, Gain +1 dice Power (Max.3)<br>[On Use] If the User has Protection, Gain +2 dice Power' },
            { dice: 1, range: '22-65', type: 'Blunt', damage: 'Red', special: '[On Clash Win] Inflict 20 Rupture Potency' }
        ],
        'Clone': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Copy the most Expensive Light Page of the Target hand and add that to your hand' }
        ],
        'Disposal': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] If there is already a Target with R Corp. Prey, then when using this Page will remove that status <br>[On Play] Mark the Target with 1 R Corp. Prey for the rest of the Encounter' }
        ],
        
        // Hardblood Abilities
        'Hardblood Manifestation': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Enchant your weapon with Hardblood. Gain 1 Bleed Count on self before using a Page. Gain +1 dice Power for Default Pages. Gain +2 dice Power for Critical Pages.' }
        ],
        'Hardblood Enhancement': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Enchant your weapon with Hardblood. Gain 1 Bleed Count on self before using a Page. Gain +2 dice Power for Default Pages. Gain +3 dice Power for Critical Pages. Can\'t be killed by Bleed.' }
        ],
        'Hardblood Manipulation': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Enchant your weapon with Hardblood. Gain 1 Bleed Count on self before using a Page. Gain +2 dice Power for Default Pages and Inflict +1 Bleed Potency. Gain +3 dice Power for Critical Pages and Inflict +2 Bleed Potency. Can\'t be killed by Bleed. Heal for 10% of Damage dealt by the User\'s Dices (Not effects).' }
        ],
        'Hardblood Synchronization': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Enchant your weapon with Hardblood. Gain 1 Bleed Count on self before using a Page. Gain +2 dice Power for Default Pages and Inflict +1 Bleed Potency. Gain +3 dice Power for Critical Pages and Inflict +2 Bleed Potency. Can\'t be killed by Bleed. Heal for 20% of Damage dealt by the User\'s Dices (Not effects).' }
        ],

        // Special
        'Craft Bullet': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Craft 1 Bullet.' }
        ],
        'Poise Exchange': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play]For every Speed in an Encounter, you can reduce it for that Scene to Gain 5 Poise Potency and 1 Count until one of the dices hit 1 Speed. ' }
        ],
        
        // Luckhold Maids Pages
        'Trained Breathing': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Exchange Poise Potency and Count into Smoke Potency and Count' }
        ],
        'Cleaning Up': [
            { dice: 1, range: '2-5', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency and 1 Count' },
            { dice: 2, range: '2-5', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' }
        ],
        'Swift Evasion': [
            { dice: 1, range: '2-8', type: 'Evade', damage: '-', special: '[On Clash Win] Gain 3 Poise Potency and 1 Count' }
        ],
        'Spotless Cleaning': [
            { dice: 1, range: '3-4', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency and 1 Count; Gain 2 Dice Power next Scene' }
        ],
        'Restrain Target': [
            { dice: 1, range: '2-6', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency' },
            { dice: 2, range: '1-6', type: 'Evade', damage: '-', special: '[On Clash Win] Gain 2 Poise Count' }
        ],
        'Track Him Down': [
            { dice: 1, range: '3-6', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 2 Poise Potency and 1 Count; Transfer all Smoke on Self onto Target' },
            { dice: 2, range: '2-7', type: 'Slash', damage: 'Red', special: '[On Hit] Inflict 2 Bind next Scene' }
        ],
        
        // Ashley Graham Pages
        'Bring Him Home': [
            { dice: 1, range: '3-8', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency and 2 Count; Gain 3 Bind next Scene' }
        ],
        'The Family will not Approve of this': [
            { dice: 1, range: '3-8', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 2 Count' },
            { dice: 2, range: '4-8', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency and 2 Count' }
        ],
        'Disappear': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] When hit 50% HP<br>[On Use] Summon 6 Luckhold Maids and go Untargetable for 1 Scene' }
        ],
        'Restrain the Young Master': [
            { dice: 1, range: '3-7', type: 'Slash', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency' },
            { dice: 2, range: '1-10', type: 'Clash Dice - Evade', damage: '-', special: '[On Clash Win] Gain 2 Poise Potency' }
        ],
        'Flash Cuts': [
            { dice: 1, range: '3-8', type: 'Slash', damage: 'Red', special: '[On Crit] Deal 8 Fixed Damage' },
            { dice: 2, range: '4-8', type: 'Slash', damage: 'Red', special: '[On Crit] Deal 8 Fixed Damage' },
            { dice: 3, range: '4-9', type: 'Slash', damage: 'Red', special: '[On Crit] Deal 8 Fixed Damage' }
        ],
        
        // Luckhold Butler Pages
        'Composed Breathing': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Exchange 5 Poise Potency and 1 Count for Jackpot' }
        ],
        'Repetitive Assistance': [
            { dice: 1, range: '3-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 1 Count' },
            { dice: 2, range: '3-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency and 1 Count' }
        ],
        'Concise Briefing': [
            { dice: 1, range: '1-5', type: 'Clash Dice - Shield', damage: '-', special: '[On Clash Win] Gain 2 Poise Potency' }
        ],
        'Leading the Way': [
            { dice: 1, range: '4-5', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 4 Poise Potency and 2 Count; Gain 1 Blunt DMG Up next Scene for Target "Ben Graham"' }
        ],
        'Defensive Manuever': [
            { dice: 1, range: '3-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 3 Poise Potency' },
            { dice: 2, range: '2-6', type: 'Shield', damage: '-', special: '[On Clash Win] Gain 1 Protection next Scene' }
        ],
        'Way of the Wolf': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Use] Gain 1 Jackpot for Target "Ben Graham"' },
            { dice: 1, range: '3-5', type: 'Shield', damage: '-', special: '[On Clash Win] Gain 1 Jackpot for Target "Ben Graham"' }
        ],
        
        // Ben Graham Pages
        'Mark of the Wolves': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[On Play] Inflict Smell of Fear; Prioritize "Gafstering Luckhold"' }
        ],
        'Be Obedient, Gafs.': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Cannot Crit' },
            { dice: 1, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 5 Poise Potency and 2 Count' }
        ],
        'Return to the Family': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Cannot Crit' },
            { dice: 1, range: '1-9', type: 'Shield', damage: '-', special: '[On Clash Win] Gain 10 Poise Potency' }
        ],
        'I will be your Escort': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Cannot Crit' },
            { dice: 1, range: '3-6', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 1 Jackpot' },
            { dice: 2, range: '1-8', type: 'Shield', damage: '-', special: '[On Clash Win] Gain 5 Poise Potency and Count' }
        ],
        'I must repay my Benefactor': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Cannot Crit' },
            { dice: 1, range: '3-7', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 5 Poise Potency and 3 Count' },
            { dice: 2, range: '3-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 3 Bind next Scene' }
        ],
        'Time to end this Charade.': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] When hit 20% HP<br>[On Play] This Page deals x2 damage<br>[On Use] Gain 5 Poise Potency and 2 Count' },
            { dice: 1, range: '30-45', type: 'Blunt', damage: 'Red', special: '[On Hit] Gain 1 Poise Count' }
        ],
        
        // Lady Luck Casino Pages
        'Enforce': [
            { dice: 1, range: '3-4', type: 'Pierce', damage: 'Red', special: '' }
        ],
        'Secure': [
            { dice: 1, range: '2-6', type: 'Pierce', damage: 'Red', special: '' },
            { dice: 2, range: '1-6', type: 'Shield', damage: '-', special: '' }
        ],
        'Don\'t Interrupt': [
            { dice: 1, range: '4-5', type: 'Pierce', damage: 'Red', special: '[On Hit] Gain 1 Power Up next Scene' }
        ],
        'Get Out': [
            { dice: 1, range: '3-6', type: 'Pierce', damage: 'Red', special: '' },
            { dice: 2, range: '3-7', type: 'Shield', damage: '-', special: '' }
        ],
        
        // Luckhold Siblings Pages
        'Ughhh...': [
            { dice: 1, range: '3-8', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 1 Mute next Scene' }
        ],
        'It Hurts...': [
            { dice: 1, range: '3-8', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 1 Blindness next Scene' }
        ],
        'Help Us...': [
            { dice: 1, range: '3-8', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 1 Deaf next Scene' }
        ],
        'Gafs...': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Cannot Crit' },
            { dice: 1, range: '3-8', type: 'Blunt', damage: 'Black', special: '[On Hit] Inflict 1 Despair next Scene' }
        ],
        'COWARD': [
            { dice: 1, range: '10-10', type: 'Blunt', damage: 'White', special: 'Unclashable; Deal x4 Damage to Gafs' }
        ],
        'WHY DID YOU LEAVE US': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] At Scene 6+, if Gafs didn\'t convince Them' },
            { dice: 1, range: '20-30', type: 'Blunt', damage: 'Black', special: '' }
        ],
        
        // Faith of the Promised Land Pages
        'Fates Sealed': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: 'Rolls 1d6 to determine the Page to use' }
        ],
        'Lowly Coward': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Roll a 1<br>Takes 20 Fixed Damage, Rerolls the Dice' }
        ],
        'Unjust Execution': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Roll a 2<br>Targets Escher' },
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 1 Power Down next Scene' }
        ],
        'Burdened Past': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Roll a 3<br>Targets Tsuki' },
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Bind next Scene' }
        ],
        'Severed Fates': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Roll a 4<br>Targets Deimos' },
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Inflict 2 Fragile next Scene' }
        ],
        'Unspoken Trauma': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Roll a 5<br>Targets Ena' },
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Deal 10 Fixed SP Damage' }
        ],
        'Clinging onto a Memory': [
            { dice: 0, range: 'No dice', type: 'Special', damage: 'Special', special: '[Condition] Roll a 6<br>Targets Sualman' },
            { dice: 1, range: '4-8', type: 'Blunt', damage: 'Red', special: '[On Hit] Deal 10 Fixed Damage' }
        ]
    };
}
