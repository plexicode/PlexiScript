(async () => {
  const CommonScript = (await PlexiOS.HtmlUtil.loadComponent('CommonScript_0_1_0'))();
  const newRuntime = (os) => {
    let engineBuilder = CommonScript.newEngineContextBuilder('PlexiScript', '0.1.0');
    const VALUE_CONVERTER = CommonScript.runtimeValueConverter;
    const OS = os;
    const { unwrapAppContext } = VALUE_CONVERTER;

    let EXT = {};
    // 
EXT.game_close_window = (task, args) => {
    let { procInfo } = unwrapAppContext(task);
    throw new Error('Not implemented: $game_close_window()');
};

EXT.game_pop_event_from_queue = (task, args) => {
    let winHandle = VALUE_CONVERTER.unwrapNativeHandle(args[0]);
    let hasAny = false;
    let outBuf = args[1];
    if (winHandle.evQueueOffset < winHandle.evQueue.length) {
        hasAny = true;
        let ev = winHandle.evQueue[winHandle.evQueueOffset++];
        switch (ev.type) {
            case 'key':
                VALUE_CONVERTER.listSet(outBuf, 0, VALUE_CONVERTER.wrapString(task, 'KEY', true));
                VALUE_CONVERTER.listSet(outBuf, 1, VALUE_CONVERTER.wrapBoolean(task, ev.isDown));
                VALUE_CONVERTER.listSet(outBuf, 2, VALUE_CONVERTER.wrapString(task, ev.key, true));
                break;
            default:
                throw new Error();
        }
    }

    return VALUE_CONVERTER.wrapBoolean(task, hasAny);
};

EXT.u3_client_to_renderer = (task, args) => {
  throw new Error('TODO');
};

EXT.dom_apply_props = (task, args) => {
    throw new Error();
};

EXT.dom_append_string = (task, args) => {
    let e = VALUE_CONVERTER.unwrapNativeHandle(args[0]);
    let str = VALUE_CONVERTER.toReadableString(args[1]);
    e.append(str);
};

EXT.u3_init = (task, args) => {
  throw new Error('TODO');
};


// TODO: support whether or not this window's show() invocation is blocking
EXT.dom_create_window = (task, args) => {
    let { procInfo } = unwrapAppContext(task);
    let getArg = i => VALUE_CONVERTER.listGet(args[0], i);

    let title = VALUE_CONVERTER.toReadableString(getArg(0));
    let width = VALUE_CONVERTER.unwrapInteger(getArg(1));
    let height = VALUE_CONVERTER.unwrapInteger(getArg(2));
    let onInit = getArg(3);
    let onShown = getArg(4);
    let onClosed = getArg(5);
    let onClosing = getArg(6);

    // More properties and handlers needed:
    // destroy process on close
    // onResize, onFocus, onMinimized, onMaximized
    // disable resize, isManaged, innerWidth/Height, x, y, icon, parent

    OS.Shell.showWindow(procInfo.pid, {
        title,
        width,
        height,
        destroyProcessUponClose: true,
        onInit: (contentHost, winData) => {
            let wrappedContentHost = VALUE_CONVERTER.wrapNativeHandle(contentHost);
            let wrappedHandle = VALUE_CONVERTER.wrapNativeHandle(winData);
            CommonScript.task.invokeFunction(task, onInit, [wrappedContentHost, wrappedHandle]);
        },
        onShown: () => {
            console.log("Window is now shown");
        },
        onClosing: () => {
            console.log("Closing");
        },
        onClosed: () => {
            console.log("TODO: resume task");
        },
    });

    CommonScript.task.suspendTask(task);
};

EXT.game_show_window = (task, args) => {
    let { procInfo } = unwrapAppContext(task);
    let handle = {
        isReady: false,
        evQueue: [],
        evQueueOffset: 0,
    };
    VALUE_CONVERTER.listAdd(args[3], VALUE_CONVERTER.wrapNativeHandle(handle));
    const WIDTH = VALUE_CONVERTER.unwrapInteger(args[1]);
    const HEIGHT = VALUE_CONVERTER.unwrapInteger(args[2]);
    let klu = { };
    ['Left', 'Right', 'Up', 'Down'].forEach(v => { klu['Arrow' + v] = v.toUpperCase(); });
    ['Space', 'Enter', 'Tab', 'Escape', 'Backspace', 'Period', 'Comma', 'Semicolon'].forEach(v => { klu[v] = v.toUpperCase(); });
    for (let i = 0; i <= 9; i++) klu['Digit' + i] = 'NUM' + i;
    for (let i = 0; i < 26; i++) {
        let c = String.fromCharCode('A'.charCodeAt(0) + i);
        klu['Key' + c] = c;
    }
    for (let i = 1; i <= 12; i++) klu['F' + i] = 'F' + i;
    klu.Minus = 'HYPHEN';
    klu.Equal = 'EQUALS';
    ['Left', 'Right'].forEach(dir => {
        ['Shift', 'Alt', 'Ctrl,Control', 'OSCMD,Meta'].forEach(mod => {
            let t = mod.split(',');
            let dstName = t[0];
            let srcName = t.pop();
            klu[srcName + dir] = (dstName + '_' + dir).toUpperCase();
        });
    });

    const KEY_LOOKUP = { ...klu };

    OS.Shell.showWindow(procInfo.pid, {
        title: VALUE_CONVERTER.toReadableString(args[0]),
        width: WIDTH,
        height: HEIGHT,
        destroyProcessUponClose: true,
        onInit: (contentHost, winData) => {
            handle.isReady = true;
            let canvas = document.createElement('canvas');
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            contentHost.append(canvas);
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.position = 'absolute';
            handle.canvas = canvas;
            let ctx = canvas.getContext('2d');
            handle.ctx = ctx;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
        },
        onKey: (ev, isDown) => {
            let key = KEY_LOOKUP[ev.code];
            if (!key) {
                console.error("UNKNOWN KEY CODE: " + ev.code);
            } else {
                handle.evQueue.push({ type: 'key', key, isDown, ev });
            }
        },
    });
};

EXT.u3_frame_new = (task, args) => {
  throw new Error('TODO');
};

EXT.io_stdout = (task, args) => {
  let { procInfo } = unwrapAppContext(task);
  procInfo.stdout.writeln(VALUE_CONVERTER.toReadableString(args[0]));
};

EXT.game_set_title = (task, args) => {
    let { procInfo } = unwrapAppContext(task);
    throw new Error('Not implemented: $game_set_title()');
};

EXT.dom_create_element = (task, args) => {
    throw new Error();
};


let gfxBuf = [];
EXT.game_flip = (task, args) => {
    let { procInfo } = unwrapAppContext(task);
    let handle = VALUE_CONVERTER.unwrapNativeHandle(args[0]);
    let bufSz = VALUE_CONVERTER.unwrapInteger(args[2]);
    let bufVal = args[1];
    let bufListImpl = bufVal[1];
    let bufRaw = bufListImpl[3];
    if (!Array.isArray(bufRaw)) throw new Error(); // This optimization no longer works
    if (gfxBuf.length) gfxBuf.pop();
    while (gfxBuf.length < bufSz) gfxBuf.push(0);
    // absolutely unsafe assumption go brrrrrrrr
    for (let i = 0; i < bufSz; i++) {
        gfxBuf[i] = bufRaw[i][1];
    }
    let x, y, width, height, r, g, b, a;
    for (let i = 0; i < bufSz; i += 16) {
        switch (gfxBuf[i]) {
            case 1: // rectangle
                x = gfxBuf[i | 1];
                y = gfxBuf[i | 2];
                width = gfxBuf[i | 3];
                height = gfxBuf[i | 4];
                r = gfxBuf[i | 5];
                g = gfxBuf[i | 6];
                b = gfxBuf[i | 7];
                a = gfxBuf[i | 8];
                handle.ctx.fillStyle = a === 255
                    ? ('rgb(' + r + ',' + g + ',' + b + ')')
                    : ('rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')');
                handle.ctx.fillRect(x, y, width, height);
                break;
            default:
                throw new Error(); // unhandled graphics draw command
        }
    }
};

EXT.dom_clear_children = (task, args) => {
    throw new Error();
};

EXT.sleep = (task, args) => {
    let seconds = VALUE_CONVERTER.unwrapFloat(args[0]);
    CommonScript.task.sleepTask(task, Math.max(0, Math.floor(seconds * 1000 + 0.5)));
};


    Object.keys(EXT).forEach(k => {
      engineBuilder.registerExtension(k, EXT[k]);
    });

    return engineBuilder.lockConfiguration();
  };
  PlexiOS.HtmlUtil.registerComponent('PlexiScript_0_1_0', newRuntime);
})();
