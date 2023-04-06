import React, { useState, useEffect, useContext, useCallback } from "react";

import Header from "./Components/Headers";
import Context from "./Context";

import BalanceTable from "./BalanceTable";

import styles from "./App.module.scss";

const App = () => {
  const { linkSuccess, balances, dispatch } = useContext(Context);

  const generateToken = useCallback(
    async () => {
      const path = "/api/create_link_token";
      const response = await fetch(path, {
        method: "POST",
      });
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();
      if (data) {
        if (data.error != null) {
          dispatch({
            type: "SET_STATE",
            state: {
              linkToken: null,
              linkTokenError: data.error,
            },
          });
          return;
        }
        dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
      }
      // Save the link_token to be used later in the Oauth flow.
      localStorage.setItem("link_token", data.link_token);
    },
    [dispatch]
  );

  useEffect(() => {
    const init = async () => {
      // do not generate a new token for OAuth redirect; instead
      // setLinkToken from localStorage
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }
      generateToken();
    };
    init();
    getData();
  }, [dispatch, generateToken]);

  const [showTable, setShowTable] = useState(false);
  const [accountData, setAccountData] = useState<any[]>([]);
  // const rows = balances.map((item) =>
  //     Row(item.keys, item.value)
  // );

  const getData = async () => {
    const response = await fetch("/api/balance", { method: "GET" });
    const responseData = await response.json();
    if (responseData.error != null) {
      return;
    }
    setShowTable(true);

    setAccountData(responseData.accounts)
  };

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <Header />
        {linkSuccess && (
          <>
            <BalanceTable showTable={showTable} accountList={accountData} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
