import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import './mapForm.scss';

export const MapForm = ({ onSubmit, onClose, selected, setSelected }) => {
    
    const validationSchema = yup.object().shape({
        trainingTime: yup.date()
            .min(new Date(), 'Die Zeit kann nicht in der Vergangenheit liegen')
            .required('Pflichtfeld'),
        activityType: yup
            .string()
            .matches(/^[^\d]+$/, 'Der Name kann nicht nur aus Zahlen bestehen')
            .min(3, 'Der Name muss zwischen 3 und 20 Zeichen lang sein')
            .max(20, 'Der Name muss zwischen 3 und 20 Zeichen lang sein')
            .required('Pflichtfeld'),
        description: yup
            .string()
            .max(235, 'Beschreibung kann maximal 235 Zeichen lang sein'),
        maxPeople: yup
            .number()
            .min(1, 'Personenzahl muss zwischen 1 und 99 liegen')
            .max(99, 'Personenzahl muss zwischen 1 und 99 liegen')
            .required('Pflichtfeld')
    });

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

    const closeForm = () => {
        if(selected){
            setSelected(null); 
        } else {
            onClose(); 
        }
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched }) => (
                <Form className={`map-form ${selected ? '' : 'new-training-form'}`}>
                    <button type="button" className="close-button" onClick={closeForm}>&times;</button>

                    <Field id="activityType" name="activityType" placeholder="Activity" />
                    {touched.activityType && errors.activityType ? <div className="error-message">{errors.activityType}</div> : null}

                    <div className="form-date">
                        <label htmlFor="trainingTime">Date :</label>
                        <Field id="trainingTime" name="trainingTime" type="datetime-local" />
                    </div>
                    {touched.trainingTime && errors.trainingTime ? <div className="error-message">{errors.trainingTime}</div> : null}

                    <div className="form-people">
                        <label htmlFor="maxPeople">Number of participants : </label>
                        <Field id="maxPeople" name="maxPeople" type="number" />
                    </div>
                    {touched.maxPeople && errors.maxPeople ? <div className="error-message">{errors.maxPeople}</div> : null}

                    <Field as="textarea" id="description" name="description" placeholder="Description" />
                    {touched.description && errors.description ? <div className="error-message">{errors.description}</div> : null}

                    <button className='addTrainingBtn' type="submit">{buttonText}</button>
                </Form>
            )}
        </Formik>
    );
};
