var path = require("path");
var fs = require("fs");
// const iconv = require("iconv-lite");
const { exec } = require("child_process");

class Param {
  constructor(config) {
    let raw_data = fs.readFileSync(config);
    let data = JSON.parse(raw_data);
    this.compiler = data.is_home + "\\System\\Compile.exe";
    this.rulfiles = data.project_home + "\\Script Files\\Setup.rul";
    this.libraries = '"isrt.obl" "ifx.obl"';
    this.linkpaths =
      '-LibPath"' +
      data.is_home +
      '\\Script\\Ifx\\Lib" -LibPath"' +
      data.is_home +
      '\\Script\\Isrt\\Lib"';
    this.includeifx = data.is_home + "\\Script\\Ifx\\Include";
    this.includeisrt = data.is_home + "\\Script\\Isrt\\Include";
    this.includescript = data.project_home + "\\Script Files";
    this.definitions = "";
    this.switches = "-w50 -e50 -v3 -g";
    this.builder = data.is_home + "\\System\\ISCmdBld.exe";
    this.installproject = data.project_home + "\\" + data.project_name;
    this.disk1 = data.project_home + "\\Media\\EIOSetup_SCH\\Disk Image\\Disk1";
  }

  print() {
    console.log(this.compiler);
    console.log(this.rulfiles);
    console.log(this.libraries);
    console.log(this.linkpaths);
    console.log(this.includeifx);
    console.log(this.includeisrt);
    console.log(this.includescript);
    console.log(this.definitions);
    console.log(this.switches);
    console.log(this.builder);
    console.log(this.installproject);
    console.log(this.disk1);
  }
}

function run_cmd(command) {
  exec(command, { encoding: "binary" }, (err, stdout, stderr) => {
    if (err) {
      console.log('"%s" failed', command);
      return;
    }

    // console.log(iconv.decode(stdout, "cp936"));
    console.log(stdout);
  });
}

function gen_config(config) {
  let default_config = {
    is_home: "C:\\Program Files (x86)\\InstallShield\\2018",
    project_home: "D:\\project",
    project_name: "Your Project Name.ism",
    winrar: "C:\\Program Files (x86)\\WinRAR\\WinRAR.exe",
    out: "out.exe",
  };
  let data = JSON.stringify(default_config, null, 4);
  fs.writeFileSync(config, data);
}

function get_param() {
  var config = path.join(
    path.dirname(__filename),
    path.basename(__filename, ".js") + ".json"
  );
  console.log(config);

  fs.access(config, fs.F_OK, (err) => {
    if (err) {
      console.log("%s no exists", config);
      gen_config(config);
    }
  });

  const param = new Param(config);
  // param.print();

  return param;
}

function compile(param) {
  let command =
    '"' +
    param.compiler +
    '" "' +
    param.rulfiles +
    '" ' +
    param.libraries +
    " " +
    param.linkpaths +
    ' -I"' +
    param.includeifx +
    '" -I"' +
    param.includeisrt +
    '" -I"' +
    param.includescript +
    '" ' +
    param.definitions +
    " " +
    param.switches;
  console.log(command);
  run_cmd(command);
}

function main() {
  let param = get_param();
  compile(param);
}

main();
