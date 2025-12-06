export function getStatusEffectDescriptions() {
    return {
        'effect-warning': {
            name: 'Warning',
            messages: {
                1: 'First Warning. You better start listening now.',
                2: 'Second Warning. Watch yourself.',
                3: 'That was your final warning. Now, as obstruction of contract execution has been observed, I am compelled to take decisive action.'
            }
        },
        'effect-burn': {
            name: 'Burn',
            description: 'At the end of a Scene, the unit with Burn will take fixed damage equal to Burn Potency and the Burn Count will be reduced by 1.'
        },
        'effect-tremor': {
            name: 'Tremor',
            description: 'When the unit with Tremor gets Staggered, they take fixed damage equal to the Tremor Potency.'
        },
        'effect-tremor-execution': {
            name: 'Tremor - Execution',
            description: '- Convert Tremor into Tremor - Execution upon inflicted<br><br>- If Tremor Potency inflicted onto Tremor - Execution, turn the Tremor Potency into Tremor - Execution Potency<br><br>- Every 1 Tremor - Execution Potency equates to 0.25% Max HP<br><br>- Can only be triggered through Tremor Burst<br><br>- If not triggered through Tremor Burst, does not do anything; After triggered by Tremor Burst, create a threshold on the HP Bar in correspondence to the Potency of Tremor - Execution for 3 Scenes. When Current HP reaches the threshold, immediately execute the Target. (once)'
        },
        'effect-bleed': {
            name: 'Bleed',
            description: 'For every individual attack with an Attack Dice, the unit with Bleed takes fixed damage equal to the Bleed Potency, and the Bleed Count is reduced by 1.'
        },
        'effect-rupture': {
            name: 'Rupture',
            description: 'When hit, the unit with Rupture will take damage equal to the Rupture Potency, and the Rupture Count will be reduced by 1.'
        },
        'effect-sinking': {
            name: 'Sinking',
            description: 'When hit, the unit with Sinking will take SP damage equal to the Sinking Potency, and Sinking Count will be reduced by 1. Units with no SP will take fixed damage equal to the Sinking Potency instead.'
        },
        'effect-ignite-weaponry': {
            name: 'Ignite Weaponry',
            description: 'Each attack dice will now also apply 1 additional Burn Potency for 5 Scenes'
        },
        'effect-ammo': {
            name: 'Bullets',
            description: 'Number of bullets remaining. Used for certain pages that consume ammo.'
        },
        'effect-zwei-defensive': {
            name: 'Zwei Defensive Stance',
            description: 'Active defensive stance from Zwei Association pages. Provides defensive bonuses.'
        },
        'effect-augury-infusion': {
            name: 'Augury Infusion',
            description: 'Allow you to use other Hana Association Pages without backlash within this Encounter<br><br>Every attack after this will deal additional Black damage according to Temperance: 1 - 6 (1 each level)<br><br>Every attack after this will gain Trigram<br><br>Each attack will now also apply 2 Tremor Potency'
        },
        'effect-fates-sealed': {
            name: 'Fates Sealed',
            description: '[On Play] Roll 1d6 to determine the Page to use:<br>1: Lowly Coward<br>2: Unjust Execution (Escher)<br>3: Burdened Past (Tsuki)<br>4: Severed Fates (Deimos)<br>5: Unspoken Trauma (Ena)<br>6: Clinging onto a Memory (Sualman)<br>'
        },
        // Thumb Ammunition indicators
        'effect-thumb-ammo-shock': {
            name: 'Shock Ammunition',
            description: '[Condition] Can only use 1 Thumb Ammunition type per Scene<br><br>[On Play] If first time using this Page in this Scene, Every attack dice will have a 50% chance to inflict 1 Paralyze On Hit for 1 Scene (roll 1d2)<br><br>[On Play] If second time using this Page in this Scene, Every attack dice will have a 100% chance to inflict 1 Paralyze On Hit for 1 Scene'
        },
        'effect-thumb-ammo-frost': {
            name: 'Frost Ammunition',
            description: '[Condition] Can only use 1 Thumb Ammunition type per Scene<br><br>[On Play] If first time using this Page in this Scene, Every attack dice will inflict 1 Bind On Hit for 1 next Scene (Applies next Scene) (Max. 2)<br><br>[On Play] If second time using this Page in this Scene, Every attack dice will inflict Immobilized On Hit for 1 next Scene (Applies next Scene) (Max. 1)'
        },
        'effect-thumb-ammo-ap': {
            name: 'Armor-Piercing Ammunition',
            description: '[Condition] Can only use 1 Thumb Ammunition type per Scene<br><br>[On Play] If first time using this Page in this Scene, Weaken every dice Power that is clashing with yours by 2 for 1 Scene<br><br>[On Play] If second time using this Page in this Scene, Weaken every dice Power that is clashing with yours by 4 for 1 Scene'
        },
        'effect-thumb-ammo-incendiary': {
            name: 'Incendiary Ammunition',
            description: '[Condition] Can only use 1 Thumb Ammunition type per Scene<br><br>[On Play] If first time using this Page in this Scene, Every attack dice will inflict 3 Burn Potency On Hit for 1 Scene<br><br>[On Play] If second time using this Page in this Scene, Every attack dice will inflict 6 Burn Potency On Hit for 1 Scene'
        },
        'effect-trigram-geon': {
            name: 'Trigram: Geon',
            description: 'One of the four trigrams used. Required for True Trigram Formation.'
        },
        'effect-trigram-gon': {
            name: 'Trigram: Gon',
            description: 'One of the four trigrams used. Required for True Trigram Formation.'
        },
        'effect-trigram-gam': {
            name: 'Trigram: Gam',
            description: 'One of the four trigrams used. Required for True Trigram Formation.'
        },
        'effect-trigram-gi': {
            name: 'Trigram: Gi',
            description: 'One of the four trigrams used. Required for True Trigram Formation.'
        },
        'effect-powerup': {
            name: 'Power Up',
            description: 'All Dices gain Final Power by the effect\'s value for one Scene. (Max. 10)'
        },
        'effect-attackpowerup': {
            name: 'Attack Power Up',
            description: 'Attack Dices gain Dice Power by the effect\'s value for one Scene.'
        },
        'effect-defensepowerup': {
            name: 'Defense Power Up',
            description: 'Defense Dices gain Dice Power by the effect\'s value for one Scene.'
        },
        'effect-charge': {
            name: 'Charge',
            description: 'Gained through various Dices and is spent to improve Page effects.'
        },
        'effect-slashdmgup': {
            name: 'Slash Damage Up',
            description: 'Increase the damage of Slash Dices by X(X*10)%. (Max. 10)'
        },
        'effect-piercedmgup': {
            name: 'Pierce Damage Up',
            description: 'Increase the damage of Pierce Dices by X(X*10)%. (Max. 10)'
        },
        'effect-bluntdmgup': {
            name: 'Blunt Damage Up',
            description: 'Increase the damage of Blunt Dices by X(X*10)%. (Max. 10)'
        },
        'effect-modified-ampule': {
            name: 'Modified K Corp Ampule',
            description: 'Gain X×5% of Max HP at the end of every Scene. At 5+ Modified K Corp. Ampule, kill the user.'
        },
        'effect-slashdmgdown': {
            name: 'Slash Damage Down',
            description: 'Reduce the damage of Slash Dices by X(X*10)%. (Max. 10)'
        },
        'effect-piercedmgdown': {
            name: 'Pierce Damage Down',
            description: 'Reduce the damage of Pierce Dices by X(X*10)%. (Max. 10)'
        },
        'effect-bluntdmgdown': {
            name: 'Blunt Damage Down',
            description: 'Reduce the damage of Blunt Dices by X(X*10)%. (Max. 10)'
        },
        'effect-powerdown': {
            name: 'Power Down',
            description: 'All Dices lose Final Power by the effect\'s value for one Scene. (Max. 10)'
        },
        'effect-attackpowerdown': {
            name: 'Attack Power Down',
            description: 'Attack Dices lose Final Power by the effect\'s value for one Scene. (Max. 10)'
        },
        'effect-defensepowerdown': {
            name: 'Defense Power Down',
            description: 'Defense Dices lose Final Power by the effect\'s value for one Scene. (Max. 10)'
        },
        'effect-fragile': {
            name: 'Fragile',
            description: 'Take more damage from Dices based on the effect\'s Count for one Scene. (Max. 10)'
        },
        'effect-protection': {
            name: 'Protection',
            description: 'Take less damage from Dices based on the effect\'s Count for one Scene. (Max. 10)'
        },
        'effect-declaredduel': {
            name: 'Declared Duel',
            description: 'In an Encounter, the unit inflicted and the declarer engage in a Duel:<br><br>They cannot choose other targets, and the declarer gain +2 Max dice Power.<br><br>When someone Staggers, Inflict 2 Bind and 2 Fragile. This effect last until one of two Staggers.'
        },
        'effect-focusedattack': {
            name: 'Focused Attack',
            description: 'The unit that inflicted this Focused Attack gains the following effects based on the target Slot\'s Focused Attack Stack.<br><br>·1x Stack: Inflict 1 Rupture Potency On Hit<br><br>·2x Stack: Gain 1 Power Up<br><br>·3x Stack: Gain 1 Power Up and dice Power<br><br>- Expires if, for a Scene, the unit who inflicted it fails to hit the Slot inflicted with their Focused Attack.<br><br>- Expires if the unit who inflicted Focused Attack inflicts it on a different Slot.<br><br>- Replaced if a different unit inflicts Focused Attack on a Slot already inflicted with Focused Attack.<br><br>- At the start of the next Scene, if a Slot inflicted with Focused Attack is no longer present, rearrange all Focused Attacks inflicted against the Slots of that Part in the order of Deployment'
        },
        'effect-haste': {
            name: 'Haste',
            description: 'Speed increases by the effect\'s Count for one Scene.'
        },
        'effect-poise': {
            name: 'Poise',
            description: 'Gained through Pages and gives attacks a chance to deal a Critical Hit, increasing damage dealt by 50%. The chance for a Critical Hit is dependent on Poise Potency (Crit chance = (Potency * 5)%), while Poise Count decreases by 1 on a Critical Hit. (either on hit or against a defense dice)'
        },
        'effect-jackpot': {
            name: 'Jackpot',
            description: 'Re-use the first dice that Crits for every Count of this Status. Reduce the Count by 1 for each time Re-using the dice.'
        },
        'effect-taunt': {
            name: 'Taunt',
            description: 'More likely to be targeted by enemies.'
        },
        'effect-smelloffear': {
            name: 'Smell of Fear',
            description: 'When "Ben Graham" Clashes against the Target that has this Status will gain +2 dice Power Up'
        },
        'effect-decay-ampule': {
            name: 'Decay Ampule',
            description: 'Take damage by X×2% of Max HP at the end of every Scene.'
        },
        'effect-bind': {
            name: 'Bind',
            description: 'Speed decreases by the effect\'s Count for one Scene.'
        },
        'effect-paralysis': {
            name: 'Paralysis',
            description: 'Fix the Power of X (Count) Dice(s) to the lowest value possible.'
        },
        'effect-bravery': {
            name: 'Bravery',
            description: 'You are filled with Bravery. Unleash your Potential.'
        },
        'effect-nervous': {
            name: 'Nervous',
            description: 'Lose 10% of Max SP. (For 1 Scene)'
        },
        'effect-intimidated': {
            name: 'Intimidated',
            description: 'Lose 20% of Max SP. (For 1 Scene)'
        },
        'effect-terrified': {
            name: 'Terrified',
            description: 'Lose 30% of Max SP. (For 1 Scene)'
        },
        'effect-hopeless': {
            name: 'Hopeless',
            description: 'Lose 60% of Max SP. (For 1 Scene)'
        },
        'effect-overwhelmed': {
            name: 'Overwhelmed',
            description: 'Lose 100% of Max SP. (For 1 Scene)'
        },
        'effect-calm': {
            name: 'Calm',
            description: 'Gain 5% Max SP as Shield. (For 1 Scene)'
        },
        'effect-relaxed': {
            name: 'Relaxed',
            description: 'Gain 10% Max SP as Shield. (For 1 Scene)'
        },
        'effect-resolved': {
            name: 'Resolved',
            description: 'Gain 15% Max SP as Shield. (For 1 Scene)'
        },
        'effect-optimistic': {
            name: 'Optimistic',
            description: 'Gain 20% Max SP as Shield. (For 1 Scene)'
        },
        'effect-persevere': {
            name: 'Persevere',
            description: 'Gain 25% Max SP as Shield. (For 1 Scene)'
        }
    };
}

