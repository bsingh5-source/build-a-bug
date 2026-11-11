/**
 * Generates an SVG string for the bug based on current trait state.
 * @param {Object} state - The current bugState object
 * @returns {string} SVG markup string
 */
function generateBugSVG(state) {
  // 1. Determine body colors and patterns based on traits & gender
  const bodyColor = state.body.value === 'striped' ? '#715391' : '#8166a0';
  const bodyStroke = state.body.value === 'striped' ? '#4a3263' : '#60477d';
  
  // Striping SVG pattern overlay if striped trait is selected
  const patternOverlay = state.body.value === 'striped' 
    ? `<path d="M40 40 L60 40 M38 50 L62 50 M40 60 L60 60" stroke="#f7f3e8" stroke-width="3" stroke-linecap="round"/>`
    : '';

  // 2. Antennae variants (Straight vs Curly)
  const antennaeSVG = state.antennae.value === 'curly'
    ? `<path d="M42 22 C30 10 30 2 40 10 C45 15 45 20 42 22 Z" fill="none" stroke="#245a49" stroke-width="3" stroke-linecap="round"/>
       <path d="M58 22 C70 10 70 2 60 10 C55 15 55 20 58 22 Z" fill="none" stroke="#245a49" stroke-width="3" stroke-linecap="round"/>`
    : `<line x1="42" y1="22" x2="32" y2="8" stroke="#245a49" stroke-width="3" stroke-linecap="round"/>
       <line x1="58" y1="22" x2="68" y2="8" stroke="#245a49" stroke-width="3" stroke-linecap="round"/>`;

  // 3. Wing variants (1 pair vs 2 pairs)
  const wingsSVG = state.wings.value === '2'
    ? `<ellipse cx="25" cy="45" rx="15" ry="8" fill="#4b8298" stroke="#306075" stroke-width="2" transform="rotate(-20 25 45)" opacity="0.85"/>
       <ellipse cx="75" cy="45" rx="15" ry="8" fill="#4b8298" stroke="#306075" stroke-width="2" transform="rotate(20 75 45)" opacity="0.85"/>
       <ellipse cx="22" cy="60" rx="12" ry="6" fill="#5a95ae" stroke="#306075" stroke-width="2" transform="rotate(-10 22 60)" opacity="0.85"/>
       <ellipse cx="78" cy="60" rx="12" ry="6" fill="#5a95ae" stroke="#306075" stroke-width="2" transform="rotate(10 78 60)" opacity="0.85"/>`
    : `<ellipse cx="25" cy="48" rx="18" ry="9" fill="#4b8298" stroke="#306075" stroke-width="2" transform="rotate(-15 25 48)" opacity="0.9"/>
       <ellipse cx="75" cy="48" rx="18" ry="9" fill="#4b8298" stroke="#306075" stroke-width="2" transform="rotate(15 75 48)" opacity="0.9"/>`;

  // 4. Leg variants (2 pairs vs 3 pairs)
  const legsSVG = state.legs.value === '3'
    ? `<path d="M38 65 L20 75 M38 72 L18 85 M38 79 L20 95" stroke="#794c29" stroke-width="3" stroke-linecap="round"/>
       <path d="M62 65 L80 75 M62 72 L82 85 M62 79 L80 95" stroke="#794c29" stroke-width="3" stroke-linecap="round"/>`
    : `<path d="M38 68 L20 78 M38 78 L20 92" stroke="#794c29" stroke-width="3" stroke-linecap="round"/>
       <path d="M62 68 L80 78 M62 78 L80 92" stroke="#794c29" stroke-width="3" stroke-linecap="round"/>`;

  // 5. Complete assembled SVG structure
  return `
    <svg class="w-36 h-36 drop-shadow-md transition-all duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Legs Layer (Background) -->
      ${legsSVG}
      
      <!-- Wings Layer -->
      ${wingsSVG}
      
      <!-- Antennae Layer -->
      ${antennaeSVG}
      
      <!-- Main Body Segments -->
      <ellipse cx="50" cy="30" rx="14" ry="12" fill="${bodyColor}" stroke="${bodyStroke}" stroke-width="2"/>
      <ellipse cx="50" cy="55" rx="20" ry="22" fill="${bodyColor}" stroke="${bodyStroke}" stroke-width="2"/>
      
      <!-- Body Patterns / Details -->
      ${patternOverlay}
      
      <!-- Eyes -->
      <circle cx="44" cy="27" r="3" fill="#ffffff"/>
      <circle cx="44" cy="27" r="1.5" fill="#233b35"/>
      <circle cx="56" cy="27" r="3" fill="#ffffff"/>
      <circle cx="56" cy="27" r="1.5" fill="#233b35"/>
    </svg>
  `;
}
