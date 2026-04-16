/*
 * ═══════════════════════════════════════════════════
 *  CONTENT — Edit everything here.
 *  Change texts, questions, answers, images.
 * ═══════════════════════════════════════════════════
 */
const CONTENT = {

  herName: "Nana",
  yourSignature: "Your Viking",
  baliDate: "2026-05-10T00:00:00",

  // ─── BIRTHDAY CARD (envelope open) ────────────────
  card: {
    envelopeLabel: "For Nana ♛",
    frontMessage: "გილოცავ დაბადების დღეს",
    frontSubtitle: "Happy Birthday",
    insideMessage: "Hey you. I made you something.\n\nIt's not a poem — I'll leave that to Pushkin.\nIt's not a cardboard cutout — you already have the best one.\n\nIt's a little journey. Seven stops.\nSome puzzles. Some things you'll know.\nSome things you won't.\n\nWhen you're done, there's something waiting at the end.\n\nReady?",
    buttonText: "Open the journey ✦"
  },

  // ─── STAGES ───────────────────────────────────────
  stages: [

    // ── 1: CIPHER ──
    {
      id: "cipher",
      type: "cipher",
      icon: "🔐",
      stageLabel: "I",
      title: "The Cipher",
      intro: "A message is locked behind a simple shift. Drag the dial until the nonsense becomes words.",
      cipherShift: 7,
      plainText: "HAPPY BIRTHDAY NANA. THIS IS YOUR QUEST. SEVEN STAGES. NO SHORTCUTS. I WILL BE IMPRESSED IF YOU SOLVE THEM ALL.",
      successMessage: "You cracked it. I expected nothing less from an Aries.",
      hintText: "Try shifting the letters by a number between 5 and 10."
    },

    // ── 2: SCRATCH CARD ──
    {
      id: "scratch",
      type: "scratch",
      icon: "✨",
      stageLabel: "II",
      title: "The Scratch Card",
      intro: "Our story started with a swipe. This one too.",
      scratchImage: "couple-barcelona",
      revealCaption: "Shopping center in Barcelona. A swipe that started something neither of us expected.",
      overlayText: "SCRATCH ME"
    },

    // ── 3: VOCAB GAME ──
    {
      id: "vocab",
      type: "vocab-game",
      icon: "📖",
      stageLabel: "III",
      title: "Lost in Translation",
      intro: "Our languages are secretly friends. Match the Norwegian word to its Russian cousin.",
      pairs: [
        { norwegian: "Veranda", russian: "Веранда", english: "Veranda" },
        { norwegian: "Ryggsekk", russian: "Рюкзак", english: "Backpack" },
        { norwegian: "Banan", russian: "Банан", english: "Banana" },
        { norwegian: "Kaffe", russian: "Кофе", english: "Coffee" },
        { norwegian: "Musik", russian: "Музыка", english: "Music" },
        { norwegian: "Tomat", russian: "Томат", english: "Tomato" },
        { norwegian: "Sofa", russian: "Софа", english: "Sofa" },
        { norwegian: "Sjanse", russian: "Шанс", english: "Chance" }
      ],
      successMessage: "Our languages really are secretly in love. Maybe one day our list will be long enough for its own dictionary."
    },

    // ── 4: DEEP TRIVIA ──
    {
      id: "trivia",
      type: "trivia",
      icon: "🌑",
      stageLabel: "IV",
      title: "The Woman of Excellent Taste",
      intro: "This isn't about us. This is about you — your world, your obsessions. Let's see how deep it goes.",
      questions: [
        {
          question: "What did Stephenie Meyer google to find the setting for Twilight?",
          options: [
            { text: "Smallest town in America", correct: false },
            { text: "Rainiest place in the United States", correct: true },
            { text: "Most remote town in Washington", correct: false },
            { text: "Forests with the least sunlight", correct: false }
          ],
          funFact: "She found Forks, Washington — population 3,500. The entire saga exists because of a Google search and a rainy peninsula."
        },
        {
          question: "Eminem was the first rapper to win an Oscar. Where was he when it happened?",
          options: [
            { text: "At the afterparty", correct: false },
            { text: "In the studio recording", correct: false },
            { text: "Asleep watching cartoons with his daughter", correct: true },
            { text: "On tour in Europe", correct: false }
          ],
          funFact: "He didn't think he'd win. He fell asleep watching cartoons with Hailie. He came back 17 years later and performed it live — arguably the most legendary surprise in Oscar history."
        },
        {
          question: "\"Imagine Dragons\" is an anagram. The band has kept the original phrase secret from everyone — including who?",
          options: [
            { text: "Their record label", correct: false },
            { text: "Their own mothers", correct: true },
            { text: "Rolling Stone magazine", correct: false },
            { text: "Their touring crew", correct: false }
          ],
          funFact: "Dan Reynolds: 'I haven't even told my mom, and she's bothered me about it since day one.' Fans have generated 107,000+ anagram possibilities. Nobody has cracked it."
        },
        {
          question: "What is \"Radioactive\" actually about, according to Dan Reynolds?",
          options: [
            { text: "Nuclear war", correct: false },
            { text: "A zombie apocalypse", correct: false },
            { text: "Leaving Mormonism", correct: true },
            { text: "Climate change anxiety", correct: false }
          ],
          funFact: "'I'm waking up. Welcome to the new age.' He was afraid to say it directly because he didn't want to hurt his conservative Mormon family. He revealed it in 2021."
        },
        {
          question: "Who was the cast's nickname for the animatronic baby Renesmee?",
          options: [
            { text: "Creepy Nessie", correct: false },
            { text: "Chuckmee", correct: true },
            { text: "Baby Fright", correct: false },
            { text: "Robo-Bella", correct: false }
          ],
          funFact: "The doll was so disturbing they named it after Chucky from the horror films. It was scrapped entirely and replaced with CGI."
        },
        {
          question: "Who was Stephenie Meyer's original dream-cast for Edward Cullen?",
          options: [
            { text: "Robert Pattinson", correct: false },
            { text: "Ian Somerhalder", correct: false },
            { text: "Henry Cavill", correct: true },
            { text: "Tom Felton", correct: false }
          ],
          funFact: "Henry Cavill — the future Superman. By the time filming started, Cavill was too old for the role. The universe had other plans."
        }
      ],
      successMessage: "You really are a woman of extraordinary taste. From vampire romances to the god of rap to secret Mormon anthems."
    },

    // ── 5: JIGSAW PUZZLE ──
    {
      id: "jigsaw",
      type: "jigsaw",
      icon: "🧩",
      stageLabel: "V",
      title: "The Puzzle",
      intro: "Some things are worth putting together.",
      puzzleImage: "avatars",
      gridSize: 4,
      successMessage: "See? Some things just fit."
    },

    // ── 6: BOARDING PASS (Bali reveal) ──
    {
      id: "boarding",
      type: "boarding-pass",
      icon: "✈️",
      stageLabel: "VI",
      title: "Gate Call",
      intro: "You have a boarding pass. Something about the destination seems to be missing...",
      pass: {
        from: "Moscow",
        to: "???",
        passenger: "Nana",
        seatClass: "♈ Aries First",
        flight: "VK-0416",
        gate: "B32",
        date: "May 2026"
      },
      revealDestination: "BALI",
      poem: {
        georgian: "გასწი, მერანო, შენს ჭენებას არ აქვს სამძღვარი",
        english: "Speed thee on and onward fly, with a gallop that knoweth no bound.",
        attribution: "— Nikoloz Baratashvili, Merani"
      },
      revealMessage: "Like the flying horse Merani — no trail, no boundary. Just forward."
    },

    // ── 7: FINALE ──
    {
      id: "finale",
      type: "finale",
      icon: "🌺",
      stageLabel: "VII",
      title: "The End (for now)",
      letter: "I don't know all your favorite poems yet.\nI can't recite Pushkin from memory.\nBut I know you celebrate Eminem's birthday with a cardboard cutout, and honestly, that's the moment I knew I was in trouble.\n\nI know you hide cards in jacket pockets that say \"hug me when you find this.\"\nI know our languages share more words than anyone would expect.\nI know you walk through the world like it was built for you.\n\nI'm not going to say anything too heavy here.\nJust — see you in Bali.\n\nHappy birthday, Nana.\n\nYour Viking ♛",
      photo: "couple-cocktails",
      avatarImage: "avatars"
    }
  ],

  // ─── BATTLESHIP (bonus) ───────────────────────────
  battleship: {
    title: "⚔️ The Great Naval Battle",
    subtitle: "Bonus stage unlocked",
    intro: "Viking vs. Princess. Find my fleet before I find yours. Tap a cell to fire.",
    gridSize: 7,
    ships: [
      { name: "Viking Longship", size: 4 },
      { name: "Royal Yacht", size: 3 },
      { name: "Love Boat", size: 2 }
    ],
    // Ship placements — set these in the editor!
    // Each ship: { row, col, horizontal }
    placements: null
  }
};
