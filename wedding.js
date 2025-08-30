// Slick slider init

$('.slider').slick({
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  centerMode: true,
  variableWidth: false,
  draggable: false,     // Disabled dragging
  autoplay: false,      // Disabled autoplay
  pauseOnFocus: true,
  pauseOnHover: true,
  swipe: true          // Enable swipe for mobile
});

// Click handler for slides
$('.slick-slide').click(function() {
    $('.slider').slick('slickNext');
});

$('.slider')
  .on('beforeChange', function(event, slick, currentSlide, nextSlide){
    $('.slick-list').addClass('do-transition')
  })
  .on('afterChange', function(){
    $('.slick-list').removeClass('do-transition')
  });
