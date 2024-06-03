import { Fragment } from "react";
import { CssVariables, CssReset, Menu, MenuItem } from "@dhis2/ui";
import { Outlet, useResolvedPath } from "react-router-dom";
import styles from "./styles/Root.module.css";

export const appPages = [
  { path: "/", name: "1 | Make prediction data" },
  { path: "/status", name: "2 | Upload data to CHAP" },
  { path: "/results", name: "3 | See prediction" },
  { path: "/settings", name: "Settings" },
];

const Root = () => {
  const { pathname } = useResolvedPath();

  return (
    <>
      <CssReset />
      <CssVariables spacers colors />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Menu>
            {appPages.map(({ path, name }) => (
              <Fragment key={path}>
                <MenuItem
                  label={name}
                  href={`#${path}`}
                  active={
                    pathname === path ||
                    (path !== "/" && pathname.startsWith(path))
                  }
                />
              </Fragment>
            ))}
          </Menu>
        </div>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Root;
