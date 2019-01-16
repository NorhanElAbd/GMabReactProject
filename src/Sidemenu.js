import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Sidemenu extends Component {

    state = { visible: false }

    handleClick = () => { this.setState(prev => ({ visible: !prev.visible })) }

    render() {
        const visible = this.state.visible
        return (

            <div>
                <button aria-label="menu button" id="arrowMenu" className={visible ? 'leftBtn' : ''} onClick={this.handleClick}>
                    <FontAwesomeIcon icon="bars" />
                </button>
                <div aria-label="Menu body" id="menuPart" className={visible ? "hideMenu" : ''} tabIndex={visible ? '-1' : '0'}>
                    <select tabIndex={visible ? '-1' : '0'} aria-label="filter resturant" onChange={(e) => {
                    this.props.filtermarker(e.target.childNodes[e.target.selectedIndex].getAttribute('id'))
                    this.props.clickListItem(e.target.childNodes[e.target.selectedIndex].getAttribute('id'))
                }
                }
                        defaultValue='all'>
                        <option id="all">All</option>
                    {this.props.markerName.map((myinfo) => (
                        <option key={myinfo.id} id={myinfo.id}>{myinfo.name}</option>
                    ))
                    }
                </select>

                    <ol className="listItems" aria-label="list of resturants" tabIndex={visible ? '-1' : '0'}>
                    {this.props.selectedMark === "all" ?
                            this.props.markerName.map((select) => (
                                <li key={select.id} id={select.id} tabIndex={visible ? '-1' : '0'} role="button" onClick={() => this.props.clickListItem(select.id)} onKeyPress={() => this.props.clickListItem(select.id)}> {select.name} </li>
                        )) : this.props.markerName.filter(select => select.id === this.props.selectedMark).map((select) => (
                                <li key={select.id} id={select.id} tabIndex={visible ? '-1' : '0'} role="button" onKeyPress={() => this.props.clickListItem(select.id)}> {select.name} </li>
                        ))
                    }

                    </ol>
                </div>
            </div>
        )
    }
}

export default Sidemenu