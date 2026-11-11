<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bug Gene Recombinator</title>
    <style>
        :root {
            --mother-color: #d1a3b9;
            --father-color: #b3d1ff;
            --border-color: #444;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }

        h1 { color: #333; }

        .container {
            display: flex;
            gap: 50px;
            margin-bottom: 40px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .parent-section {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        }

        .chromosome-pool {
            display: flex;
            gap: 15px;
            min-height: 200px;
        }

        /* Chromosome Styling */
        .chromosome {
            width: 60px;
            border: 3px solid;
            border-radius: 8px;
            cursor: grab;
            display: flex;
            flex-direction: column;
            background: white;
            transition: transform 0.2s;
        }

        .chromosome:active { cursor: grabbing; }

        .gene-box {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            font-size: 1.2rem;
        }

        .gene-box:last-child { border-bottom: none; }

        /* Mother specific */
        .mother-chrom { border-color: #8da399; } /* Greenish border like your image */
        .mother-header { background: var(--mother-color); padding: 5px; margin-bottom: 10px; border-radius: 4px; }

        /* Father specific */
        .father-chrom { border-color: blue; }
        .father-header { background: var(--father-color); padding: 5px; margin-bottom: 10px; border-radius: 4px; }

        /* Recombination Zone */
        #recombination-area {
            width: 100%;
            max-width: 600px;
            background: #eee;
            border: 3px dashed #999;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
        }

        .drop-slots {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
            min-height: 260px;
        }

        .slot {
            width: 80px;
            border: 2px solid #ccc;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff;
            position: relative;
        }

        .slot::after {
            content: "Drop Here";
            color: #ccc;
            font-size: 0.8rem;
            position: absolute;
        }

        .slot.occupied::after { content: ""; }

        #bug-preview-panel {
            width: 100%;
            max-width: 600px;
            background: #fff;
            border: 2px solid #d7d7d7;
            border-radius: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            margin-top: 25px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        #bug-preview {
            width: 180px;
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #eef2f3, #f5f1eb);
            border-radius: 16px;
        }
    </style>
</head>
<body>

    <h1>Bug Gene Recombination</h1>

    <div class="container">
        <div class="parent-section">
            <div class="mother-header">Mother Bug Genes</div>
            <div class="chromosome-pool" id="mother-pool">
                <div class="chromosome mother-chrom" draggable="true" id="m1">
                    <div class="gene-box">B</div><div class="gene-box">T</div>
                    <div class="gene-box">R</div><div class="gene-box">L</div>
                    <div class="gene-box">E</div><div class="gene-box">X</div>
                </div>
                <div class="chromosome mother-chrom" draggable="true" id="m2">
                    <div class="gene-box">b</div><div class="gene-box">t</div>
                    <div class="gene-box">r</div><div class="gene-box">l</div>
                    <div class="gene-box">e</div><div class="gene-box">X</div>
                </div>
            </div>
        </div>

        <div class="parent-section">
            <div class="father-header">Father Bug Genes</div>
            <div class="chromosome-pool" id="father-pool">
                <div class="chromosome father-chrom" draggable="true" id="f1">
                    <div class="gene-box">b</div><div class="gene-box">t</div>
                    <div class="gene-box">r</div><div class="gene-box">L</div>
                    <div class="gene-box">e</div><div class="gene-box">X</div>
                </div>
                <div class="chromosome father-chrom" draggable="true" id="f2">
                    <div class="gene-box">b</div><div class="gene-box">t</div>
                    <div class="gene-box">r</div><div class="gene-box">l</div>
                    <div class="gene-box">e</div><div class="gene-box">Y</div>
                </div>
            </div>
        </div>
    </div>

    <div id="recombination-area">
        <h3>Offspring Recombination Zone</h3>
        <p>Drag one chromosome from Mother and one from Father to see the pair</p>
        <div class="drop-slots">
            <div class="slot" id="slot-mother" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
            <div class="slot" id="slot-father" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
        </div>
        <button onclick="reset()">Reset Simulation</button>
    </div>

    <div id="bug-preview-panel">
        <h3>Offspring Preview</h3>
        <div id="bug-preview"></div>
    </div>

    <script>
        function generateBugSVG(state) {
          const bodyColor = state.body.value === 'striped' ? '#715391' : '#8166a0';
          const bodyStroke = state.body.value === 'striped' ? '#4a3263' : '#60477d';
          const patternOverlay = state.body.value === 'striped'
            ? `<path d="M40 40 L60 40 M38 50 L62 50 M40 60 L60 60" stroke="#f7f3e8" stroke-width="3" stroke-linecap="round"/>`
            : '';

          const antennaeSVG = state.antennae.value === 'curly'
            ? `<path d="M42 22 C30 10 30 2 40 10 C45 15 45 20 42 22 Z" fill="none" stroke="#245a49" stroke-width="3" stroke-linecap="round"/>
               <path d="M58 22 C70 10 70 2 60 10 C55 15 55 20 58 22 Z" fill="none" stroke="#245a49" stroke-width="3" stroke-linecap="round"/>`
            : `<line x1="42" y1="22" x2="32" y2="8" stroke="#245a49" stroke-width="3" stroke-linecap="round"/>
               <line x1="58" y1="22" x2="68" y2="8" stroke="#245a49" stroke-width="3" stroke-linecap="round"/>`;

          const wingsSVG = state.wings.value === '2'
            ? `<ellipse cx="25" cy="45" rx="15" ry="8" fill="#4b8298" stroke="#306075" stroke-width="2" transform="rotate(-20 25 45)" opacity="0.85"/>
               <ellipse cx="75" cy="45" rx="15" ry="8" fill="#4b8298" stroke="#306075" stroke-width="2" transform="rotate(20 75 45)" opacity="0.85"/>
               <ellipse cx="22" cy="60" rx="12" ry="6" fill="#5a95ae" stroke="#306075" stroke-width="2" transform="rotate(-10 22 60)" opacity="0.85"/>
               <ellipse cx="78" cy="60" rx="12" ry="6" fill="#5a95ae" stroke="#306075" stroke-width="2" transform="rotate(10 78 60)" opacity="0.85"/>`
            : `<ellipse cx="25" cy="48" rx="18" ry="9" fill="#4b8298" stroke="#306075" stroke-width="2" transform="rotate(-15 25 48)" opacity="0.9"/>
               <ellipse cx="75" cy="48" rx="18" ry="9" fill="#4b8298" stroke="#306075" stroke-width="2" transform="rotate(15 75 48)" opacity="0.9"/>`;

          const legsSVG = state.legs.value === '3'
            ? `<path d="M38 65 L20 75 M38 72 L18 85 M38 79 L20 95" stroke="#794c29" stroke-width="3" stroke-linecap="round"/>
               <path d="M62 65 L80 75 M62 72 L82 85 M62 79 L80 95" stroke="#794c29" stroke-width="3" stroke-linecap="round"/>`
            : `<path d="M38 68 L20 78 M38 78 L20 92" stroke="#794c29" stroke-width="3" stroke-linecap="round"/>
               <path d="M62 68 L80 78 M62 78 L80 92" stroke="#794c29" stroke-width="3" stroke-linecap="round"/>`;

          return `
            <svg class="w-36 h-36 drop-shadow-md transition-all duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              ${legsSVG}
              ${wingsSVG}
              ${antennaeSVG}
              <ellipse cx="50" cy="30" rx="14" ry="12" fill="${bodyColor}" stroke="${bodyStroke}" stroke-width="2"/>
              <ellipse cx="50" cy="55" rx="20" ry="22" fill="${bodyColor}" stroke="${bodyStroke}" stroke-width="2"/>
              ${patternOverlay}
              <circle cx="44" cy="27" r="3" fill="#ffffff"/>
              <circle cx="44" cy="27" r="1.5" fill="#233b35"/>
              <circle cx="56" cy="27" r="3" fill="#ffffff"/>
              <circle cx="56" cy="27" r="1.5" fill="#233b35"/>
            </svg>
          `;
        }

        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }

        document.querySelectorAll('.chromosome').forEach(chrom => {
            chrom.addEventListener('dragstart', drag);
        });

        function getGeneStringFromSlot(slotId) {
            const slot = document.getElementById(slotId);
            if (!slot || !slot.querySelector('.chromosome')) return '';
            const chromosome = slot.querySelector('.chromosome');
            return Array.from(chromosome.querySelectorAll('.gene-box'))
                .map(box => box.textContent.trim())
                .join('');
        }

        function getBugStateFromGenome() {
            const motherGenes = getGeneStringFromSlot('slot-mother');
            const fatherGenes = getGeneStringFromSlot('slot-father');
            const combinedGenes = (motherGenes + fatherGenes).toLowerCase();

            const defaultState = {
                body: { value: 'plain' },
                antennae: { value: 'straight' },
                wings: { value: '1' },
                legs: { value: '2' }
            };

            if (!combinedGenes) {
                return defaultState;
            }

            return {
                body: { value: /b/.test(combinedGenes) ? 'striped' : 'plain' },
                antennae: { value: /t/.test(combinedGenes) ? 'curly' : 'straight' },
                wings: { value: /r/.test(combinedGenes) ? '2' : '1' },
                legs: { value: /l/.test(combinedGenes) ? '3' : '2' }
            };
        }

        function renderBugPreview() {
            const state = getBugStateFromGenome();
            document.getElementById('bug-preview').innerHTML = generateBugSVG(state);
        }

        function drop(ev) {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            const draggedElement = document.getElementById(data);
            const dropTarget = ev.target.closest('.slot');

            if (dropTarget && !dropTarget.classList.contains('occupied')) {
                if (dropTarget.id === 'slot-mother' && !draggedElement.classList.contains('mother-chrom')) {
                    alert("Only Mother's chromosomes can go in this slot!");
                    return;
                }
                if (dropTarget.id === 'slot-father' && !draggedElement.classList.contains('father-chrom')) {
                    alert("Only Father's chromosomes can go in this slot!");
                    return;
                }

                dropTarget.appendChild(draggedElement);
                dropTarget.classList.add('occupied');
                renderBugPreview();
            }
        }

        function reset() {
            document.getElementById('mother-pool').appendChild(document.getElementById('m1'));
            document.getElementById('mother-pool').appendChild(document.getElementById('m2'));
            document.getElementById('father-pool').appendChild(document.getElementById('f1'));
            document.getElementById('father-pool').appendChild(document.getElementById('f2'));

            document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('occupied'));
            renderBugPreview();
        }

        renderBugPreview();
    </script>
</body>
</html>
