import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/user";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";

const validate = combineValidators({
  email: isRequired("email"),
  password: isRequired("password"),
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;

  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as="h2" content="Login Reactivities" textAlign="center" />
          <Field
            placeholder="Email"
            component={TextInput}
            name="email"
            type="email"
          />
          <Field
            placeholder="Password"
            component={TextInput}
            name="password"
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text="Invalid username or password"
            />
          )}

          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            positive
            content="Login"
            fluid
          />
        </Form>
      )}
    />
  );
};

export default observer(LoginForm);
