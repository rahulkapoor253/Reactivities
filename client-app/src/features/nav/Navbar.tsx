import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";

interface IProps {
  createForm: () => void;
}

const Navbar: React.FC<IProps> = ({ createForm }) => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          <img
            src="/assets/logo.png"
            alt="home logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button
            content="Create activity"
            color="green"
            onClick={createForm}
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default Navbar;
