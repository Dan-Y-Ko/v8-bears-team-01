import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { delete_project } from "../../actions/project";

const YourProjects = ({ project, handleDeleteClick }) => {
    let bucket_url;

    if (process.env.NODE_ENV === "production") {
        bucket_url = `https://s3.us-east-2.amazonaws.com/code-collab-prod`;
    } else {
        bucket_url = `https://s3.us-east-2.amazonaws.com/code-collab-image`;
    }
    return (
        <>
            {project.map((project, key) => {
                return (
                    <div
                        className="col-sm-12 col-md-6 col-lg-3 pb-3"
                        key={project._id}
                    >
                        <div
                            className="card text-white bg-secondary m-0 mb-4"
                            style={{ minHeight: "420px" }}
                        >
                            <Link
                                to={`/${project.ownerName}/project/${
                                    project._id
                                }`}
                            >
                                {" "}
                                {project.imageUrl ? (
                                    <img
                                        className="card-img-top project-card"
                                        src={`${bucket_url}/${
                                            project.imageUrl
                                        }`}
                                        alt=""
                                        crossOrigin="anonymous"
                                        style={{ minHeight: "245px" }}
                                    />
                                ) : (
                                    <img
                                        className="card-img-top"
                                        src="https://via.placeholder.com/100"
                                        alt=""
                                    />
                                )}{" "}
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">
                                    {project.projectName}
                                </h5>
                                <p className="card-text">
                                   
                                    {project.description}
                                </p>
                                <div className="d-flex flex-row justify-content-start">
                                    <Link
                                        className="btn btn-primary"
                                        to={`/${project.ownerName}/project/${
                                            project._id
                                        }/editproject`}
                                    >
                                        <i className="fas fa-pen" />
                                    </Link>
                                    {"  "}
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleDeleteClick.bind(
                                            this,
                                            project._id,
                                            project.imageUrl
                                        )}
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
};

/* function mapStateToProps(state) {
    return {
        user: state.auth.user
    };
} */

export default connect(
    null,
    { delete_project }
)(YourProjects);
