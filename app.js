// Function to generate finger joint paths for a panel
function createPanelPath(width, height, thickness, tabSize, isFemaleX = false, isFemaleY = false) {
  let path = '';

  let numTabsX = Math.max(3, Math.floor(width / tabSize));
  if (numTabsX % 2 === 0) numTabsX++;
  const segW = width / numTabsX;

  let numTabsY = Math.max(3, Math.floor(height / tabSize));
  if (numTabsY % 2 === 0) numTabsY++;
  const segH = height / numTabsY;

  path += `M 0 0 `;

  // Top Edge
  for (let i = 0; i < numTabsX; i++) {
    const x = (i + 1) * segW;
    const isTab = (i % 2 === 0) ^ isFemaleX;
    const yOff = isTab ? -thickness : 0;
    path += `L ${x - segW} ${yOff} L ${x} ${yOff} `;
  }

  // Right Edge
  for (let i = 0; i < numTabsY; i++) {
    const y = (i + 1) * segH;
    const isTab = (i % 2 === 0) ^ isFemaleY;
    const xOff = isTab ? width + thickness : width;
    path += `L ${xOff} ${y - segH} L ${xOff} ${y} `;
  }

  // Bottom Edge
  for (let i = numTabsX - 1; i >= 0; i--) {
    const x = i * segW;
    const isTab = (i % 2 === 0) ^ isFemaleX;
    const yOff = isTab ? height + thickness : height;
    path += `L ${x + segW} ${yOff} L ${x} ${yOff} `;
  }

  // Left Edge
  for (let i = numTabsY - 1; i >= 0; i--) {
    const y = i * segH;
    const isTab = (i % 2 === 0) ^ isFemaleY;
    const xOff = isTab ? -thickness : 0;
    path += `L ${xOff} ${y + segH} L ${xOff} ${y} `;
  }

  path += 'Z';
  return path;
}

function renderBox() {
  const w = parseFloat(document.getElementById('width').value) || 100;
  const d = parseFloat(document.getElementById('depth').value) || 80;
  const h = parseFloat(document.getElementById('height').value) || 60;
  const t = parseFloat(document.getElementById('thickness').value) || 3;
  const tabSize = 15;

  const gap = 25;
  const margin = 20;

  // Calculate layout grid positioning
  const col1X = margin;
  const col2X = col1X + w + gap + t * 2;
  const col3X = col2X + w + gap + t * 2;

  const row1Y = margin;
  const row2Y = row1Y + Math.max(d, h) + gap + t * 2;

  const totalWidth = col3X + d + margin + t * 2;
  const totalHeight = row2Y + Math.max(d, h) + margin + t * 2;

  // Create panel path definitions
  const baseD  = createPanelPath(w, d, t, tabSize, false, false);
  const topD   = createPanelPath(w, d, t, tabSize, false, false);
  const frontD = createPanelPath(w, h, t, tabSize, true, false);
  const backD  = createPanelPath(w, h, t, tabSize, true, false);
  const leftD  = createPanelPath(d, h, t, tabSize, true, true);
  const rightD = createPanelPath(d, h, t, tabSize, true, true);

  const svgContent = `
    <svg width="100%" height="100%" viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg">
      <!-- Base -->
      <g transform="translate(${col1X}, ${row1Y})">
        <path d="${baseD}" fill="none" stroke="#0066cc" stroke-width="1"/>
        <text x="${w/2}" y="${d/2}" font-size="8" text-anchor="middle" fill="#333">Base (${w}x${d}mm)</text>
      </g>

      <!-- Top -->
      <g transform="translate(${col1X}, ${row2Y})">
        <path d="${topD}" fill="none" stroke="#0066cc" stroke-width="1"/>
        <text x="${w/2}" y="${d/2}" font-size="8" text-anchor="middle" fill="#333">Top (${w}x${d}mm)</text>
      </g>

      <!-- Front -->
      <g transform="translate(${col2X}, ${row1Y})">
        <path d="${frontD}" fill="none" stroke="#1d3557" stroke-width="1"/>
        <text x="${w/2}" y="${h/2}" font-size="8" text-anchor="middle" fill="#333">Front (${w}x${h}mm)</text>
      </g>

      <!-- Back -->
      <g transform="translate(${col2X}, ${row2Y})">
        <path d="${backD}" fill="none" stroke="#1d3557" stroke-width="1"/>
        <text x="${w/2}" y="${h/2}" font-size="8" text-anchor="middle" fill="#333">Back (${w}x${h}mm)</text>
      </g>

      <!-- Left -->
      <g transform="translate(${col3X}, ${row1Y})">
        <path d="${leftD}" fill="none" stroke="#2a9d8f" stroke-width="1"/>
        <text x="${d/2}" y="${h/2}" font-size="8" text-anchor="middle" fill="#333">Left (${d}x${h}mm)</text>
      </g>

      <!-- Right -->
      <g transform="translate(${col3X}, ${row2Y})">
        <path d="${rightD}" fill="none" stroke="#2a9d8f" stroke-width="1"/>
        <text x="${d/2}" y="${h/2}" font-size="8" text-anchor="middle" fill="#333">Right (${d}x${h}mm)</text>
      </g>
    </svg>
  `;

  document.getElementById('svg-preview').innerHTML = svgContent;
}

// Download SVG Functionality
function downloadSVG() {
  const svgElement = document.getElementById('svg-preview').querySelector('svg');
  if (!svgElement) return;

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);

  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "box-flatpack-full.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Event Listeners
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', renderBox);
});

document.getElementById('download-btn').addEventListener('click', downloadSVG);

// Initial Render
renderBox();