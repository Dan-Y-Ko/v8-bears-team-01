import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUser } from "../../actions/auth";
import { get_user_projects, delete_project } from "../../actions/project";
// import { get_auth_token } from "../../actions/auth"

import RecentMessages from "./RecentMessages";
import YourProjects from "./YourProjects";

class Dashboard extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.get_user_projects();
    }

    onDeleteClick = (id, imageUrl) => {
        this.props.delete_project(id, imageUrl);
    };

    render() {
        const { projects } = this.props;
        return (
            <div className="projects-list-container container">
                <h3 className="content-header text-center display-4 mt-4">
                    Dashboard
                </h3>
                {/* <RecentMessages /> */}
                <div className="projects-list-container container">
                    <h4 className="content-header" style={{ margin: "2rem 0" }}>
                        Your Projects
                    </h4>

                    <Link to="/newproject">
                        <button
                            className="btn btn-teal"
                            style={{ margin: "0 0 2rem 0" }}
                        >
                            Create project
                        </button>
                    </Link>
                </div>
                {projects && (
                    <div className="d-flex flex-row">
                        <YourProjects
                            project={projects}
                            handleDeleteClick={this.onDeleteClick}
                        />
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.auth.user,
        projects: state.project.user_projects
    };
}

export default connect(
    mapStateToProps,
    { fetchUser, get_user_projects, delete_project }
)(Dashboard);
