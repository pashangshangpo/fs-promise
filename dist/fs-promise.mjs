import Fs from 'fs';
import Path from 'path';
import Os from 'os';

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

// Asynchronously iterate through an object's values
// Uses for...of if the runtime supports it, otherwise iterates until length on a copy
function _forOf(target, body, check) {
	if (typeof target[_iteratorSymbol] === "function") {
		var iterator = target[_iteratorSymbol](), step, pact, reject;
		function _cycle(result) {
			try {
				while (!(step = iterator.next()).done && (!check || !check())) {
					result = body(step.value);
					if (result && result.then) {
						if (_isSettledPact(result)) {
							result = result.v;
						} else {
							result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
							return;
						}
					}
				}
				if (pact) {
					_settle(pact, 1, result);
				} else {
					pact = result;
				}
			} catch (e) {
				_settle(pact || (pact = new _Pact()), 2, e);
			}
		}
		_cycle();
		if (iterator.return) {
			var _fixup = function(value) {
				try {
					if (!step.done) {
						iterator.return();
					}
				} catch(e) {
				}
				return value;
			};
			if (pact && pact.then) {
				return pact.then(_fixup, function(e) {
					throw _fixup(e);
				});
			}
			_fixup();
		}
		return pact;
	}
	// No support for Symbol.iterator
	if (!("length" in target)) {
		throw new TypeError("Object is not iterable");
	}
	// Handle live collections properly
	var values = [];
	for (var i = 0; i < target.length; i++) {
		values.push(target[i]);
	}
	return _forTo(values, function(i) { return body(values[i]); }, check);
}

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

/**
 * 初始化目录
 * @param {String} path 目录路径
 */

var initDir = function (path) {
  try {
    var splitLine = Os.platform() === 'win32' ? '\\' : '/';
    var paths = path.split(splitLine);
    paths.pop();
    var dir = paths.join(splitLine);

    var _temp2 = function () {
      if (dir) {
        return Promise.resolve(exists(dir)).then(function (isExists) {
          var _temp = function () {
            if (!isExists) {
              return Promise.resolve(mkdir(dir)).then(function () {});
            }
          }();

          if (_temp && _temp.then) { return _temp.then(function () {}); }
        });
      }
    }();

    return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 判断文件路径是否存在
 * @param {String} path 文件路径
 */


var exists = function (path) {
  return new Promise(function (resolve) {
    Fs.access(path, Fs.constants.F_OK, function (err) {
      resolve(err ? false : true);
    });
  });
};
/**
 * 判断是否是文件目录
 * @param {String} path 文件路径
 */


var isDir = function (path) {
  return new Promise(function (resolve) {
    Fs.stat(path, function (err, stats) {
      resolve(err ? false : stats.isDirectory());
    });
  });
};
/**
 * 写入文件
 * @param {String} path 文件路径
 * @param {String|Buffer} content 内容
 */


var writeFile = function (path, content) {
  try {
    return Promise.resolve(initDir(path)).then(function () {
      return new Promise(function (resolve) {
        Fs.writeFile(path, content, function (err) {
          resolve(err ? false : true);
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 写入JSON数据到文件
 * @param {String} path 文件路径
 * @param {Object} json JSON数据
 */


var writeJson = function (path, json) {
  try {
    return Promise.resolve(initDir(path)).then(function () {
      return new Promise(function (resolve) {
        Fs.writeFile(path, JSON.stringify(json), function (err) {
          resolve(err ? false : true);
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 读取文件目录
 * @param {String} path 文件路径
 */


var readdir = function (path) {
  return new Promise(function (resolve) {
    Fs.readdir(path, function (err, files) {
      resolve(files || []);
    });
  });
};
/**
 * 递归读取目录下符合条件的所有文件
 * @param {String} dir 目录路径
 * @param {Function} filter 过滤文件函数
 */


var readFilePaths = function (dir, filter) {
  try {
    return Promise.resolve(readdir(dir)).then(function (files) {
      var paths = [];

      var _temp6 = _forOf(files, function (file) {
        var filePath = Path.join(dir, file);
        return Promise.resolve(isDir(filePath)).then(function (_isDir) {
          function _temp5() {
            var _push = paths.push;
            return Promise.resolve(readFilePaths(filePath, filter)).then(function (_readFilePaths) {
              _push.call.apply(_push, [ paths ].concat( _readFilePaths ));
            });
          }

          var _temp4 = function () {
            if (!_isDir) {
              function _temp3(_filter) {
                if (filter && _filter === false) {
                  return;
                }

                paths.push(filePath);
              }

              return filter ? Promise.resolve(filter(filePath)).then(_temp3) : _temp3(filter);
            }
          }();

          return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
        });
      });

      return _temp6 && _temp6.then ? _temp6.then(function () {
        return paths;
      }) : paths;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 读取文件
 * @param {String} path 文件路径
 */


var readFile = function (path) {
  return new Promise(function (resolve) {
    Fs.readFile(path, function (err, data) {
      resolve(err ? null : data);
    });
  });
};
/**
 * 读取文本文件内容
 * @param {String} path 文件路径
 */


var readText = function (path) {
  return new Promise(function (resolve) {
    Fs.readFile(path, function (err, data) {
      resolve(err ? null : data.toString());
    });
  });
};
/**
 * 读取Json文件数据
 * @param {String} path 文件路径
 */


var readJson = function (path) {
  return new Promise(function (resolve) {
    Fs.readFile(path, function (err, data) {
      data = data.toString() || null;

      if (data) {
        data = JSON.parse(data);
      }

      resolve(err ? null : data);
    });
  });
};
/**
 * 创建目录
 * @param {String} path 目录路径
 */


var mkdir = function (path) {
  try {
    return Promise.resolve(initDir(path)).then(function () {
      return new Promise(function (resolve) {
        Fs.mkdir(path, function () {
          try {
            return Promise.resolve(exists(path)).then(function (_exists) {
              resolve(_exists);
            });
          } catch (e) {
            return Promise.reject(e);
          }
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 删除文件
 * @param {String} path 文件路径
 */


var deleteFile = function (path) {
  return new Promise(function (resolve) {
    Fs.unlink(path, function (err) {
      resolve(err ? false : true);
    });
  });
};
/**
 * 删除目录
 * @param {String} path 目录路径
 */


var deleteDir = function (path) {
  try {
    return Promise.resolve(readdir(path)).then(function (dir) {
      function _temp9() {
        return new Promise(function (resolve) {
          Fs.rmdir(path, function (err) {
            resolve(err ? false : true);
          });
        });
      }

      var _temp8 = _forOf(dir, function (p) {
        var currentPath = Path.join(path, p);
        return Promise.resolve(isDir(currentPath)).then(function (dir) {
          var _temp7 = function () {
            if (dir) {
              return Promise.resolve(deleteDir(currentPath)).then(function () {});
            } else {
              return Promise.resolve(deleteFile(currentPath)).then(function () {});
            }
          }();

          if (_temp7 && _temp7.then) { return _temp7.then(function () {}); }
        });
      });

      return _temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 复制源文件到目标文件
 * @param {String} sourcePath 源文件
 * @param {String} targetPath 目标文件
 */


var copyFile = function (sourcePath, targetPath) {
  try {
    return Promise.resolve(initDir(targetPath)).then(function () {
      return new Promise(function (resolve) {
        Fs.copyFile(sourcePath, targetPath, function (err) {
          resolve(err ? false : true);
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 复制源目录到目标目录
 * @param {String} sourcePath 源路径
 * @param {String} targetPath 目标路径
 */


var copyDir = function (sourcePath, targetPath) {
  try {
    return Promise.resolve(readdir(sourcePath)).then(function (files) {
      var _temp12 = _forOf(files, function (name) {
        var filePath = Path.join(sourcePath, name);
        return Promise.resolve(isDir(filePath)).then(function (_isDir2) {
          function _temp11() {
            return Promise.resolve(copyFile(filePath, Path.join(targetPath, name))).then(function () {});
          }

          var _temp10 = function () {
            if (_isDir2) {
              return Promise.resolve(mkdir(Path.join(targetPath, name))).then(function () {
                return Promise.resolve(copyDir(filePath, Path.join(targetPath, name))).then(function () {});
              });
            }
          }();

          return _temp10 && _temp10.then ? _temp10.then(_temp11) : _temp11(_temp10);
        });
      });

      if (_temp12 && _temp12.then) { return _temp12.then(function () {}); }
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * 复制目录或文件到指定目录或文件
 * @param {String} sourcePath 源目录或文件路径
 * @param {String} targetPath 目标目录或文件路径
 */


var copy = function (sourcePath, targetPath) {
  try {
    return Promise.resolve(isDir(sourcePath)).then(function (_isDir3) {
      if (_isDir3) {
        return copyDir(sourcePath, targetPath);
      }

      return copyFile(sourcePath, targetPath);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export { exists, isDir, writeFile, writeJson, readdir, readFilePaths, readFile, readText, readJson, mkdir, deleteDir, deleteFile, copy, copyFile, copyDir };
