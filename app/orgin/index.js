$(function(){
  var imgWrapEle = $('#imgWrap')
  var multipleFileEle = $('#multipleFile')
  // 所有图片数据
  var allImgNames = []
  // 所有图片分组
  var categoryImgList = []
  // 图片分组 && className
  var categoryImgListObj = {}
  var submitFlag = false

  // 清空所有图片
  $('#clear').click(function () {
    $('#imgWrap').html('')
    $('.cv_fcv').html('')
    multipleFileEle.value = ''
    $('#chooseFile').html('请上传文件')
    allImgNames = []
    categoryImgList = []
    uniqueCategoryImgList = []
    categoryImgListObj = {}
  })

  $('#zoomBigImg').click(() => zoomImg('big'))

  $('#zoomSmallImg').click(() => zoomImg('small'))
  
  // 缩放图片
  function zoomImg(params) {
    const liList = $("li")
    for (let index = 0; index < liList.length; index++) {
      liList[index].setAttribute("class", params);
    }
  }
  
  // 本地上传图片
  $('#multipleFile').change(function (ev) {
    //判断 FileReader 是否被浏览器所支持
    if (!window.FileReader) return alert('您的浏览器暂不支持FileReader，请升级浏览器，或者使用新版谷歌浏览器');
    // 处理本地上传之后的图片
    handleFileList(ev, 'localImg')
  })

  function handleFileList(ev, type) {
    if (type === 'localImg') {
      var fileList = ev.target.files;  
      Object.getOwnPropertyNames(fileList).forEach(function(key){
        var fileName = fileList[key].name
        if (allImgNames.indexOf(fileName) === -1) {
          printImg(fileList[key])
          allImgNames.push(fileName)
        }
        var fileNameTit
        if (fileName.indexOf('_') !== -1) {
          fileNameTit = fileName.split('_')[0]
        }
        if (fileName.indexOf('-') !== -1) {
          fileNameTit = fileName.split('-')[0]
        }
        if (categoryImgList.findIndex(ele => ele === fileNameTit) === -1) {
          categoryImgList.push(fileNameTit)
        }
      });
      countImg()
      unqieClass()
      ev.target.value = ''
    }

    if (type === 'urlImg') {
      handleFileName(ev)
    }
  }
  
  // 显示总共上传多少张图片
  function countImg() {
    $('#chooseFile').html('共上传' + allImgNames.length + '个文件')
  }

  // 生成唯一的class 字符串
  function unqieClass() {
    for (let index = 0; index < categoryImgList.length; index++) {
      const element = categoryImgList[index];
      if (!categoryImgListObj[element]) {
        categoryImgListObj[element] = randomStr()
      }
    }
  }

  // 处理本地socket图片链接
  function handleFileName(url) {
    const urlList = url.split('/')
    var fileName = urlList.find((val) => {
      const itemUpperCase = val.toUpperCase()
      if (
        itemUpperCase.indexOf('BMP') !== -1 
        || itemUpperCase.indexOf('JPG') !== -1
        || itemUpperCase.indexOf('JPEG') !== -1
        || itemUpperCase.indexOf('PNG') !== -1
        || itemUpperCase.indexOf('GIF') !== -1
      ) {
        return val
      }      
    })
    var fileNameTit = fileName.split('?');
    fileNameTit = fileNameTit[0].split('.')[0];
    if (allImgNames.indexOf(fileName) === -1) {
      drawToImg(url, fileNameTit, 'urlImg')
      allImgNames.push(fileName)
    }
    if (categoryImgList.findIndex(ele => ele === fileNameTit) === -1) {
      categoryImgList.push(fileNameTit)
    }
    countImg()
    unqieClass()
  }

  // 开始打印图片
  function printImg(file) {
    if(!file.type.match('image/*')){
      alert('上传的图片必须是png,gif,jpg格式！');
      ev.target.value = ""; //显示文件的值赋值为空
      return;
    }
    var reader = new FileReader();  // 创建FileReader对象
    reader.readAsDataURL(file); // 读取file对象，读取完毕后会返回result 图片base64格式的结果
    reader.onload = function(e) {
      drawToImg(this.result, file.name);
    }
  }

  // 开始画图
  function drawToImg(result, name, type) {
    var nameTit
    if (name.indexOf('_') !== -1) {
      nameTit = name.split('_')[0]
    }
    if (name.indexOf('-') !== -1) {
      nameTit = name.split('-')[0]
    }
    if (type === 'urlImg') {
      nameTit = name
    }
    
    var imgClassName = categoryImgListObj[nameTit]
    // 设置图片列表UL
    var ulEle
    console.log('document.getElementsByClassName(imgClassName)', document.getElementsByClassName(imgClassName));
    if (document.getElementsByClassName(imgClassName)[0]) {
      ulEle = document.getElementsByClassName(imgClassName)[0]
    } else {
      ulEle = document.createElement('ul')
    }

    var menuTreeDiv
    var menuNodeUl
    if (document.getElementsByClassName('tree' + imgClassName)[0]) {
      menuTreeDiv = document.getElementsByClassName('tree' + imgClassName)[0]
      menuNodeUl = document.getElementsByClassName('node' + imgClassName)[0]
    } else {
      menuTreeDiv = $('<div></div>')
      menuTreeDiv.html('批次：' + nameTit)
      menuTreeDiv.addClass(`tree tree${imgClassName}`)
      menuNodeUl = $('<ul></ul>')
      menuNodeUl.addClass(`node node${imgClassName}`)
      $('.cv_fcv').append(menuTreeDiv)
      $('.cv_fcv').append(menuNodeUl)
    }

    var menuLi = document.createElement('li')
    menuLi.setAttribute('class', 'node-item')

    var menuChildDiv = document.createElement('div')
    menuChildDiv.setAttribute('class', 'tree')
    menuChildDiv.innerHTML = name

    menuLi.appendChild(menuChildDiv)
    
    menuNodeUl.append(menuLi)
    if (!document.getElementsByClassName(imgClassName+'title')[0]) {
      var divEle = document.createElement('div')
      divEle.setAttribute('class', imgClassName + 'title')
      divEle.setAttribute('style', "padding-bottom: 16px")
      divEle.innerHTML = '批次：' + name.split('_')[0]
      ulEle.appendChild(divEle)
    }
   
    var liEle = document.createElement('li')
    var imgEle = document.createElement('img')
    var spanEle = document.createElement('p')
    ulEle.setAttribute('class', imgClassName)
    liEle.setAttribute('class', 'small')
    imgEle.setAttribute('class', 'imgFlag')
    spanEle.setAttribute("style", "white-space: nowrap;width: 200px;overflow: hidden;text-overflow: ellipsis;font-size: 12px; height: 20px");
    imgEle.src = result
    spanEle.innerHTML = name
    ulEle.appendChild(liEle)
    liEle.appendChild(imgEle)
    liEle.appendChild(spanEle)
    imgWrapEle.append(ulEle)
    initMenu()
  }

  function randomStr() {
    return Math.random().toString(36).slice(-8)
  }

  $("#imgWrap").bind("contextmenu", function(){
    return false;
  })

  $('#imgWrap').click(function (event) {
    event = event || window.event;
    const imgSrc = event && event.target && event.target.currentSrc
    var target = event.target || event.srcElement;
    var imgParentNode = target.parentNode
    window.imgIndex = Array.prototype.slice.call($('img')).indexOf(event.target)
    if (target.tagName === 'IMG' && imgParentNode.tagName === 'LI') {
      const contentHtml = `
        <div class="modal-dialog-content" id="modal-dialog-content">
          <img id="modal-img" class="modal-img" src=${imgSrc} alt="大图" />
          <div class="img-title">${allImgNames [window.imgIndex]}</div>
          <div>
            <span id="prev-button"></span>
            <span class="close-button"></span>
            <span id="next-button"></span>
            <span class="modal-message"></span>
          </div>
        </div
      `;
      showModa(contentHtml)
    }
  })
  
  // 提交所有数据
  // $("#submit").click(function() {
  //   if (submitFlag) return
  //   submitFlag = true
  //   var formData = new FormData();
  //   var files = $('#multipleFile')[0]
  //   for(var index = 0; index < files.length; index++) {
  //     formData.append("file", files[index]);
  //   }
  //   var xhr = new XMLHttpRequest()
  //   xhr.onreadystatechange = function () {
  //     if (xhr.readyState == 4) {
  //       if (xhr.status == 200) {
  //         $('#message').html('提交成功，3秒后消失').attr('style', 'color: green')
  //         setTimeout(() => {
  //           $('#message').html('')
  //         }, 3000);
  //         submitFlag = false
  //       } else {
  //         $('#message').html('提交失败，3秒后消失').attr('style', 'color: red')
  //         setTimeout(() => {
  //           $('#message').html('')
  //         }, 3000);
  //         submitFlag = false
  //       }
  //     }
  //   }
  //   xhr.open('POST', 'http://139.199.18.143:8080/upload')
  //   xhr.send(formData)
  // });

  function showModa(contentHtml) {
    const layerEle = document.createElement('div');
    layerEle.setAttribute('class', 'modal-layer');
    const contentContainerEle = document.createElement('div');
    contentContainerEle.setAttribute('class', 'modal-dialog-container');
    contentContainerEle.innerHTML = contentHtml;
    layerEle.appendChild(contentContainerEle);
    document.body.appendChild(layerEle);
    $('.modal-img').attr({ height: window.innerHeight*0.9 });
    $('.img-title').attr('style', `left:  calc(${ $('#modal-dialog-content').width()*0.5 - $('.img-title').width()*0.5 }px)`);
  }
  // 关闭
  $(document).on('click','.close-button',function(){
    $('.modal-layer').remove()
  });
  // 上一个
  $(document).on('click','#prev-button',function(){
    var imgIndex = -- window.imgIndex
    if (imgIndex >= 0) {
      $('.img-title').html(allImgNames [imgIndex])
      $('.img-title').attr('style', `left:  calc(${ $('#modal-dialog-content').width()*0.5 - $('.img-title').width()*0.5 }px)`);
      var imgSrc = Array.prototype.slice.call($('.imgFlag'))[imgIndex].currentSrc
      $('#modal-img').attr('src', imgSrc)
    } else {
      showModalMsg('当前是第一页')
      setTimeout(() => {
        clearModalMsg()
      }, 3000);
      ++ window.imgIndex
    }
  });

  function clearModalMsg(params) {
    $('.modal-message').html('')
    $('.modal-message').css({
      "background-color":"",
      "padding": ""
    });
  }

  function showModalMsg(text) {
    $('.modal-message').html(text).css({
      "background-color":"#fff",
      "color":"red",
      "padding": "4px",
      "border-raduis": '4px'
    });
  }

  // 下一个
  $(document).on('click','#next-button',function(){
    var imgIndex = ++ window.imgIndex
    var imgLength =  Array.prototype.slice.call($('.imgFlag')).length
    if (imgIndex < imgLength) {
      $('.img-title').html(allImgNames [window.imgIndex])
      $('.img-title').attr('style', `left:  calc(${ $('#modal-dialog-content').width()*0.5 - $('.img-title').width()*0.5 }px)`);
      var imgSrc = Array.prototype.slice.call($('.imgFlag'))[imgIndex].currentSrc
      $('#modal-img').attr('src', imgSrc)
    } else {
      showModalMsg('当前是最后一页')
      setTimeout(() => {
        clearModalMsg()
      }, 3000);
      -- window.imgIndex
    }
  });
  
  // 菜单显示逻辑
  function initMenu() {
    $(".tree").each(function(index, element) {
      if($(this).next(".node").length>0){
        $(this).addClass("ce_ceng_close");
      }
    });
  }

  $('#menu').on('click','.tree',function(e){
    var ul = $(this).next(".node");
    var keyClassName = ul.attr('class') && ul.attr('class').split('node')[2];
    $("#imgWrap").find(`.${keyClassName}`).show().siblings().hide();
    if(ul.css("display")=="none") {
      ul.slideDown();
      $(this).addClass("ce_ceng_open");
      ul.find(".ce_ceng_close").removeClass("ce_ceng_open");
    } else {
      ul.slideUp();
      $(this).removeClass("ce_ceng_open");
      ul.find(".node").slideUp();
      ul.find(".ce_ceng_close").removeClass("ce_ceng_open");
    }
  })

  $('#menu').on('click','.cd_title',function(){
    var ul = $('.cv_fcv');
    $("#imgWrap").children().show();
    if (!ul.children().length) return;
    if(ul.css("display")=="none"){
      ul.slideDown();
    } else {
      ul.slideUp();
    }
  })

  var conn;
  var log = document.getElementById("log");
  var text_device_name = document.getElementById("text_device_name")
  function appendLog(item) {
    var doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
    log.appendChild(item);
    if (doScroll) {
      log.scrollTop = log.scrollHeight - log.clientHeight;
    }
  }
            
  function appendLogText(text) {
    var item = document.createElement("div");
    item.innerHTML = "<b>" + text + "</b>";
    appendLog(item);
  }
            
  function clickBase(event, command) {
    event.preventDefault()
    if (!conn) {
      appendLogText("no ws!")
      return
    }
    conn.send(JSON.stringify(command))
  }
            
  document.getElementById("btn_sane_init").onclick = function (event) {
    var command = { type: "command", name: "sane_init" }
    clickBase(event, command)
  }

  document.getElementById("btn_sane_list_devices").onclick = function (event) {
    var command = { type: "command", name: "sane_list_devices" }
    clickBase(event, command)
  }

  document.getElementById("btn_sane_open_device").onclick = function (event) {
    var command = { type: "command", name: "sane_open_device", parameters: { deviceName: text_device_name.value } }
    clickBase(event, command)
  }

  document.getElementById("btn_sane_device_list_options").onclick = function (event) {
    var command = { type: "command", name: "sane_device_list_options" }
    clickBase(event, command)
  }

  document.getElementById("btn_sane_device_get_parameters").onclick = function (event) {
    var command = { type: "command", name: "sane_device_get_parameters" }
    clickBase(event, command)
  }

  document.getElementById("btn_sane_device_batch_scan").onclick = function (event) {
    var command = { type: "command", name: "sane_device_batch_scan" }
    clickBase(event, command)
  }

  document.getElementById("btn_sane_device_close").onclick = function (event) {
    var command = { type: "command", name: "sane_device_close" }
    clickBase(event, command)
  }

  document.getElementById("btn_sane_exit").onclick = function (event) {
    var command = { type: "command", name: "sane_exit" }
    clickBase(event, command)
  }

  function onSaneEvent(saneEvent) {
    switch (saneEvent.name) {
      case "sane_list_devices":
        switch (saneEvent.result) {
          case "success":
            text_device_name.value = saneEvent.devices[0].Name
          break
        }
      break
      case "sane_device_image_scanned":
        console.log(saneEvent.index)
        var url ="http://" + document.location.host +"/"+ saneEvent.imagePath
        console.log(url)
        // 统一调用添加图片函数
        handleFileList(url, 'urlImg')
      break
    }
  }

  if (window["WebSocket"]) {
    conn = new WebSocket("ws://" + document.location.host + "/ws/sane");
    conn.onopen = function (evt) {
      appendLogText("hyrh sane ws connected")
    }

    conn.onclose = function (evt) {
      appendLogText("Connection closed.")
    };

    conn.onmessage = function (evt) {
      console.log(evt)
      appendLogText(evt.data)
      var saneMsg = JSON.parse(evt.data)
      switch (saneMsg.type) {
        case "event":
          onSaneEvent(saneMsg)
        break
      }
    };

  } else {
    var item = document.createElement("div");
    item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
    appendLog(item);
  }
});
