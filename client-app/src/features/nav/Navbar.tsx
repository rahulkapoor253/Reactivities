import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";

const Navbar = () => {
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
          <Button content="Create activity" color="green" />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default Navbar;
