// Pure JavaScript PKZip File Generator (No external dependencies required)

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c;
}

function calculateCRC32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function createZipBlob(files) {
  // files: array of { name: string, content: string }
  const textEncoder = new TextEncoder();
  const localHeaderChunks = [];
  const centralDirChunks = [];

  let offset = 0;

  files.forEach((file) => {
    const fileNameBytes = textEncoder.encode(file.name);
    const fileDataBytes = textEncoder.encode(file.content);

    const crc32 = calculateCRC32(fileDataBytes);
    const compressedSize = fileDataBytes.length;
    const uncompressedSize = fileDataBytes.length;

    // --- Local File Header (30 bytes + filename + data) ---
    const localHeader = new Uint8Array(30 + fileNameBytes.length);
    const view = new DataView(localHeader.buffer);

    view.setUint32(0, 0x04034b50, true); // Local header signature
    view.setUint16(4, 20, true); // Version needed (2.0)
    view.setUint16(6, 0, true); // General purpose bit flag
    view.setUint16(8, 0, true); // Compression method (0 = store / uncompressed)
    view.setUint16(10, 0, true); // Mod time
    view.setUint16(12, 0, true); // Mod date
    view.setUint32(14, crc32, true); // CRC-32
    view.setUint32(18, compressedSize, true); // Compressed size
    view.setUint32(22, uncompressedSize, true); // Uncompressed size
    view.setUint16(26, fileNameBytes.length, true); // File name length
    view.setUint16(28, 0, true); // Extra field length

    localHeader.set(fileNameBytes, 30);

    localHeaderChunks.push(localHeader);
    localHeaderChunks.push(fileDataBytes);

    // --- Central Directory Header (46 bytes + filename) ---
    const centralHeader = new Uint8Array(46 + fileNameBytes.length);
    const cdView = new DataView(centralHeader.buffer);

    cdView.setUint32(0, 0x02014b50, true); // Central dir signature
    cdView.setUint16(4, 20, true); // Version made by
    cdView.setUint16(6, 20, true); // Version needed
    cdView.setUint16(8, 0, true); // Bit flag
    cdView.setUint16(10, 0, true); // Compression method
    cdView.setUint16(12, 0, true); // Mod time
    cdView.setUint16(14, 0, true); // Mod date
    cdView.setUint32(16, crc32, true); // CRC-32
    cdView.setUint32(20, compressedSize, true); // Compressed size
    cdView.setUint32(24, uncompressedSize, true); // Uncompressed size
    cdView.setUint16(28, fileNameBytes.length, true); // File name length
    cdView.setUint16(30, 0, true); // Extra field length
    cdView.setUint16(32, 0, true); // Comment length
    cdView.setUint16(34, 0, true); // Disk number start
    cdView.setUint16(36, 0, true); // Internal attributes
    cdView.setUint32(38, 0, true); // External attributes
    cdView.setUint32(42, offset, true); // Relative offset of local header

    centralHeader.set(fileNameBytes, 46);
    centralDirChunks.push(centralHeader);

    offset += localHeader.length + fileDataBytes.length;
  });

  const centralDirOffset = offset;
  let centralDirSize = 0;
  centralDirChunks.forEach((chunk) => (centralDirSize += chunk.length));

  // --- End of Central Directory Record (22 bytes) ---
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);

  eocdView.setUint32(0, 0x06054b50, true); // EOCD signature
  eocdView.setUint16(4, 0, true); // Disk number
  eocdView.setUint16(6, 0, true); // Start disk
  eocdView.setUint16(8, files.length, true); // Records on this disk
  eocdView.setUint16(10, files.length, true); // Total records
  eocdView.setUint32(12, centralDirSize, true); // Central dir size
  eocdView.setUint32(16, centralDirOffset, true); // Central dir offset
  eocdView.setUint16(20, 0, true); // Comment length

  const allChunks = [...localHeaderChunks, ...centralDirChunks, eocd];
  return new Blob(allChunks, { type: "application/zip" });
}

export function downloadZip(files, filename = "portfolio-code.zip") {
  const blob = createZipBlob(files);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
