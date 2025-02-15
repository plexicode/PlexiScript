﻿using System.Collections.Generic;

// THIS FILE IS AUTOMATICALLY UPDATED BY A SCRIPT.

namespace PlexiScriptCompile
{
    internal class FileInclusions
    {
        public static Dictionary<string, Dictionary<string, string>> GetFiles()
        {
            Dictionary<string, Dictionary<string, string>> files = new Dictionary<string, Dictionary<string, string>>();
            string[] moduleIds = [
                // %%%BUILTIN_MODULES_START%%%
                "Game", "Resources", "U3",
                // %%%BUILTIN_MODULES_END%%%
            ];

            foreach (string mid in moduleIds)
            {
                files[mid] = new Dictionary<string, string>();
            }

            // %%%BUILTIN_FILES_START%%%

            files["Game"]["Events.px"] = "\n\nclass KeyEvent {\n    field type = 'KEY_EVENT';\n    field key;\n    field isDown;\n\n    constructor(isDown, key) {\n        this.isDown = isDown;\n        this.key = key;\n    }\n}\n";
            files["Game"]["GameWindow.px"] = "class GameWindow {\n    field _data;\n    field _handle;\n    field _gfx;\n    field _lastFlip;\n    field _mutableBuf;\n    field _pressedKeys;\n\n    constructor(title, width, height, fps) {\n        this._data = [title, width, height, fps];\n        this._handle = null;\n        this._gfx = null;\n        this._lastFlip = 0;\n        this._mutableBuf = [];\n        while (this._mutableBuf.length < 16) this._mutableBuf.add(0);\n        this._pressedKeys = {};\n    }    \n\n    function show() {\n        t = [];\n        $game_show_window(this._data[0], this._data[1], this._data[2], t);\n        this._handle = t[0];\n    }\n\n    function close() {\n        $game_close_window(this._handle);\n    }\n\n    function getGraphics() {\n        if (this._gfx == null) this._gfx = new Graphics2D(this);\n        return this._gfx;\n    }\n\n    function getEvents() {\n        eventsBuffer = [];\n        m = this._mutableBuf;\n        while ($game_pop_event_from_queue(this._handle, m)) {\n            ev = null;\n            switch (m[0]) {\n                case 'KEY':\n                    isDown = m[1] == 1;\n                    key = m[2];\n                    this._pressedKeys[key] = isDown;\n                    ev = new KeyEvent(isDown, key);\n                    break;\n                default:\n                    ev = null;\n                    break;\n            }\n            if (ev != null) eventsBuffer.add(ev);\n        }\n        return eventsBuffer;\n    }\n\n    function isKeyPressed(key) {\n        return this._pressedKeys.get(key, false);\n    }\n\n    function clockTick() {\n        gfx = this._gfx;\n        $game_flip(this._handle, gfx._gfxBuffer, gfx._gfxBufferSize);\n        if (gfx._gfxBuffer.length > 0) gfx._gfxBuffer.pop(); // reclaim large memory allocs slowly without high churn\n        now = getUnixTimeFloat();\n        dur = now - this._lastFlip;\n        expected_dur = 1.0 / this._data[3]; \n        extra_dur = expected_dur - dur;\n        if (extra_dur < 0.001) extra_dur = 0.001;\n        sleep(extra_dur);\n        this._lastFlip = getUnixTimeFloat();\n    }\n\n    function set_title(title) {\n        title = title + '';\n        $game_set_title(this._handle, title);\n        this._data[0] = title;\n    }\n}\n";
            files["Game"]["Graphics2D.px"] = "function expandArr(arr, sz) {\n    while (sz --> 0) {\n        arr.add(0);\n    }\n}\n\nclass Graphics2D {\n    field _gfxBuffer;\n    field _gfxBufferSize;\n    field _win;\n\n    constructor(window) {\n        this._win = window;\n        this._gfxBuffer = [];\n        this._gfxBufferSize = 0;\n    }\n\n    function drawRectangle(x, y, w, h, r, g, b, a = 255) {\n        buf = this._gfxBuffer;\n        sz = this._gfxBufferSize;\n        if (sz + 16 >= buf.length) expandArr(this._gfxBuffer, 16);\n        buf[sz] = 1;\n        buf[sz + 1] = x;\n        buf[sz + 2] = y;\n        buf[sz + 3] = w;\n        buf[sz + 4] = h;\n        buf[sz + 5] = r;\n        buf[sz + 6] = g;\n        buf[sz + 7] = b;\n        buf[sz + 8] = a;\n        this._gfxBufferSize += 16;\n        return this;\n    }\n\n    function fill(r, g, b) {\n        this._gfxBufferSize = 0;\n        return this.drawRectangle(0, 0, this._win._data[1], this._win._data[2], r, g, b);\n    }\n}\n";
            files["Resources"]["resources.px"] = "function loadTextResource(path) {\n    print(\"TODO: load the resource\");\n}\n";
            files["U3"]["u3.px"] = "@public\nclass Element {\n  field _U3;\n  constructor() {\n    this._U3 = genElementInternals(this, getU3Ctx());\n  }\n\n  function getFrame() { return this._U3.frame; }\n  function setId(id) { element_setUserId(this._U3, id + ''); return this; }\n  function setWidthPercent(n) { return this.setWidth(n + '%'); }\n  function setHeightPercent(n) { return this.setHeight(n + '%'); }\n  function setWidthRatio(r) { return this.setWidth((r * 100) + '%'); }\n  function setHeightRatio(r) { return this.setHeight((r * 100) + '%'); }\n  function setMargin(m) {\n    for (i = 1; i < 5; i++) setProp_int(this._U3, 'M' + i, m);\n    return this;\n  }\n\n  function setBackgroundColor(value) { return setProp_color(this._U3, 'BG', value);  }\n  function getBackgroundColor() { return getProp_color(this._U3, 'BG', null); }\n  function clearBackgroundColor() { return clearProp(this._U3, 'BG'); }\n  function setBold(value) { return setProp_bool(this._U3, 'BO', value);  }\n  function getBold() { return getProp_bool(this._U3, 'BO', null); }\n  function clearBold() { return clearProp(this._U3, 'BO'); }\n  function setDockDirection(value) { return setProp_enum(this._U3, 'DD', value, Internals.EN3);  }\n  function getDockDirection() { return getProp_enum(this._U3, 'DD', null); }\n  function clearDockDirection() { return clearProp(this._U3, 'DD'); }\n  function setFontSize(value) { return setProp_float(this._U3, 'FS', value);  }\n  function getFontSize() { return getProp_float(this._U3, 'FS', null); }\n  function clearFontSize() { return clearProp(this._U3, 'FS'); }\n  function setHeight(value) { return setProp_size(this._U3, 'H', value);  }\n  function getHeight() { return getProp_size(this._U3, 'H', null); }\n  function clearHeight() { return clearProp(this._U3, 'H'); }\n  function setHorizontalAlignment(value) { return setProp_enum(this._U3, 'HA', value, Internals.EN1);  }\n  function getHorizontalAlignment() { return getProp_enum(this._U3, 'HA', null); }\n  function clearHorizontalAlignment() { return clearProp(this._U3, 'HA'); }\n  function setItalic(value) { return setProp_bool(this._U3, 'IT', value);  }\n  function getItalic() { return getProp_bool(this._U3, 'IT', null); }\n  function clearItalic() { return clearProp(this._U3, 'IT'); }\n  function setMarginLeft(value) { return setProp_int(this._U3, 'M1', value);  }\n  function getMarginLeft() { return getProp_int(this._U3, 'M1', null); }\n  function clearMarginLeft() { return clearProp(this._U3, 'M1'); }\n  function setMarginTop(value) { return setProp_int(this._U3, 'M2', value);  }\n  function getMarginTop() { return getProp_int(this._U3, 'M2', null); }\n  function clearMarginTop() { return clearProp(this._U3, 'M2'); }\n  function setMarginRight(value) { return setProp_int(this._U3, 'M3', value);  }\n  function getMarginRight() { return getProp_int(this._U3, 'M3', null); }\n  function clearMarginRight() { return clearProp(this._U3, 'M3'); }\n  function setMarginBottom(value) { return setProp_int(this._U3, 'M4', value);  }\n  function getMarginBottom() { return getProp_int(this._U3, 'M4', null); }\n  function clearMarginBottom() { return clearProp(this._U3, 'M4'); }\n  function setOpacity(value) { return setProp_float(this._U3, 'OP', value);  }\n  function getOpacity() { return getProp_float(this._U3, 'OP', null); }\n  function clearOpacity() { return clearProp(this._U3, 'OP'); }\n  function setStrikethrough(value) { return setProp_bool(this._U3, 'ST', value);  }\n  function getStrikethrough() { return getProp_bool(this._U3, 'ST', null); }\n  function clearStrikethrough() { return clearProp(this._U3, 'ST'); }\n  function setTextColor(value) { return setProp_color(this._U3, 'TC', value);  }\n  function getTextColor() { return getProp_color(this._U3, 'TC', null); }\n  function clearTextColor() { return clearProp(this._U3, 'TC'); }\n  function setUnderline(value) { return setProp_bool(this._U3, 'UN', value);  }\n  function getUnderline() { return getProp_bool(this._U3, 'UN', null); }\n  function clearUnderline() { return clearProp(this._U3, 'UN'); }\n  function setVerticalAlignment(value) { return setProp_enum(this._U3, 'VA', value, Internals.EN2);  }\n  function getVerticalAlignment() { return getProp_enum(this._U3, 'VA', null); }\n  function clearVerticalAlignment() { return clearProp(this._U3, 'VA'); }\n  function setWidth(value) { return setProp_size(this._U3, 'W', value);  }\n  function getWidth() { return getProp_size(this._U3, 'W', null); }\n  function clearWidth() { return clearProp(this._U3, 'W'); }\n}\n\n@public\nclass Panel : Element {\n  constructor() : base() {\n    element_setType(this._U3, 'P');\n    genPanelInternals(this._U3);\n  }\n\n  function getChildren() {\n    children = [];\n    wrapped = panel_getChildrenArray(this._U3);\n    for (i = 0; i < wrapped.length; i++) {\n        children.add(element_getUserElement(wrapped[i]));\n    }\n    return children;\n  }\n  function firstChild() {\n    return element_getUserElement(panel_getChild(this._U3, true));\n  }\n  function lastChild() {\n    return element_getUserElement(panel_getChild(this._U3, false));\n  }\n  function clearChildren() {\n    panel_clearChildren(this._U3);\n    return this;\n  }\n  function append(child) {\n    panel_append(this._U3, child._U3 ?? throwInvalidElement('Cannot append'));\n    return this;\n  }\n  function prepend(child) {\n    panel_prepend(this._U3, child._U3 ?? throwInvalidElement('Cannot prepend'));\n    return this;\n  }\n  function insert(child, index) {\n    panel_insert(this._U3, child._U3, index);\n    return this;\n  }\n  function indexOf(e) {\n    return panel_indexOf(this._U3, e._U3);\n  }\n  function removeLast() {\n    panel_removeLast(this._U3);\n    return this;\n  }\n  function removeFirst() {\n    panel_removeFirst(this._U3);\n    return this;\n  }\n  function _U3_setContent(c) {\n    panel_setContent(this._U3, c._U3);\n    return this;\n  }\n\n}\n\n@public\nclass Border : Panel {\n  constructor() : base() {\n    element_setType(this._U3, 'BR');\n    panel_markSingleContent(this._U3);\n  }\n  function setContent(child) { return this._U3_setContent(child); }\n}\n\n@public\nclass Button : Element {\n  constructor() : base() {\n    element_setType(this._U3, 'BU');\n  }\n  function onClick(fn) { return addEvCb(this._U3, 'CL', fn); }\n  function setTextContent(value) { return setProp_string(this._U3, 'TX', value);  }\n  function getTextContent() { return getProp_string(this._U3, 'TX', null); }\n  function clearTextContent() { return clearProp(this._U3, 'TX'); }\n}\n\n@public\nclass DockPanel : Panel {\n  constructor() : base() {\n    element_setType(this._U3, 'DP');\n  }\n}\n\n@public\nclass ShelfPanel : Panel {\n  constructor() : base() {\n    element_setType(this._U3, 'HP');\n  }\n}\n\n@public\nclass Image : Element {\n  constructor() : base() {\n    element_setType(this._U3, 'IM');\n  }\n  function setSource(value) { return setProp_image(this._U3, 'SR', value);  }\n  function getSource() { return getProp_image(this._U3, 'SR', null); }\n  function clearSource() { return clearProp(this._U3, 'SR'); }\n}\n\n@public\nclass SplitPanel : Panel {\n  constructor() : base() {\n    element_setType(this._U3, 'IP');\n  }\n}\n\n@public\nclass LockPanel : Panel {\n  constructor() : base() {\n    element_setType(this._U3, 'LP');\n  }\n}\n\n@public\nclass ScrollPanel : Panel {\n  constructor() : base() {\n    element_setType(this._U3, 'RP');\n    panel_markSingleContent(this._U3);\n  }\n  function setContent(child) { return this._U3_setContent(child); }\n  function setScrollX(value) { return setProp_enum(this._U3, 'SX', value, Internals.EN5);  }\n  function getScrollX() { return getProp_enum(this._U3, 'SX', null); }\n  function clearScrollX() { return clearProp(this._U3, 'SX'); }\n  function setScrollY(value) { return setProp_enum(this._U3, 'SY', value, Internals.EN4);  }\n  function getScrollY() { return getProp_enum(this._U3, 'SY', null); }\n  function clearScrollY() { return clearProp(this._U3, 'SY'); }\n}\n\n@public\nclass StackPanel : Panel {\n  constructor() : base() {\n    element_setType(this._U3, 'SP');\n  }\n}\n\n@public\nclass TextBlock : Element {\n  constructor() : base() {\n    element_setType(this._U3, 'TB');\n  }\n  function setTextContent(value) { return setProp_string(this._U3, 'TX', value);  }\n  function getTextContent() { return getProp_string(this._U3, 'TX', null); }\n  function clearTextContent() { return clearProp(this._U3, 'TX'); }\n}\n\n@public\nclass TextLabel : Element {\n  constructor() : base() {\n    element_setType(this._U3, 'TL');\n  }\n  function setTextContent(value) { return setProp_string(this._U3, 'TX', value);  }\n  function getTextContent() { return getProp_string(this._U3, 'TX', null); }\n  function clearTextContent() { return clearProp(this._U3, 'TX'); }\n}\n\n\nfunction getU3Ctx() {\n    if (U3Context.instance == null) throw new U3Exception(\"Cannot instantiate U3 classes without calling U3Init()\");\n    return U3Context.instance._u3ctx;\n}\n\n@public\nfunction U3Init() {\n    _ = new U3Context();\n}\n\nclass U3Context {\n    @static field instance = null;\n    field _u3ctx;\n    constructor() {\n        if (U3Context.instance != null) throw new U3Exception(\"Cannot initialize multiple U3 instances\");\n        U3Context.instance = this;\n        this._u3ctx = newU3Context();\n\n        PST_RegisterExtensibleCallback('is_valid_element', args => args[0] is Element);\n        PST_RegisterExtensibleCallback('throwErr', args => { throw new U3Exception(args[0]); });\n        PST_RegisterExtensibleCallback('image_unwrapper', args => {\n            val = args[0];\n            if (val != null && val.fmt == 'IMAGE') return val.storage;\n            return val;\n        });\n        PST_RegisterExtensibleCallback('frame_doLazyFlush', args => { frame_doLazyFlush(args[0]); });\n\n        // client_specific_initializer();\n    }\n}\n\nclass U3Exception : Exception {\n    constructor(msg) : base(msg) { }\n}\n\n\nclass Internals {\n  @static field EN1 = enumToLookup(['Center', 'Left', 'Right', 'Stretch']);\n  @static field EN2 = enumToLookup(['Bottom', 'Center', 'Stretch', 'Top']);\n  @static field EN3 = enumToLookup(['East', 'North', 'South', 'West']);\n  @static field EN4 = enumToLookup(['Auto', 'Hide', 'Scroll']);\n  @static field EN5 = enumToLookup(['Auto', 'Hide', 'Scroll']);\n}\n\n\nfunction frame_doLazyFlush(frame) {\n  if (!frame_prepareForFlush(frame)) return;\n\n  // Push the flush to the end of the event loop, to allow multiple edits to accumulate into one message.\n  delayInvoke(new DummyFlushInvokeWrapper(frame).doThing, 0);\n}\n\n// closures aren't working in CommonScript, lol\nclass DummyFlushInvokeWrapper {\n    field frame;\n    constructor(frame) {\n        this.frame = frame;\n    }\n    function doThing() {\n        frame_performFlushIfStillNeeded(this.frame);\n    }\n}\n\n@public\nclass Frame {\n  constructor() {\n    this._U3 = genFrameInternals(this, getU3Ctx());\n  }\n  function setRoot(element) {\n    frame_setRoot(this._U3, element._U3);\n    return this;\n  }\n  function show() {\n    client_specific_frame_initializer(this._U3);\n    frame_show(this._U3);\n    return this;\n  }\n  function hide() {\n    throw new NotImplementedException();\n  }\n  function getElementById(id) {\n    return element_getUserElement(frame_crawlForUserId(this._U3, id));\n  }\n}\n\n\n// Closures are needed badly!\nclass DummyEventHandlerWrapper {\n    field element;\n    field handler;\n\n    constructor(element, handler) {\n        this.element = element;\n        this.handler = handler;\n    }\n\n    function doThing(evData) {\n        delayInvoke(new DummyWrapper2(evData, this.element, this.handler).doThing, 0);\n    }\n}\n\nclass DummyWrapper2 {\n    field evData;\n    field element;\n    field handler;\n\n    constructor(evData, element, handler) {\n        this.evData = evData;\n        this.element = element;\n        this.handler = handler;\n    }\n\n    function doThing() {\n        this.handler(this.evData, this.element.element);\n    }\n}\n\nfunction addEvCb(u, type, fn) {\n    addEventHandlerToElement(getU3Ctx(), u, type, new DummyEventHandlerWrapper(u, fn).doThing);\n\n    return element_getUserElement(u);\n}\n\nfunction ensureInt(v) {\n    if (typeof v == 'int') return v;\n    if (typeof v == 'float') return floor(v);\n    if (v == null) return null;\n    throwErr(\"Not a valid integer.\");\n}\n\nfunction ensureFloat(v) {\n    t = typeof v;\n    if (t == 'float') return v;\n    if (t == 'int') return v + 0.0;\n    if (v == null) return null;\n    throwErr(\"Not a valid number.\");\n}\n\nfunction ensureEnum(v, d, vals) {\n    if (v == null) return null;\n    return vals.get(v.toUpperCase()) ?? throwErr(\"Invalid value for enum: \" + v);\n}\n\nfunction ensureUserColor(v) {\n    if (v == null) return null;\n    v = v + '';\n    switch (v) {\n        case 'T': return [0, 0, 0, 0];\n        case 'BL': return [0, 0, 0, 255];\n        case 'WH': return [255, 255, 255, 255];\n    }\n    t = v.split(',');\n    return [\n        tryParseInt(t[0]),\n        tryParseInt(t[1]),\n        tryParseInt(t[2]),\n        t.length == 4 ? tryParseInt(t[3]) : 255\n    ];\n}\n\nfunction ensureUserSize(v) {\n    if (v == null) return null;\n    t = v.split(':');\n    if (t == 'Z') return 0;\n    if (t == 'F') return '100%';\n    if (t == 'A') return tryParseFloat(t[1]);\n    if (t == 'P') return t + '%';\n    throw new FatalException();\n}\n\nfunction ensureUserImage(v) {\n    throw new NotImplementedException();\n}\n\nfunction ensureWireColor(v) {\n    t = typeof v;\n    if (t == 'string') {\n        throw new NotImplementedException(); // TODO: hex colors\n    }\n\n    if (t == 'list') {\n        v = v.clone();\n        if (v.length == 3) v.add(255);\n        if (v.length != 4) return null;\n        o = '';\n        a = ensureInt(v[3]);\n        if (a == null || a < 0 || a > 255) return null;\n        sum = 0;\n        for (i = 0; i < 3; i++) {\n            if (i > 0) o += ',';\n            n = ensureInt(v[i]);\n            if (n == null || n < 0 || n > 255) return null;\n            sum += n;\n            o += n;\n        }\n        if (a == 0) return 'T';\n        if (a == 255)  {\n            if (sum == 0) return 'BL';\n            if (sum == 255 * 3) return 'WH';\n        } else {\n            o += ',' + a;\n        }\n\n        return o;\n    }\n    return null;\n}\n\nfunction ensureWireSize(v) {\n    switch (typeof v) {\n        case 'int':\n        case 'float':\n            return 'A:' + v;\n        case 'string':\n            if (v.endsWith('%')) {\n                f = tryParseFloat(v[:-1]);\n                if (f < 0) return null;\n                if (f == 0) return 'Z';\n                if (f >= 100) return 'F';\n                return 'P:' + f;\n            }\n            return null;\n        default:\n            return null;\n    }\n}\n\nfunction ensureWireImage(v) {\n    throw new NotImplementedException();\n}\n\nfunction getProp_string(o, k) { return getProp(o, k, ''); }\nfunction getProp_int(o, k, d) { return ensureInt(getProp(o, k), d); }\nfunction getProp_bool(o, k, d) { return !!getProp(o, k, d); }\nfunction getProp_float(o, k, d) { return ensureFloat(getProp(o, k), d); }\nfunction getProp_color(o, k) { return ensureUserColor(getProp(o, k)); }\nfunction getProp_enum(o, k) { return getProp_string(o, k); }\nfunction getProp_size(o, k) { return ensureUserSize(getProp(o, k, null)); }\nfunction getProp_image(o, k) { return ensureUserImage(getProp(o, k, null)); }\n\nfunction setProp_string(o, k, v) { return setProp(o, k, v == null ? null : (v + '')); }\nfunction setProp_int(o, k, v) { return setProp(o, k, ensureInt(v)); }\nfunction setProp_bool(o, k, v) { return setProp(o, k, !!v); }\nfunction setProp_float(o, k, v) { return setProp(o, k, ensureFloat(v)); }\nfunction setProp_color(o, k, v) { return setProp(o, k, ensureWireColor(v)); }\nfunction setProp_enum(o, k, v, en) { return setProp(o, k, ensureEnum(v, null, en)); }\nfunction setProp_size(o, k, v) { return setProp(o, k, ensureWireSize(v)); }\nfunction setProp_image(o, k, v) { return setProp(o, k, ensureWireImage(v)); }\n\n\nclass PST_ExtCallbacks {\n  @static field ext = {};\n}\n\nfunction PST_RegisterExtensibleCallback(name, fn) {\n  PST_ExtCallbacks.ext[name] = fn;\n}\n\nfunction addEventHandlerToElement(ctx, owner, type, callback) {\n  handler = [getNextId(\"ev\", ctx), type, callback, owner];\n  owner[8].add(handler);\n  if (owner[4] != null) {\n    registerFrameEvent(owner[4], handler);\n  }\n}\n\nfunction applyWireData(frameInternals, items) {\n  i = 0;\n  id = null;\n  sectionSize = 0;\n  sectionType = null;\n  value = null;\n  while (i < items.length) {\n    sectionType = items[i];\n    sectionSize = items[i + 1];\n    i += 2;\n    if (sectionType == \"ECB\") {\n      id = items[i];\n      i += 1;\n      value = frameInternals[7][id];\n      evArg = {};\n      value[2](evArg);\n    } else {\n      throwErr(\"Not implemented\");\n    }\n  }\n}\n\nfunction attachToFrame(e, frame) {\n  existingFrame = e[4];\n  if (existingFrame != null) {\n    if (existingFrame == frame) {\n      throwErr(\"Element is already in the frame.\");\n    }\n    throwErr(\"Element is already in a different frame.\");\n  }\n  if (frame == null) {\n    return;\n  }\n  proliferation = [];\n  proliferation.add(e);\n  ids = {};\n  while (proliferation.length > 0) {\n    current = proliferation.pop();\n    id = current[1];\n    if (ids.contains(id)) {\n      throwErr(\"Element is in this frame multiple times.\");\n    }\n    ids[id] = true;\n    if (current[4] != null) {\n      throwErr(\"Element is already in a frame.\");\n    }\n    if (current[9]) {\n      frame[5][id] = current;\n      current[10][5] = true;\n      children = current[10][0];\n      i = 0;\n      while (i < children.length) {\n        proliferation.add(children[i]);\n        i += 1;\n      }\n    }\n    current[4] = frame;\n    eventHandlers = current[8];\n    j = 0;\n    while (j < eventHandlers.length) {\n      registerFrameEvent(frame, eventHandlers[j]);\n      j += 1;\n    }\n    frame[4][id] = current;\n  }\n}\n\nfunction check_can_add_element(e, errMsg) {\n  args = e[0][1];\n  args[0] = e[7];\n  if (!PST_ExtCallbacks.ext[\"is_valid_element\"].invoke(args)) {\n    throwErr(errMsg + \": value is not an Element instance\");\n  }\n  if (e[4] != null) {\n    throwErr(errMsg + \": value is already in the UI tree.\");\n  }\n}\n\nfunction clearProp(e, k) {\n  return setProp(e, k, null);\n}\n\nfunction element_getUserElement(e) {\n  if (e == null) {\n    return null;\n  }\n  return e[7];\n}\n\nfunction element_setType(e, t) {\n  e[2] = t;\n}\n\nfunction element_setUserId(e, v) {\n  e[3] = v;\n}\n\nfunction enumToLookup(items) {\n  o = {};\n  i = 0;\n  while (i < items.length) {\n    item = items[i];\n    o[item.upper()] = item;\n    i += 1;\n  }\n  return o;\n}\n\nfunction flattenNewProperties(e) {\n  dirty = false;\n  keys = e[5].keys();\n  i = 0;\n  while (i < (keys.length)) {\n    key = keys[i];\n    dirty = true;\n    value = e[5][key];\n    e[6][key] = value;\n    if (value == null) {\n      e[6].remove(key);\n    }\n    i += 1;\n  }\n  if (dirty) {\n    e[5] = {};\n  }\n}\n\nfunction frame_crawlForUserId(frame, id) {\n  root = frame[11];\n  q = [];\n  if (root != null) {\n    q.add(root);\n  }\n  while (q.length > 0) {\n    e = q.pop();\n    if (e[3] == id) {\n      return e;\n    }\n    if (e[9]) {\n      children = e[10][0];\n      i = children.length - 1;\n      while (i >= 0) {\n        q.add(children[i]);\n        i -= 1;\n      }\n    }\n  }\n  return null;\n}\n\nfunction frame_doFlush(frame) {\n  if (frame != null) {\n    args = frame[0][1];\n    args[0] = frame;\n    PST_ExtCallbacks.ext[\"frame_doLazyFlush\"].invoke(args);\n  }\n}\n\nfunction frame_getIpcHandle(frame) {\n  return frame[9];\n}\n\nfunction frame_performFlushIfStillNeeded(frame) {\n  frame[12] = false;\n  if (frame[13]) {\n    frame[13] = false;\n    data = generateWireData(frame);\n    frame[14](data, data.length);\n  }\n}\n\nfunction frame_prepareForFlush(frame) {\n  frame[13] = true;\n  if (!frame[8] || frame[12]) {\n    return false;\n  }\n  frame[12] = true;\n  return true;\n}\n\nfunction frame_setIpcHandle(frame, ipcHandle) {\n  frame[9] = ipcHandle;\n}\n\nfunction frame_setRoot(frame, element) {\n  check_can_add_element(element, \"Cannot set element as root\");\n  frame[11] = element;\n  attachToFrame(element, frame);\n}\n\nfunction frame_setSendDownstream(frame, cb) {\n  frame[14] = cb;\n}\n\nfunction frame_show(frame) {\n  if (!frame[8]) {\n    frame[8] = true;\n    frame_doFlush(frame);\n  }\n}\n\nfunction genElementInternals(element, ctx) {\n  return [ctx, getNextId(\"e\", ctx), null, null, null, {}, {}, element, [], false, null];\n}\n\nfunction generateWireData(frame) {\n  arg1 = [null];\n  wireData = [];\n  dirtyKeys = frame[4].keys();\n  propKeys = null;\n  props = null;\n  i = 0;\n  j = 0;\n  sizeIndex = 0;\n  key = null;\n  id = null;\n  val = null;\n  e = null;\n  panel = null;\n  panelData = null;\n  children = null;\n  keyCount = 0;\n  i = 0;\n  while (i < (dirtyKeys.length)) {\n    id = dirtyKeys[i];\n    e = frame[4][id];\n    if (e != null) {\n      frame[3][id] = null;\n      flattenNewProperties(e);\n      props = e[6];\n      keyCount = 0;\n      sizeIndex = wireData.length + 1;\n      wireData.add(\"FEI\");\n      wireData.add(0);\n      wireData.add(id);\n      wireData.add(e[2]);\n      propKeys = props.keys();\n      j = 0;\n      while (j < (propKeys.length)) {\n        key = propKeys[j];\n        val = valueConvertForCanonicalWireValue(arg1, props[key]);\n        wireData.add(key);\n        wireData.add(val);\n        keyCount += 1;\n        j += 1;\n      }\n      wireData[sizeIndex] = 2 + keyCount * 2;\n    }\n    i += 1;\n  }\n  dirtyKeys = frame[3].keys();\n  i = 0;\n  while (i < (dirtyKeys.length)) {\n    id = dirtyKeys[i];\n    e = frame[3][id];\n    if (e != null) {\n      sizeIndex = wireData.length + 1;\n      wireData.add(\"PPU\");\n      wireData.add(0);\n      wireData.add(id);\n      keyCount = 0;\n      props = e[5];\n      propKeys = props.keys();\n      j = 0;\n      while (j < (propKeys.length)) {\n        key = propKeys[j];\n        keyCount += 1;\n        val = valueConvertForCanonicalWireValue(arg1, props[key]);\n        if (val == null) {\n          wireData.add(\"\");\n          wireData.add(key);\n        } else {\n          wireData.add(key);\n          wireData.add(val);\n        }\n        j += 1;\n      }\n      flattenNewProperties(e);\n      wireData[sizeIndex] = 1 + keyCount * 2;\n    }\n    i += 1;\n  }\n  frame[3] = {};\n  frame[4] = {};\n  dirtyKeys = frame[5].keys();\n  i = 0;\n  while (i < (dirtyKeys.length)) {\n    id = dirtyKeys[i];\n    panel = frame[5][id];\n    panelData = panel[10];\n    if (panelData[5]) {\n      if (panelData[0].length > 0) {\n        wireData.add(\"CHI\");\n        wireData.add(1 + panelData[0].length);\n        wireData.add(id);\n        children = panelData[0];\n        j = 0;\n        while (j < children.length) {\n          e = children[j];\n          wireData.add(e[1]);\n          j += 1;\n        }\n      }\n    } else {\n      sizeIndex = wireData.length + 1;\n      size = 0;\n      wireData.add(\"ITU\");\n      wireData.add(size);\n      throwErr(\"Not implemented\");\n    }\n    panelData[5] = false;\n    panelData[1] = [];\n    panelData[2] = [];\n    panelData[3] = 0;\n    panelData[4] = 0;\n    i += 1;\n  }\n  frame[5] = {};\n  while (frame[6].length > 0) {\n    ev = frame[6].pop();\n    wireData.add(\"EWR\");\n    wireData.add(3);\n    wireData.add(ev[0]);\n    wireData.add(ev[3][1]);\n    wireData.add(ev[1]);\n  }\n  rootId = null;\n  if (frame[11] != null) {\n    rootId = frame[11][1];\n  }\n  if (frame[10] != rootId) {\n    wireData.add(\"RC\");\n    wireData.add(1);\n    wireData.add(rootId);\n    frame[10] = rootId;\n  }\n  return wireData;\n}\n\nfunction genFrameInternals(frame, ctx) {\n  return [ctx, frame, getNextId(\"f\", ctx), {}, {}, {}, [], {}, false, null, null, null, false, false, null];\n}\n\nfunction genPanelInternals(e) {\n  e[9] = true;\n  e[10] = [[], [], [], 0, 0, true, false];\n}\n\nfunction getNextId(prefix, ctx) {\n  ctx[0] += 1;\n  return prefix + (ctx[0] + '');\n}\n\nfunction getProp(e, k, d) {\n  output = null;\n  if (e[5].contains(k)) {\n    output = e[5][k];\n    if (output != null) {\n      return output;\n    }\n  }\n  if (e[6].contains(k)) {\n    output = e[6][k];\n    if (output != null) {\n      return output;\n    }\n  }\n  return d;\n}\n\nfunction newU3Context() {\n  return [0, [null]];\n}\n\nfunction panel_append(panel, children) {\n  frame = panel[4];\n  pd = panel[10];\n  i = 0;\n  while (i < children.length) {\n    child = children[i];\n    if (pd[6]) {\n      panel_doMultiChildCheck(panel);\n    }\n    check_can_add_element(child, \"Cannot append element\");\n    attachToFrame(child, frame);\n    pd[0].add(child);\n    if (!pd[5]) {\n      pd[1].add(child);\n    }\n    i += 1;\n  }\n  registerChildInvalidation(panel);\n}\n\nfunction panel_clearChildren(p) {\n  pd = p[10];\n  sz = pd[0].length;\n  if (sz > 0) {\n    pd[0] = [];\n    pd[1] = [];\n    pd[2] = [];\n    pd[3] = 0;\n    pd[4] = 0;\n    pd[5] = true;\n  }\n}\n\nfunction panel_doMultiChildCheck(p) {\n  if (p[10][6] && p[10][0].length > 0) {\n    throwErr(\"This panel type cannot support multiple children.\");\n  }\n}\n\nfunction panel_getChild(e, isFirst) {\n  children = e[10][0];\n  sz = children.length;\n  if (sz == 0) {\n    return null;\n  }\n  if (isFirst) {\n    return children[0];\n  }\n  return children[sz - 1];\n}\n\nfunction panel_getChildrenArray(e) {\n  return e[10][0];\n}\n\nfunction panel_indexOf(panel, child) {\n  if (child != null) {\n    targetId = child[1];\n    children = panel[10][0];\n    i = 0;\n    while (i < children.length) {\n      if (children[i][1] == targetId) {\n        return i;\n      }\n      i += 1;\n    }\n  }\n  return -1;\n}\n\nfunction panel_insert(panel, child, index) {\n  panelData = panel[10];\n  if (index == panelData[0].length) {\n    return panel_append(panel, quickWrap(child));\n  }\n  if (index == 0) {\n    return panel_prepend(panel, child);\n  }\n  check_can_add_element(child, \"Cannot insert element\");\n  attachToFrame(child, panel[4]);\n  if (panelData[6]) {\n    panel_doMultiChildCheck(panel);\n  }\n  panelData[0].insert(child, index);\n  panelData[5] = true;\n  registerChildInvalidation(panel);\n}\n\nfunction panel_markSingleContent(e) {\n  e[10][6] = true;\n}\n\nfunction panel_prepend(panel, child) {\n  panelData = panel[10];\n  if (panelData[0].length == 0) {\n    return panel_append(panel, quickWrap(child));\n  }\n  check_can_add_element(child, \"Cannot prepend element\");\n  attachToFrame(child, panel[4]);\n  if (panelData[6]) {\n    panel_doMultiChildCheck(panel);\n  }\n  panelData[0].insert(child, 0);\n  if (!panelData[5]) {\n    panelData[2].add(child);\n  }\n  registerChildInvalidation(panel);\n}\n\nfunction panel_removeFirst(panel) {\n  panelData = panel[10];\n  if (panelData[0].length == 0) {\n    panel_removeLast(panel);\n    return;\n  }\n  if (panelData[2].length > 0) {\n    panelData[2].pop();\n  } else {\n    panelData[4] += 1;\n  }\n  registerChildInvalidation(panel);\n}\n\nfunction panel_removeLast(panel) {\n  panelData = panel[10];\n  if (panelData[0].length == 0) {\n    throwErr(\"Cannot remove: panel has no children.\");\n  }\n  if (panelData[1].length > 0) {\n    panelData[1].pop();\n  } else {\n    panelData[3] += 1;\n  }\n  registerChildInvalidation(panel);\n}\n\nfunction panel_setContent(p, child) {\n  if (p[10][0].length > 0) {\n    panel_removeLast(p);\n  }\n  if (child == null) {\n    throwInvalidElement(\"Cannot set content\");\n  }\n  childrenArr = [];\n  childrenArr.add(child);\n  panel_append(p, childrenArr);\n}\n\nfunction quickWrap(e) {\n  a = [];\n  a.add(e);\n  return a;\n}\n\nfunction registerChildInvalidation(panel) {\n  frame = panel[4];\n  if (frame != null) {\n    frame[5][panel[1]] = panel;\n  }\n}\n\nfunction registerFrameEvent(frame, evHandler) {\n  frame[7][evHandler[0]] = evHandler;\n  frame[6].add(evHandler);\n  frame_doFlush(frame);\n}\n\nfunction setProp(e, k, v) {\n  e[5][k] = v;\n  if (e[4] != null) {\n    e[4][3][e[1]] = e;\n    if (!e[4][12]) {\n      frame_doFlush(e[4]);\n    }\n  }\n  return e[7];\n}\n\nfunction throwErr(msg) {\n  args = [null];\n  args[0] = msg;\n  PST_ExtCallbacks.ext[\"throwErr\"].invoke(args);\n}\n\nfunction throwInvalidElement(msg) {\n  throwErr(msg + \": The value is not a valid UI element.\");\n}\n\nfunction valueConvertForCanonicalWireValue(arg1, val) {\n  if (val == null) {\n    return null;\n  }\n  arg1[0] = val;\n  return PST_ExtCallbacks.ext[\"image_unwrapper\"].invoke(arg1);\n}\n\n\n// Everything in this file is specific to PlexiScript. All other files are\n// general purpose to CommonScript.\n\nfunction client_specific_frame_initializer(frame) {\n    frameLink = new FrameLink(frame);\n    frame_setSendDownstream(frame, frameLink.sendToRenderer);\n}\n\nclass FrameLink {\n    field frame;\n    constructor(frame) {\n        this.frame = frame;\n        frame_setIpcHandle(frame, $u3_frame_new());\n    }\n\n    function sendToRenderer(arr, len) {\n        $u3_client_to_renderer(frame_getIpcHandle(this.frame), arr, len);\n    }\n}\n";

            // %%%BUILTIN_FILES_END%%%


            return files;
        }
    }
}
