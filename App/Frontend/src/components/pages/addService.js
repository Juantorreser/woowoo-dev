import {Formik, Form, Field, ErrorMessage} from 'formik';
import axios from 'axios';
// using some aspects of account.css for consistency with account.js form styling
import '../account/account.css';
import './addService.css';


const renderError = (message) => <p className="warning">{message}</p>;

const AddService = () => {


    return(
        <>
            <div className="userProfile">
                <div className="userContainer">
                    <Formik
                    initialValues={{
                        service: "",
                        description: ""
                    }}
                    onSubmit={(values, actions) => {
                        actions.setSubmitting(true);
                        // console.log(values);
                        (async () => {
                            // submit to DB
                            axios.post('http://localhost:8080/services', values);
                            window.location.assign('/');
                            actions.setSubmitting(false);
                        })();
                    }}
                    >
                    {({handleSubmit, values}) => (
                        <Form
                            className="accountInfoEditorForm"
                            onSubmit={handleSubmit}
                        >
                            <div className="accountInfoEditorContainerContainer">
                                <p>Service Name:</p>
                                <Field
                                    type="text"
                                    id="service"
                                    name="service"
                                    label="Service Name"
                                    autoComplete="sName"
                                    required
                                />
                                <ErrorMessage name="service" render={renderError} />
                                <div className="nonTextSignupForm">
                                    <p>Service Description:</p>
                                    <Field
                                        name="description"
                                        as="textarea"
                                        id="serviceDescription"
                                        required
                                    />
                                    <ErrorMessage name="description" render={renderError} />
                                </div>
                                <button type='submit' className="btn--login">Save</button>
                            </div>
                        </Form>
                    )}
                    </Formik>
                </div>
            </div>
        </>
    )
}

export default AddService;