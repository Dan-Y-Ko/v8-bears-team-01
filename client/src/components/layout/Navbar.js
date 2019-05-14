import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';
import axios from 'axios';

import {fetchUser} from '../../actions/auth';

import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

import Inbox from './Inbox';

import {handleValidation} from '../../helpers/handleValidation';

export class Navbar extends Component {
  state = {
    registerIsActive: false,
    loginIsActive: false,
    email: '',
    password: '',
    comfirmPassword: '',
    name: '',
    errorMsg: '',
    isLoading: false,
    dashboard: true,
    profile: false,
    home: false,
    currentInput: 'dashboard',
    login: false
  };

  componentDidMount() {
    if (window.performance) {
      console.info("window.performance works fine on this browser");
    }
      if (performance.navigation.type == 1 && this.state.login) {
        //console.info( "This page is reloaded" );
        let str = this.props.history.location.pathname;
        let arr =  str.split('/')
        let name = arr[arr.length-1]
        if(name=='about') name='profile'
        if(name=='/') name='home'
        if(str==="/") name="home"
   
        this.updateSelected(name)
      } else {
       // console.info( "This page is not reloaded");
      }

  }

  handleRegisterToggle = () => {
    this.clearFields();
    this.setState(() => ({
      registerIsActive: !this.state.registerIsActive,
    }));
  };
  handleLoginToggle = () => {
    this.clearFields();
    this.setState(() => ({loginIsActive: !this.state.loginIsActive}));
  };
  handleRequestClose = () => {
    this.clearFields();
    this.setState(() => ({
      registerIsActive: false,
      loginIsActive: false,
    }));
  };

  updateSelected = (name) => {
    let currentInput = this.state.currentInput;
    this.setState((prevState) => ({
      [currentInput]: !prevState[currentInput],
    }));

    this.setState((prevState) => ({
      [name]: !prevState[name],
      currentInput: name,
    }));
  };

  updateField = (name, val) => {
    this.setState({[name]: val});
  };

  handleLogin = () => {
    const {name, email, password, comfirmPassword} = this.state;
    const {errorMsg, response} = handleValidation(
      name,
      email,
      password,
      comfirmPassword,
      'login',
    );
    if (response === false) {
      this.setState({errorMsg});
      return;
    }
    this.setState({isLoading: true});

    let obj = {
      email: email.trim(),
      password: password.trim(),
    };

    axios
      .post(`/auth/login`, obj)
      .then((resp) => {
        //   console.log(resp.data);
        this.setState({isLoading: false});
        this.clearFields();
        this.setState({errMessage: '', loginIsActive: false});
        localStorage.setItem('authToken', resp.data.token);
        this.props.fetchUser().then((resp) => {
          this.setState({login: true})
          this.props.history.push('/dashboard');
        });
        // window.location.assign("/");
      })
      .catch((err) => {
        err.response && this.setState({errorMsg: err.response.data.errMessage});
      });
  };

  handleSignup = () => {
    const {name, email, password, comfirmPassword} = this.state;
    const {errorMsg, response} = handleValidation(
      name,
      email,
      password,
      comfirmPassword,
      'signup',
    );
    if (response === false) {
      this.setState({errorMsg});
      return;
    }
    this.setState({isLoading: true});

    let obj = {
      email: email.trim(),
      password: password.trim(),
      name: name.trim(),
    };

    axios
      .post(`/auth/signup`, obj)
      .then((resp) => {
        this.setState({isLoading: false});
        //console.log(resp.data);
        this.clearFields();
        this.setState({errMessage: '', registerIsActive: false});
        localStorage.setItem('authToken', resp.data.token);
        this.props.fetchUser().then((resp) => {
          this.props.history.push('/dashboard');
        });
      })
      .catch((err) => {
        err.response && this.setState({errorMsg: err.response.data.errMessage});
      });
  };

  handleLogout = () => {
    //send token object while logging out
    axios
    .get('/api/logout', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      .then((resp) => {
        this.setState({login: false})
        localStorage.removeItem('authToken');
        this.props.history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
      this.setState({home: false,dashboard: true,profile: false, currentInput: 'dashboard'})
  };
  clearFields = () => {
    this.setState({
      email: '',
      password: '',
      name: '',
      errorMsg: '',
      comfirmPassword: '',
      isLoading: false,
    });
  };

  renderInbox() {
    if (localStorage.getItem('authToken')) {
      return (
        <div>
          <div className="row inbox">
            <div className="col">
              <div className="collapse multi-collapse" id="multiCollapse">
                <Inbox />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  renderContent() {
    if (localStorage.getItem('authToken')) {
      return (
        <div className="navbar-items">
          {' '}
          <button
            className="mr-3 btn"
            data-toggle="collapse"
            href="#multiCollapse"
            role="button"
            aria-expanded="false"
            aria-controls="multiCollapse">
            <i className="text-light fas fa-envelope" />
          </button>
          <Link
            className={
              this.state.dashboard
                ? 'active mr-4 text-light'
                : 'mr-4 text-light'
            }
            onClick={() => this.updateSelected('dashboard')}
            style={{cursor: 'pointer'}}
            to="/dashboard">
            Dashboard
          </Link>
          <Link
            className={
              this.state.profile ? 'active mr-4 text-light' : 'mr-4 text-light'
            }
            style={{cursor: 'pointer'}}
            to="/profile/uu/about"
            onClick={() => this.updateSelected('profile')}>
            My Profile
          </Link>
          <a
            onClick={this.handleLogout}
            className="text-light"
            style={{cursor: 'pointer'}}>
            Logout
          </a>
        </div>
      );
    } else {
      return (
        <div>
          <button
            onClick={this.handleLoginToggle}
            className="btn btn-outline-light mr-2">
            Log In
          </button>
          <button
            onClick={this.handleRegisterToggle}
            className="btn btn-danger">
            Sign Up
          </button>
        </div>
      );
    }
  }
  render() {
    return (
      <div>
        <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4  bg-dark ">
          <h5 className="my-0 mr-md-auto font-weight-normal">
            <Link
              className={ localStorage.getItem('authToken')&&this.state.home ? 'login-logo' : 'text-light'}
              onClick={() => this.updateSelected('home')}
              to="/"
              style={{textDecoration: 'none'}}>
              CodeCollab
            </Link>
          </h5>
          <div className="search-container d-xs-none d-sm-none d-md-block">
            <form action="/search" method="get">
              <input
                className="search expandright d-xs-none d-sm-none d-md-block"
                id="searchright"
                type="search"
                name="q"
                placeholder="Search"
              />
              <label className="button searchbutton" htmlFor="searchright">
                <span className="mglass">&#9906;</span>
              </label>
            </form>
          </div>
          {this.renderInbox()}
          <nav className="my-2 my-md-0 mr-md-3">{this.renderContent()}</nav>
        </div>
        <RegisterModal
          email={this.state.email}
          name={this.state.name}
          password={this.state.password}
          confirmPassword={this.state.comfirmPassword}
          isOpen={this.state.registerIsActive}
          handleRequestClose={this.handleRequestClose}
          handleSignup={this.handleSignup}
          errorMsg={this.state.errorMsg}
          isLoading={this.state.isLoading}
          updateField={this.updateField}
        />
        <LoginModal
          email={this.state.email}
          name={this.state.name}
          password={this.state.password}
          isOpen={this.state.loginIsActive}
          handleRequestClose={this.handleRequestClose}
          handleLogin={this.handleLogin}
          errorMsg={this.state.errorMsg}
          isLoading={this.state.isLoading}
          updateField={this.updateField}
        />
      </div>
    );
  }
}

export default withRouter(
  connect(
    null,
    {fetchUser},
  )(Navbar),
);
