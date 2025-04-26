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
