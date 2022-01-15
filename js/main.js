$(document).ready(function() {
  console.log("ready!");

  var con_box_shadow = 'rgba(17, 20, 34, 0.56) 5px 7px 5px 0px';
  var sin_box_shadow = 'rgba(0, 0, 0, 0) 0px 0px 0px 0px';

  function abrir_acordeon(){
    $('button > .font-effect-3d-float').css('color', '#373737');
    $(this).find('.mostrar_mas').css("display", "none");
    $(this).find('.mostrar_menos').css("display", "block");
    $(this).css('border-radius', '8px 8px 0px 0px');
    $(this).css('box-shadow', 'none');
    $(this.children).each(function(i) {
      $(this).css('color', '#fff');
      $(this).css('text-shadow', '3px 4px 6px #011828');
      $(this).css('font-weight', 'bolder');
    });
    var panel = $(this).next();
    if (panel.css('display') != 'flex') {
      panel.css('display', "flex");
    }
  }

  function cerrar_acordeon(){
    console.log('cerrar_acordeon');
    $(this).find('.mostrar_mas').css("display", "block");
    $(this).find('.mostrar_menos').css("display", "none");
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
  }


  $('.accordion').each(function(i) {

    $('button > .font-effect-3d-float').css("color", "#fff");
    $('button > .font-effect-3d-float').css('text-shadow', 'none');
    $('button > .font-effect-3d-float').css('font-weight', 'bolder');

    this.addEventListener("click", function() {

      $('.active').each(function(i) {
        cerrar_acordeon.call(this);
      });

      $(this).toggleClass("active");
      if ($(this).css('box-shadow') == con_box_shadow) {
        abrir_acordeon.call(this);
      } else {
        cerrar_acordeon.call(this);
        $('button > .font-effect-3d-float').css('color', '#fff');
      }
    });
  });

  // si pinchamos fuera del acordeon los cerramos
  $(document).click(function(event) {
    if (!$(event.target).closest('.accordion').length) {
      $('.active').each(function(i) {
        cerrar_acordeon.call(this);
        $('button > .font-effect-3d-float').css('color', '#fff');
      });
    }
  })

});
