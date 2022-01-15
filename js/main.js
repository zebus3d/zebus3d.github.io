$(document).ready(function() {
  console.log("ready!");

  $('.accordion').each(function(i) {
    $('button > .font-effect-3d-float').css("color", "white");
    $('button > .font-effect-3d-float').css('text-shadow', 'none');
    $('button > .font-effect-3d-float').css('font-weight', 'bolder');
    this.addEventListener("click", function() {

      $('.active').each(function(i) {
        $('button > .font-effect-3d-float').css('color', '#373737');
        $('button > .font-effect-3d-float').css('text-shadow', 'none');
        $('button > .font-effect-3d-float').css('font-weight', 'bolder');
        $(this).css('border-radius', '8px');
        $(this).css('box-shadow', '5px 7px 5px #1114228f');
        $(this).removeClass("active");
        var panel = $(this).next();
        if (panel.css('display') === 'flex') {
          panel.css('display', "none");
        }
      });

      $(this).toggleClass("active");
      if ($(this).css('box-shadow') != 'none') {
        $('button > .font-effect-3d-float').css('color', '#373737');
        $(this).find('.maximizar').css("display", "none");
        $(this).find('.minimizar').css("display", "block");
        $(this).css('border-radius', '8px 8px 0px 0px');
        $(this).css('box-shadow', 'none');
        $(this.children).each(function(i) {
          $(this).css('color', '#fff');
          $(this).css('text-shadow', '3px 4px 6px #011828');
          $(this).css('font-weight', 'bolder');
        });
      } else {
        $(this).find('.maximizar').css("display", "block");
        $(this).find('.minimizar').css("display", "none");
        $(this).css('border-radius', '8px');
        $(this).css('box-shadow', '5px 7px 5px #1114228f');
        $(this.children).each(function(i) {
          $(this).css('color', '#373737');
          $(this).css('text-shadow', 'none');
          $(this).css('font-weight', 'bolder');
        });
      }

      var panel = $(this).next();
      if (panel.css('display') === 'flex') {
        panel.css('display', "none");
      } else {
        panel.css('display', "flex");
      }


    });
  });

  // si pinchamos fuera del acordeon los cerramos
  $(document).click(function(event) {
    if (!$(event.target).closest('.accordion').length) {
      $('.active').each(function(i) {
        $('button > .font-effect-3d-float').css('color', '#373737');
        $('button > .font-effect-3d-float').css('text-shadow', 'none');
        $(this).css('border-radius', '8px');
        $(this).css('box-shadow', '5px 7px 5px #1114228f');
        $(this).removeClass("active");
        var panel = $(this).next();
        if (panel.css('display') === 'flex') {
          panel.css('display', "none");
        }
      });
    }
  })

});
