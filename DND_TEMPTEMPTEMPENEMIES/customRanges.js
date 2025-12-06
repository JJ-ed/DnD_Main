export function getCustomRanges() {
    return {
        //Regular Pages
        'Evade': ['1-4'],
        'Light Attack': ['2-3','1-4'],
        'Light Defense': ['1-5','2-3','1-2'],
        'Charge and Cover': ['3-6','2-6'],
        'Thrust': ['1-4','1-4',],
        'Focused Strikes': ['3-5','3-5','3-5'],
        'Alleyway Counter': ['1-20'],

        // Hana Association
        'Augury Kick': ['18-23', '17-24'],
        'Augury Crusher': ['19-23'],
        'True Trigram Formation': ['15-20', '20-25', '25-30'],
        'Unyielding Strike': ['17-20', '17-20', '12-30'],
        'Impugnatio Ultima': ['14-24', '18-28', '22-32', '26-36', '30-40'],
        
        // Zwei Association
        'Defensive Stance': ['6-8'],
        'Sharp Swipe': ['4-5'],
        'Avert': ['2-4', '3-5'],
        'Retaliate': ['1-12', '4-8', '3-8'],
        'Law and Order': ['2-6'],
        'Your Shield': ['2-14'],
        'Fence': ['1-14', '4-9', '5-10'],
        'Handling Work': ['6-12', '5-14', '10-16'],
        'Combat Preparation': ['3-12', '14-20', '8-15'],

        // Shi Association
        'To Overcome Crisis': ['2-7'],
        'Extreme Edge': ['2-12'],
        'Desperate Struggle': ['3-5', '3-5'],
        'Endless Battle': ['4-5', '3-5', '3-5'],
        'Flying Sword': ['5-7', '5-7'],
        'Flashing Strike': ['5-8', '5-8', '6-9'],
        'Boundary of Death': ['14-24'],
        
        // Cinq Southern Association
        'Remise': ['4-8', '5-12', '6-10'],
        'Flèche': ['5-25'],
        'Marche': ['5-18', '10-14'],
        'Punition': ['8-16', '12-22'],
        'Feint': ['8-19', '14-20', '9-17'],
        'Balestra Fente': ['14-22', '12-18', '16-22'],
        
        // Cinq Western Association 
        'Allez': ['5-10', '6-12'],
        'Riposte': ['1-20', '12-15'],
        'Coup Droit': ['7-9', '2-12'],
        'Fente': ['8-16'],
        'Contre Attaque': ['1-20', '8-14', '3-18'],
        'Salut': ['12-18', '9-14', '10-17', '12-20'],
        
        // Liu Association
        'Flowing Flame': ['2-5', '2-4'],
        'Red Kick': ['3-6', '3-7'],
        'Fiery Knife Hand': ['3-7', '2-8', '4-6'],
        'Perfected Death Fist': ['3-8', '3-8', '3-8', '3-8'],
        'Pinpoint Blitz': ['2-8', '3-7', '4-6'],
        'Inner Gate Elbow Strike': ['5-9', '6-8', '6-8', '7-10'],
        'Frontal Assault': ['6-9', '5-10', '6-10'],
        'Fiery Waltz': ['6-12', '7-12'],
        'Single-Point Stab': ['5-10', '7-10'],
        'Emotional Turbulence': ['7-10', '7-12', '7-12', '7-12'],
        'Coordinated Assault': ['6-10', '7-10', '4-15'],
        'Inner Ardor': ['9-13', '7-16'],
        'Fervid Emotions': ['6-16', '7-16', '7-16'],
        'All-out War': ['10-12', '9-14'],
        'Fiery Dragon Slash': ['22-30', '18-26'],
        
        // Seven Association
        'Predictive Analysis': ['2-5', '2-4'],
        'Prodding': ['3-6', '3-7'],
        'Swash': ['4-8', '5-12'],
        'Upwards Slash': ['5-10', '6-12'],
        'Slash': ['6-12', '7-14'],
        'Profiling': ['7-14', '8-16'],
        'Forensics': ['8-16', '9-18'],
        'Exploit The Gap': ['9-18', '10-20'],

        // Devyat Association
        'Courier Trunk - Decay Knife': ['6-10', '7-9'],
        'Courier Trunk - Decay Hammer': ['6-10', '7-9'],
        'Courier Trunk - Gadget Reveal': ['10-12', '10-12'],
        'Courier Trunk - Demolition Gadget': ['10-12', '10-12'],
        'Courier Trunk - Poludnitsa': ['15-22', '15-22'],

        // Dieci Association
        'Expend Knowledge': ['10-11'],
        'Unveil': ['8-10', '12-12', '8-12'],
        'Studious Dedication': ['10-14', '12-15'],
        'Guiding Steps': ['12-17'],
        'Excruciating Study': ['10-14', '12-15', '13-14'],
        'Scorched Knowledge': ['8-10', '7-12', '7-13', '8-11'],

        // Öufi Association
        'Sentence': ['10-16'],
        'Execution Advised': ['6-10', '8-9'],
        'Execution Sentencing': ['9-12', '8-13'],
        'Do Not Obstruct': ['9-12', '8-13', '9-12'],
        'Grave Attendance': ['12-18', '14-18'],
        'Bona Fide': ['1-20'],
        'Execution Imminent': ['17-20', '17-20', '17-20'],
        'Obligation Fulfillment': ['14-19', '14-19', '14-19'],
        'Unrelenting Execution': ['13-20', '12-22', '13-22', '13-23', '13-24'],

        // The Thumb
        'Suppressing Shot': ['9-12', '8-13'],
        'Focus Fire': ['10-13', '8-14', '10-13'],
        'Steel Knuckles': ['10-15', '10-13', '10-13'],
        'Class and Respect': ['11-14', '11-14', '11-14'],
        'Summary Judgement': ['10-17', '10-16', '10-16'],
        'Discipline': ['13-17', '13-17', '12-19', '13-20'], //On hit, Re-use this dice 3 time 
        'Le Regole': ['12-20', '12-21', '12-19'],

        // The Index
        'Faith': ['4-10', '5-9'],
        'Proselyte\'s Blade': ['5-10', '5-10'],
        'Execute': ['6-10', '6-10'],
        'Sense Quarry': ['5-8', '5-8', '5-14'],
        'Will of the Prescript': ['2-12', '5-9', '5-10'],
        'Undertake Prescript': ['5-10', '5-9', '5-10'],
        'Multislash': ['5-10', '5-10'],
        'Binding Chains': ['5-12', '5-12'],
        'Heavy Trace': ['6-14', '6-14'],
        'Swift Trace': ['6-14', '6-14', '7-13'],
        'Unlock - I': ['4-10'],
        'Unlock - II': ['5-12', '5-12'],
        'Unlock - III': ['6-12', '6-12', '6-12'],
        'Unlock - IV': ['6-14', '6-14', '6-14', '6-14'],
        'Eliminate': ['6-15', '6-15'],
        'Eradication': ['23-45'],
        'Decapitation': ['17-28'],
        'Castigation': ['7-21', '7-25'],

        //The Middle
        'Checking the Book': ['10-15'],
        'Punching': ['5-7', '6-8'],
        'Kicking': ['4-8', '5-7', '6-9'],
        'Right in the Solar Plexus': ['4-10', '5-9', '6-10'],
        'Proof of Loyalty': ['5-9', '5-8', '6-9'],
        'Chains of Loyalty': ['5-11', '6-10'],
        'Payback': ['12-19'],
        'Payback with Interest': ['8-14'], //Dice 2: Deal Red Damage equally to the damage taken in last Scene, On Hit inflict 1 Paralyze
        'Promised Suffering': ['7-14','8-15'],
        'ENOUGH GAMES!': ['12-20'],
        'A Just Vengeance': ['9-12', '9-13', '9-14','10-15'],

        // The Ring
        'Paint': ['5-8','4-10'],
        'Splattered': ['5-9','5-9'],
        'Coloring': ['5-9','5-9'],
        'Brushstroke': ['6-10','6-10'],
        'Dotting': ['6-12', '5-13'],
        'Natural Style': ['4-13'],
        'A Single Point of Art': ['10-16'],
        'Beat the Brush': ['8-14', '8-15'],
        'Artwork Inspection': ['7-19'],
        'Hematic Coloring': ['9-16', '9-16'],
        'Pointillism': ['10-18', '10-18', '10-18', '10-18'],
        'Sanguine Pointillism': ['11-20'],
        'Blood of the Valley': ['10-18', '10-18', '10-18', '10-18', '10-18'],

        // Kurokumo Clan
        'Rules of the Backstreets': ['1-20'],
        'Focus Strike': ['2-7'],
        'Downward Slash': ['2-6', '3-5'],
        'Clean Up': ['3-7', '4-6'],
        'Cleave': ['2-9'],
        'Lenticular Swirl': ['4-8', '5-7'],
        'Lenticular Rend': ['1-10', '10-16'],
        'Stormcloud': ['5-10', '6-12'],
        'Cloudburst': ['7-12', '6-14'],
        'Thundercleave': ['7-12', '6-14', '4-15'],
        'Ink Over': ['7-12', '6-14', '5-15', '10-15'],

        // Blade Lineage
        'Overthrow': ['1-20'],
        'Overthrow: Counter Slash': ['10-12', '12-14', '14-16', '16-18', '18-20'],
        'Draw of the Sword': ['5-12', '6-12'],
        'Heel Turn': ['2-15', '6-12'],
        'Flank Thrust': ['2-20', '8-15'],
        'Moonlit Blade Dance': ['6-14', '6-14', '6-14'],
        'Blade Arc': ['7-23'],
        'Acupuncture': ['9-15', '8-16', '7-17'],
        'Slay': ['5-17', '4-18'],
        'Yield My Flesh': ['20-0'],
        'To Claim Their Bones': ['15-18', '18-20', '20-22', '21-23', '23-25'],

        // Full Stop Office
        'Melee Support': ['3-7'],
        'Taking Cover': ['3-15'],
        'Target Marked': ['2-9', '2-9'],
        'Combo: Target Marked': ['2-9', '2-9', '3-10'],
        'Return Fire': ['4-11', '4-11', '4-11'],
        'Headshot': ['5-20'],
        'Beyond the Shadow': ['3-12', '2-11'],
        'Full-Stop to Life': ['5-12', '5-12', '4-17'],
        'Combo:Full-Stop to Life': ['5-12', '5-12', '4-17', '6-16'],
        'Goin for the Bullseye': ['12-25'],
        'AL-HV Pulverisation Round': ['18-39'],

        // Dawn Office
        //'Searing Blade': 'Description only',
        'Sunset Blade': ['2-5', '3-6'],
        'Flash of Sunup': ['4-5', '3-6'],
        'Crack of Dawn': ['2-10'],
        'Rue': ['2-5', '2-5'],
        'Stigmatize': ['4-9', '4-9'],

        // Volatile Ego: Waxen Pinion
        //Searing Sword': 'Description only'
        'Flaring Brand': ['3-10', '4-9'],
        'Fierce Charge': ['5-12'],
        'Feather Shield': ['2-14', '2-14', '1-15'],
        'Rueful Eventide': ['6-12', '5-13'],
        'Blazing Strike': ['18-25'],

        // Gaze Office
        //'Observe': 'Description only',
        'Unavoidable Gaze': ['4-6', '3-7'],
        'Structural Analysis': ['1-5', '2-5', '2-6'],
        'You\'re a Hindrance': ['2-8', '2-8', '1-8'],
        'Electric Shock': ['4-8', '4-8'],
        'Opportunity Spotted': ['4-10', '4-9', '4-9', '4-9'],
        'Zzzzzap': ['3-12', '3-12'],
        'Binding Arms': ['7-18'],
        'Singularity Seeker': ['7-20'],

        // Twin Hook Pirates
        //'Unjust Enrichment': 'Description only',
        'Looting': ['2-5'],
        'Tear the Flesh': ['2-6'],
        'Hook Slice': ['2-4', '3-4'],
        'Tear the Gap': ['2-7', '3-8'],
        //'Easy Breathing': 'Description only',
        //'Two Sides of a Coin': 'Description only',
        'Negotiation Start': ['5-12', '6-12'],
        'Unilateral Business': ['5-10', '5-10'],
        'Foregone Conclusion': ['7-18', '7-18'],

        //Ting Tang Gang
        //'Gamble on Life': 'Description only',
        'Carve': ['2-4'],
        'Heavy Swing': ['2-5', '2-5'],
        'Sneaky Bash': ['2-5', '2-6'],
        'Cunning Stab': ['3-6', '3-7'],
        //'Glinting Wish': 'Description only',
        'Throat Slit': ['3-8', '3-8'],
        'Shank': ['4-10', '4-10', '4-10'], //[On Use] Re-Use if you have 5+ Luck Power or Roll a nat 20
        'Mutilate': ['8-25'],

        // Los Mariachis
        //'Baile Y Rola': 'Description only',
        '¡Rápidamente!': ['2-5', '2-5'],
        'Bailemos~': ['2-6'],
        '¡Olé!': ['3-8', '4-8'],
        '¿Eso es todo?': ['4-12', '4-12', '4-12'],
        'Duelo de Baile': ['4-9', '4-9'],
        //'Joviales': 'Description only',
        //'Emocionado': 'Description only',
        //'Pañata Party~!': 'Description only',
        'Se Acabó la Fiesta': ['4-16', '5-18'],

        // Wuthering Heights
        //'Echoes of the Manor': 'Description only',
        'Confiscation': ['3-6', '3-7'],
        'Interloper Reception': ['4-8'],
        'Knocking': ['4-7', '4-8'],
        'Hunting Plans': ['2-10', '3-7'],
        'Dusting': ['4-9', '4-9', '4-12'],
        'Heartseal': ['5-11', '5-11', '5-12', '5-12'],
        'As Mistress Commands': ['5-14', '5-16', '5-16', '5-18'],

        // The Wild Hunt
        'Oh Dullahan...': ['5-15', '6-15'],
        'Beheading': ['7-18', '7-19'],
        'Memorial Procession': ['7-16', '7-19', '7-22'],
        'Requiem': ['8-20', '16-32'],
        'Lament, Mourn, and Despair': ['16-26', '26-40'],

        // Dead Rabbits Gang
        'Smackdown': ['2-15'],
        'Hurt': ['2-6'],
        'Break': ['2-6', '3-6'],
        'Remove': ['3-7'],
        'Get Out of My Sight': ['4-5', '4-7'],
        'Hold Them Back': ['4-7', '3-9'],
        'Counter': ['1-20'],  
        'Breakthrough': ['5-10', '5-11'],
        'Bat Bash': ['7-10', '6-11'],
        'Upheaval': ['4-14', '4-15', '4-16'],
        'Relentless': ['4-13', '4-14', '5-15', '5-16'],


        // Rosespanner Workshop
        //'Synchronization': 'Description only',
        'I\'ll Grind You Up': ['2-6'],
        'Rev Up': ['3-6', '3-7'],
        'Vibration Amplification': ['4-8'],
        'Stand Back!': ['4-8', '2-10'],
        'Trembling Conversion': ['3-6', '3-7'],
        'Vibration Compression': ['4-12'],
        'Final Warmup': ['4-12', '2-16'],
        'Let\'s Rack Up Some Scores': ['10-20'],

        // Multicrack Office
        //'Activate Prosthesis': 'Description only',
        '40S-2 Activation': ['4-9', '4-10'],
        'Photoelectric Mark': ['4-10', '4-11'],
        'Photoelectric Harpoon': ['4-14', '4-14', '4-15'],
        '40Y-3 Activation': ['5-14', '6-14'],
        '40Y-3 Charge': ['5-15', '5-16', '5-16', '5-18'],
        //'Charge': 'Description only',
        'Charge Countercurrent': ['4-18', '16-26', '22-30'],

        // Fang Hunt Office
        //'Blood Lure': 'Description only',
        'Slam': ['2-5', '3-6'],
        'Crush Wounds': ['3-7', '3-8'],
        'Wild Swinging': ['3-8', '3-8', '4-9'],
        'Styptics': ['4-9', '5-10'],
        //'Hemostasis': 'Description only',
        //'Hemostasis': 'Description only',
        'Anti-Bloodfiend Crush': ['4-10', '4-11', '4-12'],

        // Firefist Office
        'Overheated Fuel': ['4-16'],
        'Fire Punch': ['4-11'],
        'Flamethrow': ['4-12', '5-12'],
        'I\'ll burn away every last drop of your filthy blood': ['4-14', '5-14', '5-14'],
        'I have to keep going for Big Sis': ['4-16', '5-17'],
        'Firefist': ['5-16', '6-18', '7-20'],

        //N Corp.
        //'Inquisition':'Description only',
        'Nail Pin': ['2-4', '2-4'],
        'Hammer': ['2-7'],
        'Knock': ['2-5', '2-5'],
        'Plunge In': ['3-6', '3-6'],
        'Purify': ['2-6', '2-6', '2-6'],
        //'Retribution': 'Description only', // no dice listed
        'Ruling Hammer': ['3-4', '2-5'],
        'Rightful Purge': ['2-6', '3-7'],
        'Congregate': ['2-6', '2-6', '3-7'],
        'Ponderous Inquisition': ['4-8', '4-9'],
        'Fanatical Judgement': ['4-8', '5-9', '5-9'],
        'Spike Drive': ['3-8', '3-8'],
        'Drive': ['3-8', '3-8'],
        'Foolishness…!': ['3-12', '3-8'],
        'You Are Cleansed of Sin': ['3-15'],
        'Annihilate Heretics': ['4-10', '5-10', '5-12', '5-13'],
        'Deep Thrust': ['4-10'],
        'The Gripping': ['3-12', '3-12'],
        'Coerced Judgement': ['3-15', '3-15'],
        'Cackle': ['5-13', '5-14'],
        'Sin-skewering Nail': ['5-13', '5-14', '5-14'],
        'Amoral Enactment': ['5-14', '5-15', '5-23'],
        'Execution': ['5-13', '5-14', '5-14', '5-14'],
        'Self-destructive Purge': ['0-24', '24-40'],
        //'Enough' - 'Heal'

        //W Corp Pages
        //'Dimensional Rift': [],  no dice values, just description
        'Rip': ['4-10', '4-11'],
        //'Rewind': [], no dice values, special effect only
        'Energy Cycle': ['4-11', '4-12'],
        'Overcharged': ['5-13', '4-14', '5-15', '2-15'], 
        'Ripple': ['4-16', '5-20'],
        'Leap': ['4-14', '5-16'],
        'Charged Leap': ['4-20', '5-22'],
        'Rip Space': ['5-10', '8-16', '12-22', '16-26', '20-32'],
        'Rip Dimension': ['8-16', '12-20', '16-26', '20-30', '26-36'],

        //T Corp Pages
        //'Time Moratorium': [], no dice, just applies Tremor
        'Prepare to Collect': ['4-9'],
        'T Corp. Martial Suppression': ['4-9', '4-10'],
        'Execute Collections': ['4-11', '4-12'],
        //'Borrow Time': [], no dice, special effect
        'Let Us Prepare to Collect': ['5-13'],
        'T Corp. Accelerated Amputator': ['4-11', '4-12', '5-12'],
        //'I Shall Summon the Time': [], // no dice, shield/protection effect
        'I Command. Halt!': ['4-16', '4-18', '5-19', '6-22'],

        //K Corp Pages
        'Takedown': ['2-5'],
        'Raid': ['2-5', '2-5'],
        'Neutralize Target': ['2-6', '2-6'],
        'Blockade': ['2-8'],
        'Shelter': ['2-7', '3-8'],
        'Pause! Halt!': ['3-5'],
        'Stop There, Please!': ['3-7'],
        'Arresting!': ['3-6', '3-6'],
        'Stop the Intruder': ['3-7', '3-8', '3-7'],
        'Forbid Entry': ['3-8', '3-9'],
        'Proximity Shooting': ['3-7'],
        'Flash; Flash;': ['3-5'],
        'Impeding movement.': ['3-6', '3-7'],
        'Arresting.': ['3-6', '3-7'],
        'Suspicious Individuals': ['4-8'],
        'No Trespassing': ['4-9', '4-9'],
        'Impede the Intruder': ['8-16'],
        'Decay Blade': ['4-9', '5-11'],
        'Excise Target': ['5-12', '6-15'],

        //R Corp. Pages
        'Graze the Grass': ['2-13', '5-10'],
        'Energy Strike': ['4-11', '4-11'],
        'Mind Strike': ['4-13', '4-14'],
        'Flaying Surge': ['5-11', '5-12'],
        'Concentration': ['3-14', '5-12', '5-12'],
        'Mind Whip': ['5-11', '5-12', '5-12', '5-12'],
        'Mind Crush': ['5-11', '5-12', '5-14', '5-17'],
        'Pinpoint Shot': ['4-12', '4-12'],
        'Concentrated Fire': ['3-15', '3-15', '3-15'],
        'Battle Command': ['5-14', '5-14', '5-14'],
        'Rapid Gashes': ['7-12', '6-13', '5-14'],
        'Quick Suppression': ['6-16', '6-16', '6-16', '6-16', '6-16'],
        'Savage Mode': ['7-14', '7-14', '7-14', '7-14', '7-14'],
        'Bulky Impact': ['5-13'],
        'Weighty Bash': ['10-10', '6-13'],
        'Demolish': ['7-12', '7-12'],
        'Rhino Ram': ['5-15', '7-12', '7-13', '7-14'],
        'Ground Crash': ['22-65'],

        // Molar Boatworks Office
        'Unstable Power Output': ['2-4'],
        'Fierce Assault': ['2-4'],
        'Steady...': ['2-5', '1-7'],
        'Crab Bastards!': ['2-10'],
        'Here to get your Boats Fixed?': ['2-8', '2-10'],
        'Ready to Crush': ['3-7', '4-8'],
        'Explosive Blast': ['3-8', '4-9', '5-10'],
        'Risky Judgement': ['5-9', '5-9', '5-12', '5-14'],

        // Special
        'Craft Bullet': ['1-20'],
        
        // Luckhold Maids Pages
        'Cleaning Up': ['2-5', '2-5'],
        'Swift Evasion': ['2-8'],
        'Spotless Cleaning': ['3-4'],
        'Restrain Target': ['2-6', '1-6'],
        'Track Him Down': ['3-6', '2-7'],
        
        // Ashley Graham Pages
        'Bring Him Home': ['3-8'],
        'The Family will not Approve of this': ['3-8', '4-8'],
        'Restrain the Young Master': ['3-7', '1-10'],
        'Flash Cuts': ['3-8', '4-8', '4-9'],
        
        // Luckhold Butler Pages
        'Repetitive Assistance': ['3-5', '3-5'],
        'Concise Briefing': ['1-5'],
        'Leading the Way': ['4-5'],
        'Defensive Manuever': ['3-6', '2-6'],
        'Way of the Wolf': ['3-5'],
        
        // Ben Graham Pages
        'Be Obedient, Gafs.': ['3-8'],
        'Return to the Family': ['1-9'],
        'I will be your Escort': ['3-6', '1-8'],
        'I must repay my Benefactor': ['3-7', '3-8'],
        'Time to end this Charade.': ['30-45'],

        // Lady Luck Casino Pages
        'Enforce': ['3-4'],
        'Secure': ['2-6', '1-6'],
        'Don\'t Interrupt': ['4-5'],
        'Get Out': ['3-6', '3-7'],
        
        // Luckhold Siblings Pages
        'Ughhh...': ['3-8'],
        'It Hurts...': ['3-8'],
        'Help Us...': ['3-8'],
        'Gafs...': ['3-8'],
        'COWARD': ['10-10'],
        'WHY DID YOU LEAVE US': ['20-30'],
        
        // Faith of the Promised Land Pages
        'Unjust Execution': ['4-8'],
        'Burdened Past': ['4-8'],
        'Severed Fates': ['4-8'],
        'Unspoken Trauma': ['4-8'],
        'Clinging onto a Memory': ['4-8']
    };
}
