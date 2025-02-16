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
