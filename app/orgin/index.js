$(function() {
  function randomStr() { // 生成唯一字符串
    return Math.random().toString(36).slice(-8)
  }
  // 所有图片数据
  var allImgNames = []
  // 所有图片分组
  var categoryImgList = []
  // 图片分组 && className
  var categoryImgListObj = {}

  // 清空所有图片
  $('#clear').click(function () {
    $('#imgWrap').html('')
    $('.cv_fcv').html('')
    $('#multipleFile').value = ''
    $('#chooseFile').html('请上传文件')
    allImgNames = []
    categoryImgList = []
    categoryImgListObj = {}
  })

  $('#zoomBigImg').click(() => zoomImg('big'))

  $('#zoomSmallImg').click(() => zoomImg('small'))
  
  // 缩放图片
  function zoomImg(params) {
    const liList = $("li")
    for (let index = 0; index < liList.length; index++) {
      $(liList[index]).removeClass('big small').addClass(params);
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
  
  // 本地上传图片
  $('#multipleFile').change(function (ev) {
    //判断 FileReader 是否被浏览器所支持
    if (!window.FileReader) return alert('您的浏览器暂不支持FileReader，请升级浏览器，或者使用新版谷歌浏览器');
    // 处理本地上传之后的图片
    handleFileList(ev)
  })

  function handleFileList(ev) {
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
 
  // 处理本地socket图片链接
  function handleFileName(url) {
    const urlList = url.split('/')
    var fileName = urlList.find((val) => {
      const itemUpperCase = val.toUpperCase()
      const imgCate = ['BMP', 'JPG', 'JPEG', 'PNG', 'GIF']
      if (imgCate.includes(itemUpperCase)) return val
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
    if ($('.activeImgWrap')[0]) {
      ulEle = $($('.activeImgWrap')[0])
    } else if ($(`.${imgClassName}`)[0]) {
      ulEle = $($(`.${imgClassName}`)[0])
    } else {
      ulEle = $('<ul></ul>')
    }
   
    if (!$(`.title${imgClassName}`)[0] && !$('.activeImgWrap')[0]) {
      var divEle = $('<div></div>')
      divEle.addClass(`title${imgClassName}`)
      divEle.css("padding-bottom: 16px")
      divEle.html('批次：' + name.split('_')[0])
      ulEle.append(divEle)
    }
   
    var liEle = $('<li></li>')
    var imgEle = $('<img />')
    var spanEle = $('<p></p>')
    ulEle.addClass(imgClassName)
    liEle.addClass('small')
    liEle.attr('draggable', 'true')
    imgEle.addClass('imgFlag')
    imgEle.attr({
      ondragstart: 'return false;',
      src: result
    })
    spanEle.css({
      'white-space': 'nowrap',
      width: '200px',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'font-size': '12px',
      height: '20px'
    });
    spanEle.html(name)
    ulEle.append(liEle)
    liEle.append(imgEle)
    liEle.append(spanEle)
    $('#imgWrap').append(ulEle)

    // 菜单的逻辑
    var menuTreeDiv
    var menuNodeUl
    if ($('.activeTree')[0]) {
      menuNodeUl = $($('.activeTree')[0])
      menuNodeUl = $($('.activeNode')[0])
    } else if ($(`.tree${imgClassName}`)[0]) {
      menuTreeDiv = $($(`.tree${imgClassName}`)[0])
      menuNodeUl = $($(`.node${imgClassName}`)[0])
    } else {
      menuTreeDiv = $('<div></div>')
      menuTreeDiv.html('批次：' + nameTit)
      menuTreeDiv.addClass(`tree tree${imgClassName}`)
      menuNodeUl = $('<ul></ul>')
      menuNodeUl.addClass(`node node${imgClassName}`)
      $('.cv_fcv').append(menuTreeDiv)
      $('.cv_fcv').append(menuNodeUl)
    }
 
    var menuLi = $('<li class="node-item"></li>')
    var menuChildDiv = $('<div class="tree"></div>')
    menuChildDiv.html(name)
    menuLi.append(menuChildDiv)
    menuNodeUl.append(menuLi)
 
    initMenu()
  }

  $(document).bind("contextmenu", function(){
    return false;
  })

  $("#imgWrap").on("contextmenu", 'li', function(ev) {
    console.log('evev', ev);
    $('#imgWrap ul li').css('border', 'none')
    $(this).css('border', '1px solid #000')
    if($('#deleteImgItem')) $('#deleteImgItem').remove()
    const menu = $("<span id='deleteImgItem'>删除此图片</span>")
    menu.css({
      background: '#fff',
      border: '1px solid #000',
      padding: '4px 8px',
      position: 'absolute',
      top: ev.pageY,
      left: ev.pageX,
    })
    $(this).append(menu);
  })

  $("#imgWrap").on("contextmenu", function(ev) {
  })

  $("#imgWrap").on("click", '#deleteImgItem', function(ev) {
    console.log('evev', ev);
    console.log('evev', ev);
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

  // 展示弹窗
  function showModa(contentHtml) {
    const layerEle = $('<div class="modal-layer"></div>');
    const contentConEle = $('<div class="modal-dialog-container"></div>');
    contentConEle.html(contentHtml);
    layerEle.append(contentConEle);
    $('body').append(layerEle);
    $('.modal-img').css({ height: window.innerHeight*0.9 });
    $('.img-title').css({
       left: `calc(${ $('#modal-dialog-content').width()*0.5 - $('.img-title').width()*0.5 }px)`
    });
  }

  // 关闭
  $(document).on('click','.close-button',function(){
    $('.modal-layer').remove()
  });
  
  // 上一个
  $(document).on('click','#prev-button',function(){
    var imgIndex = -- window.imgIndex
    if (imgIndex >= 0) {
      $('.img-title').html(allImgNames[imgIndex])
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

  $('#menu').on('click', '.tree', function() {
    var ul = $(this).next(".node");
    var keyClassName = ul.attr('class') && ul.attr('class').split('node')[2];
    $("#imgWrap").find(`.${keyClassName}`).show().siblings().hide();
    console.log('this', $(this));
    $(this).addClass('activeTree').siblings('.tree').removeClass('activeTree')
    ul.addClass('activeNode').siblings('.node').removeClass('activeNode')
    $("#imgWrap").find(`.${keyClassName}`).addClass('activeImgWrap').siblings('ul').removeClass('activeImgWrap')
    if(ul.css("display") == "none") {
      ul.slideDown();
      $(this).removeClass('ce_ceng_close').addClass("ce_ceng_open")
    } else {
      ul.slideUp();
      $(this).removeClass("ce_ceng_open").addClass("ce_ceng_close");
      ul.find(".node").slideUp();
    }
  })

  $('#menu').on('click','.cd_title',function(){
    var ul = $('.cv_fcv');
    $('.activeTree').removeClass('activeTree')
    $('.activeNode').removeClass('activeNode')
    $('.activeImgWrap').removeClass('activeImgWrap')
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
        handleFileName(url)
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
