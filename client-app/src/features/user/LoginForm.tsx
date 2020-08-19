import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/user";

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;

  const handleLoginFormSubmit = (values: IUserFormValues) => {
    console.log(values);
    login(values);
  };

  return (
    <FinalForm
      onSubmit={handleLoginFormSubmit}
      render={({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
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
          <Button positive content="Login" />
        </Form>
      )}
    />
  );
};

export default observer(LoginForm);
