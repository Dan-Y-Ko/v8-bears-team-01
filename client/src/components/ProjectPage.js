import React, { Component } from "react";
import { connect } from "react-redux";
import { getProject, delete_project } from "../actions/project";
import { fetchUser } from '../actions/auth'
import ContactModal from "./layout/ContactModal";

class ProjectPage extends Component {
    constructor() {
        super();
        this.state = {
            success: false,
            project: {},
            messageBody: "",
            contactModalIsActive: false,
            status: "",
            role: "developer",
            loading: false
        };
    }

    handleUpdateMessageBody = e => {
        if (e && e.target && e.target.value) {
            const messageBody = e.target.value;
            this.setState(() => ({ messageBody: messageBody }));
        }
    };

    handleUpdateRoles = e => {
        const projectRoles = [];
        // TODO: Get project roles from e.target.value.
        this.setState(() => ({
            projectRoles: projectRoles
        }));
    };
    handleSubmitApplication = () => {
        const { project } = this.props;
        const data = {
            recipientId: project.user,
            projectId: project._id,
            role: this.state.role,
            messageBody: this.state.messageBody
        };
        if (this.state.messageBody.length >= 5) {
            fetch("/api/messages/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
                credentials: "include" // include session cookie
            })
                .then(res => res.json())
                .then(alert("message sent"))
                .catch(e => console.error("message error", e));
        } else {
            this.setState({
                status: "Your message must be at least 5 characters long."
            });
        }
    };
    handleModalToggle = () => {
        this.setState(() => ({
            contactModalIsActive: !this.state.contactModalIsActive
        }));
    };

    handleRequestClose = () => {
        this.setState(() => ({
            contactModalIsActive: false
        }));
    };

    componentDidMount() {
        this.setState({loading: true})
        window.scrollTo(0, 0);
        var that = this;
        this.props.getProject(this.props.match.params.id, function(data) {
            that.setState({ project: data });
        });
        this.props.fetchUser()
                  .then(()=>{
                      setTimeout( this.setState({loading: false}), 2000)
                   
                  })
    }
    render() {
        const { project } = this.props;
        let bucket_url;
        if (process.env.NODE_ENV === "production") {
            bucket_url = `https://s3.us-east-2.amazonaws.com/code-collab-prod`;
        } else {
            bucket_url = `https://s3.us-east-2.amazonaws.com/code-collab-image`;
        }
        return (
            <div>{ this.state.loading ? <p>loading...</p>:
                (<div className="py-5 text-white">
                    <div className="mx-auto col-md-10">
                        {!!this.state.success && this.displaySuccessMesage()}
                        <div className="project-container row">
                            <div className="col-sm-8 col-md-8 col-lg-8">
                                <img
                                    className="project-page-img"
                                    src={ !this.state.loading
                                      ? project.imageUrl?`${bucket_url}/${project.imageUrl}`:"https://via.placeholder.com/100"
                                      : "https://i.imgur.com/nZ22mf9.jpg"
                                    }
                                />
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-4">
                                <h1 className="text-light">
                                    { !this.state.loading
                                        ? project.projectName
                                        : ""}
                                </h1>
                                <p className="mb-4 lead text-light">
                                   <b>Created by:</b>{" "}
                                    {!this.state.loading
                                        ? project.ownerName
                                        : ""}
                                </p>

                                <p className="mb-4 lead text-light">
                                    <b>Description:</b>{" "}
                                    { !this.state.loading
                                        ? project.description
                                        : ""}
                                </p>

                               { this.props.user.name && (<button
                                    onClick={this.handleModalToggle}
                                    className="btn btn-teal btn-block"
                                >
                                    Apply to Project
                                </button>)}
                            </div>
                        </div>
                    </div>
                </div>)}
                <ContactModal
                    isOpen={this.state.contactModalIsActive}
                    handleRequestClose={this.handleRequestClose}
                    handleSubmitApplication={this.handleSubmitApplication}
                    handleUpdateMessageBody={this.handleUpdateMessageBody}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { project: state.project.project, user: state.auth };
}

export default connect(
    mapStateToProps,
    { getProject,fetchUser }
)(ProjectPage);
