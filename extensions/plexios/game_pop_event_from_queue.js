EXT.game_pop_event_from_queue = (task, args) => {
    let { procInfo } = unwrapAppContext(task);
    return VALUE_CONVERTER.wrapBoolean(task, false);
    /*let winHandle = VALUE_CONVERTER.unwrapNativeHandle(args[0]);
    let buffer = args[1];
    throw new Error('Not implemented: $game_pop_event_from_queue()');
    */
};
