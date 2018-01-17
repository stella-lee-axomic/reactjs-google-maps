import React from 'react';

import './index.css';

export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            zoom: 4,
            maptype: 'roadmap',
            place_formatted: '',
            title:'',
            place_id: '',
            lat: '',
            lng: ''
        };

    }


    componentDidMount() {

        // map & marker --------------------------------
        // let map = new window.google.maps.Map(document.getElementById('map'), {
        //     center: {lat: -33.8688, lng: 151.2195},
        //     zoom: 13,
        //     mapTypeId: 'roadmap',
        // });
        //
        // let marker = new window.google.maps.Marker({
        //     map: map,
        //     draggable: true,
        //     animation: window.google.maps.Animation.DROP,
        //     title: 'drag',
        //     position: {lat: -33.8688, lng: 151.2195},
        // });
        ///////////////////////


        // stackoverflow
        var markers = [];
        var map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: -33.8688, lng: 151.2195},
            zoom: 4,
            mapTypeId: 'roadmap'
        });

        var defaultBounds = new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(-33.8902, 151.1759),
            new window.google.maps.LatLng(-33.8474, 151.2631));
        map.fitBounds(defaultBounds);

        var input = /** @type {HTMLInputElement} */(
            document.getElementById('pac-input')
        );

        map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(input);
        var searchBox = new window.google.maps.places.SearchBox(
            /** @type {HTMLInputElement} */(input));
        window.google.maps.event.addListener(searchBox, 'places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length === 0) return;

            for (var i = 0, marker; marker = markers[i]; i++) {
                marker.setMap(null);
            }
            markers = [];
            var bounds = new window.google.maps.LatLngBounds();
            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new window.google.maps.Size(71, 71),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(17, 34),
                    scaledSize: new window.google.maps.Size(35, 35) // 2525
                };
                var marker = new window.google.maps.Marker({
                    draggable: true,
                    map: map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location
                });
                // drag response
                window.google.maps.event.addListener(marker, 'dragend', function (e) {
                    // displayPosition(e.latLng);
                   var lat=  e.latLng.lat();
                    var lng=  e.latLng.lng();
                    this.setState({
                        lat: lat,
                        lng: lng
                    });
                    console.log();
                });
                // click response
                window.google.maps.event.addListener(marker, 'click', function (e) {
                    displayPosition(this.getPosition());
                });
                markers.push(marker);
                bounds.extend(place.geometry.location);
                // this.setState({
                //     title: marker.title
                // });
                console.log('place name:', marker.title);
            }
            map.fitBounds(bounds);
            map.setZoom(18);
        });

        window.google.maps.event.addListener(map, 'bounds_changed', function () {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });

        // displays a position on two <input> elements
        function displayPosition(pos) {
            // this.refs.lat.value = pos.lat();
            // document.getElementsByClassName('lat').value = pos.lat();
            // document.getElementsByClassName('lng').value = pos.lng();
            // this.setState({
            //     lat: pos.lat(),
            //     lng: pos.lng()
            // });
            // console.log(pos);
            console.log('lat', pos.lat());
            console.log('lng', pos.lng());
        }

        // map.addListener('zoom_changed', () => { // double click
        //     this.setState({
        //         zoom: map.getZoom(),
        //     });
        // });
        // map.addListener('maptypeid_changed', () => {
        //     this.setState({
        //         maptype: map.getMapTypeId(),
        //     });
        // });
        //
        //
        // // click to drop the pin
        // new window.google.maps.event.addListener(map, 'click', function (event) {
        //     placeMarker(event.latLng);
        //     // console.log(event.latLng);
        // });
        //
        // function placeMarker(location) {
        //     var marker = new window.google.maps.Marker({
        //         position: location,
        //         map: map
        //     });
        // }
        //
        //
        // // searchbox ------------------------------
        // var input = document.getElementById('pac-input');
        // map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
        // var places = [];
        // var searchBox = new window.google.maps.places.SearchBox(input);
        // searchBox.addListener('places_changed', function () {
        //     places = searchBox.getPlaces(); // all the place info, address
        //     if (places.length === 0) return;
        // });
        // markers.forEach(function (marker) {
        //     marker.setMap(null);
        // });
        //
        //
        // // initialize the autocomplete functionality using the #pac-input input box
        // let inputNode = document.getElementById('pac-input');
        // map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputNode);
        // let autoComplete = new window.google.maps.places.Autocomplete(inputNode);
        // // var geocoder = new window.google.maps.Geocoder();
        //
        //
        // autoComplete.addListener('place_changed', () => {
        //     let place = autoComplete.getPlace();
        //     if (!place.place_id) {
        //         console.log('inside the if')
        //     } else {
        //         let location = place.geometry.location;
        //         console.log(location);
        //
        //         this.setState({
        //             place_formatted: place.formatted_address,
        //             place_id: place.place_id,
        //             place_location: location.toString(),
        //         });
        //         // bring the selected place in view on the map
        //         map.fitBounds(place.geometry.viewport);
        //         map.setCenter(location);
        //
        //         //drag and read latLng
        //         // placeMarker(location);
        //
        //         marker.setPlace({
        //             placeId: place.place_id,
        //             location: location,
        //         });
        //     }
        // });
        // this.setState({
        //     map: map
        // });
    }

    // handleChange = (evt) => {
    //     let value = evt.target.value;
    //     this.setState({
    //         address: value
    //     })
    // }
    //
    // geocodeAddress() {
    //     var map = this.state.map;
    //     var address = this.state.address;
    //     // console.log(this.state);// not coming in
    //     var geocoder = new window.google.maps.Geocoder();
    //     geocoder.geocode({'address': address}, function (results, status) {
    //         if (status === 'OK') {
    //             map.setCenter(results[0].geometry.location);
    //             var marker = new window.google.maps.Marker({
    //                 map: map,
    //                 draggable: true,
    //                 animation: window.google.maps.Animation.DROP,
    //                 position: results[0].geometry.location
    //             });
    //         } else {
    //             alert('Geocode was not successful for the following reason: ' + status); // invalid request
    //         }
    //     });
    // }
    //
    // handleSubmit() {
    //     this.geocodeAddress();
    // }

    render() {
        return (
            <div id='app'>
                <div id='search'>
                    <input className="address" id='pac-input' type="textbox" />
                        {/*// onChange={evt => this.handleChange(evt)}*/}
                </div>

                {/*<div>location: { this.state.address} </div>*/}
                <div>address: {this.state.title} </div>
                <div ref='lat'>{this.state.lat}</div>
                <div ref='lng'>{this.state.lng}</div>

                    <div id='map'>
                    </div>
                    {/*<div id='block1'>hi*/}
                    {/*</div>*/}
            </div>
        );
    }
};
