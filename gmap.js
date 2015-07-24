(function($) {
	function GMap($targetEle){
    	 this.marker;
    	 var $target = $targetEle;
    	 this.getMarker = function(){
    		 return marker;
    	 }
    	 this.getTarget = function(){
    		 return $target;
    	 }
    	 var fieldVal = "";
    	 $($target).closest('.form-field').find('.compositeWrapper > span').each(function(){
    		 var val = $(this).find(':input').val();
    	 });
    	
    	 this.open();
     }
	GMap.prototype.open = function(){
    	 var geocoder, geolocation;
         var map;
         var infowindow = new google.maps.InfoWindow({size: new google.maps.Size(150,50)});
         var self = this;
         geocoder = new google.maps.Geocoder();
         var latlng = new google.maps.LatLng(-34.397, 150.644);
         var mapOptions = {
           zoom: 8,
           center: latlng,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         }
         
         
         $('#map_canvas').zcmodal({
        	 title : 'Pick your address',
        	width : 700,
        	closeOnAnyClick : false,
        	beforeShow : function(modalBody){
        		 map = new google.maps.Map($(modalBody).find('#mapDiv')[0], mapOptions);
                google.maps.event.addListener(map, 'click', function() {
                  infowindow.close();
                });
                var inputBox = $(modalBody).find('input[type=text]');
                var defaultval =  "";
                $(self.getTarget()).closest('.compositeWrapper').find("span").each(function(){
                	var val = $(this).find(':input[type=text]').val();
                	defaultval = (val != "" && val != undefined) ? defaultval+val+", " : defaultval ;
                });
                google.maps.event.addListener(map, 'rightclick', function(event) {
                    self.marker.setPosition(event.latLng);
                    geocodePosition(event.latLng);
                  });
                if(isNull(defaultval)){
                	if (navigator.geolocation) {
                		navigator.geolocation.getCurrentPosition(function(position) {
                			var location = new google.maps.LatLng(
                					position.coords.latitude, position.coords.longitude);
                			addLocationMarker(location);
                		});
                	}
                }else{
                	geocoder.geocode( { 'address': defaultval}, function(results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        if(self.marker == undefined){
	            	    	self.marker = new google.maps.Marker({
	            	    		map: map,
	            	    		draggable: true,
	            	    		position: results[0].geometry.location
	            	    	});
	            	    	regMarkerEvents();
	            	    }
                        self.marker.address_components = results[0].address_components;
				        self.marker.formatted_address = results[0].formatted_address;
                        google.maps.event.trigger(self.marker, 'click');
                      } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                      }
                    });
                }
                
//                var autocomplete = new google.maps.places.Autocomplete($(modalBody).find('input[type=text]')[0],{ types: ['geocode'] });
    			
// 				google.maps.event.addListener(autocomplete, 'place_changed', function() {
// 				  var place = autocomplete.getPlace();
// 				  var addressComp = place.address_components;
// 				  map.setCenter(place.geometry.location);
// 				  if(self.marker == undefined){
//            	    	self.marker = new google.maps.Marker({
//            	    		map: map,
//            	    		draggable: true,
//            	    		position: place.geometry.location
//            	    	});
//            	    	regMarkerEvents();
//            	    }else{
//            	    	self.marker.setPosition(place.geometry.location);
//            	    }
// 				  	self.marker.formatted_address = place.formatted_address;
//                    google.maps.event.trigger(self.marker, 'click');
// 			});
                
 				$(modalBody).find(':input[type=button]').click(function(){
 					if(self.marker == undefined){
            	    	self.marker = new google.maps.Marker({
            	    		map: map,
            	    		draggable: true,
            	    		position: map.getCenter()
            	    	});
            	    	regMarkerEvents();
            	    }else{
            	    	self.marker.setPosition(map.getCenter());
            	    }
 					geocoder.geocode({'latLng': map.getCenter()}, function(results, status) {
 					    if (status == google.maps.GeocoderStatus.OK) {
 					      if (results[0]) {
// 					        map.setZoom(11);
// 					        infowindow.setContent(results[0].formatted_address);
 					    	 self.marker.address_components = results[0].address_components;
 					        self.marker.formatted_address = results[0].formatted_address;
 					       google.maps.event.trigger(self.marker, 'click');
 					      } 
 					    }
 					  });
 				})
 				
 					
 					var searchBox = new google.maps.places.SearchBox((inputBox[0]));

 					  // Listen for the event fired when the user selects an item from the
 					  // pick list. Retrieve the matching places for that item.
 					  google.maps.event.addListener(searchBox, 'places_changed', function() {
 					    var places = searchBox.getPlaces();
 					    if (places.length == 0) {
 					      return;
 					    }

 					    // For each place, get the icon, place name, and location.
 					   var bounds = new google.maps.LatLngBounds();
 					   var place = places[0];
 					   var addressComp = place.address_components;
 					   map.setCenter(place.geometry.location);
 	 				  	if(self.marker == undefined){
 	            	    	self.marker = new google.maps.Marker({
 	            	    		map: map,
 	            	    		draggable: true,
 	            	    		position: place.geometry.location
 	            	    	});
 	            	    	regMarkerEvents();
 	            	    }else{
 	            	    	self.marker.setPosition(place.geometry.location);
 	            	    }
 	 				  	self.marker.formatted_address = $(inputBox).val();//place.formatted_address;
 	 				  	self.marker.address_components = place.address_components;
 	                    google.maps.event.trigger(self.marker, 'click');
 					   
 					    bounds.extend(place.geometry.location);

 					    map.fitBounds(bounds);
 					  });

 					  // Bias the SearchBox results towards places that are within the bounds of the
 					  // current map's viewport.
 					  google.maps.event.addListener(map, 'bounds_changed', function() {
 					    var bounds = map.getBounds();
 					    searchBox.setBounds(bounds);
 					  });
//                $(modalBody).find('form').submit(function(e){
//                	e.preventDefault();
//                    var address = $(modalBody).find('input[name=searchmap]').val();
//                    geocoder.geocode( { 'address': address}, function(results, status) {
//                      if (status == google.maps.GeocoderStatus.OK) {
//                        map.setCenter(results[0].geometry.location);
////            	    if (self.marker) {
////            	    	self.marker.setMap(null);
////                           if (infowindow) infowindow.close();
////                        }
//            	    if(self.marker == undefined){
//            	    	self.marker = new google.maps.Marker({
//            	    		map: map,
//            	    		draggable: true,
//            	    		position: results[0].geometry.location
//            	    	});
//            	    	regMarkerEvents();
//            	    }else{
//            	    	self.marker.setPosition(results[0].geometry.location);
//            	    }
//                        google.maps.event.trigger(self.marker, 'click');
//                      } else {
//                        alert('Geocode was not successful for the following reason: ' + status);
//                      }
//                    });
//                  
//                });
        	},
        	buttons : [{
        		name : "Ok",
         	   type : Constants.MODAL_SUBMIT,
         	   action : function(){
         		   var marker = $gmap.getTopMap().marker;
         		   var addressComp = marker.address_components;
         		   self.getTarget().val(marker.formatted_address);
         		   self.getTarget().trigger("picked",[addressComp])
         	   }
        	},
        	{
        		name : "Cancel",
         	   type : Constants.MODAL_CANCEL,
         	   action : function(){}
        	}
        	           ]
         });
        

	     function clone(obj){
	         if(obj == null || typeof(obj) != 'object') return obj;
	         var temp = new obj.constructor(); 
	         for(var key in obj) temp[key] = clone(obj[key]);
	         return temp;
	     }
	     
	    function regMarkerEvents() {
	    	 google.maps.event.addListener(self.marker, 'dragend', function() {
                 // updateMarkerStatus('Drag ended');
                 geocodePosition(self.marker.getPosition());
               });
               google.maps.event.addListener(self.marker, 'click', function() {
                 if (self.marker.formatted_address) {
                   infowindow.setContent(self.marker.formatted_address);
                 } else  {
                   infowindow.setContent(address);
                 }
                 infowindow.open(map, self.marker);
               });
	    }
	     
	   function addLocationMarker(location){
			 self.marker = new google.maps.Marker({
	    		map: map,
	    		draggable: true,
	    		position: location
	    	});
			 regMarkerEvents();
		   map.setCenter(location);
		   geocodePosition(location)
	   }
	   
	   function geocodePosition(pos) {
	     geocoder.geocode({
	       latLng: pos
	     }, function(responses) {
	       if (responses && responses.length > 0) {
	    	   self.marker.formatted_address = responses[0].formatted_address;
	    	   self.marker.address_components  = responses[0].address_components;
	       } else {
	    	   self.marker.formatted_address = 'Cannot determine address at this location.';
	       }
	       infowindow.setContent(self.marker.formatted_address);
	       infowindow.open(map, self.marker);
	     });
	   }

     }
     $gmap = {
    	 mapStack : [],
    	 getTopMap : function(){
    		 return this.mapStack[this.mapStack.length-1];
    	 }
     };
     
     $.fn.gMap = function(){
    	 var gmap =  new GMap($(this));
    	 $gmap.mapStack.push(gmap);
    	 return gmap;
     }
})(window.jQuery);
