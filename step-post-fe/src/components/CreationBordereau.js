import React, { Component } from 'react';

class CreationBordereau extends Component {
    constructor(props) {
        super(props);
    this.state = {  }
    }
    render() { 
        return (
            <>
                <h2>Creation Bordereau pour {this.props.id} !</h2>
            </>
        );
    }
}
export default CreationBordereau;
 