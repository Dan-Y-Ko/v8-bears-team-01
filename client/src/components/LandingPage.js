import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProjects } from "../actions/project";

const Project = props => {
        let bucket_url;
    if (process.env.NODE_ENV === "production") {
        bucket_url = `https://s3.us-east-2.amazonaws.com/code-collab-prod`;
    } else {
        bucket_url = `https://s3.us-east-2.amazonaws.com/code-collab-image`;
    }

   return (<div className="col-sm-12 col-md-6 col-lg-3 pb-3" key={props.project._id}>
        <div className="card text-white bg-secondary m-0 mb-4">
            <Link
                to={`/${props.project.ownerName}/project/${props.project._id}`}
            >
                {" "}
                <img
                    className="card-img-top project-card"
                    src={props.project.imageUrl?`${bucket_url}/${props.project.imageUrl}`:"https://via.placeholder.com/100"}
                    alt=""
                />{" "}
            </Link>
            <div className="card-body">
                <h5 className="card-title">{props.project.projectName}</h5>
                <div className="card-text">
                  <div className="overlay"></div>
                  {props.project.description}
                </div>
            </div>
        </div>
    </div>)
}

export class LandingPage extends Component {
    state = {
        projects: [],
        pagProjects: [],
        isLoading: false,
        currentPage: 1,
        projectPerPage: 8
    };

    componentDidMount() {
        this.props.getProjects();

        this.setState({ isLoading: true });
        axios
            .get("/api/projects/")
            .then(resp => {
                const pagProjects = this.getPaginatedProjects(1, resp.data);
                // console.log(resp.data);
                this.setState({
                    projects: resp.data,
                    isLoading: false,
                    pagProjects
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    paginationNumbers = numArr => {
        return numArr.map(num => {
            return (
                <li
                    key={num}
                    style={{
                        marginRight: "8px",
                        padding: "0",
                        listStyle: "none",
                        cursor: "pointer"
                    }}
                    id={num}
                    onClick={() => {
                        this.setCurrentPage(num);
                    }}
                >
                    {num}
                </li>
            );
        });
    };

    setCurrentPage = number => {
        const projects = this.getPaginatedProjects(number);
        this.setState({
            currentPage: Number(number),
            pagProjects: projects
        });
    };

    getPaginatedProjects = (
        current = this.state.currentPage,
        projects = this.state.projects
    ) => {
        const endIndex = current * this.state.projectPerPage;
        const startIndex = endIndex - this.state.projectPerPage;
        const paginatedProjects = projects.slice(startIndex, endIndex);
        return paginatedProjects;
    };

    render() {
        
        const pages = Math.ceil(
            this.state.projects.length / this.state.projectPerPage
        );
        const numbersArr = [];
        for (let i = 1; i <= pages; i++) {
            numbersArr.push(i);
        }
        return (
            <div className="projects-list-container container">
                <div className="jumbotron tagline">
                    <h1 className="display-4">
                        Code Collab is a collaborative environment for creators
                        and talents
                    </h1>
                    <p className="lead">
                        Develop your own existing projects anywhere you go and
                        find emerging talents along your journey.
                    </p>
                </div>
                <h3 className="pb-5 pt-5 content-header">
                    Latest Projects{" "}
                    {this.state.isLoading && (
                        <div
                            className="spinner-border spinner-border-sm"
                            style={{ width: "2rem", height: "2rem" }}
                            role="status"
                        >
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}
                </h3>
                <div className="card-deck">
                    {this.state.pagProjects.map((currentProject, i) => {
                        return <Project project={currentProject} key={i} />;
                    })}
                </div>

                <div>
                    <ul
                        style={{
                            marginBottom: "1rem",
                            padding: "0",
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        {this.paginationNumbers(numbersArr)}
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return { projects: state.project.projects };
};

export default connect(
    mapStateToProps,
    { getProjects }
)(LandingPage);
