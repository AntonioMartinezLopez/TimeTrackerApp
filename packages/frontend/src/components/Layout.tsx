import React from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components/macro";

const headerHeight = "50px";
const footerHeight = "30px";

export const MaxWidthCSS = css`
  max-width: 70%;
  margin: auto;
`;
const Header = styled.header`
  height: ${headerHeight};
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 25px;
  background: ${(props) => props.theme.colors.backgroundColorSecond};
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
`;

const Main = styled.main`
  min-height: calc(100vh - ${headerHeight} - ${footerHeight});
  min-width: 750px;
  position: relative;
  padding: 10px 25px;
  ${MaxWidthCSS}
`;

const Footer = styled.footer`
  height: ${footerHeight};
  padding: 0 25px;
  text-align: center;
  font-size: 0.8rem;
  ${MaxWidthCSS};
`;

const NavigationList = styled.ul`
  list-style: none;
`;
const NavigationItem = styled(Link)`
  color: ${(props) => props.theme.colors.fontColor};
  font-size: 1.25rem;
  text-decoration: none;
`;

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header>
        <div
          css={`
            font-size: 25px;
            letter-spacing: 2.3px;
            flex: 1;
          `}
        >
          <span
            >
            Time-Tracker 2020
          </span>
          
        </div>
        <NavigationList>
            <NavigationItem to="/overview">Home</NavigationItem>
        </NavigationList>
      </Header>
      <Main>{children}</Main>
      <Footer>© 2020 Time-Track App by 760212</Footer>
    </>
  );
};
