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
