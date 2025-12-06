// Available books for gacha
const availableBooks = [
    "Book of Hana Association",
    "Book of Zwei Association", 
    "Book of Shi Association",
    "Book of the Cinq Southern Association",
    "Book of the Cinq Western Association",
    "Book of Liu Association",
    "Book of Seven Association",
    "Book of Devyat Association",
    "Book of Dieci Association",
    "Book of Oufi Association",
    "Book of the Thumb",
    "Book of the Index",
    "Book of the Ring",
    "Book of the Middle",
    "Book of the Kurokumo Clan",
    "Book of Blade Lineage",
    "Book of Full Stop Office",
    "Book of Molar Boatworks Office",
    "Book of Dawn Office",
    "Book of Gaze Office",
    "Book of the Twin Hook Pirates",
    "Book of the Ting Tang Gang",
    "Book of the Los Mariachis",
    "Book of Wuthering Heights",
    "Book of the Wild Hunt",
    "Book of the Dead Rabbits Gang",
    "Book of the Rosespanner Workshop",
    "Book of Multicrack Office",
    "Book of Fang Hunt Office",
    "Book of Firefist Office",
    "Book of N Corp.",
    "Book of W Corp.",
    "Book of K Corp.",
    "Book of T Corp.",
    "Book of R Corp.",
    // Special grade books
    "Book of a Color Fixer",
    "Book of a Grade 1",
    "Book of a Grade 2",
    "Book of a Grade 3",
    "Book of a Grade 4",
    "Book of a Grade 5",
    "Book of a Grade 6",
    "Book of a Grade 7",
    "Book of a Grade 8"
];

// Returns a random grade (0–8) using the specified drop rates (percent)
const DROP_RATES_PERCENT = [0.5, 1.5, 3.0, 5.0, 8.0, 12.0, 17.0, 23.0, 30.0];

function rollGrade() {
    const randomPoint = Math.random() * 100; // 0 to <100
    let cumulative = 0;

    for (let grade = 0; grade < DROP_RATES_PERCENT.length; grade++) {
        cumulative += DROP_RATES_PERCENT[grade];
        if (randomPoint < cumulative) {
            return grade;
        }
    }

    return DROP_RATES_PERCENT.length - 1; // Fallback safety
}

// Expose globally for use in other scripts or inline handlers
window.rollGrade = rollGrade;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('gachaType');
    const dropdown = document.getElementById('dropdown');
    const resultsArea = document.querySelector('.results-area');
    const [rollButton, resetButton] = document.querySelectorAll('.button-container button');
    const bundleGenerate = document.getElementById('bundleGenerate');
    const bundleClear = document.getElementById('bundleClear');
    const bundleResults = document.getElementById('bundleResults');

    // Show dropdown when input is focused or has content
    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const filteredBooks = availableBooks.filter(book => 
            book.toLowerCase().includes(value)
        );
        
        if (value.length > 0 && filteredBooks.length > 0) {
            showDropdown(filteredBooks);
        } else {
            hideDropdown();
        }
    });

    // Show all books when input is focused
    input.addEventListener('focus', function() {
        if (this.value.length === 0) {
            showDropdown(availableBooks);
        }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            hideDropdown();
        }
    });

    function showDropdown(books) {
        dropdown.innerHTML = '';
        books.slice(0, 10).forEach(book => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = book;
            item.addEventListener('click', function() {
                input.value = book;
                hideDropdown();
            });
            dropdown.appendChild(item);
        });
        dropdown.style.display = 'block';
    }

    function hideDropdown() {
        dropdown.style.display = 'none';
    }

    // Allow Enter key to trigger roll
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            hideDropdown();
            // You can add roll functionality here later
        }
    });

    // --- Loot table model (paste your items under each grade array) ---
    // Structure: lootTables[bookName][grade] = ["item1", "item2", ...]
    const lootTables = {};

    // Helper to add items while filtering out [Exclusive]
    function addLoot(book, grade, items) {
        const clean = (items || []).filter(v => typeof v === 'string' && !/\[\s*Exclusive\s*\]/i.test(v));
        if (clean.length === 0) return;
        if (!lootTables[book]) lootTables[book] = {};
        if (!lootTables[book][grade]) lootTables[book][grade] = [];
        lootTables[book][grade].push(...clean);
    }

    // --- Grades 0–1 items  ---
    addLoot('Book of Hana Association', 0, ['True Trigram Formation', 'Impugnatio Ultima']);
    addLoot('Book of Hana Association', 1, ['Celestial Insight', 'Augury Kick', 'Augury Crusher', 'Unyielding Strike']);
    addLoot('Book of Shi Association', 0, ['Boundary of Death']);
    addLoot('Book of the Index', 1, ['Blade Unlock', 'Eradication', 'Decapitation']);
    addLoot('Book of the Ring', 0, ['Blood of the Valley']);
    addLoot('Book of R Corp.', 0, ['Mind Crush', 'Savage Mode', 'Ground Crash', 'Clone', 'Disposal']);
    addLoot('Book of Wuthering Heights', 1, ['Echoes of the Manor', 'As Mistress Commands']);

    // --- Wild Hunt specific abilities ---
    addLoot('Book of the Wild Hunt', 0, ['Oh Dullahan...', 'Beheading', 'Memorial Procession', 'Requiem', 'Lament, Mourn, and Despair']);

    // --- Grade 2 items ---
    addLoot('Book of Zwei Association', 2, ['Combat Preparation']);
    addLoot('Book of Shi Association', 2, ['Catch Breath']);
    addLoot('Book of the Cinq Southern Association', 2, ['Declared Duel', 'Marche', 'Punition']);
    addLoot('Book of the Cinq Western Association', 2, ['Focused Attack', 'Fente', 'Contre Attaque']);
    addLoot('Book of Liu Association', 2, ['All-out War']);
    addLoot('Book of Seven Association', 2, ['Investigation']);
    addLoot('Book of Devyat Association', 2, ['Courier Support & Control Sequence', 'Courier Trunk - Assistance & Crisis Control System']);
    addLoot('Book of Dieci Association', 2, ['Excoriating Study']);
    addLoot('Book of Oufi Association', 2, ['First Warning', 'Second Warning', 'Final Warning', 'Execution Imminent', 'Obligation Fulfillment']);
    addLoot('Book of the Index', 2, ['To Where the Prescript Points [Exclusive]', 'Swift Trace [Exclusive]', 'Eliminate [Exclusive]']);
    addLoot('Book of the Middle', 2, ['ENOUGH GAMES!']);
    addLoot('Book of the Ring', 2, ['Natural Style [Exclusive]', 'A Single Point of Art [Exclusive]', 'Beat the Brush [Exclusive]', 'Hematic Coloring [Exclusive]']);
    addLoot('Book of the Kurokumo Clan', 2, ['Ink Over']);
    addLoot('Book of Blade Lineage', 2, ['Flank Thrust', 'Moonlit Blade Dance', 'Blade Arc']);
    addLoot('Book of Full Stop Office', 2, ['Go!! for the Bullseye']);
    addLoot('Book of Gaze Office', 2, ['Observe', 'Singularity Seeker']);
    addLoot('Book of the Twin Hook Pirates', 2, ['Unjust Enrichment', 'Two Sides of a Coin', 'Foregone Conclusion']);
    addLoot('Book of the Ting Tang Gang', 2, ['Gamble on Life', 'Glinting Wish']);
    addLoot('Book of the Los Mariachis', 2, ['Baileya Rola', 'Se Acabó La Fiesta']);
    addLoot('Book of Wuthering Heights', 2, []);
    addLoot('Book of the Dead Rabbits Gang', 2, ['Heartseal', 'Upheaval', 'Relentless']);
    addLoot('Book of the Rosespanner Workshop', 2, ['Synchronization', 'Final Warmup', "Let's Rack Up Some Scores"]);
    addLoot('Book of Multicrack Office', 2, ['Photoelectric Harpoon', '40Y-3 Activation']);
    addLoot('Book of Fang Hunt Office', 2, ['Blood Lure']);
    addLoot('Book of Firefist Office', 2, ["I'll burn away every last drop of your filthy blood"]);
    addLoot('Book of N Corp.', 2, ['Annihilate Heretics', 'Amoral Enactment', 'Execution']);
    addLoot('Book of W Corp.', 2, ['Rewind', 'Overcharged', 'Ripple']);
    addLoot('Book of T Corp.', 2, ['Let Us Prepare to Collect', 'T Corp. Accelerated Amputator']);
    addLoot('Book of K Corp.', 2, ['Modified K Corp Ampule']);
    addLoot('Book of R Corp.', 2, ['Flaying Surge', 'Concentration']);

    // --- Grade 3 items ---
    addLoot('Book of Zwei Association', 3, ['Handling Work']);
    addLoot('Book of the Cinq Southern Association', 3, ['Flèche']);
    addLoot('Book of the Cinq Western Association', 3, ['Riposte', 'Coup Droit']);
    addLoot('Book of Liu Association', 3, ['Inner Ardor', 'Fervid Emotions']);
    addLoot('Book of Seven Association', 3, ['Profiling', 'Forensics']);
    addLoot('Book of Devyat Association', 3, ['Courier Trunk - Gadget Reveal', 'Courier Trunk - Demolition Gadget']);
    addLoot('Book of Dieci Association', 3, ['Expend Knowledge', 'Unveil', 'Studious Dedication', 'Guiding Steps']);
    addLoot('Book of Oufi Association', 3, ['Execution Sentencing', 'Do Not Obstruct', 'Grave Attendance', 'Bona Fide']);
    addLoot('Book of the Thumb', 3, ['Focus Fire', 'Steel Knuckles']);
    addLoot('Book of the Index', 3, ['Heavy Trace [Exclusive]']);
    addLoot('Book of the Middle', 3, ['Payback [Exclusive]']);
    addLoot('Book of the Ring', 3, ['Dotting [Exclusive]']);
    addLoot('Book of the Kurokumo Clan', 3, ['Cloudburst', 'Thundercleave']);
    addLoot('Book of Blade Lineage', 3, ['Draw of the Sword', 'Heel Turn']);
    addLoot('Book of Full Stop Office', 3, ['Take the Shot', 'Taking Cover', 'Headshot', 'Full-Stop to Life']);
    addLoot('Book of Volatile E.G.O.: Waxen Pinion', 3, ['Fierce Charge', 'Rueful Eventide']);
    addLoot('Book of Gaze Office', 3, ['Zzzzapp', 'Binding Arms']);
    addLoot('Book of the Twin Hook Pirates', 3, ['Negotiation Start', 'Unilateral Business']);
    addLoot('Book of the Ting Tang Gang', 3, ['Shank']);
    addLoot('Book of the Los Mariachis', 3, ['¿Eso es todo?', 'Jóvales', 'Emocionado', 'Pariata Party~!']);
    addLoot('Book of Wuthering Heights', 3, ['Dusting']);
    addLoot('Book of the Dead Rabbits Gang', 3, ['Smackdown', 'Breakthrough', 'Bat Bash']);
    addLoot('Book of the Rosespanner Workshop', 3, ['Vibration Compression']);
    addLoot('Book of Multicrack Office', 3, ['40S-2 Activation', 'Photoelectric Mark']);
    addLoot('Book of Firefist Office', 3, ['Fire Punch', 'Flamethrow']);
    addLoot('Book of N Corp.', 3, ['Inquisition', 'Coerced Judgement', 'Cackle']);
    addLoot('Book of W Corp.', 3, ['Rip', 'Energy Cycle']);
    addLoot('Book of T Corp.', 3, ['Execute Collections', 'Borrow Time']);
    addLoot('Book of K Corp.', 3, ['Decay Blade', 'Excise Target']);
    addLoot('Book of R Corp.', 3, ['Energy Strike', 'Mind Strike', 'Pinpoint Shot', 'Concentrated Fire', 'Bulky Impact', 'Weighty Bash']);

    // --- Grade 4 items  ---
    addLoot('Book of Zwei Association', 4, ['Defensive Stance']);
    addLoot('Book of the Cinq Southern Association', 4, ['Remise']);
    addLoot('Book of the Cinq Western Association', 4, ['Allez']);
    addLoot('Book of Liu Association', 4, ['Ignite Weaponry', 'Emotional Turbulence', 'Coordinated Assault']);
    addLoot('Book of Seven Association', 4, ['Predictive Analysis']);
    addLoot('Book of Oufi Association', 4, ['Execution Advised']);
    addLoot('Book of the Thumb', 4, ['Suppressing Shot']);
    addLoot('Book of the Index', 4, ['Sense Quarry', 'Undertake Prescript [Exclusive]', 'Multislash', 'Binding Chains', 'Unlock - I [Exclusive]']);
    addLoot('Book of the Middle', 4, ['Right in the Solar Plexus [Exclusive]', 'Chains of Loyalty']);
    addLoot('Book of the Ring', 4, ['Coloring [Exclusive]', 'Brushstroke']);
    addLoot('Book of the Kurokumo Clan', 4, ['Stormcloud', 'Sharpened Blade']);
    addLoot('Book of Full Stop Office', 4, ['Return Fire', 'Beyond the Shadow']);
    addLoot('Book of Molar Boatworks Office', 4, ['Unstable Power Output', 'Risky Judgement']);
    addLoot('Book of Volatile E.G.O.: Waxen Pinion', 4, ['Flaring Brand']);
    addLoot('Book of Gaze Office', 4, ['Opportunity Spotted']);
    addLoot('Book of the Twin Hook Pirates', 4, ['Easy Breathing']);
    addLoot('Book of Wuthering Heights', 4, ['Knocking']);
    addLoot('Book of the Dead Rabbits Gang', 4, ['Hold Them Back', 'Counter']);
    addLoot('Book of the Rosespanner Workshop', 4, ['Trembling Conversion']);
    addLoot('Book of Fang Hunt Office', 4, ['Hemostasis', 'Anti-Bloodfiend Crush']);
    addLoot('Book of N Corp.', 4, ['Foolishness...!', 'Deep Thrust', 'Sin-skewering Nail']);
    addLoot('Book of T Corp.', 4, ['Prepare to Collect', 'T Corp. Martial Suppression']);
    addLoot('Book of K Corp.', 4, ['Activate HP Bullets', 'No Trespassing', 'Impede the Intruder']);
    
    // --- Grade 5 items ---
    addLoot('Book of Zwei Association', 5, ['Fence']);
    addLoot('Book of Liu Association', 5, ['Fiery Waltz', 'Single-Point Stab']);
    addLoot('Book of Devyat Association', 5, ['Courier Trunk - Decay Knife', 'Courier Trunk - Decay Hammer']);
    addLoot('Book of the Index', 5, ['Proselyte\'s Blade [Exclusive]', 'Execute', 'Will of the Prescript [Exclusive]']);
    addLoot('Book of the Middle', 5, ['Kicking', 'Aim for the Solar Plexus [Exclusive]', 'Proof of Loyalty']);
    addLoot('Book of the Ring', 5, ['Paint [Exclusive]', 'Splatter [Exclusive]']);
    addLoot('Book of the Kurokumo Clan', 5, ['Lenticular Rend']);
    addLoot('Book of Molar Boatworks Office', 5, ['Explosive Blast']);
    addLoot('Book of Dawn Office', 5, ['Searing Blade', 'Stigmatize']);
    addLoot('Book of Gaze Office', 5, ['Electric Shock']);
    addLoot('Book of the Ting Tang Gang', 5, ['Throat Slit']);
    addLoot('Book of Wuthering Heights', 5, ['Interloper Reception']);
    addLoot('Book of the Dead Rabbits Gang', 5, ['Get Out of My Sight']);
    addLoot('Book of the Rosespanner Workshop', 5, ['Stand Back!']);
    addLoot('Book of Fang Hunt Office', 5, ['Wild Swinging', 'Styptics']);
    addLoot('Book of N Corp.', 5, ['Ironclad Retribution', 'Fanatical Judgement', 'Spike Drive', 'Drive']);
    addLoot('Book of K Corp.', 5, ['Suspicious Individuals', 'Restrain']);

    // --- Grade 6 items ---
    addLoot('Book of Shi Association', 6, ['Flying Sword', 'Flashing Strike']);
    addLoot('Book of Liu Association', 6, ['Inner Gate Elbow Strike', 'Frontal Assault']);
    addLoot('Book of Seven Association', 6, ['Upwards Slash']);
    addLoot('Book of the Index', 6, ['Faith']);
    addLoot('Book of the Middle', 6, ['Punching']);
    addLoot('Book of the Kurokumo Clan', 6, ['Lenticular Swirl']);
    addLoot('Book of Full Stop Office', 6, ['Target Marked', 'Ready to Crush']);
    addLoot('Book of Gaze Office', 6, ['Unavoidable Gaze', "You're a Hindrance"]);
    addLoot('Book of the Ting Tang Gang', 6, ['Cunning Stab']);
    addLoot('Book of the Los Mariachis', 6, ['¡Olé!', 'Duelo de Baile']);
    addLoot('Book of Wuthering Heights', 6, ['Confiscation']);
    addLoot('Book of the Dead Rabbits Gang', 6, ['Remove']);
    addLoot('Book of the Rosespanner Workshop', 6, ['Vibration Amplification']);
    addLoot('Book of Fang Hunt Office', 6, ['Crush Wounds']);
    addLoot('Book of N Corp.', 6, ['Retribution', 'Oppressive Preaching', 'Zealous Purge', 'Rightful Purge', 'Congregate']);

    // --- Grade 7 items ---
    addLoot('Book of Zwei Association', 7, ['Your Shield']);
    addLoot('Book of Shi Association', 7, ['Desperate Struggle', 'Endless Battle']);
    addLoot('Book of Liu Association', 7, ['Fiery Knife Hand', 'Perfected Death Fist', 'Pinpoint Blitz']);
    addLoot('Book of Seven Association', 7, ['Swash', 'Slash']);
    addLoot('Book of the Kurokumo Clan', 7, ['Clean Up', 'Cleave']);
    addLoot('Book of Molar Boatworks Office', 7, ['Steady...', 'Crab Bastards!']);
    addLoot('Book of Dawn Office', 7, ['Flash of Sunup', 'Rue']);
    addLoot('Book of Gaze Office', 7, ['Structural Analysis']);
    addLoot('Book of the Twin Hook Pirates', 7, ['Looting', 'Tear the Flesh', 'Tear the Gap']);
    addLoot('Book of the Ting Tang Gang', 7, ['Heavy Swing', 'Sneaky Bash']);
    addLoot('Book of the Los Mariachis', 7, ['Bailemos~']);
    addLoot('Book of the Dead Rabbits Gang', 7, ['Hurt', 'Break']);
    addLoot('Book of the Rosespanner Workshop', 7, ['Rev Up']);
    addLoot('Book of Fang Hunt Office', 7, ['Slam']);
    addLoot('Book of N Corp.', 7, ['Hammer', 'Plunge In', 'Pu...rify', 'YOU DARE!', 'Vigorous Hammering', 'Thrusting Nail', 'Ruling Hammer']);
    addLoot('Book of K Corp.', 7, ['Blockade', 'Shelter', 'Arresting!', 'Stop the Intruder']);

    // --- Grade 8 items ---
    addLoot('Book of Zwei Association', 8, ['Sharp Swipe', 'Avert', 'Law and Order', 'Downward Slash']);
    addLoot('Book of Shi Association', 8, ['To Overcome Crisis', 'Extreme Edge']);
    addLoot('Book of Liu Association', 8, ['Flowing Flame', 'Red Kick']);
    addLoot('Book of the Kurokumo Clan', 8, ['Focus Strike']);
    addLoot('Book of Molar Boatworks Office', 8, ['Fierce Assault']);
    addLoot('Book of Dawn Office', 8, ['Sunset Blade']);
    addLoot('Book of the Twin Hook Pirates', 8, ['Hook Slice']);
    addLoot('Book of the Ting Tang Gang', 8, ['Carve']);
    addLoot('Book of the Los Mariachis', 8, ['¡Rápidamente!']);
    addLoot('Book of the Rosespanner Workshop', 8, ["I'll Grind You Up"]);
    addLoot('Book of N Corp.', 8, ['Nail Pin', 'Knock', 'Rough Nailing']);
    addLoot('Book of K Corp.', 8, ['Takedown', 'Raid', 'Neutralize Target', 'Pause! Halt!']);

    // Picks a random item for the selected book using rollGrade()
    function rollItemForBook(bookName) {
        const table = lootTables[bookName];
        if (!table) return { error: `Unknown book: ${bookName}` };

        const pickedGrade = rollGrade();
        const item = pickFromGrades(table, pickedGrade);
        if (!item) {
            return { error: `No items defined for ${bookName}. Add loot to lootTables.` };
        }
        return { grade: item.grade, item: item.value };
    }

    // For special grade books, roll across all books with max grade constraint
    function rollFromAllBooks(maxGradeInclusive) {
        // Choose grade using weights up to maxGradeInclusive
        const weights = DROP_RATES_PERCENT.slice(0, maxGradeInclusive + 1);
        const sum = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * sum;
        let picked = 0;
        for (let i = 0; i < weights.length; i++) {
            r -= weights[i];
            if (r < 0) { picked = i; break; }
        }

        // Build a combined table at that grade across all books
        const entries = [];
        Object.keys(lootTables).forEach(book => {
            const pool = (lootTables[book] && lootTables[book][picked]) || [];
            pool.forEach(item => {
                if (typeof item === 'string' && !/\[\s*Exclusive\s*\]/i.test(item)) {
                    entries.push({ book, grade: picked, item });
                }
            });
        });

        // If we have entries at the picked grade, return one now
        if (entries.length > 0) {
            return entries[Math.floor(Math.random() * entries.length)];
        }

        // Otherwise, fallback downward through lower grades
        for (let g = picked - 1; g >= 0; g--) {
            Object.keys(lootTables).forEach(book => {
                const pool = (lootTables[book] && lootTables[book][g]) || [];
                pool.forEach(item => {
                    if (typeof item === 'string' && !/\[\s*Exclusive\s*\]/i.test(item)) {
                        entries.push({ book, grade: g, item });
                    }
                });
            });
            if (entries.length > 0) {
                return entries[Math.floor(Math.random() * entries.length)];
            }
        }
        return { error: 'No items available across books. Please add more loot.' };
    }

    // Roll multiple unique results for a book
    function rollMultiple(bookName, count) {
        const results = [];
        const seen = new Set();
        let safety = 0;
        while (results.length < count && safety < 100) {
            safety++;
            const r = rollItemForBook(bookName);
            if (r.error) return r;
            const key = `${r.grade}|${r.item}`;
            if (!seen.has(key)) {
                seen.add(key);
                results.push(r);
            }
        }
        return results;
    }

    // Helper that tries the picked grade first, then searches other grades
    function pickFromGrades(table, startingGrade) {
        const grades = Object.keys(table)
            .map(Number)
            .sort((a, b) => a - b);

        // Order: starting grade, then outward (lower, higher)
        const order = [startingGrade];
        for (let radius = 1; radius < 9; radius++) {
            order.push(startingGrade - radius);
            order.push(startingGrade + radius);
        }

        for (const g of order) {
            if (!grades.includes(g)) continue;
            const pool = (table[g] || []).filter(v => typeof v === 'string' && !/\[\s*Exclusive\s*\]/i.test(v));
            if (pool.length > 0) {
                const value = pool[Math.floor(Math.random() * pool.length)];
                return { grade: g, value };
            }
        }
        return null;
    }

    // Wire buttons
    if (rollButton) {
        rollButton.addEventListener('click', function() {
            const bookName = (input.value || '').trim();
            if (!bookName) {
                alert('Choose a book first. Click the field to see options.');
                input.focus();
                return;
            }
            let results;
            const special = bookName.toLowerCase();
            if (special === 'book of a color fixer') {
                results = [];
                const seen = new Set();
                for (let i = 0; i < 100 && results.length < 4; i++) {
                    const r = rollFromAllBooks(0);
                    if (r.error) { results = r; break; }
                    const key = `${r.book}|${r.grade}|${r.item}`;
                    if (!seen.has(key)) { seen.add(key); results.push(r); }
                }
            } else if (special === 'book of a grade 1') {
                results = [];
                const seen = new Set();
                for (let i = 0; i < 100 && results.length < 4; i++) {
                    const r = rollFromAllBooks(1);
                    if (r.error) { results = r; break; }
                    const key = `${r.book}|${r.grade}|${r.item}`;
                    if (!seen.has(key)) { seen.add(key); results.push(r); }
                }
            } else if (special === 'book of a grade 2') {
                results = [];
                const seen = new Set();
                for (let i = 0; i < 100 && results.length < 4; i++) {
                    const r = rollFromAllBooks(2);
                    if (r.error) { results = r; break; }
                    const key = `${r.book}|${r.grade}|${r.item}`;
                    if (!seen.has(key)) { seen.add(key); results.push(r); }
                }
            } else if (special === 'book of a grade 3') {
                results = [];
                const seen = new Set();
                for (let i = 0; i < 100 && results.length < 4; i++) {
                    const r = rollFromAllBooks(3);
                    if (r.error) { results = r; break; }
                    const key = `${r.book}|${r.grade}|${r.item}`;
                    if (!seen.has(key)) { seen.add(key); results.push(r); }
                }
            } else if (special === 'book of a grade 4') {
                results = [];
                const seen = new Set();
                for (let i = 0; i < 100 && results.length < 4; i++) {
                    const r = rollFromAllBooks(4);
                    if (r.error) { results = r; break; }
                    const key = `${r.book}|${r.grade}|${r.item}`;
                    if (!seen.has(key)) { seen.add(key); results.push(r); }
                }
            } else if (special === 'book of a grade 5') {
                results = [];
                const seen = new Set();
                for (let i = 0; i < 100 && results.length < 4; i++) {
                    const r = rollFromAllBooks(5);
                    if (r.error) { results = r; break; }
                    const key = `${r.book}|${r.grade}|${r.item}`;
                    if (!seen.has(key)) { seen.add(key); results.push(r); }
                }
            } else if (special === 'book of a grade 6') {
                results = [];
                const seen = new Set();
                for (let i = 0; i < 100 && results.length < 4; i++) {
                    const r = rollFromAllBooks(6);
                    if (r.error) { results = r; break; }
                    const key = `${r.book}|${r.grade}|${r.item}`;
                    if (!seen.has(key)) { seen.add(key); results.push(r); }
                }
            } else if (special === 'book of a grade 7') {
                results = [];
                const seen = new Set();
                for (let i = 0; i < 100 && results.length < 4; i++) {
                    const r = rollFromAllBooks(7);
                    if (r.error) { results = r; break; }
                    const key = `${r.book}|${r.grade}|${r.item}`;
                    if (!seen.has(key)) { seen.add(key); results.push(r); }
                }
            } else if (special === 'book of a grade 8') {
                results = [];
                const seen = new Set();
                for (let i = 0; i < 100 && results.length < 4; i++) {
                    const r = rollFromAllBooks(8);
                    if (r.error) { results = r; break; }
                    const key = `${r.book}|${r.grade}|${r.item}`;
                    if (!seen.has(key)) { seen.add(key); results.push(r); }
                }
            } else {
                results = rollMultiple(bookName, 4);
            }
            if (results.error) {
                resultsArea.innerHTML = `<div class=\"result-item\"><span class=\"result-label\">Error:</span> <span class=\"result-value\">${results.error}</span></div>`;
                return;
            }
            const listHtml = results.map((r, i) => `
                <div class=\"result-item\"><span class=\"result-label\">Result ${i+1}:</span> <span class=\"result-value\">${r.book ? r.book + ' — ' : ''}[Grade ${r.grade}] ${r.item}</span></div>
            `).join('');
            resultsArea.innerHTML = `
                <div class=\"result-item\"><span class=\"result-label\">Book:</span> <span class=\"result-value\">${bookName}</span></div>
                ${listHtml}
            `;
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', function() {
            input.value = '';
            dropdown.innerHTML = '';
            hideDropdown();
            resultsArea.innerHTML = '<div class="placeholder">Results will appear here after rolling...</div>';
        });
    }

    // ---- Bundle generation ----
    const SPECIAL_BOOKS = [
        { name: 'Book of a Color Fixer', max: 0 },
        { name: 'Book of a Grade 1', max: 1 },
        { name: 'Book of a Grade 2', max: 2 },
        { name: 'Book of a Grade 3', max: 3 },
        { name: 'Book of a Grade 4', max: 4 },
        { name: 'Book of a Grade 5', max: 5 },
        { name: 'Book of a Grade 6', max: 6 },
        { name: 'Book of a Grade 7', max: 7 },
        { name: 'Book of a Grade 8', max: 8 }
    ];

    function weightedPick(items) {
        const total = items.reduce((s, it) => s + it.weight, 0);
        let r = Math.random() * total;
        for (let i = 0; i < items.length; i++) {
            r -= items[i].weight;
            if (r < 0) return i;
        }
        return items.length - 1;
    }

    function generateBundleRandom() {
        const k = Math.floor(Math.random() * 8) + 1; // 1..8
        // Weighted list based on grade drop rates 0..8 (allow duplicates)
        const pool = SPECIAL_BOOKS.map((b, idx) => ({
            index: idx,
            name: b.name,
            max: b.max,
            weight: DROP_RATES_PERCENT[idx] || 0
        }));

        const results = [];
        for (let i = 0; i < k; i++) {
            const choiceIdx = weightedPick(pool);
            results.push(SPECIAL_BOOKS[pool[choiceIdx].index].name);
        }
        return results;
    }

    if (bundleGenerate) {
        bundleGenerate.addEventListener('click', function() {
            const bundle = generateBundleRandom();
            const html = bundle.map((name, i) => `
                <div class=\"result-item\"><span class=\"result-label\">Gained:</span> <span class=\"result-value\">${name}</span></div>
            `).join('');
            bundleResults.innerHTML = html || '<div class=\"placeholder\">No results; try again.</div>';
        });
    }

    if (bundleClear) {
        bundleClear.addEventListener('click', function() {
            bundleResults.innerHTML = '<div class="placeholder"></div>';
        });
    }
});