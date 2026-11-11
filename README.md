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
        .container { display: flex; gap: 50px; margin-bottom: 40px; flex-wrap: wrap; justify-content: center; }
        .parent-section { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .chromosome-pool { display: flex; gap: 15px; min-height: 200px; }
        .chromosome { width: 60px; border: 3px solid; border-radius: 8px; cursor: grab; display: flex; flex-direction: column; background: white; transition: transform 0.2s; }
        .chromosome:active { cursor: grabbing; }
        .gene-box { height: 40px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 1.2rem; }
        .gene-box:last-child { border-bottom: none; }
        .mother-chrom { border-color: #8da399; }
        .mother-header { background: var(--mother-color); padding: 5px; margin-bottom: 10px; border-radius: 4px; }
        .father-chrom { border-color: blue; }
        .father-header { background: var(--father-color); padding: 5px; margin-bottom: 10px; border-radius: 4px; }
        #recombination-area { width: 100%; max-width: 600px; background: #eee; border: 3px dashed #999; border-radius: 15px; padding: 20px; text-align: center; }
        .drop-slots { display: flex; justify-content: center; gap: 30px; margin-top: 20px; min-height: 260px; }
        .slot { width: 80px; border: 2px solid #ccc; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #fff; position: relative; }
        .slot::after { content: "Drop Here"; color: #ccc; font-size: 0.8rem; position: absolute; }
        .slot.occupied::after { content: ""; }
        button { margin: 8px 4px; padding: 8px 14px; cursor: pointer; }
        #bug-preview-panel { width: 100%; max-width: 600px; background: #fff; border: 2px solid #d7d7d7; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-top: 25px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        #bug-preview { width: 180px; height: 180px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #eef2f3, #f5f1eb); border-radius: 16px; }
        #bug-preview svg { width: 100%; height: 100%; }
        #trait-summary { margin: 0; color: #555; text-align: center; }
        @media (max-width: 520px) { .container { gap: 18px; } .drop-slots { min-height: 200px; } }
    </style>
</head>
<body>
    <h1>Bug Gene Recombination</h1>

    <div class="container">
        <div class="parent-section">
            <div class="mother-header">Mother Bug Genes</div>
            <div class="chromosome-pool" id="mother-pool">
                <div class="chromosome mother-chrom" draggable="true" id="m1">
                    <div class="gene-box">B</div><div class="gene-box">T</div><div class="gene-box">R</div><div class="gene-box">L</div><div class="gene-box">E</div><div class="gene-box">X</div>
                </div>
                <div class="chromosome mother-chrom" draggable="true" id="m2">
                    <div class="gene-box">b</div><div class="gene-box">t</div><div class="gene-box">r</div><div class="gene-box">l</div><div class="gene-box">e</div><div class="gene-box">X</div>
                </div>
            </div>
        </div>

        <div class="parent-section">
            <div class="father-header">Father Bug Genes</div>
            <div class="chromosome-pool" id="father-pool">
                <div class="chromosome father-chrom" draggable="true" id="f1">
                    <div class="gene-box">b</div><div class="gene-box">t</div><div class="gene-box">r</div><div class="gene-box">L</div><div class="gene-box">e</div><div class="gene-box">X</div>
                </div>
                <div class="chromosome father-chrom" draggable="true" id="f2">
                    <div class="gene-box">b</div><div class="gene-box">t</div><div class="gene-box">r</div><div class="gene-box">l</div><div class="gene-box">e</div><div class="gene-box">Y</div>
                </div>
            </div>
        </div>
    </div>

    <div id="recombination-area">
        <h3>Offspring Recombination Zone</h3>
        <p>Drag one chromosome from Mother and one from Father to see the inherited traits.</p>
        <div class="drop-slots">
            <div class="slot" id="slot-mother" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
            <div class="slot" id="slot-father" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
        </div>
        <button type="button" onclick="randomizeOffspring()">Randomize Offspring</button>
        <button type="button" onclick="reset()">Reset Simulation</button>
    </div>

    <div id="bug-preview-panel">
        <h3>Offspring Preview</h3>
        <div id="bug-preview" aria-live="polite"></div>
        <p id="trait-summary">Choose one chromosome from each parent to see the inherited traits.</p>
    </div>

    <script src="bug-svg.js"></script>
    <script>
        const traitDefinitions = [
            { key: 'body', locus: 0, dominant: 'B', dominantValue: 'striped', recessiveValue: 'plain' },
            { key: 'antennae', locus: 1, dominant: 'T', dominantValue: 'curly', recessiveValue: 'straight' },
            { key: 'wings', locus: 2, dominant: 'R', dominantValue: '2', recessiveValue: '1' },
            { key: 'legs', locus: 3, dominant: 'L', dominantValue: '3', recessiveValue: '2' }
        ];

        function allowDrop(ev) { ev.preventDefault(); }

        function drag(ev) {
            ev.dataTransfer.setData('text', ev.currentTarget.id);
            ev.dataTransfer.effectAllowed = 'move';
        }

        document.querySelectorAll('.chromosome').forEach(chrom => chrom.addEventListener('dragstart', drag));

        function getGenesFromChromosome(chromosome) {
            return chromosome ? Array.from(chromosome.querySelectorAll('.gene-box')).map(box => box.textContent.trim()) : [];
        }

        function getBugStateFromGenome() {
            const motherChromosome = document.querySelector('#slot-mother .chromosome');
            const fatherChromosome = document.querySelector('#slot-father .chromosome');
            const motherGenes = getGenesFromChromosome(motherChromosome);
            const fatherGenes = getGenesFromChromosome(fatherChromosome);

            return Object.fromEntries(traitDefinitions.map(trait => {
                const alleles = [motherGenes[trait.locus], fatherGenes[trait.locus]].filter(Boolean);
                const hasDominantAllele = alleles.includes(trait.dominant);
                return [trait.key, { value: hasDominantAllele ? trait.dominantValue : trait.recessiveValue }];
            }));
        }

        function renderBugPreview() {
            const state = getBugStateFromGenome();
            document.getElementById('bug-preview').innerHTML = generateBugSVG(state);

            const mother = document.querySelector('#slot-mother .chromosome');
            const father = document.querySelector('#slot-father .chromosome');
            const summary = document.getElementById('trait-summary');
            if (!mother || !father) {
                summary.textContent = 'Choose one chromosome from each parent to see the inherited traits.';
                return;
            }

            const traits = traitDefinitions.map(trait => {
                const label = trait.key.charAt(0).toUpperCase() + trait.key.slice(1);
                const value = state[trait.key].value;
                const displayValue = trait.key === 'wings' ? `${value} pair${value === '1' ? '' : 's'}` : trait.key === 'legs' ? `${value} pairs` : value;
                return `${label}: ${displayValue}`;
            });
            summary.textContent = traits.join(' · ');
        }

        function drop(ev) {
            ev.preventDefault();
            const draggedElement = document.getElementById(ev.dataTransfer.getData('text'));
            const dropTarget = ev.target.closest('.slot');
            if (!draggedElement || !dropTarget || dropTarget.classList.contains('occupied')) return;

            const isMotherSlot = dropTarget.id === 'slot-mother';
            if (isMotherSlot !== draggedElement.classList.contains('mother-chrom')) {
                alert(isMotherSlot ? "Only Mother's chromosomes can go in this slot!" : "Only Father's chromosomes can go in this slot!");
                return;
            }

            dropTarget.appendChild(draggedElement);
            dropTarget.classList.add('occupied');
            renderBugPreview();
        }

        function returnSlottedChromosomes() {
            [['slot-mother', 'mother-pool'], ['slot-father', 'father-pool']].forEach(([slotId, poolId]) => {
                const slot = document.getElementById(slotId);
                const chromosome = slot.querySelector('.chromosome');
                if (chromosome) document.getElementById(poolId).appendChild(chromosome);
                slot.classList.remove('occupied');
            });
        }

        function randomizeOffspring() {
            returnSlottedChromosomes();
            const motherPool = document.getElementById('mother-pool');
            const fatherPool = document.getElementById('father-pool');
            const mothers = Array.from(motherPool.querySelectorAll('.mother-chrom'));
            const fathers = Array.from(fatherPool.querySelectorAll('.father-chrom'));
            if (!mothers.length || !fathers.length) return;

            const mother = mothers[Math.floor(Math.random() * mothers.length)];
            const father = fathers[Math.floor(Math.random() * fathers.length)];
            document.getElementById('slot-mother').appendChild(mother);
            document.getElementById('slot-father').appendChild(father);
            document.querySelectorAll('.slot').forEach(slot => slot.classList.add('occupied'));
            renderBugPreview();
        }

        function reset() {
            returnSlottedChromosomes();
            renderBugPreview();
        }

        renderBugPreview();
    </script>
</body>
</html>
