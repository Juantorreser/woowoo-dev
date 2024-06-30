import {Formik, Form, Field, ErrorMessage} from 'formik';
import axios from 'axios';


const renderError = (message) => <p className="warning">{message}</p>;

const AddService = () => {


    return(
        <>
            <Formik
            initialValues={{
                name: "",
                description: ""
            }}
            onSubmit={(values, actions) => {
                actions.setSubmitting(true);
                console.log(values);
                (async () => {
                    // submit to DB
                    axios.post('http://localhost:8080/services', values)
                    .then((response)=>{
                        if(response.data){
                            console.log(response.data);
                        }
                        actions.setSubmitting(false);
                    })
                    .then(() => {
                        // window.location.assign('/');
                    });
                    actions.setSubmitting(false);
                })();
            }}
            >
			{({handleSubmit, values}) => (
                <Form
                    className="addServiceForm"
                    onSubmit={handleSubmit}
                >
                    <div className="addServiceContainer">
                        <p>Service Name:</p>
                        <Field
                            type="text"
                            id="name"
                            name="name"
                            label="Service Name"
                            autoComplete="sName"
                            required
                        />
                        <ErrorMessage name="name" render={renderError} />

                        <p>Service Description:</p>
                        <Field
                            name="description"
                            as="textarea"
                            id="serviceDescription"
                            required
                        />
                        <ErrorMessage name="description" render={renderError} />
                        
                        <button type='submit' className="btn--login">Save</button>
                    </div>
                </Form>
            )}
            </Formik>
        </>
    )
}

export default AddService;