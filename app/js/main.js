$(document).ready(function () {

    var changerObject = {
        messageArray: null,
        messageLength: 0,
        elem: null,
        index: 0,
        pos: 0,
        time1: 150,
        time2: 75,
        timePause: 700,
        init: function (selector, messageArray) {
            this.messageArray = messageArray;
            this.elem = $(selector);
            this.messageLength = this.messageArray.length;
            this.typing(0, false);

        },
        typing: function (slicer, del) {
            var that = this;
            setTimeout(function () {
                if (del == true) {
                    slicer--;
                } else {
                    slicer++;
                }


                that.elem.text(that.messageArray[that.index].slice(0, slicer));


                if (slicer == 0) {
                    del = false;
                    that.index++;
                    that.pos = 0;
                    if (that.index == that.messageLength) {
                        that.index = 0;
                    }
                    cols = ['red','green','blue'];
                    // $("#main-section").css("backgroundColor",cols[that.index%3]);
                }

                if (slicer == that.messageArray[that.index].length) {
                    del = true;
                    setTimeout(function () {
                        that.typing(slicer, del);
                    }, that.timePause);
                } else {
                    that.typing(slicer, del);
                }


            }, del ? this.time2 : this.time1);
        }
    };
    changerObject.init("#changer1",['web development', '<coding>', 'dancing','technology']);
});

/* Contact Form */

$(function() {
    $(".animated-btn").on("click", function() {
        var btn = $(this);
        var responseText = btn.next(".animated-btn-response");
        if($(this).hasClass('animated-btn-wide'))
            return;
        else
            $(this).addClass('animated-btn-wide');
        setTimeout(function() {
            btn.addClass('animated-btn-filling');
        }, 500);

        function hasErrors(){
            var form = $("#contact-form");
            var name = form.find('input[name=name]').val(),
                email= form.find('input[name=email]').val(),
                message = form.find('textarea').val();
            if(name==='')
                errorMsg = 'You can give your name, I won\'t hunt you';
            else if(email==='')
                errorMsg = 'Don\'t be so lazy. Type in your email';
            else if(!isValidEmail(email))
                errorMsg = 'Come on! Type in your real email address';
            else if(message==='')
                errorMsg = 'Come on ! Type anything.';
            else
                errorMsg = false;
            return errorMsg;
        }
        var animationComplete = function(){
            setTimeout(function(){
                btn.removeClass('animated-btn-wide');
                btn.removeClass('animated-btn-done');
                btn.removeClass('animated-btn-errors');
                responseText.addClass('hide');

            },10000);
        };
        function isValidEmail(email){
            return true;
        }
        function dataReceived(data) {
            console.log(data);
            btn.addClass('animated-btn-received');
            setTimeout(function () {
                btn.addClass('animated-btn-done');
                btn.removeClass('animated-btn-received');
                btn.removeClass('animated-btn-filling');
                responseText.html(data).removeClass('hide');
            }, 1000);
            animationComplete();
        }
        function dataError(data){
            console.log(data);
            btn.addClass('animated-btn-received');
            setTimeout(function () {
                btn.addClass('animated-btn-errors');
                btn.removeClass('animated-btn-received');
                btn.removeClass('animated-btn-filling');
                responseText.html(data).removeClass('hide');
            }, 1000);
            animationComplete();
        }
        var formErrors = hasErrors();
        if(formErrors) {
            dataError(formErrors);
            return false;
        } else {
            var formdata = $("#contact-form").serialize();
        }

        $.ajax({
            url : 'contact-form.php',
            method: 'POST',
            data: formdata,
            dataType: 'json',
            beforeSend: function(){
                $("form input, form textarea").val('');
            },
            success: function(data){
                if(data.status)
                    dataReceived(data.message);
                else
                    dataError(data.message);
            },
            error: function(data){dataError(data.message);}
        });
    });
});




/* Initialization for doughnut skills*/

var showSkills =  (function () {
    $("#doughnutChart-web-front").drawDoughnutChart([
        {title: "HTML5 + Jade", value: 9, color: "#FF4136"},
        {title: "CSS3 + SASS", value: 8, color: "#2ECC40"},
        {title: "Javascript", value: 8, color: "#0074D9"},
        {title: "Jquery", value: 8, color: "#FF851B"},
        {title: "AngularJS + Angular2", value: 6, color: "#B10DC9"},
        {title: "Bootstrap3", value: 8, color: "#FFDC00"},
        {title: "Interactive Graphics + Animations", value: 7, color: "#2ECC40"},
        {title: "Adobe Illustrator + Photoshop", value: 6, color: "#0074D9"},
        {title: "", value: 17, color: ""}
    ], {backgroundCustom: "", summaryTitle: "WEB FRONTEND", totalPercentage: "80"});

    $("#doughnutChart-web-back").drawDoughnutChart([
        {title: "PHP", value: 9, color: "#FF4136"},
        {title: "MySQL", value: 9, color: "#2ECC40"},
        {title: "Slim-Framework", value: 7, color: "#0074D9"},
        {title: "Node.js", value: 8, color: "#FF851B"},
        {title: "Express.js", value: 7, color: "#B10DC9"},
        {title: "MongoDB", value: 8, color: "#FFDC00"},
        {title: "", value: 10, color: ""}
    ], {summaryTitle: "WEB BACKEND", totalPercentage: "80"});

    $("#doughnutChart-other-tech").drawDoughnutChart([
        {title: "C", value: 5, color: "#FF4136"},
        {title: "C++", value: 6, color: "#2ECC40"},
        {title: "Core Java", value: 7, color: "#0074D9"},
        {title: "Python", value: 7, color: "#FF851B"},
        {title: "Ionic Framework", value: 7, color: "#B10DC9"},
        {title: "System Administration", value: 7, color: "#FFDC00"},
        {title: "Automation", value: 7, color: "#FF4136"},
        {title: "Android Dev. Fundamentals", value: 7, color: "#2ECC40"},
        {title: "Tech/CS Knowledge", value: 9, color: "#0074D9"},
        {title: "", value: 21, color: ""}
    ], {backgroundCustom: "", summaryTitle: "OTHER TECHS.", totalPercentage: "75"});

    $("#doughnutChart-life").drawDoughnutChart([
        {title: "SWAG!!!", value: 10, color: "#FF4136"},
        {title: "Imagination", value: 10, color: "#2ECC40"},
        {title: "Hip-Hop", value: 8, color: "#0074D9"},
        {title: "Popping", value: 7, color: "#FF851B"},
        {title: "Freestyle Dancing", value: 9, color: "#B10DC9"},
        {title: "Versatility", value: 9, color: "#FFDC00"},
        {title: "Learning Desire", value: 9, color: "#FF4136"},
        {title: "Confidence", value: 8, color: "#2ECC40"},
        {title: "Madness", value: 8, color: "#0074D9"},
        {title: "", value: 10, color: ""}
    ], {backgroundCustom: "", summaryTitle: "MISC SKILLS", totalPercentage: "90"});

    $("#doughnutChart-awesomeness").drawDoughnutChart([
        {title: "", value: 0.5, color: "#DD4136"},
        {title: "", value: 100, color: "#FF4136"},
        {title: "", value: 0, color: ""}
    ], {backgroundCustom: "", summaryTitle: "AWESOMENESS", totalPercentage: "101"});

});
/* Making Menu stick when scrolling beyond #main-section */
$(function () {
    $(document).scroll(function () {
        var scrollTop = $(document).scrollTop();
        var navHeight = $(".my-menu").height();
        var headerHeight = $("#main-section").height();
        if (scrollTop > headerHeight - navHeight) {
            $(".my-menu").addClass('menu-fixed');
        } else {
            $(".my-menu").removeClass('menu-fixed');
        }
    });
});
/* Smooth scroll */
$(function () {
    $('a[href*=#]:not([href=#])').click(function () {
        $("#navbar").collapse('hide');
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 50
                }, 500);
                return false;
            }
        }
    });
});

/* Scroll tracking */
$(window).scroll(function () {
    var scrollTop = $(window).scrollTop();
    $(".nav a[href*=#]:not([href=#])").each(function () {
        var currentLink = $(this);
        var targetId = currentLink.attr('href');
        var element = $(targetId);
        var top = element.position().top - 150;
        var bottom = top + element.height();
        if (scrollTop >= top && scrollTop < bottom) {
            $('.nav-active').removeClass('nav-active');
            currentLink.addClass('nav-active');
        }
    });
});


$(window).load(function(){
    showSkills();
});



(function logoHoverAnimationEffect(logoId){
  var mainLogo = document.getElementById(logoId);
  var convert1 = function(){
    mainLogo.setAttribute('class','anim-stop');
    // var soundBounce = $("#sound-bounce")[0].play();
  };
  var convert2 = function(){
    mainLogo.setAttribute('class','anim-start');
   // var soundJump = $("#sound-jump")[0].play();
  };
  $(mainLogo).hover(convert2,convert1);
	// $(mainLogo).on('hover-event',()=>alert('hello'));

})('lokesh-logos');
