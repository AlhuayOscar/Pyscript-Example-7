"use strict";
var loadPyodide = (() => {
  var ce = Object.create;
  var _ = Object.defineProperty;
  var le = Object.getOwnPropertyDescriptor;
  var de = Object.getOwnPropertyNames;
  var fe = Object.getPrototypeOf,
    ue = Object.prototype.hasOwnProperty;
  var f = (t, e) => _(t, "name", { value: e, configurable: !0 }),
    g = ((t) =>
      typeof require < "u"
        ? require
        : typeof Proxy < "u"
        ? new Proxy(t, {
            get: (e, c) => (typeof require < "u" ? require : e)[c],
          })
        : t)(function (t) {
      if (typeof require < "u") return require.apply(this, arguments);
      throw new Error('Dynamic require of "' + t + '" is not supported');
    });
  var $ = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports),
    pe = (t, e) => {
      for (var c in e) _(t, c, { get: e[c], enumerable: !0 });
    },
    M = (t, e, c, o) => {
      if ((e && typeof e == "object") || typeof e == "function")
        for (let a of de(e))
          !ue.call(t, a) &&
            a !== c &&
            _(t, a, {
              get: () => e[a],
              enumerable: !(o = le(e, a)) || o.enumerable,
            });
      return t;
    };
  var h = (t, e, c) => (
      (c = t != null ? ce(fe(t)) : {}),
      M(
        e || !t || !t.__esModule
          ? _(c, "default", { value: t, enumerable: !0 })
          : c,
        t
      )
    ),
    me = (t) => M(_({}, "__esModule", { value: !0 }), t);
  var j = $((P, C) => {
    (function (t, e) {
      "use strict";
      typeof define == "function" && define.amd
        ? define("stackframe", [], e)
        : typeof P == "object"
        ? (C.exports = e())
        : (t.StackFrame = e());
    })(P, function () {
      "use strict";
      function t(d) {
        return !isNaN(parseFloat(d)) && isFinite(d);
      }
      f(t, "_isNumber");
      function e(d) {
        return d.charAt(0).toUpperCase() + d.substring(1);
      }
      f(e, "_capitalize");
      function c(d) {
        return function () {
          return this[d];
        };
      }
      f(c, "_getter");
      var o = ["isConstructor", "isEval", "isNative", "isToplevel"],
        a = ["columnNumber", "lineNumber"],
        r = ["fileName", "functionName", "source"],
        n = ["args"],
        u = ["evalOrigin"],
        i = o.concat(a, r, n, u);
      function s(d) {
        if (d)
          for (var y = 0; y < i.length; y++)
            d[i[y]] !== void 0 && this["set" + e(i[y])](d[i[y]]);
      }
      f(s, "StackFrame"),
        (s.prototype = {
          getArgs: function () {
            return this.args;
          },
          setArgs: function (d) {
            if (Object.prototype.toString.call(d) !== "[object Array]")
              throw new TypeError("Args must be an Array");
            this.args = d;
          },
          getEvalOrigin: function () {
            return this.evalOrigin;
          },
          setEvalOrigin: function (d) {
            if (d instanceof s) this.evalOrigin = d;
            else if (d instanceof Object) this.evalOrigin = new s(d);
            else
              throw new TypeError(
                "Eval Origin must be an Object or StackFrame"
              );
          },
          toString: function () {
            var d = this.getFileName() || "",
              y = this.getLineNumber() || "",
              w = this.getColumnNumber() || "",
              E = this.getFunctionName() || "";
            return this.getIsEval()
              ? d
                ? "[eval] (" + d + ":" + y + ":" + w + ")"
                : "[eval]:" + y + ":" + w
              : E
              ? E + " (" + d + ":" + y + ":" + w + ")"
              : d + ":" + y + ":" + w;
          },
        }),
        (s.fromString = f(function (y) {
          var w = y.indexOf("("),
            E = y.lastIndexOf(")"),
            ne = y.substring(0, w),
            ie = y.substring(w + 1, E).split(","),
            U = y.substring(E + 1);
          if (U.indexOf("@") === 0)
            var R = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(U, ""),
              oe = R[1],
              ae = R[2],
              se = R[3];
          return new s({
            functionName: ne,
            args: ie || void 0,
            fileName: oe,
            lineNumber: ae || void 0,
            columnNumber: se || void 0,
          });
        }, "StackFrame$$fromString"));
      for (var l = 0; l < o.length; l++)
        (s.prototype["get" + e(o[l])] = c(o[l])),
          (s.prototype["set" + e(o[l])] = (function (d) {
            return function (y) {
              this[d] = !!y;
            };
          })(o[l]));
      for (var m = 0; m < a.length; m++)
        (s.prototype["get" + e(a[m])] = c(a[m])),
          (s.prototype["set" + e(a[m])] = (function (d) {
            return function (y) {
              if (!t(y)) throw new TypeError(d + " must be a Number");
              this[d] = Number(y);
            };
          })(a[m]));
      for (var p = 0; p < r.length; p++)
        (s.prototype["get" + e(r[p])] = c(r[p])),
          (s.prototype["set" + e(r[p])] = (function (d) {
            return function (y) {
              this[d] = String(y);
            };
          })(r[p]));
      return s;
    });
  });
  var W = $((x, B) => {
    (function (t, e) {
      "use strict";
      typeof define == "function" && define.amd
        ? define("error-stack-parser", ["stackframe"], e)
        : typeof x == "object"
        ? (B.exports = e(j()))
        : (t.ErrorStackParser = e(t.StackFrame));
    })(
      x,
      f(function (e) {
        "use strict";
        var c = /(^|@)\S+:\d+/,
          o = /^\s*at .*(\S+:\d+|\(native\))/m,
          a = /^(eval@)?(\[native code])?$/;
        return {
          parse: f(function (n) {
            if (typeof n.stacktrace < "u" || typeof n["opera#sourceloc"] < "u")
              return this.parseOpera(n);
            if (n.stack && n.stack.match(o)) return this.parseV8OrIE(n);
            if (n.stack) return this.parseFFOrSafari(n);
            throw new Error("Cannot parse given Error object");
          }, "ErrorStackParser$$parse"),
          extractLocation: f(function (n) {
            if (n.indexOf(":") === -1) return [n];
            var u = /(.+?)(?::(\d+))?(?::(\d+))?$/,
              i = u.exec(n.replace(/[()]/g, ""));
            return [i[1], i[2] || void 0, i[3] || void 0];
          }, "ErrorStackParser$$extractLocation"),
          parseV8OrIE: f(function (n) {
            var u = n.stack
              .split(
                `
`
              )
              .filter(function (i) {
                return !!i.match(o);
              }, this);
            return u.map(function (i) {
              i.indexOf("(eval ") > -1 &&
                (i = i
                  .replace(/eval code/g, "eval")
                  .replace(/(\(eval at [^()]*)|(,.*$)/g, ""));
              var s = i
                  .replace(/^\s+/, "")
                  .replace(/\(eval code/g, "(")
                  .replace(/^.*?\s+/, ""),
                l = s.match(/ (\(.+\)$)/);
              s = l ? s.replace(l[0], "") : s;
              var m = this.extractLocation(l ? l[1] : s),
                p = (l && s) || void 0,
                d = ["eval", "<anonymous>"].indexOf(m[0]) > -1 ? void 0 : m[0];
              return new e({
                functionName: p,
                fileName: d,
                lineNumber: m[1],
                columnNumber: m[2],
                source: i,
              });
            }, this);
          }, "ErrorStackParser$$parseV8OrIE"),
          parseFFOrSafari: f(function (n) {
            var u = n.stack
              .split(
                `
`
              )
              .filter(function (i) {
                return !i.match(a);
              }, this);
            return u.map(function (i) {
              if (
                (i.indexOf(" > eval") > -1 &&
                  (i = i.replace(
                    / line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,
                    ":$1"
                  )),
                i.indexOf("@") === -1 && i.indexOf(":") === -1)
              )
                return new e({ functionName: i });
              var s = /((.*".+"[^@]*)?[^@]*)(?:@)/,
                l = i.match(s),
                m = l && l[1] ? l[1] : void 0,
                p = this.extractLocation(i.replace(s, ""));
              return new e({
                functionName: m,
                fileName: p[0],
                lineNumber: p[1],
                columnNumber: p[2],
                source: i,
              });
            }, this);
          }, "ErrorStackParser$$parseFFOrSafari"),
          parseOpera: f(function (n) {
            return !n.stacktrace ||
              (n.message.indexOf(`
`) > -1 &&
                n.message.split(`
`).length >
                  n.stacktrace.split(`
`).length)
              ? this.parseOpera9(n)
              : n.stack
              ? this.parseOpera11(n)
              : this.parseOpera10(n);
          }, "ErrorStackParser$$parseOpera"),
          parseOpera9: f(function (n) {
            for (
              var u = /Line (\d+).*script (?:in )?(\S+)/i,
                i = n.message.split(`
`),
                s = [],
                l = 2,
                m = i.length;
              l < m;
              l += 2
            ) {
              var p = u.exec(i[l]);
              p &&
                s.push(
                  new e({ fileName: p[2], lineNumber: p[1], source: i[l] })
                );
            }
            return s;
          }, "ErrorStackParser$$parseOpera9"),
          parseOpera10: f(function (n) {
            for (
              var u =
                  /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,
                i = n.stacktrace.split(`
`),
                s = [],
                l = 0,
                m = i.length;
              l < m;
              l += 2
            ) {
              var p = u.exec(i[l]);
              p &&
                s.push(
                  new e({
                    functionName: p[3] || void 0,
                    fileName: p[2],
                    lineNumber: p[1],
                    source: i[l],
                  })
                );
            }
            return s;
          }, "ErrorStackParser$$parseOpera10"),
          parseOpera11: f(function (n) {
            var u = n.stack
              .split(
                `
`
              )
              .filter(function (i) {
                return !!i.match(c) && !i.match(/^Error created at/);
              }, this);
            return u.map(function (i) {
              var s = i.split("@"),
                l = this.extractLocation(s.pop()),
                m = s.shift() || "",
                p =
                  m
                    .replace(/<anonymous function(: (\w+))?>/, "$2")
                    .replace(/\([^)]*\)/g, "") || void 0,
                d;
              m.match(/\(([^)]*)\)/) &&
                (d = m.replace(/^[^(]+\(([^)]*)\)$/, "$1"));
              var y =
                d === void 0 || d === "[arguments not available]"
                  ? void 0
                  : d.split(",");
              return new e({
                functionName: p,
                args: y,
                fileName: l[0],
                lineNumber: l[1],
                columnNumber: l[2],
                source: i,
              });
            }, this);
          }, "ErrorStackParser$$parseOpera11"),
        };
      }, "ErrorStackParser")
    );
  });
  var Re = {};
  pe(Re, { loadPyodide: () => T, version: () => b });
  var G = h(W());
  var v =
      typeof process == "object" &&
      typeof process.versions == "object" &&
      typeof process.versions.node == "string" &&
      typeof process.browser > "u",
    F =
      v &&
      typeof module < "u" &&
      typeof module.exports < "u" &&
      typeof g < "u" &&
      typeof __dirname < "u",
    H = v && !F,
    ye = typeof Deno < "u",
    z = !v && !ye,
    q =
      z &&
      typeof window < "u" &&
      typeof document < "u" &&
      typeof document.createElement < "u" &&
      typeof sessionStorage < "u",
    V = z && typeof importScripts < "u" && typeof self < "u";
  var K,
    k,
    L,
    X,
    D,
    ge = `"fetch" is not defined, maybe you're using node < 18? From Pyodide >= 0.25.0, node >= 18 is required. Older versions of Node.js may work, but it is not guaranteed or supported. Falling back to "node-fetch".`;
  async function A() {
    if (
      !v ||
      ((K = (await import(/* webpackIgnore */ "url")).default),
      (D = await import(/* webpackIgnore */ "fs/promises")),
      globalThis.fetch
        ? (k = fetch)
        : (console.warn(ge),
          (k = (await import(/* webpackIgnore */ "node-fetch")).default)),
      (X = (await import(/* webpackIgnore */ "vm")).default),
      (L = await import(/* webpackIgnore */ "path")),
      (I = L.sep),
      typeof g < "u")
    )
      return;
    let t = await import(/* webpackIgnore */ "fs"),
      e = await import(/* webpackIgnore */ "crypto"),
      c = await import(/* webpackIgnore */ "ws"),
      o = await import(/* webpackIgnore */ "child_process"),
      a = { fs: t, crypto: e, ws: c, child_process: o };
    globalThis.require = function (r) {
      return a[r];
    };
  }
  f(A, "initNodeModules");
  function he(t, e) {
    return L.resolve(e || ".", t);
  }
  f(he, "node_resolvePath");
  function ve(t, e) {
    return e === void 0 && (e = location), new URL(t, e).toString();
  }
  f(ve, "browser_resolvePath");
  var N;
  v ? (N = he) : (N = ve);
  var I;
  v || (I = "/");
  function we(t, e) {
    return (
      t.startsWith("file://") && (t = t.slice(7)),
      t.includes("://")
        ? { response: k(t) }
        : {
            binary: D.readFile(t).then(
              (c) => new Uint8Array(c.buffer, c.byteOffset, c.byteLength)
            ),
          }
    );
  }
  f(we, "node_getBinaryResponse");
  function be(t, e) {
    let c = new URL(t, location);
    return { response: fetch(c, e ? { integrity: e } : {}) };
  }
  f(be, "browser_getBinaryResponse");
  var O;
  v ? (O = we) : (O = be);
  async function J(t, e) {
    let { response: c, binary: o } = O(t, e);
    if (o) return o;
    let a = await c;
    if (!a.ok) throw new Error(`Failed to load '${t}': request failed.`);
    return new Uint8Array(await a.arrayBuffer());
  }
  f(J, "loadBinaryFile");
  var S;
  if (q) S = f(async (t) => await import(/* webpackIgnore */ t), "loadScript");
  else if (V)
    S = f(async (t) => {
      try {
        globalThis.importScripts(t);
      } catch (e) {
        if (e instanceof TypeError) await import(/* webpackIgnore */ t);
        else throw e;
      }
    }, "loadScript");
  else if (v) S = Ee;
  else throw new Error("Cannot determine runtime environment");
  async function Ee(t) {
    t.startsWith("file://") && (t = t.slice(7)),
      t.includes("://")
        ? X.runInThisContext(await (await k(t)).text())
        : await import(/* webpackIgnore */ K.pathToFileURL(t).href);
  }
  f(Ee, "nodeLoadScript");
  async function Y(t) {
    if (v) {
      await A();
      let e = await D.readFile(t);
      return JSON.parse(e);
    } else return await (await fetch(t)).json();
  }
  f(Y, "loadLockFile");
  async function Q() {
    if (F) return __dirname;
    let t;
    try {
      throw new Error();
    } catch (o) {
      t = o;
    }
    let e = G.default.parse(t)[0].fileName;
    if (H) {
      let o = await import(/* webpackIgnore */ "path");
      return (await import(/* webpackIgnore */ "url")).fileURLToPath(
        o.dirname(e)
      );
    }
    let c = e.lastIndexOf(I);
    if (c === -1)
      throw new Error(
        "Could not extract indexURL path from pyodide module location"
      );
    return e.slice(0, c);
  }
  f(Q, "calculateDirname");
  function Z(t) {
    let e = t.FS,
      c = t.FS.filesystems.MEMFS,
      o = t.PATH,
      a = {
        DIR_MODE: 16895,
        FILE_MODE: 33279,
        mount: function (r) {
          if (!r.opts.fileSystemHandle)
            throw new Error("opts.fileSystemHandle is required");
          return c.mount.apply(null, arguments);
        },
        syncfs: async (r, n, u) => {
          try {
            let i = a.getLocalSet(r),
              s = await a.getRemoteSet(r),
              l = n ? s : i,
              m = n ? i : s;
            await a.reconcile(r, l, m), u(null);
          } catch (i) {
            u(i);
          }
        },
        getLocalSet: (r) => {
          let n = Object.create(null);
          function u(l) {
            return l !== "." && l !== "..";
          }
          f(u, "isRealDir");
          function i(l) {
            return (m) => o.join2(l, m);
          }
          f(i, "toAbsolute");
          let s = e.readdir(r.mountpoint).filter(u).map(i(r.mountpoint));
          for (; s.length; ) {
            let l = s.pop(),
              m = e.stat(l);
            e.isDir(m.mode) &&
              s.push.apply(s, e.readdir(l).filter(u).map(i(l))),
              (n[l] = { timestamp: m.mtime, mode: m.mode });
          }
          return { type: "local", entries: n };
        },
        getRemoteSet: async (r) => {
          let n = Object.create(null),
            u = await _e(r.opts.fileSystemHandle);
          for (let [i, s] of u)
            i !== "." &&
              (n[o.join2(r.mountpoint, i)] = {
                timestamp:
                  s.kind === "file"
                    ? (await s.getFile()).lastModifiedDate
                    : new Date(),
                mode: s.kind === "file" ? a.FILE_MODE : a.DIR_MODE,
              });
          return { type: "remote", entries: n, handles: u };
        },
        loadLocalEntry: (r) => {
          let u = e.lookupPath(r).node,
            i = e.stat(r);
          if (e.isDir(i.mode)) return { timestamp: i.mtime, mode: i.mode };
          if (e.isFile(i.mode))
            return (
              (u.contents = c.getFileDataAsTypedArray(u)),
              { timestamp: i.mtime, mode: i.mode, contents: u.contents }
            );
          throw new Error("node type not supported");
        },
        storeLocalEntry: (r, n) => {
          if (e.isDir(n.mode)) e.mkdirTree(r, n.mode);
          else if (e.isFile(n.mode)) e.writeFile(r, n.contents, { canOwn: !0 });
          else throw new Error("node type not supported");
          e.chmod(r, n.mode), e.utime(r, n.timestamp, n.timestamp);
        },
        removeLocalEntry: (r) => {
          var n = e.stat(r);
          e.isDir(n.mode) ? e.rmdir(r) : e.isFile(n.mode) && e.unlink(r);
        },
        loadRemoteEntry: async (r) => {
          if (r.kind === "file") {
            let n = await r.getFile();
            return {
              contents: new Uint8Array(await n.arrayBuffer()),
              mode: a.FILE_MODE,
              timestamp: n.lastModifiedDate,
            };
          } else {
            if (r.kind === "directory")
              return { mode: a.DIR_MODE, timestamp: new Date() };
            throw new Error("unknown kind: " + r.kind);
          }
        },
        storeRemoteEntry: async (r, n, u) => {
          let i = r.get(o.dirname(n)),
            s = e.isFile(u.mode)
              ? await i.getFileHandle(o.basename(n), { create: !0 })
              : await i.getDirectoryHandle(o.basename(n), { create: !0 });
          if (s.kind === "file") {
            let l = await s.createWritable();
            await l.write(u.contents), await l.close();
          }
          r.set(n, s);
        },
        removeRemoteEntry: async (r, n) => {
          await r.get(o.dirname(n)).removeEntry(o.basename(n)), r.delete(n);
        },
        reconcile: async (r, n, u) => {
          let i = 0,
            s = [];
          Object.keys(n.entries).forEach(function (p) {
            let d = n.entries[p],
              y = u.entries[p];
            (!y ||
              (e.isFile(d.mode) &&
                d.timestamp.getTime() > y.timestamp.getTime())) &&
              (s.push(p), i++);
          }),
            s.sort();
          let l = [];
          if (
            (Object.keys(u.entries).forEach(function (p) {
              n.entries[p] || (l.push(p), i++);
            }),
            l.sort().reverse(),
            !i)
          )
            return;
          let m = n.type === "remote" ? n.handles : u.handles;
          for (let p of s) {
            let d = o.normalize(p.replace(r.mountpoint, "/")).substring(1);
            if (u.type === "local") {
              let y = m.get(d),
                w = await a.loadRemoteEntry(y);
              a.storeLocalEntry(p, w);
            } else {
              let y = a.loadLocalEntry(p);
              await a.storeRemoteEntry(m, d, y);
            }
          }
          for (let p of l)
            if (u.type === "local") a.removeLocalEntry(p);
            else {
              let d = o.normalize(p.replace(r.mountpoint, "/")).substring(1);
              await a.removeRemoteEntry(m, d);
            }
        },
      };
    t.FS.filesystems.NATIVEFS_ASYNC = a;
  }
  f(Z, "initializeNativeFS");
  var _e = f(async (t) => {
    let e = [];
    async function c(a) {
      for await (let r of a.values())
        e.push(r), r.kind === "directory" && (await c(r));
    }
    f(c, "collect"), await c(t);
    let o = new Map();
    o.set(".", t);
    for (let a of e) {
      let r = (await t.resolve(a)).join("/");
      o.set(r, a);
    }
    return o;
  }, "getFsHandles");
  function ee() {
    let t = {};
    return (
      (t.noImageDecoding = !0),
      (t.noAudioDecoding = !0),
      (t.noWasmDecoding = !1),
      (t.preRun = []),
      (t.quit = (e, c) => {
        throw ((t.exited = { status: e, toThrow: c }), c);
      }),
      t
    );
  }
  f(ee, "createModule");
  function Se(t, e) {
    t.preRun.push(function () {
      let c = "/";
      try {
        t.FS.mkdirTree(e);
      } catch (o) {
        console.error(`Error occurred while making a home directory '${e}':`),
          console.error(o),
          console.error(`Using '${c}' for a home directory instead`),
          (e = c);
      }
      t.FS.chdir(e);
    });
  }
  f(Se, "createHomeDirectory");
  function Oe(t, e) {
    t.preRun.push(function () {
      Object.assign(t.ENV, e);
    });
  }
  f(Oe, "setEnvironment");
  function ke(t, e) {
    t.preRun.push(() => {
      for (let c of e)
        t.FS.mkdirTree(c), t.FS.mount(t.FS.filesystems.NODEFS, { root: c }, c);
    });
  }
  f(ke, "mountLocalDirectories");
  function Ne(t, e) {
    let c = J(e);
    t.preRun.push(() => {
      let o = t._py_version_major(),
        a = t._py_version_minor();
      t.FS.mkdirTree("/lib"),
        t.FS.mkdirTree(`/lib/python${o}.${a}/site-packages`),
        t.addRunDependency("install-stdlib"),
        c
          .then((r) => {
            t.FS.writeFile(`/lib/python${o}${a}.zip`, r);
          })
          .catch((r) => {
            console.error(
              "Error occurred while installing the standard library:"
            ),
              console.error(r);
          })
          .finally(() => {
            t.removeRunDependency("install-stdlib");
          });
    });
  }
  f(Ne, "installStdlib");
  function te(t, e) {
    let c;
    e.stdLibURL != null
      ? (c = e.stdLibURL)
      : (c = e.indexURL + "python_stdlib.zip"),
      Ne(t, c),
      Se(t, e.env.HOME),
      Oe(t, e.env),
      ke(t, e._node_mounts),
      t.preRun.push(() => Z(t));
  }
  f(te, "initializeFileSystem");
  function re(t, e) {
    let { binary: c, response: o } = O(e + "pyodide.asm.wasm");
    t.instantiateWasm = function (a, r) {
      return (
        (async function () {
          try {
            let n;
            o
              ? (n = await WebAssembly.instantiateStreaming(o, a))
              : (n = await WebAssembly.instantiate(await c, a));
            let { instance: u, module: i } = n;
            typeof WasmOffsetConverter < "u" &&
              (wasmOffsetConverter = new WasmOffsetConverter(wasmBinary, i)),
              r(u, i);
          } catch (n) {
            console.warn("wasm instantiation failed!"), console.warn(n);
          }
        })(),
        {}
      );
    };
  }
  f(re, "preloadWasm");
  var b = "0.25.1";
  async function T(t = {}) {
    await A();
    let e = t.indexURL || (await Q());
    (e = N(e)), e.endsWith("/") || (e += "/"), (t.indexURL = e);
    let c = {
        fullStdLib: !1,
        jsglobals: globalThis,
        stdin: globalThis.prompt ? globalThis.prompt : void 0,
        lockFileURL: e + "pyodide-lock.json",
        args: [],
        _node_mounts: [],
        env: {},
        packageCacheDir: e,
        packages: [],
      },
      o = Object.assign(c, t);
    o.env.HOME || (o.env.HOME = "/home/pyodide");
    let a = ee();
    (a.print = o.stdout), (a.printErr = o.stderr), (a.arguments = o.args);
    let r = { config: o };
    (a.API = r), (r.lockFilePromise = Y(o.lockFileURL)), re(a, e), te(a, o);
    let n = new Promise((s) => (a.postRun = s));
    if (
      ((a.locateFile = (s) => o.indexURL + s),
      typeof _createPyodideModule != "function")
    ) {
      let s = `${o.indexURL}pyodide.asm.js`;
      await S(s);
    }
    if ((await _createPyodideModule(a), await n, a.exited))
      throw a.exited.toThrow;
    if (
      (t.pyproxyToStringRepr && r.setPyProxyToStringMethod(!0), r.version !== b)
    )
      throw new Error(
        `Pyodide version does not match: '${b}' <==> '${r.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`
      );
    a.locateFile = (s) => {
      throw new Error("Didn't expect to load any more file_packager files!");
    };
    let u = r.finalizeBootstrap();
    if (
      (u.version.includes("dev") ||
        r.setCdnUrl(`https://cdn.jsdelivr.net/pyodide/v${u.version}/full/`),
      await r.packageIndexReady,
      r._pyodide._importhook.register_module_not_found_hook(
        r._import_name_to_package_name,
        r.lockfile_unvendored_stdlibs_and_test
      ),
      r.lockfile_info.version !== b)
    )
      throw new Error("Lock file version doesn't match Pyodide version");
    return (
      r.package_loader.init_loaded_packages(),
      o.fullStdLib && (await u.loadPackage(r.lockfile_unvendored_stdlibs)),
      r.initializeStreams(o.stdin, o.stdout, o.stderr),
      u
    );
  }
  f(T, "loadPyodide");
  globalThis.loadPyodide = T;
  return me(Re);
})();
try {
  Object.assign(exports, loadPyodide);
} catch (_) {}
globalThis.loadPyodide = loadPyodide.loadPyodide;
//# sourceMappingURL=pyodide.js.map
