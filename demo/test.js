const {
  exists,
  isDir,
  writeFile, writeJson,
  readdir, readFile, readFilePaths, readText, readJson,
  mkdir,
  deleteFile,
  deleteDir,
  copy, copyFile, copyDir
} = require('../dist/fs-promise')

exists('./demo/test.js').then(console.log)
exists('./demo/test2.js').then(console.log)

writeFile('./demo/test1', 'Hello World').then(console.log)
writeJson('./demo/json', { a: 1 })
readdir('./demo').then(console.log)
readFile('./demo/test1').then(console.log)
readText('./demo/test1').then(console.log)
readJson('./demo/json').then(console.log)
mkdir('./demo/children').then(console.log)
deleteFile('./demo/test1').then(console.log)
deleteDir('./demo/a').then(console.log)
mkdir('./demo/a/b/c/d/e').then(console.log)
writeFile('./demo/a/b/c', 'Hello World').then(console.log)
writeJson('./demo/a/b/c/json', { a: 1 })

readFilePaths('./demo').then(console.log)

copyFile('demo/test.js', 'demo/aaa/bbb/test3.js')

copyDir('demo', 'aaa')

copy('demo', 'ccc')
