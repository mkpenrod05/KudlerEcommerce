var ItemsInCart = 0;
var ItemsArray = new Array();

function slideSwitch() {
    var $active = $('#slideshow IMG.active');

    if ($active.length == 0) $active = $('#slideshow IMG:last');

    // use this to pull the images in the order they appear in the markup
    var $next = $active.next().length ? $active.next()
				: $('#slideshow IMG:first');

    // uncomment the 3 lines below to pull the images in random order

    // var $sibs  = $active.siblings();
    // var rndNum = Math.floor(Math.random() * $sibs.length );
    // var $next  = $( $sibs[ rndNum ] );


    $active.addClass('last-active');

    $next.css({ opacity: 0.0 })
		.addClass('active')
		.animate({ opacity: 1.0 }, 1000, function () {
			$active.removeClass('active last-active');
	    });
}

$(function () {
    setInterval("slideSwitch()", 5000);
});

function AddToCart(GLCode) {
    //alert(GLCode); // e.g. - "ItemCode_131005"
    GLCode = GLCode.replace("ItemCode_", "");
    //alert(GLCode); // e.g. - "131005"
    
    ItemsArray.push(GLCode);

    console.log("Array length: " + ItemsArray.length);

    $("#ItemsSelected").text(ItemsArray.length);

    console.log(ItemsArray);
}

function ThrowStandardError(HtmlElement, Message) {
    var Element = $(HtmlElement);
    Element.empty().removeClass();
    Element.show();
    Element.text(Message);
    Element.addClass("ui-state-highlight").addClass("ui-state-error");
    setTimeout(function () {
        Element.removeClass("ui-state-highlight");
    }, 1500);
}

function ViewShoppingCart() {
    $("#DialogDiv").empty();
    for (x = 0; x < ItemsArray.length; x++) {
        GetProductByGLCode(ItemsArray[x]);
    }
    $("#DialogDiv").dialog({
        autoOpen: false,
        modal: true,
        title: "Your Shopping Cart",
        width: 500
    });
    $("#DialogDiv").dialog("open");
}

////////////////////////////////////////////////////////////////////////
///////////////////////////////AJAX CALLS///////////////////////////////
////////////////////////////////////////////////////////////////////////

function GetProductByType(Type) {
    if (Type != "") {
        $.ajax({
            url: "WebService.asmx/ProductByType",
            type: "POST",
            data: "{Type:'" + Type + "'}",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            cache: false,
            beforeSend: function () {

            },
            complete: function () {
                
            },
            success: function (data) {
                if (data.d.IsError == false) {
                    $("#ItemList").html(data.d.StrData);
                } else {
                    $("#ItemList").html(data.d.ErrorMessage);
                }

                $(".AddToCart-Black").hover(function () {
                    $(this).toggleClass("AddToCart-White");
                }).click(function () {
                    var GLCode = $(this).attr("id");
                    AddToCart(GLCode);
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                ThrowStandardError("#DivTopMessage", "Error: " + xhr.status + " " + thrownError);
            },
            statusCode: {
                404: function () {
                    ThrowStandardError("#DivTopMessage", "Error 404: WebService Not Found!");
                }
            }
        });
    }
} //end GetProductByType()

function GetProductByGLCode(GLCode) {
    if (GLCode != "") {
        $.ajax({
            url: "WebService.asmx/ProductByGLCode",
            type: "POST",
            data: "{GLCode:'" + GLCode + "'}",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            cache: false,
            beforeSend: function () {

            },
            complete: function () {
                
            },
            success: function (data) {
                if (data.d.IsError == false) {
                    $("#DialogDiv").append(data.d.StrData);
                } else {
                    $("#DialogDiv").append(data.d.ErrorMessage);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                ThrowStandardError("#DivTopMessage", "Error: " + xhr.status + " " + thrownError);
            },
            statusCode: {
                404: function () {
                    ThrowStandardError("#DivTopMessage", "Error 404: WebService Not Found!");
                }
            }
        });
    }
    //alert(ReturnData);
    //return ReturnData;
} //end GetProductByGLCode()