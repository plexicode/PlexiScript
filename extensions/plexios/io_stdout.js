EXT.io_stdout = (task, args) => {
  let { procinfo } = getAppCtx(task);
  procinfo.stdout.writeln(VALUE_CONVERTER.toReadableString(args[0]));
};
