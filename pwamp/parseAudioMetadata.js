function getBytes(buffer, offset, count) {
  return new Uint8Array(buffer, offset, count);
}

function sliceBytes(bytes, offset, count) {
  return bytes.slice(offset, offset + count);
}

function unpackBytes(bytes, options = {}) {
  if (options.endian === "little") {
    return bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24;
  } else if (options.shiftBase === 7) {
    return bytes[0] << 21 | bytes[1] << 14 | bytes[2] << 7 | bytes[3];
  }

  let value = bytes[1] << 16 | bytes[2] << 8 | bytes[3];

  if (options.byteCount === 4) {
    value = bytes[0] << 24 | value;
  }

  return value;
}

function decode(bytes, encoding) {
  const decoder = new TextDecoder(encoding);
  return decoder.decode(bytes);
}

function increaseBuffer(file, size) {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    const slicedFile = size ? file.slice(0, Math.min(size, file.size)) : file;

    fileReader.onloadend = function ({
      target
    }) {
      resolve(target.result);
    };

    fileReader.readAsArrayBuffer(slicedFile);
  });
}

function getSize(buffer, offset) {
  return unpackBytes(getBytes(buffer, offset, 4), {
    endian: "big",
    shiftBase: 7
  });
}

function getFrameSize(buffer, offset, version) {
  if (version === 3) {
    return unpackBytes(getBytes(buffer, offset, 4), {
      endian: "big"
    });
  }

  return getSize(buffer, offset);
} // http://id3.org/id3v2.4.0-structure


function decodeFrame(buffer, offset, size) {
  const bytes = getBytes(buffer, offset, size);
  const [firstByte] = bytes;

  if (firstByte === 0) {
    const string = decode(bytes, "iso-8859-1");
    return bytes[bytes.length - 1] === 0 ? string.slice(1, -1) : string.slice(1);
  } else if (firstByte === 1) {
    const encoding = bytes[1] === 255 && bytes[2] === 254 ? "utf-16le" : "utf-16be";
    const stringBytes = bytes.length % 2 === 0 ? bytes.slice(3, -1) : bytes.slice(3);

    if (encoding === "utf-16be") {
      stringBytes[0] = 0;
    }

    const string = decode(stringBytes, encoding);
    return bytes[bytes.length - 1] === 0 && bytes[bytes.length - 2] === 0 ? string.slice(0, -1) : string;
  } else if (firstByte === 2) {
    const stringBytes = bytes.length % 2 === 0 ? bytes.slice(1, -1) : bytes.slice(1);
    return decode(stringBytes, "utf-16le");
  } else if (firstByte === 3) {
    const string = decode(bytes, "utf-8");
    return bytes[bytes.length - 1] === 0 ? string.slice(1, -1) : string.slice(1);
  }

  return decode(bytes, "iso-8859-1");
}

function getFrameId(buffer, offset) {
  const id = decode(getBytes(buffer, offset, 4));
  return /\w{4}/.test(id) ? id : null;
}

function getPictureDataLength(bytes, offset) {
  let length = 0;

  while (bytes[offset]) {
    offset += 1;
    length += 1;
  }

  return length;
} // http://id3.org/id3v2.4.0-frames


function getPicture(buffer, offset, size) {
  let pictureOffset = 1;
  const bytes = getBytes(buffer, offset, size);
  const MIMETypeLength = getPictureDataLength(bytes, pictureOffset);
  const MIMETypeBytes = getBytes(buffer, offset + pictureOffset, MIMETypeLength);
  const MIMEType = decode(MIMETypeBytes); // Jump over MIME type, terminator and picture type

  pictureOffset += MIMETypeLength + 2; // Skip description and its terminator

  const length = getPictureDataLength(bytes, pictureOffset) + 1;
  pictureOffset += length; // Description may end in 2 null bytes

  if (bytes[pictureOffset + length + 1] === 0) {
    pictureOffset += 1;
  }

  return new Blob([bytes.slice(pictureOffset)], {
    type: MIMEType
  });
}

async function parseID3Tag(file, buffer, version, offset = 0, tags = {}) {
  const initialOffset = offset; // Skip identifier, version, flags

  offset += 6; // +10 to include header size

  const tagSize = getSize(buffer, offset) + 10;
  offset += 4;

  if (initialOffset + tagSize > buffer.byteLength) {
    buffer = await increaseBuffer(file, initialOffset + tagSize + buffer.byteLength);
  }

  while (true) {
    const id = getFrameId(buffer, offset);
    offset += 4;
    const frameSize = getFrameSize(buffer, offset, version);
    offset += 4;
    const [encodingFlagByte] = getBytes(buffer, offset + 1, 2);
    const usesCompression = (encodingFlagByte >> 1) % 2 !== 0;
    offset += 2;

    if (id) {
      const field = mapFrameIdToField(id);
      let frameOffset = offset;
      let size = frameSize;

      if (usesCompression) {
        size = getFrameSize(buffer, frameOffset, version);
        frameOffset += 4;
      }

      if (field && !tags[field]) {
        if (field === "picture") {
          tags[field] = getPicture(buffer, frameOffset, size);
        } else {
          tags[field] = decodeFrame(buffer, frameOffset, size);
        }
      }
    } else {
      offset = initialOffset + tagSize;

      if (decode(getBytes(buffer, offset, 3)) === "ID3") {
        return parseID3Tag(file, buffer, version, offset, tags);
      }

      break;
    }

    offset += frameSize;
  } // Skip padding


  while (new DataView(buffer, offset, 1).getUint8(0) === 0) {
    offset += 1;
  }

  let frameCount = 0;
  let isFirstAudioFrame = true;

  while (offset < buffer.byteLength) {
    const bytes = getBytes(buffer, offset, 4);

    if (bytes[0] !== 255 || bytes[1] < 112) {
      tags.duration = getDuration(frameCount, tags);
      return tags;
    }

    if (isFirstAudioFrame) {
      tags = parseAudioFrameHeader(bytes, tags);
      const frameHeaderSize = 36;
      const id = decode(getBytes(buffer, offset + frameHeaderSize, 4));

      if (id === "Xing" || id === "Info") {
        return parseXingHeader(buffer, offset + frameHeaderSize, tags);
      }

      buffer = await increaseBuffer(file);
      isFirstAudioFrame = false;
    }

    frameCount += 1;
    offset += getAudioFrameSize(bytes[2], tags);
  }

  tags.duration = getDuration(frameCount, tags);
  return tags;
}

function getAudioFrameSize(byte, {
  bitrate,
  sampleRate
}) {
  const padding = (byte & 0x02) > 0 ? 1 : 0;
  return Math.floor(144000 * bitrate / sampleRate) + padding;
} // https://www.codeproject.com/Articles/8295/MPEG-Audio-Frame-Header#MPEGAudioFrameHeader


function parseAudioFrameHeader(bytes, data) {
  const sampleRatesTable = [[11025, 12000, 8000], null, [22050, 24000, 16000], [44100, 48000, 32000]];
  const samplesPerFrameTable = [[384, 1152, 576], null, [384, 1152, 576], [384, 1152, 1152]]; // Bitrates

  const version1layer1 = [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 0];
  const version1layer2 = [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 0];
  const version1layer3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
  const version2layer1 = [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 0];
  const version2layer2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
  const version2layer3 = version2layer2;
  const bitratesByVerionAndLayer = [[null, version2layer3, version2layer2, version2layer1], null, [null, version2layer3, version2layer2, version2layer1], [null, version1layer3, version1layer2, version1layer1]];
  const verionIndex = bytes[1] >> 3 & 0x03;
  const layerIndex = bytes[1] >> 1 & 0x03;
  const sampleRateIndex = bytes[2] >> 2 & 0x03;
  const bitrateIndex = bytes[2] >> 4 & 0x0F;
  data.sampleRate = sampleRatesTable[verionIndex][sampleRateIndex];
  data.samplesPerFrame = samplesPerFrameTable[verionIndex][layerIndex];
  data.bitrate = bitratesByVerionAndLayer[verionIndex][layerIndex][bitrateIndex];
  return data;
}

function getDuration(frameCount, {
  samplesPerFrame,
  sampleRate
}) {
  return Math.floor(frameCount * samplesPerFrame / sampleRate);
}

function parseXingHeader(buffer, offset, tags) {
  // +8 to jump to frame count bytes
  const frameCount = unpackBytes(getBytes(buffer, offset + 8, 4), {
    endian: "big"
  });
  tags.duration = getDuration(frameCount, tags);
  return tags;
}

function mapFrameIdToField(id) {
  const map = {
    TIT2: "title",
    TPE1: "artist",
    TALB: "album",
    APIC: "picture"
  };
  return map[id];
}

function convertBase64ToUint8(data) {
  const raw = atob(data);
  const array = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; i++) {
    array[i] = raw.charCodeAt(i);
  }

  return array;
}

function unpackPicutreBlockBytes(bytes, offset) {
  return unpackBytes(sliceBytes(bytes, offset, 4), {
    endian: "big"
  });
} // https://xiph.org/flac/format.html#metadata_block_picture


function parsePictureBlock(bytes, tags) {
  // Start from 4th byte to skip picture type
  let offset = 4;
  const MIMETypeLength = unpackPicutreBlockBytes(bytes, offset);
  offset += 4;
  const MIMEType = decode(sliceBytes(bytes, offset, MIMETypeLength));
  offset += MIMETypeLength;
  const descriptionLength = unpackPicutreBlockBytes(bytes, offset);
  offset += 4; // Skip description

  offset += descriptionLength; // Skip picture width, height, color depth, number of colors used

  offset += 16;
  const pictureLength = unpackPicutreBlockBytes(bytes, offset);
  offset += 4;
  tags.picture = new Blob([sliceBytes(bytes, offset, pictureLength)], {
    type: MIMEType
  });
  return tags;
}

function unpackVorbisCommentBytes(bytes, offset) {
  return unpackBytes(sliceBytes(bytes, offset, 4), {
    endian: "little"
  });
} // https://xiph.org/flac/format.html#metadata_block_vorbis_comment
// https://tools.ietf.org/html/rfc7845#section-5.2


function parseVorbisComment(bytes, tags, offset = 0) {
  const vendorStringLength = unpackVorbisCommentBytes(bytes, offset);
  offset += vendorStringLength + 4;
  let userCommentCount = unpackVorbisCommentBytes(bytes, offset);
  offset += 4;

  while (userCommentCount) {
    const userCommentLength = unpackVorbisCommentBytes(bytes, offset);
    offset += 4;
    const userComment = decode(sliceBytes(bytes, offset, userCommentLength), "utf-8");
    const [name, value] = userComment.split("=");

    if (name === "METADATA_BLOCK_PICTURE") {
      tags = parsePictureBlock(convertBase64ToUint8(value), tags);
    } else {
      tags[name.toLowerCase()] = value;
    }

    offset += userCommentLength;
    userCommentCount -= 1;
  }

  return tags;
}

function parseStreamInfoBlock(bytes, tags) {
  const sampleRate = bytesToNum(bytes.slice(10, 13)) >> 4;
  const sampleBytes = [bytes[13] & 0x0F, ...bytes.slice(14, 18)];
  const totalSamples = bytesToNum(sampleBytes);

  if (sampleRate) {
    tags.duration = Math.floor(totalSamples / sampleRate);
  }

  return tags;
}

function bytesToNum(bytes) {
  return bytes.reduce((result, byte) => (result << 8) + byte, 0);
}

async function parseBlocks(file, buffer, offset = 4) {
  let tags = {};
  let isLastBlock = false;

  while (!isLastBlock) {
    const header = getBytes(buffer, offset, 4);
    const length = unpackBytes(header, {
      endian: "big"
    });
    const firstByte = header[0];
    const blockType = firstByte & 0x7F;
    isLastBlock = (firstByte & 0x80) === 0x80;
    offset += 4;

    if (offset + length > buffer.byteLength) {
      buffer = await increaseBuffer(file, buffer.byteLength + offset + length);
    }

    if (blockType === 0) {
      const bytes = getBytes(buffer, offset, length);
      tags = parseStreamInfoBlock(bytes, tags);
    } else if (blockType === 4) {
      const bytes = getBytes(buffer, offset, length);
      tags = parseVorbisComment(bytes, tags);
    } else if (blockType === 6) {
      const bytes = getBytes(buffer, offset, length);
      tags = parsePictureBlock(bytes, tags);
    }

    offset += length;
  }

  return tags;
}

function mergeTypedArrays(a, b) {
  const c = new Uint8Array(a.length + b.length);
  c.set(a);
  c.set(b, a.length);
  return c;
} // https://tools.ietf.org/html/rfc7845#section-5.1
// https://xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-630004.2.2


function parseIdHeader(bytes, tags) {
  tags.sampleRate = unpackBytes(sliceBytes(bytes, 12, 4), {
    endian: "little"
  });
  return tags;
}

function parseSegment(segment, tags) {
  const type = decode(sliceBytes(segment, 0, 5));

  if (type === "OpusH" || type === "\x01vorb") {
    return parseIdHeader(segment, tags);
  } else if (type === "OpusT") {
    return parseVorbisComment(segment, tags, 8);
  } else if (type === "\x03vorb") {
    return parseVorbisComment(segment, tags, 7);
  }

  throw new Error("Unknown type");
} // https://en.wikipedia.org/wiki/Ogg#Page_structure


function parsePages(buffer) {
  let tags = {};
  let offset = 0;
  let headersToFind = 2;
  let segment = new Uint8Array();

  while (offset < buffer.byteLength) {
    // Jump to header type
    offset += 5;
    const [headerType] = getBytes(buffer, offset, 1);
    offset += 1; // 4 = end of stream

    if (headerType === 4) {
      const samples = unpackBytes(getBytes(buffer, offset, 4), {
        endian: "little"
      });
      tags.duration = Math.floor(samples / tags.sampleRate);
      return tags;
    } // Jump to segment count


    offset += 20;
    const [segmentCount] = getBytes(buffer, offset, 1);
    offset += 1;
    const segmentTable = getBytes(buffer, offset, segmentCount);
    let segmentLength = 0;
    offset += segmentCount;

    for (let i = 0; i < segmentCount; i++) {
      segmentLength += segmentTable[i];
    }

    if (headersToFind) {
      const finalSegment = segmentTable[segmentTable.length - 1];
      segment = mergeTypedArrays(segment, getBytes(buffer, offset, segmentLength));

      if (segmentLength % 255 !== 0 || !finalSegment) {
        headersToFind -= 1;
        tags = parseSegment(segment, tags);
        segment = new Uint8Array();
      }
    }

    offset += segmentLength;
  }
}

function getAtomSize(buffer, offset) {
  return unpackBytes(getBytes(buffer, offset, 4), {
    endian: "big",
    byteCount: 4
  });
} // https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-56313


function parseMovieHeaderAtom(buffer, offset) {
  const version = new DataView(buffer, offset, 1).getUint8(0);
  let timeUnitPerSecond = 0;
  let durationInTimeUnits = 0; // Jump over version and skip flags

  offset += 4;

  if (version === 0) {
    // Skip creation and modification dates
    offset += 8;
    timeUnitPerSecond = getAtomSize(buffer, offset);
    offset += 4;
    durationInTimeUnits = getAtomSize(buffer, offset);
  } else {
    // Skip creation and modification dates
    offset += 16;
    timeUnitPerSecond = getAtomSize(buffer, offset);
    offset += 4;
    durationInTimeUnits = getAtomSize(buffer, offset + 4);
  }

  return Math.floor(durationInTimeUnits / timeUnitPerSecond);
}

function getMIMEType(bytes) {
  if (bytes[0] === 255 && bytes[1] === 216) {
    return "image/jpg";
  } else if (decode(bytes.slice(0, 4)) === "\x89PNG") {
    return "image/png";
  }

  return "";
}

function parseMetadataItemListAtom(buffer, offset, atomSize, tags) {
  const atomTypeToField = {
    "\xA9ART": "artist",
    "\xA9nam": "title",
    "\xA9alb": "album",
    "\xA9cmt": "comment",
    "\xA9day": "year",
    "\xA9too": "encoding",
    covr: "picture"
  };

  while (atomSize) {
    const size = getAtomSize(buffer, offset);
    const type = decode(getBytes(buffer, offset + 4, 4), "iso-8859-1");
    const field = atomTypeToField[type]; // Jump size length, atom type and skip flags and reserved bytes

    const headerSize = 24;

    if (field && size > headerSize) {
      const dataSize = size - headerSize;
      const dataBytes = getBytes(buffer, offset + headerSize, dataSize);

      if (field === "picture") {
        tags[field] = new Blob([dataBytes], {
          type: getMIMEType(dataBytes)
        });
      } else {
        tags[field] = decode(dataBytes, "utf-8");
      }
    }

    offset += size;
    atomSize -= size;
  }

  return tags;
} // http://xhelmboyx.tripod.com/formats/mp4-layout.txt
// https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/Metadata/Metadata.html


function traverseAtoms(buffer) {
  const atoms = ["moov", "mvhd", "udta", "meta", "ilst"];
  let tags = {};
  let offset = 0;

  while (atoms.length && offset < buffer.byteLength) {
    const size = getAtomSize(buffer, offset);
    const type = decode(getBytes(buffer, offset + 4, 4)); // If atom is found move inside it

    if (atoms[0] === type) {
      offset += 8;
      atoms.shift();

      if (type === "mvhd") {
        tags.duration = parseMovieHeaderAtom(buffer, offset);
        offset += size - 8;
      } else if (type === "ilst") {
        tags = parseMetadataItemListAtom(buffer, offset, size - 8, tags);
      } else if (type === "meta") {
        // Meta atom has extra 4 byte header
        offset += 4;
      }
    } else {
      offset += size;
    }
  }

  return tags;
}

async function parseWavFile(buffer, offset = 4) {
  // Jump to "fmt " chunk size
  offset += 12;
  const chunkSizeBytes = getBytes(buffer, offset, 4);
  let chunkSize = unpackBytes(chunkSizeBytes, {
    endian: "little"
  });
  offset += 4;
  const {
    sampleRate,
    dataRate
  } = getFmtChunkData(buffer, offset);
  offset += chunkSize;
  offset = findDataChunk(buffer, offset); // Skip data chunkId

  offset += 4;
  const samplesBytes = getBytes(buffer, offset, 4);
  const samples = unpackBytes(samplesBytes, {
    endian: "little"
  });
  return {
    sampleRate,
    duration: Math.floor(samples / dataRate)
  };
}

function getFmtChunkData(buffer, offset) {
  offset += 4;
  const sampleRateBytes = getBytes(buffer, offset, 4);
  const sampleRate = unpackBytes(sampleRateBytes, {
    endian: "little"
  });
  offset += 4;
  const dataRateBytes = getBytes(buffer, offset, 4);
  const dataRate = unpackBytes(dataRateBytes, {
    endian: "little"
  });
  return {
    sampleRate,
    dataRate
  };
}

function findDataChunk(buffer, offset) {
  while (offset < buffer.byteLength) {
    const bytes = getBytes(buffer, offset, 4);
    const chunkId = decode(bytes);

    if (chunkId === "data") {
      return offset;
    } // Skip chunkId


    offset += 4;
    const chunkSizeBytes = getBytes(buffer, offset, 4);
    let chunkSize = unpackBytes(chunkSizeBytes, {
      endian: "little"
    }); // Add pad byte if chunkSize is odd

    if (chunkSize % 2 === 1) {
      chunkSize += 1;
    } // Jump to the next chunk


    offset += 4 + chunkSize;
  }
}

function getID3TagSize(buffer) {
  const bytes = getBytes(buffer, 6, 4);
  return bytes[0] * 2097152 + bytes[1] * 16384 + bytes[2] * 128 + bytes[3];
}

async function parseFile(file, buffer) {
  const bytes = getBytes(buffer, 0, 8);
  const string = decode(bytes);

  if (string.startsWith("ID3")) {
    if (bytes[3] < 3) {
      throw new Error("Unsupported ID3 tag version");
    } // +10 to skip tag header


    const size = getID3TagSize(buffer) + 10;
    buffer = await increaseBuffer(file, buffer.byteLength + size + 1024);
    const string = decode(getBytes(buffer, size, 4)); // Edge case when there is ID3 tag embedded in .flac file.
    // Instead of parsing ID3 tag - ignore it and treat it as normal .flac file.

    if (string === "fLaC") {
      return parseBlocks(file, buffer, size + 4);
    }

    return parseID3Tag(file, buffer, bytes[3]);
  } else if (string.startsWith("fLaC")) {
    return parseBlocks(file, buffer);
  } else if (string.startsWith("OggS")) {
    buffer = await increaseBuffer(file);
    return parsePages(buffer);
  } else if (string.endsWith("ftyp")) {
    buffer = await increaseBuffer(file);
    return traverseAtoms(buffer);
  } else if (string.startsWith("RIFF")) {
    return parseWavFile(buffer);
  }

  throw new Error("Invalid or unsupported file");
}

function parseAudioMetadata(file) {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    const size = Math.min(24 * 1024, file.size);

    fileReader.onloadend = function ({
      target
    }) {
      resolve(parseFile(file, target.result));
    };

    fileReader.readAsArrayBuffer(file.slice(0, size));
  });
}

export { parseAudioMetadata as default };
