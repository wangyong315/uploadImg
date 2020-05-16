$(function() {

  const randomStr = () => Math.random().toString(36).slice(-8) // 生成唯一字符串
  
  var allImgNames = [] // 所有图片数据
  
  var cateImgObj = {} // 图片分组 && className

  const imgTitleCss = {
    position: 'absolute',
    bottom: '8px',
    left: '50%',
    transform: 'translate3d(-50%, 0, 0)',
    padding: '6px 16px',
    'border-radius': '20px',
    border: '1px solid #fff',
    'background-color': 'rgba(0, 0, 0, 0.4)',
    'font-size': '14px',
    color: '#fff',
  }

  function clearAllData(params) { // 清空所有图片
    $('#imgWrap').html('')
    $('.cv_fcv').html('')
    $('#multipleFile').value = ''
    $('#chooseFile').html('请上传文件')
    allImgNames = []
    cateImgObj = {}
  }

  $('#clear').click(clearAllData)

  $('#zoomBigImg').click(() => zoomImg('big'))
  $('#zoomSmallImg').click(() => zoomImg('small'))
  
  // 缩放图片
  function zoomImg(params) {
    $("li").removeClass('big small').addClass(params);
  }
  
  function countImg() { // 显示总共上传多少张图片
    $('#chooseFile').html('共上传' + allImgNames.length + '个文件')
  }

  function genNameTit(fileName) {
    var fileNameTit
    if (fileName.indexOf('_') !== -1) {
      fileNameTit = fileName.split('_')[0]
    }
    if (fileName.indexOf('-') !== -1) {
      fileNameTit = fileName.split('-')[0]
    }
    return fileNameTit
  }

  $('#multipleFile').change(function (ev) { // 本地上传图片
    //判断 FileReader 是否被浏览器所支持
    if (!window.FileReader) return alert('您的浏览器暂不支持FileReader，请升级浏览器，或者使用新版谷歌浏览器');
    handleFileList(ev) // 处理本地上传之后的图片
  })

  // 生成图片类型 字符串
  function calcUniquClass(fileNameTit) {
    if (!cateImgObj[fileNameTit] && !$('.activeImgWrap')[0]) {
      cateImgObj[fileNameTit] = randomStr()
    }
  }

  function handleFileList(ev) {
    var fileList = ev.target.files;  
    Object.getOwnPropertyNames(fileList).forEach(function(key) {
      var fileName = fileList[key].name
      if (allImgNames.indexOf(fileName) === -1) { // 名称相同的不能再次上传
        printImg(fileList[key])
        allImgNames.push(fileName)
      }
      var fileNameTit = genNameTit(fileName) // 分类名称
      calcUniquClass(fileNameTit)
    });
    countImg()
    ev.target.value = ''
  }

  function printImg(file) { // 开始打印图片
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
 
  function handleFileName(url) { // 处理本地socket图片链接
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
    calcUniquClass(fileNameTit)
    countImg()
  }

  // 开始画图
  function drawToImg(result, name, type) {
    var nameTit = genNameTit(name)
    if (type === 'urlImg') {
      nameTit = name
    }
    
    var imgClassName = cateImgObj[nameTit]
    var ulEle // 设置图片列表UL
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
      ulEle.addClass(imgClassName)
    }
   
    var liEle = $(`<li class="small" data-keyname=${imgClassName}></li>`)
    var imgEle = $(`<img class="imgFlag" data-srcid=img${randomStr()} src=${result} />`)
    var spanEle = $('<p></p>')
    liEle.attr('draggable', 'true')
    liEle.css({
      position: 'relative',
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

    var menuTreeDiv // 菜单的逻辑
    var menuNodeUl
    if ($('.activeTree')[0]) {
      menuTreeDiv = $($('.activeTree')[0])
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
    menuLi.html(name)
    menuNodeUl.append(menuLi)
    initMenu()
  }

  $("#imgWrap").on("mouseenter", 'li', function() {
    $(this).css({
      'background-color': '#daa520',
      // opacity: '0.5'
    }).siblings().css({
      background: '',
      opacity: '',
    })
    const menu = $(`<span id='deleteImgItem' data-keyname=${$(this).data('keyname')}>删除此图片</span>`)
    menu.css({
      position: 'absolute',
      bottom: '8px',
      right: '8px',
      background: '#fff',
      'border-radius': '4px',
      border: '1px solid #000',
      padding: '2px 4px',
      'font-size': '13px',
      cursor: 'pointer',
    })
    $(this).append(menu);
  })

  $("#imgWrap").on("mouseleave", 'li', function() {
    $(this).css({
      'background': '',
      opacity: ''
    })
    if($('#deleteImgItem')) $('#deleteImgItem').remove()
  })

  $(document).on("click", '#deleteImgItem', function(event) {
  // $('#imgWrap ul li #deleteImgItem').on("click", function(event) {
    event.stopPropagation()
    const keyName = $(this).data('keyname')
    const imgName = $(this).siblings('p').html()
    $(`.node${keyName} li:contains(${imgName})`).remove() // 删除菜单中item
    $(this).parent().remove() //删除#imgWrap的li img
    const index = allImgNames.indexOf(imgName)
    allImgNames.splice(index, 1)
    countImg()
    if (!allImgNames.length) clearAllData()
    if (!$(`.${keyName} li`).length) {
      $(`.${keyName}`).remove()
      $(`.tree${keyName}`).remove()
      $(`.node${keyName}`).remove()
    }
  })

  $('#imgWrap').on('click', 'li', function (event) {
    event.stopPropagation()
    const keyName = $(this).data('keyname')
    const srcid = $(this).children('img').data('srcid')
    const imgSrc = $(this).children('img').attr('src')
    const imgTit = $(this).children('p').html()
    const contentHtml = `
      <div class="modal-dialog-content" id="modal-dialog-content">
        <img id="modal-img" class="modal-img" alt="大图" />
        <div class="img-title"></div>
        <div>
          <span id="prev-button"></span>
          <span class="close-button"></span>
          <span id="next-button"></span>
          <span class="modal-message"></span>
        </div>
      </div
    `;
    showModa(contentHtml, keyName, imgSrc, imgTit, srcid)
  })

  function showModa(contentHtml, keyName, imgSrc, imgTit, srcid) { // 展示弹窗
    const layerEle = $('<div class="modal-layer"></div>');
    const contentConEle = $('<div class="modal-dialog-container"></div>');
    contentConEle.html(contentHtml);
    layerEle.append(contentConEle);
    $('body').append(layerEle);
    $('.img-title').html(imgTit);
    $('.img-title').css(imgTitleCss);
    $('.modal-img').attr({
      src: imgSrc,
      'data-srcid': srcid
    })
  }

  $(document).on('click','.close-button', function() { // 关闭
    $('.modal-layer').remove()
  });


  function clearModalMsg() {
    $('.modal-message').html('')
    $('.modal-message').css({
      "background-color":"",
      "padding": ""
    });
  }

  function showModalMsg(text) {
    $('.modal-message').html(text).css({
      position: 'absolute',
      top: 0,
      "background-color":"#fff",
      "color":"red",
      "padding": "4px",
      "border-raduis": '4px',
      left: '50%',
      transform: 'translate3d(-50%, 0, 0)',
    });
  }

  function showNextPrev(type) {
    const currentSrcId = $('.modal-img').data('srcid')
    const allImgWrapLI = $(`#imgWrap ul:visible li`)
    const currentImg = $(`#imgWrap ul:visible li img[data-srcid=${currentSrcId}]`)
    let currentIndex =  allImgWrapLI.index(currentImg.parent())
    console.log('currentIndex', currentIndex);
    const prevLi = allImgWrapLI.eq(type === 'prev' ? --currentIndex : ++currentIndex)
    if (currentIndex < 0) {
      showThenHide('当前是第一页')
      return 
    }

    if (currentIndex === allImgWrapLI.length) {
      showThenHide('当前是最后一页')
      return 
    }
    console.log('prevLi', prevLi);
    const imgTit = prevLi.children('p').html()
    const imgSrc = prevLi.children('img').attr('src')
    const srcid = prevLi.children('img').data('srcid')
    $('.img-title').html(imgTit)
    $('.img-title').css(imgTitleCss);
    $('.modal-img').attr({ src: imgSrc })
    $('.modal-img').data('srcid', srcid)
  }

  $(document).on('click', '#prev-button', function() { // 上一个
    showNextPrev('prev')
  });

  $(document).on('click', '#next-button', function() { // 下一个
    showNextPrev('next')
  });

  function showThenHide(params) {
    showModalMsg(params)
    setTimeout(() => {
      clearModalMsg()
    }, 3000);
  }
  
  // 菜单显示逻辑
  function initMenu() {
    $(".tree").each(function() {
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
      ul.slideDown().siblings('.node').slideUp()
      $(this).removeClass('ce_ceng_close').addClass("ce_ceng_open").siblings('.tree').removeClass('ce_ceng_open').addClass("ce_ceng_close")
    } else {
      ul.slideUp().find(".node").slideUp();;
      $(this).removeClass("ce_ceng_open").addClass("ce_ceng_close");
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
