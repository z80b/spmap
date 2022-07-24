window.map = null;
window.drawingManager = null;
window.currentOverlay = null;
window.overlays = [];

window.currentColor = '#FF0000';

function prepareOverlaysData() {
    var result_array = new Array();
    $.each(window.overlays, function(key, overlay) {
        if (overlay) switch (overlay.type) {
            case google.maps.drawing.OverlayType.CIRCLE:
                var center = overlay.getCenter();
                result_array[key] = $.param({
                    type : 'circle',
                    radius : overlay.getRadius(),
                    lat    : center.lat(),
                    lng    : center.lng(),
                    color  : overlay.fillColor,
                    opacity: isNaN(overlay.fillOpacity) ? 0.6 : overlay.fillOpacity,
                    weight : overlay.strokeWeight,
                    description : overlay.description || '',
                    title : overlay.title || '',
                    file  : overlay.file || ''
                });
                break;
            case google.maps.drawing.OverlayType.POLYGON:
                var path = overlay.getPath();
                result_array[key] = $.param({
                    type   : 'polygon',
                    path   : google.maps.geometry.encoding.encodePath(path),
                    color  : overlay.fillColor,
                    opacity: isNaN(overlay.fillOpacity) ? 0.6 : overlay.fillOpacity,
                    weight : overlay.strokeWeight,
                    description : overlay.description || '',
                    title : overlay.title || '',
                    file  : overlay.file || ''
                });
                break;
            case google.maps.drawing.OverlayType.POLYLINE:
                var path = overlay.getPath();
                result_array[key] = $.param({
                    type   : 'polyline',
                    path   : google.maps.geometry.encoding.encodePath(path),
                    color  : overlay.strokeColor,
                    weight : overlay.strokeWeight,
                    description : overlay.description || '',
                    title : overlay.title || '',
                    file  : overlay.file || ''
                });
                break;
            case google.maps.drawing.OverlayType.MARKER:
                var position = overlay.getPosition();
                result_array[key] = $.param({
                    type   : 'marker',
                    lat    : position.lat(),
                    lng    : position.lng(),
                    description : overlay.description || '',
                    title : overlay.title || '',
                    file  : overlay.file || ''
                });
                break;
            case google.maps.drawing.OverlayType.RECTANGLE:
                var bounds = overlay.getBounds();
                var ne_bound = bounds.getNorthEast();
                var sw_bound = bounds.getSouthWest();
                result_array[key] = $.param({
                    type   : 'rectangle',
                    ne_lat : ne_bound.lat(),
                    ne_lng : ne_bound.lng(),
                    sw_lat : sw_bound.lat(),
                    sw_lng : sw_bound.lng(),
                    color  : overlay.fillColor,
                    opacity: isNaN(overlay.fillOpacity) ? 0.6 : overlay.fillOpacity,
                    weight : overlay.strokeWeight,
                    description : overlay.description || '',
                    title : overlay.title || '',
                    file  : overlay.file || ''
                });
                break;
        }
    });
    return result_array.join('|');
}


function addLatLng(event) {
    if (window.currentOverlay) {
        window.currentOverlay.setOptions({editable: false});
    }

    google.maps.event.addListener(event.overlay, 'click', function() {
        if (window.currentOverlay) {
            window.currentOverlay.setOptions({editable: false});
        }
        event.overlay.setOptions({editable: true});
        window.currentOverlay = event.overlay;
        $('#overlay-description').val(unescape(window.currentOverlay.description));
        $('#overlay-title').val(unescape(window.currentOverlay.title));
        $('#stroke-weight-select').val(window.currentOverlay.strokeWeight || 1);
        $('#color-picker').ColorPickerSetColor(window.currentOverlay.strokeColor);
        $('#stroke-color-select').val(window.currentOverlay.strokeColor);
    });
    google.maps.event.addListener(event.overlay, 'rightclick', function() {
        event.overlay.setOptions({editable: false});
    });

    var index = window.overlays.length;
    window.overlays[index] = event.overlay;
    
    event.overlay.setOptions({
        index : index,
        type  : event.type,
        description : '',
        title : ''
    });
    
    window.currentOverlay = event.overlay;
    $('#overlay-description').val('');
    $('#overlay-title').val('');
    
    return;
}

function drawOverlays(overlays, map) {
    $.each(overlays, function(id, overlay) {
        if (overlay.type) drawOverlay(id, overlay, map);
    });
}

function drawOverlay(id, overlay, map) {
    var _overlay = null;
    switch (overlay.type) {
        case 'marker':
            var position = new google.maps.LatLng(overlay.lat, overlay.lng);
            _overlay = new google.maps.Marker({
                position : position, 
                map      : map
            });
            break;
        case 'polygon':
            var path = google.maps.geometry.encoding.decodePath(overlay.path);
            _overlay = new google.maps.Polygon({
                path         : path,
                fillColor    : overlay.color,
                strokeColor  : overlay.color,
                fillOpacity  : isNaN(overlay.opacity) ? 0.6 : overlay.opacity,
                strokeWeight : overlay.weight,
                map          : map
            });
            break;
        case 'polyline':
            var path = google.maps.geometry.encoding.decodePath(overlay.path);
            _overlay = new google.maps.Polyline({
                path         : path,
                strokeColor  : overlay.color,
                fillOpacity  : isNaN(overlay.opacity) ? 0.6 : overlay.opacity,
                strokeWeight : overlay.weight,
                map          : map
            });
            break;
        case 'rectangle':
            var ne_bound =  new google.maps.LatLng(overlay.ne_lat, overlay.ne_lng);
            var sw_bound =  new google.maps.LatLng(overlay.sw_lat, overlay.sw_lng);
            var bounds   = new google.maps.LatLngBounds(sw_bound, ne_bound);
            _overlay = new google.maps.Rectangle({
                bounds       : bounds,
                fillColor    : overlay.color,
                strokeColor  : overlay.color,
                fillOpacity  : isNaN(overlay.opacity) ? 0.6 : overlay.opacity,
                strokeWeight : overlay.weight,
                map          : map
            });
            break;
        case 'circle':
            var center = new google.maps.LatLng(overlay.lat, overlay.lng);
            _overlay = new google.maps.Circle({
                center       : center,
                radius       : parseFloat(overlay.radius),
                fillColor    : overlay.color,
                strokeColor  : overlay.color,
                fillOpacity  : isNaN(overlay.opacity) ? 0.6 : overlay.opacity,
                strokeWeight : overlay.weight,
                map          : map
            });
            break;
    }
    google.maps.event.addListener(_overlay, 'click', function() {
        if (window.currentOverlay) {
            window.currentOverlay.setOptions({editable: false});
        }
        _overlay.setOptions({editable: true});
        window.currentOverlay = _overlay;
        
        //alert(window.currentOverlay.weight);
        $('#stroke-weight-select').val(window.currentOverlay.strokeWeight || 1);
        $('#color-picker').ColorPickerSetColor(window.currentOverlay.strokeColor);
        $('#stroke-color-select').val(window.currentOverlay.strokeColor);
        if (window.currentOverlay.description) {
            $('#overlay-description').val(unescape(window.currentOverlay.description));
        } else $('#overlay-description').val('');
        if (window.currentOverlay.title) {
            $('#overlay-title').val(unescape(window.currentOverlay.title));
        } else $('#overlay-title').val('');
        if (window.currentOverlay.file) {
            var file = window.currentOverlay.file.split(';');
            var _html = '<table><tr><th>File name</th><th></th></tr><tr><td>'+ file[1] +'<td><td></td></tr/></table>';
            $('#overlay-attach-wrapper').html(_html);
        } else $('#overlay-attach-wrapper').empty();
    });
    google.maps.event.addListener(_overlay, 'rightclick', function() {
        _overlay.setOptions({editable: false});
    });
    var index = window.overlays.length;
    
    _overlay.setOptions({
        index : index,
        type  : overlay.type,
        description : overlay.description,
        title : overlay.title,
        file : overlay.file
    });
    window.overlays[index] = _overlay;
}

function initialize() {
    var myLatlng = new google.maps.LatLng(56.30853843465366, 38.14144178271488);
    var myOptions = {
    zoom: 12,
    center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    window.map = new google.maps.Map(document.getElementById("spmap"), myOptions);
    window.drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },
        polygonOptions : {
            fillColor : window.currentColor,
            strokeColor : window.currentColor,
            fillOpacity: 0.6,
            strokeWeight: 3,
            clickable: true,
            editable: true,
            zIndex: 1
        },
        polylineOptions : {
            strokeColor : window.currentColor,
            strokeWeight: 3,
            clickable: true,
            editable: true,
            zIndex: 1
        },
        circleOptions: {
            fillColor: window.currentColor,
            strokeColor : window.currentColor,
            fillOpacity: 0.6,
            strokeWeight: 3,
            clickable: true,
            editable: true,
            zIndex: 1
        },
        rectangleOptions : {
            fillColor: window.currentColor,
            strokeColor : window.currentColor,
            fillOpacity: 0.6,
            strokeWeight: 3,
            clickable: true,
            editable: true,
            zIndex: 1
        }
    });
    
    if (window.map && map_overlays) {
        drawOverlays(map_overlays, window.map);
    }
    
    drawingManager.setMap(window.map);
    google.maps.event.addListener(window.drawingManager, 'overlaycomplete', addLatLng);
}

$(document).ready(function() {
    //fillOpacity('#FF0000');
    $('#color-picker').ColorPicker({
        flat     : true,
        color    : '#FF0000',
	onSubmit : function(hsb, hex, rgb, el) {
            $('#stroke-color-select').val('#'+hex);

            if (window.currentOverlay) {
                if (window.currentOverlay.type == google.maps.drawing.OverlayType.POLYLINE) {
                    window.currentOverlay.setOptions({
                        strokeColor : '#'+hex,
                        editable    : false
                    });
                } else {
                    window.currentOverlay.setOptions({
                        fillColor   : '#'+hex,
                        strokeColor : '#'+hex,
                        fillOpacity : 0.6,
                        editable    : false
                    });
                }
            }

            if (window.drawingManager) {
                var _polylineOptions = window.drawingManager.get('polylineOptions');
                _polylineOptions.strokeColor = '#'+hex;
                window.drawingManager.set('polylineOptions', _polylineOptions);

                var _rectangleOptions = window.drawingManager.get('rectangleOptions');
                _rectangleOptions.fillColor = '#'+hex;
                _rectangleOptions.strokeColor = '#'+hex;
                window.drawingManager.set('rectangleOptions', _rectangleOptions);

                var _circleOptions = window.drawingManager.get('circleOptions');
                _circleOptions.fillColor = '#'+hex;
                _circleOptions.strokeColor = '#'+hex;
                window.drawingManager.set('circleOptions', _circleOptions);

                var _polygonOptions = window.drawingManager.get('polygonOptions');
                _polygonOptions.fillColor = '#'+hex;
                _polygonOptions.strokeColor = '#'+hex;
                window.drawingManager.set('polygonOptions', _polygonOptions);
            }
	}
    });
    
    $('#reset-color').click(function() {
        if (window.currentOverlay) {
            var hex = $('#stroke-color-select').val() || '#FF0000';
            if (window.currentOverlay.type != google.maps.drawing.OverlayType.POLYLINE) {
                window.currentOverlay.setOptions({
                    fillColor   : hex,
                    strokeColor : hex,
                    fillOpacity : 0,
                    editable    : false
                });
            }
        }
        return false;
    });
    
    $('#stroke-weight-select').click(function() {
        var weight = $(this).val();
        if (window.currentOverlay) {
            window.currentOverlay.setOptions({
                strokeWeight : weight,
                editable     : false
            });
        }

        if (window.drawingManager) {
            var _polylineOptions = window.drawingManager.get('polylineOptions');
            _polylineOptions.strokeWeight = weight;
            window.drawingManager.set('polylineOptions', _polylineOptions);

            var _rectangleOptions = window.drawingManager.get('rectangleOptions');
            _rectangleOptions.strokeWeight = weight;
            window.drawingManager.set('rectangleOptions', _rectangleOptions);

            var _circleOptions = window.drawingManager.get('circleOptions');
            _circleOptions.strokeWeight = weight;
            window.drawingManager.set('circleOptions', _circleOptions);

            var _polygonOptions = window.drawingManager.get('polygonOptions');
            _polygonOptions.strokeWeight = weight;
            window.drawingManager.set('polygonOptions', _polygonOptions);
        }
    });
    
    $('#radius-select').click(function() {
        var radius = $(this).val();
        if (window.currentOverlay) {
            window.currentOverlay.setOptions({
                radius : parseFloat(radius),
                editable     : false
            });
        }
        if (window.drawingManager) {
            var _circleOptions = window.drawingManager.get('circleOptions');
            _circleOptions.radius = radius;
            window.drawingManager.set('circleOptions', _circleOptions);
        }
    });
    
    $.getScript('https://maps.google.com/maps/api/js?key=AIzaSyBt_Yvsfi1XszP0j_XzaUQTsgYf-GKu84Q&sensor=false&libraries=drawing,geometry&callback=initialize');
    
    $('#delete-overlay-button').click(function() {
        if (window.currentOverlay) {
            delete(window.overlays[window.currentOverlay.index]);
            window.currentOverlay.setMap(null);
        }
        return false;
    });
    
    $('#overlay-description-save').click(function() {
        if (window.currentOverlay) {
            window.currentOverlay.description = escape($('#overlay-description').val());
            window.currentOverlay.title = escape($('#overlay-title').val());
            alert('Описание сохранено');
        }
        return false;
    });
    
    $('#edit-submit').click(function() {
        var mapData = $('#map-data');
        var data = prepareOverlaysData();
        if (!mapData.length) {
            mapData = $('<input id="map-data" name="map_data" type="hidden" />');
            mapData.appendTo('#node-form');
        }
        console && console.log(data);
        mapData.val(data);
        //return false;
    });
});

$.fn.rightClick = function(_function) {
    $(this).bind('contextmenu rightclick', function(e){
        e.preventDefault();
        _function();
        return false;
    });
}
