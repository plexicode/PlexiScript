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
