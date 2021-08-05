if (window.location.href.includes('profile')) { // workaround to script only be applied on profile page
    const location = document.getElementById("location").value
    const latitude = document.getElementById("latitude").value
    const longitude = document.getElementById("longitude").value
    if (location != "") {
        var map = L.map('mapid').setView([latitude, longitude], 13); // lat lon zoom: ;

        var marker = L.marker([latitude, longitude], {
            draggable: true,
            autoPan: true // to move beyond boundaries
        }).addTo(map);

        getAddress(latitude, longitude);
        updateLatLng(latitude, longitude);
    } else {
        const randomLatitude = 49.25118302968609;
        const randomLongitude = -123.13589560572018;

        var map = L.map('mapid').setView([randomLatitude, randomLongitude], 13); // lat lon zoom: ;

        var marker = L.marker([latitude, longitude], {
            draggable: true,
            autoPan: true // to move beyond boundaries
        }).addTo(map);

        getAddress(randomLatitude, randomLongitude);
        updateLatLng(randomLatitude, randomLongitude);
    }

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
    }).addTo(map);

    // marker.bindPopup("<b>Hello world!</b><br>I am a popup.")
        // .openPopup();
    marker.on('dragend', function (e) {
        var marker = e.target;
        var location = marker.getLatLng();
        var lat = location.lat;
        var lon = location.lng;
        getAddress(lat, lon);
        updateLatLng(lat, lon);
    });
    map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        var location = marker.getLatLng();

        var lat = location.lat;
        var lon = location.lng;
        getAddress(lat, lon);
        updateLatLng(lat, lon);
    });
    function getAddress(lt, ln) {
        $.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lt}&lon=${ln}`, function (data) {
            // console.log(data.address)
            let address = ''
            // if (data.address.hasOwnProperty('neighbourhood')) {
            //     address += data.address.neighbourhood + " ";
            // }
            // if (data.address.hasOwnProperty('suburb')) {
            //     address += data.address.suburb + " ";
            // }
            if (data.address.hasOwnProperty('house_number')) {
                address += data.address.house_number + ", ";
            }
            if (data.address.hasOwnProperty('road')) {
                address += data.address.road + ", ";
            }
            if (data.address.hasOwnProperty('city')) {
                address += data.address.city + ", ";
            }
            if (data.address.hasOwnProperty('state')) {
                address += data.address.state + ", ";
            }
            if (data.address.hasOwnProperty('postcode')) {
                address += data.address.postcode;
            }
            // console.log(address)
            document.getElementById("location").value = address;
        });
    }

    function updateLatLng(lat, lng) {
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;
        // map.panTo([lat, lng]);
    }

    // marker.on("drag", function (e) { // autoPan
    //     var marker = e.target;
    //     var position = marker.getLatLng();
    //     map.panTo(new L.LatLng(position.lat, position.lng));
    // });

    // var popup2 = L.popup();
    // function onMapClick(e) {
    //     console.log("You clicked the map at " + e.latlng);
    //     popup2
    //         .setLatLng(e.latlng)
    //         .setContent("You clicked the map at " + e.latlng.toString())
    //         .openOn(map);
    // }
    // map.on('click', onMapClick);

    const provider = new window.GeoSearch.OpenStreetMapProvider({
        params: {
            addressdetails: 1, // include additional address detail parts
        }
    });
    const search = new GeoSearch.GeoSearchControl({
        provider,
        style: 'bar',
        searchLabel: 'Search for address',
        // autoClose: true,
        keepResults: true
    });
    map.addControl(search);
    map.on('geosearch/showlocation', () => {
        if (marker) {
            map.removeControl(marker); // remove previous marker
        }

        map.eachLayer(item => {
            if (item instanceof L.Marker) {
                marker = item; // map onclick
                item.options.draggable = true;
                item.options.autoPan = true;
                item.dragging.enable();

                // console.log(item._latlng)
                // console.log(item._popup._content)
                var lat = item._latlng.lat;
                var lon = item._latlng.lng;
                getAddress(lat,lon);
                updateLatLng(lat,lon);

                item.on('dragend', function (e) {
                    var location = marker.getLatLng();
                    var lat = location.lat;
                    var lon = location.lng;
                    getAddress(lat, lon);
                    updateLatLng(lat, lon);
                });
            }
        });
    });
}