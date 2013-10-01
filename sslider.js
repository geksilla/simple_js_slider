(function($){
    $.fn.extend({
        sslider:function(options){

            options = $.extend({
                slidesPerMove: 1,
                duration: 1000,
                autoSwitch: true,
                loop: true,
                moveInterval: 8000,
                waitUserInteraction: 15000,
                ease: 'easeOutQuart'
            }, options);

            var currentSlide = 0;
            var next_slide = 0;
            var interval;
            var timeout = 0;
            var slider = $(this);
            var totalSlides = slider.children().length;
            var attrPrefix = slider.attr('id');
            var item = slider.find('li:eq(0)');
            var itemWidth = $(slider.children()[0]).width();

            slider.children().each(function(index){
                $(this).css({"left":index*$(this).width()});
            });

            if (options.loop) {
                generateLooped();
            }


            if (options.autoSwitch){
                interval = setInterval(function(){
                    nextSlide();
                }, options.moveInteraval);
            }

            function generateLooped(){
                var slPerMove = options.slidesPerMove;

                if (slider.children().length == 1) {
                    slider.find('li:eq(0)').clone().appendTo(slider).css('left',slider.children().width()*(slider.children().length-1)+'px');
                    slider.find('li:eq(0)').clone().prependTo(slider).css('left','-'+slider.children().width()*(slider.children().length-2)+'px');
                    slider.find('li:eq(0)').addClass(attrPrefix+'_pre_0');
                    slider.find('li:eq(2)').addClass(attrPrefix+'_post_0');
                } else {
                    for (var i = 0; i<slPerMove; i++)
                    {
                        slider.find('li:eq('+i+')').addClass(attrPrefix+'_pre_'+i);
                    }
                    for (var j = 0; j<slPerMove; j++)
                    {
                        var ind = slider.children().length - j -1;
                        slider.find('li:eq('+ind+')').addClass(attrPrefix+'_post_'+j);
                    }
                    for (var k = 0; k<slPerMove; k++)
                    {
                        var kof = slPerMove - 1 - k;
                        $('.'+attrPrefix+'_pre_'+k).clone().appendTo(slider).css('left',slider.children().width()*(slider.children().length-1)+'px');
                    }
                    for (var n = 0; n<slPerMove; n++)
                    {
                        var kof2 = slider.children().length-1-n;
                        $('.'+attrPrefix+'_post_'+n).clone().prependTo(slider).css('left','-'+slider.children().width()*(1+n)+'px');
                    }
                }
            }

            function nextSlide()
            {
                var maxW = slider.children().length*slider.children().width() - slider.children().width();
                if (slider.position().left > -maxW){}
                currentSlide++;
                if (currentSlide > totalSlides)
                {
                    currentSlide = 0;
                }
                next_slide-= slider.children().width()*options.slidesPerMove;
                var newPos = slider.children().width()*(slider.children().length/options.slidesPerMove);
                moveIt(next_slide, function(){
                    if ((newPos - Math.abs(slider.position().left)) <= 1)
                    {
                        next_slide = 0;
                        currentSlide = 0;
                        slider.css('left','0px');
                    }
                });
            }

            function prevSlide()
            {
                next_slide+= slider.children().width()*options.slidesPerMove;
                currentSlide--;
                if (currentSlide < 0)
                {
                    currentSlide = 9;
                }
                var newPos = slider.children().width()*options.slidesPerMove;
                moveIt(next_slide, function(){
                    if(slider.position().left == newPos)
                    {
                        var pos = slider.children().width()*(slider.children().length-(options.slidesPerMove*3));
                        next_slide = -pos;
                        slider.css('left', '-'+pos+'px');
                    }
                });
            }

            function moveIt(pos, callback) {
                slider.animate({
                    left: pos
                }, options.duration, options.ease, callback);
            }

            return {
                nextSlide: function(){
                    this.clear();
                    nextSlide();
                },
                prevSlide: function(){
                    this.clear();
                    prevSlide();
                },
                getSlidesCount: function(){
                    totalSlides = slider.children().length;
                    return totalSlides;
                },
                getCurrentSlide:function(){
                    return currentSlide;
                },
                reset: function() {
                    slider.css('left',0);
                },
                moveTo: function(slide) {
                    console.log(itemWidth);
                    if (slide < 1) {
                        slide = 1;
                    }
                    moveIt(-(slide-1)*itemWidth+'px');
                },
                clear: function()
                {
                    if (options.autoSwitch) {
                        clearTimeout(timeout);
                        clearInterval(interval);
                        timeout = setTimeout(function(){
                            nextSlide();
                            clearTimeout(this);
                            interval = setInterval(function(){
                                nextSlide();
                            },intervalTime);
                        },options.waitUserInteraction);
                    }
                },
            }
            }
        })}
    )(jQuery);