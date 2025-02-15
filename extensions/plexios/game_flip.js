
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
