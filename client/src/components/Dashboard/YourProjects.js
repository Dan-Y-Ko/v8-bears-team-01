import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { delete_project } from "../../actions/project";

class YourProjects extends Component {
    render() {
        return (
            <>
                <div className="projects-list-container container">
                    <h4
                        className="content-header"
                        style={{ marginTop: "50px" }}
                    >
                        Your Projects
                    </h4>

                    <Link to="/newproject">
                        <button className="btn btn-teal">Create project</button>
                    </Link>
                </div>
                {this.props.project.map((project, key) => {
                    return (
                        <div
                            className="col-sm-12 col-md-6 col-lg-3 pb-3"
                            key={project._id}
                        >
                            <div className="card text-white bg-secondary m-0 mb-4">
                                <Link
                                    to={`/${
                                        this.props.project.ownerName
                                    }/project/${this.props.project._id}`}
                                >
                                    {" "}
                                    <img
                                        className="card-img-top"
                                        src="https://via.placeholder.com/100"
                                        alt="Card image cap"
                                    />{" "}
                                </Link>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {project.projectName}
                                    </h5>
                                    <p className="card-text">
                                        {project.description}
                                    </p>
                                    <div className="float-right">
                                        <a href="#" className="btn btn-primary">
                                            <i className="fas fa-pen" />
                                        </a>
                                        {"  "}
                                        <button
                                            className="btn btn-danger"
                                            onClick={id =>
                                                this.props.delete_project(id)
                                            }
                                        >
                                            <i className="fas fa-trash" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.auth.user
    };
}

export default connect(
    mapStateToProps,
    { delete_project }
)(YourProjects);
