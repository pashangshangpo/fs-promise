import Fs from 'fs'
import Path from 'path'

/**
 * 判断文件路径是否存在
 * @param {String} path 文件路径
 */
const exists = path => {
  return new Promise(resolve => {
    Fs.access(path, Fs.constants.F_OK, err => {
      resolve(err ? false : true)
    })
  })
}

/**
 * 判断是否是文件目录
 * @param {String} path 文件路径
 */
const isDir = path => {
  return new Promise(resolve => {
    Fs.stat(path, (err, stats) => {
      resolve(err ? false : stats.isDirectory())
    })
  })
}

/**
 * 写入文件
 * @param {String} path 文件路径
 * @param {String|Buffer} content 内容
 */
const writeFile = async (path, content) => {
  const paths = path.split('/')
  
  paths.pop()

  const dir = paths.join('/')
  const isExists = await exists(dir)

  if (!isExists) {
    await mkdir(dir)
  }

  return new Promise(resolve => {
    Fs.writeFile(path, content, err => {
      resolve(err ? false : true)
    })
  })
}

/**
 * 写入JSON数据到文件
 * @param {String} path 文件路径
 * @param {Object} json JSON数据
 */
const writeJson = async (path, json) => {
  const paths = path.split('/')
  
  paths.pop()

  const dir = paths.join('/')
  const isExists = await exists(dir)

  if (!isExists) {
    await mkdir(dir)
  }

  return new Promise(resolve => {
    Fs.writeFile(path, JSON.stringify(json), err => {
      resolve(err ? false : true)
    })
  })
}

/**
 * 读取文件目录
 * @param {String} path 文件路径
 */
const readdir = path => {
  return new Promise(resolve => {
    Fs.readdir(path, (err, files) => {
      resolve(files || [])
    })
  })
}

/**
 * 递归读取目录下符合条件的所有文件
 * @param {String} dir 目录路径
 * @param {Function} filter 过滤文件函数
 */
const readFilePaths = async (dir, filter) => {
  const files = await readdir(dir)
  const paths = []

  for (let file of files) {
      const filePath = Path.join(dir, file)

      if (!(await isDir(filePath))) {
        if (filter && await filter(filePath) === false) {
            continue
        }

        paths.push(filePath)
        continue
      }

      paths.push(...(await readFilePaths(filePath, filter)))
  }

  return paths
}

/**
 * 读取文件
 * @param {String} path 文件路径
 */
const readFile = path => {
  return new Promise(resolve => {
    Fs.readFile(path, (err, data) => {
      resolve(err ? null : data)
    })
  })
}

/**
 * 读取文本文件内容
 * @param {String} path 文件路径
 */
const readText = path => {
  return new Promise(resolve => {
    Fs.readFile(path, (err, data) => {
      resolve(err ? null : data.toString())
    })
  })
}

/**
 * 读取Json文件数据
 * @param {String} path 文件路径
 */
const readJson = path => {
  return new Promise(resolve => {
    Fs.readFile(path, (err, data) => {
      data = data.toString() || null
      
      if (data) {
        data = JSON.parse(data)
      }

      resolve(err ? null : data)
    })
  })
}

/**
 * 创建目录
 * @param {String} path 目录路径
 */
const mkdir = async path => {
  const paths = path.split('/')
  
  paths.pop()
  
  const isExists = await exists(paths.join('/'))

  if (!isExists) {
    await mkdir(paths.join('/'))
  }

  return new Promise(resolve => {
    Fs.mkdir(path, async () => {
      resolve(await exists(path))
    })
  })
}

/**
 * 删除文件
 * @param {String} path 文件路径
 */
const deleteFile = path => {
  return new Promise(resolve => {
    Fs.unlink(path, err => {
      resolve(err ? false : true)
    })
  })
}

/**
 * 删除目录
 * @param {String} path 目录路径
 */
const deleteDir = async path => {
  const dir = await readdir(path)

  for (let p of dir) {
    const currentPath = Path.join(path, p)
    const dir = await isDir(currentPath)

    if (dir) {
      await deleteDir(currentPath)
    } else {
      await deleteFile(currentPath)
    }
  }

  return new Promise(resolve => {
    Fs.rmdir(path, err => {
      resolve(err ? false : true)
    })
  })
}

export {
  exists,
  isDir,
  writeFile,
  writeJson,
  readdir,
  readFilePaths,
  readFile,
  readText,
  readJson,
  mkdir,
  deleteDir,
  deleteFile,
}
