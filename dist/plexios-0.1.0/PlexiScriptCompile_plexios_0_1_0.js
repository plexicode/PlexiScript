(async () => {
  const CommonScript = (await PlexiOS.HtmlUtil.loadComponent('CommonScript_compile_0_1_0'));
  let EXTENSIONS = 'io_stdout,u3_frame_new,u3_client_to_renderer,u3_init,dom_apply_prop,dom_append_string,dom_append_item,dom_create_element,dom_create_window,dom_clear_children,game_close_window,game_flip,game_pop_event_from_queue,game_set_title,game_show_window'.split(',');

  const PST = (() => {
    //
const [PASTEL_regCallback, createSolitaryAtlas, generateImagePayloadForBundle, ImageAtlas_computeSize, integerToBigEndian4, PUBLIC_bytesToBase64, PUBLIC_generateBundle, PUBLIC_generateImageManifest, PUBLIC_getImageType, PUBLIC_ImageAtlas_getHeight, PUBLIC_ImageAtlas_getImages, PUBLIC_ImageAtlas_getWidth, PUBLIC_ImageAtlas_isJpeg, PUBLIC_ImageAtlas_setBytes, PUBLIC_ImageManifest_getAtlases, PUBLIC_ImageResource_getOriginalBytes, PUBLIC_ImageResource_getOriginalImage, PUBLIC_ImageResource_getX, PUBLIC_ImageResource_getY, PUBLIC_ImageResourceOf, pushArrayIntToList, rectanglePacker_packImages, rectanglePacker_packImagesStacked, rectanglePacker_packNextAtlas, rectanglePacker_tryPackAtlas, serializeImageAtlas, serializeImageManifest] = (() => {
let PST$stringToUtf8Bytes = s => Array.from(new TextEncoder().encode(s));

let PST$createNewArray = s => {
	let o = [];
	while (s --> 0) o.push(null);
	return o;
};

let PST$sortedCopyOfArray = v => {
	let o = [...v];
	if (o.length < 2) return o;
	if (typeof(o[0]) === 'number') return o.sort((a, b) => a - b);
	return o.sort();
};

let PST$extCallbacks = {};

let PST$registerExtensibleCallback = (name, fn) => { PST$extCallbacks[name] = fn; };

let createSolitaryAtlas = function(img) {
	let resources = [];
	resources.push(img);
	img[4] = 0;
	img[5] = 0;
	let lookup = {};
	lookup[img[0]] = 0;
	return [resources, img[3], lookup, img[1], img[2], null];
};

let generateImagePayloadForBundle = function(manifest) {
	let output = [];
	pushArrayIntToList(output, PST$stringToUtf8Bytes(serializeImageManifest(manifest)));
	output.push(0);
	let i = 0;
	while (i < manifest[0].length) {
		let atlasBytes = manifest[0][i][5];
		let sz = atlasBytes.length;
		pushArrayIntToList(output, integerToBigEndian4(sz));
		pushArrayIntToList(output, atlasBytes);
		i += 1;
	}
	return [...(output)];
};

let ImageAtlas_computeSize = function(atlas) {
	let width = 0;
	let height = 0;
	let images = atlas[0];
	let sz = images.length;
	let i = 0;
	while (i < sz) {
		let img = images[i];
		let right = img[4] + img[1];
		let bottom = img[5] + img[2];
		if (right > width) {
			width = right;
		}
		if (bottom > height) {
			height = bottom;
		}
		i += 1;
	}
	atlas[3] = width;
	atlas[4] = height;
};

let integerToBigEndian4 = function(value) {
	let output = PST$createNewArray(4);
	output[0] = value >> 24 & 255;
	output[1] = value >> 16 & 255;
	output[2] = value >> 8 & 255;
	output[3] = value & 255;
	return output;
};

let PUBLIC_bytesToBase64 = function(buf) {
	let i = 0;
	let b = 0;
	let pairs = [];
	let sz = buf.length;
	i = 0;
	while (i < sz) {
		b = buf[i];
		pairs.push(b >> 6 & 3);
		pairs.push(b >> 4 & 3);
		pairs.push(b >> 2 & 3);
		pairs.push(b & 3);
		i += 1;
	}
	while (pairs.length % 3 != 0) {
		pairs.push(0);
	}
	let alphabet = PST$createNewArray(64);
	i = 0;
	while (i < 26) {
		alphabet[i] = "" + String.fromCharCode(65 + i);
		alphabet[i + 26] = "" + String.fromCharCode(97 + i);
		if (i < 10) {
			alphabet[i + 52] = i + '';
		}
		i += 1;
	}
	alphabet[62] = "+";
	alphabet[63] = "/";
	let sb = [];
	i = 0;
	while (i < pairs.length) {
		b = pairs[i] << 4 | pairs[i + 1] << 2 | pairs[i + 2];
		sb.push(alphabet[b]);
		i += 3;
	}
	while (sb.length % 4 != 0) {
		sb.push("=");
	}
	return sb.join("");
};

let PUBLIC_generateBundle = function(optionalAppId, title, byteCode, iconResource, imageManifestObj, binaryResourcesObjs, version) {
	let i = 0;
	let j = 0;
	let sections = {};
	if (optionalAppId != null) {
		sections["ID"] = PST$stringToUtf8Bytes(optionalAppId);
	}
	if (title != null) {
		sections["NAME"] = PST$stringToUtf8Bytes(title);
	}
	let imageManifest = imageManifestObj;
	if (imageManifest[0].length > 0) {
		sections["IMG"] = generateImagePayloadForBundle(imageManifest);
	}
	sections["BC"] = byteCode;
	let output = [];
	pushArrayIntToList(output, PST$stringToUtf8Bytes("PLXSCR"));
	output.push(0);
	output.push(255);
	pushArrayIntToList(output, integerToBigEndian4(version[0]));
	pushArrayIntToList(output, integerToBigEndian4(version[1]));
	pushArrayIntToList(output, integerToBigEndian4(version[2]));
	let keys = PST$sortedCopyOfArray(Object.keys(sections));
	i = 0;
	while (i < keys.length) {
		let key = keys[i];
		pushArrayIntToList(output, PST$stringToUtf8Bytes(key));
		output.push(0);
		let payload = sections[key];
		let payloadSizeBytes = integerToBigEndian4(payload.length);
		j = 0;
		while (j < 4) {
			output.push(payloadSizeBytes[j]);
			j += 1;
		}
		let sz = payload.length;
		j = 0;
		while (j < sz) {
			output.push(payload[j]);
			j += 1;
		}
		i += 1;
	}
	return [...(output)];
};

let PUBLIC_generateImageManifest = function(imageResourceObjs) {
	let i = 0;
	let j = 0;
	let img = null;
	let imageCount = imageResourceObjs.length;
	let imageByPath = {};
	let allImages = [];
	i = 0;
	while (i < imageResourceObjs.length) {
		img = imageResourceObjs[i];
		allImages.push(img);
		imageByPath[img[0]] = img;
		i += 1;
	}
	let sortedImagePaths = PST$sortedCopyOfArray(Object.keys(imageByPath));
	let atlases = [];
	let smallImages = [];
	let tallImages = [];
	let wideImages = [];
	i = 0;
	while (i < imageCount) {
		img = imageByPath[sortedImagePaths[i]];
		let isBig = false;
		if (img[3] || img[1] * img[2] > 2000000 || img[1] > 2500 || img[2] > 2500) {
			atlases.push(createSolitaryAtlas(img));
		} else if (img[1] > 600 && img[2] < 300 || img[1] > 1200) {
			wideImages.push(img);
		} else if (img[2] > 600 && img[1] < 300 || img[2] > 1200) {
			tallImages.push(img);
		} else {
			smallImages.push(img);
		}
		i += 1;
	}
	rectanglePacker_packImagesStacked(tallImages, atlases, false);
	rectanglePacker_packImagesStacked(wideImages, atlases, true);
	rectanglePacker_packImages(smallImages, atlases);
	i = 0;
	while (i < atlases.length) {
		ImageAtlas_computeSize(atlases[i]);
		i += 1;
	}
	return [[...(atlases)]];
};

let PUBLIC_getImageType = function(path) {
	let parts = path.split(".");
	if (parts.length == 1) {
		return null;
	}
	let ext = parts[parts.length - 1];
	ext = ext.toUpperCase();
	if (ext == "PNG" || ext == "JPEG") {
		return ext;
	}
	if (ext == "JPG") {
		return "JPEG";
	}
	return null;
};

let PUBLIC_ImageAtlas_getHeight = function(a) {
	return a[4];
};

let PUBLIC_ImageAtlas_getImages = function(a) {
	let o = [];
	let images = a[0];
	let i = 0;
	while (i < images.length) {
		o.push(images[i]);
		i += 1;
	}
	return o;
};

let PUBLIC_ImageAtlas_getWidth = function(a) {
	return a[3];
};

let PUBLIC_ImageAtlas_isJpeg = function(a) {
	return a[1];
};

let PUBLIC_ImageAtlas_setBytes = function(a, bytes) {
	a[5] = bytes;
};

let PUBLIC_ImageManifest_getAtlases = function(m) {
	let output = [];
	let atlases = m[0];
	let i = 0;
	while (i < atlases.length) {
		output.push(atlases[i]);
		i += 1;
	}
	return output;
};

let PUBLIC_ImageResource_getOriginalBytes = function(img) {
	return img[7];
};

let PUBLIC_ImageResource_getOriginalImage = function(img) {
	return img[6];
};

let PUBLIC_ImageResource_getX = function(img) {
	return img[4];
};

let PUBLIC_ImageResource_getY = function(img) {
	return img[5];
};

let PUBLIC_ImageResourceOf = function(path, width, height, isJpeg, loadedImageData, origBytes) {
	return [path, width, height, isJpeg, -1, -1, loadedImageData, origBytes];
};

let pushArrayIntToList = function(dst, src) {
	let sz = src.length;
	let i = 0;
	while (i < sz) {
		dst.push(src[i]);
		i += 1;
	}
};

let rectanglePacker_packImages = function(images, atlases) {
	let startIndex = 0;
	while (startIndex < images.length) {
		let atlas = rectanglePacker_packNextAtlas(startIndex, images);
		atlas[2] = {};
		let imageCount = atlas[0].length;
		let i = 0;
		while (i < imageCount) {
			let img = atlas[0][i];
			atlas[2][img[0]] = i;
			i += 1;
		}
		startIndex += imageCount;
		atlases.push(atlas);
	}
};

let rectanglePacker_packImagesStacked = function(images, atlasesOut, isVerticalStack) {
	let offset = 0;
	while (offset < images.length) {
		let currentStackSizePixels = 0;
		let keepTrying = true;
		let activeAtlas = [[], false, {}, 0, 0, null];
		atlasesOut.push(activeAtlas);
		while (keepTrying) {
			let img = images[offset];
			let imagePixelSize = img[1];
			if (isVerticalStack) {
				imagePixelSize = img[2];
			}
			if (activeAtlas[0].length == 0 || currentStackSizePixels + imagePixelSize <= 3000) {
				activeAtlas[2][img[0]] = activeAtlas[0].length;
				activeAtlas[0].push(img);
				img[4] = 0;
				img[5] = 0;
				if (isVerticalStack) {
					img[5] = currentStackSizePixels;
				} else {
					img[4] = currentStackSizePixels;
				}
				currentStackSizePixels += imagePixelSize;
				offset += 1;
			} else {
				keepTrying = false;
			}
		}
	}
};

let rectanglePacker_packNextAtlas = function(startIndex, images) {
	let maxCount = images.length - startIndex;
	let minCount = 1;
	let currentAttemptCount = 32;
	if (currentAttemptCount > maxCount) {
		currentAttemptCount = maxCount;
	}
	let minCountAtlas = null;
	while (maxCount > minCount) {
		let activeAttempt = rectanglePacker_tryPackAtlas(startIndex, currentAttemptCount, images);
		if (activeAttempt == null) {
			maxCount = currentAttemptCount - 1;
		} else {
			minCount = currentAttemptCount;
			minCountAtlas = activeAttempt;
		}
		currentAttemptCount = minCount + maxCount >> 1;
		if (currentAttemptCount == minCount) {
			currentAttemptCount = minCount + 1;
		}
	}
	if (maxCount == minCount && minCountAtlas != null) {
		return minCountAtlas;
	}
	return createSolitaryAtlas(images[startIndex]);
};

let rectanglePacker_tryPackAtlas = function(startIndex, imageCount, images) {
	let atlas = [[], false, null, -1, -1, null];
	let resourcesByHeight = {};
	let i = 0;
	let j = 0;
	let img = null;
	i = 0;
	while (i < imageCount) {
		img = images[i + startIndex];
		atlas[0].push(img);
		if (!(resourcesByHeight[img[5]] !== undefined)) {
			resourcesByHeight[img[5]] = [];
		}
		resourcesByHeight[img[5]].push(img);
		i += 1;
	}
	let ySizes = PST$sortedCopyOfArray(Object.keys(resourcesByHeight));
	let imagesSortedByHeight = [];
	i = 0;
	while (i < ySizes.length) {
		let imagesOfHeight = resourcesByHeight[ySizes[i]];
		j = 0;
		while (j < imagesOfHeight.length) {
			imagesSortedByHeight.push(imagesOfHeight[j]);
			j += 1;
		}
		i += 1;
	}
	let imagesLength = imageCount;
	i = 0;
	let currentX = 0;
	let currentY = 0;
	let rowBottom = 0;
	while (i < imagesLength) {
		img = imagesSortedByHeight[i];
		img[4] = currentX;
		img[5] = currentY;
		let right = currentX + img[1];
		if (right > 3000) {
			currentX = 0;
			currentY = rowBottom;
			rowBottom += img[2];
			if (rowBottom > 3000) {
				return null;
			}
		} else {
			i += 1;
			currentX = right;
		}
	}
	return atlas;
};

let serializeImageAtlas = function(rows, atlas) {
	rows.push("A");
	let paths = Object.keys(atlas[2]);
	paths = PST$sortedCopyOfArray(paths);
	let activePath = [];
	let i = 0;
	while (i < paths.length) {
		let path = paths[i];
		let pathParts = path.split("/");
		let matchSize = 0;
		let maxPossibleMatchSize = pathParts.length;
		if (activePath.length < maxPossibleMatchSize) {
			maxPossibleMatchSize = activePath.length;
		}
		let j = 0;
		while (j < maxPossibleMatchSize) {
			if (activePath[j] != pathParts[j]) {
				j += maxPossibleMatchSize;
			} else {
				matchSize += 1;
			}
			j += 1;
		}
		if (matchSize == pathParts.length) {
			let img = atlas[0][atlas[2][path]];
			if (img[3]) {
				rows.push("B");
			} else {
				rows.push(["I:", img[4] + '', ":", img[5] + '', ":", img[1] + '', ":", img[2] + ''].join(''));
			}
			activePath.pop();
		} else if (activePath.length > matchSize) {
			activePath.pop();
			rows.push("P");
			i -= 1;
		} else if (pathParts.length > matchSize) {
			let pushPathPart = pathParts[matchSize];
			activePath.push(pushPathPart);
			rows.push("F:" + pushPathPart);
			i -= 1;
		}
		i += 1;
	}
};

let serializeImageManifest = function(imageManifest) {
	let rows = [];
	let i = 0;
	while (i < imageManifest[0].length) {
		let atlas = imageManifest[0][i];
		serializeImageAtlas(rows, atlas);
		i += 1;
	}
	return rows.join("\n");
};
return [PST$registerExtensibleCallback, createSolitaryAtlas, generateImagePayloadForBundle, ImageAtlas_computeSize, integerToBigEndian4, PUBLIC_bytesToBase64, PUBLIC_generateBundle, PUBLIC_generateImageManifest, PUBLIC_getImageType, PUBLIC_ImageAtlas_getHeight, PUBLIC_ImageAtlas_getImages, PUBLIC_ImageAtlas_getWidth, PUBLIC_ImageAtlas_isJpeg, PUBLIC_ImageAtlas_setBytes, PUBLIC_ImageManifest_getAtlases, PUBLIC_ImageResource_getOriginalBytes, PUBLIC_ImageResource_getOriginalImage, PUBLIC_ImageResource_getX, PUBLIC_ImageResource_getY, PUBLIC_ImageResourceOf, pushArrayIntToList, rectanglePacker_packImages, rectanglePacker_packImagesStacked, rectanglePacker_packNextAtlas, rectanglePacker_tryPackAtlas, serializeImageAtlas, serializeImageManifest];
})();

    return {
      generateBundle: PUBLIC_generateBundle,
      imageResourceOf: PUBLIC_ImageResourceOf,
      bytesToBase64: PUBLIC_bytesToBase64,
      getImageType: PUBLIC_getImageType,
      ImageResource: {
        getX: PUBLIC_ImageResource_getX,
        getY: PUBLIC_ImageResource_getY,
        getOriginalImage: PUBLIC_ImageResource_getOriginalImage,
        getOriginalBytes: PUBLIC_ImageResource_getOriginalBytes,
      },
      ImageAtlas: {
        getWidth: PUBLIC_ImageAtlas_getWidth,
        getHeight: PUBLIC_ImageAtlas_getHeight,
        isJpeg: PUBLIC_ImageAtlas_isJpeg,
        getImages: PUBLIC_ImageAtlas_getImages,
        setBytes: PUBLIC_ImageAtlas_setBytes,
      },
      ImageManifest: {
        generate: PUBLIC_generateImageManifest,
        getAtlases: PUBLIC_ImageManifest_getAtlases,
      },
    };

  })();

  const PlexiScript = CommonScript()('PlexiScript', '0.1.0', EXTENSIONS);

  let usageNotes = [
    //
"Usage:\n  plexic [path-to-project-file] [options]\n\nOptions:\n  --dst [path-for-output]    Save binary to given path\n\n"
  ][0];

  plexiModulesSrcByModuleId = JSON.parse(
    //
"{\"Resources\": {\"resources.px\": \"function loadTextResource(path) {\\nprint(\\\"TODO: load the resource\\\");\\n}\"}, \"Game\": {\"Graphics2D.px\": \"function expandArr(arr, sz) {\\nwhile (sz --> 0) {\\narr.add(0);\\n}\\n}\\n\\nclass Graphics2D {\\nfield _gfxBuffer;\\nfield _gfxBufferSize;\\nfield _win;\\n\\nconstructor(window) {\\nthis._win = window;\\nthis._gfxBuffer = [];\\nthis._gfxBufferSize = 0;\\n}\\n\\nfunction drawRectangle(x, y, w, h, r, g, b, a = 255) {\\nbuf = this._gfxBuffer;\\nsz = this._gfxBufferSize;\\nif (sz + 16 >= buf.length) expandArr(this._gfxBuffer, 16);\\nbuf[sz] = 1;\\nbuf[sz + 1] = x;\\nbuf[sz + 2] = y;\\nbuf[sz + 3] = w;\\nbuf[sz + 4] = h;\\nbuf[sz + 5] = r;\\nbuf[sz + 6] = g;\\nbuf[sz + 7] = b;\\nbuf[sz + 8] = a;\\nthis._gfxBufferSize += 16;\\nreturn this;\\n}\\n\\nfunction fill(r, g, b) {\\nthis._gfxBufferSize = 0;\\nreturn this.drawRectangle(0, 0, this._win._data[1], this._win._data[2], r, g, b);\\n}\\n}\", \"Events.px\": \"class KeyEvent {\\nfield type;\\nfield key;\\nfield isDown;\\n\\nconstructor(isDown, key) {\\nthis.type = isDown ? 'KEY_DOWN' : 'KEY_UP';\\nthis.isDown = isDown;\\nthis.key = key;\\n}\\n}\", \"GameWindow.px\": \"class GameWindow {\\nfield _data;\\nfield _handle;\\nfield _gfx;\\nfield _lastFlip;\\nfield _mutableBuf;\\nfield _pressedKeys;\\n\\nconstructor(title, width, height, fps) {\\nthis._data = [title, width, height, fps];\\nthis._handle = null;\\nthis._gfx = null;\\nthis._lastFlip = 0;\\nthis._mutableBuf = [];\\nwhile (this._mutableBuf.length < 16) this._mutableBuf.add(0);\\nthis._pressedKeys = {};\\n}\\n\\nfunction show() {\\nt = [];\\n$game_show_window(this._data[0], this._data[1], this._data[2], t);\\nthis._handle = t[0];\\n}\\n\\nfunction close() {\\n$game_close_window(this._handle);\\n}\\n\\nfunction getGraphics() {\\nif (this._gfx == null) this._gfx = new Graphics2D(this);\\nreturn this._gfx;\\n}\\n\\nfunction getEvents() {\\neventsBuffer = [];\\nm = this._mutableBuf;\\nwhile ($game_pop_event_from_queue(this._handle, m)) {\\nev = null;\\nswitch (m[0]) {\\ncase 'KEY':\\nisDown = m[1];\\nkey = m[2];\\nthis._pressedKeys[key] = isDown;\\nev = new KeyEvent(isDown, key);\\nbreak;\\ndefault:\\nev = null;\\nbreak;\\n}\\nif (ev != null) eventsBuffer.add(ev);\\n}\\nreturn eventsBuffer;\\n}\\n\\nfunction isKeyPressed(key) {\\nreturn this._pressedKeys.get(key, false);\\n}\\n\\nfunction clockTick() {\\ngfx = this._gfx;\\n$game_flip(this._handle, gfx._gfxBuffer, gfx._gfxBufferSize);\\nif (gfx._gfxBuffer.length > 0) gfx._gfxBuffer.pop(); // reclaim large memory allocs slowly without high churn\\nnow = getUnixTimeFloat();\\ndur = now - this._lastFlip;\\nexpected_dur = 1.0 / this._data[3];\\nextra_dur = expected_dur - dur;\\nif (extra_dur < 0.001) extra_dur = 0.001;\\nsleep(extra_dur);\\nthis._lastFlip = getUnixTimeFloat();\\n}\\n\\nfunction set_title(title) {\\ntitle = title + '';\\n$game_set_title(this._handle, title);\\nthis._data[0] = title;\\n}\\n}\"}, \"U3\": {\"u3.px\": \"@public\\nclass Element {\\nfield _U3;\\nconstructor() {\\nthis._U3 = genElementInternals(this, getU3Ctx());\\n}\\n\\nfunction getFrame() { return this._U3.frame; }\\nfunction setId(id) { element_setUserId(this._U3, id + ''); return this; }\\nfunction setWidthPercent(n) { return this.setWidth(n + '%'); }\\nfunction setHeightPercent(n) { return this.setHeight(n + '%'); }\\nfunction setWidthRatio(r) { return this.setWidth((r * 100) + '%'); }\\nfunction setHeightRatio(r) { return this.setHeight((r * 100) + '%'); }\\nfunction setMargin(m) {\\nfor (i = 1; i < 5; i++) setProp_int(this._U3, 'M' + i, m);\\nreturn this;\\n}\\n\\nfunction setBackgroundColor(value) { return setProp_color(this._U3, 'BG', value);  }\\nfunction getBackgroundColor() { return getProp_color(this._U3, 'BG', null); }\\nfunction clearBackgroundColor() { return clearProp(this._U3, 'BG'); }\\nfunction setBold(value) { return setProp_bool(this._U3, 'BO', value);  }\\nfunction getBold() { return getProp_bool(this._U3, 'BO', null); }\\nfunction clearBold() { return clearProp(this._U3, 'BO'); }\\nfunction setDockDirection(value) { return setProp_enum(this._U3, 'DD', value, Internals.EN3);  }\\nfunction getDockDirection() { return getProp_enum(this._U3, 'DD', null); }\\nfunction clearDockDirection() { return clearProp(this._U3, 'DD'); }\\nfunction setFontSize(value) { return setProp_float(this._U3, 'FS', value);  }\\nfunction getFontSize() { return getProp_float(this._U3, 'FS', null); }\\nfunction clearFontSize() { return clearProp(this._U3, 'FS'); }\\nfunction setHeight(value) { return setProp_size(this._U3, 'H', value);  }\\nfunction getHeight() { return getProp_size(this._U3, 'H', null); }\\nfunction clearHeight() { return clearProp(this._U3, 'H'); }\\nfunction setHorizontalAlignment(value) { return setProp_enum(this._U3, 'HA', value, Internals.EN1);  }\\nfunction getHorizontalAlignment() { return getProp_enum(this._U3, 'HA', null); }\\nfunction clearHorizontalAlignment() { return clearProp(this._U3, 'HA'); }\\nfunction setItalic(value) { return setProp_bool(this._U3, 'IT', value);  }\\nfunction getItalic() { return getProp_bool(this._U3, 'IT', null); }\\nfunction clearItalic() { return clearProp(this._U3, 'IT'); }\\nfunction setMarginLeft(value) { return setProp_int(this._U3, 'M1', value);  }\\nfunction getMarginLeft() { return getProp_int(this._U3, 'M1', null); }\\nfunction clearMarginLeft() { return clearProp(this._U3, 'M1'); }\\nfunction setMarginTop(value) { return setProp_int(this._U3, 'M2', value);  }\\nfunction getMarginTop() { return getProp_int(this._U3, 'M2', null); }\\nfunction clearMarginTop() { return clearProp(this._U3, 'M2'); }\\nfunction setMarginRight(value) { return setProp_int(this._U3, 'M3', value);  }\\nfunction getMarginRight() { return getProp_int(this._U3, 'M3', null); }\\nfunction clearMarginRight() { return clearProp(this._U3, 'M3'); }\\nfunction setMarginBottom(value) { return setProp_int(this._U3, 'M4', value);  }\\nfunction getMarginBottom() { return getProp_int(this._U3, 'M4', null); }\\nfunction clearMarginBottom() { return clearProp(this._U3, 'M4'); }\\nfunction setOpacity(value) { return setProp_float(this._U3, 'OP', value);  }\\nfunction getOpacity() { return getProp_float(this._U3, 'OP', null); }\\nfunction clearOpacity() { return clearProp(this._U3, 'OP'); }\\nfunction setStrikethrough(value) { return setProp_bool(this._U3, 'ST', value);  }\\nfunction getStrikethrough() { return getProp_bool(this._U3, 'ST', null); }\\nfunction clearStrikethrough() { return clearProp(this._U3, 'ST'); }\\nfunction setTextColor(value) { return setProp_color(this._U3, 'TC', value);  }\\nfunction getTextColor() { return getProp_color(this._U3, 'TC', null); }\\nfunction clearTextColor() { return clearProp(this._U3, 'TC'); }\\nfunction setUnderline(value) { return setProp_bool(this._U3, 'UN', value);  }\\nfunction getUnderline() { return getProp_bool(this._U3, 'UN', null); }\\nfunction clearUnderline() { return clearProp(this._U3, 'UN'); }\\nfunction setVerticalAlignment(value) { return setProp_enum(this._U3, 'VA', value, Internals.EN2);  }\\nfunction getVerticalAlignment() { return getProp_enum(this._U3, 'VA', null); }\\nfunction clearVerticalAlignment() { return clearProp(this._U3, 'VA'); }\\nfunction setWidth(value) { return setProp_size(this._U3, 'W', value);  }\\nfunction getWidth() { return getProp_size(this._U3, 'W', null); }\\nfunction clearWidth() { return clearProp(this._U3, 'W'); }\\n}\\n\\n@public\\nclass Panel : Element {\\nconstructor() : base() {\\nelement_setType(this._U3, 'P');\\ngenPanelInternals(this._U3);\\n}\\n\\nfunction getChildren() {\\nchildren = [];\\nwrapped = panel_getChildrenArray(this._U3);\\nfor (i = 0; i < wrapped.length; i++) {\\nchildren.add(element_getUserElement(wrapped[i]));\\n}\\nreturn children;\\n}\\nfunction firstChild() {\\nreturn element_getUserElement(panel_getChild(this._U3, true));\\n}\\nfunction lastChild() {\\nreturn element_getUserElement(panel_getChild(this._U3, false));\\n}\\nfunction clearChildren() {\\npanel_clearChildren(this._U3);\\nreturn this;\\n}\\nfunction append(child) {\\npanel_append(this._U3, child._U3 ?? throwInvalidElement('Cannot append'));\\nreturn this;\\n}\\nfunction prepend(child) {\\npanel_prepend(this._U3, child._U3 ?? throwInvalidElement('Cannot prepend'));\\nreturn this;\\n}\\nfunction insert(child, index) {\\npanel_insert(this._U3, child._U3, index);\\nreturn this;\\n}\\nfunction indexOf(e) {\\nreturn panel_indexOf(this._U3, e._U3);\\n}\\nfunction removeLast() {\\npanel_removeLast(this._U3);\\nreturn this;\\n}\\nfunction removeFirst() {\\npanel_removeFirst(this._U3);\\nreturn this;\\n}\\nfunction _U3_setContent(c) {\\npanel_setContent(this._U3, c._U3);\\nreturn this;\\n}\\n\\n}\\n\\n@public\\nclass Border : Panel {\\nconstructor() : base() {\\nelement_setType(this._U3, 'BR');\\npanel_markSingleContent(this._U3);\\n}\\nfunction setContent(child) { return this._U3_setContent(child); }\\n}\\n\\n@public\\nclass Button : Element {\\nconstructor() : base() {\\nelement_setType(this._U3, 'BU');\\n}\\nfunction onClick(fn) { return addEvCb(this._U3, 'CL', fn); }\\nfunction setTextContent(value) { return setProp_string(this._U3, 'TX', value);  }\\nfunction getTextContent() { return getProp_string(this._U3, 'TX', null); }\\nfunction clearTextContent() { return clearProp(this._U3, 'TX'); }\\n}\\n\\n@public\\nclass DockPanel : Panel {\\nconstructor() : base() {\\nelement_setType(this._U3, 'DP');\\n}\\n}\\n\\n@public\\nclass ShelfPanel : Panel {\\nconstructor() : base() {\\nelement_setType(this._U3, 'HP');\\n}\\n}\\n\\n@public\\nclass Image : Element {\\nconstructor() : base() {\\nelement_setType(this._U3, 'IM');\\n}\\nfunction setSource(value) { return setProp_image(this._U3, 'SR', value);  }\\nfunction getSource() { return getProp_image(this._U3, 'SR', null); }\\nfunction clearSource() { return clearProp(this._U3, 'SR'); }\\n}\\n\\n@public\\nclass SplitPanel : Panel {\\nconstructor() : base() {\\nelement_setType(this._U3, 'IP');\\n}\\n}\\n\\n@public\\nclass LockPanel : Panel {\\nconstructor() : base() {\\nelement_setType(this._U3, 'LP');\\n}\\n}\\n\\n@public\\nclass ScrollPanel : Panel {\\nconstructor() : base() {\\nelement_setType(this._U3, 'RP');\\npanel_markSingleContent(this._U3);\\n}\\nfunction setContent(child) { return this._U3_setContent(child); }\\nfunction setScrollX(value) { return setProp_enum(this._U3, 'SX', value, Internals.EN5);  }\\nfunction getScrollX() { return getProp_enum(this._U3, 'SX', null); }\\nfunction clearScrollX() { return clearProp(this._U3, 'SX'); }\\nfunction setScrollY(value) { return setProp_enum(this._U3, 'SY', value, Internals.EN4);  }\\nfunction getScrollY() { return getProp_enum(this._U3, 'SY', null); }\\nfunction clearScrollY() { return clearProp(this._U3, 'SY'); }\\n}\\n\\n@public\\nclass StackPanel : Panel {\\nconstructor() : base() {\\nelement_setType(this._U3, 'SP');\\n}\\n}\\n\\n@public\\nclass TextBlock : Element {\\nconstructor() : base() {\\nelement_setType(this._U3, 'TB');\\n}\\nfunction setTextContent(value) { return setProp_string(this._U3, 'TX', value);  }\\nfunction getTextContent() { return getProp_string(this._U3, 'TX', null); }\\nfunction clearTextContent() { return clearProp(this._U3, 'TX'); }\\n}\\n\\n@public\\nclass TextLabel : Element {\\nconstructor() : base() {\\nelement_setType(this._U3, 'TL');\\n}\\nfunction setTextContent(value) { return setProp_string(this._U3, 'TX', value);  }\\nfunction getTextContent() { return getProp_string(this._U3, 'TX', null); }\\nfunction clearTextContent() { return clearProp(this._U3, 'TX'); }\\n}\\n\\n\\nfunction getU3Ctx() {\\nif (U3Context.instance == null) throw new U3Exception(\\\"Cannot instantiate U3 classes without calling U3Init()\\\");\\nreturn U3Context.instance._u3ctx;\\n}\\n\\n@public\\nfunction U3Init() {\\n_ = new U3Context();\\n}\\n\\nclass U3Context {\\n@static field instance = null;\\nfield _u3ctx;\\nconstructor() {\\nif (U3Context.instance != null) throw new U3Exception(\\\"Cannot initialize multiple U3 instances\\\");\\nU3Context.instance = this;\\nthis._u3ctx = newU3Context();\\n\\nPST_RegisterExtensibleCallback('is_valid_element', args => args[0] is Element);\\nPST_RegisterExtensibleCallback('throwErr', args => { throw new U3Exception(args[0]); });\\nPST_RegisterExtensibleCallback('image_unwrapper', args => {\\nval = args[0];\\nif (val != null && val.fmt == 'IMAGE') return val.storage;\\nreturn val;\\n});\\nPST_RegisterExtensibleCallback('frame_doLazyFlush', args => { frame_doLazyFlush(args[0]); });\\n\\n\\n}\\n}\\n\\nclass U3Exception : Exception {\\nconstructor(msg) : base(msg) { }\\n}\\n\\n\\nclass Internals {\\n@static field EN1 = enumToLookup(['Center', 'Left', 'Right', 'Stretch']);\\n@static field EN2 = enumToLookup(['Bottom', 'Center', 'Stretch', 'Top']);\\n@static field EN3 = enumToLookup(['East', 'North', 'South', 'West']);\\n@static field EN4 = enumToLookup(['Auto', 'Hide', 'Scroll']);\\n@static field EN5 = enumToLookup(['Auto', 'Hide', 'Scroll']);\\n}\\n\\n\\nfunction frame_doLazyFlush(frame) {\\nif (!frame_prepareForFlush(frame)) return;\\n\\n\\ndelayInvoke(new DummyFlushInvokeWrapper(frame).doThing, 0);\\n}\\n\\n\\nclass DummyFlushInvokeWrapper {\\nfield frame;\\nconstructor(frame) {\\nthis.frame = frame;\\n}\\nfunction doThing() {\\nframe_performFlushIfStillNeeded(this.frame);\\n}\\n}\\n\\n@public\\nclass Frame {\\nconstructor() {\\nthis._U3 = genFrameInternals(this, getU3Ctx());\\n}\\nfunction setRoot(element) {\\nframe_setRoot(this._U3, element._U3);\\nreturn this;\\n}\\nfunction show() {\\nclient_specific_frame_initializer(this._U3);\\nframe_show(this._U3);\\nreturn this;\\n}\\nfunction hide() {\\nthrow new NotImplementedException();\\n}\\nfunction getElementById(id) {\\nreturn element_getUserElement(frame_crawlForUserId(this._U3, id));\\n}\\n}\\n\\n\\n\\nclass DummyEventHandlerWrapper {\\nfield element;\\nfield handler;\\n\\nconstructor(element, handler) {\\nthis.element = element;\\nthis.handler = handler;\\n}\\n\\nfunction doThing(evData) {\\ndelayInvoke(new DummyWrapper2(evData, this.element, this.handler).doThing, 0);\\n}\\n}\\n\\nclass DummyWrapper2 {\\nfield evData;\\nfield element;\\nfield handler;\\n\\nconstructor(evData, element, handler) {\\nthis.evData = evData;\\nthis.element = element;\\nthis.handler = handler;\\n}\\n\\nfunction doThing() {\\nthis.handler(this.evData, this.element.element);\\n}\\n}\\n\\nfunction addEvCb(u, type, fn) {\\naddEventHandlerToElement(getU3Ctx(), u, type, new DummyEventHandlerWrapper(u, fn).doThing);\\n\\nreturn element_getUserElement(u);\\n}\\n\\nfunction ensureInt(v) {\\nif (typeof v == 'int') return v;\\nif (typeof v == 'float') return floor(v);\\nif (v == null) return null;\\nthrowErr(\\\"Not a valid integer.\\\");\\n}\\n\\nfunction ensureFloat(v) {\\nt = typeof v;\\nif (t == 'float') return v;\\nif (t == 'int') return v + 0.0;\\nif (v == null) return null;\\nthrowErr(\\\"Not a valid number.\\\");\\n}\\n\\nfunction ensureEnum(v, d, vals) {\\nif (v == null) return null;\\nreturn vals.get(v.toUpperCase()) ?? throwErr(\\\"Invalid value for enum: \\\" + v);\\n}\\n\\nfunction ensureUserColor(v) {\\nif (v == null) return null;\\nv = v + '';\\nswitch (v) {\\ncase 'T': return [0, 0, 0, 0];\\ncase 'BL': return [0, 0, 0, 255];\\ncase 'WH': return [255, 255, 255, 255];\\n}\\nt = v.split(',');\\nreturn [\\ntryParseInt(t[0]),\\ntryParseInt(t[1]),\\ntryParseInt(t[2]),\\nt.length == 4 ? tryParseInt(t[3]) : 255\\n];\\n}\\n\\nfunction ensureUserSize(v) {\\nif (v == null) return null;\\nt = v.split(':');\\nif (t == 'Z') return 0;\\nif (t == 'F') return '100%';\\nif (t == 'A') return tryParseFloat(t[1]);\\nif (t == 'P') return t + '%';\\nthrow new FatalException();\\n}\\n\\nfunction ensureUserImage(v) {\\nthrow new NotImplementedException();\\n}\\n\\nfunction ensureWireColor(v) {\\nt = typeof v;\\nif (t == 'string') {\\nthrow new NotImplementedException(); // TODO: hex colors\\n}\\n\\nif (t == 'list') {\\nv = v.clone();\\nif (v.length == 3) v.add(255);\\nif (v.length != 4) return null;\\no = '';\\na = ensureInt(v[3]);\\nif (a == null || a < 0 || a > 255) return null;\\nsum = 0;\\nfor (i = 0; i < 3; i++) {\\nif (i > 0) o += ',';\\nn = ensureInt(v[i]);\\nif (n == null || n < 0 || n > 255) return null;\\nsum += n;\\no += n;\\n}\\nif (a == 0) return 'T';\\nif (a == 255)  {\\nif (sum == 0) return 'BL';\\nif (sum == 255 * 3) return 'WH';\\n} else {\\no += ',' + a;\\n}\\n\\nreturn o;\\n}\\nreturn null;\\n}\\n\\nfunction ensureWireSize(v) {\\nswitch (typeof v) {\\ncase 'int':\\ncase 'float':\\nreturn 'A:' + v;\\ncase 'string':\\nif (v.endsWith('%')) {\\nf = tryParseFloat(v[:-1]);\\nif (f < 0) return null;\\nif (f == 0) return 'Z';\\nif (f >= 100) return 'F';\\nreturn 'P:' + f;\\n}\\nreturn null;\\ndefault:\\nreturn null;\\n}\\n}\\n\\nfunction ensureWireImage(v) {\\nthrow new NotImplementedException();\\n}\\n\\nfunction getProp_string(o, k) { return getProp(o, k, ''); }\\nfunction getProp_int(o, k, d) { return ensureInt(getProp(o, k), d); }\\nfunction getProp_bool(o, k, d) { return !!getProp(o, k, d); }\\nfunction getProp_float(o, k, d) { return ensureFloat(getProp(o, k), d); }\\nfunction getProp_color(o, k) { return ensureUserColor(getProp(o, k)); }\\nfunction getProp_enum(o, k) { return getProp_string(o, k); }\\nfunction getProp_size(o, k) { return ensureUserSize(getProp(o, k, null)); }\\nfunction getProp_image(o, k) { return ensureUserImage(getProp(o, k, null)); }\\n\\nfunction setProp_string(o, k, v) { return setProp(o, k, v == null ? null : (v + '')); }\\nfunction setProp_int(o, k, v) { return setProp(o, k, ensureInt(v)); }\\nfunction setProp_bool(o, k, v) { return setProp(o, k, !!v); }\\nfunction setProp_float(o, k, v) { return setProp(o, k, ensureFloat(v)); }\\nfunction setProp_color(o, k, v) { return setProp(o, k, ensureWireColor(v)); }\\nfunction setProp_enum(o, k, v, en) { return setProp(o, k, ensureEnum(v, null, en)); }\\nfunction setProp_size(o, k, v) { return setProp(o, k, ensureWireSize(v)); }\\nfunction setProp_image(o, k, v) { return setProp(o, k, ensureWireImage(v)); }\\n\\n\\nclass PST_ExtCallbacks {\\n@static field ext = {};\\n}\\n\\nfunction PST_RegisterExtensibleCallback(name, fn) {\\nPST_ExtCallbacks.ext[name] = fn;\\n}\\n\\nfunction addEventHandlerToElement(ctx, owner, type, callback) {\\nhandler = [getNextId(\\\"ev\\\", ctx), type, callback, owner];\\nowner[8].add(handler);\\nif (owner[4] != null) {\\nregisterFrameEvent(owner[4], handler);\\n}\\n}\\n\\nfunction applyWireData(frameInternals, items) {\\ni = 0;\\nid = null;\\nsectionSize = 0;\\nsectionType = null;\\nvalue = null;\\nwhile (i < items.length) {\\nsectionType = items[i];\\nsectionSize = items[i + 1];\\ni += 2;\\nif (sectionType == \\\"ECB\\\") {\\nid = items[i];\\ni += 1;\\nvalue = frameInternals[7][id];\\nevArg = {};\\nvalue[2](evArg);\\n} else {\\nthrowErr(\\\"Not implemented\\\");\\n}\\n}\\n}\\n\\nfunction attachToFrame(e, frame) {\\nexistingFrame = e[4];\\nif (existingFrame != null) {\\nif (existingFrame == frame) {\\nthrowErr(\\\"Element is already in the frame.\\\");\\n}\\nthrowErr(\\\"Element is already in a different frame.\\\");\\n}\\nif (frame == null) {\\nreturn;\\n}\\nproliferation = [];\\nproliferation.add(e);\\nids = {};\\nwhile (proliferation.length > 0) {\\ncurrent = proliferation.pop();\\nid = current[1];\\nif (ids.contains(id)) {\\nthrowErr(\\\"Element is in this frame multiple times.\\\");\\n}\\nids[id] = true;\\nif (current[4] != null) {\\nthrowErr(\\\"Element is already in a frame.\\\");\\n}\\nif (current[9]) {\\nframe[5][id] = current;\\ncurrent[10][5] = true;\\nchildren = current[10][0];\\ni = 0;\\nwhile (i < children.length) {\\nproliferation.add(children[i]);\\ni += 1;\\n}\\n}\\ncurrent[4] = frame;\\neventHandlers = current[8];\\nj = 0;\\nwhile (j < eventHandlers.length) {\\nregisterFrameEvent(frame, eventHandlers[j]);\\nj += 1;\\n}\\nframe[4][id] = current;\\n}\\n}\\n\\nfunction check_can_add_element(e, errMsg) {\\nargs = e[0][1];\\nargs[0] = e[7];\\nif (!PST_ExtCallbacks.ext[\\\"is_valid_element\\\"].invoke(args)) {\\nthrowErr(errMsg + \\\": value is not an Element instance\\\");\\n}\\nif (e[4] != null) {\\nthrowErr(errMsg + \\\": value is already in the UI tree.\\\");\\n}\\n}\\n\\nfunction clearProp(e, k) {\\nreturn setProp(e, k, null);\\n}\\n\\nfunction element_getUserElement(e) {\\nif (e == null) {\\nreturn null;\\n}\\nreturn e[7];\\n}\\n\\nfunction element_setType(e, t) {\\ne[2] = t;\\n}\\n\\nfunction element_setUserId(e, v) {\\ne[3] = v;\\n}\\n\\nfunction enumToLookup(items) {\\no = {};\\ni = 0;\\nwhile (i < items.length) {\\nitem = items[i];\\no[item.upper()] = item;\\ni += 1;\\n}\\nreturn o;\\n}\\n\\nfunction flattenNewProperties(e) {\\ndirty = false;\\nkeys = e[5].keys();\\ni = 0;\\nwhile (i < (keys.length)) {\\nkey = keys[i];\\ndirty = true;\\nvalue = e[5][key];\\ne[6][key] = value;\\nif (value == null) {\\ne[6].remove(key);\\n}\\ni += 1;\\n}\\nif (dirty) {\\ne[5] = {};\\n}\\n}\\n\\nfunction frame_crawlForUserId(frame, id) {\\nroot = frame[11];\\nq = [];\\nif (root != null) {\\nq.add(root);\\n}\\nwhile (q.length > 0) {\\ne = q.pop();\\nif (e[3] == id) {\\nreturn e;\\n}\\nif (e[9]) {\\nchildren = e[10][0];\\ni = children.length - 1;\\nwhile (i >= 0) {\\nq.add(children[i]);\\ni -= 1;\\n}\\n}\\n}\\nreturn null;\\n}\\n\\nfunction frame_doFlush(frame) {\\nif (frame != null) {\\nargs = frame[0][1];\\nargs[0] = frame;\\nPST_ExtCallbacks.ext[\\\"frame_doLazyFlush\\\"].invoke(args);\\n}\\n}\\n\\nfunction frame_getIpcHandle(frame) {\\nreturn frame[9];\\n}\\n\\nfunction frame_performFlushIfStillNeeded(frame) {\\nframe[12] = false;\\nif (frame[13]) {\\nframe[13] = false;\\ndata = generateWireData(frame);\\nframe[14](data, data.length);\\n}\\n}\\n\\nfunction frame_prepareForFlush(frame) {\\nframe[13] = true;\\nif (!frame[8] || frame[12]) {\\nreturn false;\\n}\\nframe[12] = true;\\nreturn true;\\n}\\n\\nfunction frame_setIpcHandle(frame, ipcHandle) {\\nframe[9] = ipcHandle;\\n}\\n\\nfunction frame_setRoot(frame, element) {\\ncheck_can_add_element(element, \\\"Cannot set element as root\\\");\\nframe[11] = element;\\nattachToFrame(element, frame);\\n}\\n\\nfunction frame_setSendDownstream(frame, cb) {\\nframe[14] = cb;\\n}\\n\\nfunction frame_show(frame) {\\nif (!frame[8]) {\\nframe[8] = true;\\nframe_doFlush(frame);\\n}\\n}\\n\\nfunction genElementInternals(element, ctx) {\\nreturn [ctx, getNextId(\\\"e\\\", ctx), null, null, null, {}, {}, element, [], false, null];\\n}\\n\\nfunction generateWireData(frame) {\\narg1 = [null];\\nwireData = [];\\ndirtyKeys = frame[4].keys();\\npropKeys = null;\\nprops = null;\\ni = 0;\\nj = 0;\\nsizeIndex = 0;\\nkey = null;\\nid = null;\\nval = null;\\ne = null;\\npanel = null;\\npanelData = null;\\nchildren = null;\\nkeyCount = 0;\\ni = 0;\\nwhile (i < (dirtyKeys.length)) {\\nid = dirtyKeys[i];\\ne = frame[4][id];\\nif (e != null) {\\nframe[3][id] = null;\\nflattenNewProperties(e);\\nprops = e[6];\\nkeyCount = 0;\\nsizeIndex = wireData.length + 1;\\nwireData.add(\\\"FEI\\\");\\nwireData.add(0);\\nwireData.add(id);\\nwireData.add(e[2]);\\npropKeys = props.keys();\\nj = 0;\\nwhile (j < (propKeys.length)) {\\nkey = propKeys[j];\\nval = valueConvertForCanonicalWireValue(arg1, props[key]);\\nwireData.add(key);\\nwireData.add(val);\\nkeyCount += 1;\\nj += 1;\\n}\\nwireData[sizeIndex] = 2 + keyCount * 2;\\n}\\ni += 1;\\n}\\ndirtyKeys = frame[3].keys();\\ni = 0;\\nwhile (i < (dirtyKeys.length)) {\\nid = dirtyKeys[i];\\ne = frame[3][id];\\nif (e != null) {\\nsizeIndex = wireData.length + 1;\\nwireData.add(\\\"PPU\\\");\\nwireData.add(0);\\nwireData.add(id);\\nkeyCount = 0;\\nprops = e[5];\\npropKeys = props.keys();\\nj = 0;\\nwhile (j < (propKeys.length)) {\\nkey = propKeys[j];\\nkeyCount += 1;\\nval = valueConvertForCanonicalWireValue(arg1, props[key]);\\nif (val == null) {\\nwireData.add(\\\"\\\");\\nwireData.add(key);\\n} else {\\nwireData.add(key);\\nwireData.add(val);\\n}\\nj += 1;\\n}\\nflattenNewProperties(e);\\nwireData[sizeIndex] = 1 + keyCount * 2;\\n}\\ni += 1;\\n}\\nframe[3] = {};\\nframe[4] = {};\\ndirtyKeys = frame[5].keys();\\ni = 0;\\nwhile (i < (dirtyKeys.length)) {\\nid = dirtyKeys[i];\\npanel = frame[5][id];\\npanelData = panel[10];\\nif (panelData[5]) {\\nif (panelData[0].length > 0) {\\nwireData.add(\\\"CHI\\\");\\nwireData.add(1 + panelData[0].length);\\nwireData.add(id);\\nchildren = panelData[0];\\nj = 0;\\nwhile (j < children.length) {\\ne = children[j];\\nwireData.add(e[1]);\\nj += 1;\\n}\\n}\\n} else {\\nsizeIndex = wireData.length + 1;\\nsize = 0;\\nwireData.add(\\\"ITU\\\");\\nwireData.add(size);\\nthrowErr(\\\"Not implemented\\\");\\n}\\npanelData[5] = false;\\npanelData[1] = [];\\npanelData[2] = [];\\npanelData[3] = 0;\\npanelData[4] = 0;\\ni += 1;\\n}\\nframe[5] = {};\\nwhile (frame[6].length > 0) {\\nev = frame[6].pop();\\nwireData.add(\\\"EWR\\\");\\nwireData.add(3);\\nwireData.add(ev[0]);\\nwireData.add(ev[3][1]);\\nwireData.add(ev[1]);\\n}\\nrootId = null;\\nif (frame[11] != null) {\\nrootId = frame[11][1];\\n}\\nif (frame[10] != rootId) {\\nwireData.add(\\\"RC\\\");\\nwireData.add(1);\\nwireData.add(rootId);\\nframe[10] = rootId;\\n}\\nreturn wireData;\\n}\\n\\nfunction genFrameInternals(frame, ctx) {\\nreturn [ctx, frame, getNextId(\\\"f\\\", ctx), {}, {}, {}, [], {}, false, null, null, null, false, false, null];\\n}\\n\\nfunction genPanelInternals(e) {\\ne[9] = true;\\ne[10] = [[], [], [], 0, 0, true, false];\\n}\\n\\nfunction getNextId(prefix, ctx) {\\nctx[0] += 1;\\nreturn prefix + (ctx[0] + '');\\n}\\n\\nfunction getProp(e, k, d) {\\noutput = null;\\nif (e[5].contains(k)) {\\noutput = e[5][k];\\nif (output != null) {\\nreturn output;\\n}\\n}\\nif (e[6].contains(k)) {\\noutput = e[6][k];\\nif (output != null) {\\nreturn output;\\n}\\n}\\nreturn d;\\n}\\n\\nfunction newU3Context() {\\nreturn [0, [null]];\\n}\\n\\nfunction panel_append(panel, children) {\\nframe = panel[4];\\npd = panel[10];\\ni = 0;\\nwhile (i < children.length) {\\nchild = children[i];\\nif (pd[6]) {\\npanel_doMultiChildCheck(panel);\\n}\\ncheck_can_add_element(child, \\\"Cannot append element\\\");\\nattachToFrame(child, frame);\\npd[0].add(child);\\nif (!pd[5]) {\\npd[1].add(child);\\n}\\ni += 1;\\n}\\nregisterChildInvalidation(panel);\\n}\\n\\nfunction panel_clearChildren(p) {\\npd = p[10];\\nsz = pd[0].length;\\nif (sz > 0) {\\npd[0] = [];\\npd[1] = [];\\npd[2] = [];\\npd[3] = 0;\\npd[4] = 0;\\npd[5] = true;\\n}\\n}\\n\\nfunction panel_doMultiChildCheck(p) {\\nif (p[10][6] && p[10][0].length > 0) {\\nthrowErr(\\\"This panel type cannot support multiple children.\\\");\\n}\\n}\\n\\nfunction panel_getChild(e, isFirst) {\\nchildren = e[10][0];\\nsz = children.length;\\nif (sz == 0) {\\nreturn null;\\n}\\nif (isFirst) {\\nreturn children[0];\\n}\\nreturn children[sz - 1];\\n}\\n\\nfunction panel_getChildrenArray(e) {\\nreturn e[10][0];\\n}\\n\\nfunction panel_indexOf(panel, child) {\\nif (child != null) {\\ntargetId = child[1];\\nchildren = panel[10][0];\\ni = 0;\\nwhile (i < children.length) {\\nif (children[i][1] == targetId) {\\nreturn i;\\n}\\ni += 1;\\n}\\n}\\nreturn -1;\\n}\\n\\nfunction panel_insert(panel, child, index) {\\npanelData = panel[10];\\nif (index == panelData[0].length) {\\nreturn panel_append(panel, quickWrap(child));\\n}\\nif (index == 0) {\\nreturn panel_prepend(panel, child);\\n}\\ncheck_can_add_element(child, \\\"Cannot insert element\\\");\\nattachToFrame(child, panel[4]);\\nif (panelData[6]) {\\npanel_doMultiChildCheck(panel);\\n}\\npanelData[0].insert(child, index);\\npanelData[5] = true;\\nregisterChildInvalidation(panel);\\n}\\n\\nfunction panel_markSingleContent(e) {\\ne[10][6] = true;\\n}\\n\\nfunction panel_prepend(panel, child) {\\npanelData = panel[10];\\nif (panelData[0].length == 0) {\\nreturn panel_append(panel, quickWrap(child));\\n}\\ncheck_can_add_element(child, \\\"Cannot prepend element\\\");\\nattachToFrame(child, panel[4]);\\nif (panelData[6]) {\\npanel_doMultiChildCheck(panel);\\n}\\npanelData[0].insert(child, 0);\\nif (!panelData[5]) {\\npanelData[2].add(child);\\n}\\nregisterChildInvalidation(panel);\\n}\\n\\nfunction panel_removeFirst(panel) {\\npanelData = panel[10];\\nif (panelData[0].length == 0) {\\npanel_removeLast(panel);\\nreturn;\\n}\\nif (panelData[2].length > 0) {\\npanelData[2].pop();\\n} else {\\npanelData[4] += 1;\\n}\\nregisterChildInvalidation(panel);\\n}\\n\\nfunction panel_removeLast(panel) {\\npanelData = panel[10];\\nif (panelData[0].length == 0) {\\nthrowErr(\\\"Cannot remove: panel has no children.\\\");\\n}\\nif (panelData[1].length > 0) {\\npanelData[1].pop();\\n} else {\\npanelData[3] += 1;\\n}\\nregisterChildInvalidation(panel);\\n}\\n\\nfunction panel_setContent(p, child) {\\nif (p[10][0].length > 0) {\\npanel_removeLast(p);\\n}\\nif (child == null) {\\nthrowInvalidElement(\\\"Cannot set content\\\");\\n}\\nchildrenArr = [];\\nchildrenArr.add(child);\\npanel_append(p, childrenArr);\\n}\\n\\nfunction quickWrap(e) {\\na = [];\\na.add(e);\\nreturn a;\\n}\\n\\nfunction registerChildInvalidation(panel) {\\nframe = panel[4];\\nif (frame != null) {\\nframe[5][panel[1]] = panel;\\n}\\n}\\n\\nfunction registerFrameEvent(frame, evHandler) {\\nframe[7][evHandler[0]] = evHandler;\\nframe[6].add(evHandler);\\nframe_doFlush(frame);\\n}\\n\\nfunction setProp(e, k, v) {\\ne[5][k] = v;\\nif (e[4] != null) {\\ne[4][3][e[1]] = e;\\nif (!e[4][12]) {\\nframe_doFlush(e[4]);\\n}\\n}\\nreturn e[7];\\n}\\n\\nfunction throwErr(msg) {\\nargs = [null];\\nargs[0] = msg;\\nPST_ExtCallbacks.ext[\\\"throwErr\\\"].invoke(args);\\n}\\n\\nfunction throwInvalidElement(msg) {\\nthrowErr(msg + \\\": The value is not a valid UI element.\\\");\\n}\\n\\nfunction valueConvertForCanonicalWireValue(arg1, val) {\\nif (val == null) {\\nreturn null;\\n}\\narg1[0] = val;\\nreturn PST_ExtCallbacks.ext[\\\"image_unwrapper\\\"].invoke(arg1);\\n}\\n\\n\\n\\n\\n\\nfunction client_specific_frame_initializer(frame) {\\nframeLink = new FrameLink(frame);\\nframe_setSendDownstream(frame, frameLink.sendToRenderer);\\n}\\n\\nclass FrameLink {\\nfield frame;\\nconstructor(frame) {\\nthis.frame = frame;\\nframe_setIpcHandle(frame, $u3_frame_new());\\n}\\n\\nfunction sendToRenderer(arr, len) {\\n$u3_client_to_renderer(frame_getIpcHandle(this.frame), arr, len);\\n}\\n}\"}, \"DomUtil\": {\"domutils.px\": \"function setProp(e, prop) {\\nswitch (typeof prop) {\\ncase 'null': return e;\\ncase 'list':\\nfor (i = 0; i < prop.length; i++) {\\nsetProp(e, prop[i]);\\n}\\nreturn e;\\ncase 'dict':\\nkeys = prop.keys();\\nfor (i = 0; i < keys.length; i++) {\\nkey = keys[i];\\nvalue = prop[key];\\nt = typeof value;\\nif (t != 'function' && t != 'string') throw new Exception();\\n$dom_apply_prop(e, key, value, t == 'function');\\n}\\nreturn e;\\ncase 'string':\\n$dom_append_string(e, prop);\\nreturn e;\\ncase 'int':\\ncase 'float':\\ncase 'bool':\\n$dom_append_string(e, prop + '');\\nreturn e;\\ncase 'native':\\n$dom_append_item(e, prop);\\nreturn e;\\ndefault:\\nthrow new Exception(\\\"Invalid DOM value: \\\" + (typeof e));\\n}\\n}\\n\\nfunction clearChildren(e) {\\n$dom_clear_children(e);\\nreturn e;\\n}\\n\\nfunction createElement(tag, props = null) {\\ne = $dom_create_element(tag);\\nreturn props == null ? e : setProp(e, props);\\n}\\n\\nclass AbstractDomWindow {\\n\\nfield args;\\nfield handle;\\n\\nconstructor(title, width, height) {\\nthis.args = [title, width, height];\\n}\\n\\nfunction show() {\\n$dom_create_window([\\nthis.args[0],\\nthis.args[1],\\nthis.args[2],\\nthis._initInternal,\\nthis.onShown,\\nthis.onClosed,\\nthis.onClosing,\\n]);\\n}\\nfunction _initInternal(contentHost, handle) {\\nthis.handle = handle;\\nthis.init(contentHost);\\n}\\n\\nfunction onClosed( ) { }\\nfunction onClosing() { }\\nfunction onShown() { }\\nfunction init(contentHost) { }\\n}\"}}"
  );

  let userCompilation = async (mainModuleId, fileLookupByModuleId) => {
    return PlexiScript.doStaticCompilation(mainModuleId, fileLookupByModuleId, plexiModulesSrcByModuleId)
  };

  let loadImage = async (byteBuf) => {
    let base64 = PST.bytesToBase64(byteBuf);
    // 'iV' is the standard PNG heading in B64.
    let isJpeg = !base64.startsWith('iV');
    return new Promise(res => {
      let loader = document.createElement('img');
      // TODO: check if invalid.
      loader.addEventListener('load', () => {
        let c = document.createElement('canvas');
        let { width, height } = loader;
        c.width = width;
        c.height = height;
        let g = c.getContext('2d');
        g.drawImage(loader, 0, 0);
        res({ ok: true, isJpeg, image: c, width, height, bytes: byteBuf });
      });
      loader.src = 'data:image/' + (isJpeg ? 'jpeg' : 'png') + ';base64,' + base64;
    });
  };

  let generateResourceData = async (resourceFileRelativePaths, readFileBytesAsync) => {
    let fileLookup = {};
    let promises = [];
    let failures = [];
    for (const rel of resourceFileRelativePaths) {
      let pr = Promise.resolve(readFileBytesAsync(rel)).then(bytes => {
        if (!bytes) {
          failures.push(rel);
        } else {
          fileLookup[rel] = bytes;
        }
      });
      promises.push(pr);
    };
    await Promise.all(promises);
    if (failures.length) {
      return { ok: false, error: 'RESOURCE_LOAD_FAILED', files: failures.sort() };
    }

    let imagePromises = [];
    let rawByteResources = [];
    let imgLoadFailures = [];
    for (let path of Object.keys(fileLookup)) {
      if (PST.getImageType(path)) {
        imagePromises.push(loadImage(fileLookup[path]).then(img => {
          if (!img.ok) {
            imgLoadFailures.push({ ok: false, error: 'RESOURCE_INVALID_IMAGE', path });
            return;
          }
          return PST.imageResourceOf(path, img.width, img.height, img.isJpeg, img.image, img.bytes);
        }));
      } else {
        NYI(); // similar Pastel struct of raw byte resources.
      }
    }
    let images = await Promise.all(imagePromises);
    if (imgLoadFailures.length) {
      imgLoadFailures.sort((a, b) => a.path.localeCompare(b.path));
      return { ok: false, error: 'RESOURCE_INVALID_IMAGE', files: imgLoadFailures.map(v => v.path) };
    }

    return {
      ok: true,
      images,
      rawByteResources,
    };
  };

  let createBlittableSurface = (w, h) => {
    let canv = document.createElement('canvas');
    canv.width = w;
    canv.height = h;
    let g = canv.getContext('2d');
    return {
      getCanvas: () => canv,
      blit: (img, x, y) => { g.drawImage(img, x, y); },
      getBytes: () => {
        let b64 = canv.toDataURL().split(',').pop();
        return PlexiOS.Util.base64ToBytes(b64);
      },
    }
  };

  let NYI = () => { throw new Error('NOT IMPLEMENTED'); };

  let plexiCompile = async (mainModuleId, fileLookupByModuleId, resourceFilePaths, readFileBytesAsync) => {

    let readFileBytes = async path => {
      try {
        let { ok, bytes } = await Promise.resolve(readFileBytesAsync(path));
        if (!ok) return null;
        return bytes;
      } catch (ex) {
        return null;
      }
    };
    let result = await userCompilation(mainModuleId, fileLookupByModuleId);
    if (result.byteCodePayload) {
      result = { ...result, byteCodeB64: PlexiOS.Util.bytesToBase64(result.byteCodePayload) };
    }
    let resInfo = await generateResourceData(resourceFilePaths, readFileBytes);
    if (!resInfo.ok) return resInfo;

    let { images, rawByteResources } = resInfo;

    let imageManifest = PST.ImageManifest.generate(images);
    for (let atlas of PST.ImageManifest.getAtlases(imageManifest)) {
      let width = PST.ImageAtlas.getWidth(atlas);
      let height = PST.ImageAtlas.getHeight(atlas);
      let isJpeg = PST.ImageAtlas.isJpeg(atlas);
      let atlasImg = isJpeg ? null : createBlittableSurface(width, height);
      for (let img of PST.ImageAtlas.getImages(atlas)) {
        if (isJpeg) {
          PST.ImageAtlas.setBytes(atlas, PST.ImageResource.getOriginalBytes(img));
        } else {
          atlasImg.blit(PST.ImageResource.getOriginalImage(img), PST.ImageResource.getX(img), PST.ImageResource.getY(img));
        }
      }
      if (!isJpeg) {
        PST.ImageAtlas.setBytes(atlas, atlasImg.getBytes());
      }
    }

    let appId = null;
    let title = "Untitled App";
    let iconBytes = null;
    let verMajMinPat = '0.1.0'.split('.').map(v => parseInt(v));
    let bytesIntList = PST.generateBundle(
      appId, // app ID
      title,
      result.byteCodePayload,
      iconBytes || [],
      imageManifest,
      {}, // binary resources
      verMajMinPat
    );
    let bytes = Uint8Array.from(bytesIntList);

    if (rawByteResources.length) NYI();

    return Object.freeze({ ok: true, id: appId, title, bytes, icon: iconBytes });
  };

  let compiler = Object.freeze({
    compile: plexiCompile,
    getUsageNotes: () => usageNotes,
  });

  PlexiOS.HtmlUtil.registerComponent('PlexiScript_compile_0_1_0', () => compiler);
})();
