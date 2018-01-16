import React from 'react';

import './index.css';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            zoom: 13,
            maptype: 'roadmap',
            place_formatted: '',
            place_id: '',
            place_location: '',
        };

        // this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {

        // map & marker --------------------------------
        let map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: -33.8688, lng: 151.2195},
            zoom: 13,
            mapTypeId: 'roadmap',
        });

        let marker = new window.google.maps.Marker({
            map: map,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
            title: 'drag',
            position: {lat: -33.8688, lng: 151.2195},
        });

        var markers = [];
        map.addListener('zoom_changed', () => {
            this.setState({
                zoom: map.getZoom(),
            });
        });
        map.addListener('maptypeid_changed', () => {
            this.setState({
                maptype: map.getMapTypeId(),
            });
        });

        // searchbox ------------------------------
        var input = document.getElementById('pac-input');
            map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
        var places = [];
        var searchBox = new window.google.maps.places.SearchBox(input);
            searchBox.addListener('places_changed', function () {
                places = searchBox.getPlaces(); // all the place info, address
                if (places.length === 0) return;
            });
            markers.forEach(function (marker) {
                marker.setMap(null);
            });

            // initialize the autocomplete functionality using the #pac-input input box
            let inputNode = document.getElementById('pac-input');
                map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputNode);
            let autoComplete = new window.google.maps.places.Autocomplete(inputNode);
        // var geocoder = new window.google.maps.Geocoder();


            autoComplete.addListener('place_changed', () => {
                let place = autoComplete.getPlace();
                    console.log('test if', place.place_id);
                if(!place.place_id){
                    console.log('inside the if')
                }else {
                    let location = place.geometry.location;
                    console.log(location);

                    this.setState({
                        place_formatted: place.formatted_address,
                        place_id: place.place_id,
                        place_location: location.toString(),
                    });
                    // bring the selected place in view on the map
                    map.fitBounds(place.geometry.viewport);
                    map.setCenter(location);

                    marker.setPlace({
                        placeId: place.place_id,
                        location: location,
                    });

                }
            });
            this.setState({
                map: map
            });
    }

    handleChange = (evt) => {
        let value = evt.target.value;
        this.setState({
            address: value
        })
    }

    geocodeAddress() {
        var map = this.state.map;
        var address = this.state.address;
        // console.log(this.state);// not coming in
        var geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({'address': address}, function (results, status) {
                if (status === 'OK') {
                    map.setCenter(results[0].geometry.location);
                    var marker = new window.google.maps.Marker({
                        map: map,
                        draggable: true,
                        animation: window.google.maps.Animation.DROP,
                        position: results[0].geometry.location
                    });
                } else {
                    alert('Geocode was not successful for the following reason: ' + status); // invalid request
                }
            });
    }

    handleSubmit() {
        this.geocodeAddress();
    }

    render() {
        // var loc = this.state.place_location.split(',')[1];
        // var long = loc.substring(0, loc.length-1);
        // console.log(long);
        return (
            <div id='app'>
                <div id='search'>
                    <input className="address" id='pac-input' type="textbox"
                           onChange={evt => this.handleChange(evt)}/>


                    <button className="submit" onClick={this.handleSubmit}> pin + </button>
                </div>

                {/*<div>location: { this.state.address} </div>*/}
                <div>address: { this.state.place_formatted} </div>
                <div>lat: {this.state.place_location.split(',')[0].substring(1)}</div>
                <div>lng: {this.state.place_location.split(',')[1]}</div>
                <div id='map'></div>

            </div>
        );
    }
};
