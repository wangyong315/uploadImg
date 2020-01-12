/*
UploadiFive 1.2.3
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
Released under the UploadiFive Standard License <http://www.uploadify.com/uploadifive-standard-license>
*/
(function(d){var o={init:function(t){return this.i(function(){var s=d(this);s.data("uploadifive",{t:{},o:0,l:0,u:{count:0,selected:0,s:0,p:0,v:0,h:0},m:{g:0,_:0,F:0,p:0,count:0}});var p=s.data("uploadifive");var c=p.D=d.extend({I:true,T:false,L:"Select Files",C:false,N:true,M:false,q:"Filedata",O:0,U:false,k:{},height:30,X:false,method:"post",R:true,B:[],S:false,A:0,P:false,j:0,H:0,V:0,Y:"uploadifive.php",width:100},t);var r;if(c.U){r=c.U.split("|")}if(isNaN(c.O)){var e=parseInt(c.O)*1.024;if(c.O.indexOf("KB")>-1){c.O=e*1e3}else if(c.O.indexOf("MB")>-1){c.O=e*1e6}else if(c.O.indexOf("GB")>-1){c.O=e*1e9}}else{c.O=c.O*1024}p.Z=d('<input type="file">').G({"font-size":c.height+"px",opacity:0,position:"absolute",right:"-3px",top:"-3px","z-index":999});p.K=function(){var e=p.Z.clone();var t=e.name="input"+p.o++;if(c.R){e.W("multiple",true)}if(c.U){e.W("accept",c.U)}e.bind("change",function(){p.u.selected=0;p.u.s=0;p.u.p=0;p.u.v=0;var e=this.files.length;p.u.selected=e;if(p.u.count+e>c.A&&c.A!==0){if(d.$("onError",c.B)<0){alert("The maximum number of queue items has been reached ("+c.A+").  Please select fewer files.")}if(typeof c.J==="function"){c.J.call(s,"QUEUE_LIMIT_EXCEEDED")}}else{for(var i=0;i<e;i++){file=this.files[i];p.ee(file)}p.t[t]=this;p.K()}if(c.I){o.upload.call(s)}if(typeof c.ie==="function"){c.ie.call(s,p.u)}});if(p.te){p.te.hide()}p.button.append(e);p.te=e};p.fe=function(e){d(p.t[e]).remove();delete p.t[e];p.o--};p.ne=function(e){e.preventDefault();e.stopPropagation();p.u.selected=0;p.u.s=0;p.u.p=0;p.u.v=0;var i=e.dataTransfer;var t=i.name="input"+p.o++;var f=i.files.length;p.u.selected=f;if(p.u.count+f>c.A&&c.A!==0){if(d.$("onError",c.B)<0){alert("The maximum number of queue items has been reached ("+c.A+").  Please select fewer files.")}if(typeof c.J==="function"){c.J.call(s,"QUEUE_LIMIT_EXCEEDED")}}else{for(var n=0;n<f;n++){file=i.files[n];p.ee(file);if(r&&r.indexOf(file.type)===-1){p.error("FORBIDDEN_FILE_TYPE",file)}}p.t[t]=i}if(c.I){o.upload.call(s)}if(typeof c.re==="function"){c.re.call(s,i.files,i.files.length)}};p.oe=function(e){for(var i in p.t){input=p.t[i];limit=input.files.length;for(var t=0;t<limit;t++){existingFile=input.files[t];if(existingFile.name==e.name&&!existingFile.complete){return true}}}return false};p.le=function(e){for(var i in p.t){input=p.t[i];limit=input.files.length;for(var t=0;t<limit;t++){existingFile=input.files[t];if(existingFile.name==e.name&&!existingFile.complete){p.u.s++;o.cancel.call(s,existingFile,true)}}}};if(c.X===false){p.ae=d('<div class="uploadifive-queue-item">'+'<a class="close" href="#">X</a>'+'<div><span class="filename"></span><span class="fileinfo"></span></div>'+'<div class="progress">'+'<div class="progress-bar"></div>'+"</div>"+"</div>")}else{p.ae=d(c.X)}p.ee=function(e){if(d.$("onAddQueueItem",c.B)<0){p.le(e);e.ae=p.ae.clone();e.ae.W("id",c.id+"-file-"+p.l++);e.ae.find(".close").bind("click",function(){o.cancel.call(s,e);return false});var i=e.name;if(i.length>c.H&&c.H!==0){i=i.substring(0,c.H)+"..."}e.ae.find(".filename").ue(i);e.ae.data("file",e);p.se.append(e.ae)}if(typeof c.pe==="function"){c.pe.call(s,e)}if(e.size>c.O&&c.O!==0){p.error("FILE_SIZE_LIMIT_EXCEEDED",e)}else{p.u.v++;p.u.count++}};p.ce=function(e,i,t){if(!t)t=0;var f=i?0:500;if(e.ae){if(e.ae.find(".fileinfo").ue()!=" - Completed"){e.ae.find(".fileinfo").ue(" - Cancelled")}e.ae.find(".progress-bar").width(0);e.ae.ve(t).de(f,function(){d(this).remove()});delete e.ae;p.u.count--}};p.he=function(){var e=0;for(var i in p.t){input=p.t[i];limit=input.files.length;for(var t=0;t<limit;t++){file=input.files[t];if(!file.me&&!file.complete){e++}}}return e};p.Ee=function(i){if(d.$("onCheck",c.B)<0){d.ye({async:false});var e=d.extend(c.k,{filename:i.name});d.ge(c.C,e,function(e){i._e=parseInt(e)});if(i._e){if(!confirm("A file named "+i.name+" already exists in the upload folder.\nWould you like to replace it?")){o.cancel.call(s,i);return true}}}if(typeof c.Fe==="function"){c.Fe.call(s,i,i._e)}return false};p.De=function(a,u){if(!a.me&&!a.complete&&!a.Ie){a.Ie=true;p.m.g++;p.m.xe++;xhr=a.be=new XMLHttpRequest;if(typeof FormData==="function"||typeof FormData==="object"){var e=new FormData;e.append(c.q,a);for(var i in c.k){e.append(i,c.k[i])}xhr.open(c.method,c.Y,true);xhr.upload.addEventListener("progress",function(e){if(e.lengthComputable){p.we(e,a)}},false);xhr.addEventListener("load",function(e){if(this.readyState==4){a.Ie=false;if(this.status==200){if(a.be.responseText!=="Invalid file type."){p.Te(e,a,u)}else{p.error(a.be.responseText,a,u)}}else if(this.status==404){p.error("404_FILE_NOT_FOUND",a,u)}else if(this.status==403){p.error("403_FORBIDDEN",a,u)}else{p.error("Unknown Error",a,u)}}});xhr.send(e)}else{var t=new FileReader;t.onload=function(e){var i="-------------------------"+(new Date).getTime(),t="--",f="\r\n",n="";n+=t+i+f;n+='Content-Disposition: form-data; name="'+c.q+'"';if(a.name){n+='; filename="'+a.name+'"'}n+=f;n+="Content-Type: application/octet-stream"+f+f;n+=e.target.result+f;for(var r in c.k){n+=t+i+f;n+='Content-Disposition: form-data; name="'+r+'"'+f+f;n+=c.k[r]+f}n+=t+i+t+f;xhr.upload.addEventListener("progress",function(e){p.we(e,a)},false);xhr.addEventListener("load",function(e){a.Ie=false;var i=this.status;if(i==404){p.error("404_FILE_NOT_FOUND",a,u)}else{if(a.be.responseText!="Invalid file type."){p.Te(e,a,u)}else{p.error(a.be.responseText,a,u)}}},false);var o=c.Y;if(c.method=="get"){var l=d(c.k).Le();o+=l}xhr.open(c.method,c.Y,true);xhr.setRequestHeader("Content-Type","multipart/form-data; boundary="+i);if(typeof c.Ce==="function"){c.Ce.call(s,a)}xhr.sendAsBinary(n)};t.readAsBinaryString(a)}}};p.we=function(e,i){var t;if(d.$("onProgress",c.B)<0){if(e.lengthComputable){t=Math.round(e.loaded/e.total*100)}i.ae.find(".fileinfo").ue(" - "+t+"%");i.ae.find(".progress-bar").G("width",t+"%")}if(typeof c.Ne==="function"){c.Ne.call(s,i,e)}};p.error=function(e,i,t){if(d.$("onError",c.B)<0){switch(e){case"404_FILE_NOT_FOUND":errorMsg="404 Error";break;case"403_FORBIDDEN":errorMsg="403 Forbidden";break;case"FORBIDDEN_FILE_TYPE":errorMsg="Forbidden File Type";break;case"FILE_SIZE_LIMIT_EXCEEDED":errorMsg="File Too Large";break;default:errorMsg="Unknown Error";break}i.ae.Me("error").find(".fileinfo").ue(" - "+errorMsg);i.ae.find(".progress").remove()}if(typeof c.J==="function"){c.J.call(s,e,i)}i.me=true;if(e=="404_FILE_NOT_FOUND"){p.m.p++}else{p.u.p++}if(t){o.upload.call(s,null,true)}};p.Te=function(e,i,t){if(d.$("onUploadComplete",c.B)<0){i.ae.find(".progress-bar").G("width","100%");i.ae.find(".fileinfo").ue(" - Completed");i.ae.find(".progress").qe(250);i.ae.Me("complete")}if(typeof c.Oe==="function"){c.Oe.call(s,i,i.be.responseText)}if(c.P){setTimeout(function(){o.cancel.call(s,i)},3e3)}i.complete=true;p.m.F++;p.m.count++;p.m.g--;delete i.be;if(t){o.upload.call(s,null,true)}};p.Ue=function(){if(typeof c.ke==="function"){c.ke.call(s,p.m)}};if(window.File&&window.FileList&&window.Blob&&(window.FileReader||window.FormData)){c.id="uploadifive-"+s.W("id");p.button=d('<div id="'+c.id+'" class="uploadifive-button">'+c.L+"</div>");if(c.T)p.button.Me(c.T);p.button.G({height:c.height,"line-height":c.height+"px",overflow:"hidden",position:"relative","text-align":"center",width:c.width});s.Re(p.button).Xe(p.button).hide();p.K.call(s);if(!c.S){c.S=c.id+"-queue";p.se=d('<div id="'+c.S+'" class="uploadifive-queue" />');p.button.Be(p.se)}else{p.se=d("#"+c.S)}if(c.N){var i=c.M?d(c.M):p.se.get(0);i.addEventListener("dragleave",function(e){e.preventDefault();e.stopPropagation()},false);i.addEventListener("dragenter",function(e){e.preventDefault();e.stopPropagation()},false);i.addEventListener("dragover",function(e){e.preventDefault();e.stopPropagation()},false);i.addEventListener("drop",p.ne,false)}if(!XMLHttpRequest.prototype.sendAsBinary){XMLHttpRequest.prototype.sendAsBinary=function(e){function byteValue(e){return e.charCodeAt(0)&255}var i=Array.prototype.map.call(e,byteValue);var t=new Uint8Array(i);this.send(t.buffer)}}if(typeof c.Se==="function"){c.Se.call(s)}}else{if(typeof c.Ae==="function"){c.Ae.call(s)}return false}})},debug:function(){return this.i(function(){console.log(d(this).data("uploadifive"))})},Pe:function(){this.i(function(){var e=d(this),t=e.data("uploadifive"),f=t.D;for(var n in t.t){input=t.t[n];limit=input.files.length;for(i=0;i<limit;i++){file=input.files[i];o.cancel.call(e,file)}}if(typeof f.Qe==="function"){f.Qe.call(e,d("#"+t.D.S))}})},cancel:function(f,n){this.i(function(){var e=d(this),i=e.data("uploadifive"),t=i.D;if(typeof f==="string"){if(!isNaN(f)){fileID="uploadifive-"+d(this).W("id")+"-file-"+f}f=d("#"+fileID).data("file")}f.me=true;i.je++;if(f.Ie){i.m.g--;f.Ie=false;f.be.abort();delete f.be;o.upload.call(e)}if(d.$("onCancel",t.B)<0){i.ce(f,n)}if(typeof t.ze==="function"){t.ze.call(e,f)}})},upload:function(n,r){this.i(function(){var e=d(this),i=e.data("uploadifive"),t=i.D;if(n){i.De.call(e,n)}else{if(i.m.count+i.m.g<t.V||t.V===0){if(!r){i.m.xe=0;i.m.He=0;i.m.p=0;var f=i.he();if(typeof t.Ve==="function"){t.Ve.call(e,f)}}d("#"+t.S).find(".uploadifive-queue-item").Ye(".error, .complete").i(function(){_file=d(this).data("file");if(i.m.g>=t.j&&t.j!==0||i.m.g>=t.V&&t.V!==0||i.m.count>=t.V&&t.V!==0){return false}if(t.C){_file.Ze=true;skipFile=i.Ee(_file);_file.Ze=false;if(!skipFile){i.De(_file,true)}}else{i.De(_file,true)}});if(d("#"+t.S).find(".uploadifive-queue-item").Ye(".error, .complete").size()===0){i.Ue()}}else{if(i.m.g===0){if(d.$("onError",t.B)<0){if(i.he()>0&&t.V!==0){alert("The maximum upload limit has been reached.")}}if(typeof t.J==="function"){t.J.call(e,"UPLOAD_LIMIT_EXCEEDED",i.he())}}}}})},Ge:function(){this.i(function(){var e=d(this),i=e.data("uploadifive"),t=i.D;o.Pe.call(e);if(!t.S)d("#"+t.S).remove();e.Ke("input").remove();e.show().insertBefore(i.button);i.button.remove();if(typeof t.We==="function"){t.We.call(e)}})}};d.Je.$e=function(e){if(o[e]){return o[e].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof e==="object"||!e){return o.init.apply(this,arguments)}else{d.error("The method "+e+" does not exist in $.uploadify")}}})(jQuery);