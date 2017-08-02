## 一种轻便且灵活的js模板的思路

> 项目地址：[https://github.com/j20041426/template](https://github.com/j20041426/template)

### 思路背景

在Vue、React、Angular等大前端框架异军突起的今天，写前端时已经很难用得上普通模板引擎了。因为这些框架都自带DOM渲染的功能，甚至由于虚拟DOM技术的存在，使得DOM渲染的效率比普通模板引擎更高。

但是在某些场景，仍然有用模板引擎的需求，比如写插件之类的（我就是在写插件的时候想到这个问题的-_-）。如果直接拼接HTML代码，会让整体代码的可读性变低；但是我又不想用现成的模板引擎，感觉有点太重了，本来写插件就想要轻便效率。

于是，我就有了一个处于直接拼接HTML代码和使用模板引擎之间的一个思路。（很可能我并不是第一个想到的，在这里只是探讨一下）

### 先贴代码

	var template = function(temp, params, repeat){
	  var ret = "";
	  var repeat = repeat || 1;
	  
	  for(var i = 0; i < repeat; i++){
	    ret += temp.replace(/{{[\w]+}}/g,function(a,b){
	      var value = params[a.replace(/[{}]/g,"")];
	      if(typeof value === "function"){
	        return value.call(this, i);
	      }else{
	        return value;
	      }
	    })
	  }
	  
	  return ret;
	}

因为一般用模板来生成HTML代码，最常用的功能就是遍历和条件判断，这个思路就是基于这一点出发的。

参数`temp`是模板字符串，例如`'<div class="{{clas}}">{{prefix}}:{{num}}</div>'`，因为我用Vue比较多，所以这里用的也是`{{}}`。

参数`repeat`表示当前模板字符串需要重复的次数，比如传10的话，就会生成10个`div`。

参数`params`用来定义模板里的变量，例如：

	{
		"clas": function(index){
		    return index % 2 ? 'even' : 'odd';
		},
		"num": function(index){
		    return index + 1;
		},
		"prefix": "No"
	}

变量名称一定要一一对应。

参数里可以定义常量，比如`"prefix": "No"`，表示模板中的`prefix`变量会被替换为字符串`No`；
还可以定义成一个`function`，这个`function`接收当前遍历的`index`作为参数：

	"num": function(index){
	    return index + 1;
	}

返回值则会被替换到对应的模板变量中，比如这个`num`就会被替换成1到10。

在`function`里也可以再放入一个`template`，比如：

	var temp = '<ul>{{lists}}</ul>';
	var lists = '<li>{{content}}</li>';
    var t = template(temp, {
        "lists": function(){
            return template(lists, {
                "content": function(index){
                    return index % 2 ? '偶数' : '奇数';
                }
            }, 10);
        }
    });

