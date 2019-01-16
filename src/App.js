import React, { Component } from 'react'
import * as mapScript from './mapScript'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Sidemenu from './Sidemenu'
import './App.css'

library.add(faBars)

class App extends Component {

    state = {
        info: [],
        markersArray: [],
        map: {},
        selectedLoc:'all',
        isLoading: false,
        error: null,
        infowindow: {},
        getContent:[]
    }

    componentDidMount() {
        this.fetchFourcast()
        //   mapScript.loadScripts()
        window.initMap = this.initMap

    }

    initMap = () => {

        var myInfo = this.state.info
        var createdMarker = []
        var windowInfos = []
        var name
        var address

        var map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: { lat: 30.044420, lng: 31.235712 }
        })

        var infowindow = new window.google.maps.InfoWindow()

        createdMarker = myInfo.map(infoo => {
            var marker = new window.google.maps.Marker({
                position: { lat: infoo.location.lat, lng: infoo.location.lng },
                map: map,
               
                animation: window.google.maps.Animation.DROP
            })
            marker.set("id", infoo.id)
            createdMarker.push(marker)

            name = infoo.name ? infoo.name : "(no name registered)"
            address = infoo.location.address ? infoo.location.address : "(no address registered)"

            if (myInfo.length > 0) {
                var drawContent = `<div id='infoCont' tabIndex="0"><h3 tabIndex="0"> Restaurant name is  ${name}</h3><p tabIndex="0">address ${address}</p></div>` 
            }

            windowInfos.push(drawContent)

            var content = drawContent

            marker.addListener('click', function () {
                infowindow.setContent(content)
                infowindow.open(map, marker)

            })

            window.google.maps.event.addListener(infowindow, 'domready', function () {
                document.getElementById('infoCont').focus();
            });

            return this.setState({ markersArray: createdMarker, map: map, infowindow: infowindow, getContent: windowInfos})

        })
    }

    

    fetchFourcast = () => {
        const LocApi = `https://api.foursquare.com/v2/venues/search?near=cairo&query=food&limit=8&client_id=UBD5BSN3IY1SKQJYSVIJRP1TSPVV3XJ3KXGTCXOG2X3FAUZG&client_secret=A4WWVLNL0S3XTY0A4ODDWH001PA2G5V4CTCHPPE040XNJOL2&v=20180803&fbclid=IwAR11IokA3Az5BvcjEtz_cYDIvpFtmowEZz71S-ronqYODlhMwDzSc7XH9Ic`
        this.setState({ isLoading: true });
        fetch(LocApi)
            .then(response => {
                if (response.ok) {
                    return response.json()

                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                this.setState({ info: data.response.venues, isLoading: false }, () => {
                    mapScript.loadScripts()
                })
            })
            .catch(error => this.setState({ error, isLoading: false }))
    }


    filterMap = (selectedMarkerID) => {
        this.state.markersArray.forEach(mark => {
            if (selectedMarkerID === 'all') {
                mark.setMap(this.state.map)
                this.setState({ selectedLoc: "all" })
                this.state.infowindow.close(this.state.map, mark)
            }else if (mark.id !== selectedMarkerID) {
                mark.setMap(null)
            } else 
                mark.setMap(this.state.map)
               this.setState({ selectedLoc: selectedMarkerID })
        }

        )
    }

    onListClick = (itemID) => {
        this.state.markersArray.forEach((mark, index) => {
            if (mark.id === itemID) {
                mark.setAnimation(window.google.maps.Animation.BOUNCE)
                this.state.infowindow.setContent(this.state.getContent[index])
                this.state.infowindow.open(this.state.map, mark)
            } else mark.setAnimation(null)
        })
    }

    render() {
        if (this.state.isLoading) {
            return <p>Loading ...</p>;
        }

        if (this.state.error) {
            return <p>{this.state.error.message}</p>;
        }
        return (
            <section>
                <div id="map" aria-label="Map of Cairo restaurants" tabIndex="0"></div>
                <Sidemenu
                    markerName={this.state.info}
                    filtermarker={this.filterMap}
                    selectedMark={this.state.selectedLoc}
                    clickListItem={this.onListClick}
                />
            </section>
        )
    }
}

export default App;

//Client ID
//UBD5BSN3IY1SKQJYSVIJRP1TSPVV3XJ3KXGTCXOG2X3FAUZG
//Client Secret
//A4WWVLNL0S3XTY0A4ODDWH001PA2G5V4CTCHPPE040XNJOL2