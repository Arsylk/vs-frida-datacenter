
var do_dlopen = null;
var call_ctor = null;

Process.findModuleByName(Process.pointerSize === 4 ? 'linker' : 'linker64').enumerateSymbols().forEach(function (sym) {
  if (sym.name.indexOf('do_dlopen') >= 0) {
    do_dlopen = sym.address;
  } else if (sym.name.indexOf('call_constructor') >= 0) {
    call_ctor = sym.address;
  }
});

Interceptor.attach(do_dlopen,{
  onEnter: function(args){
    var soName = args[0].readCString();
    var temp = soName.split("/").pop();
    this.libname = temp;
  }, 
  onLeave: function(retval){
    after_init_initarray(this.libname);
  }
});

function mkdir(path) {
    var mkdirPtr = Module.getExportByName('libc.so', 'mkdir');
    var mkdir = new NativeFunction(mkdirPtr, 'int', ['pointer', 'int']);



    var opendirPtr = Module.getExportByName('libc.so', 'opendir');
    var opendir = new NativeFunction(opendirPtr, 'pointer', ['pointer']);

    var closedirPtr = Module.getExportByName('libc.so', 'closedir');
    var closedir = new NativeFunction(closedirPtr, 'int', ['pointer']);

    var cPath = Memory.allocUtf8String(path);
    var dir = opendir(cPath);
    if (dir != 0) {
      closedir(dir);
      return 0;
    }
    mkdir(cPath, 755);
    chmod(path);
}
 
function get_self_process_name() {
  var openPtr = Module.getExportByName('libc.so', 'open');
  var open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);

  var readPtr = Module.getExportByName("libc.so", "read");
  var read = new NativeFunction(readPtr, "int", ["int", "pointer", "int"]);

  var closePtr = Module.getExportByName('libc.so', 'close');
  var close = new NativeFunction(closePtr, 'int', ['int']);

  var path = Memory.allocUtf8String("/proc/self/cmdline");
  var fd = open(path, 0);
  if (fd != -1) {
    var buffer = Memory.alloc(0x1000);

    var result = read(fd, buffer, 0x1000);
    close(fd);
    result = ptr(buffer).readCString();
    return result;
  }

  return "-1";
}

function chmod(path) {
  var chmodPtr = Module.getExportByName('libc.so', 'chmod');
  var chmod = new NativeFunction(chmodPtr, 'int', ['pointer', 'int']);
  var cPath = Memory.allocUtf8String(path);
  chmod(cPath, 755);
}

function create_all_dirs(base_path, file_path){
  var path = base_path;
  var dir_array = file_path.split("/");
  dir_array = dir_array.splice(0, dir_array.length-1);
  dir_array.forEach(dir => {
    path += "/"+dir
    mkdir(path);
  });
}

function dump_file(decompressed_ptr, file_size, file_path) {
  var process_name = get_self_process_name();
  var files_dir = "/data/data/" + process_name + "/files"
  mkdir(files_dir);
  var dex_dir_path = files_dir+"/dump_coco2dx_" + process_name;
  mkdir(dex_dir_path);
  Memory.protect(decompressed_ptr, file_size, 'rw');
  var buffer = decompressed_ptr.readCString(file_size);
  create_all_dirs(dex_dir_path, file_path);
  console.log(dex_dir_path+'/'+file_path);
  var file = new File(dex_dir_path+'/'+file_path,"w");
  file.write(buffer);
  file.close();
}

function after_init_initarray(libname) {
  var moduleBaseAddress = Module.findBaseAddress(libname);
  if(Module.findExportByName(libname,'Java_org_cocos2dx_lib_Cocos2dxJavascriptJavaBridge_evalString')) {
    var moduleBaseAddress = Module.findBaseAddress(libname);
    var ghidraBase = 0x100000;
    Interceptor.attach(moduleBaseAddress.add(0x0079b8d4), {
    onEnter: function ( args ) {
      if (args[4] && args[4].readCString())
        dump_file(args[1], args[2].toUInt32(), args[4].readCString());
    }
    });
    Interceptor.attach(moduleBaseAddress.add(0x0068fff0), {
    onEnter: function ( args ) {
      console.log('key -> ' + args[2].readCString(args[3].toUInt32()));
    } ,
    onLeave: function ( retval ) {
    }
    })
  }
}
