import { Formik, Form, Field } from 'formik';
import './mapForm.scss';

export const MapForm = ({ onSubmit, onClose, selected, setSelected }) => {
    const initialValues = selected
        ? {
            trainingTime: selected.trainingTime.toDate().toISOString().slice(0, 16),
            activityType: selected.activityType,
            maxPeople: selected.maxPeople,
            description: selected.description
        }
        : {
            trainingTime: '',
            activityType: '',
            maxPeople: '',
            description: ''
        };

    const handleSubmit = (values) => {
        if (selected) {
            onSubmit(values, selected.id);
            setSelected(null); 
        } else {
            onSubmit(values);
        }
    };

    const buttonText = selected ? 'Update training' : 'Add training';

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form className={`map-form ${selected ? '' : 'new-training-form'}`}>
                <button type="button" className="close-button" onClick={onClose}>&times;</button>
                <Field id="activityType" name="activityType" placeholder="Activity" />
                <Field id="trainingTime" name="trainingTime" type="datetime-local" />
                <Field id="maxPeople" name="maxPeople" type="number" placeholder="Max number of people" />
                <Field as="textarea" id="description" name="description" placeholder="Description" />
                <button className='addTrainingBtn' type="submit">{buttonText}</button>
            </Form>
        </Formik>
    );
};
