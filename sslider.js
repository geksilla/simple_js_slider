(function($){
    $.fn.extend({
        sliderClass:function(options){

            options = $.extend({
                slidesPerMove: 1,
                duration: 1000,
                autoSwitch: true,
                loop: true,
                moveInterval: 8000,
                waitUserInteraction: 15000,
                ease: 'easeOutQuart',
                useCSS: true
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
            var _options = {}
            var currentPos = 0;

            options.usingCSS = options.useCSS && (function(){
                // create our test div element
                var div = document.createElement('div');
                // css transition properties
                var props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
                // test for each property
                for(var i in props){
                    if(div.style[props[i]] !== undefined){
                        _options.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
                        _options.animProp = '-' + _options.cssPrefix + '-transform';
                        return true;
                    }
                }
                return false;
            }());


            slider.children().each(function(index){
                $(this).css({"left":index*$(this).width()});
            });

            slider.css('width', itemWidth*totalSlides + 'px');
            if (options.loop) {
                slider.css('width', itemWidth*(2 + totalSlides) + 'px');
            }

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

            // function nextSlide()
            // {
            //     var maxW = slider.children().length*slider.children().width() - slider.children().width();
            //     currentSlide++;
            //     if (currentSlide > totalSlides)
            //     {
            //         currentSlide = 0;
            //     }
            //     next_slide-= slider.children().width()*options.slidesPerMove;
            //     var newPos = slider.children().width()*(slider.children().length/options.slidesPerMove);
            //     if (options.useCSS ) {
            //         slider.css('-'+_options.cssPrefix+'-transition-duration', options.duration / 1000 + 's');
            //         slider.css(_options.animProp, 'translate3d('+next_slide+'px,0,0)');
            //     } else {
            //         moveIt(next_slide, function(){
            //             if ((newPos - Math.abs(slider.position().left)) <= 1)
            //             {
            //                 next_slide = 0;
            //                 currentSlide = 0;
            //                 slider.css('left','0px');
            //             }
            //         });
            //     }
            // }
            // function prevSlide()
            // {
            //     next_slide+= slider.children().width()*options.slidesPerMove;
            //     currentSlide--;
            //     if (currentSlide < 0)
            //     {
            //         currentSlide = 9;
            //     }
            //     var newPos = slider.children().width()*options.slidesPerMove;
            //     moveIt(next_slide, function(){
            //         if(slider.position().left == newPos)
            //         {
            //             var pos = slider.children().width()*(slider.children().length-(options.slidesPerMove*3));
            //             next_slide = -pos;
            //             slider.css('left', '-'+pos+'px');
            //         }
            //     });
            // }

            function setSlidePosition(index) {
                position = -index*itemWidth;
                currentSlide = index;
                if (options.useCSS) {
                    slider.css('-'+_options.cssPrefix+'-transition-duration', options.duration / 1000 + 's');
                    slider.css(_options.animProp, 'translate3d('+position+'px,0,0)');
                } else {
                    moveIt(position);
                }
            }


            function moveIt(pos, callback) {
                slider.animate({
                    left: -pos
                }, options.duration, options.ease, callback);
            }

            return {
                nextSlide: function(){
                    this.clear();
                    // nextSlide();
                    if (currentSlide <= totalSlides) {
                        slide = currentSlide + 1;
                        setSlidePosition(slide);
                    }
                },
                prevSlide: function(){
                    this.clear();
                    // prevSlide();
                    if (currentSlide != 0) {
                        slide = currentSlide - 1;
                        setSlidePosition(slide);
                    }
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
                    setSlidePosition(slide - 1);
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