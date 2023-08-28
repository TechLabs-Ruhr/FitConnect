import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import './mapForm.scss';
import { trainings } from '../../../utils/trainings';
import Select from 'react-select';
import { capitalizeFirstLetter } from '../../../utils/utils';

export const MapForm = ({ onSubmit, onClose, selected, setSelected }) => {
    const activityOptions = trainings.map(t => ({ label: capitalizeFirstLetter(t.activityType), value: t.activityType })).sort((a, b) => a.label.localeCompare(b.label));

    const validationSchema = yup.object().shape({
        trainingTime: yup.date()
            .min(new Date(), 'The time cannot be in the past')
            .required('Required field'),
        activityType: yup
            .string()
            .oneOf(trainings.map(t => t.activityType), 'Invalid activity type')
            .required('Required field'),
        description: yup
            .string()
            .max(235, 'Description can be a maximum of 235 characters long'),
        maxPeople: yup
            .number()
            .min(1, 'Number of people must be between 1 and 99')
            .max(99, 'Number of people must be between 1 and 99')
            .required('Required field')
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
        if (selected) {
            setSelected(null);
        } else {
            onClose();
        }
    }

    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected ? 'white' : provided.color,
          backgroundColor: state.isFocused ? 'orange' : provided.backgroundColor,
        })
      };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ setFieldValue, errors, touched, values }) => (
                <Form className={`map-form ${selected ? '' : 'new-training-form'}`}>
                    <button type="button" className="close-button" onClick={closeForm}>&times;</button>

                    <div className="form-activity">
                        <label htmlFor="activityType">Training :</label>
                        <Select
                            id="activityType"
                            name="activityType"
                            options={activityOptions}
                            value={activityOptions.find(option => option.value === values.activityType)}
                            onChange={option => setFieldValue("activityType", option.value)}
                            placeholder="Select training"
                            styles={customStyles}
                        />
                    </div>
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
            )
            }
        </Formik >
    );
};
