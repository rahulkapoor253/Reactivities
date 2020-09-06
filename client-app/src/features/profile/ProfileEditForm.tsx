import React from "react";
import { observer } from "mobx-react-lite";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { combineValidators, isRequired } from "revalidate";
import { IProfile } from "../../app/models/Profile";
import TextAreaInput from "../../app/common/form/TextAreaInput";

const validate = combineValidators({
  displayName: isRequired("displayName"),
});

interface IProps {
  profile: IProfile;
  updateProfile: (profile: IProfile) => void;
}

const ProfileEditForm: React.FC<IProps> = ({ profile, updateProfile }) => {
  return (
    <FinalForm
      validate={validate}
      onSubmit={updateProfile}
      initialValues={profile}
      render={({ handleSubmit, submitting, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            placeholder="Display Name"
            value={profile.displayName}
            component={TextInput}
            name="displayName"
            type="text"
          />
          <Field
            placeholder="Bio"
            component={TextAreaInput}
            name="bio"
            value={profile.bio}
          />
          <Button
            disabled={invalid || pristine}
            loading={submitting}
            positive
            content="Save changes"
            floated="right"
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileEditForm);
