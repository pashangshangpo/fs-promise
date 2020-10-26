# fs-promise

> Fs Pomise

## Use

1、npm i --save https://github.com/pashangshangpo/fs-promise.git

2、const fs = require('fs-promise')

## Demo

```js
const fs = require('fs-promise')

fs.exists('./test.js').then(console.log)
```

## Functions

<dl>
<dt><a href="#exists">exists(path)</a></dt>
<dd><p>判断文件路径是否存在</p>
</dd>
<dt><a href="#isDir">isDir(path)</a></dt>
<dd><p>判断是否是文件目录</p>
</dd>
<dt><a href="#writeFile">writeFile(path, content)</a></dt>
<dd><p>写入文件</p>
</dd>
<dt><a href="#writeJson">writeJson(path, json)</a></dt>
<dd><p>写入JSON数据到文件</p>
</dd>
<dt><a href="#readdir">readdir(path)</a></dt>
<dd><p>读取文件目录</p>
</dd>
<dt><a href="#readFile">readFile(path)</a></dt>
<dd><p>读取文件</p>
</dd>
<dt><a href="#readText">readText(path)</a></dt>
<dd><p>读取文本文件内容</p>
</dd>
<dt><a href="#readJson">readJson(path)</a></dt>
<dd><p>读取Json文件数据</p>
</dd>
<dt><a href="#mkdir">mkdir(path)</a></dt>
<dd><p>创建目录</p>
</dd>
<dt><a href="#deleteFile">deleteFile(path)</a></dt>
<dd><p>删除文件</p>
</dd>
<dt><a href="#deleteDir">deleteDir(path)</a></dt>
<dd><p>删除目录</p>
</dd>
</dl>

<a name="exists"></a>

## exists(path)
判断文件路径是否存在

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 文件路径 |

<a name="isDir"></a>

## isDir(path)
判断是否是文件目录

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 文件路径 |

<a name="writeFile"></a>

## writeFile(path, content)
写入文件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 文件路径 |
| content | <code>String</code> \| <code>Buffer</code> | 内容 |

<a name="writeJson"></a>

## writeJson(path, json)
写入JSON数据到文件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 文件路径 |
| json | <code>Object</code> | JSON数据 |

<a name="readdir"></a>

## readdir(path)
读取文件目录

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 文件路径 |

<a name="readFile"></a>

## readFile(path)
读取文件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 文件路径 |

<a name="readText"></a>

## readText(path)
读取文本文件内容

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 文件路径 |

<a name="readJson"></a>

## readJson(path)
读取Json文件数据

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 文件路径 |

<a name="mkdir"></a>

## mkdir(path)
创建目录

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 目录路径 |

<a name="deleteFile"></a>

## deleteFile(path)
删除文件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 文件路径 |

<a name="deleteDir"></a>

## deleteDir(path)
删除目录

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | 目录路径 |

