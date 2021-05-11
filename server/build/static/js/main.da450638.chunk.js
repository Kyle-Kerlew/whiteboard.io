(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{119:function(e,t,n){},120:function(e,t,n){},121:function(e,t,n){},158:function(e,t,n){},159:function(e,t,n){},165:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),i=n(11),o=n.n(i),a=(n(119),n(120),n(15)),s=n(20),u=(n(121),n(213)),l=n(94),d=Object(l.io)(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).BASE_URL),j=n(96),h=n(199),b=n(3);var f=function(){var e=Object(a.f)(),t=Object(r.useState)(),n=Object(s.a)(t,2),c=n[0],i=n[1];return Object(r.useEffect)((function(){d.emit("counterRequest",null),d.on("counter",(function(e){console.log("read counter"),i(e)}))}),[]),Object(b.jsxs)(h.a,{className:"flex-container",fluid:!0,children:[Object(b.jsx)("h1",{style:{fontSize:"60px",textAlign:"center",verticalAlign:"top"},children:"Whiteboard IO"}),Object(b.jsx)("p",{style:{fontSize:"18px",textAlign:"center",maxWidth:"490px"},children:"Whiteboard IO is an open source tool for collaborative drawing in real time. It simplifies planning, instructing, and documenting."}),Object(b.jsx)(j.a,{onClick:function(){var t=btoa(Object(u.a)());e.push("/".concat(t)),d.emit("create-whiteboard",{whiteboardId:t,data:[]})},style:{alignSelf:"center"},variant:"primary",size:"lg",children:"Let's Start"}),Object(b.jsxs)("div",{style:{fontSize:"60px",paddingTop:"50px",textAlign:"center",maxWidth:"490px"},children:[c,Object(b.jsx)("p",{style:{fontSize:"18px",textAlign:"center",maxWidth:"490px"},children:"Whiteboards have been created."})]})]})},O=n(51),x=n.n(O),p=(n(158),n.p+"static/media/cross-icon.34bfe4e5.svg"),g=n.p+"static/media/link-icon.b99979f6.svg",v=n.p+"static/media/zoom-in-icon.09ff13d6.svg",m=n.p+"static/media/zoom-out-icon.0a493555.svg",y=function(e){var t=e.width,n=e.height,r=e.onClick;return Object(b.jsx)("svg",{onClick:r,width:t+"px",height:n+"px",xmlns:"http://www.w3.org/2000/svg",children:Object(b.jsx)("circle",{cx:"".concat(t/2),cy:"".concat(n/2),r:"".concat(n/2-10),stroke:"black",strokeWidth:"3",fill:"black"})})},w=function(e){var t=e.mouseDown,n=e.id,c=e.setPaintSize,i=e.zoomIn,o=e.zoomOut,a=e.clearBoard,u=e.setIsPopupVisible,l=(e.isPopupVisible,Object(r.useState)(!1)),d=Object(s.a)(l,2),j=d[0],h=d[1],f=Object(r.createRef)(),O=Object(r.useRef)();return Object(r.useEffect)((function(){return O.current=t})),Object(r.useEffect)((function(){t&&"0"===f.current.style.opacity?setTimeout((function(){f.current&&(f.current.style.display="none")}),500):f.current.style.display="block"})),Object(b.jsx)("div",{id:n,ref:function(e){return f.current=e},style:t?{opacity:0,animation:"fadeOutComplete .5s forwards"}:O.current&&!t?{opacity:.5,animation:"fadeInFromComplete .5s forwards"}:j?{opacity:1,animation:"fadeIn .5s forwards"}:{opacity:.5,animation:"fadeOut .5s forwards"},className:"bottomtoolbar",onMouseEnter:function(){return h(!0)},onMouseLeave:function(){return h(!1)},children:Object(b.jsxs)("ul",{children:[Object(b.jsx)("li",{children:Object(b.jsx)(y,{onClick:function(){return c(5)},width:25,height:25})}),Object(b.jsx)("li",{children:Object(b.jsx)(y,{onClick:function(){return c(30)},width:50,height:50})}),Object(b.jsx)("li",{children:Object(b.jsx)(y,{onClick:function(){return c(55)},width:75,height:75})}),Object(b.jsx)("div",{className:"divider"}),Object(b.jsx)("li",{children:Object(b.jsx)("img",{width:"36px",height:"36px",onClick:i,src:v,alt:"Zoom In"})}),Object(b.jsx)("li",{children:Object(b.jsx)("img",{width:"36px",height:"36px",onClick:o,src:m,alt:"Zoom Out"})}),Object(b.jsx)("div",{className:"divider"}),Object(b.jsx)("li",{children:Object(b.jsx)("img",{width:"36px",height:"36px",onClick:a,src:p,alt:"Clear Board"})}),Object(b.jsx)("li",{children:Object(b.jsx)("img",{width:"36px",height:"36px",onClick:function(){return u(!0)},src:g,alt:"Get Share Link"})})]})})},k=(n(159),function(e){var t=Object(r.useState)(!1),n=Object(s.a)(t,2),c=n[0],i=n[1],o=Object(r.useRef)(),a=Object(r.createRef)();return Object(r.useEffect)((function(){return o.current=e.mouseDown})),Object(r.useEffect)((function(){e.mouseDown&&"0"===a.current.style.opacity?setTimeout((function(){a.current&&(a.current.style.display="none")}),500):a.current.style.display="block"})),Object(b.jsx)("div",{ref:function(e){return a.current=e},style:e.mouseDown?{opacity:0,animation:"fadeOutComplete .5s linear"}:o.current&&!e.mouseDown?{opacity:.5,animation:"fadeInFromComplete .5s linear"}:c?{opacity:1,animation:"fadeIn 1s linear"}:{opacity:.5,animation:"fadeOut .5s linear"},className:"sidetoolbar",onMouseEnter:function(){return i(!0)},onMouseLeave:function(){return i(!1)},children:Object(b.jsxs)("ul",{children:[Object(b.jsx)("li",{children:Object(b.jsx)("svg",{onClick:function(){return e.setColor("black")},height:"50",width:"50",children:Object(b.jsx)("circle",{cx:"25",cy:"25",r:"15",stroke:"black",strokeWidth:"3",fill:"black"})})}),Object(b.jsx)("li",{children:Object(b.jsx)("svg",{onClick:function(){return e.setColor("red")},height:"50",width:"50",children:Object(b.jsx)("circle",{cx:"25",cy:"25",r:"15",stroke:"red",strokeWidth:"3",fill:"red"})})}),Object(b.jsx)("li",{children:Object(b.jsx)("svg",{onClick:function(){return e.setColor("blue")},height:"50",width:"50",children:Object(b.jsx)("circle",{cx:"25",cy:"25",r:"15",stroke:"blue",strokeWidth:"3",fill:"blue"})})}),Object(b.jsx)("li",{children:Object(b.jsx)("svg",{onClick:function(){return e.setColor("cyan")},height:"50",width:"50",children:Object(b.jsx)("circle",{cx:"25",cy:"25",r:"15",stroke:"cyan",strokeWidth:"3",fill:"cyan"})})}),Object(b.jsx)("li",{children:Object(b.jsx)("svg",{onClick:function(){return e.setColor("yellow")},height:"50",width:"50",children:Object(b.jsx)("circle",{cx:"25",cy:"25",r:"15",stroke:"yellow",strokeWidth:"3",fill:"yellow"})})}),Object(b.jsx)("li",{children:Object(b.jsx)("svg",{onClick:function(){return e.setColor("green")},height:"50",width:"50",children:Object(b.jsx)("circle",{cx:"25",cy:"25",r:"15",stroke:"green",strokeWidth:"3",fill:"green"})})})]})})}),C=(n(93),n(214)),S=n(204),T=n(205),E=n(206),R=n(210),I=n(208),W=n(209),P=n(97),D=n.n(P);var _=function(e){var t=e.text,n=e.whiteboardId,r=e.setIsVisible,c=e.showSuccessToast,i="".concat(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).BASE_URL);return Object(b.jsxs)(C.a,{open:!0,onClose:function(){return r(!1)},"aria-labelledby":"form-dialog-title",children:[Object(b.jsx)(S.a,{id:"form-dialog-title",children:"Share With Your Friends"}),Object(b.jsxs)(T.a,{children:[Object(b.jsx)(E.a,{children:t}),Object(b.jsx)(R.a,{margin:"dense",type:"text",id:"value",fullWidth:!0,disabled:!0,value:i+n})]}),Object(b.jsx)(I.a,{children:Object(b.jsx)(W.a,{onClick:function(){!function(){var e=document.getElementById("value");D()(e.value)}(),r(!1),c()},color:"primary",children:"Copy"})})]})},z=n(215),L=n(211);var M=function(){var e=Object(r.useRef)(),t=Object(r.useState)(),n=Object(s.a)(t,2),c=n[0],i=n[1],o=Object(r.useState)(25),u=Object(s.a)(o,2),l=u[0],j=u[1],h=Object(r.useState)(!1),f=Object(s.a)(h,2),O=f[0],p=f[1],g=Object(r.useState)(!1),v=Object(s.a)(g,2),m=v[0],y=v[1],C=Object(r.useState)(!1),S=Object(s.a)(C,2),T=S[0],E=S[1],R=Object(r.useState)("black"),I=Object(s.a)(R,2),W=I[0],P=I[1],D=Object(a.g)("/:canvasId").params.canvasId,M=Object(r.useRef)([]),N=Object(r.useRef)(),A=Object(r.useRef)(),B=Object(r.useRef)(!1),F=Object(r.useRef)(1),H=Object(r.useRef)(0),K=Object(r.useRef)(0),Y=Object(r.useRef)(0),U=Object(r.useRef)(0),V=Object(r.useRef)(Y.current),X=Object(r.useRef)(U.current);function J(t,n){if(!x.a.isEmpty(t))for(var r=0;r<t.length;r++){var c=t[r].moveTo,i=t[r].lineTo;n.setTransform(1,0,0,1,0,0),n.scale(e.current.width/V.current,e.current.height/X.current),n.translate(-H.current,-K.current),n.beginPath(),n.moveTo(c.x,c.y),n.lineTo(i.x,i.y),n.lineJoin="round",n.lineCap="round",n.lineWidth=i.size,n.strokeStyle=i.color,n.stroke(),n.closePath()}}function Z(t){var n=e.current.getContext("2d");if(x.a.isEmpty(t))n.clearRect(0,0,e.current.width,e.current.height);else{var r=t.moveTo,c=t.lineTo;n.scale(F.current,F.current),n.beginPath(),n.moveTo(r.x,r.y),n.lineTo(c.x,c.y),n.lineJoin="round",n.lineCap="round",n.lineWidth=c.size,n.strokeStyle=c.color,n.stroke(),n.closePath()}}function q(){var t=e.current.getContext("2d");J(M.current,t)}function G(e){e.ctrlKey&&"="===e.key&&(e.preventDefault(),ne()),e.ctrlKey&&"-"===e.key&&(e.preventDefault(),re())}function Q(t){var n=e.current.getContext("2d");p(!0),n.beginPath(),"touchmove"===t.type?(B.current=!0,N.current=t.touches[0].pageX,A.current=t.touches[0].pageY):(B.current=!1,N.current=t.pageX,A.current=t.pageY),n.moveTo(N,A)}function $(t){var n=e.current.getContext("2d");if(O){n.lineJoin="round",n.lineCap="round",n.lineWidth=l,n.strokeStyle=W,"touchmove"===t.type?(n.lineTo(t.touches[0].pageX,t.touches[0].pageY),B.current=!0):(n.lineTo(t.pageX,t.pageY),B.current=!1),n.stroke();var r={whiteboardId:D,moveTo:{x:N.current,y:A.current},lineTo:{x:t.pageX,y:t.pageY,size:l,color:W}};d.emit("drawing-data",r),M.current.push(r),N.current=t.pageX,A.current=t.pageY}}function ee(t){var n=e.current.getContext("2d");p(!1),n.closePath()}function te(){var t=e.current.width/2,n=e.current.height/2,r=t/e.current.width*V.current+H.current,c=n/e.current.height*X.current+K.current;V.current*=F.current,X.current*=F.current,(V.current>Y.current||X.current>U.current)&&(V.current=Y.current,X.current=U.current,r=V/2,c=X/2),H.current=r-V/2,K.current=c-X/2,M.current.forEach((function(e){e.moveTo.x*=F.current,e.moveTo.y*=F.current,e.lineTo.x*=F.current,e.lineTo.y*=F.current}))}function ne(){var t=e.current.getContext("2d");t.clearRect(0,0,e.current.width,e.current.height),F.current=1.5,te(),J(M.current,t)}function re(){var t=e.current.getContext("2d");t.clearRect(0,0,e.current.width,e.current.height),F.current=2/3,te(),J(M.current,t)}return Object(r.useEffect)((function(){return Z(c)}),[c]),Object(r.useEffect)((function(){var t=e.current.getContext("2d");return window.addEventListener("resize",q),window.addEventListener("keydown",G),d.emit("load-data",{whiteboardId:D}),d.on("data-loaded",(function(e){x.a.isEmpty(e)||(M.current=e,J(e,t))})),d.on("empty-page-from-server",(function(){return i([])})),d.on("drawing-data-from-server",(function(e){x.a.isEmpty(e)||(i(e),M.current.push(e))})),function(){window.removeEventListener("resize",q),window.removeEventListener("keydown",G)}}),[]),Object(b.jsxs)("div",{className:"canvas-container",children:[m&&Object(b.jsx)("div",{className:"container",children:Object(b.jsx)(_,{whiteboardId:D,setIsVisible:y,showSuccessToast:function(){E(!0)},text:"Copy this link to share and collaborate!"})}),Object(b.jsx)("canvas",{onMouseLeave:function(){return p(!1)},id:"drawing-board",ref:function(t){return e.current=t},onTouchStart:Q,onClick:function(t){var n=e.current.getContext("2d");n.beginPath(),N.current=t.pageX,A.current=t.pageY,n.moveTo(N.current,A.current),n.lineTo(N.current+1,A.current+1),n.lineJoin="round",n.lineCap="round";var r={whiteboardId:D,lineTo:{x:N.current+1,y:A.current+1,size:l,color:W},moveTo:{x:N.current,y:A.current}};d.emit("drawing-data",r),M.current.push(r),n.lineWidth=l,n.strokeStyle=W,n.stroke(),n.closePath()},onTouchMove:$,onMouseDown:Q,onMouseUp:ee,onTouchEnd:ee,onMouseMove:$,width:2e3,height:1500,children:"Please update your browser."}),T&&Object(b.jsx)(z.a,{onClose:function(){return E(!1)},open:T,autoHideDuration:6e3,children:Object(b.jsx)(L.a,{severity:"success",children:"We've copied the link to your clipboard!"})}),Object(b.jsx)(w,{mouseDown:O,drawPoint:Z,setMouseDown:p,setIsPopupVisible:y,setPaintSize:j,clearBoard:function(){d.emit("empty-page",D),i([]),M.current=[]},zoomIn:ne,zoomOut:re,id:"bottom-toolbar"}),Object(b.jsx)(k,{mouseDown:O,drawPoint:Z,setMouseDown:p,setColor:P})]})};var N=function(){return Object(b.jsxs)(a.c,{children:[Object(b.jsx)(a.a,{exact:!0,path:"/",component:f}),Object(b.jsx)(a.a,{path:"/:canvasId",component:M})]})};var A=function(){return Object(b.jsx)(N,{})},B=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,216)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,i=t.getLCP,o=t.getTTFB;n(e),r(e),c(e),i(e),o(e)}))},F=n(48),H=(n(161),n(52)),K=n(74),Y=function(){return Object(b.jsxs)(H.a,{bg:"light",expand:"lg",className:"fixed-top",children:[Object(b.jsx)(H.a.Brand,{href:"/",children:"Whiteboard IO"}),Object(b.jsx)(H.a.Toggle,{"aria-controls":"basic-navbar-nav"}),Object(b.jsx)(H.a.Collapse,{id:"basic-navbar-nav",children:Object(b.jsx)(K.a,{className:"mr-auto",children:Object(b.jsx)(K.a.Link,{href:"/",children:"Home"})})})]})};o.a.render(Object(b.jsx)(c.a.StrictMode,{children:Object(b.jsxs)(F.a,{children:[Object(b.jsx)(Y,{}),Object(b.jsx)(A,{})]})}),document.getElementById("root")),B()},93:function(e,t,n){}},[[165,1,2]]]);
//# sourceMappingURL=main.da450638.chunk.js.map