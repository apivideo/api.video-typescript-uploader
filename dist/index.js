!function(t,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var e=n();for(var r in e)("object"==typeof exports?exports:t)[r]=e[r]}}(this,(function(){return function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(r,o,function(n){return t[n]}.bind(null,o));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=60)}([function(t,n,e){(function(n){var e=function(t){return t&&t.Math==Math&&t};t.exports=e("object"==typeof globalThis&&globalThis)||e("object"==typeof window&&window)||e("object"==typeof self&&self)||e("object"==typeof n&&n)||function(){return this}()||Function("return this")()}).call(this,e(64))},function(t,n,e){var r=e(0),o=e(42),i=e(3),u=e(43),c=e(49),a=e(79),f=o("wks"),s=r.Symbol,l=a?s:s&&s.withoutSetter||u;t.exports=function(t){return i(f,t)&&(c||"string"==typeof f[t])||(c&&i(s,t)?f[t]=s[t]:f[t]=l("Symbol."+t)),f[t]}},function(t,n){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,n,e){var r=e(40),o={}.hasOwnProperty;t.exports=Object.hasOwn||function(t,n){return o.call(r(t),n)}},function(t,n,e){var r=e(6);t.exports=function(t){if(!r(t))throw TypeError(String(t)+" is not an object");return t}},function(t,n,e){var r=e(9),o=e(10),i=e(15);t.exports=r?function(t,n,e){return o.f(t,n,i(1,e))}:function(t,n,e){return t[n]=e,t}},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n,e){var r=e(44),o=e(0),i=function(t){return"function"==typeof t?t:void 0};t.exports=function(t,n){return arguments.length<2?i(r[t])||i(o[t]):r[t]&&r[t][n]||o[t]&&o[t][n]}},function(t,n,e){var r=e(0),o=e(20).f,i=e(5),u=e(11),c=e(24),a=e(68),f=e(47);t.exports=function(t,n){var e,s,l,p,v,h=t.target,d=t.global,y=t.stat;if(e=d?r:y?r[h]||c(h,{}):(r[h]||{}).prototype)for(s in n){if(p=n[s],l=t.noTargetGet?(v=o(e,s))&&v.value:e[s],!f(d?s:h+(y?".":"#")+s,t.forced)&&void 0!==l){if(typeof p==typeof l)continue;a(p,l)}(t.sham||l&&l.sham)&&i(p,"sham",!0),u(e,s,p,t)}}},function(t,n,e){var r=e(2);t.exports=!r((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},function(t,n,e){var r=e(9),o=e(41),i=e(4),u=e(39),c=Object.defineProperty;n.f=r?c:function(t,n,e){if(i(t),n=u(n,!0),i(e),o)try{return c(t,n,e)}catch(t){}if("get"in e||"set"in e)throw TypeError("Accessors not supported");return"value"in e&&(t[n]=e.value),t}},function(t,n,e){var r=e(0),o=e(5),i=e(3),u=e(24),c=e(25),a=e(17),f=a.get,s=a.enforce,l=String(String).split("String");(t.exports=function(t,n,e,c){var a,f=!!c&&!!c.unsafe,p=!!c&&!!c.enumerable,v=!!c&&!!c.noTargetGet;"function"==typeof e&&("string"!=typeof n||i(e,"name")||o(e,"name",n),(a=s(e)).source||(a.source=l.join("string"==typeof n?n:""))),t!==r?(f?!v&&t[n]&&(p=!0):delete t[n],p?t[n]=e:o(t,n,e)):p?t[n]=e:u(n,e)})(Function.prototype,"toString",(function(){return"function"==typeof this&&f(this).source||c(this)}))},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t}},function(t,n){t.exports=!1},function(t,n){t.exports={}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n,e){var r=e(66),o=e(22);t.exports=function(t){return r(o(t))}},function(t,n,e){var r,o,i,u=e(67),c=e(0),a=e(6),f=e(5),s=e(3),l=e(26),p=e(27),v=e(28),h=c.WeakMap;if(u||l.state){var d=l.state||(l.state=new h),y=d.get,g=d.has,m=d.set;r=function(t,n){if(g.call(d,t))throw new TypeError("Object already initialized");return n.facade=t,m.call(d,t,n),n},o=function(t){return y.call(d,t)||{}},i=function(t){return g.call(d,t)}}else{var x=p("state");v[x]=!0,r=function(t,n){if(s(t,x))throw new TypeError("Object already initialized");return n.facade=t,f(t,x,n),n},o=function(t){return s(t,x)?t[x]:{}},i=function(t){return s(t,x)}}t.exports={set:r,get:o,has:i,enforce:function(t){return i(t)?o(t):r(t,{})},getterFor:function(t){return function(n){var e;if(!a(n)||(e=o(n)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return e}}}},function(t,n,e){var r=e(4),o=e(78),i=e(46),u=e(51),c=e(80),a=e(81),f=function(t,n){this.stopped=t,this.result=n};t.exports=function(t,n,e){var s,l,p,v,h,d,y,g=e&&e.that,m=!(!e||!e.AS_ENTRIES),x=!(!e||!e.IS_ITERATOR),b=!(!e||!e.INTERRUPTED),w=u(n,g,1+m+b),S=function(t){return s&&a(s),new f(!0,t)},j=function(t){return m?(r(t),b?w(t[0],t[1],S):w(t[0],t[1])):b?w(t,S):w(t)};if(x)s=t;else{if("function"!=typeof(l=c(t)))throw TypeError("Target is not iterable");if(o(l)){for(p=0,v=i(t.length);v>p;p++)if((h=j(t[p]))&&h instanceof f)return h;return new f(!1)}s=l.call(t)}for(d=s.next;!(y=d.call(s)).done;){try{h=j(y.value)}catch(t){throw a(s),t}if("object"==typeof h&&h&&h instanceof f)return h}return new f(!1)}},function(t,n,e){"use strict";var r=e(12),o=function(t){var n,e;this.promise=new t((function(t,r){if(void 0!==n||void 0!==e)throw TypeError("Bad Promise constructor");n=t,e=r})),this.resolve=r(n),this.reject=r(e)};t.exports.f=function(t){return new o(t)}},function(t,n,e){var r=e(9),o=e(65),i=e(15),u=e(16),c=e(39),a=e(3),f=e(41),s=Object.getOwnPropertyDescriptor;n.f=r?s:function(t,n){if(t=u(t),n=c(n,!0),f)try{return s(t,n)}catch(t){}if(a(t,n))return i(!o.f.call(t,n),t[n])}},function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},function(t,n){t.exports=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t}},function(t,n,e){var r=e(0),o=e(6),i=r.document,u=o(i)&&o(i.createElement);t.exports=function(t){return u?i.createElement(t):{}}},function(t,n,e){var r=e(0),o=e(5);t.exports=function(t,n){try{o(r,t,n)}catch(e){r[t]=n}return n}},function(t,n,e){var r=e(26),o=Function.toString;"function"!=typeof r.inspectSource&&(r.inspectSource=function(t){return o.call(t)}),t.exports=r.inspectSource},function(t,n,e){var r=e(0),o=e(24),i=r["__core-js_shared__"]||o("__core-js_shared__",{});t.exports=i},function(t,n,e){var r=e(42),o=e(43),i=r("keys");t.exports=function(t){return i[t]||(i[t]=o(t))}},function(t,n){t.exports={}},function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},function(t,n){t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},function(t,n,e){var r=e(3),o=e(40),i=e(27),u=e(74),c=i("IE_PROTO"),a=Object.prototype;t.exports=u?Object.getPrototypeOf:function(t){return t=o(t),r(t,c)?t[c]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?a:null}},function(t,n,e){var r=e(4),o=e(75);t.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var t,n=!1,e={};try{(t=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(e,[]),n=e instanceof Array}catch(t){}return function(e,i){return r(e),o(i),n?t.call(e,i):e.__proto__=i,e}}():void 0)},function(t,n,e){var r,o=e(4),i=e(76),u=e(30),c=e(28),a=e(48),f=e(23),s=e(27),l=s("IE_PROTO"),p=function(){},v=function(t){return"<script>"+t+"<\/script>"},h=function(){try{r=document.domain&&new ActiveXObject("htmlfile")}catch(t){}var t,n;h=r?function(t){t.write(v("")),t.close();var n=t.parentWindow.Object;return t=null,n}(r):((n=f("iframe")).style.display="none",a.appendChild(n),n.src=String("javascript:"),(t=n.contentWindow.document).open(),t.write(v("document.F=Object")),t.close(),t.F);for(var e=u.length;e--;)delete h.prototype[u[e]];return h()};c[l]=!0,t.exports=Object.create||function(t,n){var e;return null!==t?(p.prototype=o(t),e=new p,p.prototype=null,e[l]=t):e=h(),void 0===n?e:i(e,n)}},function(t,n,e){var r=e(7);t.exports=r("navigator","userAgent")||""},function(t,n,e){var r={};r[e(1)("toStringTag")]="z",t.exports="[object z]"===String(r)},function(t,n,e){var r=e(10).f,o=e(3),i=e(1)("toStringTag");t.exports=function(t,n,e){t&&!o(t=e?t:t.prototype,i)&&r(t,i,{configurable:!0,value:n})}},function(t,n,e){var r=e(21),o=e(0);t.exports="process"==r(o.process)},function(t,n){t.exports=function(t){try{return{error:!1,value:t()}}catch(t){return{error:!0,value:t}}}},function(t,n,e){var r=e(6);t.exports=function(t,n){if(!r(t))return t;var e,o;if(n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!r(o=e.call(t)))return o;if(!n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,n,e){var r=e(22);t.exports=function(t){return Object(r(t))}},function(t,n,e){var r=e(9),o=e(2),i=e(23);t.exports=!r&&!o((function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a}))},function(t,n,e){var r=e(13),o=e(26);(t.exports=function(t,n){return o[t]||(o[t]=void 0!==n?n:{})})("versions",[]).push({version:"3.15.0",mode:r?"pure":"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"})},function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++e+r).toString(36)}},function(t,n,e){var r=e(0);t.exports=r},function(t,n,e){var r=e(3),o=e(16),i=e(71).indexOf,u=e(28);t.exports=function(t,n){var e,c=o(t),a=0,f=[];for(e in c)!r(u,e)&&r(c,e)&&f.push(e);for(;n.length>a;)r(c,e=n[a++])&&(~i(f,e)||f.push(e));return f}},function(t,n,e){var r=e(29),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},function(t,n,e){var r=e(2),o=/#|\.prototype\./,i=function(t,n){var e=c[u(t)];return e==f||e!=a&&("function"==typeof n?r(n):!!n)},u=i.normalize=function(t){return String(t).replace(o,".").toLowerCase()},c=i.data={},a=i.NATIVE="N",f=i.POLYFILL="P";t.exports=i},function(t,n,e){var r=e(7);t.exports=r("document","documentElement")},function(t,n,e){var r=e(50),o=e(2);t.exports=!!Object.getOwnPropertySymbols&&!o((function(){var t=Symbol();return!String(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&r&&r<41}))},function(t,n,e){var r,o,i=e(0),u=e(34),c=i.process,a=c&&c.versions,f=a&&a.v8;f?o=(r=f.split("."))[0]<4?1:r[0]+r[1]:u&&(!(r=u.match(/Edge\/(\d+)/))||r[1]>=74)&&(r=u.match(/Chrome\/(\d+)/))&&(o=r[1]),t.exports=o&&+o},function(t,n,e){var r=e(12);t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 0:return function(){return t.call(n)};case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}}},function(t,n,e){var r=e(35),o=e(21),i=e(1)("toStringTag"),u="Arguments"==o(function(){return arguments}());t.exports=r?o:function(t){var n,e,r;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=function(t,n){try{return t[n]}catch(t){}}(n=Object(t),i))?e:u?o(n):"Object"==(r=o(n))&&"function"==typeof n.callee?"Arguments":r}},function(t,n,e){var r=e(0);t.exports=r.Promise},function(t,n,e){var r=e(4),o=e(12),i=e(1)("species");t.exports=function(t,n){var e,u=r(t).constructor;return void 0===u||null==(e=r(u)[i])?n:o(e)}},function(t,n,e){var r,o,i,u=e(0),c=e(2),a=e(51),f=e(48),s=e(23),l=e(56),p=e(37),v=u.location,h=u.setImmediate,d=u.clearImmediate,y=u.process,g=u.MessageChannel,m=u.Dispatch,x=0,b={},w=function(t){if(b.hasOwnProperty(t)){var n=b[t];delete b[t],n()}},S=function(t){return function(){w(t)}},j=function(t){w(t.data)},O=function(t){u.postMessage(t+"",v.protocol+"//"+v.host)};h&&d||(h=function(t){for(var n=[],e=1;arguments.length>e;)n.push(arguments[e++]);return b[++x]=function(){("function"==typeof t?t:Function(t)).apply(void 0,n)},r(x),x},d=function(t){delete b[t]},p?r=function(t){y.nextTick(S(t))}:m&&m.now?r=function(t){m.now(S(t))}:g&&!l?(i=(o=new g).port2,o.port1.onmessage=j,r=a(i.postMessage,i,1)):u.addEventListener&&"function"==typeof postMessage&&!u.importScripts&&v&&"file:"!==v.protocol&&!c(O)?(r=O,u.addEventListener("message",j,!1)):r="onreadystatechange"in s("script")?function(t){f.appendChild(s("script")).onreadystatechange=function(){f.removeChild(this),w(t)}}:function(t){setTimeout(S(t),0)}),t.exports={set:h,clear:d}},function(t,n,e){var r=e(34);t.exports=/(?:iphone|ipod|ipad).*applewebkit/i.test(r)},function(t,n,e){var r=e(4),o=e(6),i=e(19);t.exports=function(t,n){if(r(t),o(n)&&n.constructor===t)return n;var e=i.f(t);return(0,e.resolve)(n),e.promise}},function(t,n,e){"use strict";var r=e(8),o=e(98),i=e(31),u=e(32),c=e(36),a=e(5),f=e(11),s=e(1),l=e(13),p=e(14),v=e(59),h=v.IteratorPrototype,d=v.BUGGY_SAFARI_ITERATORS,y=s("iterator"),g=function(){return this};t.exports=function(t,n,e,s,v,m,x){o(e,n,s);var b,w,S,j=function(t){if(t===v&&k)return k;if(!d&&t in P)return P[t];switch(t){case"keys":case"values":case"entries":return function(){return new e(this,t)}}return function(){return new e(this)}},O=n+" Iterator",T=!1,P=t.prototype,E=P[y]||P["@@iterator"]||v&&P[v],k=!d&&E||j(v),_="Array"==n&&P.entries||E;if(_&&(b=i(_.call(new t)),h!==Object.prototype&&b.next&&(l||i(b)===h||(u?u(b,h):"function"!=typeof b[y]&&a(b,y,g)),c(b,O,!0,!0),l&&(p[O]=g))),"values"==v&&E&&"values"!==E.name&&(T=!0,k=function(){return E.call(this)}),l&&!x||P[y]===k||a(P,y,k),p[n]=k,v)if(w={values:j("values"),keys:m?k:j("keys"),entries:j("entries")},x)for(S in w)(d||T||!(S in P))&&f(P,S,w[S]);else r({target:n,proto:!0,forced:d||T},w);return w}},function(t,n,e){"use strict";var r,o,i,u=e(2),c=e(31),a=e(5),f=e(3),s=e(1),l=e(13),p=s("iterator"),v=!1;[].keys&&("next"in(i=[].keys())?(o=c(c(i)))!==Object.prototype&&(r=o):v=!0);var h=null==r||u((function(){var t={};return r[p].call(t)!==t}));h&&(r={}),l&&!h||f(r,p)||a(r,p,(function(){return this})),t.exports={IteratorPrototype:r,BUGGY_SAFARI_ITERATORS:v}},function(t,n,e){e(61),t.exports=e(103)},function(t,n,e){var r=e(62);t.exports=r},function(t,n,e){e(63),e(82),e(84),e(93),e(94),e(95),e(96),e(99);var r=e(44);t.exports=r.Promise},function(t,n,e){"use strict";var r=e(8),o=e(31),i=e(32),u=e(33),c=e(5),a=e(15),f=e(18),s=function(t,n){var e=this;if(!(e instanceof s))return new s(t,n);i&&(e=i(new Error(void 0),o(e))),void 0!==n&&c(e,"message",String(n));var r=[];return f(t,r.push,{that:r}),c(e,"errors",r),e};s.prototype=u(Error.prototype,{constructor:a(5,s),message:a(5,""),name:a(5,"AggregateError")}),r({global:!0},{AggregateError:s})},function(t,n){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(t){"object"==typeof window&&(e=window)}t.exports=e},function(t,n,e){"use strict";var r={}.propertyIsEnumerable,o=Object.getOwnPropertyDescriptor,i=o&&!r.call({1:2},1);n.f=i?function(t){var n=o(this,t);return!!n&&n.enumerable}:r},function(t,n,e){var r=e(2),o=e(21),i="".split;t.exports=r((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==o(t)?i.call(t,""):Object(t)}:Object},function(t,n,e){var r=e(0),o=e(25),i=r.WeakMap;t.exports="function"==typeof i&&/native code/.test(o(i))},function(t,n,e){var r=e(3),o=e(69),i=e(20),u=e(10);t.exports=function(t,n){for(var e=o(n),c=u.f,a=i.f,f=0;f<e.length;f++){var s=e[f];r(t,s)||c(t,s,a(n,s))}}},function(t,n,e){var r=e(7),o=e(70),i=e(73),u=e(4);t.exports=r("Reflect","ownKeys")||function(t){var n=o.f(u(t)),e=i.f;return e?n.concat(e(t)):n}},function(t,n,e){var r=e(45),o=e(30).concat("length","prototype");n.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},function(t,n,e){var r=e(16),o=e(46),i=e(72),u=function(t){return function(n,e,u){var c,a=r(n),f=o(a.length),s=i(u,f);if(t&&e!=e){for(;f>s;)if((c=a[s++])!=c)return!0}else for(;f>s;s++)if((t||s in a)&&a[s]===e)return t||s||0;return!t&&-1}};t.exports={includes:u(!0),indexOf:u(!1)}},function(t,n,e){var r=e(29),o=Math.max,i=Math.min;t.exports=function(t,n){var e=r(t);return e<0?o(e+n,0):i(e,n)}},function(t,n){n.f=Object.getOwnPropertySymbols},function(t,n,e){var r=e(2);t.exports=!r((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype}))},function(t,n,e){var r=e(6);t.exports=function(t){if(!r(t)&&null!==t)throw TypeError("Can't set "+String(t)+" as a prototype");return t}},function(t,n,e){var r=e(9),o=e(10),i=e(4),u=e(77);t.exports=r?Object.defineProperties:function(t,n){i(t);for(var e,r=u(n),c=r.length,a=0;c>a;)o.f(t,e=r[a++],n[e]);return t}},function(t,n,e){var r=e(45),o=e(30);t.exports=Object.keys||function(t){return r(t,o)}},function(t,n,e){var r=e(1),o=e(14),i=r("iterator"),u=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||u[i]===t)}},function(t,n,e){var r=e(49);t.exports=r&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},function(t,n,e){var r=e(52),o=e(14),i=e(1)("iterator");t.exports=function(t){if(null!=t)return t[i]||t["@@iterator"]||o[r(t)]}},function(t,n,e){var r=e(4);t.exports=function(t){var n=t.return;if(void 0!==n)return r(n.call(t)).value}},function(t,n,e){var r=e(35),o=e(11),i=e(83);r||o(Object.prototype,"toString",i,{unsafe:!0})},function(t,n,e){"use strict";var r=e(35),o=e(52);t.exports=r?{}.toString:function(){return"[object "+o(this)+"]"}},function(t,n,e){"use strict";var r,o,i,u,c=e(8),a=e(13),f=e(0),s=e(7),l=e(53),p=e(11),v=e(85),h=e(32),d=e(36),y=e(86),g=e(6),m=e(12),x=e(87),b=e(25),w=e(18),S=e(88),j=e(54),O=e(55).set,T=e(89),P=e(57),E=e(91),k=e(19),_=e(38),A=e(17),L=e(47),I=e(1),M=e(92),C=e(37),R=e(50),z=I("species"),F="Promise",N=A.get,D=A.set,G=A.getterFor(F),V=l&&l.prototype,H=l,U=V,q=f.TypeError,W=f.document,B=f.process,Y=k.f,K=Y,X=!!(W&&W.createEvent&&f.dispatchEvent),J="function"==typeof PromiseRejectionEvent,Q=!1,Z=L(F,(function(){var t=b(H)!==String(H);if(!t&&66===R)return!0;if(a&&!U.finally)return!0;if(R>=51&&/native code/.test(H))return!1;var n=new H((function(t){t(1)})),e=function(t){t((function(){}),(function(){}))};return(n.constructor={})[z]=e,!(Q=n.then((function(){}))instanceof e)||!t&&M&&!J})),$=Z||!S((function(t){H.all(t).catch((function(){}))})),tt=function(t){var n;return!(!g(t)||"function"!=typeof(n=t.then))&&n},nt=function(t,n){if(!t.notified){t.notified=!0;var e=t.reactions;T((function(){for(var r=t.value,o=1==t.state,i=0;e.length>i;){var u,c,a,f=e[i++],s=o?f.ok:f.fail,l=f.resolve,p=f.reject,v=f.domain;try{s?(o||(2===t.rejection&&it(t),t.rejection=1),!0===s?u=r:(v&&v.enter(),u=s(r),v&&(v.exit(),a=!0)),u===f.promise?p(q("Promise-chain cycle")):(c=tt(u))?c.call(u,l,p):l(u)):p(r)}catch(t){v&&!a&&v.exit(),p(t)}}t.reactions=[],t.notified=!1,n&&!t.rejection&&rt(t)}))}},et=function(t,n,e){var r,o;X?((r=W.createEvent("Event")).promise=n,r.reason=e,r.initEvent(t,!1,!0),f.dispatchEvent(r)):r={promise:n,reason:e},!J&&(o=f["on"+t])?o(r):"unhandledrejection"===t&&E("Unhandled promise rejection",e)},rt=function(t){O.call(f,(function(){var n,e=t.facade,r=t.value;if(ot(t)&&(n=_((function(){C?B.emit("unhandledRejection",r,e):et("unhandledrejection",e,r)})),t.rejection=C||ot(t)?2:1,n.error))throw n.value}))},ot=function(t){return 1!==t.rejection&&!t.parent},it=function(t){O.call(f,(function(){var n=t.facade;C?B.emit("rejectionHandled",n):et("rejectionhandled",n,t.value)}))},ut=function(t,n,e){return function(r){t(n,r,e)}},ct=function(t,n,e){t.done||(t.done=!0,e&&(t=e),t.value=n,t.state=2,nt(t,!0))},at=function(t,n,e){if(!t.done){t.done=!0,e&&(t=e);try{if(t.facade===n)throw q("Promise can't be resolved itself");var r=tt(n);r?T((function(){var e={done:!1};try{r.call(n,ut(at,e,t),ut(ct,e,t))}catch(n){ct(e,n,t)}})):(t.value=n,t.state=1,nt(t,!1))}catch(n){ct({done:!1},n,t)}}};if(Z&&(U=(H=function(t){x(this,H,F),m(t),r.call(this);var n=N(this);try{t(ut(at,n),ut(ct,n))}catch(t){ct(n,t)}}).prototype,(r=function(t){D(this,{type:F,done:!1,notified:!1,parent:!1,reactions:[],rejection:!1,state:0,value:void 0})}).prototype=v(U,{then:function(t,n){var e=G(this),r=Y(j(this,H));return r.ok="function"!=typeof t||t,r.fail="function"==typeof n&&n,r.domain=C?B.domain:void 0,e.parent=!0,e.reactions.push(r),0!=e.state&&nt(e,!1),r.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new r,n=N(t);this.promise=t,this.resolve=ut(at,n),this.reject=ut(ct,n)},k.f=Y=function(t){return t===H||t===i?new o(t):K(t)},!a&&"function"==typeof l&&V!==Object.prototype)){u=V.then,Q||(p(V,"then",(function(t,n){var e=this;return new H((function(t,n){u.call(e,t,n)})).then(t,n)}),{unsafe:!0}),p(V,"catch",U.catch,{unsafe:!0}));try{delete V.constructor}catch(t){}h&&h(V,U)}c({global:!0,wrap:!0,forced:Z},{Promise:H}),d(H,F,!1,!0),y(F),i=s(F),c({target:F,stat:!0,forced:Z},{reject:function(t){var n=Y(this);return n.reject.call(void 0,t),n.promise}}),c({target:F,stat:!0,forced:a||Z},{resolve:function(t){return P(a&&this===i?H:this,t)}}),c({target:F,stat:!0,forced:$},{all:function(t){var n=this,e=Y(n),r=e.resolve,o=e.reject,i=_((function(){var e=m(n.resolve),i=[],u=0,c=1;w(t,(function(t){var a=u++,f=!1;i.push(void 0),c++,e.call(n,t).then((function(t){f||(f=!0,i[a]=t,--c||r(i))}),o)})),--c||r(i)}));return i.error&&o(i.value),e.promise},race:function(t){var n=this,e=Y(n),r=e.reject,o=_((function(){var o=m(n.resolve);w(t,(function(t){o.call(n,t).then(e.resolve,r)}))}));return o.error&&r(o.value),e.promise}})},function(t,n,e){var r=e(11);t.exports=function(t,n,e){for(var o in n)r(t,o,n[o],e);return t}},function(t,n,e){"use strict";var r=e(7),o=e(10),i=e(1),u=e(9),c=i("species");t.exports=function(t){var n=r(t),e=o.f;u&&n&&!n[c]&&e(n,c,{configurable:!0,get:function(){return this}})}},function(t,n){t.exports=function(t,n,e){if(!(t instanceof n))throw TypeError("Incorrect "+(e?e+" ":"")+"invocation");return t}},function(t,n,e){var r=e(1)("iterator"),o=!1;try{var i=0,u={next:function(){return{done:!!i++}},return:function(){o=!0}};u[r]=function(){return this},Array.from(u,(function(){throw 2}))}catch(t){}t.exports=function(t,n){if(!n&&!o)return!1;var e=!1;try{var i={};i[r]=function(){return{next:function(){return{done:e=!0}}}},t(i)}catch(t){}return e}},function(t,n,e){var r,o,i,u,c,a,f,s,l=e(0),p=e(20).f,v=e(55).set,h=e(56),d=e(90),y=e(37),g=l.MutationObserver||l.WebKitMutationObserver,m=l.document,x=l.process,b=l.Promise,w=p(l,"queueMicrotask"),S=w&&w.value;S||(r=function(){var t,n;for(y&&(t=x.domain)&&t.exit();o;){n=o.fn,o=o.next;try{n()}catch(t){throw o?u():i=void 0,t}}i=void 0,t&&t.enter()},h||y||d||!g||!m?b&&b.resolve?((f=b.resolve(void 0)).constructor=b,s=f.then,u=function(){s.call(f,r)}):u=y?function(){x.nextTick(r)}:function(){v.call(l,r)}:(c=!0,a=m.createTextNode(""),new g(r).observe(a,{characterData:!0}),u=function(){a.data=c=!c})),t.exports=S||function(t){var n={fn:t,next:void 0};i&&(i.next=n),o||(o=n,u()),i=n}},function(t,n,e){var r=e(34);t.exports=/web0s(?!.*chrome)/i.test(r)},function(t,n,e){var r=e(0);t.exports=function(t,n){var e=r.console;e&&e.error&&(1===arguments.length?e.error(t):e.error(t,n))}},function(t,n){t.exports="object"==typeof window},function(t,n,e){"use strict";var r=e(8),o=e(12),i=e(19),u=e(38),c=e(18);r({target:"Promise",stat:!0},{allSettled:function(t){var n=this,e=i.f(n),r=e.resolve,a=e.reject,f=u((function(){var e=o(n.resolve),i=[],u=0,a=1;c(t,(function(t){var o=u++,c=!1;i.push(void 0),a++,e.call(n,t).then((function(t){c||(c=!0,i[o]={status:"fulfilled",value:t},--a||r(i))}),(function(t){c||(c=!0,i[o]={status:"rejected",reason:t},--a||r(i))}))})),--a||r(i)}));return f.error&&a(f.value),e.promise}})},function(t,n,e){"use strict";var r=e(8),o=e(12),i=e(7),u=e(19),c=e(38),a=e(18);r({target:"Promise",stat:!0},{any:function(t){var n=this,e=u.f(n),r=e.resolve,f=e.reject,s=c((function(){var e=o(n.resolve),u=[],c=0,s=1,l=!1;a(t,(function(t){var o=c++,a=!1;u.push(void 0),s++,e.call(n,t).then((function(t){a||l||(l=!0,r(t))}),(function(t){a||l||(a=!0,u[o]=t,--s||f(new(i("AggregateError"))(u,"No one promise resolved")))}))})),--s||f(new(i("AggregateError"))(u,"No one promise resolved"))}));return s.error&&f(s.value),e.promise}})},function(t,n,e){"use strict";var r=e(8),o=e(13),i=e(53),u=e(2),c=e(7),a=e(54),f=e(57),s=e(11);if(r({target:"Promise",proto:!0,real:!0,forced:!!i&&u((function(){i.prototype.finally.call({then:function(){}},(function(){}))}))},{finally:function(t){var n=a(this,c("Promise")),e="function"==typeof t;return this.then(e?function(e){return f(n,t()).then((function(){return e}))}:t,e?function(e){return f(n,t()).then((function(){throw e}))}:t)}}),!o&&"function"==typeof i){var l=c("Promise").prototype.finally;i.prototype.finally!==l&&s(i.prototype,"finally",l,{unsafe:!0})}},function(t,n,e){"use strict";var r=e(97).charAt,o=e(17),i=e(58),u=o.set,c=o.getterFor("String Iterator");i(String,"String",(function(t){u(this,{type:"String Iterator",string:String(t),index:0})}),(function(){var t,n=c(this),e=n.string,o=n.index;return o>=e.length?{value:void 0,done:!0}:(t=r(e,o),n.index+=t.length,{value:t,done:!1})}))},function(t,n,e){var r=e(29),o=e(22),i=function(t){return function(n,e){var i,u,c=String(o(n)),a=r(e),f=c.length;return a<0||a>=f?t?"":void 0:(i=c.charCodeAt(a))<55296||i>56319||a+1===f||(u=c.charCodeAt(a+1))<56320||u>57343?t?c.charAt(a):i:t?c.slice(a,a+2):u-56320+(i-55296<<10)+65536}};t.exports={codeAt:i(!1),charAt:i(!0)}},function(t,n,e){"use strict";var r=e(59).IteratorPrototype,o=e(33),i=e(15),u=e(36),c=e(14),a=function(){return this};t.exports=function(t,n,e){var f=n+" Iterator";return t.prototype=o(r,{next:i(1,e)}),u(t,f,!1,!0),c[f]=a,t}},function(t,n,e){var r=e(0),o=e(100),i=e(101),u=e(5),c=e(1),a=c("iterator"),f=c("toStringTag"),s=i.values;for(var l in o){var p=r[l],v=p&&p.prototype;if(v){if(v[a]!==s)try{u(v,a,s)}catch(t){v[a]=s}if(v[f]||u(v,f,l),o[l])for(var h in i)if(v[h]!==i[h])try{u(v,h,i[h])}catch(t){v[h]=i[h]}}}},function(t,n){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},function(t,n,e){"use strict";var r=e(16),o=e(102),i=e(14),u=e(17),c=e(58),a=u.set,f=u.getterFor("Array Iterator");t.exports=c(Array,"Array",(function(t,n){a(this,{type:"Array Iterator",target:r(t),index:0,kind:n})}),(function(){var t=f(this),n=t.target,e=t.kind,r=t.index++;return!n||r>=n.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==e?{value:r,done:!1}:"values"==e?{value:n[r],done:!1}:{value:[r,n[r]],done:!1}}),"values"),i.Arguments=i.Array,o("keys"),o("values"),o("entries")},function(t,n,e){var r=e(1),o=e(33),i=e(10),u=r("unscopables"),c=Array.prototype;null==c[u]&&i.f(c,u,{configurable:!0,value:o(null)}),t.exports=function(t){c[u][t]=!0}},function(t,n,e){"use strict";var r=this&&this.__awaiter||function(t,n,e,r){return new(e||(e=Promise))((function(o,i){function u(t){try{a(r.next(t))}catch(t){i(t)}}function c(t){try{a(r.throw(t))}catch(t){i(t)}}function a(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(u,c)}a((r=r.apply(t,n||[])).next())}))},o=this&&this.__generator||function(t,n){var e,r,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(e)throw new TypeError("Generator is already executing.");for(;u;)try{if(e=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,r=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=u.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=n.call(t,u)}catch(t){i=[6,t],r=0}finally{e=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};n.__esModule=!0,n.VideoUploader=void 0;var i=function(){function t(t){this.currentChunk=0,this.onProgressCallbacks=[],this.validateOptions(t),this.chunkSize=t.chunkSize||1048576,this.uploadEndpoint=t.uploadEndpoint||"https://ws.api.video/upload",this.uploadToken=t.uploadToken,this.file=t.file,this.fileSize=this.file.size,this.fileName=this.file.name,this.chunksCount=Math.ceil(this.fileSize/this.chunkSize)}return t.prototype.onProgress=function(t){this.onProgressCallbacks.push(t)},t.prototype.upload=function(){var t=this;return new Promise((function(n,e){return r(t,void 0,void 0,(function(){var t;return o(this,(function(e){switch(e.label){case 0:return this.currentChunk<this.chunksCount?[4,this.uploadCurrentChunk()]:[3,2];case 1:return t=e.sent(),this.videoId=t.videoId,this.currentChunk++,[3,0];case 2:return n(t),[2]}}))}))}))},t.prototype.validateOptions=function(t){["file","uploadToken"].forEach((function(n){if(!t[n])throw new Error('"'+n+'" is missing')}))},t.prototype.createFormData=function(t,n){var e=this.file.slice(t,n),r=new FormData;return this.videoId&&r.append("videoId",this.videoId),r.append("file",e,this.fileName),r},t.prototype.uploadCurrentChunk=function(){var t=this;return new Promise((function(n,e){var r=t.currentChunk*t.chunkSize,o=(t.currentChunk+1)*t.chunkSize,i=o>t.fileSize?t.fileSize:o,u="bytes "+r+"-"+(i-1)+"/"+t.fileSize,c=new XMLHttpRequest;c.open("POST",t.uploadEndpoint+"?token="+t.uploadToken,!0),c.setRequestHeader("Content-Range",u),c.onload=function(t){return n(JSON.parse(c.response))},c.onprogress=function(n){return t.onProgressCallbacks.forEach((function(e){return e({loaded:n.loaded+r,total:t.fileSize})}))},c.send(t.createFormData(r,i))}))},t}();n.VideoUploader=i}])}));