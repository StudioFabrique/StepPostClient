import React, { Component } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
    document.title = "Step Post";
  }

  // handshake si pas bon, return Route Login sinon tu return ta page
  // isLogged // isLoading
   

  render() { 
    return (
      <>
        <Header />
        <Footer />
      </>
    );
  }
}
 
export default App;