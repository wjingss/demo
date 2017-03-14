/*广告图片数组*/
var imgs=[
  {"i":0,"img":"img/banner_01.jpg"},
  {"i":1,"img":"img/banner_02.jpg"},
  {"i":2,"img":"img/banner_03.jpg"},
  {"i":3,"img":"img/banner_04.jpg"},
  {"i":4,"img":"img/banner_05.jpg"},
  {"i":5,"img":"img/banner_06.jpg"},
  {"i":6,"img":"img/banner_07.jpg"},
  {"i":7,"img":"img/banner_08.jpg"},
  {"i":8,"img":"img/banner_09.jpg"},
  {"i":9,"img":"img/banner_10.jpg"},
];
var slider = {
  LIWIDTH:0,//保存每个li的宽度，其实就是#slider的宽
  DURATION:1000,//动画总时间
  WAIT:3000,//自动轮播的等待时间
  timer:null,
  canAuto:true,//保存是否可自动轮播
  init:function(){
    this.LIWIDTH = parseFloat($("#slider").css("width"));
    this.updateView();
    //为id为indexs的ul添加鼠标进入事件代理，只有不是hover的li才能响应事件
    $("#indexs").on("mouseover","li:not(.hover)",function(e){
      //获得目标元素target
      var $target = $(e.target);
      //调用move方法，传入要移动的个数：
      this.move($target.html()-$target.siblings(".hover").html());
    }.bind(this));
    //当鼠标进入#slider是，将canAuto改为false
    //当鼠标移除#slider时，将canAuto改为true
    $("#slider").hover(
      function(){this.canAuto=false}.bind(this),
      function(){this.canAuto=true}.bind(this)
    );
    this.autoMove();//在页面加载时启动自动轮播
  },
  autoMove:function(){//启动自动轮播
    //启动一次性定时器
    this.timer = setTimeout(function(){
        if(this.canAuto){
          this.move(1);
        }else{
          this.autoMove();
        }
      }.bind(this),
      this.WAIT);
  },
  move:function(n){
    clearTimeout(this.timer);
    timer=null;
    $("#imgs").stop(true);
    //获得#imgs当前的left，转为浮点数
    var left = parseFloat($("#imgs").css("left"));
    //如果n小于0
    if(n<0){
      n*=-1;
      //先修改数组
      imgs = imgs.splice(imgs.length-n,n).concat(imgs);
      //更新界面
      this.updateView();
      //修改#imgs的left为left-n*LIWIDTH
      $("#imgs").css("left",left-n*this.LIWIDTH);
      //启动动画，在DURATION时间内，left移动到0
      $("#imgs").animate({left:"0"},this.DURATION,this.autoMove.bind(this));
    }
    else{//否则
      //让#imgs的ul在DURATION时间内，left变为-n*LIWIDTH
      $("#imgs").animate({left:-n*this.LIWIDTH+"px"},this.DURATION,this.endMove.bind(this,n));
    }
  },
  endMove:function(n){
    //删除数组开头的n个元素再拼到结尾
    imgs = imgs.concat(imgs.splice(0,n));
    this.updateView();//更新界面
    //设置#imgs的left为0
    $("#imgs").css("left",0);
    this.autoMove();//启动自动轮播
  },
  updateView:function(){//将数组元素更新到页面
    //遍历imgs数组中的每个对象，同时声明空的字符串html
    for(var i=0,html="",idxs="";i<imgs.length;i++){
      //向页面写入图片
      html += "<li><img src='"+imgs[i].img+"'></li>";
      //向页面中写入图片中的序号
      idxs += "<li>"+(i+1)+"</li>";
    }
    //设置id为imgs的内容为html，再设置其宽度为LIWIDTH*imgs的元素个数
    $("#imgs").html(html).css("width",this.LIWIDTH*imgs.length);
    //设置id为indexs的内容为idxs
    $("#indexs").html(idxs);
    //设置class：获得#indexs下的和imgs中第一个元素的i属性对应的li，设置其class为hover,选择其兄弟中的class为hover的li，删除其class
    $("#indexs>li:eq("+imgs[0].i+")").addClass("hover").siblings(".hover").removeClass("hover");
  }
}
slider.init();