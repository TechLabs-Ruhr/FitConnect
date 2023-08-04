import { Formik, Form, Field } from 'formik';
import './mapForm.scss';

export const MapForm = ({ onSubmit, onClose }) => {
    return (
        <Formik
            initialValues={{
                time: '',
                activityType: '',
                maxPeople: '',
                description: ''
            }}
            onSubmit={(values) => {
                onSubmit(values);
            }}
        >
            <Form className="map-form">
                <button type="button" className="close-button" onClick={onClose}>&times;</button>

                <Field id="time" name="time" type="datetime-local" />

                <Field id="activityType" name="activityType" placeholder="Activity" />

                <Field id="maxPeople" name="maxPeople" type="number" placeholder="Max number of people" />
                
                <Field as="textarea" id="description" name="description" placeholder="Description" />

                <button className='addTrainingBtn' type="submit">Add training</button>
            </Form>
        </Formik>
    );
};
