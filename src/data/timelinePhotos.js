// 🌸 TIMELINE PHOTOS & MILESTONES DATA
// -------------------------------------------------------------
// 💡 HOW TO REPLACE WITH YOUR OWN PHOTOS LATER:
// Replace any 'image' URL below with your own image link (e.g. from Google Drive, Cloudinary, Imgur)
// OR place your photo in the public folder and use '/my_photo.jpg'!
// -------------------------------------------------------------

// Helper to create guaranteed crisp SVG fallback photos
const makeSvgPhoto = (bgColor, textColor, emoji, title, sub) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor[0]}" />
        <stop offset="100%" stop-color="${bgColor[1]}" />
      </linearGradient>
    </defs>
    <rect width="600" height="420" fill="url(#bgGrad)" rx="16" />
    <circle cx="300" cy="180" r="85" fill="rgba(255,255,255,0.25)" />
    <text x="300" y="215" font-size="95" text-anchor="middle" font-family="Arial, sans-serif">${emoji}</text>
    <text x="300" y="320" font-size="28" font-weight="bold" fill="${textColor}" text-anchor="middle" font-family="'Comic Sans MS', cursive, sans-serif">${title}</text>
    <text x="300" y="360" font-size="20" fill="${textColor}" opacity="0.85" text-anchor="middle" font-family="'Comic Sans MS', cursive, sans-serif">${sub}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const TIMELINE_DATA = {
  // 🌸 TOP THREAD: DIDI'S JOURNEY (FEMALE MILESTONES - Y: 28 to 38)
  // High in the celestial sky; strictly equal 480px intervals (500, 980, 1460)
  femaleMilestones: [
    {
      id: 'f1',
      x: 500,
      y: 28,
      birdColor: '#ff77aa',
      tag: '🌸 Childhood Wonder (1998)',
      title: 'Little Miss Sunshine 👧✨',
      desc: 'With two cute pigtails and innocent big eyes, Didi arrived to rule our hearts and steal every chocolate in the house!',
      image: '/photos/didi_childhood.jpg',
      fallbackSvg: '/photos/didi_childhood.svg',
      note: 'Didi: bachpan se hi drama queen thi! 👑😂'
    },
    {
      id: 'f2',
      x: 980,
      y: 28,
      birdColor: '#ff5599',
      tag: '🎓 College Queen (2018)',
      title: 'Dreams, Books & Smiles 📚💖',
      desc: 'Graduation gowns, canteen coffee, lifelong friends, and a heart full of big dreams. Becoming the strong, graceful woman she is.',
      image: '/photos/didi_college.jpg',
      fallbackSvg: '/photos/didi_college.svg',
      note: 'Kitni padhaku dikh rahi hai, par assignment sab doosro se banwati thi! 😜'
    },
    {
      id: 'f3',
      x: 1460,
      y: 38,
      birdColor: '#ff3377',
      tag: '🌸 Unaware of Destiny (2023)',
      title: 'Waiting for Her Prince 👑🕊️',
      desc: 'Glowing with elegance and laughter, completely unaware that someone special was miles away, writing a chapter meant only for her.',
      image: '/photos/didi_destiny.jpg',
      fallbackSvg: '/photos/didi_destiny.svg',
      note: 'Kismat apna jaadu chalaane wali thi... ✨'
    }
  ],

  // 💙 BOTTOM THREAD: JIJU'S JOURNEY (MALE MILESTONES - Y: 300 to 290)
  // Super-wide 272px distance from Didi's thread; strictly equal 480px intervals (500, 980, 1460)
  maleMilestones: [
    {
      id: 'm1',
      x: 500,
      y: 300,
      birdColor: '#38bdf8',
      tag: '🏏 Gali Cricket Hero (1996)',
      title: 'The Neighborhood Legend 👦⚡',
      desc: 'Muddy sneakers, broken window panes, endless sixes, and unstoppable energy. Jiju was already preparing to captain life!',
      image: '/photos/jiju_cricket.jpg',
      fallbackSvg: '/photos/jiju_cricket.svg',
      note: 'Jiju: bachpan me bowler the ya batsman? Window tod champion! 🏏🤣'
    },
    {
      id: 'm2',
      x: 980,
      y: 300,
      birdColor: '#0ea5e9',
      tag: '☕ Engineering & Ambition (2017)',
      title: 'Late Night Chais & Goals 💻🏍️',
      desc: 'Hostel banters, sleepless coding nights, big bike rides, and a million dreams of building a beautiful future.',
      image: '/photos/jiju_college.jpg',
      fallbackSvg: '/photos/jiju_college.svg',
      note: 'Hero entry in every room he walked into! 🕶️🔥'
    },
    {
      id: 'm3',
      x: 1460,
      y: 290,
      birdColor: '#0284c7',
      tag: '🧭 Searching for Soulmate (2023)',
      title: 'The Gentleman with a Vision 👔✨',
      desc: 'Achieving milestones, staying grounded with family values, secretly wondering when he will meet his forever person.',
      image: '/photos/jiju_vision.jpg',
      fallbackSvg: '/photos/jiju_vision.svg',
      note: 'Jiju ko pata nahi tha ki unka sukoon Didi ke paas hai! 🕊️❤️'
    }
  ],

  // 💍 THE CONVERGENCE POINT (WHERE 2 THREADS MERGE - Y: 164, X: 1940)
  convergencePoint: {
    x: 1940,
    y: 164,
    tag: '💍 The Sacred Sangam',
    title: 'When Two Souls Became One 🕊️🔥',
    poetry: 'Do alag raste, do anjaan kahaniyan... Rab ne ek dhaage me piro di!',
    date: 'February 2025 • The Wedding Day'
  },

  // 💑 COMBINED THREAD: COUPLE MILESTONES (AFTER CONVERGENCE - Y: 164)
  // Perfectly spaced at strictly equal 480px intervals (2420, 2900, 3380, 3860)
  coupleMilestones: [
    {
      id: 'c1',
      x: 2420,
      y: 164,
      birdColor: '#f59e0b',
      tag: '💍 Seven Sacred Vows (Feb 2025)',
      title: 'The Wedding Extravaganza 💖🌺',
      desc: 'Surrounded by holy fire, flower showers, and emotional tears. Two hearts bound together in love and laughter for a lifetime.',
      image: '/photos/couple_wedding.jpg',
      fallbackSvg: '/photos/couple_wedding.svg',
      note: 'The most stunning bride & the happiest groom! Rab Ne Bana Di Jodi! 🥂✨'
    },
    {
      id: 'c2',
      x: 2900,
      y: 164,
      birdColor: '#ec4899',
      tag: '🏔️ First Trip as Mr. & Mrs.',
      title: 'Mountains, Snow & Warm Hugs ❄️☕',
      desc: 'Sharing one shawl in the freezing breeze, endless selfies, and realizing that home is not a place — it’s each other.',
      image: '/photos/couple_trip.jpg',
      fallbackSvg: '/photos/couple_trip.svg',
      note: '1000 pictures taken, 999 rejected by Didi, 1 approved! Typical Jiju struggle! 😂📸'
    },
    {
      id: 'c3',
      x: 3380,
      y: 164,
      birdColor: '#10b981',
      tag: '🍜 Everyday Sweet Chaos',
      title: 'Midnight Maggi & Silly Fights 🌙❤️',
      desc: 'Fighting over the TV remote, deciding what to order on Swiggy for 45 minutes, and laughing until your stomach aches.',
      image: '/photos/couple_maggi.jpg',
      fallbackSvg: '/photos/couple_maggi.svg',
      note: 'True love is letting Jiju have the last slice of pizza! 🍕❤️'
    },
    {
      id: 'c4',
      x: 3860,
      y: 164,
      birdColor: '#ffd700',
      tag: '🥳 365 Days of Pure Magic',
      title: 'Happy 1st Anniversary! 🥂🎂',
      desc: '365 days of love, patience, partnership, and unconditional care. Here is to a century more of being each other’s favorite person!',
      image: '/photos/couple_anniversary.jpg',
      fallbackSvg: '/photos/couple_anniversary.svg',
      note: '1 Year Completed! Lifetime Subscription Activated! Forever to go! 💖✨'
    }
  ]
};
