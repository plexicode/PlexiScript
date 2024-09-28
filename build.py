import json
import os
import shutil
import sys

VERSION = (0, 1, 0)
VERSION_DOTTED = '.'.join(map(str, VERSION))
VERSION_UNDERSCORE = VERSION_DOTTED.replace('.', '_')

PLEXI_HOME = os.environ.get('PLEXI_DEV_HOME', '')
if PLEXI_HOME == '': PLEXI_HOME = '..'

COMMON_SCRIPT_DIR = os.path.join(PLEXI_HOME, 'CommonScript')
PLEXI_SCRIPT_DIR = os.path.join(PLEXI_HOME, 'PlexiScript')
EXTENSIONS_DIR = os.path.join(PLEXI_SCRIPT_DIR, 'extensions')
TEMPLATES_DIR = os.path.join(PLEXI_SCRIPT_DIR, 'templates')

# TODO: If I can't think of attributes to put in here, I'll just do a set
TARGETS = {
  'jsweb': ('jsweb', ),
  'plexios': ('plexios',),
  'dotnet': ('dotnet',),
}

def main(args):
  if not os.path.isdir(PLEXI_HOME): return 'PLEXI_HOME environment variable is invalid'
  if not os.path.isdir(COMMON_SCRIPT_DIR): return 'CommonScript repo is not present in the PLEXI_HOME directory'
  if not os.path.isdir(PLEXI_SCRIPT_DIR): return 'PlexiScript repo does not have expected name in PLEXI_HOME directory'

  mode = (args + [''])[:1][0]
  if TARGETS.get(mode) == None:
    if mode == '':
      return "Incorrect usage. Must select a target: " + '|'.join(list(TARGETS.keys()))
    return 'Invalid target: ' + mode

  if mode == 'jsweb': return export_js(False)
  if mode == 'plexios': return export_js(True)
  if mode == 'dotnet': return export_dotnet()

  return "Mode not implemetned: " + mode

def get_extension_code(platform_name):
  EXT_DIR = os.path.join(EXTENSIONS_DIR, platform_name)
  output = []
  for file in os.listdir(EXT_DIR):
    ext_path = os.path.join(EXT_DIR, file)
    output.append(file_read_text(ext_path))
  return '\n'.join(output)

def get_extension_list():
  output = []
  ext_file_raw = file_read_text(os.path.join(EXTENSIONS_DIR, 'manifest.txt'))
  for line in ext_file_raw.split('\n'):
    ext_id = line.strip()
    if ext_id == '': continue
    output.append(ext_id)
  return output

def gather_builtin_libs_as_lookup():
  lookup = {}
  libs_dir = os.path.join(PLEXI_SCRIPT_DIR, 'libs')

  for lib_name in os.listdir(libs_dir):
    lib_dir = os.path.join(libs_dir, lib_name)
    files = {}
    for file in os.listdir(lib_dir):
      if file.endswith('.plx'):
        file_path = os.path.join(lib_dir, file)
        files[file] = file_read_text(file_path)
    lookup[lib_name] = files
  return lookup

def file_read_text(path):
  c = open(path.replace('/', os.sep), 'rt')
  t = c.read().replace('\r\n', '\n')
  c.close()
  return t

def file_write_text(path, content):
  c = open(path.replace('/', os.sep), 'wt', newline='\n')
  c.write(content)
  c.close()

def get_target_dir(name):
  target_dir = os.path.join(PLEXI_SCRIPT_DIR, 'dist', name + '-' + VERSION_DOTTED)
  os.makedirs(target_dir, exist_ok = True)
  return target_dir

def slice_by_marker(code, marker_start, marker_end):
  start_index = code.find(marker_start)
  end_index = code.find(marker_end)
  start = code.find('\n', start_index) + 1
  end = code.rfind('\n', 0, end_index)
  a = code[:start]
  b = code[end:]
  return (a, b)

def export_dotnet():
  lookup = gather_builtin_libs_as_lookup()
  file_inclusions_cs_path = os.path.join(PLEXI_SCRIPT_DIR, 'dotnetharness', 'PlexiScriptCompile', 'FileInclusions.cs')
  file_inclusions_code = file_read_text(file_inclusions_cs_path)
  a, b = slice_by_marker(file_inclusions_code, '%%%BUILTIN_MODULES_START%%%', '%%%BUILTIN_MODULES_END%%%')
  module_ids = list(lookup.keys())
  module_ids.sort()
  file_inclusions_code = a + (' ' * 16) + '"' + '", "'.join(module_ids) + '",' + b
  a, b = slice_by_marker(file_inclusions_code, '%%%BUILTIN_FILES_START%%%', '%%%BUILTIN_FILES_END%%%')
  parts = [a]
  for module_id in module_ids:
    for file in lookup[module_id].keys():
      module_code = lookup[module_id][file]

      parts.append(' ' * 12 + 'files["' + module_id + '"]["' + file + '"] = ' + json.dumps(module_code) + ';')
  parts.append(b)
  file_inclusions_code = '\n'.join(parts)
  file_write_text(file_inclusions_cs_path, file_inclusions_code)

  extension_list_cs_path = os.path.join(PLEXI_SCRIPT_DIR, 'dotnetharness', 'PlexiScriptCompile', 'ExtensionList.cs')
  extension_list_code = file_read_text(extension_list_cs_path)
  a, b = slice_by_marker(extension_list_code, '%%%EXTENSION_LIST_START%%%', '%%%EXTENSION_LIST_END%%%')
  parts = [a]
  for ext_id in get_extension_list():
    parts.append(' ' * 16 + json.dumps(ext_id) + ',')
  parts.append(b)
  extension_list_code = '\n'.join(parts)
  file_write_text(extension_list_cs_path, extension_list_code)

  extension_impl_cs_path = os.path.join(PLEXI_SCRIPT_DIR, 'dotnetharness', 'PlexiScriptRuntime', 'Extensions.cs')
  extension_impl_code = file_read_text(extension_impl_cs_path)
  a, b = slice_by_marker(extension_impl_code, '%%%EXTENSION_LOOKUP_START%%%', '%%%EXTENSION_LOOKUP_END%%%')
  ext_code = get_extension_code('dotnet')
  ext_code = '\n'.join(map(lambda t: ' ' * 12 + t, ext_code.split('\n')))
  parts = [a, ext_code, b]
  extension_impl_code = '\n'.join(parts)
  file_write_text(extension_impl_cs_path, extension_impl_code)

def export_js(is_plexios):
  platform_name = 'plexios' if is_plexios else 'jsweb'
  common_script_edition = {
    'jsweb': 'web',
    'plexios': 'plexios',
  }.get(platform_name)
  common_script_file = '_'.join([
    'CommonScriptRuntime',
    common_script_edition,
    VERSION_UNDERSCORE + '.js'
  ])
  common_script_path = os.path.join(COMMON_SCRIPT_DIR, 'dist', common_script_file)
  target_dir = get_target_dir(platform_name)
  shutil.copy(os.path.join(common_script_path), target_dir)

  template_file = platform_name + '_rt.js'
  template = file_read_text(os.path.join(TEMPLATES_DIR, 'runtime', template_file))
  code = (template
    ).replace('%%%VERSION_DOTTED%%%', VERSION_DOTTED
    ).replace('%%%VERSION_UNDERSCORE%%%', VERSION_UNDERSCORE
    ).replace('%%%EXTENSIONS%%%', '\n' + get_extension_code(platform_name))

  file_write_text(os.path.join(target_dir, 'PlexiScriptRuntime_' + platform_name + '_' + VERSION_UNDERSCORE + '.js'), code)

if __name__ == '__main__':
  msg = main(sys.argv[1:])
  if msg == None: msg = 'Done'
  print(msg)
