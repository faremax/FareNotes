> 本文参考以下博客内容以及维基百科
> http://blog.csdn.net/zml_2015/article/details/51051217
> http://blog.sina.com.cn/s/blog_415bd7070100en9i.html

<!-- MarkdownTOC -->

- [1**：请求收到，继续处理](#1%EF%BC%9A%E8%AF%B7%E6%B1%82%E6%94%B6%E5%88%B0%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%A4%84%E7%90%86)
- [2**：操作成功收到，分析、接受](#2%EF%BC%9A%E6%93%8D%E4%BD%9C%E6%88%90%E5%8A%9F%E6%94%B6%E5%88%B0%EF%BC%8C%E5%88%86%E6%9E%90%E3%80%81%E6%8E%A5%E5%8F%97)
- [3**：完成此请求必须进一步处理](#3%EF%BC%9A%E5%AE%8C%E6%88%90%E6%AD%A4%E8%AF%B7%E6%B1%82%E5%BF%85%E9%A1%BB%E8%BF%9B%E4%B8%80%E6%AD%A5%E5%A4%84%E7%90%86)
- [4**：请求包含一个错误语法或不能完成](#4%EF%BC%9A%E8%AF%B7%E6%B1%82%E5%8C%85%E5%90%AB%E4%B8%80%E4%B8%AA%E9%94%99%E8%AF%AF%E8%AF%AD%E6%B3%95%E6%88%96%E4%B8%8D%E8%83%BD%E5%AE%8C%E6%88%90)
- [5**：服务器执行一个完全有效请求失败](#5%EF%BC%9A%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%89%A7%E8%A1%8C%E4%B8%80%E4%B8%AA%E5%AE%8C%E5%85%A8%E6%9C%89%E6%95%88%E8%AF%B7%E6%B1%82%E5%A4%B1%E8%B4%A5)

<!-- /MarkdownTOC -->

## 1**：请求收到，继续处理
状态码 | 状态字 | 描述
--- | --- | ---
100 | Continue | 客户必须继续发出请求剩余部分，服务器必须在请求完成后向客户端发送一个最终响应。
101 | Switching Protocols | 服务器通过update头要求客户端转换HTTP协议版本或不同协议。
102 | Processing | 处理将被继续执行。

## 2**：操作成功收到，分析、接受
状态码 | 状态字 | 描述
--- | --- | ---
200 | OK | 请求已成功，请求所希望的响应头或数据体将随此响应返回。HTTP/0.9
201 | Created | 请求已经被实现，而且有一个新的资源已经依据请求的需要而建立，且其URI已经随Location头信息返回。
202 | Accepted | 服务器已接受请求，但由于服务器忙，尚未处理
203 | Non-Authoritative Information | 服务器已成功处理了请求，但返回的实体头部元信息不在原始服务器上，而是来自本地或者第三方的拷贝。
204 | No Content | 服务器成功处理了请求，但不需要返回内容
205 | Reset Content | 服务器成功处理了请求，且没有返回任何内容。但此状态码的响应要求请求者重置文档视图。
206 | Partial Content | 服务器已经成功处理了部分GET请求。客户端使用此头配合Range或If-Range实现断点续传，服务器端则需返回带有Content-Length或Content-Range的头和内容(如果Last-Modified匹配失败则断点续传失败)
207 | Multi-Status | WebDAV(RFC2518)扩展的状态码，代表之后的消息体将是一个XML消息，

## 3**：完成此请求必须进一步处理
状态码 | 状态字 | 描述
--- | --- | ---
300 | Multiple Choices | 请求的资源可在多处得到。用户或浏览器能够自行选择一个首选的地址进行重定向。
301 | Moved Permanently | 被请求的资源已永久移动到新位置。新的永久性的URI应当在响应的Location域中返回。http1.0中POST重定向会被改为GET方式
302 | Move temporarily | 请求的资源临时从不同的URI响应请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。此时的重定向都是GET方式
303 | See Other | 对应当前请求的响应可以在另一个URI上被找到，而且客户端应当采用GET的方式访问那个资源。303响应禁止被缓存
304 | Not Modified | 告诉客户端，所请求的内容距离上次访问并没有变化，客户端可以直接从浏览器缓存里获取该资源。
305 | Use Proxy | 被请求的资源必须通过指定的代理才能被访问。Location域中将给出指定的代理所在的URI信息，接收者需要重复发送一个单独的请求，通过这个代理才能访问相应资源。只有原始服务器才能建立305响应。
306 | Switch Proxy | (在最新版的规范中，306状态码已经不再被使用。)
307 | Temporary Redirect | 请求的资源临时从不同的URI响应请求。新的临时性的URI应当在响应的Location域中返回。两次访问方法(POST/GET)必须相同
308 | Permanent Redirect | 所请求的资源将永久的位于另外一个URI上.新的URL会在响应的Location:头字段里找到.与301状态码有相同的语义,且前后两次访问必须使用相同的方法(GET/POST).

## 4**：请求包含一个错误语法或不能完成
状态码 | 状态字 | 描述
--- | --- | ---
400 | Bad Request | 语义有误或请求参数有误，当前请求无法被服务器理解。
401 | Unauthorized | 当前请求需要用户验证。该响应必须包含一个适用于被请求资源的WWW-Authenticate信息头用以询问用户信息。
402 | Payment Required | (该状态码是为了将来可能的需求而预留的。)
403 | Forbidden | 服务器已经理解请求，但是拒绝执行它。
404 | Not Found | 请求失败，请求所希望得到的资源未被在服务器上发现。
405 | Method Not Allowed | 请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow头信息用以表示出当前资源能够接受的请求方法的列表。
406 | Not Acceptable | 请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体。
407 | Proxy Authentication Required | 客户端必须在代理服务器上进行身份验证。代理服务器必须返回一个Proxy-Authenticate用以进行身份询问。客户端可以返回一个Proxy-Authorization信息头用以验证。
408 | Request Timeout | 请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。
409 | Conflict | 由于和被请求的资源的当前状态之间存在冲突，请求无法完成。
410 | Gone | 被请求的资源在服务器上已经不再可用，而且没有任何已知的重定向地址。
411 | Length Required | 服务器拒绝在没有定义Content-Length头的情况下接受请求。
412 | Precondition Failed | 服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个。
413 | Request Entity Too Large | 服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。
414 | Request-URI Too Long | 请求的URI长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。
415 | Unsupported Media Type | 服务器不支持客户端所请求的媒体类型,因此拒绝该请求.
416 | Requested Range Not Satisfiable | 请求中包含Range请求头字段，在当前请求资源范围内没有range指示值，请求也不包含If-Range请求头字段
417 | Expectation Failed | 服务器不满足请求Expect头字段指定的期望值，如果是代理服务器，可能是下一级服务器不能满足请求
421 | There are too many connections from your internet address | 从当前客户端所在的IP地址到服务器的连接数超过了服务器许可的最大范围
422 | Unprocessable Entity | 请求格式正确，但是由于含有语义错误，无法响应。
423 | Locked | 当前资源被锁定。
424 | Failed Dependency | 由于之前的某个请求发生的错误，导致当前请求失败
425 | Unordered Collection | (草案预留，没用正式定义实施)
426 | Upgrade Required | 客户端应当切换到TLS/1.0。
449 | Retry With | 由微软扩展，代表请求应当在执行完适当的操作后进行重试。

## 5**：服务器执行一个完全有效请求失败
状态码 | 状态字 | 描述
--- | --- | ---
500 | Internal Server Error | 服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理。
501 | Not Implemented | 服务器不支持当前请求所需要的某个功能。
502 | Bad Gateway | 作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应。
503 | Service Unavailable | 由于临时的服务器维护或者过载，服务器当前无法处理请求。
504 | Gateway Timeout | 作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器或者辅助服务器收到响应。
505 | HTTP Version Not Supported | 服务器不支持，或者拒绝支持在请求中使用的HTTP版本。
506 | Variant Also Negotiates | 代表服务器存在内部配置错误
507 | Insufficient Storage | 服务器无法存储完成请求所必须的内容。这个状况被认为是临时的。
509 | Bandwidth Limit Exceeded | 服务器达到带宽限制。这不是一个官方的状态码，但是仍被广泛使用。
510 | Not Extended | 获取资源所需要的策略并没有没满足
600 | Unparseable Response Headers | 源站没有返回响应头部，只返回实体内容


