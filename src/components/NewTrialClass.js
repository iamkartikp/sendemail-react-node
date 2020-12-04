import React, { Component } from "react";
import { NavigationBar } from "./common/Navbar";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import courseService from "../services/CourseService";
import slotsService from "../services/SlotsService";

import Joi from "joi-browser";
import axios from "axios";
import * as _ from "lodash";

class NewTrialClassComponent extends Component {
  state = {
    details: {
      parentName: "",
      parentNumber: "",
      parentEmail: "",
      childName: "",
      childAge: "",
      courseName: "",
      availableSlots: "",
    },
    errors: {},
    courses: [],
    posts: [],
  };

  componentDidMount() {
    axios.get('https://script.googleusercontent.com/macros/echo?user_content_key=IpjnrKIBRIcpADC_toSkj9YW8ZEUesup1yKq2mfC0VH34GBR3_LXXD8N7cLZxWBBZJvVZuafra3QoMwSTcdUCPzso3RNE2Spm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnC09Nb0QZ6ca_LU0vmo6mSiQ7SyFG3CgdL9-1Vgcha-TAYaAGhh-9xNG-9rMNEZHQRElvdDletx0&lib=MlJcTt87ug5f_XmzO-tnIbN3yFe7Nfhi6')
        .then(data => {
            this.setState({
          courses: data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  schema = {
    parentName: Joi.string()
      .required()
      .error(() => {
        return {
          message: "Parent's name can't be blank",
        };
      }),
    parentNumber: Joi.number()
      .min(6000000000)
      .max(9999999999)
      .required()
      .error(() => {
        return {
          message: "Phone number should be a 10 digit number",
        };
      }),
    parentEmail: Joi.string()
      .email()
      .required()
      .error(() => {
        return {
          message: "Email is invalid",
        };
      }),
    childName: Joi.string()
      .required()
      .error(() => {
        return {
          message: "Child name can't be blank",
        };
      }),
    childAge: Joi.number()
      .min(1)
      .max(24)
      .required()
      .error(() => {
        return {
          message: "Age is invalid. The valid range is between 1 to 24 years",
        };
      }),
    courseName: Joi.string()
      .required()
      .error(() => {
        return {
          message: "Select a Course",
        };
      }),
      availableSlots: Joi.string()
      .required()
      .error(() => {
        return {
          message: "Select a Slot",
        };
      }),
  };

  validate = () => {
    const result = Joi.validate(this.state.details, this.schema, {
      abortEarly: false,
    });

    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  setStartDate(date) {}

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({
      errors: errors || {},
    });
    if (errors) return;

    axios.post('/', this.state.details)
      .then(data => {
        alert('Successfully booked the trial class.')
      })
      .catch(err => {
        alert("Error Try Again!");
      })


    slotsService.saveSlots(this.state.details)
      .then((res) => {
        console.log(res);
        // alert('Successfully booked the trial class.');
      })
      .catch((err) => {
        // alert("Successfully booked the trial class.");
        console.log(err);
      });
    };

  handleChange = ({ currentTarget: input }) => {
    const details = { ...this.state.details };
    details[input.id] = input.value;
    this.setState({ details });

    if (details["courseName"]) {
      this.getAvailableSlots(details["courseName"]);
    }
  };

  getAvailableSlots = (courseName) => {
    var date = new Date();
    date.setHours(date.getHours() + 4);
    date.setMinutes(date.getMinutes());
    date.setSeconds(0);

    var sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    var selectedCourse = this.state.courses.find(
      (c) => c.course_name === courseName
    );

    var allSlots = selectedCourse.slots.map((s) => {
      return { ...s, slotDate: new Date(parseInt(s.slot)) };
    });

    var validSlots = allSlots.filter(
      (s) => s.slotDate > date && s.slotDate <= sevenDaysFromNow
    );

    var slotsByDate = _(validSlots)
      .groupBy((_) => _.slotDate.toLocaleDateString())
      .map((value, key) => ({ date: key, slots: value }))
      .value();

    this.setState({ availableSlots: slotsByDate });
  };

  render() {
    return (
      <>
        <NavigationBar />
        <Container className="main-container">
          <Row className="justify-content-md-center">
            <Col md="auto" className="form-container">
              <h4>Book a Trial Class</h4>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col md="auto" className="form-container">
              <Form onSubmit={this.handleSubmit}>
                <Form.Label>Parent's name</Form.Label>
                <Form.Group>
                  <Form.Control
                    type="text"
                    className="form-group"
                    placeholder="Parent Name"
                    id="parentName"
                    onChange={this.handleChange}
                  />
                  {this.state.errors.parentName && (
                    <div className="alert alert-danger">
                      {this.state.errors.parentName}
                    </div>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Parent's contact number</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-group"
                    placeholder="Phone number"
                    id="parentNumber"
                    onChange={this.handleChange}
                  />
                  {this.state.errors.parentNumber && (
                    <div className="alert alert-danger">
                      {this.state.errors.parentNumber}
                    </div>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Parent's Email</Form.Label>
                  <Form.Control
                    type="email"
                    className="form-group"
                    placeholder="Email address"
                    id="parentEmail"
                    onChange={this.handleChange}
                  />
                  {this.state.errors.parentEmail && (
                    <div className="alert alert-danger">
                      {this.state.errors.parentEmail}
                    </div>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Child's name</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-group"
                    placeholder="Name"
                    id="childName"
                    onChange={this.handleChange}
                  />
                  {this.state.errors.childName && (
                    <div className="alert alert-danger">
                      {this.state.errors.childName}
                    </div>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Child's age</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-group"
                    placeholder="Child's Age "
                    id="childAge"
                    onChange={this.handleChange}
                  />
                  {this.state.errors.childAge && (
                    <div className="alert alert-danger">
                      {this.state.errors.childAge}
                    </div>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Available Courses</Form.Label>
                  {this.state.courses.map((c) => (
                    <div key={c.course_id} className="mb-3">
                      <Form.Check
                        type="radio"
                        id="courseName"
                        name="courseName"
                        label={c.course_name}
                        value={c.course_name}
                        onChange={this.handleChange}
                      />
                    </div>
                  ))}
                  {this.state.errors.courseName && (
                    <div className="alert alert-danger">
                      {this.state.errors.courseName}
                    </div>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Available Slots</Form.Label>
                  {this.state.availableSlots &&
                    this.state.availableSlots.map((c) => (
                      <ul >
                        <li>
                          <strong>{c.date}</strong>
                          <hr />
                          {c.slots.map((s) => (
                            <div key={s.slot} className="mb-3">
                              <Form.Check
                                type="radio"
                                id="availableSlots"
                                name="availableSlots"
                                label={s.slotDate.toLocaleTimeString()}
                                value={s.slot}
                                onChange={this.handleChange}
                              />
                            </div>
                          ))}
                        </li>
                      </ul>
                    ))}
                    {this.state.errors.availableSlots && (
                    <div className="alert alert-danger">
                      {this.state.errors.availableSlots}
                    </div>
                  )}
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default NewTrialClassComponent;
