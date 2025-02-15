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

EXT.game_pop_event_from_queue = (task, args) => {
    let { procInfo } = unwrapAppContext(task);
    return VALUE_CONVERTER.wrapBoolean(task, false);
    /*let winHandle = VALUE_CONVERTER.unwrapNativeHandle(args[0]);
    let buffer = args[1];
    throw new Error('Not implemented: $game_pop_event_from_queue()');
    */
};

EXT.game_set_title = (task, args) => {
    let { procInfo } = unwrapAppContext(task);
    throw new Error('Not implemented: $game_set_title()');
};

EXT.game_show_window = (task, args) => {
    let { procInfo } = unwrapAppContext(task);
    let handle = {
        isReady: false,
    };
    VALUE_CONVERTER.listAdd(args[3], VALUE_CONVERTER.wrapNativeHandle(handle));
    const WIDTH = VALUE_CONVERTER.unwrapInteger(args[1]);
    const HEIGHT = VALUE_CONVERTER.unwrapInteger(args[2]);
    let evQueue = [];
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
            evQueue.push({ type: 'key', isDown, ev });
        }
    });
};

EXT.io_stdout = (task, args) => {
  let { procInfo } = unwrapAppContext(task);
  procInfo.stdout.writeln(VALUE_CONVERTER.toReadableString(args[0]));
};

EXT.sleep = (task, args) => {
    let seconds = VALUE_CONVERTER.unwrapFloat(args[0]);
    CommonScript.task.sleepTask(task, Math.max(0, Math.floor(seconds * 1000 + 0.5)));
};

EXT.u3_client_to_renderer = (task, args) => {
  throw new Error('TODO');
};

EXT.u3_frame_new = (task, args) => {
  throw new Error('TODO');
};

EXT.u3_init = (task, args) => {
  throw new Error('TODO');
};


    Object.keys(EXT).forEach(k => {
      engineBuilder.registerExtension(k, EXT[k]);
    });

    return engineBuilder.lockConfiguration();
  };
  PlexiOS.HtmlUtil.registerComponent('PlexiScript_0_1_0', newRuntime);
})();
