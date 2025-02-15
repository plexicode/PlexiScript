EXT.sleep = (task, args) => {
    let seconds = VALUE_CONVERTER.unwrapFloat(args[0]);
    CommonScript.task.sleepTask(task, Math.max(0, Math.floor(seconds * 1000 + 0.5)));
};
