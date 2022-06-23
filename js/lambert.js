$(document).ready(function () {
  $(".resultsTd").hide();
});
function compute_ftL(form) {
  $(".lamb-req").each(function () {
    if (!$(this).val() && !$("#lambert-error").length) {
      $(".errorcol").prepend(
        '<div id="lambert-error" style="font-weight: bold; padding: 0; color: red; position: relative; top: 7.5px; text-align: right;">Please fill out all required fields.</div>'
      );
      return false;
    } else {
      $("#lambert-error").remove();
    }
  });

  console.log("LAMBERTS");

  var projectorLumens = 0;
  var screenWidth = 0;
  var screenHeight = 0;
  var screenGain = 0;
  var screenWidthFeet = 0;
  var screenHeightFeet = 0;
  var screenArea = 0;
  var ftL = 0;
  var goodFor = "Theater Darkness";
  screenGain = form.ftlgain.value;
  projectorLumens = form.ftllumens.value;
  screenWidth = form.ftlcustomwidth.value;
  screenHeight = form.ftlcustomheight.value;
  screenWidthFeet = rnd(eval(screenWidth / 12), 2);
  screenHeightFeet = rnd(eval(screenHeight / 12), 2);
  screenArea = rnd(screenWidthFeet * screenHeightFeet, 2);
  ftL = rnd((projectorLumens / screenArea) * screenGain, 2);
  $("#cmpftL").html(ftL+' ftL (foot-lambert)');
  if (ftL < 16)
    goodFor =
      "Your total system footlamberts are below the recommended luminance level.";
  if (ftL >= 16 && ftL < 27)
    goodFor =
      "Your total system footlamberts are in the recommended range for a dark room.";
  if (ftL >= 27 && ftL < 40)
    goodFor =
      "Your total system footlamberts are in the recommended range for low ambient light.";
  if (ftL >= 40 && ftL < 60)
    goodFor =
      "Your total system footlamberts are in the recommended range for moderate ambient light.";

  if (ftL >= 60)
    goodFor =
      "Your total system footlamberts are in the recommended range for high ambient light.";

  $("#cmpGoodFor").html(goodFor);
  $(".preresults").hide();
  $(".resultsTd").slideDown();
  document.getElementById("screenheight").innerText = document.getElementById("ftlcustomheight").value
  document.getElementById("screenwidth").innerText = document.getElementById("ftlcustomwidth").value
}
function rnd(x, p) {
  var a = [
    1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000,
    10000000000,
  ];
  return Math.round(x * a[p]) / a[p];
}

function run(field) {
  setTimeout(function () {
    var regex = /\d*\.?\d?/g;
    field.value = regex.exec(field.value);
  }, 0);

}

function LambertAspectRatio(element) {
  var radio = $(element).val();
  switch (radio) {
    case "cwh":
      $("#lambertxVal").val(0);
      $("#lambertyVal").val(0);
      $("#lambertar").val(0);
      break;
    case "cd":
      $("#lambertxVal").val(0);
      $("#lambertyVal").val(0);
      $("#lambertar").val(0);
      break;
    case "4:3":
      $("#lambertxVal").val(4);
      $("#lambertyVal").val(3);
      $("#lambertar").val($("#lambertxVal").val() / $("#lambertyVal").val());
      break;
    case "16:9":
      $("#lambertxVal").val(16);
      $("#lambertyVal").val(9);
      $("#lambertar").val($("#lambertxVal").val() / $("#lambertyVal").val());
      break;
    case "16:10":
      $("#lambertxVal").val(16);
      $("#lambertyVal").val(10);
      $("#lambertar").val($("#lambertxVal").val() / $("#lambertyVal").val());
      break;
    case "1.85:1":
      $("#lambertxVal").val(1.85);
      $("#lambertyVal").val(1);
      $("#lambertar").val($("#lambertxVal").val() / $("#lambertyVal").val());
      break;
    case "2.35:1":
      $("#lambertxVal").val(2.35);
      $("#lambertyVal").val(1);
      $("#lambertar").val($("#lambertxVal").val() / $("#lambertyVal").val());
      break;
    case "1:1":
      $("#lambertxVal").val(1);
      $("#lambertyVal").val(1);
      $("#lambertar").val($("#lambertxVal").val() / $("#lambertyVal").val());
      break;
    case "2.4:1":
      $("#lambertxVal").val(2.4);
      $("#lambertyVal").val(1);
      $("#lambertar").val($("#lambertxVal").val() / $("#lambertyVal").val());
      break;
    case "3:2":
      $("#lambertxVal").val(3);
      $("#lambertyVal").val(2);
      $("#lambertar").val($("#lambertxVal").val() / $("#lambertyVal").val());
      break;
    case "16:10":
      $("#lambertxVal").val(16);
      $("#lambertyVal").val(10);
      $("#lambertar").val($("#lambertxVal").val() / $("#lambertyVal").val());
      break;
    case "15:9":
      $("#lambertxVal").val(15);
      $("#lambertyVal").val(9);
      $("#lambertar").val($("#lambertxVal").val() / $("#lambertyVal").val());
      break;
  }
 
  lambert_calc_width();
  
}
function lambert_calc_width() {
  if ($("#lambertar").val() > 0) {
    var heightVal;
    var diagonalVal;
    var base;
    heightVal =
      $("#ftlcustomwidth").val() *
      ($("#lambertyVal").val() / $("#lambertxVal").val());

    $("#ftlcustomheight").val(parseFloat(heightVal.toFixed(2)));
    base =
      Math.pow($("#ftlcustomwidth").val(), 2) +
      Math.pow($("#ftlcustomheight").val(), 2);
    diagonalVal = Math.pow(base, 0.5);
    $("#lambertDiag").val(parseFloat(diagonalVal.toFixed(2)));
  }
}
function lambert_calc_height() {
  if ($("#lambertar").val() > 0) {
    var widthVal;
    var diagonalVal;
    var base;
    widthVal =
      $("#ftlcustomheight").val() *
      ($("#lambertxVal").val() / $("#lambertyVal").val());
    $("#ftlcustomwidth").val(parseFloat(widthVal.toFixed(2)));
    base =
      Math.pow($("#ftlcustomwidth").val(), 2) +
      Math.pow($("#ftlcustomheight").val(), 2);
    diagonalVal = Math.pow(base, 0.5);
    $("#lambertDiag").val(parseFloat(diagonalVal.toFixed(2)));
  }
}

function lambert_calc_diagonal() {
  if ($("#lambertar").val() > 0) {
    var heightVal;
    var widthVal;
    heightVal = Math.sqrt(
      Math.pow($("#lambertDiag").val(), 2) /
        (1 + Math.pow($("#lambertar").val(), 2))
    );
    $("#ftlcustomheight").val(parseFloat(heightVal.toFixed(2)));
    widthVal = $("#ftlcustomheight").val() * $("#lambertar").val();
    $("#ftlcustomwidth").val(parseFloat(widthVal.toFixed(2)));
  }
}

$("#lamber-at").change(function () {
  var currentVal = $(this).val();

  if (currentVal == "cwh") {
    $("#nc-lc-3d").slideUp();
  } else {
    $("#nc-lc-3d").slideDown();
  }
});

$(function () {
  $(
    "#frmCalculator > table > tbody > tr:nth-child(1) > td:nth-child(2), #frmCalculator > table > tbody > tr:nth-child(1) > td:nth-child(4), #frmCalculator > table > tbody > tr:nth-child(2) > td:nth-child(1), #frmCalculator > table > tbody > tr:nth-child(2) > td:nth-child(2), #frmCalculator > table > tbody > tr:nth-child(3) > td:nth-child(1), #frmCalculator > table > tbody > tr:nth-child(3) > td:nth-child(2)"
  ).addClass("oldtheme-hide");

  var num = 1;

  $("#distCalc tr").each(function () {
    $(this).attr("data-rownum", num);
    num++;
  });

  $("#distCalc tr[data-rownum='6'] td strong").text(
    "3. RECOMMENDATIONS (IN FEET)"
  );

  $("#projectionCalculator").before("<h1>Projector Calculator</h1>");

  $("#nc-lc-legend").wrap('<div id="nc-l-wrap"></div>');


  $(".screenSizeComp + .calcRows").after('<div class="about-well"></div>');

  var lambertLabels = $(".cdMRVD, .cdMAXSMPTE, .cdMAXTHX, .cdRECTHX");

  lambertLabels.each(function () {
    var theText = $(this).text();
    $(this).text(
      theText.replace("recommended ", "").replace("Recommended ", "")
    );
  });

  $("#frmCalculator input").keyup(function () {
    if (
      $(this).val().trim() !== "" &&
      $(this).val().trim() !== "0.00" &&
      $(this).val().trim() !== "0"
    ) {
      $("#calc1toggle").addClass("calc-toggle-active");
    } else {
      $("#calc1toggle").removeClass("calc-toggle-active");
    }
  });

  $("#projectionCalculator").append(
    '<a href="#" class="iframeloader">&nbsp;</a>'
  );

  $("body").on("click", "a.iframeloader", function (c) {
    c.preventDefault();
    $(this).fadeOut();

    setTimeout(function () {
      $("#projectionCalculator iframe").addClass("if-expanded");
    }, 500);
  });

  $(".cell-css label[for='ss169']").html(
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 70 50" xml:space="preserve"><style>.st0{fill:#3e94d1}</style><path class="st0" d="M25.1 9.5c-.1.1-.4.2-1 .3-.5.1-.7.2-.7.2V8.6c.4-.1.8-.3 1.2-.5.4-.2.8-.5 1-.7h1.5v11.3h-1.9V9.5zm7.1 9.4c-1 0-1.7-.3-2.2-1-.5-.7-.7-1.6-.7-2.7v-4c0-1.2.2-2.2.7-2.9.4-.7 1.2-1 2.3-1 1 0 1.7.2 2.1.7.5.5.7 1.2.7 2.1v.2h-1.9c0-.5-.1-.9-.2-1.2-.1-.2-.4-.4-.8-.4s-.6.2-.8.5c-.1.3-.2.9-.2 1.8v1.3c.1-.2.3-.4.6-.5.3-.1.6-.2 1-.2 1.6 0 2.4 1.1 2.4 3.3 0 2.7-1 4-3 4zm.1-1.5c.4 0 .6-.2.8-.5.1-.3.2-.8.2-1.5 0-.5 0-.9-.1-1.2 0-.3-.1-.5-.3-.7-.1-.2-.4-.3-.7-.3-.2 0-.4.1-.6.2-.2.1-.3.3-.4.4v1.8c0 .5.1 1 .2 1.3.2.3.5.5.9.5zm4.4-6.3h1.8V13h-1.8v-1.9zm0 4.7h1.8v1.9h-1.8v-1.9zm6 3.1c-1 0-1.7-.2-2.1-.7-.4-.5-.7-1.2-.7-2.2v-.2h1.9c0 .5.1.9.2 1.2.1.2.4.4.8.4s.6-.2.8-.5c.1-.4.2-1 .2-1.8v-1.3c-.1.2-.3.4-.6.5-.3.1-.6.2-1 .2-1.6 0-2.4-1.1-2.4-3.3 0-1.2.2-2.1.7-2.8.5-.7 1.2-1 2.3-1 1 0 1.8.3 2.2 1 .5.7.7 1.5.7 2.7v4c0 1.2-.2 2.2-.7 2.9-.4.5-1.2.9-2.3.9zm0-6c.4 0 .7-.2 1-.6v-1.8c0-.6-.1-1-.2-1.3-.1-.3-.4-.5-.8-.5s-.6.2-.8.5c-.1.3-.2.8-.2 1.5v1.2c0 .3.1.5.3.7.2.2.4.3.7.3zM23 28.7h1.8v4.1h2v-4.1h1.8v9.7h-1.8V34h-2v4.4H23v-9.7zM30 28.7h2.3c.8 0 1.4.1 1.8.3.4.2.8.5.9 1 .2.4.3 1 .3 1.7v3.5c0 .7-.1 1.3-.3 1.8-.2.5-.5.8-.9 1-.4.2-1 .3-1.8.3H30v-9.6zm2.3 8.5c.4 0 .7-.1.9-.2.2-.1.3-.3.3-.6 0-.2.1-.6.1-1.1v-3.7c0-.4 0-.8-.1-1-.1-.2-.2-.4-.4-.5-.1-.1-.4-.1-.8-.1h-.5v7.2h.5zM37.6 30h-1.5v-1.3h4.8V30h-1.5v8.4h-1.8V30zM41.4 28.7H43l1.3 6.9 1.2-6.9H47l-2 9.7h-1.7l-1.9-9.7z"/><path class="st0" d="M51 42.4H19V24.7h32v17.7zm-31-1h30V25.7H20v15.7z"/></svg>'
  );
  $(".cell-css label[for='ss43']").html(
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 70 50" xml:space="preserve"><style>.st0{fill:#3e94d1}</style><path class="st0" d="M34.5 31.7c-.1-.1-.3-.1-.5-.1h-.3V36h.3c.2 0 .4 0 .5-.1.1-.1.2-.2.2-.3V32.7c0-.3 0-.5-.1-.6.1-.3 0-.4-.1-.4zM41.6 31.5c-.2 0-.4.1-.5.2-.1.2-.1.4-.1.7v2.7c0 .3 0 .5.1.7.1.1.3.2.5.2s.4-.1.5-.2c.1-.1.1-.4.1-.7v-2.7c0-.3 0-.5-.1-.6-.1-.2-.2-.3-.5-.3z"/><path class="st0" d="M16.5 24.2v19h37v-19h-37zm7.9 12.5c-1.7 0-3-1.3-3-3s1.3-3 3-3v6zm4.3 0h-1.1l-1.2-5.9h1l.8 4.1.8-4.1h1l-1.3 5.9zm2.9 0h-1.1v-5.9h1.1v5.9zm4.3-1.9c0 .4-.1.8-.2 1.1-.1.3-.3.5-.6.6-.3.1-.6.2-1.1.2h-1.5v-5.9H34c.5 0 .9.1 1.2.2.3.1.5.3.6.6.1.3.2.6.2 1v2.2zm3.4 1.9h-2.6v-5.9h2.5v.8h-1.4v1.7H39v.7h-1.1v1.9h1.5v.8zm4.1-1.9c0 .6-.1 1.1-.4 1.4-.3.3-.7.5-1.3.5-.6 0-1.1-.2-1.4-.5-.3-.3-.4-.8-.4-1.4v-2.2c0-.6.1-1.1.4-1.4.3-.3.7-.5 1.4-.5.6 0 1.1.2 1.3.5.3.3.4.8.4 1.4v2.2zm3 1.9v-6c1.7 0 3 1.3 3 3s-1.4 3-3 3zM30.3 15.5h-3.4v-1.7l3-6.9h2.3v7h1.2v1.5h-1.2v2.8h-1.8v-2.7zm0-1.6V9l-1.8 4.9h1.8zm4.2-3.3h1.8v1.9h-1.8v-1.9zm0 4.7h1.8v1.9h-1.8v-1.9zm5.9 3.1c-2 0-3-1.1-3-3.2v-.4h1.9v.3c0 .6.1 1 .2 1.3.1.3.4.4.8.4s.7-.1.8-.4c.1-.3.2-.7.2-1.4 0-.6-.1-1.1-.3-1.4-.2-.3-.5-.5-1-.5h-.3v-1.6h.3c.5 0 .9-.1 1.1-.4.2-.3.3-.7.3-1.3 0-.5-.1-.9-.2-1.1-.1-.3-.4-.4-.8-.4s-.6.1-.8.4c-.1.3-.2.7-.2 1.2v.4h-1.9v-.5c0-1 .3-1.7.8-2.2.5-.5 1.2-.8 2.2-.8 1 0 1.7.3 2.2.8.5.5.8 1.3.8 2.2 0 .7-.1 1.2-.4 1.7-.3.4-.6.7-1.1.8.5.2.8.5 1.1.9.3.4.4 1 .4 1.8 0 1.1-.2 1.9-.7 2.5-.6.6-1.4.9-2.4.9z"/></svg>'
  );
  $(".cell-css label[for='ss11']").html(
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 70 50" xml:space="preserve"><style>.st0{fill:#3e94d1}</style><path class="st0" d="M30.5 10.5c-.1.1-.4.2-1 .3-.5.1-.7.2-.7.2V9.6c.4-.1.8-.3 1.2-.5.4-.2.8-.5 1-.7h1.5v11.3h-1.9v-9.2zm4.2 1.6h1.8V14h-1.8v-1.9zm0 4.7h1.8v1.9h-1.8v-1.9zm4.6-6.3c-.1.1-.4.2-1 .3-.5.1-.7.2-.7.2V9.6c.4-.1.8-.3 1.2-.5.4-.2.8-.5 1-.7h1.5v11.3h-1.9v-9.2zM10.5 27.6h14v14h-14zM30.8 38.6c-.7 0-1.3-.2-1.7-.6-.4-.4-.6-1-.6-1.9l1.3-.3c0 .5.1.9.2 1.2.1.3.4.4.7.4.2 0 .4-.1.5-.2.1-.1.2-.3.2-.6s-.1-.6-.2-.8c-.1-.2-.4-.5-.7-.8l-1-.9c-.3-.3-.6-.6-.7-.9-.2-.3-.2-.7-.2-1.1 0-.6.2-1.1.6-1.5.4-.4.9-.5 1.6-.5.7 0 1.2.2 1.5.6.3.4.5.9.5 1.6l-1.3.2c0-.4-.1-.8-.2-1-.1-.2-.3-.3-.6-.3-.2 0-.4.1-.5.2-.1.1-.2.3-.2.6s.1.5.2.7c.1.2.3.4.5.6l1 .9c.4.3.7.7.9 1.1.2.4.3.8.3 1.3 0 .4-.1.7-.3 1-.2.3-.4.5-.7.7-.4.2-.7.3-1.1.3zM37.7 40.1c-.2-.1-.5-.3-.8-.6-.3-.3-.6-.6-.8-.9h-.2c-.8 0-1.5-.2-1.8-.7-.4-.5-.5-1.1-.5-2v-3.1c0-.9.2-1.5.5-2 .4-.4 1-.7 1.8-.7s1.4.2 1.8.7c.4.4.5 1.1.5 2v3.1c0 1.3-.4 2.1-1.1 2.4.3.4.6.7.8.8l-.2 1zm-1.8-2.7c.3 0 .6-.1.7-.3.1-.2.2-.5.2-.9v-3.8c0-.4-.1-.7-.2-.9-.1-.2-.3-.3-.7-.3-.3 0-.6.1-.7.3-.1.2-.2.5-.2.9v3.8c0 .4.1.7.2.9.2.2.4.3.7.3zM41.6 38.6c-.6 0-1.1-.1-1.4-.3-.3-.2-.6-.5-.7-.9s-.2-.9-.2-1.5v-5.6h1.5V36c0 .5.1.8.2 1.1.1.3.3.4.7.4.4 0 .6-.1.7-.4.1-.3.2-.6.2-1.1v-5.8H44v5.6c0 .6-.1 1.1-.2 1.5-.1.4-.4.7-.7.9-.4.3-.9.4-1.5.4zM46.3 30.2h1.6l1.6 8.3h-1.4l-.3-1.9h-1.4l-.3 1.9h-1.4l1.6-8.3zm1.4 5.4l-.6-3.5-.6 3.5h1.2zM50.4 30.2h2c.9 0 1.5.2 1.9.5.4.3.6.9.6 1.7 0 .5-.1 1-.2 1.3-.1.3-.4.6-.8.7l1.1 4.1h-1.5l-1-3.8h-.7v3.8h-1.5v-8.3zm1.9 3.5c.4 0 .7-.1.9-.3.2-.2.3-.5.3-1 0-.4-.1-.8-.2-.9-.2-.2-.4-.3-.8-.3h-.6v2.5h.4zM56 30.2h3.4v1.1h-2v2.4h1.5v1h-1.5v2.7h2v1H56v-8.2z"/></svg>'
  );
  $(".cell-css label[for='ss1610']").html(
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 70 50" xml:space="preserve"><style>.st0{fill:#3e94d1}</style><path class="st0" d="M22.5 9.5c-.1.1-.4.2-1 .3-.5.1-.7.2-.7.2V8.6c.4-.1.8-.3 1.2-.5.4-.2.8-.5 1-.7h1.5v11.3h-1.9V9.5zm7.1 9.4c-1 0-1.7-.3-2.2-1-.5-.7-.7-1.6-.7-2.7v-4c0-1.2.2-2.2.7-2.9.4-.7 1.2-1 2.3-1 1 0 1.7.2 2.1.7.5.5.7 1.2.7 2.1v.2h-1.9c0-.5-.1-.9-.2-1.2-.1-.2-.4-.4-.8-.4s-.6.2-.8.5c-.1.3-.2.9-.2 1.8v1.3c.1-.2.3-.4.6-.5.3-.1.6-.2 1-.2 1.6 0 2.4 1.1 2.4 3.3 0 2.7-1 4-3 4zm0-1.5c.4 0 .6-.2.8-.5.1-.3.2-.8.2-1.5 0-.5 0-.9-.1-1.2 0-.3-.1-.5-.3-.7-.1-.2-.4-.3-.7-.3-.2 0-.4.1-.6.2-.2.1-.3.3-.4.4v1.8c0 .5.1 1 .2 1.3.3.3.6.5.9.5zm4.5-6.3h1.8V13h-1.8v-1.9zm0 4.7h1.8v1.9h-1.8v-1.9zm4.6-6.3c-.1.1-.4.2-1 .3-.5.1-.7.2-.7.2V8.6c.4-.1.8-.3 1.2-.5.4-.2.8-.5 1-.7h1.5v11.3h-1.9V9.5zm7.1 9.4c-1 0-1.7-.3-2.2-.9-.5-.6-.8-1.4-.8-2.4v-5c0-1 .2-1.8.7-2.4.5-.6 1.2-.9 2.2-.9 1 0 1.7.3 2.2.9.5.6.7 1.4.7 2.4v5c0 1-.3 1.8-.8 2.4-.3.6-1.1.9-2 .9zm0-1.7c.7 0 1-.6 1-1.7v-5c0-.5-.1-.9-.2-1.2-.1-.3-.4-.5-.8-.5s-.7.2-.8.5c-.1.3-.2.7-.2 1.2v5c0 .5.1.8.2 1.2.1.4.4.5.8.5zM45.5 40.7c1.1 0 2-.9 2-2v-11c0-1.1-.9-2-2-2h-21c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h-4c0 1.1.9 2 2 2h25c1.1 0 2-.9 2-2h-4zm-20-1c-1.1 0-2-.9-2-2v-9c0-1.1.9-2 2-2h19c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2h-19z"/><path class="st0" d="M31 29.8h2c1.1 0 1.7.6 1.7 1.9 0 1.2-.6 1.9-1.8 1.9h-.7v3H31v-6.8zm1.7 2.9c.3 0 .6-.1.7-.2.1-.1.2-.4.2-.8 0-.3 0-.5-.1-.6 0-.1-.1-.3-.2-.3-.1-.1-.3-.1-.5-.1h-.5v2h.4zM37.2 36.7c-.7 0-1.2-.2-1.5-.6-.3-.4-.4-1-.4-1.7V32c0-.7.1-1.3.4-1.7.3-.4.8-.6 1.5-.6s1.1.2 1.4.5c.3.3.4.8.4 1.5v.6h-1.2v-.6-.6c0-.1-.1-.3-.2-.3-.1-.1-.2-.1-.4-.1s-.3 0-.4.1c-.1.1-.2.2-.2.4v3.6c0 .4 0 .7.1.8.1.2.3.3.5.3s.3 0 .4-.1c.1-.1.2-.2.2-.4v-1.2H39v.5c0 .7-.1 1.2-.4 1.5-.3.4-.7.5-1.4.5z"/></svg>'
  );
  $(".cell-css label[for='ss2351']").html(
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 70 50" xml:space="preserve"><style>.st0{fill:#3e94d1}</style><path class="st0" d="M19.5 18.4l2.8-4.3c0-.1.1-.1.1-.2s.1-.1.1-.2c.3-.5.6-1 .7-1.3.2-.3.2-.7.2-1.2 0-.9-.3-1.3-.9-1.3-.4 0-.7.2-.9.5s-.3.8-.3 1.3v.5h-1.9v-.5c0-1.1.2-1.9.7-2.5.5-.6 1.2-.9 2.3-.9 1 0 1.7.3 2.2.8.5.5.7 1.2.7 2.2 0 .6-.1 1.1-.3 1.5-.2.4-.5 1-.9 1.7l-.1.2-2.3 3.5h3.4v1.6h-5.6v-1.4zm7.3-6.3h1.8V14h-1.8v-1.9zm0 4.7h1.8v1.9h-1.8v-1.9zm5.9 3.1c-2 0-3-1.1-3-3.2v-.4h1.9v.3c0 .6.1 1 .2 1.3.1.3.4.4.8.4s.7-.1.8-.4c.1-.3.2-.7.2-1.4 0-.6-.1-1.1-.3-1.4-.2-.3-.5-.5-1-.5H32V13h.3c.5 0 .9-.1 1.1-.4.2-.3.3-.7.3-1.3 0-.5-.1-.9-.2-1.1-.1-.3-.4-.4-.8-.4s-.6.1-.8.4c-.1.3-.2.7-.2 1.2v.4h-1.9v-.5c0-1 .3-1.7.8-2.2.5-.5 1.2-.8 2.2-.8 1 0 1.7.3 2.2.8.5.5.8 1.3.8 2.2 0 .7-.1 1.2-.4 1.7-.3.4-.6.7-1.1.8.5.2.8.5 1.1.9.3.4.4 1 .4 1.8 0 1.1-.2 1.9-.7 2.5-.6.6-1.3.9-2.4.9zm7 0c-1.1 0-1.8-.3-2.2-.9-.4-.6-.6-1.4-.6-2.6h1.9c0 .6.1 1.1.2 1.5.1.3.4.5.8.5.3 0 .5-.1.7-.3.1-.2.2-.5.3-.8 0-.3.1-.8.1-1.4 0-.7-.1-1.3-.2-1.7-.1-.4-.4-.5-.9-.5-.3 0-.5.1-.7.3-.2.2-.3.4-.4.7H37l.1-6.3h5.1v1.7h-3.5l-.1 2.7c.2-.2.4-.3.7-.4.3-.1.6-.2 1-.2.8 0 1.4.3 1.8.9.4.6.6 1.5.6 2.6 0 .9-.1 1.6-.3 2.2-.2.6-.5 1.1-.9 1.4-.4.4-1.1.6-1.8.6zm4.3-7.8h1.8V14H44v-1.9zm0 4.7h1.8v1.9H44v-1.9zm4.5-6.3c-.1.1-.4.2-1 .3-.5.1-.7.2-.7.2V9.6c.4-.1.8-.3 1.2-.5.4-.2.8-.5 1-.7h1.5v11.3h-1.9v-9.2zM34.2 40.7c-.8 0-1.4-.2-1.7-.7-.3-.4-.5-1-.5-1.9v-2.8c0-.9.2-1.5.5-1.9.3-.4.9-.7 1.7-.7.8 0 1.3.2 1.6.6.3.4.5.9.5 1.7v.7h-1.4V35v-.6c0-.2-.1-.3-.2-.4-.1-.1-.3-.2-.5-.2s-.4.1-.5.2c-.1.1-.2.2-.2.4v4.1c0 .4.1.8.2 1 .1.2.3.3.6.3.2 0 .4-.1.5-.2.1-.1.2-.2.2-.4v-1.4h1.4v.6c0 .8-.2 1.3-.5 1.8-.4.3-.9.5-1.7.5zM37.3 32.8h1.4v7.8h-1.4v-7.8zM39.9 32.8h1l1.9 4.5v-4.5H44v7.8h-1L41.1 36v4.7h-1.2v-7.9zM45.1 32.8h3.3v1h-1.8V36H48v1h-1.5v2.6h1.9v1h-3.3v-7.8zM49.4 32.8h1.5l1.1 5.4 1.1-5.4h1.4l.1 7.8h-1.1l-.1-5.4-1.1 5.4h-.9l-1.1-5.4-.1 5.4h-1.1l.3-7.8zM56.9 32.8h1.5l1.6 7.8h-1.3l-.3-1.8H57l-.3 1.8h-1.3l1.5-7.8zm1.3 5.1l-.5-3.3-.5 3.3h1zM15.2 30.2c.4-1.1 1.1-1.9 2.2-2.3.4-.2.9-.2 1.4-.2.5 0 .9.2 1.3.4 1 .6 1.6 1.4 1.7 2.5.2 1.1-.1 2.1-.9 3h.9c.4 0 .6.2.6.6v.8c.1 0 .1 0 .1-.1.8-.4 1.7-.8 2.5-1.3.4-.2.8 0 .8.5V40.9c0 .4-.4.8-.8.5-.8-.4-1.7-.8-2.5-1.3 0 0-.1 0-.1-.1v1.1c0 .1-.1.2-.2.2-.1.1-.2.1-.3.1H10.4c-.3 0-.5-.2-.6-.4v-.2-6.9c0-.4.2-.6.5-.6h1c-.4-.6-.6-1.3-.4-2 .1-.6.4-1.1.9-1.4.5-.4 1-.6 1.6-.6.8.3 1.3.5 1.8.9zm-1.7 6.2H15.2c.3 0 .4-.2.3-.5-.1-.2-.2-.2-.4-.2h-3.3-.1c-.1 0-.2.1-.2.1-.1.1-.1.1-.1.2 0 .2.1.4.4.4h1.7zm3.4 0h.3c.1 0 .2 0 .2-.1.1-.1.1-.1.1-.2 0-.2-.1-.3-.3-.4h-.6c-.2 0-.3.2-.3.3 0 .1 0 .2.1.2 0 .1.1.1.2.1.1.1.2.1.3.1zm-1.1-3l-.1.2h.3l-.2-.2z"/></svg>'
  );
});
$(function () {
  $(".lgw-add").on("click", function (a) {
    a.preventDefault();
    console.log("ADD");
    var qty = $(".lambert-input input");
    var currentVal = parseFloat($(qty).val());
    if (!isNaN(currentVal)) {
      $(qty).val((currentVal + 0.1).toFixed(1));
      var newQ = $(qty).val();
      $(".lamb-gain").val(newQ);
    }
  });
  $(".lgw-sub").on("click", function (s) {
    s.preventDefault();
    console.log("SUBTRACT");
    var qty = $(".lambert-input input");
    var currentVal = parseFloat($(qty).val());
    if (!isNaN(currentVal) && currentVal > 0.4) {
      $(qty).val((currentVal - 0.1).toFixed(1));
      var newQ = $(qty).val();
      $(".lamb-gain").val(newQ);
    }
  });

  $("#distCalc input[type=reset]").click(function () {
    $(".resultsTd").slideUp();
  });
});
