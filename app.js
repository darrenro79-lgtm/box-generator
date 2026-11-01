// Function to generate finger joint paths for a panel
function createPanelPath(width, height, thickness, tabsize, isFemaleX = false, isFemaleY = false) {
  let path = '';
  const kerf = parseFloat(document.getElementById('kerf').value) || 0;
  const halfKerf = kerf / 2;

  let numTabsX = Math.max(3, Math.floor(width / tabsize));
  if (numTabsX % 2 === 0) numTabsX++;
  const segW = width / numTabsX;

  let numTabsY = Math.max(3, Math.floor(height / tabsize));
  if (numTabsY % 2 === 0) numTabsY++;
  const segH = height / numTabsY;

  path += 'M 0 0 ';

  // Top Edge
  for (let i = 0; i < numTabsX; i++) {
    const x = (i + 1) * segW;
    const isTab = (i % 2 === 0) ^ isFemaleX;
    const yoff = isTab ? (-thickness - halfKerf) : halfKerf;
    path += ` L ${x - segW} ${yoff} L ${x} ${yoff}`;
  }

  // Right Edge
  for (let i = 0; i < numTabsY; i++) {
    const y = (i + 1) * segH;
    const isTab = (i % 2 === 0) ^ isFemaleY;
    const xoff = isTab ? (width + thickness + halfKerf) : (width - halfKerf);
    path += ` L ${xoff} ${y - segH} L ${xoff} ${y}`;
  }

  // Bottom Edge
  for (let i = numTabsX - 1; i >= 0; i--) {
    const x = i * segW;
    const isTab = (i % 2 === 0) ^ isFemaleX;
    const yoff = isTab ? (height + thickness + halfKerf) : (height - halfKerf);
    path += ` L ${x + segW} ${yoff} L ${x} ${yoff}`;
  }

  // Left Edge
  for (let i = numTabsY - 1; i >= 0; i--) {
    const y = i * segH;
    const isTab = (i % 2 === 0) ^ isFemaleY;
    const xoff = isTab ? (-thickness - halfKerf) : halfKerf;
    path += ` L ${xoff} ${y + segH} L ${xoff} ${y}`;
  }

  return path;
}

function renderBox() {
  const w = parseFloat(document.getElementById('width').value) || 100;
  const d = parseFloat(document.getElementById('depth').value) || 80;
  const h = parseFloat(document.getElementById('height').value) || 60;
  const t = parseFloat(document.getElementById('thickness').value) || 3;
  const tabsize = 15;

  const preview = document.getElementById('svg-preview');
  
  // Create 6 panel paths
  const bottomPath = createPanelPath(w, d, t, tabsize, false, false);
  const topPath = createPanelPath(w, d, t, tabsize, false, false);
  const frontPath = createPanelPath(w, h, t, tabsize, true, false);
  const backPath = createPanelPath(w, h, t, tabsize, true, false);
  const leftPath = createPanelPath(d, h, t, tabsize, true, true);
  const rightPath = createPanelPath(d, h, t, tabsize, true, true);

  const padding = 20;
  const svgWidth = (w + d) * 2 + padding * 5;
  const svgHeight = (h + d) * 2 + padding * 5;

  const svgContent = `
    <svg id="box-svg" width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(${padding + t}, ${padding + t})">
        <path d="${bottomPath}" fill="none" stroke="#0066cc" stroke-width="1" />
        <text x="${w/2}" y="${d/2}" text-anchor="middle" fill="#333" font-size="12">Base (${w}x${d}mm)</text>
      </g>

      <g transform="translate(${padding + t}, ${d + padding * 2 + t})">
        <path d="${topPath}" fill="none" stroke="#0066cc" stroke-width="1" />
        <text x="${w/2}" y="${d/2}" text-anchor="middle" fill="#333" font-size="12">Top (${w}x${d}mm)</text>
      </g>

      <g transform="translate(${w + padding * 2 + t}, ${padding + t})">
        <path d="${frontPath}" fill="none" stroke="#0066cc" stroke-width="1" />
        <text x="${w/2}" y="${h/2}" text-anchor="middle" fill="#333" font-size="12">Front (${w}x${h}mm)</text>
      </g>

      <g transform="translate(${w + padding * 2 + t}, ${h + padding * 2 + t})">
        <path d="${backPath}" fill="none" stroke="#0066cc" stroke-width="1" />
        <text x="${w/2}" y="${h/2}" text-anchor="middle" fill="#333" font-size="12">Back (${w}x${h}mm)</text>
      </g>

      <g transform="translate(${(w + padding) * 2 + padding + t}, ${padding + t})">
        <path d="${leftPath}" fill="none" stroke="#0066cc" stroke-width="1" />
        <text x="${d/2}" y="${h/2}" text-anchor="middle" fill="#333" font-size="12">Left (${d}x${h}mm)</text>
      </g>

      <g transform="translate(${(w + padding) * 2 + padding + t}, ${h + padding * 2 + t})">
        <path d="${rightPath}" fill="none" stroke="#0066cc" stroke-width="1" />
        <text x="${d/2}" y="${h/2}" text-anchor="middle" fill="#333" font-size="12">Right (${d}x${h}mm)</text>
      </g>
    </svg>
  `;

  preview.innerHTML = svgContent;
}

function downloadSVG() {
  const svgElement = document.getElementById("box-svg");
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
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Event Listeners
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', renderBox);
});

document.getElementById('download-btn').addEventListener('click', downloadSVG);

renderBox();