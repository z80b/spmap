var ovl, tooltip;

$(document).ready(function() {
    //$.getScript('https://maps.google.com/maps/api/js?sensor=false&ftr=1&libraries=drawing,geometry&callback=initialize');
    $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBt_Yvsfi1XszP0j_XzaUQTsgYf-GKu84Q&ftr=1&libraries=drawing,geometry&sensor=false&callback=initialize');
});

function createControls(map) {
    var controlsDiv = document.createElement('div');
    controlsDiv.index = 1;
    controlsDiv.id = 'spmap-controls';
    
    var ruleButton = document.createElement('div');
    ruleButton.className = 'rule-button map-button';
    
    controlsDiv.appendChild(ruleButton);

    $.spmap.ruleDrawMode = false;
    google.maps.event.addDomListener(ruleButton, 'click', function() {
        if (!$.spmap.ruleDrawMode) {
            $.spmap.lastCursorType = 'default';
            map.setOptions({ draggableCursor: 'crosshair' });
            $.spmap.ruleMarkers = [];
            $.spmap.ruleDrawMode = true;
            $.spmap.lastLatLng = 0;
            $.spmap.polylineDistance = 0;
            $(ruleButton).addClass('active');
            var polyOptions = {
                strokeColor: '#FF0000',
                strokeOpacity: 0.4,
                strokeWeight: 4
            }
            $.spmap.rulePolyline = new google.maps.Polyline(polyOptions);
            $.spmap.rulePolyline.setMap(map);
        } else {
            map.setOptions({ draggableCursor: $.spmap.lastCursorType });
            $.spmap.ruleDrawMode = false;
            $(ruleButton).removeClass('active');
            $.spmap.rulePolyline.setMap(null);
            $.each($.spmap.ruleMarkers, function(index, item) {
                item && item.setMap(null);
            });
            delete($.spmap.rulePolyline, $.spmap.ruleMarkers);
        }
        return false;
    });
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlsDiv);
    
    google.maps.event.addListener(map, 'click', function(event) {
        if($.spmap.ruleDrawMode && $.spmap.rulePolyline) {
            var path = $.spmap.rulePolyline.getPath();
            
            path.push(event.latLng);
            if (!$.spmap.lastLatLng) {
                $.spmap.lastLatLng = event.latLng;
            }
            $.spmap.polylineDistance +=  google.maps.geometry.spherical.computeDistanceBetween($.spmap.lastLatLng, event.latLng);
            $.spmap.lastLatLng = event.latLng;
            
            var marker = new google.maps.Marker({
                position: event.latLng,
                title:  $.spmap.polylineDistance.toFixed(2) + 'M',
                map: map
            });
            $.spmap.ruleMarkers.push(marker);
        }
        return false;
    });
}

function initialize() {
    $.spmap = {};
    var myLatlng = new google.maps.LatLng(56.30853843465366, 38.14144178271488);
    var myOptions = {
    zoom: 12,
    center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("sp-home-map"), myOptions);
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        /*drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },*/
        polylineOptions : {
            strokeColor : '#FF0000',
            strokeWeight: 3,
            fillOpacity: 0.6,
            clickable: true,
            editable: true,
            zIndex: 1
        }
    });
    
    drawingManager.setMap(map);
    createControls(map);

    if (window.attachEvent) { 
        window.attachEvent("onresize", function() {this.map.onResize()} );
    } else {
        window.addEventListener("resize", function() {this.map.onResize()} , false);
    }
    if (map && map_overlays) {
        drawOverlays(map_overlays, map);
    } else alert('No overlays');
    
    window.infowindow = new google.maps.InfoWindow({
        content  : '<h1>No information</h1>'
    });
    
    ovl = new google.maps.OverlayView();
    ovl.draw = function() {};
    ovl.setMap(map);
}

function drawOverlays(overlays, map) {
    
    $.each(overlays, function(id, overlay) {
        if (!overlay.type) return;
        var overlay = drawOverlay(id, overlay, map);
        google.maps.event.addListener(overlay, 'click', function(event) {
            if ($.spmap.ruleDrawMode) {
                google.maps.event.trigger(map, 'click', event);
                return true;
            }
            if (this.description) {
                window.infowindow.setPosition(event.latLng);
                window.infowindow.setContent('<span style="white-space:pre-wrap">'+unescape(this.description)+'</span>');
                window.infowindow.open(map);
            }
        });
        
        google.maps.event.addListener(overlay, 'rightclick', function(event) {
            if (this.file) {
                var file_parts = this.file.split(';');
                if (parseInt(file_parts[0])) {
                    window.open('/gmapdownload/' + file_parts[0], '_self');
                }
            }
            return false;
        });
        
        google.maps.event.addListener(overlay, 'mouseover', function(event) {
            if ($.spmap.ruleDrawMode) return true;
            var px = ovl.getProjection().fromLatLngToContainerPixel(event.latLng);
            if (!$('#tooltip').length) {
                $('#map-cont').append('<div id="tooltip" />');
            }
            if (this.title) {
                $('#tooltip')
                .text(unescape(this.title))
                .show()
                .css({'top': parseInt(px.y),'left': parseInt(px.x)});
            }
        });
        google.maps.event.addListener(overlay, 'mouseout', function(event) {
            if ($.spmap.ruleDrawMode) return true;
            $('#tooltip').hide();
        });
        /*$(overlay).tooltip({
            content : function() {
                if (this.title) {
                    return this.title;
                }
            }
        });*/
    });
}

function drawOverlay(id, overlay, map) {
    var _overlay = null;
    switch (overlay.type) {
        case 'marker':
            var position = new google.maps.LatLng(overlay.lat, overlay.lng);
            var _overlay = new google.maps.Marker({
                position : position, 
                map      : map
            });   
            break;
        case 'polygon':
            var path = google.maps.geometry.encoding.decodePath(overlay.path);
            var _overlay = new google.maps.Polygon({
                path          : path,
                fillColor     : overlay.color,
                strokeColor   : overlay.color,
                fillOpacity   : isNaN(overlay.opacity) ? 0.6 : overlay.opacity,
                strokeWeight  : overlay.weight,
                map           : map
            });
            break;
        case 'polyline':
            var path = google.maps.geometry.encoding.decodePath(overlay.path);
            var _overlay = new google.maps.Polyline({
                path          : path,
                strokeColor   : overlay.color,
                fillOpacity   : isNaN(overlay.opacity) ? 0.6 : overlay.opacity,
                strokeWeight  : overlay.weight,
                map           : map
            });
            break;
        case 'rectangle':
            
            var ne_bound =  new google.maps.LatLng(overlay.ne_lat, overlay.ne_lng);
            var sw_bound =  new google.maps.LatLng(overlay.sw_lat, overlay.sw_lng);
            var bounds   = new google.maps.LatLngBounds(sw_bound, ne_bound);
            var _overlay = new google.maps.Rectangle({
                bounds        : bounds,
                fillColor     : overlay.color,
                strokeColor   : overlay.color,
                fillOpacity   : isNaN(overlay.opacity) ? 0.6 : overlay.opacity,//0.6,
                strokeWeight  : overlay.weight,
                map           : map
            });
            break;
        case 'circle':
            var center = new google.maps.LatLng(overlay.lat, overlay.lng);
            var _overlay = new google.maps.Circle({
                center        : center,
                radius        : parseFloat(overlay.radius),
                fillColor     : overlay.color,
                strokeColor   : overlay.color,
                fillOpacity   : isNaN(overlay.opacity) ? 0.6 : overlay.opacity,
                strokeWeight  : overlay.weight,
                map           : map
            }); 
            break;
    }
    if (_overlay) {
        _overlay.description = overlay.description;
        _overlay.title = overlay.title;
        _overlay.file = overlay.file;
    }
    return _overlay;
}
