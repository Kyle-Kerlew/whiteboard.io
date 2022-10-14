import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import {
  connect,
} from 'react-redux';
import ActiveUsers from './activeUsers';
import useNavbar from './useNavbar';

function DrawingNavbar () {
  const DrawingNavbarComponent = () => <Navbar.Text><ActiveUsers/></Navbar.Text>;
  return useNavbar(DrawingNavbarComponent, false);
}

const mapStateToProps = (state) => state.whiteboard.value;
export default connect(mapStateToProps)(React.memo(DrawingNavbar));
