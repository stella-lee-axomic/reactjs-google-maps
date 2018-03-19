/* eslint-disable no-undef */
// eslint-disable-next-line
import React from 'react';

import './index.css';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            zoom: 4,
            maptype: 'roadmap',
            formatted_address: '',
            reverseGeocoding: '',
            title:'',
            place_id: '',
            lat: '',
            lng: ''
        };
    }

    componentDidMount() {

        const data = {
            keyword: 'London',
            projectTitle: 'My Project'
        }

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

        // pin draggable + search
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

        // var geocoder = new window.google.maps.Geocoder;// undefine
        // console.log(geocoder);




        const component = this

        window.google.maps.event.addListener(searchBox, 'places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length === 0) return; // length: always 1

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
                    title: place.name,
                    position: place.geometry.location
                });
                // drag response
                window.google.maps.event.addListener(marker, 'dragend', function () {
                    component.displayPosition(this.getPosition());
                });
                // click response
                window.google.maps.event.addListener(marker, 'click', function () {
                    component.displayPosition(this.getPosition());
                });
                markers.push(marker);


                console.log('ADDING PLACE', place.formatted_address)
                const { location } = place.geometry;

                bounds.extend(location);
                component.displayPosition(location);
                component.displayAddress(place.formatted_address);
                // component.geocodeLatLng()
            }

            map.fitBounds(bounds);
            map.setZoom(18);
        });

        window.google.maps.event.addListener(map, 'bounds_changed', function () {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });

    }

    displayPosition = (pos) => {
        const {lat, lng} = pos

        this.setState({
            lat: lat(),
            lng: lng()
        })
    }

    displayAddress = (adr) => {
        this.setState({
            formatted_address: adr
        })
    }


    // geocodeLatLng = (geocoder, map, infowindow) => {
    //     // var input = document.getElementById('latlng').value;
    //     // var latlngStr = input.split(',', 2);
    //     var latlng = {lat: this.state.lat, lng: this.state.lng};
    //
    //     // console.log(geocoder);
    //
    //     geocoder.geocode({'location': latlng}, function(results, status) {
    //         if (status === 'OK') {
    //             if (results[0]) {
    //                 console.log(results[0]);
    //                 // map.setZoom(11);
    //                 // var marker = new google.maps.Marker({
    //                 //     position: latlng,
    //                 //     map: map
    //                 // });
    //
    //                 this.setState({
    //                     reverseGeocoding: results[0].formatted_address
    //                 })
    //                 // infowindow.setContent(results[0].formatted_address);
    //                 // infowindow.open(map, marker);
    //             } else {
    //                 window.alert('No results found');
    //             }
    //         } else {
    //             window.alert('Geocoder failed due to: ' + status);
    //         }
    //     });
    // }


    render() {
        const { lat, lng, formatted_address, reverseGeocoding } = this.state;

        return (
            <div id='app'>
                <div id='search'>
                    <input className="address" id='pac-input' type="textbox" />
                </div>
                <div ref='lat'>lat: {lat}</div>
                <div ref='lng'>lng: {lng}</div>
                <div ref='lng'>{formatted_address} <button>save</button></div>
                <div ref='lng'>{reverseGeocoding}</div>
                    <div id='map'>
                    </div>
            </div>
        );
    }
};
