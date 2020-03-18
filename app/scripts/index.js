"use strict";

$(function () {
  var imgWrapEle = $('#imgWrap');
  var multipleFileEle = $('#multipleFile'); // 所有图片数据

  var allImgNames = []; // 所有图片分组

  var categoryImgList = []; // 图片分组 && className

  var categoryImgListObj = {};
  var submitFlag = false; // 清空所有图片

  $('#clear').click(function () {
    $('#imgWrap').html('');
    $('.cv_fcv').html('');
    multipleFileEle.value = '';
    $('#chooseFile').html('请上传文件');
    allImgNames = [];
    categoryImgList = [];
    uniqueCategoryImgList = [];
    categoryImgListObj = {};
  });
  $('#zoomBigImg').click(function () {
    zoomImg('big');
  });
  $('#zoomSmallImg').click(function () {
    zoomImg('small');
  });

  function zoomImg(params) {
    var liList = $("li");

    for (var index = 0; index < liList.length; index++) {
      liList[index].setAttribute("class", params);
    }
  }

  $('#multipleFile').change(function (ev) {
    //判断 FileReader 是否被浏览器所支持
    if (!window.FileReader) return;
    var fileList = ev.target.files;
    Object.getOwnPropertyNames(fileList).forEach(function (key) {
      var fileName = fileList[key].name;

      if (allImgNames.indexOf(fileName) === -1) {
        printImg(fileList[key]);
        allImgNames.push(fileName);
      }

      if (categoryImgList.findIndex(function (ele) {
        return ele === fileName.split('_')[0];
      }) === -1) {
        categoryImgList.push(fileName.split('_')[0]);
      }
    });
    $('#chooseFile').html('共上传' + allImgNames.length + '个文件');

    for (var index = 0; index < categoryImgList.length; index++) {
      var element = categoryImgList[index];

      if (!categoryImgList[element]) {
        categoryImgListObj[element] = randomStr();
      }
    }

    ev.target.value = '';
  });

  function printImg(file) {
    if (!file.type.match('image/*')) {
      alert('上传的图片必须是png,gif,jpg格式！');
      ev.target.value = ""; //显示文件的值赋值为空

      return;
    }

    var reader = new FileReader(); // 创建FileReader对象

    reader.readAsDataURL(file); // 读取file对象，读取完毕后会返回result 图片base64格式的结果

    reader.onload = function (e) {
      drawToImg(this.result, file.name);
    };
  }

  function drawToImg(result, name) {
    console.log('name', name);
    var imgClassName = categoryImgListObj[name.split('_')[0]]; // 设置图片列表UL

    var ulEle;

    if (document.getElementsByClassName(imgClassName)[0]) {
      ulEle = document.getElementsByClassName(imgClassName)[0];
    } else {
      ulEle = document.createElement('ul');
    }

    var menuTreeDiv;
    var menuNodeUl;

    if (document.getElementsByClassName('tree' + imgClassName)[0]) {
      menuTreeDiv = document.getElementsByClassName('tree' + imgClassName)[0];
      menuNodeUl = document.getElementsByClassName('node' + imgClassName)[0];
    } else {
      menuTreeDiv = $('<div></div>');
      menuTreeDiv.html('批次：' + name.split('_')[0]);
      menuTreeDiv.addClass("tree tree" + imgClassName);
      menuNodeUl = $('<ul></ul>');
      menuNodeUl.addClass("node node" + imgClassName);
      $('.cv_fcv').append(menuTreeDiv);
      $('.cv_fcv').append(menuNodeUl);
    }

    var menuLi = document.createElement('li');
    menuLi.setAttribute('class', 'node-item');
    var menuChildDiv = document.createElement('div');
    menuChildDiv.setAttribute('class', 'tree');
    menuChildDiv.innerHTML = name;
    menuLi.appendChild(menuChildDiv);
    menuNodeUl.append(menuLi);

    if (!document.getElementsByClassName(imgClassName + 'title')[0]) {
      var divEle = document.createElement('div');
      divEle.setAttribute('class', imgClassName + 'title');
      divEle.setAttribute('style', "padding-bottom: 16px");
      divEle.innerHTML = '批次：' + name.split('_')[0];
      ulEle.appendChild(divEle);
    }

    var liEle = document.createElement('li');
    var imgEle = document.createElement('img');
    var spanEle = document.createElement('p');
    ulEle.setAttribute('class', imgClassName);
    liEle.setAttribute('class', 'small');
    imgEle.setAttribute('class', 'imgFlag');
    spanEle.setAttribute("style", "white-space: nowrap;width: 200px;overflow: hidden;text-overflow: ellipsis;font-size: 12px; height: 20px");
    imgEle.src = result;
    spanEle.innerHTML = name;
    ulEle.appendChild(liEle);
    liEle.appendChild(imgEle);
    liEle.appendChild(spanEle);
    imgWrapEle.append(ulEle);
    initMenu();
  }

  function randomStr() {
    return Math.random().toString(36).slice(-8);
  }

  $('#imgWrap').click(function (event) {
    event = event || window.event;
    var imgSrc = event && event.target && event.target.currentSrc;
    var target = event.target || event.srcElement;
    var imgParentNode = target.parentNode;
    window.imgIndex = Array.prototype.slice.call($('img')).indexOf(event.target);

    if (target.tagName === 'IMG' && imgParentNode.tagName === 'LI') {
      var contentHtml = "\n        <div class=\"modal-dialog-content\" id=\"modal-dialog-content\">\n          <img id=\"modal-img\" class=\"modal-img\" src=" + imgSrc + " alt=\"\u5927\u56FE\" />\n          <div class=\"img-title\">" + allImgNames[window.imgIndex] + "</div>\n          <div>\n            <span id=\"prev-button\"></span>\n            <span class=\"close-button\"></span>\n            <span id=\"next-button\"></span>\n            <span class=\"modal-message\"></span>\n          </div>\n        </div\n      ";
      showModa(contentHtml);
    }
  }); // 提交所有数据

  $("#submit").click(function () {
    if (submitFlag) return;
    submitFlag = true;
    var formData = new FormData();
    var files = $('#multipleFile')[0];

    for (var index = 0; index < files.length; index++) {
      formData.append("file", files[index]);
    }

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          $('#message').html('提交成功，3秒后消失').attr('style', 'color: green');
          setTimeout(function () {
            $('#message').html('');
          }, 3000);
          submitFlag = false;
        } else {
          $('#message').html('提交失败，3秒后消失').attr('style', 'color: red');
          setTimeout(function () {
            $('#message').html('');
          }, 3000);
          submitFlag = false;
        }
      }
    };

    xhr.open('POST', 'http://139.199.18.143:8080/upload');
    xhr.send(formData);
  });

  function showModa(contentHtml) {
    var layerEle = document.createElement('div');
    layerEle.setAttribute('class', 'modal-layer');
    var contentContainerEle = document.createElement('div');
    contentContainerEle.setAttribute('class', 'modal-dialog-container');
    contentContainerEle.innerHTML = contentHtml;
    layerEle.appendChild(contentContainerEle);
    document.body.appendChild(layerEle);
    $('.modal-img').attr({
      height: window.innerHeight * 0.9
    });
    $('.img-title').attr('style', "left:  calc(" + ($('#modal-dialog-content').width() * 0.5 - $('.img-title').width() * 0.5) + "px)");
  } // 关闭


  $(document).on('click', '.close-button', function () {
    $('.modal-layer').remove();
  }); // 上一个

  $(document).on('click', '#prev-button', function () {
    var imgIndex = --window.imgIndex;

    if (imgIndex >= 0) {
      $('.img-title').html(allImgNames[imgIndex]);
      $('.img-title').attr('style', "left:  calc(" + ($('#modal-dialog-content').width() * 0.5 - $('.img-title').width() * 0.5) + "px)");
      var imgSrc = Array.prototype.slice.call($('.imgFlag'))[imgIndex].currentSrc;
      $('#modal-img').attr('src', imgSrc);
    } else {
      showModalMsg('当前是第一页');
      setTimeout(function () {
        clearModalMsg();
      }, 3000);
      ++window.imgIndex;
    }
  });

  function clearModalMsg(params) {
    $('.modal-message').html('');
    $('.modal-message').css({
      "background-color": "",
      "padding": ""
    });
  }

  function showModalMsg(text) {
    $('.modal-message').html(text).css({
      "background-color": "#fff",
      "color": "red",
      "padding": "4px",
      "border-raduis": '4px'
    });
  } 
  
  // 下一个
  $(document).on('click', '#next-button', function () {
    var imgIndex = ++window.imgIndex;
    var imgLength = Array.prototype.slice.call($('.imgFlag')).length;

    if (imgIndex < imgLength) {
      $('.img-title').html(allImgNames[window.imgIndex]);
      $('.img-title').attr('style', "left:  calc(" + ($('#modal-dialog-content').width() * 0.5 - $('.img-title').width() * 0.5) + "px)");
      var imgSrc = Array.prototype.slice.call($('.imgFlag'))[imgIndex].currentSrc;
      $('#modal-img').attr('src', imgSrc);
    } else {
      showModalMsg('当前是最后一页');
      setTimeout(function () {
        clearModalMsg();
      }, 3000);
      --window.imgIndex;
    }
  }); // 菜单显示逻辑

  function initMenu() {
    $(".tree").each(function (index, element) {
      if ($(this).next(".node").length > 0) {
        $(this).addClass("ce_ceng_close");
      }
    });
  }

  $('#menu').on('click', '.tree', function (e) {
    var ul = $(this).next(".node");

    if (ul.css("display") == "none") {
      ul.slideDown();
      $(this).addClass("ce_ceng_open");
      ul.find(".ce_ceng_close").removeClass("ce_ceng_open");
    } else {
      ul.slideUp();
      $(this).removeClass("ce_ceng_open");
      ul.find(".node").slideUp();
      ul.find(".ce_ceng_close").removeClass("ce_ceng_open");
    }
  });
});