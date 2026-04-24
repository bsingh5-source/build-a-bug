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

    <script>
        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }

        // Add event listeners to all chromosomes
        document.querySelectorAll('.chromosome').forEach(chrom => {
            chrom.addEventListener('dragstart', drag);
        });

        function drop(ev) {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            const draggedElement = document.getElementById(data);
            const dropTarget = ev.target.closest('.slot');

            if (dropTarget && !dropTarget.classList.contains('occupied')) {
                // Validation: Only allow mother genes in mother slot, etc.
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
            }
        }

        function reset() {
            // Move chromosomes back to original pools
            document.getElementById('mother-pool').appendChild(document.getElementById('m1'));
            document.getElementById('mother-pool').appendChild(document.getElementById('m2'));
            document.getElementById('father-pool').appendChild(document.getElementById('f1'));
            document.getElementById('father-pool').appendChild(document.getElementById('f2'));
            
            // Clear slot status
            document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('occupied'));
        }
    </script>
</body>
</html>
