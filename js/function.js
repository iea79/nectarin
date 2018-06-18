/*!
 *
 * Evgeniy Ivanov - 2018
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var TempApp = {
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= TempApp.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= TempApp.mdWidth && $(window).width() < TempApp.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= TempApp.smWidth && $(window).width() < TempApp.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < TempApp.smWidth; } // < 768
function isIOS() { return TempApp.iOS(); } // for iPhone iPad iPod
function isTouch() { return TempApp.touchDevice(); } // for touch device

$(document).ready(function() {

    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	if ('flex' in document.documentElement.style) {
		// Хак для UCBrowser
		if (navigator.userAgent.search(/UCBrowser/) > -1) {
			document.documentElement.setAttribute('data-browser', 'not-flex');
		} else {		
		    // Flexbox-совместимый браузер.
			document.documentElement.setAttribute('data-browser', 'flexible');
		}
	} else {
	    // Браузер без поддержки Flexbox, в том числе IE 9/10.
		document.documentElement.setAttribute('data-browser', 'not-flex');
	}

	// First screen full height
	function setHeiHeight() {
	    $('.js-full__height').css({
	        minHeight: $(window).height() - $('footer').height()
	    });
	}
	setHeiHeight(); // устанавливаем высоту окна при первой загрузке страницы
	$(window).resize( setHeiHeight ); // обновляем при изменении размеров окна


	// Reset link whte attribute href="#"
	$('[href*="#"]').click(function(event) {
		event.preventDefault();
	});

	// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
	$('[data-scroll-to]').click( function(){ 
		var scroll_el = $(this).attr('href'); 
		if ($(scroll_el).length != 0) {
		$('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
		}
		return false;
	});

    // Inputmask.js
    $('[name=tel]').inputmask("+9(999)999 99 99",{ showMaskOnHover: false });

    $('.packageSlider').slick({
        centerMode: true,
        slidesToShow: 3,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: false,
                    slidesToShow: 1
                }
            }
        ]
    });

    $('.faqs__toggle').on('click', function() {
        var item = $(this).closest('.faqs__item');

        if (item.hasClass('open')) {
            item.removeClass('open');
        } else {
            $('.faqs__item').removeClass('open');
            item.addClass('open');
        }
    });



    $('.atelierSlider, .staffSlider, .jobsSlider, .reviewVideo, .reviewMobile').slick();

   	// gridMatch();
    fontResize();
    choiceBox();

    $('[data-target="#packageModal"]').on('click', function() {
        $('.form__packageName').html($('.packageSlider__item.slick-current .packageSlider__name').text());
        $('[name=package_name]').val($('.packageSlider__item.slick-current .packageSlider__name').text());
    });

});

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (TempApp.resized == windowWidth) { return; }
    TempApp.resized = windowWidth;

	checkOnResize()
});

function checkOnResize() {
   	// gridMatch();
    fontResize();
}

function gridMatch() {
   	$('[data-grid-match] .grid__item').matchHeight({
   		byRow: true,
   	});
}

function fontResize() {
    var windowWidth = $(window).width();
    if (windowWidth >= 768) {
    	var fontSize = windowWidth/16.8;
    } else if (windowWidth < 768) {
    	var fontSize = 70;
    }
	$('body').css('fontSize', fontSize + '%');
}

function choiceBox() {

    // Переключение пола и лица/тела
    var inputs = $('.choice__swich input');
    var body = $('[name=body]');
    var gender = $('[name=gender]');

    inputs.on('change', function() {
        $('.choice__content').removeClass('active');
        if (body.prop('checked') == false) {
            if (gender.prop('checked') == false) {
                $('#woman_body').addClass('active');
                
            } else {
                $('#man_body').addClass('active');
            }
        } else {
            if (gender.prop('checked') == false) {
                $('#woman_head').addClass('active');
            } else {
                $('#man_head').addClass('active');
            }
        }
    });

    // Показываем/скрываем оверлеи при наведении
    $('[data-overlay]').on('mouseenter', function() {
        var id = $(this).data('overlay');
        var content = $(this).closest('.choice__content');
        $('#'+id).show();
        if ($(this).hasClass('body_back')) {
            content.find('.choice__body').removeClass('active');
            content.find('.choice__body_back').addClass('active');
        } else {
            content.find('.choice__body').addClass('active');
            content.find('.choice__body_back').removeClass('active');
        }
    });
    $('[data-overlay]').on('mouseleave', function() {
        var id = $(this).data('overlay');
        $('#'+id).hide();
    });
}

// Видео youtube для страницы
$(function () {
    if ($(".js-youtube")) {
        $(".js-youtube").each(function () {
            // Зная идентификатор видео на YouTube, легко можно найти его миниатюру
            // $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

            // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
            $(this).append($('<img src="img/play.svg" alt="Play" class="video__play">'));

        });

        $('.video__play, .video__prev').on('click', function () {
            // создаем iframe со включенной опцией autoplay
            var videoId = $(this).closest('.js-youtube').attr('id');
            var iframe_url = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&autohide=1";
            if ($(this).data('params')) iframe_url += '&' + $(this).data('params');

            // Высота и ширина iframe должны быть такими же, как и у родительского блока
            var iframe = $('<iframe/>', {
                'frameborder': '0',
                'src': iframe_url,
            })

            // Заменяем миниатюру HTML5 плеером с YouTube
            $(this).closest('.video__wrapper').append(iframe);

        });
    }

});


function formSubmit() {
    $("[type=submit]").on('click', function (e){ 
        e.preventDefault();
        var form = $(this).closest('.form');
        var url = form.attr('action');
        var form_data = form.serialize();
        var field = form.find('[required]');
        // console.log(form_data);

        empty = 0;

        field.each(function() {
            if ($(this).val() == "") {
                $(this).addClass('invalid');
                // return false;
                empty++;
            } else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
            }  
        });

        // console.log(empty);

        if (empty > 0) {
            return false;
        } else {        
            $.ajax({
                url: url,
                type: "POST",
                dataType: "html",
                data: form_data,
                success: function (response) {
                    // $('#success').modal('show');
                    // console.log('success');
                    // console.log(response);
                    // console.log(data);
                    document.location.href = "success.html";
                },
                error: function (response) {
                    // $('#success').modal('show');
                    // console.log('error');
                    // console.log(response);
                }
            });
        }

    });

    $('[name="policyConfirm"]').on('change', function(event) {
        event.preventDefault();
        var btn = $(this).closest('.form').find('.btn');
        if ($(this).prop('checked')) {
            btn.removeAttr('disabled');
            // console.log('checked');
        } else {
            btn.attr('disabled', true);
        }
    });
}

// Карта + слайдер с точками.
ymaps.ready(init);

function init() {

    var result = document.getElementById('result'),
        myMap = new ymaps.Map('map', {
            center: [55.753559, 37.609218],
            zoom: 15
        });



    function clickGoto(city) {

        var myGeocoder = ymaps.geocode(city);
        myGeocoder.then(
            function(res) {
                coords = res.geoObjects.get(0).geometry.getCoordinates();

                myMap.panTo(coords, {
                    flying: 1
                });
                var placeMark = new ymaps.Placemark(coords, {
                    balloonContent: city
                });
                myMap.geoObjects.add(placeMark);
            },
                function(err) {
                // alert('Ошибка');
            }
        );
        return false;
    }

    $('.mapBox__slider').on('init', function(event, slick, currentSlide, nextSlide){
        clickGoto($(slick.$slides.get(currentSlide)).attr('title'))
        console.log($(slick.$slides.get(currentSlide)).attr('title'))
    });

    $('.mapBox__slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
        clickGoto($(slick.$slides.get(currentSlide)).attr('title'))
    });

    $('.mapBox__slider').slick({
        fade: true,
        speed: 500
    });

}
