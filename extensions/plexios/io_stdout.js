EXT.io_stdout = (task, args) => {
  let { procInfo } = unwrapAppContext(task);
  procInfo.stdout.writeln(VALUE_CONVERTER.toReadableString(args[0]));
};
